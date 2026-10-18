import React, { useState, useEffect, useRef } from 'react';
import { Gauge } from 'lucide-react';

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
      // easeOutCubic
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
      label: '0–100% LIGHTHOUSE',
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
      className="relative min-h-screen w-full bg-[#08090d] text-white flex flex-col justify-center px-4 sm:px-6 md:px-16 py-24 sm:py-28 z-20 border-t border-zinc-800/80"
      aria-label="Telemetry & Performance"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-6 mb-12 sm:mb-16 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-300">
              BAY 02 // TELEMETRY & BENCHMARKS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 border border-zinc-700 px-3.5 py-1 rounded-full bg-zinc-900/60 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              STUDIO TELEMETRY ACTIVE
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white leading-[0.95] mb-4">
            PURE<br />
            <span className="text-zinc-500">VELOCITY.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            Calculated for instantaneous user engagement and high-efficiency data fetching. Real metrics derived from production builds.
          </p>
        </div>

        {/* 6 Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                  {spec.label}
                </span>
                <Gauge className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>

              <div className="flex items-baseline gap-2 my-2 font-mono">
                <span className="text-5xl md:text-6xl font-light tracking-tight text-white">
                  <CounterValue target={spec.value} decimals={spec.decimals} />
                </span>
                {spec.unit && (
                  <span className="text-xl text-zinc-400 font-light">
                    {spec.unit}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 font-light mt-4 leading-relaxed border-t border-white/5 pt-4">
                {spec.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

