import React from 'react';
import { Layers } from 'lucide-react';

export default function RoadmapViewer({ steps = [] }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No roadmap generated yet. Click "Roadmap" above to generate a step-by-step learning path.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <Layers className="w-5 h-5 text-emerald-600" />
        Learning Roadmap & Path
      </h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-sm font-semibold text-zinc-800 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
