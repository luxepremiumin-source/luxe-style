import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ALL_CATEGORY_OPTIONS, CategoryOption } from "@/lib/product-constants";

interface ProductListProps {
  products: any[] | undefined;
  onEdit: (product: any) => void;
  onDelete: (id: string, name: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | CategoryOption>("all");

  const filteredProducts = products
    ? selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <Card className="border border-gray-200 h-fit">
      <CardHeader>
        <CardTitle>Existing Products</CardTitle>
        <CardDescription>Manage your catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v as any)}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALL_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!products ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No products found.</p>
        ) : (
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {filteredProducts.slice().reverse().map((p) => (
              <div key={p._id} className="border border-gray-200 rounded-md p-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {p.category} • ₹{p.price.toLocaleString()}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(p)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(p._id, p.name)}>Delete</Button>
                  </div>
                </div>
                {p.images && p.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {p.images.slice(0, 4).map((img: string, idx: number) => (
                      <img key={idx} src={img} className="h-12 w-full object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
