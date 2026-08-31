import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStudio = location.pathname === '/studio';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Explore Dropdown */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="font-heading text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-1.5">
              StudyGen <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block group-hover:scale-125 transition-transform"></span>
            </span>
          </Link>

          <div 
            onClick={() => navigate('/studio')}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-zinc-700 bg-gray-50/80 border border-gray-200 px-3.5 py-2 rounded-full cursor-pointer hover:bg-gray-100 hover:text-zinc-900 transition-all"
          >
            <span>Explore Topics</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        </div>

        {/* Center: Search Pill Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search topics (e.g. JWT, React, DBMS)"
            onClick={() => navigate('/studio')}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-full text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 transition-all cursor-pointer"
            readOnly
          />
        </div>

        {/* Right Navigation & Action Pills */}
        <div className="flex items-center gap-4">
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-zinc-600">
            <Link to="/" className="hover:text-zinc-900 transition-colors cursor-pointer">Home</Link>
            <a href="#features" className="hover:text-zinc-900 transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors cursor-pointer">How it Works</a>
            <a href="#demo" className="hover:text-zinc-900 transition-colors cursor-pointer">Demo</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/studio')}
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-gray-200 text-zinc-700 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Sign In
            </button>
            
            {/* Premium CTA Button */}
            <button 
              onClick={() => navigate(isStudio ? '/' : '/studio')}
              className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-zinc-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isStudio ? 'Landing Page' : 'Launch Studio'}</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
