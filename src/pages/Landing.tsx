import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppNewArrivals from "@/components/WhatsAppNewArrivals";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

export default function Landing() {
  // Load featured products
  const featured = useQuery(api.products.getFeaturedProducts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <Navbar />
      <main className="pt-4">
        <HeroSection />
        <CategorySection />

        {/* Featured Products Section */}
        <section className="bg-black text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Featured Products
              </h2>
              <a
                href="/category/goggles"
                className="text-sm text-white/70 hover:text-white underline"
              >
                Explore collections
              </a>
            </div>

            {featured === undefined ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square rounded-2xl bg-white/10 animate-pulse" />
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : featured.length === 0 ? (
              <div className="text-white/70">No featured products yet.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featured.map((p) => {
                  const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/api/placeholder/400/400";
                  return (
                    <div
                      key={p._id}
                      className="group cursor-pointer"
                      onClick={() => window.open(`/product/${p._id}`, "_blank")}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <img
                          src={img}
                          alt={p.name}
                          className={`absolute inset-0 w-full h-full object-cover ${!p.inStock ? "brightness-50" : ""}`}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                          onError={(e) => {
                            if (e.currentTarget.src !== "/api/placeholder/400/400") {
                              e.currentTarget.src = "/api/placeholder/400/400";
                            }
                          }}
                        />
                        {(p.originalPrice && p.originalPrice > p.price) ? (
                          <span className="absolute top-3 left-3 z-10 bg-white text-black text-xs font-semibold px-2 py-1 rounded">
                            Sale
                          </span>
                        ) : p.featured ? (
                          <span className="absolute top-3 left-3 z-10 bg-white text-black text-xs font-semibold px-2 py-1 rounded">
                            Featured
                          </span>
                        ) : null}
                        {!p.inStock && (
                          <span className="absolute inset-0 flex items-center justify-center z-10 text-red-500 text-xs font-semibold tracking-wider">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-extrabold tracking-tight text-sm sm:text-base line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            ₹{p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && (
                            <>
                              <span className="text-white/40 line-through text-sm">
                                ₹{p.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-emerald-400 text-xs font-semibold">
                                ({Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <WhatsAppNewArrivals />
      </main>
      <Footer />
    </motion.div>
  );
}