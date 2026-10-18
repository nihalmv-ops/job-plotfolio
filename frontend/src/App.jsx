import React, { useState } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import CinematicSequence from './components/CinematicSequence';
import DesignPhilosophy from './components/DesignPhilosophy';
import Telemetry from './components/Telemetry';
import Technology from './components/Technology';
import Creations from './components/Creations';
import EducationTimeline from './components/EducationTimeline';
import Transmission from './components/Transmission';

export default function App() {
  const [loadKey, setLoadKey] = useState(0);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setLoadKey((prev) => prev + 1);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Aerion Luxury Preloader */}
      <Preloader key={loadKey} />

      {/* Aerion Precision Dual-Ring Cursor */}
      <CustomCursor />

      {/* Lenis Smooth Momentum Scroll Engine */}
      <SmoothScroll />

      {/* Accessibility Skip Link */}
      <a
        href="#philosophy"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[99999] px-4 py-2 bg-white text-black rounded-full font-mono text-xs uppercase tracking-widest outline-none"
      >
        Skip to main content
      </a>

      {/* Flagship Cinematic 650vh Sticky 3D WebGL Sequence */}
      <CinematicSequence />

      {/* Content Sections matching Aerion */}
      <main id="main-content" className="relative z-20 bg-[#050505]">
        {/* 01 / Design Philosophy */}
        <DesignPhilosophy />

        {/* 02 / Telemetry & Performance Benchmarks */}
        <Telemetry />

        {/* 03 / Technology Architecture */}
        <Technology />

        {/* 04 / Featured Creations (Real Projects) */}
        <Creations />

        {/* 05 / Academic Foundation & Timeline */}
        <EducationTimeline />

        {/* 06 / Transmission & Contact + Aerion Replay Archive */}
        <Transmission onReplay={handleReplay} />
      </main>
    </div>
  );
}
