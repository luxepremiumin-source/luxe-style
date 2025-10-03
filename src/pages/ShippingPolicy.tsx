import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
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
              className="font-bold text-center mb-8 text-[#111111]"
              style={{ fontSize: "32px", lineHeight: "1.2" }}
            >
              Shipping policy
            </h1>

            <div
              className="text-left"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "17px",
                lineHeight: "1.6",
              }}
            >
              <p className="mb-2 font-bold">Processing Time:</p>
              <p className="mb-6">
                Orders will be processed within 24-48 hours, with possible delays during
                holidays or peak seasons.
              </p>

              <p className="mb-2 font-bold">Delivery Time:</p>
              <p className="mb-2">
                Delivery times vary based on the customer's location.
              </p>
              <p className="mb-2">
                – In state capitals and metro cities, orders are typically delivered within 4 to 6
                working days.
              </p>
              <p className="mb-6">
                – For other localities, delivery may take up to 5 to 8 working days.
              </p>

              <p className="mb-2 font-bold">Order Tracking:</p>
              <p className="mb-6">
                Once your order is shipped, you will receive a WhatsApp message with the
                tracking details. Please note that it may take up to 24-48 hours for the courier's
                online tracking system to update the shipment status after the order is picked
                up. If you encounter any issues while tracking your order, please reach out to
                our customer service team for assistance.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
