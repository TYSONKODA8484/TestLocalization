import React from 'react';
import { Check, Download, FileText, ArrowLeft } from 'lucide-react';
import { showToast } from './ToastContainer.jsx';

export default function FileSuccess({ scenarioTitle, langCount, onProcessAnother }) {
  const handleDownload = () => {
    showToast('Download feature coming soon!', 'info');
  };

  const handleReport = () => {
    showToast('Report generation coming soon!', 'info');
  };

  return (
    <div className="max-w-5xl">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Localization Complete</span>
        </div>

        {/* Content */}
        <div className="p-12 text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="text-green-600 dark:text-green-400" size={48} strokeWidth={3} />
          </div>
          
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-100">Success!</h2>
          
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-md mx-auto">
            Your content has been localized for <strong>{langCount} {langCount === 1 ? 'language' : 'languages'}</strong>.<br/>
            <span className="text-sm">Project: <strong>{scenarioTitle}</strong></span>
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <Download size={20} /> Download All (.zip)
            </button>
            
            <button 
              onClick={handleReport}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3.5 rounded-lg font-bold hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600 shadow-md hover:shadow-lg transition-all"
            >
              <FileText size={20} /> Download Report (.pdf)
            </button>
          </div>

          {/* Process Another */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button 
              onClick={onProcessAnother} 
              className="flex items-center gap-2 mx-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Process another file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
