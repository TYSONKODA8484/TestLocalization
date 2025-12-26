import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function ProcessingOverlay({ visible, scenarioTitle, languagesCount, entriesCount = 0, progress, title, subtitle }) {
  if (!visible) return null;
  const totalPairs = Math.max(entriesCount * languagesCount, 0);
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="animate-spin text-blue-600" size={36} />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title || 'Analyzing & Localizing...'}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{subtitle || `Applying ${scenarioTitle} constraints for ${languagesCount} languages.`}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{entriesCount} entries • {languagesCount} languages • {totalPairs} checks</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{Math.round(progress)}% Complete</span>
      </div>
    </div>
  );
}
