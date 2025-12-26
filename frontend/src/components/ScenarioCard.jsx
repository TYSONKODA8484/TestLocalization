import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ScenarioCard({ scenario, onSelect }) {
  const SIcon = scenario.icon;
  return (
    <button
      onClick={() => onSelect(scenario)}
      className={`flex flex-col items-start p-8 rounded-2xl border-2 ${scenario.borderColor} ${scenario.hoverBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left bg-white dark:bg-slate-800 group h-full`}
    >
      <div className={`p-4 rounded-xl mb-5 ${scenario.color} ${scenario.textColor} group-hover:scale-110 transition-transform duration-300`}>
        <SIcon size={28} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{scenario.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">{scenario.description}</p>
      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Get Started <ChevronRight size={16} className="ml-1" />
      </div>
    </button>
  );
}
