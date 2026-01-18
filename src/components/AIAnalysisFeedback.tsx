import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Search, Key } from "lucide-react";

interface AIAnalysisFeedbackProps {
  status: "idle" | "analyzing" | "found" | "not_found" | "error";
  similarProducts: any[];
  error: string | null;
  onEditProduct: (product: any) => void;
}

export function AIAnalysisFeedback({ status, similarProducts, error, onEditProduct }: AIAnalysisFeedbackProps) {
  if (status === "idle") return null;

  // Check if error is related to missing keys
  const isKeyError = error?.toLowerCase().includes("key") || error?.toLowerCase().includes("api");
  // Check for quota/billing errors
  const isQuotaError = error?.toLowerCase().includes("quota") || error?.includes("429") || error?.toLowerCase().includes("billing");

  return (
    <div className={`mt-3 p-4 rounded-lg border text-sm transition-all duration-300 ${
      status === "analyzing" ? "bg-blue-50 border-blue-200 text-blue-700" :
      status === "found" ? "bg-amber-50 border-amber-200 text-amber-800" :
      status === "not_found" ? "bg-green-50 border-green-200 text-green-700" :
      "bg-red-50 border-red-200 text-red-700"
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {status === "analyzing" && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === "found" && <Search className="h-5 w-5" />}
          {status === "not_found" && <CheckCircle2 className="h-5 w-5" />}
          {status === "error" && (isKeyError || isQuotaError ? <Key className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />)}
        </div>
        
        <div className="flex-1 space-y-1">
          <p className="font-semibold">
            {status === "analyzing" && "Analyzing Product Image..."}
            {status === "found" && "Potential Duplicates Found"}
            {status === "not_found" && "No Duplicates Found"}
            {status === "error" && (isQuotaError ? "OpenAI Billing Issue" : isKeyError ? "Setup Required" : "Analysis Failed")}
          </p>
          
          <p className="opacity-90">
            {status === "analyzing" && "Identifying product details and checking catalog..."}
            {status === "found" && "We found similar products in your inventory."}
            {status === "not_found" && "This appears to be a new product."}
            {status === "error" && (isQuotaError ? "Your OpenAI account has run out of credits (Error 429)." : error)}
          </p>

          {status === "error" && isQuotaError && (
            <div className="mt-2 bg-white/50 p-3 rounded border border-red-100 text-xs">
              <strong>How to fix (Insufficient Quota):</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1.5">
                <li>
                  Go to <a href="https://platform.openai.com/settings/organization/billing/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">OpenAI Billing Settings</a>
                </li>
                <li>Add a payment method or purchase credits (minimum $5).</li>
                <li>Wait a few minutes for the credits to activate.</li>
                <li>Try pasting the image again.</li>
              </ol>
            </div>
          )}

          {status === "error" && isKeyError && !isQuotaError && (
            <div className="mt-2 bg-white/50 p-3 rounded border border-red-100 text-xs">
              <strong>How to fix:</strong>
              <ol className="list-decimal ml-4 mt-2 space-y-1.5">
                <li>
                  Get a key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">platform.openai.com</a>
                </li>
                <li>Go to the <strong>Integrations</strong> tab in the top bar of this window.</li>
                <li>Click on <strong>OpenAI</strong>.</li>
                <li>Paste your key into <strong>OPENAI_API_KEY</strong> and Save.</li>
                <li>Try pasting the image again.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
      
      {status === "found" && similarProducts.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-amber-200/50 pt-2">
          <p className="text-xs font-medium uppercase tracking-wider opacity-70">Similar Products</p>
          <div className="grid gap-2">
            {similarProducts.map((prod: any) => (
              <div key={prod._id} className="flex items-center gap-3 bg-white p-2 rounded border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                {prod.images && prod.images[0] ? (
                  <img src={prod.images[0]} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs">No Img</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900">{prod.name}</p>
                  <p className="text-xs text-gray-500">₹{prod.price}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs"
                  onClick={() => onEditProduct(prod)}
                  type="button"
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}