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
} from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  color: string; // Tailwind background/text color classes
}

export const categoryMetadataMap: Record<string, CategoryMeta> = {
  // Original Categories
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
  "Food Delivery & Snacks": {
    icon: Coffee,
    color: "bg-orange-600/20 text-orange-600",
  },
  "Household Supplies & Toiletries": {
    icon: Package,
    color: "bg-teal-500/20 text-teal-600",
  },
};