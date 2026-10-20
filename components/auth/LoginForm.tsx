'use client';

import { IS_PROD } from "@/config";
import { authService } from "@/service/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginFormValues, loginSchema } from "@/validations/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Mail, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: IS_PROD ? "" : "muditwadhwa1@gmail.com",
      password: IS_PROD ? "" : "1234567890"
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMsg('');
      const { auth, user } = await authService.login(data);
      setAuth(auth, user);

      router.push(user.isOnboardingComplete ? '/dashboard' : '/onboarding');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Invalid email or password';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
        <p className="mt-1.5 text-xs text-zinc-400">Please sign in to your TransactMind account</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Email Address
          </label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Password
          </label>
          <div className="relative mt-1.5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
              <Lock className="h-4 w-4" />
            </span>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 shadow-lg shadow-purple-950/50"
        >
          {isSubmitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
    </div>
  );
}