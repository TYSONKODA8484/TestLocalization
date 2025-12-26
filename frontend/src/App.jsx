import React, { useEffect, useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { SCENARIOS, COMMON_LANGUAGES, TABLE_FORMATS } from './constants.js';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [view, setView] = useState('landing');
  const [scenario, setScenario] = useState(null);
  const [inputMode, setInputMode] = useState('text');
  const [inputText, setInputText] = useState('');
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);
  const [tableFormat, setTableFormat] = useState('simple');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [useRealApi, setUseRealApi] = useState(true); // Toggle for API vs mock
  const [cancelRequested, setCancelRequested] = useState(false);
  const [qaFindings, setQaFindings] = useState([]);
  const [qaModalOpen, setQaModalOpen] = useState(false);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/') {
        setView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleScenarioSelect = (s) => {
    setScenario(s);
    setView('workspace');
    setResults(null);
    setInputText('');
    setSelectedLangs([]);
    setCustomLanguages([]);
    setQaFindings([]);
    setQaModalOpen(false);
    // Update URL
    window.history.pushState({}, '', `#/workspace/${s.id}`);
  };

  const handleNewLocalization = () => {
    setResults(null);
    setTableData([]);
    setInputText('');
    setSelectedLangs([]);
    setCustomLanguages([]);
    setIsProcessing(false);
    setProgress(0);
    setQaFindings([]);
    setQaModalOpen(false);
  };

  const toggleLanguage = (code) => {
    const maxLanguages = 10;
    const totalSelected = selectedLangs.length + customLanguages.length;
    if (!selectedLangs.includes(code) && totalSelected >= maxLanguages) return;
    setSelectedLangs(prev => prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]);
  };

  // Map frontend scenario IDs to backend scenario IDs
  const getBackendScenarioId = (frontendId) => {
    const mapping = {
      'app-store': 'app-store',
      'marketing': 'marketing',
      'website-seo': 'website',
      'dev-strings': 'software',
      'general': 'general'
    };
    return mapping[frontendId] || 'general';
  };

  const translateWithApi = async (text, langName, scenarioId) => {
    try {
      const response = await fetch(`${API_URL}/translate/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: langName,
          scenario: getBackendScenarioId(scenarioId)
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Localization failed');
      }
      
      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error('Localization API error:', error);
      // Return a placeholder if API fails
      return `[Localization pending: ${langName}]`;
    }
  };

  const mockTranslate = (text, langName) => {
    // Generate mock translation - just returns the original for testing
    return text;
  };

  const verifyWithApi = async (currentTableData, languages, scenarioId) => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableData: currentTableData,
          languages: languages,
          scenario: getBackendScenarioId(scenarioId),
          chunkSize: 50
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verification API error:', error);
      return { results: currentTableData, issues: [] }; // fallback to original
    }
  };

  const generateTableData = () => {
    const lines = inputText.split('\n').filter(l => l.trim());
    const allLanguages = [
      ...selectedLangs.map(code => COMMON_LANGUAGES.find(l => l.code === code)?.name || code),
      ...customLanguages
    ];
    
    const data = lines.map((line) => {
      const translations = {};
      allLanguages.forEach(lang => {
        translations[lang] = mockTranslate(line, lang);
      });
      return {
        source: line,
        translations
      };
    });
    setTableData(data);
  };

  const stopLocalization = () => {
    setCancelRequested(true);
  };

  const simulateLocalization = async () => {
    const totalLangs = selectedLangs.length + customLanguages.length;
    if (!inputText || totalLangs === 0) return;

    setQaFindings([]);
    setQaModalOpen(false);
    
    const lines = inputText.split('\n').filter(l => l.trim());
    const allLanguages = [
      ...selectedLangs.map(code => COMMON_LANGUAGES.find(l => l.code === code)?.name || code),
      ...customLanguages
    ];

    // Always show table first (for both text and file inputs)
    // Progressive table population
    setResults('table');
    setTableData([]);
    setIsProcessing(true);
    setCancelRequested(false);
    
    // Initialize table with empty translations
    const tempData = lines.map(line => ({
      source: line,
      translations: {}
    }));
    setTableData([...tempData]);

    const totalCells = lines.length * allLanguages.length;
    let completedCells = 0;

    // Process each cell with real or mock translations
    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      if (cancelRequested) break;
      for (let langIndex = 0; langIndex < allLanguages.length; langIndex++) {
        if (cancelRequested) break;
        const text = lines[rowIndex];
        const lang = allLanguages[langIndex];
        
        try {
          let translation;
          if (useRealApi) {
            translation = await translateWithApi(text, lang, scenario?.id);
          } else {
            // Mock translation with delay
            await new Promise(resolve => setTimeout(resolve, 150));
            translation = mockTranslate(text, lang);
          }
          
          tempData[rowIndex].translations[lang] = translation;
          setTableData([...tempData]);
          
          completedCells++;
          setProgress(Math.round((completedCells / totalCells) * 100));
        } catch (error) {
          console.error(`Error translating "${text}" to ${lang}:`, error);
          tempData[rowIndex].translations[lang] = `[Error: ${lang}]`;
          setTableData([...tempData]);
        }
      }
    }

    setIsProcessing(false);
    // If cancelled, do not run verification; leave current table as-is
    if (cancelRequested) {
      return;
    }
    setProgress(100);

    // Run verification after localization finishes
    setIsVerifying(true);
    setProgress(5);
    let verifyProgress = 5;
    const estimatedSteps = Math.max(tempData.length * allLanguages.length, 1);
    const verifyTicker = setInterval(() => {
      // Move toward 95% while verification request is in-flight
      verifyProgress = Math.min(95, verifyProgress + Math.max(1, Math.ceil(90 / estimatedSteps)));
      setProgress(verifyProgress);
    }, 350);
    try {
      const { results: verified, issues = [] } = await verifyWithApi(tempData, allLanguages, scenario?.id);
      setTableData(verified);
      setQaFindings(issues);
      setQaModalOpen(issues.length > 0);
    } finally {
      clearInterval(verifyTicker);
      setProgress(100);
      setIsVerifying(false);
    }
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          scenarios={SCENARIOS}
          onSelectScenario={handleScenarioSelect}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <WorkspacePage
      scenario={scenario}
      commonLanguages={COMMON_LANGUAGES}
      selectedLangs={selectedLangs}
      toggleLanguage={toggleLanguage}
      customLanguages={customLanguages}
      setCustomLanguages={setCustomLanguages}
      tableFormat={tableFormat}
      setTableFormat={setTableFormat}
      tableFormats={TABLE_FORMATS}
      inputMode={inputMode}
      setInputMode={setInputMode}
      inputText={inputText}
      setInputText={setInputText}
      isProcessing={isProcessing}
      isVerifying={isVerifying}
      progress={progress}
      results={results}
      tableData={tableData}
      qaFindings={qaFindings}
      qaModalOpen={qaModalOpen}
      setQaModalOpen={setQaModalOpen}
      onBack={() => {
        setView('landing');
        window.history.pushState({}, '', '#/');
      }}
      onTranslate={simulateLocalization}
      onNewLocalization={handleNewLocalization}
      onStopLocalization={stopLocalization}
    />
    <ToastContainer />
    </>
  );
}
