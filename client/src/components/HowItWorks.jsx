import React from 'react';
import { Search, Sliders, Rocket, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Choose a topic',
      description: 'Enter anything you want to learn — from software engineering concepts to advanced science topics.',
      icon: Search,
      badge: 'Input Topic'
    },
    {
      step: '02',
      title: 'Customize your learning',
      description: 'Select your difficulty level (Beginner, Intermediate, Advanced) and specific learning goals.',
      icon: Sliders,
      badge: 'Tailor Output'
    },
    {
      step: '03',
      title: 'Start learning',
      description: 'Get a structured learning path complete with concise notes, quizzes, flashcards, and viva prep.',
      icon: Rocket,
      badge: 'Master Topic'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50/60 border-t border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-gray-200/70 text-zinc-800 border border-gray-300/60 inline-block mb-3">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
            How StudyGen AI Works
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            Go from zero knowledge to exam-ready understanding in minutes.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="relative bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-3xl font-black text-zinc-900">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-zinc-900">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-zinc-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{item.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
