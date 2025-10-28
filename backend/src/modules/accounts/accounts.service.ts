import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('FIRESTORE') private readonly db: admin.firestore.Firestore,
  ) {}

  async checkAccount(
    accountNumber: string,
    bankCode?: string,
    businessName?: string,
  ) {
    this.logger.log(`Checking account: ${accountNumber.slice(0, 4)}****`);

    // Hash account number for privacy
    const accountHash = this.hashAccountNumber(accountNumber);

    try {
      // 1. Check if account exists in database (with recent check)
      const accountDoc = await this.db
        .collection('accounts')
        .doc(accountHash)
        .get();

      let accountData: any;
      const shouldRefresh =
        !accountDoc.exists ||
        Date.now() - accountDoc.data()?.checks?.last_checked?.toMillis() >
          7 * 24 * 60 * 60 * 1000; // 7 days

      if (accountDoc.exists && !shouldRefresh) {
        // Use cached data
        accountData = accountDoc.data();
        this.logger.log('Using cached account data');
      } else {
        // 2. Call AI service for reputation check
        const aiServiceUrl = this.configService.get('aiService.url');
        this.logger.log(`Calling AI service: ${aiServiceUrl}/api/check-account`);

        const response = await fetch(`${aiServiceUrl}/api/check-account`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account_hash: accountHash,
            bank_code: bankCode,
            business_name: businessName,
          }),
        });

        if (!response.ok) {
          throw new Error(`AI service error: ${response.statusText}`);
        }

        const aiResult = await response.json();

        // 3. Check if linked to verified business
        let verifiedBusiness = null;
        if (aiResult.verified_business_id) {
          const businessDoc = await this.db
            .collection('businesses')
            .doc(aiResult.verified_business_id)
            .get();

          if (businessDoc.exists) {
            const businessData = businessDoc.data();
            verifiedBusiness = {
              business_id: businessDoc.id,
              name: businessData.business_name,
              verified: businessData.verification_status === 'approved',
              trust_score: businessData.trust_score || 0,
              verification_date: businessData.verification_date,
            };
          }
        }

        // 4. Store result
        accountData = {
          account_id: accountHash,
          account_hash: accountHash,
          bank_code: bankCode || null,
          trust_score: aiResult.trust_score,
          risk_level: aiResult.risk_level,
          checks: {
            last_checked: admin.firestore.FieldValue.serverTimestamp(),
            check_count: accountDoc.exists
              ? accountDoc.data().checks?.check_count + 1
              : 1,
            fraud_reports: aiResult.fraud_reports,
            verified_business_id: aiResult.verified_business_id || null,
            flags: aiResult.flags || [],
          },
          verified_business: verifiedBusiness,
        };

        await this.db.collection('accounts').doc(accountHash).set(accountData);
      }

      // Update check count and timestamp
      await this.db
        .collection('accounts')
        .doc(accountHash)
        .update({
          'checks.last_checked': admin.firestore.FieldValue.serverTimestamp(),
          'checks.check_count': admin.firestore.FieldValue.increment(1),
        });

      return {
        success: true,
        data: accountData,
      };
    } catch (error) {
      this.logger.error(`Account check failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async reportFraud(
    accountNumber: string,
    businessName: string | undefined,
    category: string,
    description: string,
    reporterId?: string,
  ) {
    this.logger.log(`Fraud report for account: ${accountNumber.slice(0, 4)}****`);

    const accountHash = this.hashAccountNumber(accountNumber);

    try {
      // 1. Create fraud report document
      const reportData: any = {
        account_hash: accountHash,
        account_number_partial: `${accountNumber.slice(0, 3)}***${accountNumber.slice(-2)}`,
        business_name: businessName || null,
        category,
        description,
        reporter_id: reporterId || 'anonymous',
        reported_at: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        severity: this.calculateSeverity(category, description),
        verified: false,
      };

      const reportRef = await this.db.collection('fraud_reports').add(reportData);

      // 2. Update account fraud counter
      const accountRef = this.db.collection('accounts').doc(accountHash);
      const accountDoc = await accountRef.get();

      const fraudReports = {
        total: accountDoc.exists ? (accountDoc.data()?.checks?.fraud_reports?.total || 0) + 1 : 1,
        recent_30_days: accountDoc.exists ? (accountDoc.data()?.checks?.fraud_reports?.recent_30_days || 0) + 1 : 1,
      };

      // 3. Update or create account with fraud data
      if (accountDoc.exists) {
        const currentScore = accountDoc.data()?.trust_score || 50;
        const newScore = Math.max(0, currentScore - 15); // Reduce score by 15 for each report

        await accountRef.update({
          trust_score: newScore,
          risk_level: this.calculateRiskLevel(fraudReports.total, newScore),
          'checks.fraud_reports': fraudReports,
          'checks.flags': admin.firestore.FieldValue.arrayUnion(`Fraud report: ${category}`),
          'checks.last_updated': admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await accountRef.set({
          account_id: accountHash,
          account_hash: accountHash,
          trust_score: 30,
          risk_level: 'high',
          checks: {
            fraud_reports: fraudReports,
            flags: [`Fraud report: ${category}`],
            last_checked: admin.firestore.FieldValue.serverTimestamp(),
            check_count: 0,
          },
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      this.logger.log(`✅ Fraud report created: ${reportRef.id}`);

      return {
        success: true,
        message: 'Thank you for reporting. This helps protect the community.',
        report_id: reportRef.id,
      };
    } catch (error) {
      this.logger.error(`❌ Fraud report failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFraudReports(accountNumber: string) {
    this.logger.log(`Fetching fraud reports for account: ${accountNumber.slice(0, 4)}****`);

    const accountHash = this.hashAccountNumber(accountNumber);

    try {
      // 1. Get account fraud summary
      const accountDoc = await this.db.collection('accounts').doc(accountHash).get();

      if (!accountDoc.exists) {
        return {
          success: true,
          data: {
            total: 0,
            recent_30_days: 0,
            categories: [],
            patterns: [],
            reports: [],
          },
        };
      }

      const accountData = accountDoc.data();
      const fraudReports = accountData?.checks?.fraud_reports || { total: 0, recent_30_days: 0 };

      // 2. Get detailed fraud reports (anonymized)
      const reportsSnapshot = await this.db
        .collection('fraud_reports')
        .where('account_hash', '==', accountHash)
        .orderBy('reported_at', 'desc')
        .limit(20)
        .get();

      const reports = [];
      const categoryCount = {};
      const patterns = new Set();

      reportsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        
        // Count categories
        if (data.category) {
          categoryCount[data.category] = (categoryCount[data.category] || 0) + 1;
        }

        // Extract patterns
        if (data.description) {
          patterns.add(this.extractPattern(data.description));
        }

        // Anonymized report details
        reports.push({
          id: doc.id,
          category: data.category,
          severity: data.severity,
          pattern: this.extractPattern(data.description),
          reported_at: data.reported_at?.toDate() || new Date(),
          verified: data.verified || false,
        });
      });

      // 3. Format category data
      const categories = Object.entries(categoryCount).map(([type, count]) => ({
        type,
        count,
      })).sort((a, b) => (b.count as number) - (a.count as number));

      this.logger.log(`✅ Retrieved ${reports.length} fraud reports`);

      return {
        success: true,
        data: {
          total: fraudReports.total,
          recent_30_days: fraudReports.recent_30_days,
          categories,
          patterns: Array.from(patterns).filter(Boolean),
          reports: reports.slice(0, 10), // Return max 10 for privacy
        },
      };
    } catch (error) {
      this.logger.error(`❌ Get fraud reports failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calculateSeverity(category: string, description: string): 'low' | 'medium' | 'high' {
    const highRiskCategories = ['account takeover', 'identity theft', 'large financial loss'];
    const highRiskKeywords = ['scam', 'stole', 'never received', 'blocked me', 'fake'];
    
    const categoryLower = category.toLowerCase();
    const descriptionLower = description.toLowerCase();

    if (highRiskCategories.some(cat => categoryLower.includes(cat))) {
      return 'high';
    }

    if (highRiskKeywords.some(keyword => descriptionLower.includes(keyword))) {
      return 'high';
    }

    if (descriptionLower.length > 200) {
      return 'medium';
    }

    return 'medium';
  }

  private calculateRiskLevel(fraudCount: number, trustScore: number): 'low' | 'medium' | 'high' {
    if (fraudCount >= 5 || trustScore < 30) return 'high';
    if (fraudCount >= 2 || trustScore < 60) return 'medium';
    return 'low';
  }

  private extractPattern(description: string): string {
    const patterns = {
      'never received': 'Non-delivery of goods/services',
      'fake product': 'Counterfeit items',
      'blocked me': 'Communication cutoff after payment',
      'different account': 'Account switching scam',
      'never refund': 'Refund refusal',
    };

    const descriptionLower = description.toLowerCase();
    for (const [keyword, pattern] of Object.entries(patterns)) {
      if (descriptionLower.includes(keyword)) {
        return pattern;
      }
    }

    return 'General fraudulent activity';
  }

  async getAccount(accountId: string) {
    const doc = await this.db.collection('accounts').doc(accountId).get();

    if (!doc.exists) {
      throw new Error('Account not found');
    }

    return {
      success: true,
      data: doc.data(),
    };
  }

  async resolveAccount(accountNumber: string, bankCode: string) {
    this.logger.log(`Resolving account: ${accountNumber.slice(0, 4)}**** for bank: ${bankCode}`);

    const paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    try {
      const response = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        this.logger.error(`Paystack resolution failed: ${data.message}`);
        return {
          success: false,
          error: data.message || 'Failed to resolve account',
        };
      }

      this.logger.log(`Account resolved successfully: ${data.data.account_name}`);

      return {
        success: true,
        data: {
          account_number: data.data.account_number,
          account_name: data.data.account_name,
          bank_id: data.data.bank_id,
        },
      };
    } catch (error) {
      this.logger.error(`Account resolution error: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Failed to resolve account. Please verify the account number and bank code.',
      };
    }
  }

  private hashAccountNumber(accountNumber: string): string {
    return crypto.createHash('sha256').update(accountNumber).digest('hex');
  }
}
