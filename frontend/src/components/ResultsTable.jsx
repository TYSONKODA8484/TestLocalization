import React from 'react';
import { AlertCircle, Check, Copy, Download } from 'lucide-react';

export default function ResultsTable({ tableData, selectedLangCode, scenarioId, onProcessAnother }) {
  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Localization Results</h3>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all">
            <Copy size={16}/> Copy JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all">
            <Download size={16}/> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold w-16">ID</th>
                <th className="px-6 py-4 font-bold">Source (English)</th>
                <th className="px-6 py-4 font-bold">Target ({selectedLangCode})</th>
                <th className="px-6 py-4 font-bold w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-300 font-mono text-xs">{row.id + 1}</td>
                  <td className="px-6 py-4">{row.source}{scenarioId === 'app-store' && (<div className="mt-1 text-xs text-slate-400">{row.source.length} chars</div>)}</td>
                  <td className="px-6 py-4">
                    <div className={`p-3 rounded-lg border ${row.warning ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>{row.target}</div>
                    {row.warning && (
                      <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle size={12} className="mr-1" />
                        {row.warning}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      <Check size={12} className="mr-1" /> Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={onProcessAnother} className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md transition-all">Process Another</button>
      </div>
    </div>
  );
}
