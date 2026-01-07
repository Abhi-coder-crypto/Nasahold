import welcomeLogo from "@assets/WhatsApp_Image_2026-01-07_at_10.23.26__1_-removebg-preview_1767762590148.png";
import logoLeft from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767763199983.png";
import mascotImg from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23__1_-removebg-preview_1767770695897.png";
import footerDecorative from "@assets/image_1767763325734.png";
import mobileBg from "@assets/image_1767776793981.png";
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
    .transform(val => val.toLowerCase())
    .refine(val => val.endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed"
    }),
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
        localStorage.setItem("userEmail", data.email.toLowerCase());
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userNumber", data.number);
        window.location.href = "/video";
      } else {
        const errorText = await response.text();
        let errorMessage = "Registration failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error JSON:", errorText);
        }

        if (response.status === 409) {
          form.setError("email", { message: errorMessage });
        } else {
          console.error("Registration failed:", errorMessage);
        }
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

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
      
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
        <X className="absolute top-20 left-10 text-white w-8 h-8" />
        <Plus className="absolute top-40 right-10 text-white w-6 h-6" />
        <Zap className="absolute top-10 left-1/2 text-yellow-400 w-6 h-6" />
        <Gamepad2 className="absolute top-32 left-5 text-blue-300 w-10 h-10 -rotate-12" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pt-2 pb-4 md:pt-2 md:pb-6 -mt-8 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-4 md:mb-8 mt-12 md:mt-0 flex flex-col items-center"
        >
          <img 
            src={logoLeft} 
            alt="Nasohold" 
            className="h-10 md:h-16 object-contain brightness-0 invert"
          />
          <img 
            src={welcomeLogo} 
            alt="Welcome to Nasohold Memory Game" 
            className="w-full max-w-[280px] md:max-w-[400px] object-contain relative z-10"
          />
        </motion.div>

        {/* Mascot Positioned left-ish but not overlapping form */}
        <div className="absolute left-[5%] bottom-[0%] z-30 pointer-events-none hidden lg:block">
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-[340px] z-20 mt-4 md:mt-0"
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
                            className="h-10 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
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
                            className="h-10 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
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
                            className="h-10 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#FFD700] hover:bg-[#FFC800] text-[#0047AB] font-bold text-base rounded-md shadow-lg transition-all active:scale-[0.98]"
                  >
                    REGISTER TO PLAY
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Mobile Mascot - Removed */}

      {/* Bottom White Area - Updated with Logo and Mascot */}
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
             className="h-[280px] md:h-[450px] object-contain translate-y-[5%] translate-x-[-30%]"
           />
        </div>
      </div>
    </div>
  );
}
