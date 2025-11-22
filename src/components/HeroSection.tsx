import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const bg =
    "https://harmless-tapir-303.convex.cloud/api/storage/9c7a0c50-e4a8-4cc2-b631-f5a35f277a9a";
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowMotion(!mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[70vh] sm:h-[78vh] md:h-[86vh] lg:h-[88vh]">
        <motion.img
          src={bg}
          alt="LUXE flagship visual"
          className="absolute inset-0 h-full w-full object-cover touch-none"
          loading="eager"
          decoding="async"
          sizes="100vw"
          fetchPriority="high"
          initial={{ scale: allowMotion ? 1.06 : 1 }}
          animate={allowMotion ? { scale: [1.06, 1.14, 1.06] } : { scale: 1 }}
          transition={
            allowMotion
              ? { duration: 9, ease: "easeInOut", repeat: Infinity }
              : undefined
          }
          style={{ 
            transformOrigin: "50% 38%", 
            objectPosition: "50% 38%",
            willChange: "transform"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-end justify-center pb-32 sm:pb-40 md:pb-44 pointer-events-none">
          <div className="flex gap-2.5 sm:gap-3 md:gap-4 px-4">
            <a
              href="/category/goggles"
              className="pointer-events-auto rounded-full bg-black/80 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-semibold ring-1 ring-white/20 hover:bg-black active:bg-black/90 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              Goggles
            </a>
            <a
              href="/category/watches"
              className="pointer-events-auto rounded-full bg-black/80 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-semibold ring-1 ring-white/20 hover:bg-black active:bg-black/90 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              Watches
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}