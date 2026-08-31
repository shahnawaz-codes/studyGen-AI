import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

export default function TopicInput({ onGenerate, defaultTopic = 'JWT Authentication' }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const navigate = useNavigate();

  const popularTopics = [
    'JWT Authentication',
    'DBMS Concepts',
    'React Custom Hooks',
    'Operating Systems',
    'Computer Networks',
    'System Design'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      if (onGenerate) {
        onGenerate({ topic, difficulty });
      } else {
        navigate('/studio');
      }
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Main Input Field */}
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What topic do you want to learn today? e.g. JWT Authentication"
            className="w-full pl-13 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-full text-zinc-900 placeholder:text-zinc-400 text-sm sm:text-base font-semibold focus:outline-none focus:bg-white focus:border-zinc-400 transition-all cursor-text"
          />
        </div>

        {/* Controls Row: Difficulty Selector + CTA Pill Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          
          {/* Difficulty Selector Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100/70 p-1.5 rounded-full self-start sm:self-auto border border-gray-200/60">
            <span className="text-xs font-bold text-zinc-500 px-3">Level:</span>
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  difficulty === level
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-200/60'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Premium Primary CTA Button (Dark Charcoal Pill with Hover Elevation) */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer border border-zinc-800"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Generate Study Material</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
          <span className="text-xs text-zinc-400 font-medium">Popular:</span>
          {popularTopics.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTopic(item);
                if (onGenerate) {
                  onGenerate({ topic: item, difficulty });
                } else {
                  navigate('/studio');
                }
              }}
              className="text-xs font-semibold text-zinc-600 bg-gray-100/80 hover:bg-zinc-900 hover:text-white px-3.5 py-1 rounded-full transition-all cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
