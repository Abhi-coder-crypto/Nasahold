import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubmitQuiz } from "@/hooks/use-quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Trophy } from "lucide-react";
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
  
  const submitQuiz = useSubmitQuiz();

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelect = (option: string) => {
    if (currentQuestion.type === "single") {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
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
    try {
      const email = localStorage.getItem("userEmail");
      await submitQuiz.mutateAsync({
        answers: answers,
        score: calculatedScore,
        email: email || undefined // Send email if available
      } as any);
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center max-w-4xl relative z-10 mb-20 md:mb-0">
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full bg-blue-100" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div className="glass-card rounded-3xl p-6 md:p-10 shadow-2xl">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">
                {currentQuestion.survey ? "Survey" : "Quiz Question"}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-display text-secondary mt-2 mb-8 leading-snug">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                      ${isOptionSelected(option) 
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                        : "border-border hover:border-primary/50 hover:bg-white/50 bg-white/30"
                      }
                    `}
                  >
                    <span className={`text-lg font-medium ${isOptionSelected(option) ? "text-primary" : "text-foreground"}`}>
                      {option}
                    </span>
                    
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isOptionSelected(option) 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground/30 group-hover:border-primary/50"
                      }
                    `}>
                      {isOptionSelected(option) && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed}
                  size="lg"
                  className="px-8 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20"
                >
                  {currentStep === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </main>

      <div className="fixed bottom-4 left-4 z-20 pointer-events-none hidden md:block">
        <Mascot className="scale-75 origin-bottom-left" />
      </div>

      {/* Result Dialog */}
      <Dialog open={isFinished} onOpenChange={(open) => !open && setLocation("/")}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-3xl font-display text-secondary">Quiz Completed!</DialogTitle>
            <DialogDescription className="text-lg text-center">
              Thank you for participating in the Nasohold knowledge challenge.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 text-center space-y-2">
            <p className="text-muted-foreground uppercase tracking-wider text-sm font-semibold">Your Score</p>
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
