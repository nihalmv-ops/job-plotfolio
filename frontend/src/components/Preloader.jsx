import React, { useState, useEffect } from 'react';

export default function Preloader({ onLoaded }) {
  const [progress, setProgress] = useState(10);
  const [isFaded, setIsFaded] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Lock scroll during loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let animFrame;
    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds smooth progress

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // easeOutCubic curve for smooth realistic loading physics
      const eased = 1 - Math.pow(1 - ratio, 3);
      const currentProgress = 10 + eased * 90;

      setProgress(Math.min(100, currentProgress));

      if (ratio < 1) {
        animFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Aerion exact exit sequence: 400ms pause, 700ms fade transition
        setTimeout(() => {
          setIsFaded(true);
          if (onLoaded) onLoaded();
          document.body.style.overflow = originalOverflow;

          setTimeout(() => {
            setIsUnmounted(true);
          }, 700);
        }, 400);
      }
    };

    animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
      document.body.style.overflow = originalOverflow;
    };
  }, [onLoaded]);

  if (isUnmounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-700 ease-out select-none ${
        isFaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Nihal MV"
      role="status"
    >
      {/* Aerion ambient radial blur */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Aerion Pulsing Monogram Emblem */}
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

        {/* Aerion Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.35em] uppercase text-white font-display mb-3">
          NIHAL MV
        </h1>

        {/* Aerion Subtitle */}
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.45em] text-zinc-400 font-light mb-8">
          LOADING
        </p>

        {/* Aerion Precision Gradient Loading Line */}
        <div className="w-48 sm:w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-400 transition-all duration-200 ease-out"
            style={{ width: `${Math.max(10, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
