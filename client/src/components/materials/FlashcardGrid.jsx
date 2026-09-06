import React, { useState } from 'react';
import { Zap, RotateCw } from 'lucide-react';

export default function FlashcardGrid({ flashcards = [] }) {
  const [flippedCards, setFlippedCards] = useState({});

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm">
        No flashcards generated yet. Click "Flashcards" above to create revision flashcards.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-zinc-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <Zap className="w-5 h-5 text-emerald-600" />
        Revision Flashcards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {flashcards.map((fc, idx) => {
          const content = fc.content || fc;
          const frontText = content.front;
          const backText = content.back;
          const isFlipped = flippedCards[idx];

          return (
            <div
              key={fc._id || idx}
              onClick={() => setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
              className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-3xl min-h-[160px] flex flex-col justify-between cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-between">
                <span>{isFlipped ? 'Answer / Back' : 'Question / Front'}</span>
                <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
              </span>
              <p className="text-sm font-bold leading-relaxed my-3">
                {isFlipped ? backText : frontText}
              </p>
              <span className="text-[10px] text-zinc-400 text-right">Tap to flip 🔄</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
