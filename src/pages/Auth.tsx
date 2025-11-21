import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

const AUTH_BG_IMAGE =
  "https://harmless-tapir-303.convex.cloud/api/storage/d4b06ad4-1ee6-4cd0-9013-44a43d35922b";

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  // Smoothly auto-clear any error after a short delay
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      
      console.log("Sending OTP to:", email);
      await signIn("email-otp", formData);
      console.log("OTP sent successfully");
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      
      // Ensure both email and code are present
      console.log("Verifying OTP - Email:", formData.get("email"), "Code length:", formData.get("code")?.toString().length);
      
      await signIn("email-otp", formData);

      console.log("OTP verified, signed in successfully");

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);

      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Provide more specific error messages
      if (errorMsg.includes("expired")) {
        setError("The verification code has expired. Please request a new one.");
      } else if (errorMsg.includes("invalid") || errorMsg.includes("incorrect")) {
        setError("The verification code you entered is incorrect. Please try again.");
      } else {
        setError("Verification failed. Please try again or request a new code.");
      }
      
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Triggers Google OAuth via Convex Auth (ensure Google provider is configured)
      await signIn("google");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-white"
      style={{
        backgroundImage: `url(${AUTH_BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80 backdrop-blur-sm" />
        <div className="relative flex-1 flex items-center justify-center px-4 py-12">
          <Card className="mx-auto w-full max-w-md min-w-[350px] pb-0 border border-white/10 bg-black/70 text-white shadow-[0_0_50px_rgba(255,255,255,0.2)] backdrop-blur-xl">
            {step === "signIn" ? (
              <>
                <CardHeader className="text-center space-y-3">
                  <div className="flex justify-center">
                    <img
                      src="./logo.svg"
                      alt="Luxe Monogram"
                      width={64}
                      height={64}
                      className="rounded-lg mb-4 mt-4 cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-3xl tracking-[0.35em] text-white">
                    LUXE
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Enter your email to log in or sign up
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9"
                          disabled={isLoading}
                          required
                          onChange={() => {
                            if (error) setError(null);
                          }}
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                        className="size-11 rounded-full border-white/40 bg-black/70 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/60 focus-visible:ring-offset-0"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center mt-4">
                  <CardTitle>Check your email</CardTitle>
                  <CardDescription>
                    We've sent a code to {step.email}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />

                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={(val) => {
                          setOtp(val);
                          if (error) setError(null);
                        }}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="bg-black/80 text-white border-white/30 focus-visible:ring-white/60 focus-visible:border-white/80"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500 text-center">
                        {error}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Didn't receive a code?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => {
                          setStep("signIn");
                          setOtp("");
                          setError(null);
                        }}
                      >
                        Try again
                      </Button>
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify code
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep("signIn");
                        setOtp("");
                        setError(null);
                      }}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
              Secured by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}