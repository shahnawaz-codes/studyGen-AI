import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleAuthSuccess(token);
      // Small timeout for smooth animation transition
      const timer = setTimeout(() => {
        navigate('/studio');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [searchParams, handleAuthSuccess, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 max-w-sm w-full text-center shadow-sm flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="font-heading text-xl font-bold text-zinc-900">
          Authenticating with Google...
        </h2>
        <p className="text-xs text-zinc-500">
          Setting up your secure StudyGen AI session. Please wait a moment.
        </p>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
          <div className="bg-zinc-900 h-full w-2/3 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
