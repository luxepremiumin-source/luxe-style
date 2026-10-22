
import { useEffect, useRef } from "react";
import { Link } from "react-router";

export default function HeroSection() {
  const backgroundImage = "/luxe-hero.png.jpeg";

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let frame = 0;

    const updateZoom = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        if (reducedMotion.matches) {
          image.style.transform = "scale(1)";
          return;
        }

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Progress increases as the visitor scrolls through the hero.
        const progress = Math.min(
          1,
          Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height))
        );

        const scale = 1 + progress * 0.4;
        image.style.transform = `scale(${scale})`;
      });
    };

    updateZoom();
    window.addEventListener("scroll", updateZoom, { passive: true });
    window.addEventListener("resize", updateZoom);
    reducedMotion.addEventListener("change", updateZoom);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateZoom);
      window.removeEventListener("resize", updateZoom);
      reducedMotion.removeEventListener("change", updateZoom);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative h-[70vh] sm:h-[78vh] md:h-[86vh] lg:h-[88vh]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={imageRef}
            src={backgroundImage}
            alt="LUXE flagship visual"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{
              objectPosition: "50% 38%",
              transform: "scale(1)",
              transformOrigin: "center center",
              willChange: "transform",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <div className="absolute inset-0 flex items-end justify-center pb-32 sm:pb-40 md:pb-44 pointer-events-none">
          <div
            className="flex justify-center gap-2.5 sm:gap-3 md:gap-4 px-4"
            style={{ transform: "translateX(-10px)" }}
          >
            <Link
              to="/category/mens"
              className="pointer-events-auto rounded-full bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-bold ring-2 ring-black/10 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center shadow-lg"
            >
              Mens
            </Link>

            <Link
              to="/category/womens"
              className="pointer-events-auto rounded-full bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-bold ring-2 ring-black/10 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center justify-center shadow-lg"
            >
              Womens
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
