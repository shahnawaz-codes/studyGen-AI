import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

export default function McqList({ mcqs = [] }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  if (!mcqs || mcqs.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No MCQs generated yet. Click "MCQs" above to generate multiple-choice questions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-emerald-600" />
        Interactive Multiple Choice Questions
      </h3>
      {mcqs.map((mcq, idx) => {
        // Support both backend API schema (mcq.content) and raw mock schema
        const content = mcq.content || mcq;
        const questionText = content.question;
        const options = content.options || [];
        const correctAnswer = content.correctAnswer !== undefined ? content.correctAnswer : content.correct;
        const explanation = content.explanation;

        return (
          <div key={mcq._id || idx} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
            <p className="font-bold text-sm text-zinc-900">Q{idx + 1}. {questionText}</p>
            <div className="space-y-2">
              {options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[idx] === optIdx;
                const isCorrect = optIdx === correctAnswer;
                const hasSubmitted = selectedAnswers[idx] !== undefined;

                let btnStyle = 'bg-white border-gray-200 text-zinc-800 hover:bg-gray-100';
                if (hasSubmitted) {
                  if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                  else if (isSelected) btnStyle = 'bg-rose-100 border-rose-300 text-rose-900';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            {selectedAnswers[idx] !== undefined && explanation && (
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-zinc-700">
                <span className="font-bold">Explanation:</span> {explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
