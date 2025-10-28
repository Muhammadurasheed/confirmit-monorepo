import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paymentService } from "@/services/payment";
import { usePaymentStore } from "@/store/paymentStore";

const ManualPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPolling, setIsPolling] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'expired'>('pending');
  
  const businessId = searchParams.get('businessId');
  const address = searchParams.get('address');
  const amount = searchParams.get('amount');
  
  const { businessName, tier } = usePaymentStore();

  useEffect(() => {
    if (!businessId || !address || !amount) {
      toast.error("Invalid payment information");
      navigate('/business/register');
      return;
    }

    // Poll for payment confirmation every 10 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await paymentService.getPaymentStatus(businessId);
        
        if (response.status === 'confirmed') {
          setPaymentStatus('completed');
          setIsPolling(false);
          clearInterval(pollInterval);
          
          toast.success("Payment confirmed!");
          setTimeout(() => {
            navigate(`/business/dashboard/${businessId}`);
          }, 3000);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 10000);

    // Stop polling after 30 minutes
    const timeout = setTimeout(() => {
      setIsPolling(false);
      setPaymentStatus('expired');
      clearInterval(pollInterval);
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [businessId, address, amount, navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const openHashScan = () => {
    window.open(`https://hashscan.io/testnet/account/${address}`, '_blank');
  };

  if (!businessId || !address || !amount) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />
      <main className="flex-1 py-12">
        <Container className="max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-3">Complete Your Payment</h1>
            <p className="text-xl text-muted-foreground">
              {businessName || 'Business'} - Tier {tier} Verification
            </p>
          </motion.div>

          {/* Payment Instructions Card */}
          <Card className="shadow-elegant mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Send USDT on Hedera Network</CardTitle>
                  <CardDescription>
                    Use HashPack, Blade, or any Hedera wallet
                  </CardDescription>
                </div>
                {isPolling && paymentStatus === 'pending' && (
                  <Badge variant="outline" className="animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Waiting for payment
                  </Badge>
                )}
                {paymentStatus === 'completed' && (
                  <Badge className="bg-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Payment Confirmed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount */}
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Amount to Send</p>
                <p className="text-4xl font-bold text-primary">{amount} USDT</p>
                <p className="text-sm text-muted-foreground mt-2">on Hedera Network</p>
              </div>

              {/* Payment Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-4 bg-muted rounded-lg font-mono text-sm break-all">
                    {address}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(address, 'Address')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Send <strong>exactly {amount} USDT</strong> to the address above.
                  The payment will be automatically detected within 3-5 minutes after confirmation on the Hedera network.
                </AlertDescription>
              </Alert>

              {/* Steps */}
              <div className="space-y-3">
                <p className="font-semibold">How to send:</p>
                <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>1. Open your Hedera wallet (HashPack, Blade, etc.)</li>
                  <li>2. Select "Send" and choose USDT token</li>
                  <li>3. Copy the payment address above</li>
                  <li>4. Enter the exact amount: {amount} USDT</li>
                  <li>5. Confirm and send the transaction</li>
                  <li>6. Wait for confirmation (usually 3-5 minutes)</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={openHashScan}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on HashScan
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyToClipboard(address, 'Address')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
              </div>

              {/* Status Messages */}
              {paymentStatus === 'expired' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This payment session has expired. Please start a new payment.
                  </AlertDescription>
                </Alert>
              )}

              {paymentStatus === 'completed' && (
                <Alert className="border-success bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    Payment confirmed! Redirecting to your dashboard...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-muted">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Need help?</strong> If you've sent the payment but it's not being detected,
                please wait up to 10 minutes for blockchain confirmation. Still having issues?
                Contact support with your transaction ID.
              </p>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ManualPayment;
