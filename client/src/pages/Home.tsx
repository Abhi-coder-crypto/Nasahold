import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { Play, X, Zap, Gamepad2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Must be only digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Home() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      number: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userNumber", data.number);
        window.location.href = "/video";
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0047AB] flex flex-col overflow-hidden font-sans">
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <X className="absolute top-10 left-10 text-white w-8 h-8" />
        <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
        <Zap className="absolute top-5 left-1/2 text-yellow-400 w-6 h-6" />
        <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
        <div className="absolute top-20 left-1/4 w-4 h-4 border-2 border-white rounded-sm" />
        <div className="absolute top-60 right-1/4 w-3 h-3 bg-white rotate-45" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 relative z-10 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2 mb-8"
        >
          <p className="text-white text-xl md:text-2xl font-medium">Welcome to</p>
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Nasohold<span className="text-3xl align-top">™</span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-1">
              MEMORY GAME
            </h2>
          </div>
          <p className="text-[#FFD700] text-lg md:text-2xl font-bold pt-4 max-w-xs md:max-w-md leading-tight">
            Watch the video and test your memory to win exciting prices!!!
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-sm mb-8"
        >
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-md">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            {...field}
                            className="h-12 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            {...field}
                            className="h-12 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Phone Number"
                            {...field}
                            className="h-12 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] font-bold text-lg rounded-md shadow-lg transition-all active:scale-[0.98]"
                  >
                    REGISTER TO PLAY
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Bottom White Wave Area */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-white rounded-t-[3rem] z-0 flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
           {/* Decorative elements at bottom */}
           <div className="absolute top-0 left-0 right-0 flex justify-between px-10 pointer-events-none translate-y-[-50%]">
              <div className="w-10 h-10 border-2 border-pink-400 rotate-12 rounded-sm" />
              <div className="w-8 h-8 border-2 border-blue-400 -rotate-12 rounded-full" />
           </div>
           
           <div className="text-center pt-8">
              <h3 className="text-[#0047AB] text-3xl md:text-4xl font-bold flex items-center justify-center">
                Nasohold<span className="text-sm align-top">™</span>
              </h3>
              <p className="text-[#0047AB] text-sm md:text-base font-semibold">Nasal Sprays</p>
           </div>
        </div>
      </div>

      {/* Mascot Positioned at the bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <Mascot className="scale-90 md:scale-125" />
      </div>
    </div>
  );
}
