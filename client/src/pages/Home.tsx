import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto flex-1 flex flex-col md:flex-row items-center justify-center px-6 gap-4 md:gap-8 py-2">
        {/* Left Side: Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left space-y-2 md:space-y-4 max-w-lg"
        >
          {/* Badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs tracking-wider uppercase">
            Nasohold Memory Game
          </span>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-secondary leading-tight">
            Welcome to <br />
            <span className="text-primary">Nasohold</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Watch the video and test your memory to win exciting prizes!
          </p>

          {/* CTA */}
          <div className="pt-1">
            <Link href="/video">
              <Button size="lg" className="h-10 md:h-12 px-5 md:px-6 text-sm md:text-base rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 group">
                Watch Video <Play className="ml-2 h-4 md:h-5 w-4 md:w-5 fill-current" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Mascot */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 flex justify-center md:justify-end items-center relative"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />
            <Mascot />
          </div>
        </motion.div>
      </main>

      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
