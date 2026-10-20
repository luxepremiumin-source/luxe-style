
import { useMemo, useState } from "react";
import productsData from "@/data/staticProducts.json";
import { Search, MessageCircle, ArrowUpRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  colors?: string[];
  inStock: boolean;
  images: string[];
};

const products = productsData as Product[];
const WHATSAPP_NUMBER = "918871880773";
const categories = [
  { label: "All Products", value: "all" },
  { label: "Goggles", value: "goggles" },
  { label: "Watches", value: "watches" },
  { label: "Belts", value: "belts" },
  { label: "Gift Boxes", value: "gift box" },
];

function orderOnWhatsApp(product: Product) {
  const message = `Hi LUXE! I'm interested in ${product.name}.\nPrice: ₹${product.price}\nPlease share availability and ordering details.`;
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export default function StaticCatalogue() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category.toLowerCase() === category;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-5 py-5 sm:px-10">
        <a href="/" className="text-2xl font-semibold tracking-[0.3em]">
          LUXE
        </a>
        <p className="mt-1 text-[10px] tracking-[0.28em] text-white/50">
          PREMIUM ACCESSORIES
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-10 sm:pt-20">
        <p className="text-xs tracking-[0.3em] text-white/50">
          THE COLLECTION
        </p>
        <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-6xl">
          Everyday luxury.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
          Explore our collection of watches, eyewear, belts and accessories.
          Find your style and enquire directly with our team.
        </p>

        <div className="mt-9 flex max-w-xl items-center gap-3 border-b border-white/25 pb-3">
          <Search className="h-5 w-5 shrink-0 text-white/50" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
                category === item.value
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white/70 hover:border-white/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-5 mt-9 flex items-center justify-between">
          <p className="text-sm text-white/60">
            {filteredProducts.length} products
          </p>
          <p className="text-xs tracking-wider text-white/40">
            CURATED FOR YOU
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group min-w-0">
              <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.06]">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                )}
                <span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[9px] uppercase tracking-wider text-white/80">
                  {product.category}
                </span>
              </div>

              <div className="pt-4">
                <h2 className="line-clamp-2 min-h-10 text-sm font-medium sm:text-base">
                  {product.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-sm">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-xs text-white/40 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                </div>
                <button
                  onClick={() => orderOnWhatsApp(product)}
                  className="mt-4 flex w-full items-center justify-center gap-2 border border-white/25 px-2 py-3 text-[10px] font-medium uppercase tracking-wider transition hover:bg-white hover:text-black sm:text-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-sm text-white/50">
            No products found. Try another search.
          </div>
        )}

        <p className="mt-12 text-center text-xs leading-5 text-white/40">
          Contact us on WhatsApp to confirm current availability, pricing and
          delivery details.
        </p>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LUXE PREMIUM
      </footer>
    </main>
  );
}
