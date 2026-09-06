import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import DemoSection from '../components/DemoSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function HomePage({ onGenerateTopic }) {
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
