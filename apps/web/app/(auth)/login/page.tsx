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
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-peec-dark">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-peec-dark">GymPlatform</h1>
          <p className="mt-1 text-sm text-peec-text-tertiary">
            Sign in to your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-peec-border-light bg-white p-6 shadow-card">
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                className="w-full rounded-lg border border-peec-border-light bg-white px-3 py-2 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
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
                  className="w-full rounded-lg border border-peec-border-light bg-white px-3 py-2 pr-10 text-sm text-peec-dark placeholder:text-peec-text-muted focus:border-peec-dark focus:outline-none focus:ring-1 focus:ring-peec-dark"
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-peec-dark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              Sign in
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-center text-xs text-peec-text-tertiary">
            Demo credentials: <span className="font-medium text-peec-dark">admin</span> / <span className="font-medium text-peec-dark">admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
