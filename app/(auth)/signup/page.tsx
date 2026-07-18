"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const REFERRAL_STORAGE_KEY = "bento-referral-code";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Check localStorage for referral code on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (stored && stored.trim().length > 0) {
        setReferralCode(stored.trim().toUpperCase());
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const applyReferral = async () => {
    if (!referralCode) return;
    try {
      await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode }),
      });
      // Clear referral from storage after applying
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {
      // Non-blocking — referral may be applied later
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      switch (error.message) {
        case "User already registered":
          setServerError(
            "An account with this email already exists. Please sign in instead."
          );
          break;
        case "Password should be at least 8 characters":
          setServerError("Password must be at least 8 characters.");
          break;
        default:
          setServerError(error.message);
      }
      return;
    }

    // Attempt to apply referral code after signup
    await applyReferral();

    // Trigger welcome email (fire-and-forget — won't block the flow)
    fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.fullName }),
    }).catch(() => {
      // Silently ignore — email failures should never break signup
    });

    setIsSuccess(true);
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      setIsGoogleLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2 pb-6">
          <p className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSuccess(false)}
              className="font-medium text-primary hover:text-primary/90 transition-colors"
            >
              try again
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Start saving today
        </CardTitle>
        <CardDescription>
          Create your Bento account. Free 30-day trial, no credit card required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google OAuth */}
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        {/* Referral banner */}
        {referralCode && (
          <div className="flex items-start gap-2 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-sm">
            <Gift className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-emerald-700 dark:text-emerald-300">
              🎉 You&apos;ve been referred! Get your <span className="font-semibold">first month free</span> when you subscribe.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              disabled={isLoading}
              className={cn(errors.fullName && "border-destructive")}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isLoading}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              disabled={isLoading}
              className={cn(errors.password && "border-destructive")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and a
              number.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              disabled={isLoading}
              className={cn(errors.confirmPassword && "border-destructive")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              className="mt-1"
              onCheckedChange={(checked) =>
                setValue("acceptTerms", checked === true)
              }
            />
            <div className="grid gap-1">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-snug cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
