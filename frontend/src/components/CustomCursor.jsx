import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Detect touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let isVisible = false;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive = !!(
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input') ||
        target?.closest('textarea') ||
        target?.closest('[role="button"]') ||
        target?.classList.contains('interactive')
      );

      if (isInteractive) {
        ring?.classList.add('w-11', 'h-11', 'border-white/60', 'bg-white/5', 'scale-110');
        ring?.classList.remove('w-7', 'h-7', 'border-white/25', 'bg-transparent', 'scale-100');
        dot?.classList.add('w-1.5', 'h-1.5', 'bg-white');
        dot?.classList.remove('w-1', 'h-1', 'bg-white/70');
      } else {
        ring?.classList.remove('w-11', 'h-11', 'border-white/60', 'bg-white/5', 'scale-110');
        ring?.classList.add('w-7', 'h-7', 'border-white/25', 'bg-transparent', 'scale-100');
        dot?.classList.remove('w-1.5', 'h-1.5', 'bg-white');
        dot?.classList.add('w-1', 'h-1', 'bg-white/70');
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
    };

    // Smooth lerp loop for the outer ring without triggering any React state
    const loop = () => {
      curX += (mouseX - curX) * 0.35;
      curY += (mouseY - curY) * 0.35;
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      aria-hidden="true"
    >
      {/* Outer Precision Ring */}
      <div
        ref={ringRef}
        className="rounded-full transition-all duration-200 ease-out border w-7 h-7 border-white/25 bg-transparent scale-100"
      />
      {/* Inner White Dot */}
      <div
        ref={dotRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 w-1 h-1 bg-white/70"
      />
    </div>
  );
}
