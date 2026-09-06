import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import DemoSection from './components/DemoSection';
import CTA from './components/CTA';
import Footer from './components/Footer';
import GeneratorWorkspace from './components/GeneratorWorkspace';
import AuthSuccess from './pages/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Landing Page View Component
function HomeView({ onGenerateTopic }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-body antialiased selection:bg-zinc-900 selection:text-white">
      <Navbar />
      <Hero onGenerateTopic={onGenerateTopic} />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DemoSection />
      <CTA />
      <Footer />
    </div>
  );
}

// Studio Workspace View Component
function StudioView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-body antialiased">
      <GeneratorWorkspace onBackToHome={() => navigate('/')} />
      <Footer />
    </div>
  );
}

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('JWT Authentication');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomeView 
                onGenerateTopic={({ topic }) => {
                  setSelectedTopic(topic);
                }} 
              />
            } 
          />
          <Route 
            path="/studio" 
            element={
              <ProtectedRoute>
                <StudioView />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route 
            path="*" 
            element={
              <HomeView 
                onGenerateTopic={({ topic }) => {
                  setSelectedTopic(topic);
                }} 
              />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
