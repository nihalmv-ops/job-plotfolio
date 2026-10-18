import React from 'react';
import ThreeBackground from './components/ThreeBackground';
import SmoothScroll from './components/SmoothScroll';
import GlowCursor from './components/GlowCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0c14] text-white flex flex-col font-sans selection:bg-violet-700 selection:text-white relative overflow-x-hidden">
      {/* Lenis Smooth Scroll Engine */}
      <SmoothScroll />

      {/* Interactive 3D Three.js Background with constellation & floating wireframe shapes */}
      <ThreeBackground />

      {/* Dynamic Cursor Violet Glow Orb */}
      <GlowCursor />

      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold shadow-xl outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
