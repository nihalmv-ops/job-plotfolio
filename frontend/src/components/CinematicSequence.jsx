import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ArrowDown, ArrowUp, ArrowRight, Gauge, Cpu, Database, Layout, Sparkles, Move3d, ShieldCheck, Wrench } from 'lucide-react';

// ============================================================================
// 🏎️ 3D CAR SLOTS CONFIGURATION
// You can easily swap or add ANY other car .glb file here!
// Just place your new .glb file into frontend/public/ and update the paths below.
// ============================================================================
export const CAR_SLOTS = {
  // Slot 1: First car/frame (Camera zooms in close on initial scroll)
  frame1: {
    url: '/firstfream.glb', // 👈 Change to your 1st car, e.g. '/bmw.glb'
    targetDim: 5.75,
    name: 'FRAME 01 // PROTOTYPE'
  },
  // Slot 2: Second car/frame (Camera zooms out revealing this car on 2nd scroll)
  frame2: {
    url: '/secondfream.glb', // 👈 Change to your 2nd car, e.g. '/ferrari.glb'
    targetDim: 5.6,
    name: 'FRAME 02 // PORSCHE 911 TURBO'
  }
};

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
  const coverModelRef = useRef(null); // Slot 1 model
  const carModelRef = useRef(null);   // Slot 2 model
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

    // Parent group for car & round stage placed distinctly in the right side area
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.x = 1.35; // Anchored in the right side area
    } else if (window.innerWidth >= 768) {
      carRootGroup.position.x = 0.6;
    } else {
      carRootGroup.position.x = 0;
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

    // 5. Photorealistic Automotive Turntable Round Stage
    const stageGroup = new THREE.Group();

    // Stage Top / Main Cylindrical Disc Platform
    const stageGeom = new THREE.CylinderGeometry(3.5, 3.65, 0.16, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 2.2
    });
    const stageMesh = new THREE.Mesh(stageGeom, stageMat);
    stageMesh.position.y = -1.07; // Base rests on floor at -1.15, top surface is at -0.99
    stageMesh.receiveShadow = true;
    stageMesh.castShadow = true;
    stageGroup.add(stageMesh);

    // Beveled Chrome/Silver Outer Bezel Edge Ring
    const bezelGeom = new THREE.TorusGeometry(3.51, 0.035, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.08
    });
    const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.y = -0.99;
    stageGroup.add(bezelMesh);

    // Stage Surface Concentric Detailing Rings (Brushed Silver)
    const stageRingMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.5 });
    
    // Outer accent ring on stage surface
    const stageRing1Geom = new THREE.RingGeometry(2.5, 2.52, 64);
    const stageRing1 = new THREE.Mesh(stageRing1Geom, stageRingMat);
    stageRing1.rotation.x = -Math.PI / 2;
    stageRing1.position.y = -0.988;
    stageGroup.add(stageRing1);

    // Inner accent ring on stage surface
    const stageRing2Geom = new THREE.RingGeometry(1.3, 1.315, 64);
    const stageRing2 = new THREE.Mesh(stageRing2Geom, stageRingMat);
    stageRing2.rotation.x = -Math.PI / 2;
    stageRing2.position.y = -0.988;
    stageGroup.add(stageRing2);

    // Stage LED Halo Underglow Ring on Floor
    const haloGeom = new THREE.RingGeometry(3.55, 3.7, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = -1.145;
    stageGroup.add(haloMesh);

    // Add round stage directly to carRootGroup so both car and stage turn in harmony
    carRootGroup.add(stageGroup);

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
      gltfScene.position.z = -center.z * scale;
      // Precision Grounding: Sets wheels flush on top of the round stage platform at y = -0.99
      gltfScene.position.y = -box.min.y * scale - 0.99;

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

    // Dual-model loading manager to guarantee stage is never empty
    let frame1Loaded = false;
    let frame2Loaded = false;
    let frame1Bytes = 0;
    let frame2Bytes = 0;
    const totalEst = 59942484 + 21970656;

    const checkLoadingStatus = () => {
      const pct = Math.min(100, Math.round(((frame1Bytes + frame2Bytes) / totalEst) * 100));
      setLoadingPercent(pct);
      if (frame1Loaded || frame2Loaded) {
        placeholderGroup.visible = false;
        setModelLoaded(true);
      }
    };

    // Load Slot 1 (First Frame Car - Zoom In Focus)
    loader.load(
      CAR_SLOTS.frame1.url,
      (gltf) => {
        const firstCar = normalizeModel(gltf.scene, CAR_SLOTS.frame1.targetDim);
        firstCar.rotation.y = -Math.PI / 2.2;
        coverModelRef.current = firstCar;
        carRootGroup.add(firstCar);
        frame1Loaded = true;
        frame1Bytes = 59942484;
        checkLoadingStatus();
      },
      (xhr) => {
        if (xhr.loaded > 0) frame1Bytes = xhr.loaded;
        checkLoadingStatus();
      },
      (err) => {
        console.warn(`Could not load ${CAR_SLOTS.frame1.url}:`, err);
        frame1Loaded = true;
        checkLoadingStatus();
      }
    );

    // Load Slot 2 (Second Frame Car - Unveiled Hero Car)
    loader.load(
      CAR_SLOTS.frame2.url,
      (gltf) => {
        const car = normalizeModel(gltf.scene, CAR_SLOTS.frame2.targetDim);
        car.rotation.y = -Math.PI / 2.2; // 3/4 Studio Hero Stance
        carModelRef.current = car;
        carRootGroup.add(car);
        frame2Loaded = true;
        frame2Bytes = 21970656;
        checkLoadingStatus();
      },
      (xhr) => {
        if (xhr.loaded > 0) frame2Bytes = xhr.loaded;
        checkLoadingStatus();
      },
      (err) => {
        console.warn(`Could not load ${CAR_SLOTS.frame2.url}:`, err);
        frame2Loaded = true;
        checkLoadingStatus();
      }
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

      // Model Transition Logic (Frame 1 Zoom In -> Frame 2 Zoom Out)
      const mode = activeModeRef.current;
      const model1 = coverModelRef.current; // Slot 1 model
      const model2 = carModelRef.current;   // Slot 2 model

      if (model1 && model2) {
        if (mode === 'covered') {
          model1.visible = true;
          model2.visible = false;
          model1.position.y = 0;
          model1.scale.setScalar(1);
        } else if (mode === 'unveiled') {
          model1.visible = false;
          model2.visible = true;
        } else {
          // 'auto' mode:
          // 0.00 -> 0.40: Frame 1 is active on stage (Camera zooms in close)
          // 0.40 -> 0.55: Morph / unveil transition right at close zoom
          // 0.55 -> 1.00: Frame 2 is active on stage (Camera zooms out to grand showcase)
          if (currentScroll < 0.40) {
            model1.visible = true;
            model2.visible = false;
            model1.position.y = 0;
            model1.scale.setScalar(1);
            model1.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = 1.0;
              }
            });
          } else if (currentScroll < 0.55) {
            const transitionRatio = (currentScroll - 0.40) / 0.15;
            model1.visible = true;
            model2.visible = true;
            // Smoothly lift and fade out Frame 1 as Frame 2 emerges on stage
            model1.position.y = transitionRatio * 2.2;
            model1.scale.setScalar(1 + transitionRatio * 0.1);
            model1.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = Math.max(0, 1 - transitionRatio * 1.25);
              }
            });
          } else {
            model1.visible = false;
            model2.visible = true;
            model1.position.y = 0;
            model1.scale.setScalar(1);
          }
        }
      } else if (model1) {
        model1.visible = true;
      } else if (model2) {
        model2.visible = true;
      }

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + mouseX * 0.12;
      const totalTargetRotX = scrollRotX + dragRotX + mouseY * 0.08;

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.07;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.07;

      camera.position.y += (targetCamY - camera.position.y) * 0.07;
      camera.position.z += (targetCamZ - camera.position.z) * 0.07;
      camera.lookAt(carRootGroup.position.x, -0.10, 0);

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

    // Scroll listener calculates exact scroll percentage & dynamic zoom
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

      // Cinematic Camera Choreography:
      // Stage 1 (0.00 -> 0.40): ZOOM IN TO FIRST FRAME (Camera 5.2 -> 2.75 close-up)
      // Morph Point (0.40 -> 0.55): At closest focal zoom, Frame 1 transitions into Frame 2
      // Stage 2 (0.40 -> 0.85): ZOOM OUT TO SECOND FRAME (Camera 2.75 -> 5.0 wide heroic stance)
      // Stage 3 (0.85 -> 1.00): Settled stance as user scrolls directly into BAY 01 // CRAFT & PHILOSOPHY
      if (progress < 0.40) {
        // Stage 1: Zoom in to First Frame
        const r1 = progress / 0.40;
        const ease1 = r1 * r1 * (3 - 2 * r1); // smoothstep
        targetCamZ = 5.2 - ease1 * 2.45; // from 5.2 down to 2.75 (Close-up Zoom In)
        targetCamY = 0.82 - ease1 * 0.30; // from 0.82 down to 0.52
        scrollRotY = ease1 * 0.38; // slight angle to front corner
        scrollRotX = ease1 * 0.04;
      } else if (progress < 0.85) {
        // Stage 2: Zoom out to Second Frame
        const r2 = (progress - 0.40) / 0.45;
        const ease2 = r2 * r2 * (3 - 2 * r2); // smoothstep
        targetCamZ = 2.75 + ease2 * 2.25; // from 2.75 up to 5.0 (Grand Zoom Out)
        targetCamY = 0.52 + ease2 * 0.33; // from 0.52 up to 0.85
        scrollRotY = 0.38 + ease2 * (Math.PI * 0.85); // rotates to sweeping 3/4 heroic angle
        scrollRotX = 0.04 - ease2 * 0.03;
      } else {
        // Stage 3: Settled in Hero Stance as user scrolls directly into BAY 01
        targetCamZ = 5.0;
        targetCamY = 0.85;
        scrollRotY = 0.38 + Math.PI * 0.85;
        scrollRotX = 0.01;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth >= 1024) {
        carRootGroup.position.x = 1.35; // Anchored in the right side area
      } else if (window.innerWidth >= 768) {
        carRootGroup.position.x = 0.6;
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
      stageGeom.dispose();
      stageMat.dispose();
      bezelGeom.dispose();
      bezelMat.dispose();
      stageRing1Geom.dispose();
      stageRing2Geom.dispose();
      stageRingMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
    };
  }, []);

  // Determine current active stage (0: Frame 01 Zoom-In, 1: Frame 02 Zoom-Out)
  const isFrame2Active = scrollProgress >= 0.45;
  const formattedFrame = String(currentFrame).padStart(3, '0');

  const scrollToPhilosophy = () => {
    const el = document.getElementById('philosophy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="cinematic-sequence"
      className="relative w-full h-[190vh] bg-[#08090d]"
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
                  activeModelMode === 'auto' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Scroll Zoom 1 -> Zoom 2 Mode"
              >
                AUTO (ZOOM 1→2)
              </button>
              <button
                onClick={() => setActiveModelMode('unveiled')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeModelMode === 'unveiled' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Force View Frame 02"
              >
                FRAME 02
              </button>
              <button
                onClick={() => setActiveModelMode('covered')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeModelMode === 'covered' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
                }`}
                title="Force View Frame 01"
              >
                FRAME 01
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
                {!isFrame2Active ? 'HERO // STAGE 01' : 'HERO // STAGE 02'}
              </span>
            </div>

            {/* Aerion Hero Font & Studio Identity */}
            <div className="mb-5">
              {/* Concept Study Status Badge matching Aerion */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3 pointer-events-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
                  {!isFrame2Active ? 'STAGE 01 // FRAME 01 ZOOM-IN' : 'STAGE 02 // FRAME 02 HERO REVEAL'}
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
                {!isFrame2Active
                  ? 'Scroll to initiate precision close-up zoom towards Frame 01 on the round turntable stage.'
                  : 'Frame 02 unveiled at peak zoom as camera pulls back into expansive 3/4 showroom stance.'}
              </p>
            </div>

            {/* Live Telemetry Stats Grid in Polished Silver */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                  CAMERA
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-100">
                  {!isFrame2Active ? 'ZOOM-IN' : 'ZOOM-OUT'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                  ACTIVE CAR
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-100">
                  {!isFrame2Active ? 'FRAME 01' : 'FRAME 02'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                  TURNTABLE
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-100">
                  360° STAGE
                </span>
              </div>
            </div>

            {/* Real-time 3D Coordinates Readout */}
            <div className="pt-3.5 pb-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span>YAW: <strong className="text-slate-200">{telemetryCoords.rotY}°</strong></span>
                <span>PITCH: <strong className="text-slate-200">{telemetryCoords.rotX}°</strong></span>
              </div>
              <span className="text-zinc-500">
                ZOOM: {telemetryCoords.rotZ}%
              </span>
            </div>

            {/* Direct Flow to BAY 01 // CRAFT & PHILOSOPHY CTA */}
            <button
              onClick={scrollToPhilosophy}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-zinc-200 via-slate-100 to-zinc-300 hover:from-white hover:to-zinc-200 text-black font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/60 group pointer-events-auto"
            >
              <span>GO TO BAY 01 // CRAFT & PHILOSOPHY</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>

          </div>

          {/* Interactive 3D Hint */}
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
            <Move3d size={13} className="text-slate-300 animate-pulse" />
            <span>DRAG 3D CAR • ROTATE ON ROUND STAGE</span>
          </div>
        </div>

        {/* BOTTOM HUD FOOTER: Progress Bar & Direct Bay Navigation */}
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-zinc-800 pt-4 pointer-events-auto">
          {/* Left Frame Status */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-white font-medium tracking-widest">
              {!isFrame2Active ? 'FRAME 01 // ZOOM-IN FOCUS' : 'FRAME 02 // PORSCHE 911 TURBO'}
            </span>
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

          {/* Center Stage Indicators */}
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
            <span className={`px-2.5 py-1 rounded-full border transition-all ${!isFrame2Active ? 'border-white text-white bg-white/10' : 'border-zinc-800 text-zinc-600'}`}>
              01 // ZOOM-IN
            </span>
            <span className="text-zinc-600">→</span>
            <span className={`px-2.5 py-1 rounded-full border transition-all ${isFrame2Active ? 'border-white text-white bg-white/10' : 'border-zinc-800 text-zinc-600'}`}>
              02 // ZOOM-OUT
            </span>
          </div>

          {/* Right Scroll Indicator linking directly to BAY 01 */}
          <button
            onClick={scrollToPhilosophy}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase group"
          >
            <span>SCROLL TO BAY 01 // PHILOSOPHY</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform animate-bounce" />
          </button>
        </div>

      </div>
    </div>
  );
}
