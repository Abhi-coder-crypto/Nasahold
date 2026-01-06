import mascotImg from "@assets/Picture1-removebg-preview_1767675939575.png";
import { motion } from "framer-motion";

export function Mascot({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
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
        className="w-48 md:w-80 lg:w-96 object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
