import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Brand data with logos from reliable CDN sources
const BRAND_LOGOS: Record<string, { name: string; logo: string }> = {
  "gucci": {
    name: "Gucci",
    logo: "https://cdn.worldvectorlogo.com/logos/gucci.svg"
  },
  "mont blanc": {
    name: "Mont Blanc",
    logo: "https://cdn.worldvectorlogo.com/logos/montblanc-1.svg"
  },
  "montblanc": {
    name: "Mont Blanc",
    logo: "https://cdn.worldvectorlogo.com/logos/montblanc-1.svg"
  },
  "burberry": {
    name: "Burberry",
    logo: "https://cdn.worldvectorlogo.com/logos/burberry-1.svg"
  },
  "hermes": {
    name: "Hermès",
    logo: "https://cdn.worldvectorlogo.com/logos/hermes-2.svg"
  },
  "hermès": {
    name: "Hermès",
    logo: "https://cdn.worldvectorlogo.com/logos/hermes-2.svg"
  },
  "louis vuitton": {
    name: "Louis Vuitton",
    logo: "https://cdn.worldvectorlogo.com/logos/louis-vuitton-1.svg"
  },
  "lv": {
    name: "Louis Vuitton",
    logo: "https://cdn.worldvectorlogo.com/logos/louis-vuitton-1.svg"
  },
  "ferragamo": {
    name: "Ferragamo",
    logo: "https://cdn.worldvectorlogo.com/logos/salvatore-ferragamo.svg"
  },
  "salvatore ferragamo": {
    name: "Ferragamo",
    logo: "https://cdn.worldvectorlogo.com/logos/salvatore-ferragamo.svg"
  },
  "marc jacobs": {
    name: "Marc Jacobs",
    logo: "https://harmless-tapir-303.convex.cloud/api/storage/9fb34354-0cf8-4838-946e-27ddb152f833"
  },
  "prada": {
    name: "Prada",
    logo: "https://cdn.worldvectorlogo.com/logos/prada.svg"
  },
  "celine": {
    name: "Celine",
    logo: "https://cdn.worldvectorlogo.com/logos/celine.svg"
  },
  "chanel": {
    name: "Chanel",
    logo: "https://cdn.worldvectorlogo.com/logos/chanel-1.svg"
  },
  "tom ford": {
    name: "Tom Ford",
    logo: "https://logos-world.net/wp-content/uploads/2021/03/Tom-Ford-Logo.png"
  },
  "tomford": {
    name: "Tom Ford",
    logo: "https://logos-world.net/wp-content/uploads/2021/03/Tom-Ford-Logo.png"
  },
  "coach": {
    name: "Coach",
    logo: "https://cdn.worldvectorlogo.com/logos/coach.svg"
  },
  "guess": {
    name: "Guess",
    logo: "https://cdn.worldvectorlogo.com/logos/guess-1.svg"
  },
  "armani": {
    name: "Armani",
    logo: "https://cdn.worldvectorlogo.com/logos/armani.svg"
  },
  "armani exchange": {
    name: "Armani Exchange",
    logo: "https://cdn.worldvectorlogo.com/logos/armani-exchange.svg"
  },
  "emporio armani": {
    name: "Emporio Armani",
    logo: "https://harmless-tapir-303.convex.cloud/api/storage/fdfb121a-5d4f-46a0-88cb-2d75dd99c0e4"
  },
  "giorgio armani": {
    name: "Giorgio Armani",
    logo: "https://cdn.worldvectorlogo.com/logos/giorgio-armani.svg"
  },
  "michael kors": {
    name: "Michael Kors",
    logo: "https://cdn.worldvectorlogo.com/logos/michael-kors.svg"
  },
  "ferrari": {
    name: "Ferrari",
    logo: "https://cdn.worldvectorlogo.com/logos/ferrari.svg"
  },
  "scuderia ferrari": {
    name: "Ferrari",
    logo: "https://cdn.worldvectorlogo.com/logos/ferrari.svg"
  },
  "moscot": {
    name: "Moscot",
    logo: "https://moscot.com/cdn/shop/files/MOSCOT_LOGO_BLACK.png"
  },
  "cartier": {
    name: "Cartier",
    logo: "https://cdn.worldvectorlogo.com/logos/cartier-3.svg"
  },
  "ray ban": {
    name: "Ray-Ban",
    logo: "https://cdn.worldvectorlogo.com/logos/ray-ban-1.svg"
  },
  "rayban": {
    name: "Ray-Ban",
    logo: "https://cdn.worldvectorlogo.com/logos/ray-ban-1.svg"
  },
  "ray-ban": {
    name: "Ray-Ban",
    logo: "https://cdn.worldvectorlogo.com/logos/ray-ban-1.svg"
  },
  "breitling": {
    name: "Breitling",
    logo: "https://cdn.worldvectorlogo.com/logos/breitling-1.svg"
  },
  "fossil": {
    name: "Fossil",
    logo: "https://harmless-tapir-303.convex.cloud/api/storage/3844305f-2e95-4107-9a9f-6752730f6faa"
  },
  "audemars piguet": {
    name: "Audemars Piguet",
    logo: "https://cdn.worldvectorlogo.com/logos/audemars-piguet.svg"
  },
  "longines": {
    name: "Longines",
    logo: "https://cdn.worldvectorlogo.com/logos/longines-1.svg"
  },
  "casio": {
    name: "Casio",
    logo: "https://cdn.worldvectorlogo.com/logos/casio-2.svg"
  },
  "bvlgari": {
    name: "Bvlgari",
    logo: "https://cdn.worldvectorlogo.com/logos/bvlgari-1.svg"
  },
  "bulgari": {
    name: "Bvlgari",
    logo: "https://cdn.worldvectorlogo.com/logos/bvlgari-1.svg"
  },
  "rolex": {
    name: "Rolex",
    logo: "https://cdn.worldvectorlogo.com/logos/rolex.svg"
  },
  "versace": {
    name: "Versace",
    logo: "https://cdn.worldvectorlogo.com/logos/versace.svg"
  },
  "dior": {
    name: "Dior",
    logo: "https://cdn.worldvectorlogo.com/logos/dior.svg"
  },
  "fendi": {
    name: "Fendi",
    logo: "https://cdn.worldvectorlogo.com/logos/fendi.svg"
  },
  "balenciaga": {
    name: "Balenciaga",
    logo: "https://cdn.worldvectorlogo.com/logos/balenciaga.svg"
  },
  "givenchy": {
    name: "Givenchy",
    logo: "https://cdn.worldvectorlogo.com/logos/givenchy-4.svg"
  },
  "valentino": {
    name: "Valentino",
    logo: "https://cdn.worldvectorlogo.com/logos/valentino-1.svg"
  },
  "bottega veneta": {
    name: "Bottega Veneta",
    logo: "https://cdn.worldvectorlogo.com/logos/bottega-veneta.svg"
  },
  "bottega": {
    name: "Bottega Veneta",
    logo: "https://cdn.worldvectorlogo.com/logos/bottega-veneta.svg"
  },
  "dolce gabbana": {
    name: "Dolce & Gabbana",
    logo: "https://cdn.worldvectorlogo.com/logos/dolce-gabbana-1.svg"
  },
  "dolce": {
    name: "Dolce & Gabbana",
    logo: "https://cdn.worldvectorlogo.com/logos/dolce-gabbana-1.svg"
  },
  "d&g": {
    name: "Dolce & Gabbana",
    logo: "https://cdn.worldvectorlogo.com/logos/dolce-gabbana-1.svg"
  },
  "omega": {
    name: "Omega",
    logo: "https://harmless-tapir-303.convex.cloud/api/storage/d753e1e7-b724-43a8-8507-bcc7b554eb42"
  },
  "tag heuer": {
    name: "TAG Heuer",
    logo: "https://cdn.worldvectorlogo.com/logos/tag-heuer-1.svg"
  },
  "tag": {
    name: "TAG Heuer",
    logo: "https://cdn.worldvectorlogo.com/logos/tag-heuer-1.svg"
  },
  "patek philippe": {
    name: "Patek Philippe",
    logo: "https://cdn.worldvectorlogo.com/logos/patek-philippe.svg"
  },
  "patek": {
    name: "Patek Philippe",
    logo: "https://cdn.worldvectorlogo.com/logos/patek-philippe.svg"
  },
  "hublot": {
    name: "Hublot",
    logo: "https://cdn.worldvectorlogo.com/logos/hublot.svg"
  },
  "iwc": {
    name: "IWC Schaffhausen",
    logo: "https://cdn.worldvectorlogo.com/logos/iwc-schaffhausen.svg"
  },
  "tissot": {
    name: "Tissot",
    logo: "https://cdn.worldvectorlogo.com/logos/tissot-2.svg"
  },
  "seiko": {
    name: "Seiko",
    logo: "https://cdn.worldvectorlogo.com/logos/seiko-2.svg"
  },
  "citizen": {
    name: "Citizen",
    logo: "https://cdn.worldvectorlogo.com/logos/citizen.svg"
  },
  "oakley": {
    name: "Oakley",
    logo: "https://cdn.worldvectorlogo.com/logos/oakley.svg"
  },
  "persol": {
    name: "Persol",
    logo: "https://cdn.worldvectorlogo.com/logos/persol.svg"
  },
  "police": {
    name: "Police",
    logo: "https://cdn.worldvectorlogo.com/logos/police.svg"
  },
  "maybach": {
    name: "Maybach",
    logo: "https://cdn.worldvectorlogo.com/logos/maybach.svg"
  },
  "carrera": {
    name: "Carrera",
    logo: "https://harmless-tapir-303.convex.cloud/api/storage/11902880-6775-482a-b3a1-92c4c097c0ba"
  },
  "rado": {
    name: "Rado",
    logo: "https://cdn.worldvectorlogo.com/logos/rado.svg"
  },
  "tiffany": {
    name: "Tiffany & Co.",
    logo: "https://cdn.worldvectorlogo.com/logos/tiffany-co.svg"
  },
  "tiffany & co": {
    name: "Tiffany & Co.",
    logo: "https://cdn.worldvectorlogo.com/logos/tiffany-co.svg"
  },
  "tommy hilfiger": {
    name: "Tommy Hilfiger",
    logo: "https://cdn.worldvectorlogo.com/logos/tommy-hilfiger.svg"
  },
  "jaguar": {
    name: "Jaguar",
    logo: "https://cdn.worldvectorlogo.com/logos/jaguar.svg"
  },
  "calvin klein": {
    name: "Calvin Klein",
    logo: "https://cdn.worldvectorlogo.com/logos/calvin-klein-1.svg"
  },
  "g-shock": {
    name: "G-Shock",
    logo: "https://cdn.worldvectorlogo.com/logos/g-shock-1.svg"
  }
};

export default function ShopByBrand() {
  const allBrands = useQuery(api.products.getAllBrands);
  const allProducts = useQuery(api.products.getAllProducts);

  // Extract brands from product names if brand field is not set
  const detectedBrands = new Set<string>();
  
  if (allProducts) {
    allProducts.forEach((product: Doc<"products">) => {
      // If product has brand field, use it
      if (product.brand) {
        detectedBrands.add(product.brand);
      } else {
        // Otherwise, detect from product name
        const nameLower = product.name.toLowerCase();
        
        // Check each brand key to see if it's in the product name
        Object.keys(BRAND_LOGOS).forEach(brandKey => {
          if (nameLower.includes(brandKey)) {
            // Use the display name from BRAND_LOGOS
            detectedBrands.add(BRAND_LOGOS[brandKey].name);
          }
        });
      }
    });
  }

  // Map detected brands to logo data
  const availableBrands = Array.from(detectedBrands)
    .map(brand => {
      const brandKey = brand.toLowerCase();
      const logoData = BRAND_LOGOS[brandKey];
      
      if (logoData) {
        return {
          brand: brand,
          name: logoData.name,
          logo: logoData.logo
        };
      }
      
      // Fallback: create a simple text-based logo if no image available
      return {
        brand: brand,
        name: brand,
        logo: null
      };
    })
    .filter(b => b.logo !== null) // Only show brands with logos
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  const handleBrandClick = (brand: string) => {
    window.open(`/brand/${encodeURIComponent(brand)}`, '_blank');
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
              {availableBrands.map((brandData, index) => (
                <motion.div
                  key={brandData.brand}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleBrandClick(brandData.brand)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square bg-white rounded-2xl p-6 sm:p-8 flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-2xl">
                    <img
                      src={brandData.logo}
                      alt={brandData.name}
                      className="w-full h-full object-contain transition-all duration-200"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  
                  {/* Brand name */}
                  <div className="mt-4 text-center">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-gray-300 transition-colors duration-200">
                      {brandData.name}
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