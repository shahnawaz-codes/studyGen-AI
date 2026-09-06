import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, ArrowLeft } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, loginWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-zinc-600 text-sm font-semibold animate-pulse">
          <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-body antialiased">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full text-center shadow-sm flex flex-col items-center gap-5">
          
          <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading text-2xl font-bold text-zinc-900 tracking-tight">
              Sign In Required
            </h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Studio Workspace is protected. Please sign in with your Google account to create and access your personalized study materials.
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95 border border-zinc-800"
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
            <span>Sign in with Google to Continue</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home Page</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
