import React from 'react';
import { Target, Compass, Brain, Gauge } from 'lucide-react';

export default function SocialProof() {
  const benefits = [
    {
      icon: Target,
      title: 'Learn any topic',
      description: 'From core Computer Science & Engineering to complex academic subjects.',
      color: 'bg-blue-50 text-blue-700 border-blue-200/60'
    },
    {
      icon: Compass,
      title: 'Structured learning paths',
      description: 'Clear, step-by-step roadmap ordered logically from fundamentals to mastery.',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
    },
    {
      icon: Brain,
      title: 'Practice with AI quizzes',
      description: 'Interactive MCQs with instant feedback and concept explanations for maximum retention.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
    },
    {
      icon: Gauge,
      title: 'Your own difficulty level',
      description: 'Tailored explanations designed for Beginner, Intermediate, or Advanced learners.',
      color: 'bg-purple-50 text-purple-700 border-purple-200/60'
    }
  ];

  return (
    <section className="py-16 bg-gray-50/60 border-y border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">Student-Centric Design</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Built for the way developers & students actually learn
          </h2>
        </div>

        {/* 4 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${benefit.color} border flex items-center justify-center mb-4`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-zinc-900 mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
