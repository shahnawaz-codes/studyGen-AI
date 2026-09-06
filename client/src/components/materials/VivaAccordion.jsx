import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function VivaAccordion({ vivaItems = [] }) {
  const [expandedViva, setExpandedViva] = useState({ 0: true });

  if (!vivaItems || vivaItems.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No Viva questions generated yet. Click "Viva Q&A" above to generate interview questions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        Viva / Interview Questions
      </h3>
      {vivaItems.map((viva, idx) => {
        const content = viva.content || viva;
        const questionText = content.question || content.q;
        const answerText = content.answer || content.a;

        return (
          <div key={viva._id || idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
            <button
              onClick={() => setExpandedViva(prev => ({ ...prev, [idx]: !prev[idx] }))}
              className="w-full p-4 text-left font-bold text-xs text-zinc-900 flex items-center justify-between bg-white hover:bg-gray-50 cursor-pointer"
            >
              <span>Q{idx + 1}. {questionText}</span>
              {expandedViva[idx] ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>
            {expandedViva[idx] && (
              <div className="p-4 border-t border-gray-200 text-xs text-zinc-700 leading-relaxed bg-gray-50/50 whitespace-pre-line">
                <span className="font-bold text-zinc-900 block mb-1">Model Answer:</span>
                {answerText}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
