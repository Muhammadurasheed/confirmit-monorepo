import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TrustScoreGauge from "@/components/shared/TrustScoreGauge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TrustIdNftCard from "@/components/shared/TrustIdNftCard";
import { ApiKeysManagement } from "@/components/features/business/ApiKeysManagement";
import { UsageAnalytics } from "@/components/features/business/UsageAnalytics";
import { WebhookManagement } from "@/components/features/business/WebhookManagement";
import { getBusiness, getBusinessStats, generateApiKey } from "@/services/business";
import { Business, BusinessStats } from "@/types";
import {
  Eye,
  Shield,
  TrendingUp,
  Key,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  Users,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BusinessDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [businessData, statsData] = await Promise.all([
          getBusiness(id),
          getBusinessStats(id),
        ]);

        setBusiness(businessData.data);
        setStats(statsData.stats);
      } catch (error: any) {
        toast.error("Failed to load business data", {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGenerateApiKey = async () => {
    if (!id) return;

    setGeneratingKey(true);
    try {
      const response = await generateApiKey(id);
      setNewApiKey(response.api_key);
      toast.success("API Key Generated", {
        description: "Store it securely - it won't be shown again.",
      });
    } catch (error: any) {
      toast.error("Failed to generate API key", {
        description: error.message,
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyApiKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      toast.success("API key copied to clipboard");
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "under_review":
        return "bg-primary text-primary-foreground";
      case "rejected":
        return "bg-danger text-danger-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Mock analytics data - would come from backend in production
  const analyticsData = [
    { month: "Jan", views: 400, verifications: 240 },
    { month: "Feb", views: 600, verifications: 380 },
    { month: "Mar", views: 800, verifications: 520 },
    { month: "Apr", views: 1100, verifications: 680 },
    { month: "May", views: 1400, verifications: 890 },
    { month: "Jun", views: 1800, verifications: 1100 },
  ];

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

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Business Not Found</CardTitle>
              <CardDescription>
                The business you're looking for doesn't exist or you don't have access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/business">Back to Business Directory</Link>
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
      <main className="flex-1 py-8">
        <Container>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-sm">
                    {business.category}
                  </Badge>
                  <Badge
                    className={getVerificationStatusColor(business.verification.status)}
                  >
                    {getVerificationIcon(business.verification.status)}
                    <span className="ml-2 capitalize">{business.verification.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Tier {business.verification.tier}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TrustScoreGauge score={business.trustScore} size="md" />
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
              <TabsTrigger value="api">API Integration</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-3"
              >
                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.profileViews || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total profile views
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats?.verifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Successful verifications
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.successfulTransactions || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed successfully
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Trust ID NFT - Show prominently if business is verified */}
              {business.hedera?.trustIdNft && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <TrustIdNftCard
                    tokenId={business.hedera.trustIdNft.tokenId}
                    serialNumber={business.hedera.trustIdNft.serialNumber}
                    explorerUrl={business.hedera.trustIdNft.explorerUrl}
                    trustScore={business.trustScore}
                    verificationTier={business.verification?.tier || 1}
                    businessName={business.name}
                  />
                </motion.div>
              )}

              {/* Business Information */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <p className="text-sm">{business.contact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm">{business.contact.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                      <p className="text-sm">{business.contact.address}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Bank Account
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{business.bankAccount.accountName}</p>
                      {business.bankAccount.verified && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <UsageAnalytics businessId={id!} stats={{
                totalRequests: stats?.verifications || 1247,
                successRate: 98.2,
                avgResponseTime: 4.2,
                requestsThisMonth: stats?.verifications || 892,
                requestsLastMonth: 654,
              }} />
            </TabsContent>

            {/* API Integration Tab */}
            <TabsContent value="api" className="space-y-6">
              <ApiKeysManagement 
                businessId={id!}
                existingKeys={business.apiKeys}
                onGenerateKey={async () => {
                  const response = await generateApiKey(id!);
                  return response.api_key;
                }}
              />
            </TabsContent>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="space-y-6">
              <WebhookManagement businessId={id!} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>
                    Manage your business profile and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Settings panel coming soon. Contact support for any changes needed.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDashboard;
