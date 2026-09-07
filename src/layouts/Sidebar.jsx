import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Calendar as CalendarIcon,
  PieChart,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import walletterLogo from "../assets/walletter logo.png";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Records", path: "/records", icon: Wallet },
  { name: "Add Transaction", path: "/add", icon: PlusCircle },
  { name: "Calendar", path: "/calendar", icon: CalendarIcon },
  { name: "Summary", path: "/summary", icon: PieChart },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-full sticky top-0 left-0">
      <div className="p-6">
        <div className="flex items-end gap-2">
          <img
            src={walletterLogo}
            alt="Walletter logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
            Walletter
          </h1>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              twMerge(
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800",
                  isActive &&
                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
                ),
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 flex justify-around p-3">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            twMerge(
              clsx(
                "flex flex-col items-center gap-1 p-2 rounded-lg text-slate-500 dark:text-slate-400 transition-colors",
                isActive &&
                  "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
              ),
            )
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
