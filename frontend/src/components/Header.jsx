import React from 'react';
import { Square, Menu } from 'lucide-react';

export default function Header({ scenario, onBack, isLocalizing, onStop, onToggleSidebar }) {
  const SIcon = scenario.icon;
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Back to Home">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            L
          </div>
          <span className="font-bold text-lg">Localizer</span>
        </button>
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
          <div className={`p-2 rounded-lg ${scenario.color} ${scenario.textColor}`}>
            <SIcon size={20} />
          </div>
          <h2 className="font-bold text-lg">{scenario.title} Project</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLocalizing && (
          <button
            onClick={onStop}
            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 shadow-sm"
            title="Stop Localization"
          >
            <Square size={16} /> Stop Localization
          </button>
        )}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
