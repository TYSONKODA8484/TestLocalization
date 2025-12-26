import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import InputModeSwitcher from '../components/InputModeSwitcher.jsx';
import ProcessingOverlay from '../components/ProcessingOverlay.jsx';
import SimpleTable from '../components/SimpleTable.jsx';
import FormattedTable from '../components/FormattedTable.jsx';
import FileSuccess from '../components/FileSuccess.jsx';
import FileUploadArea from '../components/FileUploadArea.jsx';
import UploadedFileInfo from '../components/UploadedFileInfo.jsx';
import QAReportModal from '../components/QAReportModal.jsx';

export default function WorkspacePage({
  scenario,
  commonLanguages,
  selectedLangs,
  toggleLanguage,
  customLanguages,
  setCustomLanguages,
  tableFormat,
  setTableFormat,
  tableFormats,
  inputMode,
  setInputMode,
  inputText,
  setInputText,
  isProcessing,
  isVerifying,
  progress,
  results,
  tableData,
  qaFindings,
  qaModalOpen,
  setQaModalOpen,
  onBack,
  onTranslate,
  onNewLocalization,
  onStopLocalization,
}) {
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const allLanguages = [
    ...selectedLangs.map(code => commonLanguages.find(l => l.code === code)?.name || code),
    ...customLanguages
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header scenario={scenario} onBack={onBack} isLocalizing={isProcessing} onStop={onStopLocalization} onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />

      <div className="flex flex-1 overflow-hidden pt-16">
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-y-auto relative">
          <div className="p-8">
            {!results && <InputModeSwitcher inputMode={inputMode} setInputMode={setInputMode} />}

            {!isProcessing && !results && (
              <div className="max-w-5xl">
                {uploadedFileInfo && (
                  <UploadedFileInfo
                    fileName={uploadedFileInfo.fileName}
                    fileType={uploadedFileInfo.fileType}
                    itemCount={uploadedFileInfo.itemCount}
                    preview={uploadedFileInfo.preview}
                    onClear={() => {
                      setUploadedFileInfo(null);
                      setInputText('');
                      setInputMode('text');
                    }}
                  />
                )}
                {inputMode === 'text' ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Source Content</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full">
                          {inputText.length} chars • {inputText.split('\n').filter(x => x.trim()).length} lines
                        </span>
                      </div>
                    </div>
                    <textarea 
                      className="w-full p-6 focus:outline-none resize-none text-slate-700 dark:text-slate-100 leading-relaxed h-96 bg-white dark:bg-slate-800" 
                      placeholder="Enter you content here, example down below:

AI Person Shoot
AI Product Shoot
AI Backgrounds
Get PhotoCut Plus
Refer App
Get Unlimited Editing
Unlimited Background Removal
Batch Edit" 
                      value={inputText} 
                      onChange={(e) => setInputText(e.target.value)} 
                    />
                  </div>
                ) : (
                  <FileUploadArea 
                    onFileContent={setInputText}
                    onFileInfo={setUploadedFileInfo}
                  />
                )}
              </div>
            )}

            {results === 'table' && tableFormat === 'simple' && (
              <SimpleTable tableData={tableData} languages={allLanguages} isVerifying={isVerifying} />
            )}

            {results === 'table' && tableFormat === 'formatted' && (
              <FormattedTable tableData={tableData} languages={allLanguages} isVerifying={isVerifying} />
            )}

            {results === 'file-success' && (
              <FileSuccess scenarioTitle={scenario.title} langCount={allLanguages.length} />
            )}
          </div>

          {/* Processing / Verifying Overlay */}
          <ProcessingOverlay
            visible={isVerifying}
            scenarioTitle={scenario?.title}
            languagesCount={allLanguages.length}
            entriesCount={tableData?.length || 0}
            progress={progress}
            title={isVerifying ? 'Verifying Translations...' : 'Analyzing & Localizing...'}
            subtitle={isVerifying ? 'Checking consistency, numbers, placeholders, and grammar.' : undefined}
          />

          <QAReportModal
            open={qaModalOpen}
            findings={qaFindings}
            onClose={() => setQaModalOpen(false)}
          />
        </main>

        {/* Sidebar on Right Side */}
        <div className={`transition-all duration-300 border-l border-slate-200 dark:border-slate-800 ${sidebarVisible ? 'w-80' : 'w-0'}`}>
          {sidebarVisible && (
            <Sidebar
              commonLanguages={commonLanguages}
              selectedLangs={selectedLangs}
              toggleLanguage={toggleLanguage}
              customLanguages={customLanguages}
              setCustomLanguages={setCustomLanguages}
              tableFormat={tableFormat}
              setTableFormat={setTableFormat}
              tableFormats={tableFormats}
              simulateTranslation={onTranslate}
              isProcessing={isProcessing || isVerifying}
              inputText={inputText}
              results={results}
              onNewLocalization={onNewLocalization}
            />
          )}
        </div>
      </div>
    </div>
  );
}
