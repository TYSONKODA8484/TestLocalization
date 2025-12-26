import React from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function QAReportModal({ open, findings = [], onClose }) {
  if (!open) return null;
  const hasFindings = findings.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">QA Findings</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {hasFindings ? `${findings.length} issues corrected` : 'No issues detected'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {!hasFindings && (
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle2 size={20} />
              <span>QA completed and no corrections were needed.</span>
            </div>
          )}

          {hasFindings && (
            <div className="space-y-4">
              {findings.map((item, idx) => (
                <div
                  key={`${item.source}-${item.language}-${idx}`}
                  className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-900/20"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/40 px-2 py-1 rounded">
                          {item.language}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-300">{item.source}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Original</p>
                          <div className="mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">
                            {item.original || '\u2014'}
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Corrected</p>
                          <div className="mt-1 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words">
                            {item.corrected || '\u2014'}
                          </div>
                        </div>
                      </div>
                      {item.notes && item.notes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Notes</p>
                          <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-200 space-y-1">
                            {item.notes.map((note, nIdx) => (
                              <li key={nIdx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
