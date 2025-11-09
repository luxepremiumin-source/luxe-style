import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FeaturedProducts() {
  // Load featured products from Convex
  const products = useQuery(api.products.getFeaturedProducts);

  // Simple loading state
  if (products === undefined) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading featured items...
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-gray-200" />
                <div className="mt-3 h-6 w-3/4 bg-gray-200 rounded" />
                <div className="mt-2 h-5 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No featured products yet
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked premium accessories that our customers love most
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const image =
              (Array.isArray(product.images) && product.images[0]) ||
              "/api/placeholder/300/300";

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white"
                  onClick={() => window.open(`/product/${product._id}`, "_blank")}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Badge className="absolute top-3 left-3 z-10 bg-gray-900 text-white">
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100,
                        )}
                        % OFF
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/product/${product._id}`, "_blank");
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = `${window.location.origin}/product/${product._id}`;
                          const message = `Hi! I'm interested in "${product.name}". Price: ₹${product.price.toLocaleString()}${
                            product.originalPrice
                              ? ` (MRP ₹${product.originalPrice.toLocaleString()})`
                              : ""
                          }. Link: ${link}`;
                          const url = `https://wa.me/9871629699?text=${encodeURIComponent(
                            message,
                          )}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Order on WhatsApp
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-gray-300 hover:border-gray-900"
            onClick={() => window.open("/search?q=", "_blank")}
          >
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}