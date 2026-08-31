import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-gray-50/80 text-zinc-900 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-zinc-800 text-xs font-bold mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Transform Your Study Workflow</span>
        </div>

        {/* Large Heading */}
        <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-zinc-900">
          Stop searching for what to study. <br className="hidden sm:inline" />
          <span className="text-zinc-900">Start learning smarter.</span>
        </h2>

        {/* Supporting Text */}
        <p className="text-base sm:text-xl text-zinc-600 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Choose a topic and let StudyGen AI build your learning path with smart notes, quizzes, flashcards, and interview prep.
        </p>

        {/* Primary Action Button (Solid Dark Charcoal Pill with Hover Lift) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer border border-zinc-800"
          >
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Launch Studio Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-xs text-zinc-400 mt-6">
          Free plan available • On-demand material generation • No credit card required
        </p>

      </div>
    </section>
  );
}
