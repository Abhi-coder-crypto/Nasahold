import { useState, useEffect } from "react";
import logoLeft from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767763199983.png";
import mascotImg from "@assets/WhatsApp_Image_2026-01-07_at_10.23.27-removebg-preview_1767763214039.png";
import footerDecorative from "@assets/image_1767763325734.png";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubmitQuiz } from "@/hooks/use-quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Trophy, Zap, X, Plus, Gamepad2 } from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Add ThumbsUp feedback component
function ThumbsUpFeedback({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1.2, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-8 shadow-2xl border-4 border-yellow-400">
            <span className="text-8xl">👍👍</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Types & Data ---

type QuestionType = "single" | "multiple";

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer?: string; // For single choice
  survey?: boolean;       // If true, no correct/wrong scoring
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Nasohold uses which pump technology to ensure uniform dose delivery with smooth actuation?",
    type: "single",
    options: ["APTAR VP3 Pump", "Bona Pump", "Aptar VP6 Pump"],
    correctAnswer: "Aptar VP6 Pump"
  },
  {
    id: 2,
    text: "What is the mean droplet size delivered by the Aptar VP6 pump used in Nasohold?",
    type: "single",
    options: ["30.5 µm", "20 µm", "10 µm"],
    correctAnswer: "30.5 µm"
  },
  {
    id: 3,
    text: "Which sweetener is used in Nasohold to improve taste and patient compliance?",
    type: "single",
    options: ["Aspartame", "Sucralose", "Neotame"],
    correctAnswer: "Neotame"
  },
  {
    id: 4,
    text: "What is the plume geometry angle of Nasohold nasal spray?",
    type: "single",
    options: ["30°", "45°", "90°"],
    correctAnswer: "45°"
  },
  {
    id: 5,
    text: "Which intranasal corticosteroid molecule does Nasohold contain?",
    type: "single",
    options: ["Mometasone Furoate (MF)", "Fluticasone Furoate (FF)", "Fluticasone Propionate (FP)"],
    correctAnswer: "Fluticasone Furoate (FF)"
  },
  {
    id: 6,
    text: "In your clinical practice, for which of the following indications will you commonly use Nasohold?",
    type: "multiple",
    options: ["Allergic Rhinitis", "Adenoid Hypertrophy", "Chronic Rhinosinusitis", "Otitis Media with Effusion"],
    survey: true
  },
  {
    id: 7,
    text: "Which feature of Nasohold stood out the most to you?",
    type: "multiple",
    options: ["Molecule (FF)", "Pump Technology (Aptar VP6)", "Droplet size", "Taste / Neotame", "Plume geometry"],
    survey: true
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinished) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFinished]);

  // Handle refresh or direct access without registration
  useEffect(() => {
    const isRegistered = localStorage.getItem("userEmail");
    if (!isRegistered && !isFinished) {
      setLocation("/");
    }
    
    // Detect refresh or direct navigation
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload") {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userNumber");
      setLocation("/");
    }
  }, [setLocation, isFinished]);

  const submitQuiz = useSubmitQuiz();

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelect = (option: string) => {
    if (currentQuestion.type === "single") {
      // Allow changing selection
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
      
      // Check if correct
      if (!currentQuestion.survey && option === currentQuestion.correctAnswer) {
        setShowFeedback(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#0047AB', '#FFFFFF']
        });
        setTimeout(() => setShowFeedback(false), 2000);
      }
    } else {
      // Multiple select logic
      const current = (answers[currentQuestion.id] as string[]) || [];
      if (current.includes(option)) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: current.filter(o => o !== option) }));
      } else {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: [...current, option] }));
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    // Calculate Score (only for non-survey questions)
    let calculatedScore = 0;
    QUESTIONS.forEach(q => {
      if (!q.survey && q.correctAnswer) {
        if (answers[q.id] === q.correctAnswer) {
          calculatedScore++;
        }
      }
    });

    setScore(calculatedScore);
    setIsFinished(true);
    
    // Trigger confetti if score is good (e.g. > 3)
    if (calculatedScore >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#005f73', '#0a9396', '#94d2bd']
      });
    }

    // Submit to backend
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const number = localStorage.getItem("userNumber");

    const submissionData = {
      answers: answers,
      score: calculatedScore,
      email: email || undefined,
      name: name || undefined,
      number: number || undefined
    };

    try {
      await submitQuiz.mutateAsync(submissionData as any);
    } catch (e) {
      console.error("Submission failed", e);
    }
  };

  const isOptionSelected = (option: string) => {
    const ans = answers[currentQuestion.id];
    if (Array.isArray(ans)) return ans.includes(option);
    return ans === option;
  };

  // Determine if "Next" button should be enabled
  const canProceed = !!answers[currentQuestion.id] && 
    (Array.isArray(answers[currentQuestion.id]) ? (answers[currentQuestion.id] as string[]).length > 0 : true);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0047AB]">
      {/* Background Decorations - Enhanced */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        {/* Left Side Decorative Image */}
        <img 
          src={footerDecorative} 
          alt="" 
          className="absolute left-0 top-0 h-full w-auto object-cover object-left opacity-100"
        />
        {/* Right Side Decorative Image */}
        <img 
          src={footerDecorative} 
          alt="" 
          className="absolute right-0 top-0 h-full w-auto object-cover object-right opacity-100 scale-x-[-1]"
        />
        
        {/* Legacy icons with lower opacity */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white/30 rounded-full" />
          <div className="absolute top-1/4 right-10 w-16 h-16 border-2 border-yellow-400/30 rotate-45" />
          <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-white/20 rounded-lg -rotate-12" />
          <Zap className="absolute top-10 right-1/4 text-yellow-400/40 w-8 h-8" />
          <Gamepad2 className="absolute bottom-1/4 right-1/4 text-white/20 w-16 h-16 rotate-12" />
        </div>
      </div>

      <Header />
      <ThumbsUpFeedback visible={showFeedback} />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-0 -mt-20 lg:-mt-10">
        {/* Progress Chart and Question Number at the top */}
        <div className="w-full max-w-2xl lg:max-w-4xl mb-8 space-y-2">
          <div className="flex justify-between items-end text-white">
            <span className="text-sm md:text-base font-medium opacity-80 uppercase tracking-wider">Question {currentStep + 1} of {QUESTIONS.length}</span>
            <span className="text-2xl md:text-3xl font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 md:h-3 bg-white/20" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl lg:max-w-4xl"
          >
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                {currentStep + 1}. {currentQuestion.text}
              </h2>

              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                {currentQuestion.options.map((option, idx) => {
                  const label = String.fromCharCode(97 + idx); // a, b, c...
                  const isSelected = isOptionSelected(option);
                  const isAnswered = !!answers[currentQuestion.id];
                  
                  // For feedback after selection
                  const isCorrect = isSelected && !currentQuestion.survey && option === currentQuestion.correctAnswer;
                  const isWrong = isSelected && !currentQuestion.survey && currentQuestion.correctAnswer && option !== currentQuestion.correctAnswer;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full text-left p-4 md:p-5 rounded-full border-2 transition-all duration-200 flex items-center group
                        ${isSelected 
                          ? "border-yellow-400 bg-gradient-to-b from-[#00A3E0] to-[#0055A4] shadow-lg shadow-black/20" 
                          : "border-blue-400 bg-gradient-to-b from-[#00A3E0] to-[#0055A4] hover:border-white/50 shadow-md shadow-black/10"
                        }
                        ${isCorrect ? "ring-2 ring-green-400" : ""}
                        ${isWrong ? "ring-2 ring-red-400" : ""}
                      `}
                    >
                      {currentQuestion.type === "multiple" ? (
                        <div className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center transition-colors ${isSelected ? "bg-yellow-400 border-yellow-400" : "border-yellow-400/50"}`}>
                          {isSelected && <Check className="w-4 h-4 text-[#0047AB]" />}
                        </div>
                      ) : (
                        <span className={`text-xl md:text-2xl font-bold mr-3 ${isSelected ? "text-yellow-400" : "text-yellow-400/80"}`}>
                          {label}.
                        </span>
                      )}
                      <span className={`text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-sm`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed}
                  size="lg"
                  className="h-12 px-8 text-lg font-bold rounded-full bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] shadow-xl"
                >
                  Next <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom White Area with Mascot - Updated */}
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
             className="h-[280px] md:h-[450px] object-contain translate-y-[5%] translate-x-[-15%]"
           />
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={isFinished} onOpenChange={(open) => !open && setLocation("/")}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">Quiz Results</DialogTitle>
          <DialogDescription className="sr-only">
            Congratulations on completing the Nasohold Memory Game. Your final score is {score} out of 7.
          </DialogDescription>
          <div className="relative w-full aspect-[9/16] md:aspect-auto md:h-[85vh] bg-[#0047AB] flex flex-col overflow-hidden font-sans">
            {/* Background Decorative Icons */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <X className="absolute top-20 left-10 text-white w-8 h-8" />
              <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
              <Zap className="absolute top-10 left-1/2 text-yellow-400 w-6 h-6" />
              <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
            </div>

            <Header />

            <main className="flex-1 flex flex-col items-center justify-start px-6 relative z-10 pt-8 text-center">
              <p className="text-[#FFD700] text-xl font-bold uppercase tracking-widest mb-2">THANK YOU FOR PLAYING</p>
              
              <div className="mb-8">
                <p className="text-white text-sm font-medium opacity-80 uppercase tracking-widest">THE</p>
                <h1 className="text-5xl font-bold text-white tracking-tight leading-none">
                  Nasohold<span className="text-2xl align-top">™</span>
                </h1>
                <p className="text-white text-xl font-bold tracking-widest">MEMORY GAME</p>
              </div>

              {/* Score Badge */}
              <div className="w-full bg-gradient-to-b from-[#00A3E0] to-[#0055A4] rounded-full py-4 px-8 mb-8 shadow-xl border-2 border-yellow-400">
                <p className="text-yellow-400 text-3xl md:text-5xl font-bold drop-shadow-lg uppercase tracking-tight">
                  Your Score: {score} / 7
                </p>
              </div>

              <div className="space-y-2 mb-8">
                <h2 className="text-[#FFD700] text-5xl font-serif italic leading-tight">Congratulations!</h2>
                <p className="text-[#FFD700] text-xl font-bold max-w-xs mx-auto leading-tight">
                  You've won a personalized Nasohold calendar featuring your photo.
                </p>
              </div>
            </main>

            {/* Bottom White Area */}
            <div className="h-32 bg-white rounded-t-[3rem] relative z-20 flex items-center justify-center mt-auto pb-4">
              <div className="text-center">
                <h3 className="text-[#0047AB] text-3xl font-bold flex items-center justify-center leading-none">
                  Nasohold<span className="text-sm align-top">™</span>
                </h3>
                <p className="text-[#0047AB] text-sm font-semibold">Nasal Sprays</p>
              </div>
              
              {/* Result Mascot */}
              <div className="absolute right-[2%] -top-40 pointer-events-none w-48 h-48">
                 <Mascot className="scale-125" />
              </div>

              <button 
                onClick={() => setLocation("/")}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
