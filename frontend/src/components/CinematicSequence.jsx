import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ArrowDown, ArrowUp, ArrowRight, Gauge, Cpu, Database, Layout, Sparkles, Move3d, ShieldCheck, Wrench } from 'lucide-react';

export default function CinematicSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeModelMode, setActiveModelMode] = useState('auto'); // 'auto', 'unveiled', 'covered'
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // Live 3D telemetry coordinates state
  const [telemetryCoords, setTelemetryCoords] = useState({ rotX: 0, rotY: 0, rotZ: 0 });

  // References for cross-scope model and interaction control
  const coverModelRef = useRef(null);
  const carModelRef = useRef(null);
  const carRootGroupRef = useRef(null);
  const activeModeRef = useRef('auto');
  activeModeRef.current = activeModelMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. High-Precision WebGL Renderer for Automotive Detailing Studio
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
    scene.fog = new THREE.FogExp2(0x08090d, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Camera positioned for large studio garage perspective
    camera.position.set(1.5, 0.85, 4.8);

    // Parent group for car & animations
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.x = 0.9;
    }
    carRootGroupRef.current = carRootGroup;
    scene.add(carRootGroup);

    // 2. Pure Automotive Detailing Studio Lighting (No Universe/Neon)
    // Pure Daylight White Ambient Light (5500K Clean Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Overhead Studio Softbox Light (Generates classic roof reflection stripe)
    const overheadLight = new THREE.DirectionalLight(0xffffff, 4.2);
    overheadLight.position.set(0, 9, 2);
    scene.add(overheadLight);

    // Front Left Detailing Light (Polished Chrome & Hood reflections)
    const leftLight = new THREE.DirectionalLight(0xf1f5f9, 3.0);
    leftLight.position.set(-6, 4, 4);
    scene.add(leftLight);

    // Front Right Studio Light (Passenger side curves & rims)
    const rightLight = new THREE.DirectionalLight(0xf8fafc, 3.0);
    rightLight.position.set(6, 4, 4);
    scene.add(rightLight);

    // Rear Edge Specular Light (Highlights ducktail spoiler and rear arches)
    const rearLight = new THREE.DirectionalLight(0xe2e8f0, 2.6);
    rearLight.position.set(0, 5, -6);
    scene.add(rearLight);

    // Low Ground Bounce Light
    const groundBounce = new THREE.DirectionalLight(0xdbeafe, 1.0);
    groundBounce.position.set(0, -3, 0);
    scene.add(groundBounce);

    // 3. Overhead Garage LED Strip Light Rig (Detailing Studio Ceiling Lights)
    const ceilingRig = new THREE.Group();
    const stripGeom = new THREE.BoxGeometry(0.06, 0.03, 7.5);
    const stripMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // 5 Parallel white LED ceiling strips like modern car detailing bays
    [-1.8, -0.9, 0, 0.9, 1.8].forEach((xOffset) => {
      const strip = new THREE.Mesh(stripGeom, stripMat);
      strip.position.set(xOffset, 4.2, 0);
      ceilingRig.add(strip);
    });
    scene.add(ceilingRig);

    // 4. Polished High-Gloss Dark Epoxy Garage Floor
    const floorGeom = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b10,
      roughness: 0.14,
      metalness: 0.9,
      transparent: true,
      opacity: 0.95
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.15;
    scene.add(floor);

    // Garage Detailing Bay Floor Lines (Crisp Silver & White Markings)
    const bayLinesGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.6 });
    
    // Outer parking bay boundary
    const boundaryGeom = new THREE.RingGeometry(3.6, 3.63, 64);
    const boundary = new THREE.Mesh(boundaryGeom, lineMat);
    boundary.rotation.x = -Math.PI / 2;
    boundary.position.y = -1.14;
    bayLinesGroup.add(boundary);

    // Left and Right bay guide marks
    const sideMarkerGeom = new THREE.PlaneGeometry(0.05, 5.5);
    const leftMarker = new THREE.Mesh(sideMarkerGeom, lineMat);
    leftMarker.rotation.x = -Math.PI / 2;
    leftMarker.position.set(-2.2, -1.14, 0);
    bayLinesGroup.add(leftMarker);

    const rightMarker = new THREE.Mesh(sideMarkerGeom, lineMat);
    rightMarker.rotation.x = -Math.PI / 2;
    rightMarker.position.set(2.2, -1.14, 0);
    bayLinesGroup.add(rightMarker);

    // Wheel stop markers
    const stopGeom = new THREE.PlaneGeometry(1.2, 0.08);
    const frontStop = new THREE.Mesh(stopGeom, lineMat);
    frontStop.rotation.x = -Math.PI / 2;
    frontStop.position.set(0, -1.14, 2.5);
    bayLinesGroup.add(frontStop);

    scene.add(bayLinesGroup);

    // 5. Initial Geometric Placeholder (while GLB models load)
    const placeholderGroup = new THREE.Group();
    const wireGeom = new THREE.IcosahedronGeometry(2.0, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    placeholderGroup.add(wireMesh);
    carRootGroup.add(placeholderGroup);

    // 6. GLTF Loader Setup with BIG Model Scaling
    const loader = new GLTFLoader();

    // Helper: Normalize & center 3D model with LARGER scale for high impact
    const normalizeModel = (gltfScene, targetDim = 5.6) => {
      const box = new THREE.Box3().setFromObject(gltfScene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = targetDim / maxDim;

      gltfScene.scale.setScalar(scale);
      gltfScene.position.x = -center.x * scale;
      gltfScene.position.y = -center.y * scale - 0.12;
      gltfScene.position.z = -center.z * scale;

      // Enhance materials for realistic paint, glass, chrome and clearcoat
      gltfScene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = 2.2;
            child.material.roughness = Math.max(0.06, child.material.roughness * 0.85);
            child.material.metalness = Math.min(0.96, child.material.metalness * 1.15);
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
        const porsche = normalizeModel(gltf.scene, 5.6);
        porsche.rotation.y = -Math.PI / 2.2; // 3/4 Studio Hero Stance
        carModelRef.current = porsche;
        carRootGroup.add(porsche);

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

    // Load firstfream.glb (Covered Prototype - Unveiling Concept)
    loader.load(
      '/firstfream.glb',
      (gltf) => {
        const cover = normalizeModel(gltf.scene, 5.75);
        cover.rotation.y = -Math.PI / 2.2;
        coverModelRef.current = cover;
        carRootGroup.add(cover);
      },
      undefined,
      (err) => console.warn('Could not load firstfream.glb:', err)
    );

    // 7. Interactive Drag to Orbit & Mouse Parallax
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotY = 0;
    let dragRotX = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        dragRotY += deltaX * 0.006;
        dragRotX += deltaY * 0.004;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for dragging 3D car on mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - dragStartX;
        const deltaY = e.touches[0].clientY - dragStartY;
        dragRotY += deltaX * 0.008;
        dragRotX += deltaY * 0.005;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Target animation values
    let currentScroll = 0;
    let scrollRotY = 0;
    let scrollRotX = 0;
    let targetCamY = 0.85;
    let targetCamZ = 4.8;

    let animId;
    let lastTelemetryUpdate = 0;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);

      // Model Unveiling Logic
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
          // 'auto' mode: Smooth lift and unveil as user scrolls past 0.18
          if (currentScroll < 0.20) {
            cover.visible = true;
            const liftRatio = Math.max(0, (currentScroll - 0.12) / 0.08);
            cover.position.y = liftRatio * 2.8;
            cover.scale.setScalar(1 + liftRatio * 0.15);
            car.visible = liftRatio > 0.08;
          } else {
            cover.visible = false;
            car.visible = true;
            cover.position.y = 0;
            cover.scale.setScalar(1);
          }
        }
      }

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + mouseX * 0.12;
      const totalTargetRotX = scrollRotX + dragRotX + mouseY * 0.08;

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.07;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.07;

      camera.position.y += (targetCamY - camera.position.y) * 0.07;
      camera.position.z += (targetCamZ - camera.position.z) * 0.07;
      camera.lookAt(carRootGroup.position.x, 0.15, 0);

      // Live telemetry coordinates update
      if (time - lastTelemetryUpdate > 80) {
        lastTelemetryUpdate = time;
        const degY = Math.round((carRootGroup.rotation.y * 180) / Math.PI) % 360;
        const degX = Math.round((carRootGroup.rotation.x * 180) / Math.PI) % 360;
        setTelemetryCoords({
          rotX: degX >= 0 ? degX : 360 + degX,
          rotY: degY >= 0 ? degY : 360 + degY,
          rotZ: Math.round(currentScroll * 100)
        });
      }

      renderer.render(scene, camera);
    };
    animate(0);

    // Scroll listener calculates exact scroll percentage
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

      // Cinematic 360-degree camera & model choreography in the garage:
      // Stage 1 (0.00 - 0.18): Hero front 3/4 stance
      // Stage 2 (0.20 - 0.35): Unveiled side profile & alloy wheels
      // Stage 3 (0.36 - 0.52): Front hood & headlights inspection
      // Stage 4 (0.54 - 0.70): Rear ducktail spoiler & dual exhausts
      // Stage 5 (0.72 - 0.86): Top aerodynamic telemetry angle
      // Stage 6 (0.88 - 1.00): Full studio showroom pose
      scrollRotY = progress * Math.PI * 4;
      scrollRotX = Math.sin(progress * Math.PI * 2) * 0.12;
      targetCamY = 0.85 + Math.sin(progress * Math.PI * 3) * 0.35;
      targetCamZ = 4.8 - Math.sin(progress * Math.PI) * 0.8;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth >= 1024) {
        carRootGroup.position.x = 0.9;
      } else {
        carRootGroup.position.x = 0;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      floorGeom.dispose();
      floorMat.dispose();
      stripGeom.dispose();
      stripMat.dispose();
      boundaryGeom.dispose();
      sideMarkerGeom.dispose();
      stopGeom.dispose();
      lineMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
    };
  }, []);

  // Determine current chapter / milestone index (0 to 5)
  const getActiveChapter = () => {
    if (scrollProgress < 0.18) return 0;
    if (scrollProgress < 0.35) return 1;
    if (scrollProgress < 0.52) return 2;
    if (scrollProgress < 0.70) return 3;
    if (scrollProgress < 0.86) return 4;
    return 5;
  };

  const activeChapter = getActiveChapter();

  const chapters = [
    {
      step: 'BAY 01 / 06',
      tag: 'CHASSIS & ARCHITECTURE',
      title: 'NIHAL MV',
      subtitle: 'MERN STACK DEVELOPER • KERALA, INDIA',
      description: 'Precision fullstack engineering with React, Node.js, Express, and MongoDB. Hand-built with clean code discipline.',
      badge: 'BCA 2023–2026',
      icon: Wrench,
      stats: [
        { label: 'STACK', val: 'MERN' },
        { label: 'ENGINEERING', val: 'FULLSTACK' },
        { label: 'GARAGE BASE', val: 'KERALA' }
      ]
    },
    {
      step: 'BAY 02 / 06',
      tag: 'RUNTIME TELEMETRY',
      title: 'PERFORMANCE BENCHMARK',
      subtitle: 'UNVEILED SYSTEM RIGIDITY',
      description: 'Sub-second initial paint, zero layout shifts, and non-blocking asynchronous event loop execution.',
      badge: '99+ LIGHTHOUSE',
      icon: Gauge,
      stats: [
        { label: 'FIRST PAINT', val: '0.4 S' },
        { label: 'UPTIME', val: '99.9%' },
        { label: 'LATENCY', val: '< 30 MS' }
      ]
    },
    {
      step: 'BAY 03 / 06',
      tag: 'FRONTEND AERODYNAMICS',
      title: 'REACT & TAILWIND',
      subtitle: 'MODULAR UI & ACCESSIBILITY',
      description: 'Single-source-of-truth component state, fluid responsive breakpoints, and strict semantic markup.',
      badge: 'REACT 19 + VITE',
      icon: Layout,
      stats: [
        { label: 'FRAME RATE', val: '60/120' },
        { label: 'RESPONSIVE', val: '100%' },
        { label: 'BUNDLE GZIP', val: '< 50 KB' }
      ]
    },
    {
      step: 'BAY 04 / 06',
      tag: 'POWERTRAIN SERVICES',
      title: 'NODE & REST APIS',
      subtitle: 'SECURE ASYNCHRONOUS SERVER',
      description: 'Modular routing controllers, strict input validation, CORS security, and resilient error boundary handlers.',
      badge: 'EXPRESS.JS RUNTIME',
      icon: Cpu,
      stats: [
        { label: 'PROTOCOL', val: 'REST' },
        { label: 'I/O PIPELINE', val: 'NON-BLOCK' },
        { label: 'SECURITY', val: 'STRICT' }
      ]
    },
    {
      step: 'BAY 05 / 06',
      tag: 'DATA STORAGE & RETRIEVAL',
      title: 'MONGODB ATLAS',
      subtitle: 'TRANSACTIONAL DATA PIPELINE',
      description: 'Mongoose document schema modeling, indexing strategies, and automated cloud clustering for retail data.',
      badge: 'ATLAS CLOUD',
      icon: Database,
      stats: [
        { label: 'SCHEMA', val: 'STRICT' },
        { label: 'QUERIES', val: 'INDEXED' },
        { label: 'AVAILABILITY', val: '99.99%' }
      ]
    },
    {
      step: 'BAY 06 / 06',
      tag: 'GARAGE SHOWROOM',
      title: 'FEATURED CREATIONS',
      subtitle: 'DEPLOYED APPLICATIONS',
      description: 'Explore SmartMart AI (Billing System), TrachMart (E-Commerce), and GoTravel (Travel Platform).',
      badge: '3 LIVE APPS',
      icon: Sparkles,
      stats: [
        { label: 'PRODUCTIONS', val: '3+' },
        { label: 'SOURCE CODE', val: 'GITHUB' },
        { label: 'HOSTING', val: 'VERCEL' }
      ]
    }
  ];

  const currentChapterData = chapters[activeChapter];
  const IconComponent = currentChapterData.icon;
  const formattedFrame = String(currentFrame).padStart(3, '0');

  return (
    <div
      ref={containerRef}
      id="cinematic-sequence"
      className="relative w-full h-[650vh] bg-[#08090d]"
    >
      {/* Sticky 100dvh Viewport Container */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-between overflow-hidden z-10">
        
        {/* Fullscreen 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="3D Supercar Detailing Garage Canvas"
          className="absolute inset-0 w-full h-full block object-cover z-0 cursor-grab active:cursor-grabbing"
        />

        {/* Ambient Dark Studio Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,9,13,0.85)_100%)] z-[1]" />

        {/* Top High-Tech Silver & Black HUD Header */}
        <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto">
          {/* Logo & Status */}
          <a href="#" className="flex items-center gap-3.5 group focus:outline-none" aria-label="Nihal MV - Return to top">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-600/50 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-lg shadow-black/60">
              <span className="text-xs font-mono font-bold">N</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-light tracking-[0.3em] text-white uppercase font-display leading-none group-hover:text-zinc-200 transition-colors block">
                NIHAL MV
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                MERN GARAGE STUDIO
              </span>
            </div>
          </a>

          {/* Center Silver Monospaced Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            <a href="#philosophy" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              PHILOSOPHY
            </a>
            <a href="#telemetry" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              TELEMETRY
            </a>
            <a href="#technology" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              TECHNOLOGY
            </a>
            <a href="#creations" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              CREATIONS
            </a>
            <a href="#contact" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              CONTACT
            </a>
          </nav>

          {/* Right Controls: 3D Model Mode Switcher + Quick Actions */}
          <div className="flex items-center gap-3">
            {/* 3D Model Switcher (Silver & Black Theme) */}
            <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-[#111318]/95 border border-zinc-700/60 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase shadow-xl shadow-black/50">
              <button
                onClick={() => setActiveModelMode('auto')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeModelMode === 'auto' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Scroll Unveil Mode"
              >
                AUTO UNVEIL
              </button>
              <button
                onClick={() => setActiveModelMode('unveiled')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeModelMode === 'unveiled' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Force Show Porsche 911 Turbo"
              >
                PORSCHE
              </button>
              <button
                onClick={() => setActiveModelMode('covered')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeModelMode === 'covered' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Force Show Covered Prototype"
              >
                COVER
              </button>
            </div>

            {/* Scroll to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-400 bg-zinc-900/60 text-zinc-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors"
              aria-label="Scroll to top"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </header>

        {/* LEFT COLUMN: Car Care Garage Telemetry HUD Dashboard */}
        <div className="relative z-20 w-full max-w-lg lg:max-w-md px-6 sm:px-10 lg:pl-12 lg:pr-0 pointer-events-none select-none flex flex-col justify-center">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0e1017]/90 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/90 pointer-events-auto transition-all duration-300">
            
            {/* HUD Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 shadow-[0_0_8px_#ffffff] animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-slate-200 font-bold uppercase">
                  GARAGE DETAILING BAY
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                {currentChapterData.step}
              </span>
            </div>

            {/* Chapter 0: Exact Aerion Hero Font & Structure / Subsequent Chapters */}
            {activeChapter === 0 ? (
              <div className="mb-6">
                {/* Concept Study Status Badge matching Aerion */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase">
                    GARAGE DETAILING STUDIO
                  </span>
                </div>

                {/* Name Heading matching Aerion: font-extralight uppercase tracking-[0.18em] font-display */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight uppercase tracking-[0.18em] text-white font-display leading-[0.9] drop-shadow-2xl mb-2">
                  NIHAL MV
                </h1>

                {/* Subtitle matching Aerion: font-light tracking-[0.3em] text-zinc-400 */}
                <p className="mt-2 text-[10px] sm:text-xs font-light tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400 uppercase mb-3">
                  THE ART OF CODE // MERN ARCHITECTURE
                </p>

                {/* Description matching Aerion: font-light leading-relaxed text-zinc-300 */}
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  A study in speed, responsive form, and fullstack engineering across modern digital interfaces.
                </p>
              </div>
            ) : (
              <div>
                {/* Chapter Tag Badge matching Aerion */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono tracking-widest uppercase mb-3">
                  <IconComponent size={13} className="text-zinc-300 shrink-0" />
                  <span>{currentChapterData.tag}</span>
                </div>

                {/* Title & Subtitle matching Aerion: font-extralight font-display */}
                <h2 className="text-2xl sm:text-3xl font-extralight uppercase tracking-[0.18em] text-white font-display mb-1.5 leading-tight">
                  {currentChapterData.title}
                </h2>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-light mb-4">
                  {currentChapterData.subtitle}
                </p>

                {/* Description matching Aerion: font-light leading-relaxed */}
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6">
                  {currentChapterData.description}
                </p>
              </div>
            )}

            {/* Live Telemetry Stats Grid in Polished Silver */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {currentChapterData.stats.map((stat, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    {stat.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-100">
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Real-time 3D Coordinates Readout */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span>YAW: <strong className="text-slate-200">{telemetryCoords.rotY}°</strong></span>
                <span>PITCH: <strong className="text-slate-200">{telemetryCoords.rotX}°</strong></span>
              </div>
              <span className="text-zinc-500">
                ZOOM: {telemetryCoords.rotZ}%
              </span>
            </div>

            {/* Chapter Action CTA (If on stage 6) */}
            {activeChapter === 5 && (
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => {
                    const el = document.getElementById('creations');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-zinc-100 via-slate-200 to-zinc-300 text-black font-bold text-xs uppercase tracking-widest hover:from-white hover:to-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/60"
                >
                  <span>EXPLORE FEATURED PROJECTS</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

          </div>

          {/* Interactive 3D Hint */}
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
            <Move3d size={13} className="text-slate-300 animate-pulse" />
            <span>CLICK & DRAG 3D CAR • ROTATE IN STUDIO LIGHT</span>
          </div>
        </div>

        {/* BOTTOM HUD FOOTER: Progress Bar & Frame Counter */}
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-zinc-800 pt-4 pointer-events-auto">
          {/* Left Frame Status */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-white font-bold tracking-widest">PORSCHE 911 TURBO</span>
            <span>—</span>
            <span>FRAME {formattedFrame} / 240</span>
            {modelLoaded ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-600/50 text-[10px] text-slate-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STUDIO GLB ACTIVE
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-600/50 text-[10px] text-zinc-300 font-mono">
                DOWNLOADING 3D MESH ({loadingPercent}%)
              </span>
            )}
          </div>

          {/* Center Visual Chapter Progress Dots */}
          <div className="hidden md:flex items-center gap-2">
            {chapters.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeChapter === idx
                    ? 'w-7 bg-white shadow-[0_0_8px_#ffffff]'
                    : 'w-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Right Scroll Indicator */}
          <button
            onClick={() => {
              const target = document.getElementById('philosophy');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>

      </div>
    </div>
  );
}
