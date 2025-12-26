import React from 'react';
import ScenarioCard from '../components/ScenarioCard.jsx';

export default function LandingPage({ scenarios, onSelectScenario }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 pt-20">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">L</div>
          <span className="font-bold text-2xl">Localization Tool</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">What are we localizing today?</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Select a context to ensure perfect tone, format, and technical constraints for your translation project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map(s => (
            <ScenarioCard key={s.id} scenario={s} onSelect={onSelectScenario} />
          ))}
        </div>
      </div>
    </div>
  );
}
