import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Preloader({ onLoaded }) {
  const [progress, setProgress] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let animFrame;
    const startTime = performance.now();
    const duration = 1400; // 1.4 seconds smooth load to 100%

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // easeOutCubic curve
      const eased = 1 - Math.pow(1 - ratio, 3);
      const currentProgress = 10 + eased * 90;

      setProgress(Math.min(100, currentProgress));

      if (ratio < 1) {
        animFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsReady(true);
      }
    };

    animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleEnter = () => {
    setIsFaded(true);
    document.body.style.overflow = '';
    if (onLoaded) onLoaded();

    setTimeout(() => {
      setIsUnmounted(true);
    }, 700);
  };

  // Keyboard shortcut: Press Enter or Space to enter when ready
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isFaded) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFaded]);

  if (isUnmounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090d] text-white transition-opacity duration-700 ease-out select-none ${
        isFaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome to Nihal MV Portfolio"
      role="dialog"
    >
      {/* Ambient silver studio light glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-slate-200/[0.03] blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">
        {/* Name Headline matching Aerion */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.35em] uppercase text-white font-display mb-3">
          NIHAL MV
        </h1>

        {/* Professional Subtitle matching Aerion */}
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-zinc-400 font-light mb-8 font-mono">
          MERN STACK ARCHITECTURE
        </p>

        {/* Dynamic Action Area: Progress Bar or Enter Button */}
        <div className="h-14 flex items-center justify-center w-full">
          {!isReady ? (
            /* Loading State with Progress Bar */
            <div className="flex flex-col items-center gap-4 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
                LOADING • {Math.round(progress)}%
              </span>
              <div className="w-48 sm:w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-400 transition-all duration-150 ease-out"
                  style={{ width: `${Math.max(10, Math.min(100, progress))}%` }}
                />
              </div>
            </div>
          ) : (
            /* Ready State: Enter Button */
            <button
              onClick={handleEnter}
              autoFocus
              className="group px-9 py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all duration-300 flex items-center gap-3 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer animate-fade-in"
              aria-label="Enter Portfolio"
            >
              <span>ENTER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Optional hint when ready */}
        {isReady && (
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mt-6 animate-pulse">
            PRESS ENTER OR CLICK TO EXPLORE
          </p>
        )}
      </div>
    </div>
  );
}
