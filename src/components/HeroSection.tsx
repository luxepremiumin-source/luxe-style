import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HeroSection() {
  const fallbackBg =
    "https://harmless-tapir-303.convex.cloud/api/storage/9c7a0c50-e4a8-4cc2-b631-f5a35f277a9a";
  const heroSections = useQuery(api.heroSections.getHeroSections);
  const dynamicBg =
    heroSections?.find((section) => section.slug === "hero-one")?.images?.[0] ??
    null;
  const backgroundImage = dynamicBg ?? fallbackBg;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[70vh] sm:h-[78vh] md:h-[86vh] lg:h-[88vh]">
        <div className="absolute inset-0 h-full w-full">
          <img
            src={backgroundImage}
            alt="LUXE flagship visual"
            className="h-full w-full object-cover animate-hero-zoom"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            style={{ 
              objectPosition: "50% 38%",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-end justify-center pb-32 sm:pb-40 md:pb-44 pointer-events-none">
          <div className="flex gap-2.5 sm:gap-3 md:gap-4 px-4">
            <a
              href="/category/goggles"
              className="pointer-events-auto rounded-full bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-bold ring-2 ring-black/10 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center shadow-lg"
            >
              Goggles
            </a>
            <a
              href="/category/watches"
              className="pointer-events-auto rounded-full bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-bold ring-2 ring-black/10 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center shadow-lg"
            >
              Watches
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes hero-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-hero-zoom {
          animation: hero-zoom 20s ease-in-out infinite;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .animate-hero-zoom {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}