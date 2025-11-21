import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f2f2f2] text-[#111111]"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      <Navbar />
      <main className="pt-2">
        <div className="max-w-[800px] mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="font-bold text-center mb-5 text-[#111111]"
              style={{ fontSize: "32px", lineHeight: "1.2" }}
            >
              Luxe concierge desk
            </h1>

            <div
              className="text-left"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "17px",
                lineHeight: "1.6",
              }}
            >
              <p className="mb-4">Hello Luxe family,</p>

              <p className="mb-4">
                I'm Vidhi from the Luxe Style team. Our goal is to make every
                purchase feel personal—whether you're discovering a new watch,
                curating a gift box, or tracking an existing order.
              </p>

              <p className="mb-4">
                Reach out anytime via the channels below and we'll get back to
                you right away:
              </p>

              <div className="mb-4 space-y-1">
                <p>
                  WhatsApp Concierge:{" "}
                  <a
                    href="https://wa.me/918871880773"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    +91 88718 80773
                  </a>
                </p>
                <p>
                  Email Support:{" "}
                  <a
                    href="mailto:vidhigadgets@gmail.com"
                    className="underline"
                  >
                    vidhigadgets@gmail.com
                  </a>
                </p>
                <p>Hours: Daily, 9:00 AM – 10:00 PM IST</p>
              </div>

              <p className="mb-4">
                Your satisfaction is our priority, and we're here to help with
                styling advice, order assistance, and after-sales support.
              </p>

              <div style={{ marginTop: "15px" }}>
                <p>Warm regards,</p>
                <p>Vidhi Gadgets</p>
                <p>Luxe Style Concierge</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}