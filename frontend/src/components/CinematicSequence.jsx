import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, ArrowUp, ArrowRight, Gauge } from 'lucide-react';

export default function CinematicSequence({ onExplore }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Three.js Scene Setup & Scroll Linkage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    // Group holding the 3D model
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Complex 3D Geometric Core (Aerion Futuristic Core)
    const innerGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.9
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    coreGroup.add(innerCore);

    // Crystalline solid nucleus
    const nucGeom = new THREE.OctahedronGeometry(0.8, 0);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8
    });
    const nucleus = new THREE.Mesh(nucGeom, nucMat);
    coreGroup.add(nucleus);

    // 2. Orbital Gimbal Rings
    const ring1Geom = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d8,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ring1Geom, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(3.0, 0.015, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 3. Surrounding 800-Particle Swarm
    const particleCount = 750;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = (Math.random() - 0.5) * 16;
      posArray[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.028,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeom, particleMat);
    scene.add(particleField);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.2);
    dirLight2.position.set(-5, -5, -4);
    scene.add(dirLight2);

    // Target rotation values for smooth lerp
    let targetRotY = 0;
    let targetRotX = 0;
    let targetCamZ = 7;
    let targetCamY = 0;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Continuous gentle drift
      nucleus.rotation.y += 0.008;
      nucleus.rotation.x += 0.005;
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;
      particleField.rotation.y += 0.0004;

      // Lerp 3D model transforms to match scroll position
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.08;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // Scroll listener calculates exact scroll percentage
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      setScrollProgress(progress);

      const frame = Math.min(240, Math.max(1, Math.floor(progress * 239) + 1));
      setCurrentFrame(frame);

      // Map progress to 3D rotation & camera flight
      targetRotY = progress * Math.PI * 4;
      targetRotX = Math.sin(progress * Math.PI * 2) * 0.45;
      targetCamZ = 7 - Math.sin(progress * Math.PI) * 2.2;
      targetCamY = Math.cos(progress * Math.PI * 2) * 0.6;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      nucGeom.dispose();
      nucMat.dispose();
      ring1Geom.dispose();
      ring2Geom.dispose();
      ringMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  // Helper function for stage opacity and transform calculations
  const getStageStyle = (start, end) => {
    const fadeIn = start;
    const peakStart = start + 0.03;
    const peakEnd = end - 0.03;
    const fadeOut = end;

    let opacity = 0;
    let translateY = 20;

    if (scrollProgress >= fadeIn && scrollProgress <= fadeOut) {
      if (scrollProgress < peakStart) {
        opacity = (scrollProgress - fadeIn) / (peakStart - fadeIn);
        translateY = 20 * (1 - opacity);
      } else if (scrollProgress > peakEnd) {
        opacity = 1 - (scrollProgress - peakEnd) / (fadeOut - peakEnd);
        translateY = -20 * (1 - opacity);
      } else {
        opacity = 1;
        translateY = 0;
      }
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: opacity > 0.4 ? 'auto' : 'none',
      visibility: opacity > 0.02 ? 'visible' : 'hidden'
    };
  };

  const formattedFrame = String(currentFrame).padStart(3, '0');

  return (
    <div
      ref={containerRef}
      id="cinematic-sequence"
      className="relative w-full h-[650vh] bg-[#050505]"
    >
      {/* Sticky 100dvh Viewport Container */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden z-10">
        
        {/* Fullscreen 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Nihal MV - Fullstack 3D Architecture Canvas"
          className="absolute inset-0 w-full h-full block object-cover z-0 pointer-events-none"
        />

        {/* Ambient Vignette Overlay matching Aerion */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.7)_100%)] z-[1]" />

        {/* HUD Top Bar: Logo & Navigation */}
        <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-auto">
          <a href="#" className="flex items-center gap-3.5 group focus:outline-none">
            {/* Aerion Monogram Emblem */}
            <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" fill="none" className="w-7 h-7">
                <defs>
                  <linearGradient id="nav-sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="60%" stopColor="#C5CBD3" />
                    <stop offset="100%" stopColor="#7B828E" />
                  </linearGradient>
                  <linearGradient id="nav-sym-core" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#4B5260" />
                  </linearGradient>
                </defs>
                <path d="M50 14 L18 84 L30 84 L50 36 L70 84 L82 84 Z" fill="url(#nav-sym-grad)" />
                <path d="M50 42 L34 80 L66 80 Z" fill="#050505" />
                <path d="M50 46 L40 70 L60 70 Z" fill="url(#nav-sym-core)" />
                <path d="M32 64 L68 64 L65 67 L35 67 Z" fill="#FFFFFF" opacity="0.6" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-light tracking-[0.3em] text-white uppercase leading-none group-hover:text-zinc-200 transition-colors">
              NIHAL MV
            </span>
          </a>

          {/* Center Monospaced Nav Links */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main Navigation">
            <a href="#philosophy" className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors relative py-1 focus:outline-none focus:text-white">
              PHILOSOPHY
            </a>
            <a href="#telemetry" className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors relative py-1 focus:outline-none focus:text-white">
              TELEMETRY
            </a>
            <a href="#technology" className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors relative py-1 focus:outline-none focus:text-white">
              TECHNOLOGY
            </a>
            <a href="#creations" className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors relative py-1 focus:outline-none focus:text-white">
              CREATIONS
            </a>
            <a href="#contact" className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors relative py-1 focus:outline-none focus:text-white">
              CONTACT
            </a>
          </nav>

          {/* Quick Action: TOP button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
              aria-label="Scroll to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* HUD Bottom Bar: Frame Counter & Scroll Guide */}
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-white/10 pt-4 pointer-events-auto">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            <span className="text-zinc-300 font-semibold tracking-widest">NIHAL MV</span>
            <span>—</span>
            <span>FRAME {formattedFrame} / 240</span>
          </div>

          <button
            onClick={() => {
              const target = document.getElementById('philosophy');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>

        {/* STAGE 01: Hero Intro (0% - 16%) */}
        <div
          style={getStageStyle(0.0, 0.16)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-start text-left transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase">
                01 / CONCEPT DEVELOPER STUDY
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white leading-[0.88] drop-shadow-2xl mb-3">
              NIHAL MV
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm font-light tracking-[0.3em] sm:tracking-[0.4em] text-zinc-400 uppercase mb-4">
              MERN STACK DEVELOPER • KERALA, INDIA
            </p>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow">
              I build responsive, high-performance web applications using React, Node.js, Express.js and MongoDB.
            </p>
          </div>
        </div>

        {/* STAGE 02: Runtime Dynamics (18% - 34%) */}
        <div
          style={getStageStyle(0.18, 0.34)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-end text-right transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center justify-end gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>02 / RUNTIME DYNAMICS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              PURE PROPULSION.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow mb-6">
              Instantaneous state flow, clean component trees, and sub-second API roundtrips engineered for real-world load.
            </p>

            {/* Spec Cards matching Aerion */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-left">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  LIGHTHOUSE
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  99+
                </span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-left">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  FIRST PAINT
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  0.4 S
                </span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-left">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  RESPONSIVE
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  100 %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 03: Frontend Rigidity (36% - 52%) */}
        <div
          style={getStageStyle(0.36, 0.52)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-start text-left transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>03 / FRONTEND RIGIDITY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              REACT & TAILWIND.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow">
              Modular UI components built with React 19, Vite, and utility-first Tailwind CSS. Structured for fluid transitions and accessibility.
            </p>
          </div>
        </div>

        {/* STAGE 04: Backend Computing (54% - 70%) */}
        <div
          style={getStageStyle(0.54, 0.70)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-center text-center transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>04 / SERVER RUNTIME</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              NODE.JS & REST APIS.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow">
              Non-blocking asynchronous Express.js servers fortified with schema validation, CORS security, and modular service controllers.
            </p>
          </div>
        </div>

        {/* STAGE 05: Active Data Pipeline (72% - 86%) */}
        <div
          style={getStageStyle(0.72, 0.86)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-start text-left transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>05 / ACTIVE DATA PIPELINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              MONGODB ATLAS.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow mb-6">
              Document modeling with Mongoose, indexed queries, and resilient database connectivity for retail and e-commerce scale.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  API LATENCY
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  &lt; 30 MS
                </span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  VALIDATION
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  STRICT
                </span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                  CLUSTER
                </span>
                <span className="text-base sm:text-lg md:text-xl font-bold font-mono text-white">
                  ATLAS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 06: Archive & Creations (88% - 100%) */}
        <div
          style={getStageStyle(0.88, 1.0)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-center text-center transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>06 / PORTFOLIO ARCHIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              THE ART OF CODE.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow mb-8">
              A study in fullstack architecture, user interfaces, and responsive web systems.
            </p>

            <div className="pointer-events-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('creations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-2xl hover:scale-105"
              >
                <span>EXPLORE CREATIONS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

