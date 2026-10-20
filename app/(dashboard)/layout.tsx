'use client';

import Sidebar from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}