interface OnboardingLayoutProps {
  children: React.ReactNode;
}


export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <main className="flex-1 overflow-y-auto max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}