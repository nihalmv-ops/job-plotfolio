import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Move3d } from 'lucide-react';

function CounterValue({ target, decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp = null;
    const duration = 1200; // ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setVal(easedProgress * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    requestAnimationFrame(step);
  }, [hasStarted, target]);

  return <span ref={ref}>{decimals > 0 ? val.toFixed(decimals) : Math.floor(val)}</span>;
}

export default function Telemetry() {
  const specs = [
    {
      label: 'LIGHTHOUSE SCORE',
      value: 99,
      unit: '+',
      decimals: 0,
      description: 'Optimized asset delivery, semantic markup, and high accessibility compliance.'
    },
    {
      label: 'FIRST CONTENTFUL PAINT',
      value: 0.4,
      unit: 'S',
      decimals: 1,
      description: 'Sub-second paint velocity engineered through modular code splitting.'
    },
    {
      label: 'DEPLOYMENT UPTIME',
      value: 99.9,
      unit: '%',
      decimals: 1,
      description: 'Automated continuous integration and resilient hosting on Vercel & Render.'
    },
    {
      label: 'API RESPONSE LATENCY',
      value: 28,
      unit: 'MS',
      decimals: 0,
      description: 'Non-blocking Node.js event loop with optimized database query projection.'
    },
    {
      label: 'RESPONSIVE VIEWPORTS',
      value: 100,
      unit: '%',
      decimals: 0,
      description: 'Adaptive layout testing from 320px mobile viewports up to 4K displays.'
    },
    {
      label: 'CORE TECHNOLOGIES',
      value: 16,
      unit: '+',
      decimals: 0,
      description: 'MERN stack, Three.js, GSAP, Tailwind CSS, REST APIs, Git, and cloud services.'
    }
  ];

  return (
    <section
      id="telemetry"
      className="relative min-h-screen w-full bg-transparent text-white flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 sm:py-28 z-10 border-t border-zinc-800/60"
      aria-label="Telemetry & Performance"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Telemetry & Benchmark Cards (Fits on left side so 3D Car on right is 100% visible) */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl">
          
          {/* Section Header Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-300">
                BAY 02 // TELEMETRY & BENCHMARKS
              </span>
            </div>

            <div className="inline-flex items-center gap-2 border border-zinc-700/60 px-3.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                FRAME 03 // TELEMETRY GT ACTIVE
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.16em] text-white leading-[0.95] mb-3">
              PURE<br />
              <span className="text-zinc-400">VELOCITY.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-lg">
              Calculated for instantaneous user engagement and high-efficiency data fetching. Real metrics derived from production builds.
            </p>
          </div>

          {/* 6 Telemetry Cards Grid (Compact 2-col to keep Right Side Open to 3D Car) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                    {spec.label}
                  </span>
                  <Gauge className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>

                <div className="flex items-baseline gap-1.5 my-1 font-mono">
                  <span className="text-3xl sm:text-4xl font-light tracking-tight text-white">
                    <CounterValue target={spec.value} decimals={spec.decimals} />
                  </span>
                  {spec.unit && (
                    <span className="text-base text-zinc-400 font-light">
                      {spec.unit}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-2 mt-2">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO OVERLAYS! */}
        <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[420px] pointer-events-none select-none">
          <div className="px-4 py-2 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>STAGE 03 // TELEMETRY GT UNVEILED</span>
          </div>

          <div className="space-y-2 text-right">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
              AERODYNAMIC PROFILE • 360° TURNTABLE
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
