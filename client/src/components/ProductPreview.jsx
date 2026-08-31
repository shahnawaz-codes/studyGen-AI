import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRightCircle, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare,
  Zap
} from 'lucide-react';

export default function ProductPreview({ topic = 'JWT Authentication', progress = 65 }) {
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
      {/* Top Card Header */}
      <div className="p-6 bg-gray-50/80 border-b border-gray-200/80 text-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live AI Output</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            Intermediate
          </span>
        </div>

        <h3 className="font-heading text-xl font-bold tracking-tight text-zinc-900 mb-3">
          {topic}
        </h3>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-zinc-500 mb-1.5">
            <span>Learning Progress</span>
            <span className="text-emerald-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Learning Roadmap List */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-zinc-900" />
          <span>Learning Roadmap</span>
        </h4>

        <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
          <li className="flex items-center gap-2.5 text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>What is JWT?</span>
          </li>
          <li className="flex items-center gap-2.5 text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>JWT Structure</span>
          </li>
          <li className="flex items-center gap-2.5 text-zinc-900 font-bold bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <ArrowRightCircle className="w-4 h-4 text-zinc-900 flex-shrink-0 animate-pulse" />
            <span>Access & Refresh Tokens</span>
            <span className="ml-auto text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full">Active</span>
          </li>
          <li className="flex items-center gap-2.5 text-zinc-400">
            <Circle className="w-4 h-4 text-zinc-300 flex-shrink-0" />
            <span>JWT Authentication in Express</span>
          </li>
          <li className="flex items-center gap-2.5 text-zinc-400">
            <Circle className="w-4 h-4 text-zinc-300 flex-shrink-0" />
            <span>Security Best Practices</span>
          </li>
        </ul>
      </div>

      {/* Mini Feature Modules Grid */}
      <div className="p-4 bg-gray-50/50 grid grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Smart Notes</div>
            <div className="text-[10px] text-zinc-400">12 Concepts</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Interactive MCQs</div>
            <div className="text-[10px] text-zinc-400">15 Questions</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Flashcards</div>
            <div className="text-[10px] text-zinc-400">20 Deck Cards</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Viva Questions</div>
            <div className="text-[10px] text-zinc-400">8 High Yield</div>
          </div>
        </div>
      </div>
    </div>
  );
}
