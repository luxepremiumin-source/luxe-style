import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      <Navbar />
      <main className="pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-12 sm:mb-16">
              Contact information
            </h1>

            <div className="space-y-6 text-base sm:text-lg text-gray-300 leading-relaxed">
              <p>Dear valued customers,</p>

              <p>
                I'm Tanmay Agrawal, the proud owner of LUXE, where we're dedicated to
                providing you with the finest quality products. Whether you're seeking style,
                comfort, or durability, we've got you covered.
              </p>

              <p>
                For any inquiries, orders, or assistance, feel free to reach out to us via
                WhatsApp or email using the contact details below:
              </p>

              <div className="py-4">
                <p className="font-semibold text-white">WhatsApp: +91 9871629699</p>
                <p className="font-semibold text-white">Email: luxe.premium.in@gmail.com</p>
              </div>

              <p>
                Your satisfaction is our priority, and we look forward to serving you!
              </p>

              <div className="pt-6">
                <p>Warm regards,</p>
                <p className="font-semibold text-white">Tanmay Agrawal</p>
                <p className="text-gray-400">Owner, LUXE</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
