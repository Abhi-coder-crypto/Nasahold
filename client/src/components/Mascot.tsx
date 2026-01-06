import mascotImg from "@assets/Picture1-removebg-preview_1767675939575.png";
import { motion } from "framer-motion";

export function Mascot({ className }: { className?: string }) {
  return (
    <motion.div 
      className={`fixed bottom-0 right-4 md:right-12 z-0 pointer-events-none opacity-80 md:opacity-100 ${className}`}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
    >
      <img 
        src={mascotImg} 
        alt="Nasohold Mascot" 
        className="h-64 md:h-96 w-auto object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
}
