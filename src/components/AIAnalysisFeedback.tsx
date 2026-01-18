import { Button } from "@/components/ui/button";

interface AIAnalysisFeedbackProps {
  status: "idle" | "analyzing" | "found" | "not_found" | "error";
  similarProducts: any[];
  error: string | null;
  onEditProduct: (product: any) => void;
}

export function AIAnalysisFeedback({ status, similarProducts, error, onEditProduct }: AIAnalysisFeedbackProps) {
  if (status === "idle") return null;

  return (
    <div className={`mt-2 p-3 rounded-md text-sm border ${
      status === "analyzing" ? "bg-blue-50 border-blue-200 text-blue-700" :
      status === "found" ? "bg-yellow-50 border-yellow-200 text-yellow-800" :
      status === "not_found" ? "bg-green-50 border-green-200 text-green-700" :
      "bg-red-50 border-red-200 text-red-700"
    }`}>
      <div className="flex items-center gap-2 font-medium mb-1">
        {status === "analyzing" && (
          <>
            <span className="animate-spin">⏳</span>
            Analyzing image for duplicates...
          </>
        )}
        {status === "found" && (
          <>
            <span>⚠️</span>
            Potential Duplicates Found
          </>
        )}
        {status === "not_found" && (
          <>
            <span>✅</span>
            No duplicates found. This looks like a new product.
          </>
        )}
        {status === "error" && (
          <>
            <span>❌</span>
            {error || "Analysis failed. Please check API key."}
          </>
        )}
      </div>
      
      {status === "found" && similarProducts.length > 0 && (
        <div className="mt-2 space-y-2">
          <p className="text-xs opacity-80">Similar products already in catalog:</p>
          <div className="grid gap-2">
            {similarProducts.map((prod: any) => (
              <div key={prod._id} className="flex items-center gap-2 bg-white/50 p-2 rounded border border-yellow-100">
                {prod.images && prod.images[0] && (
                  <img src={prod.images[0]} className="w-8 h-8 rounded object-cover" alt="" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{prod.name}</p>
                  <p className="text-xs opacity-75">₹{prod.price}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 text-xs"
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
