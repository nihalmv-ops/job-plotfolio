import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis for responsive, ultra-smooth momentum scrolling
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.25,
      infinite: false
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Make anchor links smoothly scroll via Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -60, duration: 0.9 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
