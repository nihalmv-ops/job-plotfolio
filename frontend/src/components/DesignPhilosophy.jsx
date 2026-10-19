import React from 'react';

export default function DesignPhilosophy() {
  return (
    <section
      id="philosophy"
      className="relative min-h-screen w-full bg-black text-white flex flex-col justify-center px-4 sm:px-6 md:px-16 py-24 sm:py-28 z-20 border-t border-white/[0.08] scroll-mt-6"
      aria-label="Design Philosophy"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Studio Detailing Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-300">
              BAY 01 // CRAFT & PHILOSOPHY
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest text-zinc-400">
            PRECISION.STUDIO.2026
          </span>
        </div>

        {/* Heading & Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-[0.95] text-white mb-6 sm:mb-8 font-display">
              SCULPTED<br />
              <span className="text-zinc-400">BY LOGIC.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pt-4 flex flex-col justify-between space-y-8">
            <p className="text-sm sm:text-base tracking-wider text-zinc-400 leading-relaxed font-light">
              Every interface and server module is engineered around clarity, performance, and predictable state flow. No ornamental bloat — only pure purpose etched into maintainable code.
            </p>

            {/* 3D Telemetry Architecture Card */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 relative group flex flex-col justify-between shadow-2xl shadow-black hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-4">
                <span className="text-slate-200">BAY 01 // ARCHITECTURE</span>
                <span className="text-emerald-400">99.9% UPTIME</span>
              </div>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                Reactive 3D WebGL rendering pipeline synchronized with page scroll and interactive turntable controls.
              </p>
            </div>

            {/* Spec Box */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl space-y-4 shadow-2xl shadow-black hover:border-white/20 transition-all duration-300">
              <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                PERFORMANCE BUDGET
              </div>
              <div className="text-3xl font-light tracking-widest text-white font-mono">
                &lt; 50 KB <span className="text-xs text-zinc-400 tracking-normal font-sans">GZIP (Initial Load)</span>
              </div>
              <div className="text-xs text-zinc-400 font-light leading-relaxed">
                Adaptive component lazy-loading and tree-shaken bundles delivering instant interactive fidelity across modern devices.
              </div>
            </div>
          </div>
        </div>

        {/* 3 Surface Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-white/20 hover:bg-black/50 transition-all duration-300 shadow-2xl shadow-black">
            <div className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4">
              SURFACE 01
            </div>
            <h3 className="text-lg font-light tracking-[0.2em] text-white uppercase mb-3">
              COMPONENT MODULARITY
            </h3>
            <p className="text-xs tracking-wider text-zinc-400 leading-relaxed font-light">
              Reusable atomic React components with strict separation of state, logic, and visual layout. Zero duplicate abstractions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-white/20 hover:bg-black/50 transition-all duration-300 shadow-2xl shadow-black">
            <div className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4">
              SURFACE 02
            </div>
            <h3 className="text-lg font-light tracking-[0.2em] text-white uppercase mb-3">
              NEGATIVE SPACES
            </h3>
            <p className="text-xs tracking-wider text-zinc-400 leading-relaxed font-light">
              Carefully proportioned visual hierarchy and rhythm. Content is guided cleanly to human eyes and automated screen-readers alike.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-white/20 hover:bg-black/50 transition-all duration-300 shadow-2xl shadow-black">
            <div className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4">
              SURFACE 03
            </div>
            <h3 className="text-lg font-light tracking-[0.2em] text-white uppercase mb-3">
              ZERO TECHNICAL DEBT
            </h3>
            <p className="text-xs tracking-wider text-zinc-400 leading-relaxed font-light">
              Clean async/await controllers, resilient try/catch exception boundaries, and honest documentation that recruiters can verify immediately.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
