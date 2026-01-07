import mascotImg from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23__1_-removebg-preview_1767770695897.png";
import { motion } from "framer-motion";

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative z-10 ${className}`}
    >
      <img
        src={mascotImg}
        alt="Nasohold Mascot"
        className="w-32 md:w-56 lg:w-64 object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
