import React, { useEffect, useRef } from 'react';

export default function GlowCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -200;
    let mouseY = -200;
    let currentX = -200;
    let currentY = -200;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updatePosition = () => {
      // Smooth lerp following
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      cursor.style.transform = `translate3d(${currentX - 180}px, ${currentY - 180}px, 0)`;
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-[360px] h-[360px] rounded-full bg-violet-600/12 blur-[90px] pointer-events-none z-10 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
}

