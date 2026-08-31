import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 text-zinc-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <span className="font-heading text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-1.5">
              StudyGen <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center items-center gap-6 text-sm font-semibold text-zinc-600">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it Works</a>
            <Link to="/studio" className="hover:text-zinc-900 transition-colors font-bold text-zinc-900">Studio Workspace</Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-zinc-400">
            © {new Date().getFullYear()} StudyGen AI. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
