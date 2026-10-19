import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Preloader({ onLoaded, heroProgress = 0, isHeroReady = false }) {
  const [displayProgress, setDisplayProgress] = useState(12);
  const [isReady, setIsReady] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Smoothly interpolate displayed percentage towards actual download progress
  useEffect(() => {
    let animId;
    const update = () => {
      setDisplayProgress((prev) => {
        const target = isHeroReady ? 100 : Math.max(prev, Math.min(99, heroProgress));
        if (Math.abs(target - prev) < 0.4) return target;
        return prev + (target - prev) * 0.12;
      });
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [heroProgress, isHeroReady]);

  // Activate Ready button when 3D Hero Car is loaded or after safety timeout (8.5s max)
  useEffect(() => {
    if (isHeroReady) {
      setDisplayProgress(100);
      setIsReady(true);
    }
    const safetyTimer = setTimeout(() => {
      setIsReady(true);
    }, 8500);

    return () => clearTimeout(safetyTimer);
  }, [isHeroReady]);

  const handleEnter = () => {
    setIsFaded(true);
    document.body.style.overflow = '';
    if (onLoaded) onLoaded();

    setTimeout(() => {
      setIsUnmounted(true);
    }, 650);
  };

  // Keyboard shortcut: Press Enter or Space to enter when ready
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isFaded && isReady) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFaded, isReady]);

  if (isUnmounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700 ease-out select-none ${
        isFaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Welcome to Nihal MV Portfolio"
      role="dialog"
    >
      {/* Ambient subtle stealth glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[140px] pointer-events-none" />

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
        <div className="min-h-16 flex items-center justify-center w-full">
          {!isReady ? (
            /* Loading State with Real Progress Bar */
            <div className="flex flex-col items-center gap-3.5 transition-all duration-300 w-full max-w-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-300">
                  CALIBRATING 3D STUDIO • {Math.round(displayProgress)}%
                </span>
              </div>
              
              <div className="w-56 sm:w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-zinc-400 via-white to-cyan-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  style={{ width: `${Math.max(8, Math.min(100, displayProgress))}%` }}
                />
              </div>

              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                INGESTING BMW M4 PROTOTYPE
              </span>

              {/* Optional Skip Button */}
              <button
                onClick={handleEnter}
                className="text-[9px] font-mono text-zinc-600 hover:text-zinc-300 uppercase tracking-widest mt-1 cursor-pointer transition-colors"
              >
                [ SKIP INTRO ]
              </button>
            </div>
          ) : (
            /* Ready State: Enter Button */
            <button
              onClick={handleEnter}
              autoFocus
              className="group px-9 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-[0.3em] transition-all duration-300 flex items-center gap-3 shadow-[0_0_35px_rgba(255,255,255,0.2)] border border-white/20 hover:scale-105 active:scale-95 cursor-pointer animate-fade-in"
              aria-label="Enter Portfolio"
            >
              <span>ENTER GARAGE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Optional hint when ready */}
        {isReady && (
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-400 mt-6 animate-pulse">
            PRESS ENTER OR CLICK TO EXPLORE 3D STUDIO
          </p>
        )}
      </div>
    </div>
  );
}
