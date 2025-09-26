import { motion } from "framer-motion";

export default function HeroSection() {
  const bg =
    "https://harmless-tapir-303.convex.cloud/api/storage/6915b338-b492-4de8-84e3-0f78fb0674fd";

  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-black">
      {/* Background image with looping center zoom */}
      <motion.img
        src={bg}
        alt="LUXE flagship visual"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "50% 50%" }} // center focus
      />
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />
    </section>
  );
}