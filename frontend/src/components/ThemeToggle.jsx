import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, appliedTheme, setTheme }) {
  return (
    <div className="inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-lg shadow-sm">
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}
        title="Use system theme"
      >
        Auto
      </button>
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}
        title="Light mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}
        title="Dark mode"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
