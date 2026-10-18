import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(12);
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFading(true), 250);
          setTimeout(() => {
            setRemoved(true);
            if (onComplete) onComplete();
          }, 950);
          return 100;
        }
        const step = Math.floor(Math.random() * 18) + 12;
        return Math.min(100, prev + step);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-700 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading Nihal MV Portfolio"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Geometric Monogram Emblem */}
        <div className="w-14 h-14 mb-8 flex items-center justify-center animate-pulse">
          <svg viewBox="0 0 100 100" fill="none" className="w-12 h-12">
            <defs>
              <linearGradient id="load-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#C5CBD3" />
                <stop offset="100%" stopColor="#7B828E" />
              </linearGradient>
              <linearGradient id="load-logo-core" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#4B5260" />
              </linearGradient>
            </defs>
            <path d="M50 14 L18 84 L30 84 L50 36 L70 84 L82 84 Z" fill="url(#load-logo-grad)" />
            <path d="M50 42 L34 80 L66 80 Z" fill="#050505" />
            <path d="M50 46 L40 70 L60 70 Z" fill="url(#load-logo-core)" />
            <path d="M32 64 L68 64 L65 67 L35 67 Z" fill="#FFFFFF" opacity="0.6" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.35em] uppercase text-white mb-3">
          NIHAL MV
        </h1>

        <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-400 font-light mb-8 font-mono">
          LOADING ARCHITECTURE • {progress}%
        </p>

        {/* Progress Bar Line */}
        <div className="w-48 sm:w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-400 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
