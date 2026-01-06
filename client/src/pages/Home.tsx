import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full text-center space-y-8 glass-card p-12 rounded-3xl"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider uppercase mb-4">
                Knowledge Challenge
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl text-secondary font-display leading-tight">
              Master the Science of <span className="text-primary">Nasohold</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Test your knowledge about the advanced pump technology, unique formulation, and clinical benefits of Nasohold nasal spray.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto py-6">
            {[
              "Clinical Precision",
              "Patient Comfort",
              "Advanced Technology"
            ].map((feature, i) => (
              <motion.div 
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-2 text-secondary font-medium"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <Link href="/quiz">
            <Button 
              size="lg" 
              className="text-lg px-12 py-8 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              Start Quiz <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <Mascot />
      
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
