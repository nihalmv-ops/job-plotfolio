import React, { useState } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import CinematicSequence from './components/CinematicSequence';
import Telemetry from './components/Telemetry';
import Technology from './components/Technology';
import Creations from './components/Creations';
import EducationTimeline from './components/EducationTimeline';
import Transmission from './components/Transmission';

export default function App() {
  const [loadKey, setLoadKey] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [isHeroReady, setIsHeroReady] = useState(false);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setLoadKey((prev) => prev + 1);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-zinc-200 selection:text-black relative overflow-x-hidden">
      {/* Detailing Studio Preloader synchronized with 3D Hero Car */}
      <Preloader 
        key={loadKey} 
        heroProgress={heroProgress} 
        isHeroReady={isHeroReady} 
      />

      {/* Precision Dual-Ring Cursor */}
      <CustomCursor />

      {/* Lenis Smooth Momentum Scroll Engine */}
      <SmoothScroll />

      {/* Accessibility Skip Link */}
      <a
        href="#philosophy"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[99999] px-4 py-2 bg-white text-black rounded-full font-mono text-xs uppercase tracking-widest outline-none shadow-lg"
      >
        Skip to main content
      </a>

      {/* Flagship Cinematic 3D WebGL Detailing Bay Sequence */}
      {/* Porsche 911 Turbo Dynamic Staging across all sections */}
      <CinematicSequence 
        onHeroProgress={(p) => setHeroProgress(p)}
        onHeroReady={() => setIsHeroReady(true)}
      />

      {/* Content Sections in Pure Stealth Black Theme */}
      <main id="main-content" className="relative z-10">
        {/* 02 / Telemetry & Performance Benchmarks */}
        <Telemetry />

        {/* 03 / Technology Architecture */}
        <Technology />

        {/* 04 / Featured Creations (Real Projects) */}
        <Creations />

        {/* 05 / Academic Foundation & Timeline */}
        <EducationTimeline />

        {/* 06 / Transmission & Contact + Studio Replay Archive */}
        <Transmission onReplay={handleReplay} />
      </main>
    </div>
  );
}
