import React from 'react';

export default function InputModeSwitcher({ inputMode, setInputMode }) {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg inline-flex mb-6 shadow-sm">
      <button onClick={() => setInputMode('text')} className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${inputMode === 'text' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}>Type or Paste</button>
      <button onClick={() => setInputMode('file')} className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${inputMode === 'file' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'}`}>Upload File</button>
    </div>
  );
}
