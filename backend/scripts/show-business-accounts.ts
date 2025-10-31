import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('❌ Missing Firebase credentials:');
    console.error('FIREBASE_PROJECT_ID:', projectId ? '✓' : '✗');
    console.error('FIREBASE_PRIVATE_KEY:', privateKey ? '✓' : '✗');
    console.error('FIREBASE_CLIENT_EMAIL:', clientEmail ? '✓' : '✗');
    throw new Error('Missing required Firebase environment variables');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  });
}

const db = admin.firestore();

async function showBusinessAccounts() {
  console.log('\n🔍 APPROVED BUSINESS ACCOUNT ANALYSIS\n');
  console.log('='.repeat(60));
  
  const snapshot = await db.collection('businesses')
    .where('verification.verified', '==', true)
    .get();
  
  console.log(`\n📊 Found ${snapshot.size} approved businesses\n`);
  
  // Common test account numbers to check against
  const testAccounts = [
    '0123456789', '1234567890', '9876543210', '0987654321',
    '8166600027', '2345678901', '3456789012', '4567890123',
  ];
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const accountHash = data.bank_account?.number_encrypted;
    
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📋 Business: ${data.business_name}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Tier: ${data.tier || 'N/A'}`);
    console.log(`   Location: ${data.location || 'N/A'}`);
    console.log(`   Hash: ${accountHash}`);
    
    // Check if hash matches any common test accounts
    let foundMatch = false;
    for (const testNum of testAccounts) {
      const testHash = crypto.createHash('sha256')
        .update(testNum)
        .digest('hex');
      
      if (testHash === accountHash) {
        console.log(`   ✅ MATCH FOUND: Account number is ${testNum}`);
        console.log(`   👉 Test this account in the UI!`);
        foundMatch = true;
        break;
      }
    }
    
    if (!foundMatch) {
      console.log(`   ⚠️  Account number not in common test set`);
      console.log(`   💡 Check your business registration data`);
    }
    
    // Try to find recent account checks for this business
    const accountCheckSnapshot = await db.collection('account_checks')
      .where('verified_business.business_id', '==', doc.id)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
    
    if (!accountCheckSnapshot.empty) {
      const accountData = accountCheckSnapshot.docs[0].data();
      console.log(`   📝 Previous Check: ${accountData.account_number_masked}`);
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('\n💡 TESTING RECOMMENDATIONS:\n');
  console.log('1. Try demo account: 0123456789 (TechHub Electronics)');
  console.log('2. Try any accounts marked with ✅ MATCH FOUND above');
  console.log('3. If no matches found, check Firebase Console:');
  console.log('   → Firestore → businesses → [your business] → bank_account');
  console.log('\n' + '='.repeat(60));
}

showBusinessAccounts()
  .then(() => {
    console.log('\n✅ Analysis complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
