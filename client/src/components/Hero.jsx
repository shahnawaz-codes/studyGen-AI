import React from 'react';
import TopicInput from './TopicInput';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero({ onGenerateTopic }) {
  const navigate = useNavigate();

  return (
    <section className="pt-10 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Structured On-Demand AI Learning Platform</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.15] mb-6">
            Craving some learning flexibility?
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Explore thousands of structured <strong className="text-zinc-900 font-bold">study topics</strong> with custom AI notes, flashcards, and quizzes.
          </p>
        </div>

        {/* Hero Topic Input Search Card */}
        <div className="max-w-3xl mx-auto mb-12">
          <TopicInput onGenerate={onGenerateTopic} />
        </div>

        {/* Soft Organic Banner Box (Matching Reference Image) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-100/60 via-emerald-50 to-emerald-100/40 p-8 sm:p-12 text-center border border-emerald-200/60 shadow-xs mb-16">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-3">
              Master concepts 5x faster with AI Study Studio
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 mb-6">
              Generate notes, interactive MCQs, code snippets, and viva questions instantly on-demand.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => navigate('/studio')}
                className="px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer border border-zinc-800"
              >
                <span>Launch Studio Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="#demo"
                className="px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer hover:shadow-xs"
              >
                Explore Interactive Demo
              </a>
            </div>
          </div>
        </div>

        {/* Trusted Logos Strip (Matching Reference Image) */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
            Trusted by over 16,000 students and learners around the world
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all font-heading text-sm font-black text-zinc-800">
            <span className="text-lg tracking-tighter cursor-default">FOURSQUARE</span>
            <span className="text-lg lowercase font-serif italic cursor-default">tumblr</span>
            <span className="text-lg font-serif cursor-default">Pinterest</span>
            <span className="text-lg tracking-tight cursor-default">twitch</span>
            <span className="text-lg tracking-wider cursor-default">Bēhance</span>
            <span className="text-lg font-mono cursor-default">BeReal.</span>
            <span className="text-lg lowercase cursor-default">facebook</span>
          </div>
        </div>

      </div>
    </section>
  );
}
