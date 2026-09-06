import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Requirements state: "Summary: No theme toggle here — the toggle lives in the header (see Layout above). Confirm the theme choice still persists and applies across all pages."
  // Wait, the prompt says "No theme toggle here — the toggle lives in the header". It implies the toggle shouldn't be ON the summary page itself, but it IS in the header. We'll just always show it in the header.

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
      <div className="flex items-center gap-2 md:hidden">
        {/* Only show logo on mobile in header, as sidebar has it on desktop */}
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Walletter</h1>
      </div>
      <div className="hidden md:block">
        {/* Empty space for desktop to keep flex-between if needed, or we can just move toggle to right */}
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-auto"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
    </header>
  );
}
