import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
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
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Status / Greeting Badge matching reference image */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wider uppercase text-violet-300">
                Hello, I'm
              </span>
            </div>

            {/* Name Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-3">
              Nihal <span className="text-violet-400 drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">Mv</span>
            </h1>

            {/* Professional Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-200 tracking-tight mb-5">
              MERN Stack Developer
            </h2>

            {/* Description matching reference image */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-9">
              I build modern, responsive and user-friendly web applications using React, Node.js, Express.js and MongoDB.
            </p>

            {/* CTA Buttons matching reference image */}
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

          {/* Right Column: Exact 3D Laptop Design from Reference Image */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative select-none" aria-hidden="true">
            {/* Ambient Radial Purple Glow Aura */}
            <div className="absolute w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-violet-600/25 blur-3xl pointer-events-none -z-10" />

            {/* Exact Reference Laptop Graphic with Subtle Float & Scale Effect */}
            <div className="w-full max-w-lg lg:max-w-xl transition-all duration-500 hover:scale-[1.03]">
              <img
                src="/hero-laptop.png"
                alt="Developer Laptop with glowing code screen"
                className="w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)] pointer-events-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
