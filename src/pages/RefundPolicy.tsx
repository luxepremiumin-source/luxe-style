import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
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
              Refund policy
            </h1>

            <div
              className="text-left"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "17px",
                lineHeight: "1.6",
              }}
            >
              <p className="mb-6">
                We hope you will be pleased with your purchase. Returns can be considered in the case of wrong or damaged products delivered only. A return should be made within a resalable timeframe (48 hours) and in the original packaging after delivery. If we find that the product has not been returned to us in fully resalable condition, we reserve the right to refuse replacement on the item. If you are returning an item because of an error on our part or because it is damaged or defective, we will replace the particular item.
              </p>

              <p className="mb-6">
                Additionally, to initiate a return or replacement request, we require an unboxing video of the product without cut & pause. This is to ensure that the product's condition matches what was stated on our website at the time of your purchase.
              </p>

              <p className="mb-6">
                There is No Refund for the product's purchased if there's any damage or wrong product shipped or any kind of mistake from our end there will be a replacement for the purchased product but the customer is responsible to reach out to us within 48hrs of receiving the order.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
