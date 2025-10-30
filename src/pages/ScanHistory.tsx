import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { FileText, Calendar, AlertCircle, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import TrustScoreGauge from "@/components/shared/TrustScoreGauge";
import { format } from "date-fns";

interface ReceiptHistory {
  id: string;
  receipt_id: string;
  user_id: string;
  storage_path: string;
  trust_score: number;
  verdict: "authentic" | "suspicious" | "fraudulent" | "unclear";
  created_at: any;
  merchant_name?: string;
}

const ScanHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<ReceiptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "authentic" | "suspicious" | "fraudulent">("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // For authenticated users, fetch from Firestore
        if (user) {
          const receiptsRef = collection(db, "receipts");
          const q = query(
            receiptsRef,
            where("user_id", "==", user.uid),
            orderBy("created_at", "desc"),
            limit(50)
          );

          const querySnapshot = await getDocs(q);
          const fetchedReceipts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ReceiptHistory[];

          setReceipts(fetchedReceipts);
        } else {
          // For anonymous users, fetch from localStorage
          const localHistory = localStorage.getItem("receipt_history");
          if (localHistory) {
            setReceipts(JSON.parse(localHistory));
          }
        }
      } catch (error: any) {
        console.error("Error fetching scan history:", error);
        toast.error("Failed to load scan history", {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "authentic":
        return "bg-success text-success-foreground";
      case "suspicious":
        return "bg-warning text-warning-foreground";
      case "fraudulent":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "authentic":
        return <CheckCircle2 className="h-4 w-4" />;
      case "suspicious":
        return <AlertTriangle className="h-4 w-4" />;
      case "fraudulent":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredReceipts = filter === "all" 
    ? receipts 
    : receipts.filter(r => r.verdict === filter);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">No Scan History</CardTitle>
              <CardDescription className="text-base mt-2">
                You haven't scanned any receipts yet. Start verifying receipts to build your scan history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/quick-scan">Scan Your First Receipt</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Scan History</h1>
            <p className="text-muted-foreground">
              View all your previously scanned receipts ({receipts.length} total)
            </p>
          </motion.div>

          <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({receipts.length})</TabsTrigger>
              <TabsTrigger value="authentic">
                Authentic ({receipts.filter(r => r.verdict === "authentic").length})
              </TabsTrigger>
              <TabsTrigger value="suspicious">
                Suspicious ({receipts.filter(r => r.verdict === "suspicious").length})
              </TabsTrigger>
              <TabsTrigger value="fraudulent">
                Fraudulent ({receipts.filter(r => r.verdict === "fraudulent").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReceipts.map((receipt) => (
                  <motion.div
                    key={receipt.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all h-full"
                      onClick={() => navigate(`/quick-scan?receipt=${receipt.receipt_id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-3">
                          <img
                            src={receipt.storage_path}
                            alt="Receipt"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <TrustScoreGauge score={receipt.trust_score} size="sm" />
                          <Badge className={getVerdictColor(receipt.verdict)}>
                            {getVerdictIcon(receipt.verdict)}
                            <span className="ml-1 capitalize">{receipt.verdict}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {receipt.merchant_name && (
                          <p className="text-sm font-medium mb-2">
                            {receipt.merchant_name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {receipt.created_at?.toDate ? 
                            format(receipt.created_at.toDate(), "MMM dd, yyyy 'at' HH:mm") :
                            format(new Date(receipt.created_at), "MMM dd, yyyy 'at' HH:mm")
                          }
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          View Full Report
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ScanHistory;
