import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppNewArrivals from "@/components/WhatsAppNewArrivals";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Landing() {
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
        <FeaturedProducts />
        <WhatsAppNewArrivals />
      </main>
      <Footer />
    </motion.div>
  );
}