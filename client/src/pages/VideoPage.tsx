import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { ArrowLeft, ArrowRight, X, Zap, Gamepad2, Plus } from "lucide-react";
import { Header } from "@/components/Header";

export default function VideoPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen bg-[#0047AB] flex flex-col overflow-hidden font-sans">
      <Header />
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <X className="absolute top-10 left-10 text-white w-8 h-8" />
        <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
        <Zap className="absolute top-5 left-1/2 text-yellow-400 w-6 h-6" />
        <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
      </div>

      {/* Top Header Controls */}
      <div className="p-4 flex justify-start items-center relative z-20">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 relative z-10 pt-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl space-y-6"
        >
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Watch & Learn
            </h2>
            <p className="text-blue-100 text-base md:text-lg">
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
              <Button size="lg" className="h-14 px-10 text-xl font-bold rounded-full bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] shadow-xl transition-all active:scale-95 group">
                START GAME <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mascot Positioned at the bottom left relative to content */}
        <div className="absolute bottom-24 left-10 z-30 pointer-events-none hidden lg:block">
          <Mascot className="scale-125" />
        </div>

        {/* Mobile Mascot */}
        <div className="lg:hidden mb-6">
           <Mascot className="scale-90" />
        </div>
      </main>

      {/* Bottom White Wave Area */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-white rounded-t-[3rem] z-0">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
           <div className="text-center pt-8">
              <h3 className="text-[#0047AB] text-3xl md:text-4xl font-bold">
                Nasohold<span className="text-sm align-top">™</span>
              </h3>
              <p className="text-[#0047AB] text-sm md:text-base font-semibold">Nasal Sprays</p>
           </div>
        </div>
      </div>
    </div>
  );
}
