import React, { useState } from 'react';
import { AlertCircle, ArrowRight, RefreshCw, Plus, X } from 'lucide-react';

export default function Sidebar({
  commonLanguages,
  selectedLangs,
  toggleLanguage,
  customLanguages,
  setCustomLanguages,
  tableFormat,
  setTableFormat,
  tableFormats,
  simulateTranslation,
  isProcessing,
  inputText,
  results,
  onNewLocalization,
}) {
  const [customInput, setCustomInput] = useState('');
  const maxLanguages = 10;
  const remainingSlots = maxLanguages - selectedLangs.length - customLanguages.length;

  const addCustomLanguages = () => {
    if (!customInput.trim()) return;
    const newLangs = customInput.split(',').map(l => l.trim()).filter(l => l);
    const available = maxLanguages - selectedLangs.length - customLanguages.length;
    const toAdd = newLangs.slice(0, available);
    if (toAdd.length > 0) {
      setCustomLanguages([...customLanguages, ...toAdd]);
      setCustomInput('');
    }
  };

  const removeCustomLanguage = (lang) => {
    setCustomLanguages(customLanguages.filter(l => l !== lang));
  };

  const totalSelected = selectedLangs.length + customLanguages.length;

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto shadow-sm">
      {/* Language Selection - Hidden when results are shown */}
      {!results && (
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Languages</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded ${totalSelected >= maxLanguages ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            {totalSelected} / {maxLanguages}
          </span>
        </div>

        {/* Common Languages */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 block">Common Languages</label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {commonLanguages.map(lang => {
              const isDisabled = !selectedLangs.includes(lang.code) && totalSelected >= maxLanguages;
              return (
                <label key={lang.code} className={`flex items-center p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors border border-transparent ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-slate-600'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedLangs.includes(lang.code)} 
                    onChange={() => !isDisabled && toggleLanguage(lang.code)} 
                    disabled={isDisabled}
                    className="w-4 h-4 text-blue-600 rounded" 
                  />
                  <span className="ml-2.5 text-sm font-medium">{lang.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom Languages */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 block">Custom Languages</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomLanguages()}
              placeholder="e.g., pt-br, mexican spanish, hindi" 
              disabled={remainingSlots <= 0}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
            />
            <button 
              onClick={addCustomLanguages}
              disabled={!customInput.trim() || remainingSlots <= 0}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Add custom languages"
            >
              <Plus size={16} />
            </button>
          </div>
          {customLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customLanguages.map(lang => (
                <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                  {lang}
                  <button onClick={() => removeCustomLanguage(lang)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {remainingSlots <= 0 && (
            <div className="mt-2 flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
              <span>Maximum 10 languages reached. Remove some to add more.</span>
            </div>
          )}
        </div>
      </div>
      )}

      {/* New Localization Button - Show at top when results exist */}
      {results && (
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={onNewLocalization}
            disabled={isProcessing}
            className={`w-full py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-base transition-all ${isProcessing ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'}`}
          >
            <Plus size={20} /> New Localization
          </button>
        </div>
      )}

      {/* Table Format Selection */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Table Format</h3>
        <div className="space-y-2">
          {tableFormats.map(format => (
            <label key={format.id} className={`flex items-start p-3 rounded-lg border-2 transition-all cursor-pointer ${tableFormat === format.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
              <input 
                type="radio" 
                name="tableFormat" 
                value={format.id}
                checked={tableFormat === format.id}
                onChange={(e) => setTableFormat(e.target.value)}
                className="w-4 h-4 text-blue-600 mt-0.5" 
              />
              <div className="ml-3">
                <div className="text-sm font-semibold">{format.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{format.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Button Section */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 mt-auto bg-white dark:bg-slate-900 space-y-3">
        {!results && (
          <>
            {totalSelected === 0 && (
              <div className="text-xs text-center text-slate-500 dark:text-slate-400 italic">
                Select at least one language to start
              </div>
            )}
            {!inputText && totalSelected > 0 && (
              <div className="text-xs text-center text-slate-500 dark:text-slate-400 italic">
                Enter content to localize
              </div>
            )}
            <button 
              onClick={simulateTranslation} 
              disabled={isProcessing || !inputText || totalSelected === 0} 
              className={`w-full py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-base transition-all ${isProcessing || !inputText || totalSelected === 0 ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'}`}
            >
              {isProcessing ? (<><RefreshCw className="animate-spin" size={20} /> Localizing...</>) : (<>Start Localization <ArrowRight size={20} /></>)}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
