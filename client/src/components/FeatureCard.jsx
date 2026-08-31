import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="group relative bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-zinc-300 hover:-translate-y-1 transition-all duration-300">
      
      {/* Icon and Tag Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200/80 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className="text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-gray-100/80 text-zinc-600 border border-gray-200/60 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-zinc-900 transition-colors flex items-center justify-between">
        <span>{title}</span>
        <ArrowUpRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}
