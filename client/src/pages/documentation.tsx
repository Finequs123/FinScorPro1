import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Search, 
  Code, 
  Database, 
  Server, 
  Shield,
  Copy,
  ExternalLink,
  FileText,
  Zap,
  Users,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: documentation, isLoading } = useQuery({
    queryKey: ["/api/documentation"],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
    });
  };

  const filteredModules = documentation?.modules?.filter((module: any) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={["Admin", "Power User", "Approver"]}>
        <AppShell title="Documentation">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={["Admin", "Power User", "Approver"]}>
      <AppShell title="Documentation">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600 mt-1">
                Complete API reference and system documentation
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">v{documentation?.version}</Badge>
              <Badge variant="secondary">Updated {documentation?.lastUpdated}</Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search modules, endpoints, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="modules">API Modules</TabsTrigger>
              <TabsTrigger value="storage">CSV Storage</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            {/* System Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Server className="text-blue-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Architecture</h3>
                        <p className="text-sm font-bold text-gray-900">
                          {documentation?.systemOverview?.architecture}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Database className="text-green-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Storage</h3>
                        <p className="text-sm font-bold text-gray-900">CSV File System</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Shield className="text-purple-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">Authentication</h3>
                        <p className="text-sm font-bold text-gray-900">JWT + RBAC</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {documentation?.systemOverview?.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Modules */}
            <TabsContent value="modules" className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                {filteredModules.length} of {documentation?.modules?.length || 0} modules
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {filteredModules.map((module: any, index: number) => (
                  <AccordionItem key={index} value={`module-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {module.name === "Authentication" && <Shield className="h-4 w-4" />}
                          {module.name === "User Management" && <Users className="h-4 w-4" />}
                          {module.name === "Dashboard" && <Zap className="h-4 w-4" />}
                          {module.name === "Configuration" && <Settings className="h-4 w-4" />}
                          {!["Authentication", "User Management", "Dashboard", "Configuration"].includes(module.name) && 
                            <Code className="h-4 w-4" />}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold">{module.name}</h3>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Features */}
                      {module.features && (
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.features.map((feature: string, idx: number) => (
                              <Badge key={idx} variant="outline">{feature}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Endpoints */}
                      <div>
                        <h4 className="font-medium mb-3">API Endpoints</h4>
                        <div className="space-y-3">
                          {module.endpoints?.map((endpoint: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={endpoint.method === "GET" ? "default" : 
                                            endpoint.method === "POST" ? "destructive" : "secondary"}
                                  >
                                    {endpoint.method}
                                  </Badge>
                                  <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                                    {endpoint.path}
                                  </code>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(endpoint.path)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                              {endpoint.auth && (
                                <div className="text-xs text-blue-600">
                                  <Shield className="h-3 w-3 inline mr-1" />
                                  Auth: {endpoint.auth}
                                </div>
                              )}
                              {endpoint.parameters && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Parameters: {endpoint.parameters.join(", ")}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      {module.metrics && (
                        <div>
                          <h4 className="font-medium mb-2">Available Metrics</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.metrics.map((metric: string, idx: number) => (
                              <Badge key={idx} variant="secondary">{metric}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Settings */}
                      {module.settings && (
                        <div>
                          <h4 className="font-medium mb-2">Configuration Settings</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.settings.map((setting: string, idx: number) => (
                              <Badge key={idx} variant="outline">{setting}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* CSV Storage */}
            <TabsContent value="storage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CSV Storage System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    {documentation?.csvStorage?.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-3">Data Files</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentation?.csvStorage?.files?.map((file: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <code className="font-mono text-sm">{file.name}</code>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                          {file.fields && (
                            <div className="text-xs text-gray-500">
                              Fields: {file.fields.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {documentation?.csvStorage?.advantages && (
                    <div>
                      <h4 className="font-medium mb-2">Advantages</h4>
                      <div className="flex flex-wrap gap-2">
                        {documentation.csvStorage.advantages.map((advantage: string, idx: number) => (
                          <Badge key={idx} variant="default">{advantage}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {documentation?.csvStorage?.limitations && (
                    <div>
                      <h4 className="font-medium mb-2">Limitations</h4>
                      <div className="flex flex-wrap gap-2">
                        {documentation.csvStorage.limitations.map((limitation: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{limitation}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment */}
            <TabsContent value="deployment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Status</h4>
                      <Badge variant="default" className="mb-4">
                        {documentation?.deployment?.status}
                      </Badge>
                      
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {documentation?.deployment?.requirements?.map((req: string, idx: number) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Commands</h4>
                      <div className="space-y-2">
                        {documentation?.deployment?.commands?.map((cmd: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                              {cmd}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(cmd)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-medium mb-2 mt-4">Ports</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {documentation?.deployment?.ports?.map((port: string, idx: number) => (
                          <li key={idx}>• {port}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">Default Authentication</h4>
                    <p className="text-sm text-blue-800">
                      {documentation?.deployment?.authentication}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}