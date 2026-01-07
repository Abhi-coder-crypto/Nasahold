import { motion } from "framer-motion";
import logoLeft from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767763199983.png";
import logoRight from "@assets/WhatsApp_Image_2026-01-07_at_10.23.22-removebg-preview_1767762430087.png";
import mascotImg from "@assets/WhatsApp_Image_2026-01-07_at_10.23.27-removebg-preview_1767763214039.png";
import footerDecorative from "@assets/image_1767763325734.png";
import mobileBg from "@assets/image_1767776793981.png";
import videoHeadingImg from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767778126833.png";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { ArrowLeft, ArrowRight, X, Zap, Gamepad2, Plus } from "lucide-react";
import { Header } from "@/components/Header";

export default function VideoPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-screen bg-[#0047AB] flex flex-col overflow-hidden font-sans">
      {/* Mobile background image */}
      <div className="absolute inset-0 z-0 md:hidden pointer-events-none">
        <img 
          src={mobileBg} 
          alt="" 
          className="w-full h-full object-fill opacity-100"
        />
      </div>
      <Header />
      
      {/* Background Decorative Design - Left and Right - Removed */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        {/* Floating Icons with lower opacity */}
        <div className="absolute inset-0 opacity-20">
          <X className="absolute top-20 left-10 text-white w-8 h-8" />
          <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
          <Zap className="absolute top-10 left-1/2 text-yellow-400 w-6 h-6" />
          <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
        </div>
      </div>

      <div className="px-4 flex justify-start items-center relative z-20 h-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="text-white hover:bg-white/10 h-6"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back
        </Button>
      </div>

      {/* Main Content - Centered in one view */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl lg:max-w-4xl space-y-4 -mt-4 md:-mt-6"
        >
          <div className="text-center space-y-2 mb-2 flex flex-col items-center">
            {/* Mobile-only logo and heading */}
            <div className="md:hidden flex flex-col items-center space-y-2 mb-2">
              <img 
                src={logoLeft} 
                alt="Nasohold" 
                className="h-10 object-contain brightness-0 invert"
              />
              <img 
                src={videoHeadingImg} 
                alt="Watch the video and test your memory to win exciting prizes!!!" 
                className="w-full max-w-[300px] object-contain"
              />
            </div>

            {/* Desktop-only heading */}
            <div className="hidden md:block space-y-1">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white tracking-tight">
                Watch & Learn
              </h2>
              <p className="text-blue-100 text-sm md:text-base lg:text-xl font-medium opacity-90">
                Pay close attention to answer questions later!
              </p>
            </div>
          </div>

          <div className="aspect-video w-full max-h-[40vh] lg:max-h-[50vh] rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-black mx-auto">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/r8YUIZGQ6ZU?autoplay=1"
              title="Nasohold Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex justify-center pt-1">
            <Link href="/quiz">
              <Button size="lg" className="h-10 px-6 text-base font-bold rounded-full bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] shadow-xl transition-all active:scale-95 group">
                START GAME <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mascot Positioned left */}
        <div className="absolute left-[5%] bottom-[0%] z-30 pointer-events-none hidden lg:block">
          <Mascot className="scale-75" />
        </div>
      </main>

      {/* Mobile Mascot - Removed */}

      {/* Bottom White Area - Updated */}
      <div className="h-40 md:h-48 bg-white rounded-t-[2.5rem] relative z-20 flex items-center justify-between px-8 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        {/* Mobile-only decorative background */}
        <div className="absolute inset-0 z-0 pointer-events-none md:hidden overflow-hidden rounded-t-[2.5rem]">
          <img 
            src={footerDecorative} 
            alt="" 
            className="w-full h-full object-cover opacity-100"
          />
        </div>

        <div className="flex flex-col relative z-10">
          <img 
            src={logoLeft} 
            alt="Nasohold Logo" 
            className="h-14 md:h-20 object-contain"
          />
        </div>
        
        {/* Mascot positioned fully on the footer right */}
        <div className="absolute right-0 bottom-0 pointer-events-none z-30 flex items-end justify-end w-full h-full overflow-visible">
           <img 
             src={mascotImg} 
             alt="Mascot" 
             className="h-[280px] md:h-[450px] object-contain translate-y-[5%] translate-x-[-5%]"
           />
        </div>
      </div>
    </div>
  );
}
