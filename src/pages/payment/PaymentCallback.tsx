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
  const nowpaymentsId = searchParams.get('payment_id');

  useEffect(() => {
    const verifyPayment = async () => {
      // Determine payment method and reference
      const paymentMethod = paystackReference ? 'paystack' : 'nowpayments';
      const reference = paystackReference || nowpaymentsId;
      
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
        } else {
          throw new Error(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error(error instanceof Error ? error.message : "Payment verification failed");
        setVerificationStatus('failed');
        setPaymentStatus('failed');
        
        // Redirect back after failure
        setTimeout(() => {
          navigate(`/payment?businessId=${businessId}&tier=${tier}`);
        }, 3000);
      }
    };

    verifyPayment();
  }, [paystackReference, nowpaymentsId, businessId, tier, setPaymentStatus, navigate]);

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
              reference={paystackReference || nowpaymentsId || ''}
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
