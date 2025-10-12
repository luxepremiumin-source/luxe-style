import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Brand data with logos from CDN sources
const BRAND_LOGOS: Record<string, { name: string; logo: string; searchTerm: string }> = {
  gucci: {
    name: "Gucci",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Gucci_Logo.svg/2560px-Gucci_Logo.svg.png",
    searchTerm: "gucci"
  },
  montblanc: {
    name: "Mont Blanc",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Montblanc_logo.svg/2560px-Montblanc_logo.svg.png",
    searchTerm: "mont blanc"
  },
  burberry: {
    name: "Burberry",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Burberry_logo.svg/2560px-Burberry_logo.svg.png",
    searchTerm: "burberry"
  },
  hermes: {
    name: "Hermès",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Herm%C3%A8s_logo.svg/2560px-Herm%C3%A8s_logo.svg.png",
    searchTerm: "hermes"
  },
  lv: {
    name: "Louis Vuitton",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/2560px-Louis_Vuitton_logo_and_wordmark.svg.png",
    searchTerm: "lv"
  },
  ferragamo: {
    name: "Ferragamo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Salvatore_Ferragamo_Logo.svg/2560px-Salvatore_Ferragamo_Logo.svg.png",
    searchTerm: "ferragamo"
  },
  marcjacobs: {
    name: "Marc Jacobs",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Marc_Jacobs_logo.svg/2560px-Marc_Jacobs_logo.svg.png",
    searchTerm: "marc jacob"
  },
  prada: {
    name: "Prada",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Prada_logo.svg/2560px-Prada_logo.svg.png",
    searchTerm: "prada"
  },
  celine: {
    name: "Celine",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Celine_logo.svg/2560px-Celine_logo.svg.png",
    searchTerm: "celine"
  },
  chanel: {
    name: "Chanel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Chanel_logo_interlocking_cs.svg/2560px-Chanel_logo_interlocking_cs.svg.png",
    searchTerm: "chanel"
  },
  tomford: {
    name: "Tom Ford",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Tom_Ford_logo.svg/2560px-Tom_Ford_logo.svg.png",
    searchTerm: "tomford"
  },
  coach: {
    name: "Coach",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Coach_logo.svg/2560px-Coach_logo.svg.png",
    searchTerm: "coach"
  },
  guess: {
    name: "Guess",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Guess_logo.svg/2560px-Guess_logo.svg.png",
    searchTerm: "guess"
  },
  armani: {
    name: "Armani Exchange",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Armani_Exchange_logo.svg/2560px-Armani_Exchange_logo.svg.png",
    searchTerm: "armani"
  },
  michaelkors: {
    name: "Michael Kors",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Michael_Kors_logo.svg/2560px-Michael_Kors_logo.svg.png",
    searchTerm: "michael kors"
  },
  ferrari: {
    name: "Ferrari",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Scuderia_Ferrari_Logo.svg/2560px-Scuderia_Ferrari_Logo.svg.png",
    searchTerm: "ferrari"
  },
  moscot: {
    name: "Moscot",
    logo: "https://moscot.com/cdn/shop/files/MOSCOT_LOGO_BLACK.png",
    searchTerm: "moscot"
  }
};

export default function ShopByBrand() {
  const allProducts = useQuery(api.products.getAllProducts);

  // Detect which brands are actually in the products
  const availableBrands = Object.entries(BRAND_LOGOS).filter(([key, brand]) => {
    return allProducts?.some(product => 
      product.name.toLowerCase().includes(brand.searchTerm.toLowerCase())
    );
  });

  const handleBrandClick = (searchTerm: string) => {
    // Navigate to a search results page or filter products by brand
    window.open(`/brand/${encodeURIComponent(searchTerm)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-20">
        <section className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                Shop By Brand
              </h1>
              <p className="text-gray-400 text-lg">
                Explore our curated collection of luxury brands
              </p>
            </div>

            {/* Brand Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {availableBrands.map(([key, brand], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleBrandClick(brand.searchTerm)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square bg-white rounded-2xl p-6 sm:p-8 flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-2xl">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain filter grayscale-0 group-hover:grayscale-0 transition-all duration-200"
                      loading="lazy"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  
                  {/* Brand name */}
                  <div className="mt-4 text-center">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-gray-300 transition-colors duration-200">
                      {brand.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {availableBrands.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No brands available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
