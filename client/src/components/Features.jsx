import React from 'react';
import FeatureCard from './FeatureCard';
import { 
  Network, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Code2 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: Network,
      title: 'AI Learning Roadmap',
      description: 'Break any topic into logical concepts and subtopics structured step-by-step for optimal comprehension.',
      badge: 'Structured'
    },
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Get concise, crystal-clear explanations designed specifically for fast understanding and exam revision.',
      badge: 'Revision'
    },
    {
      icon: HelpCircle,
      title: 'Interactive MCQs',
      description: 'Practice with automatically generated questions, instant answer keys, and concept explanations.',
      badge: 'Practice'
    },
    {
      icon: Layers,
      title: 'Flashcards',
      description: 'Turn important definitions, key formulas, and terms into quick interactive flip revision cards.',
      badge: 'Memory'
    },
    {
      icon: MessageSquare,
      title: 'Viva Questions',
      description: 'Prepare for lab vivas, oral exams, and technical interviews with expected questions and model answers.',
      badge: 'Interviews'
    },
    {
      icon: Code2,
      title: 'Code Examples',
      description: 'When the topic is technical, generate relevant production-ready code snippets with line-by-line breakdowns.',
      badge: 'Technical'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-block mb-3">
            Comprehensive Toolkit
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
            Everything you need to master a topic
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            StudyGen AI combines roadmaps, notes, quizzes, flashcards, and viva prep into one unified learning environment.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feat, idx) => (
            <FeatureCard key={idx} {...feat} />
          ))}
        </div>

      </div>
    </section>
  );
}
