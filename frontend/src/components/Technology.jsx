import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Technology() {
  const modules = [
    {
      subtitle: 'MODULAR UI ARCHITECTURE',
      title: 'REACT.JS & MODERN FRONTEND',
      description: 'React.js, JavaScript (ES6+), Vite, Tailwind CSS, HTML5, and CSS3. Atomic component hierarchy with deterministic state hooks, accessible DOM semantics, and zero layout shift.',
      spec: 'SPEC: FRONTEND LAYER',
      tolerance: 'TOLERANCE: 60/120 FPS'
    },
    {
      subtitle: 'EVENT-DRIVEN SERVER RUNTIME',
      title: 'NODE.JS & RESTFUL APIS',
      description: 'Node.js, Express.js, RESTful API design, and Python. Non-blocking asynchronous I/O execution, route middleware, input sanitation, and resilient error boundaries.',
      spec: 'SPEC: SERVER RUNTIME',
      tolerance: 'TOLERANCE: < 30MS LATENCY'
    },
    {
      subtitle: 'SCALABLE DATA PIPELINES',
      title: 'MONGODB ATLAS & PERSISTENCE',
      description: 'MongoDB, MongoDB Atlas Cloud, SQL, and Mongoose ORM. Document schema design, indexing strategies, compound keys, and reliable connection pooling for transactional data.',
      spec: 'SPEC: PERSISTENCE LAYER',
      tolerance: 'TOLERANCE: STRICT SCHEMA'
    },
    {
      subtitle: '3D GRAPHICS & DEV PLATFORMS',
      title: 'THREE.JS, GSAP & CLOUD ECOSYSTEM',
      description: 'Three.js WebGL, GSAP, Git, GitHub, VS Code, Postman, Vercel, Render, PyCharm, Flutter, Android Studio, ChatGPT, Antigravity, and Cloud deployment pipelines.',
      spec: 'SPEC: DEV & DEPLOYMENT',
      tolerance: 'TOLERANCE: ZERO DOWNTIME'
    }
  ];

  return (
    <section
      id="technology"
      className="relative min-h-screen w-full bg-[#08090d]/85 backdrop-blur-md text-white flex flex-col justify-center px-4 sm:px-6 md:px-16 py-24 sm:py-28 z-20 border-t border-zinc-800/80"
      aria-label="Technology Architecture"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-6 mb-12 sm:mb-16 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-300">
              BAY 03 // TECHNOLOGY ARCHITECTURE
            </span>
          </div>
          <div className="inline-flex items-center gap-2 border border-cyan-500/40 px-3.5 py-1 rounded-full bg-cyan-950/40 backdrop-blur-md w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-200 uppercase">
              FRAME 04 // TECH HYPERCAR ACTIVE
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white leading-[0.95] mb-4">
            ENGINEERED<br />
            <span className="text-zinc-500">FOR PRODUCTION.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            At the confluence of modern frontend interactivity and resilient server architecture. Every technology in the stack is chosen for performance and reliability.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="p-8 md:p-10 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">
                    {mod.subtitle}
                  </span>
                  <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-300 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-light uppercase tracking-wider text-white mb-3 flex items-center justify-between font-display">
                  <span>{mod.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </h3>

                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {mod.description}
                </p>
              </div>

              {/* Bottom Specs Line */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{mod.spec}</span>
                <span>{mod.tolerance}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

