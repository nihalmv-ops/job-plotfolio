import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ArrowDown, ArrowUp, ArrowRight, Eye, Layers } from 'lucide-react';

export default function CinematicSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeModelMode, setActiveModelMode] = useState('auto'); // 'auto', 'unveiled', 'covered'
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // References for cross-scope model control
  const coverModelRef = useRef(null);
  const carModelRef = useRef(null);
  const activeModeRef = useRef('auto');
  activeModeRef.current = activeModelMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Renderer with Photorealistic ACES Filmic Tone Mapping for Luxury Automotive Rendering
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 6.2);

    // Parent group that rotates with scroll and mouse
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);

    // 2. Studio Automotive Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light (Top-Front Overhead Studio Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    // Fill Light (Soft cool reflection)
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 2.0);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    // Rim / Edge Specular Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    rimLight.position.set(0, 7, -6);
    scene.add(rimLight);

    // Underbody Glow / Ground Bounce
    const groundBounce = new THREE.DirectionalLight(0x38bdf8, 1.2);
    groundBounce.position.set(0, -3, 0);
    scene.add(groundBounce);

    // 3. Ground Studio Mirror Disk
    const groundGeom = new THREE.CircleGeometry(8, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.1;
    scene.add(ground);

    // 4. Subtle Orbital Dust Particles (700 particles)
    const particleCount = 650;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = Math.random() * 8 - 1.5;
      posArray[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xd4d4d8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeom, particleMat);
    scene.add(particleField);

    // 5. Initial Geometric Wireframe Placeholder (while GLB models load)
    const placeholderGroup = new THREE.Group();
    const wireGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    placeholderGroup.add(wireMesh);
    carRootGroup.add(placeholderGroup);

    // 6. GLTF Loader Setup
    const loader = new GLTFLoader();

    // Helper: Normalize & center any 3D model
    const normalizeModel = (gltfScene, targetDim = 4.2) => {
      const box = new THREE.Box3().setFromObject(gltfScene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = targetDim / maxDim;

      gltfScene.scale.setScalar(scale);
      gltfScene.position.x = -center.x * scale;
      gltfScene.position.y = -center.y * scale - 0.15;
      gltfScene.position.z = -center.z * scale;

      // Enhance materials for realistic reflections
      gltfScene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = 1.5;
            child.material.needsUpdate = true;
          }
        }
      });

      const wrapper = new THREE.Group();
      wrapper.add(gltfScene);
      return wrapper;
    };

    // Load secondfream.glb (Porsche 911 Turbo - Main Hero Car)
    loader.load(
      '/secondfream.glb',
      (gltf) => {
        const porsche = normalizeModel(gltf.scene, 4.3);
        porsche.rotation.y = -Math.PI / 2; // Initial 3/4 front angle
        carModelRef.current = porsche;
        carRootGroup.add(porsche);

        // Hide placeholder wireframe once car is loaded
        placeholderGroup.visible = false;
        setModelLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingPercent(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => console.warn('Could not load secondfream.glb:', err)
    );

    // Load firstfream.glb (Car Cover - Unveiling Concept)
    loader.load(
      '/firstfream.glb',
      (gltf) => {
        const cover = normalizeModel(gltf.scene, 4.4);
        cover.rotation.y = -Math.PI / 2;
        coverModelRef.current = cover;
        carRootGroup.add(cover);
      },
      undefined,
      (err) => console.warn('Could not load firstfream.glb:', err)
    );

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Target values for smooth lerp
    let currentScroll = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetCamY = 0.8;
    let targetCamZ = 6.2;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Particle subtle ambient drift
      particleField.rotation.y += 0.0003;

      // Unveiling Logic between firstfream (Covered) and secondfream (Porsche)
      const mode = activeModeRef.current;
      const cover = coverModelRef.current;
      const car = carModelRef.current;

      if (cover && car) {
        if (mode === 'covered') {
          cover.visible = true;
          car.visible = false;
        } else if (mode === 'unveiled') {
          cover.visible = false;
          car.visible = true;
        } else {
          // 'auto' scroll mode: Unveil as user scrolls past 0.18
          if (currentScroll < 0.20) {
            cover.visible = true;
            // Cover lifts slightly as it nears 0.20
            const liftRatio = Math.max(0, (currentScroll - 0.12) / 0.08);
            cover.position.y = liftRatio * 2.5;
            cover.scale.setScalar(1 + liftRatio * 0.15);
            car.visible = liftRatio > 0.1;
          } else {
            cover.visible = false;
            car.visible = true;
            cover.position.y = 0;
            cover.scale.setScalar(1);
          }
        }
      }

      // Smooth interpolation of car rotation & camera orbit
      const mouseParallaxX = mouseX * 0.15;
      const mouseParallaxY = mouseY * 0.10;

      carRootGroup.rotation.y += (targetRotY + mouseParallaxX - carRootGroup.rotation.y) * 0.06;
      carRootGroup.rotation.x += (targetRotX + mouseParallaxY - carRootGroup.rotation.x) * 0.06;

      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Scroll mapping
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      currentScroll = progress;
      setScrollProgress(progress);

      const frame = Math.min(240, Math.max(1, Math.floor(progress * 239) + 1));
      setCurrentFrame(frame);

      // Cinematic camera flight choreography around the car
      // 0.00 - 0.16 (Stage 1): Front 3/4 hero view
      // 0.18 - 0.34 (Stage 2): Side aerodynamic profile
      // 0.36 - 0.52 (Stage 3): Low-angle front grill & hood
      // 0.54 - 0.70 (Stage 4): Rear 911 Turbo spoiler & twin exhausts
      // 0.72 - 0.86 (Stage 5): High cinematic dynamic orbit
      // 0.88 - 1.00 (Stage 6): Full 360 return to majestic hero stance

      targetRotY = progress * Math.PI * 4; // 2 complete 360-degree rotations
      targetRotX = Math.sin(progress * Math.PI * 2) * 0.15;
      targetCamY = 0.8 + Math.sin(progress * Math.PI * 3) * 0.45;
      targetCamZ = 6.2 - Math.sin(progress * Math.PI) * 1.5;
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
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      groundGeom.dispose();
      groundMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
    };
  }, []);

  // Helper for stage opacity & transforms
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
          aria-label="3D Supercar Architecture Canvas"
          className="absolute inset-0 w-full h-full block object-cover z-0 pointer-events-none"
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.7)_100%)] z-[1]" />

        {/* HUD Top Bar: Brand, Navigation & 3D Model Mode Switcher */}
        <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-auto">
          <a href="#" className="flex items-center gap-3 group focus:outline-none" aria-label="Nihal MV - Return to top">
            <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
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

          {/* Right Actions: 3D Model Switcher + Top Button */}
          <div className="flex items-center gap-3">
            {/* 3D Model State Toggle (Covered / Unveiled) */}
            <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase">
              <button
                onClick={() => setActiveModelMode('auto')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeModelMode === 'auto' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Automatic scroll unveil transition"
              >
                AUTO UNVEIL
              </button>
              <button
                onClick={() => setActiveModelMode('unveiled')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeModelMode === 'unveiled' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Show 1975 Porsche 911 Turbo"
              >
                PORSCHE
              </button>
              <button
                onClick={() => setActiveModelMode('covered')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeModelMode === 'covered' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
                title="Show Covered Prototype"
              >
                COVER
              </button>
            </div>

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
            <span className="text-zinc-300 font-semibold tracking-widest">3D TELEMETRY</span>
            <span>—</span>
            <span>FRAME {formattedFrame} / 240</span>
            {modelLoaded ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GLB ACTIVE
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[10px] text-amber-400 font-mono">
                LOADING 3D GLB ({loadingPercent}%)
              </span>
            )}
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

        {/* STAGE 02: Runtime Dynamics & Unveiled Silhouette (18% - 34%) */}
        <div
          style={getStageStyle(0.18, 0.34)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-end text-right transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center justify-end gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>02 / DYNAMICS & PROPULSION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-tight text-white leading-[0.9] drop-shadow-xl mb-4">
              PURE PROPULSION.
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-lg drop-shadow mb-6">
              Unveiled engineering: instantaneous state flow, clean component trees, and sub-second API roundtrips.
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

        {/* STAGE 04: Backend Computing & Turbo Aerodynamics (54% - 70%) */}
        <div
          style={getStageStyle(0.54, 0.70)}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-7xl mx-auto z-20 items-center text-center transition-opacity duration-300"
        >
          <div className="max-w-xl">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span>04 / SERVER ARCHITECTURE</span>
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
