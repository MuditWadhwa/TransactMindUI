'use client';

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') || 'login';
  const isLogin = mode === 'login';

  const switchMode = (newMode: 'login' | 'register') => {
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-zinc-800/80 bg-gradient-to-br from-purple-950/30 via-zinc-950 to-zinc-900 p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5 z-10">
          {/* <Logo size={64} /> */}

          <span className="font-bold tracking-tight text-white text-lg">TransactMind</span>
        </div>

        <div className="max-w-md space-y-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span>AI-Powered Financial Hub</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Track expenses smarter with AI intelligence.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instantly add expenses, predict monthly budgets, and analyze spending habits seamlessly using modern intelligence.
          </p>

          <div className="space-y-3 pt-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Natural language transaction logging with AI</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Real-time monthly trends and burn rate analytics</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Personalized financial advice and AI assistant</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 z-10">
          TransactMind &copy; {new Date().getFullYear()} • Intelligent Finance
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-lg">TransactMind</span>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="text-center text-xs text-zinc-400 pt-2">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                >
                  Sign up <ArrowRight className="h-3 w-3" />
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                >
                  Sign in <ArrowRight className="h-3 w-3" />
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-zinc-950" />}>
      <AuthContent />
    </Suspense>
  );
}