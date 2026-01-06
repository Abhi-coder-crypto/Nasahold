import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Mascot } from "@/components/Mascot";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  number: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9]+$/, "Must be only digits"),
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
        window.location.href = "/video";
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 lg:px-20 relative z-10 gap-8 py-8">
        {/* Left Side: Welcome Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left space-y-4 md:space-y-6 max-w-xl"
        >
          {/* Badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs tracking-wider uppercase">
            Nasohold Memory Game
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-secondary leading-tight">
            Welcome to <br />
            <span className="text-primary">Nasohold</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
            Watch the video and test your memory to win exciting prizes!
          </p>

          {/* Mascot in the middle for layout balance on mobile */}
          <div className="lg:hidden flex justify-center py-4">
            <Mascot className="scale-75" />
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link href="/video">
              <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 group w-full sm:w-auto">
                Watch Video <Play className="ml-2 h-5 md:h-6 w-5 md:w-6 fill-current" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Center: Mascot (Desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex flex-1 justify-center items-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
            <Mascot className="scale-110" />
          </div>
        </motion.div>

        {/* Right Side: Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex-1 w-full max-w-md"
        >
          <Card className="border-primary/10 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display text-secondary">Get Started</CardTitle>
              <p className="text-sm text-muted-foreground">Enter your details to play and win</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/50" />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} className="bg-white/50" />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} className="bg-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 rounded-md shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                    Register to Play
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
