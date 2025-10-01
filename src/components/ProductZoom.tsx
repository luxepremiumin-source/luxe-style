import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductZoomProps {
  images: string[];
  productName: string;
  initialIndex?: number;
}

export default function ProductZoom({ images, productName, initialIndex = 0 }: ProductZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [dragStart, setDragStart] = useState(0);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  if (!images || images.length === 0) return null;

  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full h-10 w-10"
        onClick={() => setIsOpen(true)}
        aria-label="Zoom image"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 rounded-full h-12 w-12"
              onClick={() => setIsOpen(false)}
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 rounded-full h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 rounded-full h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={activeIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleSwipe}
                src={images[activeIndex]}
                alt={`${productName} - Image ${activeIndex + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg cursor-grab active:cursor-grabbing"
              />

              {images.length > 1 && (
                <div className="flex gap-3 mt-4 justify-center overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                  {images.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all duration-200 snap-center ${
                        activeIndex === idx
                          ? "ring-white"
                          : "ring-white/20 hover:ring-white/40"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${productName} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}