'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authService } from '@/service/auth.service';

interface LogoutButtonProps {
  iconOnly?: boolean;
}

export default function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();
  const logout = useAuthStore((state: { logout: any; }) => state.logout);

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        logout();
      })
      .finally(() => {
        router.push('/auth?mode=login');
      })
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleLogout}
        title="Sign Out"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </button>
  );
}