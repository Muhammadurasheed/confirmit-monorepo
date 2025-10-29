import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { PaymentPending } from "@/components/features/payment/PaymentPending";
import { PaymentSuccess } from "@/components/features/payment/PaymentSuccess";
import { usePaymentStore } from "@/store/paymentStore";
import { paymentService } from "@/services/payment";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [paymentData, setPaymentData] = useState<any>(null);
  
  const { businessId, tier, setPaymentStatus } = usePaymentStore();
  
  // Extract payment reference from URL
  const paystackReference = searchParams.get('reference') || searchParams.get('trxref');
  const nowpaymentsInvoiceId = searchParams.get('invoice_id') || searchParams.get('payment_id');
  const paymentStatus = searchParams.get('payment_status'); // NOWPayments sends this

  useEffect(() => {
    const verifyPayment = async () => {
      // Determine payment method and reference
      const paymentMethod = paystackReference ? 'paystack' : 'nowpayments';
      const reference = paystackReference || nowpaymentsInvoiceId;
      
      if (!reference) {
        toast.error("No payment reference found");
        setVerificationStatus('failed');
        setTimeout(() => navigate('/business/register'), 2000);
        return;
      }

      if (!businessId) {
        toast.error("Business information missing");
        setVerificationStatus('failed');
        setTimeout(() => navigate('/business/register'), 2000);
        return;
      }

      setPaymentStatus('confirming');

      try {
        // For NOWPayments, if status is not 'finished', start polling
        if (paymentMethod === 'nowpayments' && paymentStatus !== 'finished') {
          // Poll for payment status
          let attempts = 0;
          const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5 seconds)
          
          const pollStatus = async () => {
            try {
              const statusResponse = await paymentService.getPaymentStatus(businessId);
              
              if (statusResponse.status === 'completed' || statusResponse.status === 'finished') {
                // Verify the payment
                const verifyResponse = await paymentService.verifyPayment({
                  businessId,
                  paymentMethod,
                  reference,
                });
                
                if (verifyResponse.success) {
                  setPaymentData(verifyResponse.payment);
                  setVerificationStatus('success');
                  setPaymentStatus('success');
                  toast.success("Crypto payment confirmed on blockchain!");
                  
                  setTimeout(() => {
                    navigate(`/business/dashboard/${businessId}`);
                  }, 5000);
                }
                return true;
              } else if (statusResponse.status === 'failed' || statusResponse.status === 'expired') {
                throw new Error("Payment failed or expired");
              }
              
              // Continue polling
              attempts++;
              if (attempts < maxAttempts) {
                setTimeout(pollStatus, 5000);
              } else {
                throw new Error("Payment confirmation timeout. Please contact support.");
              }
            } catch (error) {
              console.error("Polling error:", error);
              throw error;
            }
          };
          
          await pollStatus();
        } else {
          // Direct verification for Paystack or completed NOWPayments
          const response = await paymentService.verifyPayment({
            businessId,
            paymentMethod,
            reference,
          });

          if (response.success) {
            setPaymentData(response.payment);
            setVerificationStatus('success');
            setPaymentStatus('success');
            toast.success("Payment verified successfully!");
            
            setTimeout(() => {
              navigate(`/business/dashboard/${businessId}`);
            }, 5000);
          } else {
            throw new Error(response.message || "Payment verification failed");
          }
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error(error instanceof Error ? error.message : "Payment verification failed");
        setVerificationStatus('failed');
        setPaymentStatus('failed');
        
        setTimeout(() => {
          navigate(`/payment?businessId=${businessId}&tier=${tier}`);
        }, 3000);
      }
    };

    verifyPayment();
  }, [paystackReference, nowpaymentsInvoiceId, paymentStatus, businessId, tier, setPaymentStatus, navigate]);

  const getDisplayAmount = () => {
    if (!paymentData) return '';
    
    if (paymentData.currency === 'NGN') {
      return `₦${paymentData.amount?.toLocaleString()}`;
    } else {
      return `${paymentData.pay_amount || paymentData.amount} ${paymentData.pay_currency?.toUpperCase() || paymentData.currency}`;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />
      <main className="flex-1 py-12">
        <Container className="max-w-2xl">
          {verificationStatus === 'verifying' && (
            <PaymentPending
              paymentMethod={paystackReference ? 'Paystack' : 'Crypto'}
              status="confirming"
              message="Please wait while we confirm your payment..."
            />
          )}

          {verificationStatus === 'success' && paymentData && (
            <PaymentSuccess
              amount={getDisplayAmount()}
              reference={paystackReference || nowpaymentsInvoiceId || ''}
              paymentMethod={paystackReference ? 'Paystack' : 'Crypto'}
              businessId={businessId || ''}
              transactionHash={paymentData.txn_id || paymentData.transaction}
              explorerUrl={
                paymentData.txn_id
                  ? `https://hashscan.io/testnet/transaction/${paymentData.txn_id}`
                  : undefined
              }
            />
          )}

          {verificationStatus === 'failed' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-destructive mb-4">Payment Verification Failed</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't verify your payment. You'll be redirected to try again.
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCallback;
