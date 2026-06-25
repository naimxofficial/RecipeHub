"use client";

import { useState, Suspense } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FieldError,
  InputGroup,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaUtensils,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";


function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-separator bg-surface p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <FaUtensils className="size-5" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold text-surface-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Log in to your RecipeHub account
            </p>
          </div>

          {/* Google button */}
          <Button
            variant="outline"
            className="w-full"
            onPress={handleGoogle}
            isDisabled={googleLoading || loading}
          >
            {googleLoading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FaGoogle className="size-4" />
            )}
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted">or continue with email</span>
            <Separator className="flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <TextField
              name="email"
              type="email"
              isInvalid={!!errors.email}
              isRequired
              className="w-full"
            >
              <Label>Email address</Label>
              <InputGroup fullWidth>
                <InputGroup.Prefix>
                  <FaEnvelope className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
              </InputGroup>
              <FieldError>{errors.email}</FieldError>
            </TextField>

            {/* Password */}
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              isInvalid={!!errors.password}
              isRequired
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <NextLink
                  href="/forgot-password"
                  className="text-xs text-accent hover:underline"
                >
                  Forgot password?
                </NextLink>
              </div>
              <InputGroup fullWidth>
                <InputGroup.Prefix>
                  <FaLock className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <InputGroup.Suffix>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="px-1 text-muted transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="size-4" />
                    ) : (
                      <FaEye className="size-4" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError>{errors.password}</FieldError>
            </TextField>

            <Button
              type="submit"
              variant="primary"
              className="mt-1 w-full"
              isDisabled={loading || googleLoading}
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <NextLink
              href="/signup"
              className="font-medium text-accent hover:underline"
            >
              Sign up
            </NextLink>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="size-9 animate-spin rounded-full border-3 border-accent border-t-transparent" />
            <p className="text-xs font-medium text-muted">Securing dynamic access portal...</p>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}