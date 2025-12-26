import React, { useState } from 'react';
import { FileSpreadsheet, FileJson, FileCode, Copy, FileType, X } from 'lucide-react';
import { copyToClipboard, downloadFile, tableToCSV, tableToJSON, tableToXML, tableToExcel } from '../utils/exportHelpers.js';
import { showToast } from './ToastContainer.jsx';

const API_URL = 'http://localhost:5000/api';

export default function SimpleTable({ tableData, languages, isVerifying }) {
  const [expandedCell, setExpandedCell] = useState(null);

  const handleCopy = async () => {
    const text = tableToCSV(tableData, languages);
    const success = await copyToClipboard(text);
    if (success) {
      showToast('Copied to clipboard!');
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDownloadCSV = () => {
    const content = tableToCSV(tableData, languages);
    downloadFile(content, `localization_${Date.now()}.csv`, 'text/csv');
    showToast('CSV downloaded!');
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(`${API_URL}/export/excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableData, languages })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localization_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Excel downloaded!');
    } catch (e) {
      // Fallback to JS export
      const content = tableToExcel(tableData, languages);
      downloadFile(content, `localization_${Date.now()}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      showToast('Excel downloaded!');
    }
  };

  const handleDownloadJSON = () => {
    const content = tableToJSON(tableData, languages);
    downloadFile(content, `localization_${Date.now()}.json`, 'application/json');
    showToast('JSON downloaded!');
  };

  const handleDownloadXML = () => {
    const content = tableToXML(tableData, languages);
    downloadFile(content, `localization_${Date.now()}.xml`, 'application/xml');
    showToast('XML downloaded!');
  };

  const handleDownloadIOS = async () => {
    try {
      const response = await fetch(`${API_URL}/export/ios-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableData, languages })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ios_strings_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('iOS strings downloaded!');
    } catch (e) {
      // Fallback to JS export
      let content = '/* iOS Localizable.strings */\n\n';
      tableData.forEach(row => {
        const key = row.source.replace(/\s+/g, '_').replace(/"/g, '').toLowerCase();
        languages.forEach(lang => {
          const value = (row.translations[lang] || row.source).replace(/"/g, '\\"');
          content += `/* ${lang} */\n"${key}" = "${value}";\n`;
        });
        content += '\n';
      });
      downloadFile(content, `ios_strings_${Date.now()}.strings`, 'text/plain');
      showToast('iOS strings downloaded!');
    }
  };

  const handleDownloadAndroid = async () => {
    try {
      const response = await fetch(`${API_URL}/export/android-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableData, languages })
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `android_strings_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Android strings downloaded!');
    } catch (e) {
      // Fallback to JS export
      let content = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
      tableData.forEach(row => {
        const key = row.source.replace(/\s+/g, '_').replace(/"/g, '').toLowerCase();
        languages.forEach(lang => {
          const value = row.translations[lang] || row.source;
          content += `    <!-- ${lang} -->\n    <string name="${key}">${value}</string>\n`;
        });
      });
      content += '</resources>';
      downloadFile(content, `android_strings_${Date.now()}.xml`, 'application/xml');
      showToast('Android strings downloaded!');
    }
  };

  return (
    <div className="max-w-full">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">Localization Results</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tableData.length} {tableData.length === 1 ? 'entry' : 'entries'} • {languages.length} {languages.length === 1 ? 'language' : 'languages'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleCopy}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all ${isVerifying ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-500'}`}
          >
            <Copy size={16}/> Copy
          </button>
          <button 
            onClick={handleDownloadCSV}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <FileSpreadsheet size={16}/> CSV
          </button>
          <button 
            onClick={handleDownloadExcel}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <FileSpreadsheet size={16}/> Excel
          </button>
          <button 
            onClick={handleDownloadJSON}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            <FileJson size={16}/> JSON
          </button>
          <button 
            onClick={handleDownloadXML}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
          >
            <FileCode size={16}/> XML
          </button>
          <button 
            onClick={handleDownloadIOS}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800'}`}
          >
            <FileType size={16}/> iOS
          </button>
          <button 
            onClick={handleDownloadAndroid}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all ${isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <FileCode size={16}/> Android
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b-2 border-slate-300 dark:border-slate-600">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-100 whitespace-nowrap">Source</th>
                {languages.map(lang => (
                  <th key={lang} className="px-6 py-4 font-bold text-slate-700 dark:text-slate-100 whitespace-nowrap">{lang}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs">
                    <div 
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                      onClick={() => setExpandedCell({ text: row.source, lang: 'Source' })}
                      title="Click to view full text"
                    >
                      {row.source}
                    </div>
                  </td>
                  {languages.map(lang => (
                    <td key={lang} className="px-6 py-4 text-slate-700 dark:text-slate-300 max-w-xs">
                      {row.translations[lang] ? (
                        <div 
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                          onClick={() => setExpandedCell({ text: row.translations[lang], lang })}
                          title="Click to view full text"
                        >
                          {row.translations[lang]}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 italic">
                          <span className="animate-pulse">Loading...</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cell Expansion Modal */}
      {expandedCell && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setExpandedCell(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg">{expandedCell.lang}</h3>
              <button onClick={() => setExpandedCell(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                {expandedCell.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
