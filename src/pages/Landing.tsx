import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppNewArrivals from "@/components/WhatsAppNewArrivals";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

const PRODUCTS_FILE_NAME = "products-only.json";
// Absolute path is internal to the VLY workspace. Match it when exporting.
const PRODUCTS_FILE_PATH = "/home/daytona/codebase/products-only.json";

function downloadProductsJson() {
  const filename = PRODUCTS_FILE_NAME;
  const fallbackPath = PRODUCTS_FILE_PATH;

  if (typeof window === "undefined") {
    toast.error("Not available in this environment");
    return;
  }

  // Prefer the platform file picker when available.
  if ("showSaveFilePicker" in window) {
    (window as unknown as {
      showSaveFilePicker: (
        opts: { fileName: string; suggestedStartPath: string }
      ) => Promise<unknown>;
    }).showSaveFilePicker({
      fileName: filename,
      suggestedStartPath: fallbackPath,
    })
      .then(async (handle) => {
        try {
          const response = await fetch(fallbackPath);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const blob = await response.blob();
          const type = blob.type || "application/json";
          if (
            handle &&
            typeof (handle as unknown as {
              createWritable: () => Promise<{
                write: (v: unknown) => Promise<void>;
                close: () => Promise<void>;
              }>;
            }).createWritable === "function"
          ) {
            const writable = await (handle as unknown as {
              createWritable: () => Promise<{
                write: (v: unknown) => Promise<void>;
                close: () => Promise<void>;
              }>;
            }).createWritable();
            await writable.write(blob);
            await writable.close();
            toast.success(`Saved ${filename} to your Mac`);
          } else {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
            toast.success(`Downloaded ${filename} to your Mac`);
          }
        } catch (err) {
          console.error(err);
          toast.error(
            "Download failed. Verify /home/daytona/codebase/products-only.json exists and is readable."
          );
        }
      })
      .catch(() => {
        // Fallback: still offer the legacy file link if the picker was cancelled/blocked.
        const objectUrl = URL.createObjectURL(new Blob([], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
        toast.info("File picker cancelled. Direct download link shown below.");
      });
  } else {
    // Very old browsers: build a plain download link.
    const objectUrl = URL.createObjectURL(new Blob([], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-4">
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <WhatsAppNewArrivals />
      </main>
      <Footer />
      <motion.footer className="border-t border-white/10 px-4 py-8 text-sm text-white/70">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3">
            Download <code className="rounded bg-white/10 px-2 py-1 font-mono text-white/90">products-only.json</code> directly in this workspace.
          </p>
          <motion.button
            onClick={downloadProductsJson}
            className="rounded-md bg-white px-5 py-2.5 text-black transition hover:bg-white/90"
            whileTap={{ scale: 0.98 }}
          >
            Download products-only.json
          </motion.button>
        </div>
      </motion.footer>
    </div>
  );
}
