import mascotImg from "@assets/Picture1-removebg-preview_1767675939575.png";
import { motion } from "framer-motion";

export function Mascot({ className }: { className?: string }) {
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
        className="w-40 md:w-72 lg:w-80 object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
