"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

export default function UserGreetings() {
  const [isMounted, setIsMounted] = useState(false);
  const name = useAuthStore((state) => state.user?.name || "");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Hello!</h1>
        <p className="text-xs text-zinc-400">Welcome to your dashboard</p>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        {timeGreeting}{name ? `, ${name}` : ""}!
      </h1>
      <p className="text-xs text-zinc-400">Welcome to your dashboard</p>
    </div>
  );
}