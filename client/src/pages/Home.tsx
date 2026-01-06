import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto flex-1 flex flex-col md:flex-row items-center justify-center px-6 gap-8 md:gap-12 py-4">
        {/* Left Side: Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left space-y-4 md:space-y-6"
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm tracking-wider uppercase">
            Nasohold Memory Game
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-display text-secondary leading-tight">
            Welcome to <br />
            <span className="text-primary">Nasohold</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
            Watch the video and test your memory to win exciting prizes!
          </p>

          {/* CTA */}
          <div className="pt-2">
            <Link href="/quiz">
              <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95">
                Start Game <ArrowRight className="ml-2 h-5 md:h-6 w-5 md:w-6" />
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
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
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
