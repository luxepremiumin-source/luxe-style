import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppNewArrivals from "@/components/WhatsAppNewArrivals";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <WhatsAppPopup />
      <Navbar />
      <main className="pt-4">
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <WhatsAppNewArrivals />
      </main>
      <Footer />
    </div>
  );
}