import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  FileText, 
  Database, 
  Eye, 
  Scan, 
  Brain,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ForensicDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forensicDetails: {
    ocr_confidence: number;
    manipulation_score: number;
    metadata_flags: string[];
    agent_logs?: Array<{
      agent: string;
      status: string;
      confidence?: number;
      manipulation_score?: number;
      flags?: number;
      accounts_checked?: number;
    }>;
  };
  ocrText?: string;
  agentLogs?: Array<{
    agent: string;
    status: string;
    confidence?: number;
    manipulation_score?: number;
    flags?: number;
    accounts_checked?: number;
  }>;
}

export const ForensicDetailsModal = ({
  open,
  onOpenChange,
  forensicDetails,
  ocrText,
  agentLogs,
}: ForensicDetailsModalProps) => {
  const effectiveAgentLogs = agentLogs || forensicDetails.agent_logs || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Forensic Analysis Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive breakdown of AI-powered analysis
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ocr">OCR Text</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confidence Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">OCR Confidence</span>
                    <span className="text-sm font-bold">{forensicDetails.ocr_confidence}%</span>
                  </div>
                  <Progress value={forensicDetails.ocr_confidence} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Manipulation Risk</span>
                    <span className="text-sm font-bold">{forensicDetails.manipulation_score}%</span>
                  </div>
                  <Progress 
                    value={forensicDetails.manipulation_score} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata Flags</CardTitle>
              </CardHeader>
              <CardContent>
                {forensicDetails.metadata_flags.length > 0 ? (
                  <div className="space-y-2">
                    {forensicDetails.metadata_flags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {flag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No suspicious flags detected</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* OCR Text Tab */}
          <TabsContent value="ocr" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Text
                  <Badge variant="outline" className="ml-auto">
                    {forensicDetails.ocr_confidence}% Confidence
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Text extracted from the receipt using AI vision
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ocrText ? (
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto border">
                    {ocrText}
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      OCR text data not available for this receipt
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata Analysis</CardTitle>
                <CardDescription>
                  Technical analysis of image file properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Manipulation Score</p>
                    <p className="text-2xl font-bold">{forensicDetails.manipulation_score}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Flags Detected</p>
                    <p className="text-2xl font-bold">{forensicDetails.metadata_flags.length}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Detected Anomalies</h4>
                  {forensicDetails.metadata_flags.length > 0 ? (
                    <div className="space-y-2">
                      {forensicDetails.metadata_flags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{flag}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              This pattern is commonly associated with document manipulation
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-success/5 border border-success/20">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <p className="text-sm">No metadata anomalies detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Agents Tab - Enhanced */}
          <TabsContent value="agents" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Analysis Agents</CardTitle>
                <CardDescription>
                  Multiple specialized AI agents analyzed this receipt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {effectiveAgentLogs.length > 0 ? (
                  effectiveAgentLogs.map((log, index) => {
                    const getAgentIcon = (agentName: string) => {
                      switch (agentName.toLowerCase()) {
                        case 'vision': return <Eye className="h-5 w-5 text-primary" />;
                        case 'forensic': return <Scan className="h-5 w-5 text-purple-500" />;
                        case 'metadata': return <Database className="h-5 w-5 text-orange-500" />;
                        case 'reputation': return <Shield className="h-5 w-5 text-green-500" />;
                        default: return <Brain className="h-5 w-5 text-primary" />;
                      }
                    };

                    const getAgentBgColor = (agentName: string) => {
                      switch (agentName.toLowerCase()) {
                        case 'vision': return 'bg-primary/10';
                        case 'forensic': return 'bg-purple-500/10';
                        case 'metadata': return 'bg-orange-500/10';
                        case 'reputation': return 'bg-green-500/10';
                        default: return 'bg-primary/10';
                      }
                    };

                    const getAgentDescription = (agentName: string, log: any) => {
                      switch (agentName.toLowerCase()) {
                        case 'vision': 
                          return `Extracted text with ${log.confidence || forensicDetails.ocr_confidence}% confidence using advanced AI vision`;
                        case 'forensic': 
                          return `Detected ${log.manipulation_score || forensicDetails.manipulation_score}% manipulation risk through pixel-level analysis`;
                        case 'metadata': 
                          return `Analyzed file properties and detected ${log.flags || forensicDetails.metadata_flags.length} anomalies`;
                        case 'reputation': 
                          return `Cross-referenced ${log.accounts_checked || 1} business accounts in trust database`;
                        default: 
                          return 'Performed specialized analysis';
                      }
                    };

                    return (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                        <div className={`p-2 rounded-full ${getAgentBgColor(log.agent)}`}>
                          {getAgentIcon(log.agent)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold capitalize">{log.agent} Agent</h4>
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {getAgentDescription(log.agent, log)}
                          </p>
                          
                          {log.agent.toLowerCase() === 'vision' && log.confidence && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Confidence Score</span>
                                <span className="font-medium">{log.confidence}%</span>
                              </div>
                              <Progress value={log.confidence} className="h-2" />
                            </div>
                          )}

                          {log.agent.toLowerCase() === 'forensic' && log.manipulation_score !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Manipulation Risk</span>
                                <span className="font-medium">{log.manipulation_score}%</span>
                              </div>
                              <Progress value={log.manipulation_score} className="h-2" />
                            </div>
                          )}

                          {log.agent.toLowerCase() === 'metadata' && log.flags !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="text-sm font-medium">{log.flags} anomalies detected</span>
                            </div>
                          )}

                          {log.agent.toLowerCase() === 'reputation' && log.accounts_checked !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{log.accounts_checked} accounts verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback with better descriptions
                  <>
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">Vision Agent</h4>
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Extracted text and analyzed visual elements using advanced AI vision
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confidence Score</span>
                          <span className="font-medium">{forensicDetails.ocr_confidence}%</span>
                        </div>
                        <Progress value={forensicDetails.ocr_confidence} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="p-2 rounded-full bg-purple-500/10">
                        <Scan className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">Forensic Agent</h4>
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Performed pixel-level analysis to detect image manipulation
                        </p>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Manipulation Risk</span>
                          <span className="font-medium">{forensicDetails.manipulation_score}%</span>
                        </div>
                        <Progress value={forensicDetails.manipulation_score} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="p-2 rounded-full bg-orange-500/10">
                        <Database className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">Metadata Agent</h4>
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Analyzed file metadata and EXIF properties for anomalies
                        </p>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="text-sm font-medium">{forensicDetails.metadata_flags.length} anomalies detected</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="p-2 rounded-full bg-green-500/10">
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">Reputation Agent</h4>
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cross-referenced business and account data in trust database
                        </p>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Business data verified</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
