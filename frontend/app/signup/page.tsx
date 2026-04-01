"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Vortex } from "@/components/ui/vortex";

export default function SignupPage() {
  const { signup, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({ name, email, password });
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Match the variation you chose in login page! */}

      {/* VARIATION 1: Green Matrix Style - Current Active */}
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >

      {/* VARIATION 2: Purple Cyberpunk
      <Vortex
        backgroundColor="black"
        rangeY={1000}
        particleCount={700}
        baseHue={280}
        baseSpeed={0.1}
        rangeSpeed={2}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 3: Blue Ocean
      <Vortex
        backgroundColor="#0a0f1e"
        rangeY={800}
        particleCount={600}
        baseHue={200}
        baseSpeed={0.05}
        rangeSpeed={1.2}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 4: Pink/Magenta Dream
      <Vortex
        backgroundColor="#0d0011"
        rangeY={800}
        particleCount={500}
        baseHue={320}
        baseSpeed={0.1}
        rangeSpeed={1.8}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 5: Orange Sunset
      <Vortex
        backgroundColor="#0a0604"
        rangeY={800}
        particleCount={600}
        baseHue={30}
        baseSpeed={0.08}
        rangeSpeed={1.5}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 6: Cyan/Teal
      <Vortex
        backgroundColor="#000a0a"
        rangeY={800}
        particleCount={500}
        baseHue={180}
        baseSpeed={0.1}
        rangeSpeed={1.6}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 7: Rainbow Spectrum
      <Vortex
        backgroundColor="black"
        rangeY={1000}
        particleCount={800}
        baseHue={0}
        baseSpeed={0.15}
        rangeSpeed={2.5}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

      {/* VARIATION 8: Red Energy
      <Vortex
        backgroundColor="#0f0000"
        rangeY={800}
        particleCount={500}
        baseHue={0}
        baseSpeed={0.1}
        rangeSpeed={1.8}
        className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
      >
      */}

        <Card className="w-full max-w-sm backdrop-blur-xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="grid gap-4">
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Vortex>
    </div>
  );
}
