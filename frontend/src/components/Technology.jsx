import React from 'react';
import { ArrowUpRight, Move3d } from 'lucide-react';

export default function Technology() {
  const modules = [
    {
      subtitle: 'MODULAR UI ARCHITECTURE',
      title: 'REACT.JS & MODERN FRONTEND',
      description: 'React.js, JavaScript (ES6+), Vite, Tailwind CSS, HTML5, and CSS3. Atomic component hierarchy with deterministic state hooks, accessible DOM semantics, and zero layout shift.',
      spec: 'SPEC: FRONTEND LAYER',
      tolerance: '60/120 FPS'
    },
    {
      subtitle: 'EVENT-DRIVEN SERVER RUNTIME',
      title: 'NODE.JS & RESTFUL APIS',
      description: 'Node.js, Express.js, RESTful API design, and Python. Non-blocking asynchronous I/O execution, route middleware, input sanitation, and resilient error boundaries.',
      spec: 'SPEC: SERVER RUNTIME',
      tolerance: '< 30MS LATENCY'
    },
    {
      subtitle: 'SCALABLE DATA PIPELINES',
      title: 'MONGODB ATLAS & PERSISTENCE',
      description: 'MongoDB, MongoDB Atlas Cloud, SQL, and Mongoose ORM. Document schema design, indexing strategies, compound keys, and reliable connection pooling for transactional data.',
      spec: 'SPEC: PERSISTENCE LAYER',
      tolerance: 'STRICT SCHEMA'
    },
    {
      subtitle: '3D GRAPHICS & DEV PLATFORMS',
      title: 'THREE.JS, GSAP & CLOUD ECOSYSTEM',
      description: 'Three.js WebGL, GSAP, Git, GitHub, VS Code, Postman, Vercel, Render, PyCharm, Flutter, Android Studio, and Cloud deployment pipelines.',
      spec: 'SPEC: DEV & DEPLOYMENT',
      tolerance: 'ZERO DOWNTIME'
    }
  ];

  return (
    <section
      id="technology"
      className="relative min-h-screen w-full bg-transparent text-white flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 sm:py-28 z-10 border-t border-zinc-800/60"
      aria-label="Technology Architecture"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Technology Modules (Fits on left side so 3D Car on right is 100% visible) */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-300">
                BAY 03 // TECHNOLOGY ARCHITECTURE
              </span>
            </div>
            <div className="inline-flex items-center gap-2 border border-zinc-700/60 px-3.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                FRAME 04 // TECH HYPERCAR ACTIVE
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.16em] text-white leading-[0.95] mb-3">
              ENGINEERED<br />
              <span className="text-zinc-500">FOR PRODUCTION.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-lg">
              At the confluence of modern frontend interactivity and resilient server architecture. Every technology in the stack is chosen for performance and reliability.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#050608]/90 border border-zinc-800/80 backdrop-blur-xl transition-all duration-300 group relative flex flex-col justify-between hover:border-zinc-700 shadow-xl shadow-black"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      {mod.subtitle}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-light uppercase tracking-wider text-white mb-2 flex items-center justify-between font-display">
                    <span>{mod.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                  </h3>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Bottom Specs Line */}
                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{mod.spec}</span>
                  <span className="text-zinc-400 font-light">{mod.tolerance}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO OVERLAYS! */}
        <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[420px] pointer-events-none select-none">
          <div className="px-4 py-2 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>STAGE 04 // TECH HYPERCAR UNVEILED</span>
          </div>

          <div className="space-y-2 text-right">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
              REAR-QUARTER PERSPECTIVE • 360° TURNTABLE
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
              <Move3d size={13} className="text-zinc-400 animate-pulse" />
              <span>DRAG TO ROTATE 360°</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
