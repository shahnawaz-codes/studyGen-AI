import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStudio = location.pathname === '/studio';
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

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
            onClick={() => isAuthenticated ? navigate('/studio') : loginWithGoogle()}
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
            onClick={() => isAuthenticated ? navigate('/studio') : loginWithGoogle()}
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
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate(isStudio ? '/' : '/studio')}
                  className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer border border-zinc-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isStudio ? 'Landing Page' : 'Studio Workspace'}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full border border-emerald-400 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-zinc-800 max-w-[110px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-zinc-800 text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
