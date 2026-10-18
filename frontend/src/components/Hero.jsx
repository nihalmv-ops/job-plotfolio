import React, { useState } from 'react';
import { ArrowRight, ImageIcon } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

export default function Hero() {
  const [imageError, setImageError] = useState(false);

  // Path to your hero asset
  const heroImageSrc = "";

  const scrollToProjects = (e) => {
    e.preventDefault();
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      const headerOffset = 80;
      const elementPosition = projectsEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const headerOffset = 80;
      const elementPosition = contactEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative pt-32 pb-16 lg:py-36 min-h-[90vh] flex items-center" aria-label="Hero Introduction">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Intro & Call-to-actions */}
          <div className="lg:col-span-6 z-10">
            <ScrollReveal direction="left" delay={100}>
              <div className="flex flex-col items-start text-left">
                {/* Status / Greeting Badge matching Aerion */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" aria-hidden="true" />
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300">
                    CONCEPT ARCHITECTURE
                  </span>
                </div>

                {/* Name Heading matching Aerion */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white font-display leading-[0.88] drop-shadow-2xl mb-4">
                  NIHAL MV
                </h1>

                {/* Professional Title matching Aerion */}
                <h2 className="text-base sm:text-xl md:text-2xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400 uppercase mb-5">
                  THE ART OF CODE // MERN STACK
                </h2>

                {/* Description matching Aerion */}
                <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-xl mb-9">
                  I build modern, responsive and user-friendly web applications using React, Node.js, Express.js and MongoDB.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <a
                    href="#projects"
                    onClick={scrollToProjects}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    aria-label="View My Projects"
                  >
                    <span>View My Projects</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>

                  <a
                    href="#contact"
                    onClick={scrollToContact}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-slate-200 bg-white/5 hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    aria-label="Contact Me"
                  >
                    <span>Contact Me</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Dedicated Hero Image Space */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative" aria-label="Hero Image Container">
            <ScrollReveal direction="right" delay={200} className="w-full flex items-center justify-center">
              {/* Ambient Radial Purple Glow Aura */}
              <div className="absolute w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-violet-600/20 blur-3xl pointer-events-none -z-10" />

              {/* Hero Image Space with 3D Tilt */}
              <TiltCard maxTilt={8} className="w-full max-w-lg flex items-center justify-center">
                {!imageError ? (
                  /* When user adds their image to public/hero-image.png */
                  <img
                    src={heroImageSrc}
                    alt="Nihal MV - Hero illustration"
                    onError={() => setImageError(true)}
                    className="w-full h-auto max-h-[420px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  /* Clean Placeholder Slot when no image has been added yet */
                  <div className="w-full min-h-[340px] rounded-3xl border-2 border-dashed border-violet-500/30 bg-[#121321]/60 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-violet-500/50 group">
                    <div className="w-16 h-16 rounded-2xl bg-violet-900/30 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 shadow-lg shadow-violet-900/20 group-hover:scale-105 transition-transform">
                      <ImageIcon size={30} aria-hidden="true" />
                    </div>
                    
                    <h3 className="text-base font-bold text-white mb-1">
                      Hero Image Space
                    </h3>
                    
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-3">
                      Add your hero image here
                    </p>

                    <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono text-violet-300 bg-violet-950/50 border border-violet-500/30">
                      3D WebGL Canvas Active
                    </span>
                  </div>
                )}
              </TiltCard>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
