import React from 'react';
import { File, X, CheckCircle } from 'lucide-react';

export default function UploadedFileInfo({ fileName, fileType, itemCount, preview, onClear }) {
  const getFileIcon = (type) => {
    const iconMap = {
      csv: '📊',
      json: '{}',
      xml: '< >',
      xlsx: '📑',
      xls: '📑',
      txt: '📄'
    };
    return iconMap[type] || '📄';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">File Uploaded</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Remove file"
        >
          <X size={18} className="text-red-600 dark:text-red-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* File Info */}
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getFileIcon(fileType)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 break-all">{fileName}</h3>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-semibold uppercase">
                {fileType}
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="font-semibold">{itemCount}</span>
                <span>{itemCount === 1 ? 'item' : 'items'} parsed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview && preview.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Preview</p>
            <div className="max-h-32 overflow-y-auto space-y-1.5">
              {preview.map((item, idx) => (
                <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-slate-400 dark:text-slate-500 flex-shrink-0 min-w-6">
                    {idx + 1}.
                  </span>
                  <span className="line-clamp-1">{item}</span>
                </div>
              ))}
              {preview.length >= 5 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-slate-700">
                  + {itemCount - 5} more items...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info message */}
        <div className="text-sm text-slate-600 dark:text-slate-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
          Select your languages and click <strong>"Start Localization"</strong> to begin translation.
        </div>
      </div>
    </div>
  );
}
