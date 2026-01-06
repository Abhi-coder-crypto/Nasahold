import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { ArrowLeft, ArrowRight, X, Zap, Gamepad2, Plus } from "lucide-react";
import { Header } from "@/components/Header";

export default function VideoPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-screen bg-[#0047AB] flex flex-col overflow-hidden font-sans">
      <Header />
      
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <X className="absolute top-20 left-10 text-white w-8 h-8" />
        <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
        <Zap className="absolute top-10 left-1/2 text-yellow-400 w-6 h-6" />
        <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
      </div>

      <div className="px-4 py-2 flex justify-start items-center relative z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="text-white hover:bg-white/10 h-8"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Main Content - Centered in one view */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-3xl font-bold text-white">
              Watch & Learn
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Pay close attention to answer questions later!
            </p>
          </div>

          <div className="aspect-video w-full max-h-[50vh] rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-black mx-auto">
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

          <div className="flex justify-center pt-2">
            <Link href="/quiz">
              <Button size="lg" className="h-12 px-8 text-lg font-bold rounded-full bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] shadow-xl transition-all active:scale-95 group">
                START GAME <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mascot Positioned left */}
        <div className="absolute left-[5%] bottom-0 z-30 pointer-events-none hidden lg:block">
          <Mascot className="scale-110" />
        </div>
      </main>

      {/* Bottom Area - Compressed */}
      <div className="h-32 bg-white rounded-t-[3rem] relative z-0 flex items-center justify-center mt-auto">
        <div className="text-center">
          <h3 className="text-[#0047AB] text-2xl md:text-3xl font-bold">
            Nasohold<span className="text-xs align-top">™</span>
          </h3>
          <p className="text-[#0047AB] text-xs md:text-sm font-semibold">Nasal Sprays</p>
        </div>
        
        {/* Mobile Mascot */}
        <div className="lg:hidden absolute -top-16 left-1/2 -translate-x-1/2 scale-75">
           <Mascot />
        </div>
      </div>
    </div>
  );
}
