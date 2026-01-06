import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubmitQuiz } from "@/hooks/use-quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Trophy, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
    
    // Detect refresh by checking performance navigation type
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload") {
      localStorage.removeItem("userEmail"); // Clear registration on refresh
      setLocation("/");
    }
  }, [setLocation, isFinished]);

  const submitQuiz = useSubmitQuiz();

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelect = (option: string) => {
    if (currentQuestion.type === "single") {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
      // Automatically proceed for single choice after a short delay for feedback
      setTimeout(() => {
        if (currentStep < QUESTIONS.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          finishQuiz();
        }
      }, 300);
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
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white rounded-full" />
        <div className="absolute top-1/4 right-10 w-16 h-16 border-2 border-yellow-400 rotate-45" />
        <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-white/10 rounded-lg -rotate-12" />
        <Zap className="absolute top-10 right-1/4 text-yellow-400 w-6 h-6" />
      </div>

      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-0 -mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div className="space-y-6">
              <h2 className="text-xl md:text-3xl font-bold text-white leading-tight">
                {currentStep + 1}. {currentQuestion.text}
              </h2>

              <div className="space-y-4">
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
                      disabled={isAnswered && currentQuestion.type === "single"}
                      className={`
                        w-full text-left p-4 md:p-5 rounded-full border-2 transition-all duration-200 flex items-center group
                        ${isSelected 
                          ? "border-yellow-400 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg" 
                          : "border-blue-400 bg-gradient-to-r from-blue-600 to-blue-700 hover:border-white/50"
                        }
                        ${isCorrect ? "ring-2 ring-green-400" : ""}
                        ${isWrong ? "ring-2 ring-red-400" : ""}
                      `}
                    >
                      <span className={`text-xl md:text-2xl font-bold mr-3 ${isSelected ? "text-yellow-400" : "text-cyan-300"}`}>
                        {label}.
                      </span>
                      <span className={`text-xl md:text-2xl font-bold text-white`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {currentQuestion.type === "multiple" && (
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
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom White Area with Mascot - Compressed */}
      <div className="h-16 bg-white rounded-t-[2rem] relative z-20 flex items-center px-12 mt-auto">
        <div className="flex flex-col">
          <h3 className="text-[#0047AB] text-lg md:text-xl font-bold leading-none">
            Nasohold<span className="text-[10px] align-top">™</span>
          </h3>
          <p className="text-[#0047AB] text-[10px] md:text-xs font-semibold">Nasal Sprays</p>
        </div>
        
        {/* Mascot - positioned like in the image */}
        <div className="absolute right-[10%] -top-12 pointer-events-none">
           <Mascot className="scale-[0.8]" />
        </div>

        {/* Floating elements at bottom */}
        <div className="absolute bottom-4 right-10 opacity-20 hidden md:block">
           <Zap className="text-blue-600 w-8 h-8" />
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={isFinished} onOpenChange={(open) => !open && setLocation("/")}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-3xl font-display text-secondary">Congratulations!</DialogTitle>
            <DialogDescription className="text-lg text-center">
              You have successfully completed the Nasohold knowledge challenge.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 text-center space-y-2">
            <p className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Your Final Score</p>
            <p className="text-6xl font-bold text-primary">
              {score}<span className="text-2xl text-muted-foreground">/5</span>
            </p>
            {submitQuiz.isPending && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <Loader2 className="animate-spin h-4 w-4" /> Saving results...
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-center pb-4">
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl"
            >
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
