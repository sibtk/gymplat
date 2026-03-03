"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    setError("");

    const success = login(data.username, data.password);
    if (success) {
      router.push("/dashboard" as string);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 30% 80%, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 40% at 70% 80%, rgba(139,92,246,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Dumbbell className="h-6 w-6 text-peec-dark" />
          </div>
          <h1 className="text-xl font-bold text-peec-dark">LEDGR</h1>
          <p className="mt-1 text-sm text-peec-text-tertiary">
            Sign in to your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl border border-white/[0.08] p-6">
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="relative z-10 space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-peec-dark"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-peec-dark"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 pr-10 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-peec-text-muted hover:text-peec-dark"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/10 px-4 py-2.5 text-sm font-medium text-peec-dark transition-all hover:bg-white/15 hover:border-white/15 animate-pulse-glow"
            >
              Sign in
            </button>
          </form>

          {/* Demo hint */}
          <div className="relative z-10 mt-4 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center text-xs text-peec-text-tertiary">
            Demo credentials: <span className="font-medium text-peec-dark">admin</span> / <span className="font-medium text-peec-dark">admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
