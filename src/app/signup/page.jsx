"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
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
  FaUser,
  FaImage,
  FaCircleCheck,
  FaCircleXmark,
  FaUtensils,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";

/* ---------- password rule helpers ---------- */
const RULES = [
  { id: "length", label: "At least 6 characters", test: (p) => p.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
];

function PasswordRule({ label, met }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {met ? (
        <FaCircleCheck className="size-3.5 shrink-0 text-success" />
      ) : (
        <FaCircleXmark className="size-3.5 shrink-0 text-muted" />
      )}
      <span className={met ? "text-success" : "text-muted"}>{label}</span>
    </li>
  );
}

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    imageUrl: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const passwordRules = RULES.map((r) => ({
    ...r,
    met: r.test(form.password),
  }));
  const passwordValid = passwordRules.every((r) => r.met);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl))
      errs.imageUrl = "Enter a valid image URL (http/https).";
    if (!form.password) errs.password = "Password is required.";
    else if (!passwordValid)
      errs.password = "Password does not meet all requirements.";
    return errs;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setPasswordTouched(true);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        image: form.imageUrl || undefined,
      });
      if (error) {
        if (error.message?.toLowerCase().includes("email")) {
          setErrors({ email: "An account with this email already exists." });
        } else {
          toast.error(error.message || "Registration failed. Please try again.");
        }
        return;
      }
      toast.success("Account created! Welcome to RecipeHub 🎉");
      router.push("/");
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
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-separator bg-surface p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <FaUtensils className="size-5" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold text-surface-foreground">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Join RecipeHub and start sharing
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
            <span className="text-xs text-muted">or sign up with email</span>
            <Separator className="flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} noValidate className="flex flex-col gap-5">
            {/* Name */}
            <TextField
              name="name"
              isInvalid={!!errors.name}
              isRequired
              className="w-full"
            >
              <Label>Full name</Label>
              <InputGroup fullWidth>
                <InputGroup.Prefix>
                  <FaUser className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={set("name")}
                />
              </InputGroup>
              <FieldError>{errors.name}</FieldError>
            </TextField>

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
                  value={form.email}
                  onChange={set("email")}
                />
              </InputGroup>
              <FieldError>{errors.email}</FieldError>
            </TextField>

            {/* Image URL */}
            <TextField
              name="imageUrl"
              type="url"
              isInvalid={!!errors.imageUrl}
              className="w-full"
              isRequired
            >
              <Label>
                Profile image URL
              </Label>
              <InputGroup fullWidth>
                <InputGroup.Prefix>
                  <FaImage className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="https://example.com/avatar.jpg"
                  value={form.imageUrl}
                  onChange={set("imageUrl")}
                />
              </InputGroup>
              <FieldError>{errors.imageUrl}</FieldError>
            </TextField>

            {/* Password */}
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              isInvalid={!!errors.password}
              isRequired
              className="w-full"
            >
              <Label>Password</Label>
              <InputGroup fullWidth>
                <InputGroup.Prefix>
                  <FaLock className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    set("password")(e);
                    setPasswordTouched(true);
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

            {/* Live password rules — shown once user starts typing */}
            {passwordTouched && (
              <ul className="flex flex-col gap-1.5 rounded-xl border border-separator bg-background px-4 py-3">
                {passwordRules.map((r) => (
                  <PasswordRule key={r.id} label={r.label} met={r.met} />
                ))}
              </ul>
            )}

            <Button
              type="submit"
              variant="primary"
              className="mt-1 w-full"
              isDisabled={loading || googleLoading}
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <NextLink
              href="/login"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </NextLink>
          </p>
        </div>
      </div>
    </main>
  );
}