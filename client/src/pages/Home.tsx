import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { X, Zap, Gamepad2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .endsWith("@gmail.com", "Only Gmail addresses are allowed"),
  number: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
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
    <div className="relative h-screen bg-[#0047AB] flex flex-col overflow-hidden font-sans">
      <Header />
      
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <X className="absolute top-20 left-10 text-white w-8 h-8" />
        <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
        <Zap className="absolute top-10 left-1/2 text-yellow-400 w-6 h-6" />
        <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pt-2 pb-8 md:pt-4 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-0.5 mb-2 mt-4 md:mt-2"
        >
          <p className="text-white text-base md:text-lg font-medium">Welcome to</p>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
              Nasohold<span className="text-xl lg:text-2xl align-top">™</span>
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
              MEMORY GAME
            </h2>
          </div>
          <p className="text-[#FFD700] text-sm md:text-base lg:text-lg font-bold pt-1 max-w-xs md:max-w-md lg:max-w-lg leading-tight">
            Watch the video and test your memory to win exciting prices!!!
          </p>
        </motion.div>

        {/* Mascot Positioned left-ish but not overlapping form */}
        <div className="absolute left-[2%] -bottom-[5%] z-30 pointer-events-none hidden lg:block">
          <Mascot className="scale-90" />
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-sm z-20 -mt-4 md:mt-0"
        >
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-md">
            <CardContent className="pt-4 pb-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            {...field}
                            className="h-9 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            {...field}
                            className="h-9 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Input
                            placeholder="Phone Number"
                            {...field}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, "");
                              if (value.length <= 10) {
                                field.onChange(value);
                              }
                            }}
                            className="h-9 bg-white text-gray-900 placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] font-bold text-base rounded-md shadow-lg transition-all active:scale-[0.98]"
                  >
                    REGISTER TO PLAY
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Mobile Mascot - repositioned above the white footer area */}
      <div className="lg:hidden absolute bottom-16 left-1/2 -translate-x-1/2 scale-[0.7] z-20">
         <Mascot />
      </div>

      {/* Bottom White Area - Further Compressed */}
      <div className="h-20 bg-white rounded-t-[2rem] relative z-10 flex items-center justify-center mt-auto">
        <div className="text-center">
          <h3 className="text-[#0047AB] text-lg md:text-xl font-bold flex items-center justify-center leading-tight">
            Nasohold<span className="text-[10px] align-top">™</span>
          </h3>
          <p className="text-[#0047AB] text-[10px] md:text-xs font-semibold">Nasal Sprays</p>
        </div>
      </div>
    </div>
  );
}
