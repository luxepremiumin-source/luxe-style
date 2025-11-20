import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminStorageRecovery() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const allowedEmails = new Set<string>(["luxe.premium.in@gmail.com"]);
  const isAuthorized =
    !!isAuthenticated &&
    !!user &&
    (((user.role as string | undefined) === "admin") ||
      (user.email ? allowedEmails.has(user.email) : false));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isAuthorized) {
      toast("You are not authorized to access this page.");
      navigate("/");
    }
  }, [isAuthenticated, isAuthorized, navigate]);

  const storageData = useQuery(api.storageUtils.listAllStorageFiles);
  const [selectedTab, setSelectedTab] = useState<"orphaned" | "active">("orphaned");

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            ← Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Storage Recovery</h1>
          <p className="text-gray-600 mt-2">
            View and recover images from deleted products
          </p>
        </div>

        {storageData && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Summary</CardTitle>
                <CardDescription>Overview of your Convex storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{storageData.total}</p>
                    <p className="text-sm text-gray-600">Total Files</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{storageData.active}</p>
                    <p className="text-sm text-gray-600">Active (In Use)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{storageData.orphaned}</p>
                    <p className="text-sm text-gray-600">Orphaned (Deleted Products)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mb-4 flex gap-2">
          <Button
            variant={selectedTab === "orphaned" ? "default" : "outline"}
            onClick={() => setSelectedTab("orphaned")}
          >
            Orphaned Images ({storageData?.orphaned || 0})
          </Button>
          <Button
            variant={selectedTab === "active" ? "default" : "outline"}
            onClick={() => setSelectedTab("active")}
          >
            Active Images ({storageData?.active || 0})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageData && (selectedTab === "orphaned" ? storageData.orphanedFiles : storageData.activeFiles).map((file) => (
            <Card key={file.storageId} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {file.url && file.contentType?.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt="Storage file"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <p>No preview</p>
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2"
                  variant={file.isUsed ? "default" : "secondary"}
                >
                  {file.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-2">
                  Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
                <p className="text-xs text-gray-500 mb-3 break-all">
                  Type: {file.contentType || "unknown"}
                </p>
                {file.url && (
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(file.url!);
                        toast("URL copied to clipboard!");
                      }}
                    >
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(file.url!, "_blank")}
                    >
                      Open in New Tab
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {storageData && (selectedTab === "orphaned" ? storageData.orphanedFiles : storageData.activeFiles).length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                {selectedTab === "orphaned" 
                  ? "No orphaned images found. All images are currently in use by products."
                  : "No active images found."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
