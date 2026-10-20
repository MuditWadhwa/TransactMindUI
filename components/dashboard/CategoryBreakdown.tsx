"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Utensils,
  Home,
  Zap,
  Fuel,
  HeartPulse,
  Shield,
  ShoppingBag,
  Tv,
  GraduationCap,
  TrendingUp,
  Gift,
  Plane,
  Wrench,
  HelpCircle,
  Users,
  Sparkles,
  Building2,
  Wifi,
  Smile,
  PawPrint,
  CreditCard,
  Apple,
  Milk,
  Coffee,
  Package,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { CategoryBreakdownDto } from "@/types/dashboard.dto";
import { dashboardService } from "@/service/dashboard.service";



export default function CategoryBreakdown() {
  const [categories, setCategories] = useState<CategoryBreakdownDto[]>([]);
  const refreshTrigger = useDashboardStore((state) => state.refreshTrigger);

  useEffect(() => {
    dashboardService
      .getCategoryBreakdown()
      .then((data) => setCategories(data || []))
      .catch(() => { });
  }, [refreshTrigger]);

  const totalSpent = categories.reduce((acc, c) => acc + c.totalAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Category Spend</h2>
          <p className="text-xs text-zinc-400">Total: {formatCurrency(totalSpent)}</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {categories.map((cat) => {
          console.log('category: ' + cat.categoryName)

          const Icon = cat.categoryName !== 'Uncategorized' ? categoryMetadataMap[cat.categoryName].icon : TriangleAlert;
          const iconColor = cat.categoryName !== 'Uncategorized' ? categoryMetadataMap[cat.categoryName].color : 'bg-amber-900/20 text-amber-600';

          return (
            <div key={cat.categoryName} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${iconColor}`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                  <span className="font-semibold text-zinc-200">{cat.categoryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[11px]">{cat.percentage.toFixed(2)}%</span>
                  <span className="font-bold text-white">{formatCurrency(cat.totalAmount)}</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">

                <div className={`h-full ${iconColor.split(' ')[0].replace('900/20', '500')} rounded-full transition-all`} style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


interface CategoryMeta {
  icon: LucideIcon;
  color: string;
}

const categoryMetadataMap: Record<string, CategoryMeta> = {
  "Groceries": {
    icon: ShoppingCart,
    color: "bg-emerald-900/20 text-emerald-600",
  },
  "Dining Out": {
    icon: Utensils,
    color: "bg-amber-900/20 text-amber-600",
  },
  "Rent/EMI": {
    icon: Home,
    color: "bg-blue-900/20 text-blue-600",
  },
  "Utilities (Electricity/Water)": {
    icon: Zap,
    color: "bg-yellow-900/20 text-yellow-600",
  },
  "Fuel/Transportation": {
    icon: Fuel,
    color: "bg-orange-900/20 text-orange-600",
  },
  "Health & Medical": {
    icon: HeartPulse,
    color: "bg-rose-900/20 text-rose-600",
  },
  "Insurance": {
    icon: Shield,
    color: "bg-indigo-900/20 text-indigo-600",
  },
  "Shopping (Clothing/Electronics)": {
    icon: ShoppingBag,
    color: "bg-purple-900/20 text-purple-600",
  },
  "Entertainment & OTT": {
    icon: Tv,
    color: "bg-pink-900/20 text-pink-600",
  },
  "Education": {
    icon: GraduationCap,
    color: "bg-cyan-900/20 text-cyan-600",
  },
  "Investments (SIP/Stocks)": {
    icon: TrendingUp,
    color: "bg-teal-900/20 text-teal-600",
  },
  "Gifts & Donations": {
    icon: Gift,
    color: "bg-fuchsia-900/20 text-fuchsia-600",
  },
  "Travel & Vacation": {
    icon: Plane,
    color: "bg-sky-900/20 text-sky-600",
  },
  "Maintenance & Repairs": {
    icon: Wrench,
    color: "bg-stone-900/20 text-stone-600",
  },
  "Miscellaneous": {
    icon: HelpCircle,
    color: "bg-slate-900/20 text-slate-600",
  },

  "Domestic Help & Services": {
    icon: Users,
    color: "bg-violet-900/20 text-violet-600",
  },
  "Festivals & Puja": {
    icon: Sparkles,
    color: "bg-amber-500/20 text-amber-500",
  },
  "Society Maintenance & Taxes": {
    icon: Building2,
    color: "bg-zinc-900/20 text-zinc-600",
  },
  "Broadband & Mobile Bills": {
    icon: Wifi,
    color: "bg-blue-500/20 text-blue-500",
  },
  "Personal Care & Grooming": {
    icon: Smile,
    color: "bg-rose-500/20 text-rose-500",
  },
  "Pets & Animals": {
    icon: PawPrint,
    color: "bg-orange-500/20 text-orange-500",
  },
  "Informal Loans & Borrowings": {
    icon: CreditCard,
    color: "bg-red-900/20 text-red-600",
  },

  "Vegetables & Fruits": {
    icon: Apple,
    color: "bg-lime-900/20 text-lime-600",
  },
  "Milk & Dairy": {
    icon: Milk,
    color: "bg-sky-500/20 text-sky-500",
  },
  "Food & Snacks": {
    icon: Coffee,
    color: "bg-orange-600/20 text-orange-600",
  },
  "Household Supplies & Toiletries": {
    icon: Package,
    color: "bg-teal-500/20 text-teal-600",
  },
};