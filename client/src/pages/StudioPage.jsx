import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeneratorWorkspace from '../components/GeneratorWorkspace';
import Footer from '../components/Footer';

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-body antialiased">
      <GeneratorWorkspace onBackToHome={() => navigate('/')} />
      <Footer />
    </div>
  );
}
