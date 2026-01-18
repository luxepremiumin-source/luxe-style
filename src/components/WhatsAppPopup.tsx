import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem("whatsapp-popup-shown");
    if (!hasShown) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("whatsapp-popup-shown", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoin = () => {
    window.location.href = "https://chat.whatsapp.com/EEk0S8PYfR474ks8ok1rPE";
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#25D366]/10 to-transparent" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#25D366]/20 rounded-full blur-3xl" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-4 ring-1 ring-[#25D366]/20">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Join the Inner Circle
              </h3>
              
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Get instant access to exclusive drops, flash sales, and premium new arrivals before anyone else.
              </p>

              <Button
                onClick={handleJoin}
                className="w-full bg-[#25D366] hover:bg-[#20bd5b] text-white font-medium h-11 rounded-xl shadow-[0_0_20px_-5px_rgba(37,211,102,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Join Community
              </Button>
              
              <p className="mt-4 text-xs text-gray-500">
                No spam, just premium updates.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
