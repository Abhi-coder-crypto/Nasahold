import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VideoPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-blue-50/30 flex flex-col">
      <Header />

      <main className="container mx-auto flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl space-y-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex-1 text-center pr-12">
              <h2 className="text-3xl md:text-5xl font-display text-secondary">
                Watch & Learn
              </h2>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-lg">
              Pay close attention to the video to answer questions later!
            </p>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/V9vuCByb6js?autoplay=1"
              title="Nasohold Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/quiz">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 group">
                Start Game <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}
