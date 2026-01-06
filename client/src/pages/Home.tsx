import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* Centered Content */}
      <main className="flex min-h-screen items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center space-y-8 glass-card px-10 py-14 rounded-3xl"
        >
          {/* Badge */}
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider uppercase">
            Nasohold Memory Game
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-display text-secondary leading-tight">
            Welcome to <span className="text-primary">Nasohold</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            Watch the video and test your memory to win exciting prizes!
          </p>

          {/* CTA */}
          <Link href="/quiz">
            <Button>
              Start Game <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <Mascot />

      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
