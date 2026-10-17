import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

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
    <section id="home" className="relative pt-32 pb-16 lg:py-36 min-h-[92vh] flex items-center" aria-label="Hero Introduction">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Intro & Call-to-actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Status / Greeting Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wider uppercase text-violet-300">
                HELLO, I'M
              </span>
            </div>

            {/* Name Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-3">
              Nihal <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(167,139,250,0.35)]">Mv</span>
            </h1>

            {/* Professional Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-200 tracking-tight mb-5">
              MERN Stack Developer
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mb-9">
              I build responsive and user-friendly web applications using React, Node.js, Express.js, and MongoDB.
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
                href="/resume.pdf"
                download="Nihal_MV_Resume.pdf"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-slate-200 bg-white/5 hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                aria-label="Download Resume"
              >
                <Download size={18} aria-hidden="true" />
                <span>Download Resume</span>
              </a>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-full font-medium text-sm text-slate-400 hover:text-white transition-colors"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right Column: Sleek 3D Laptop with Glowing Code Screen */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative" aria-hidden="true">
            {/* Ambient Purple Glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none -z-10" />

            {/* Laptop Vector */}
            <div className="w-full max-w-md transition-transform duration-700 hover:scale-[1.02]">
              <svg
                viewBox="0 0 520 340"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
              >
                <defs>
                  <linearGradient id="laptopBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e2030" />
                    <stop offset="100%" stopColor="#0d0e18" />
                  </linearGradient>
                  <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#131127" />
                    <stop offset="60%" stopColor="#090a14" />
                    <stop offset="100%" stopColor="#05050a" />
                  </linearGradient>
                  <linearGradient id="screenGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Laptop Screen Lid */}
                <g transform="translate(60, 20)">
                  <rect x="0" y="0" width="400" height="248" rx="16" fill="url(#laptopBody)" stroke="#2b2d42" strokeWidth="2" />
                  <circle cx="200" cy="9" r="3" fill="#111" />
                  <circle cx="200" cy="9" r="1.2" fill="#4c1d95" />

                  {/* Inner Screen Display */}
                  <rect x="14" y="20" width="372" height="216" rx="6" fill="url(#laptopScreen)" />
                  <rect x="14" y="20" width="372" height="216" rx="6" fill="url(#screenGlow)" />

                  {/* Terminal Header dots */}
                  <circle cx="34" cy="34" r="3.5" fill="#ef4444" opacity="0.8" />
                  <circle cx="46" cy="34" r="3.5" fill="#f59e0b" opacity="0.8" />
                  <circle cx="58" cy="34" r="3.5" fill="#10b981" opacity="0.8" />

                  {/* Subtle code lines */}
                  <g opacity="0.35">
                    <rect x="74" y="32" width="70" height="4" rx="2" fill="#8b5cf6" />
                    <rect x="36" y="52" width="100" height="4" rx="2" fill="#475569" />
                    <rect x="144" y="52" width="60" height="4" rx="2" fill="#c084fc" />
                    <rect x="52" y="66" width="140" height="4" rx="2" fill="#475569" />
                  </g>

                  {/* Glowing </> Code Symbol */}
                  <g filter="url(#neonGlow)">
                    <path
                      d="M170 110L135 138L170 166"
                      stroke="url(#codeGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M210 96L190 180"
                      stroke="#c084fc"
                      strokeWidth="11"
                      strokeLinecap="round"
                    />
                    <path
                      d="M230 110L265 138L230 166"
                      stroke="url(#codeGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Bottom subtle code lines */}
                  <g opacity="0.25">
                    <rect x="36" y="200" width="120" height="4" rx="2" fill="#8b5cf6" />
                    <rect x="166" y="200" width="50" height="4" rx="2" fill="#475569" />
                    <rect x="226" y="200" width="80" height="4" rx="2" fill="#8b5cf6" />
                  </g>
                </g>

                {/* Base & Keyboard */}
                <path
                  d="M15 272C15 267 22 265 35 265L485 265C498 265 505 267 505 272L475 298C472 301 465 303 455 303L65 303C55 303 48 301 45 298L15 272Z"
                  fill="url(#laptopBody)"
                  stroke="#33374e"
                  strokeWidth="1.5"
                />
                <rect x="220" y="270" width="80" height="5" rx="2.5" fill="#2b2d42" />
                <ellipse cx="260" cy="316" rx="220" ry="14" fill="#000000" opacity="0.6" />
              </svg>
            </div>

            {/* Motto Badge: Code • Build • Improve */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#121324]/80 border border-violet-500/25 shadow-lg shadow-black/40 text-xs sm:text-sm font-mono text-violet-300">
              <span className="text-white font-medium">Code</span>
              <span className="text-violet-400">•</span>
              <span className="text-white font-medium">Build</span>
              <span className="text-violet-400">•</span>
              <span className="text-white font-medium">Improve</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
