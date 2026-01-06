import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertQuizSubmission } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertQuizSubmission) => {
      const res = await fetch(api.quiz.submit.path, {
        method: api.quiz.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit quiz");
      }

      return api.quiz.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your quiz results have been submitted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
