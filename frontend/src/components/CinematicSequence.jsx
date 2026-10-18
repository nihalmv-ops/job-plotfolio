import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowRight, 
  Move3d, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Check
} from 'lucide-react';

// ============================================================================
// 🏎️ 3D CAR SLOTS CONFIGURATION
// Slot 1: First car (Frame 01 prototype - BMW M4 Coupe)
// Slot 2: Second car (Frame 02 unveiled hero car - Porsche 911 Turbo)
// Files reside in frontend/public/
// ============================================================================
export const CAR_SLOTS = {
  frame1: {
    url: '/firstfream.glb',
    targetDim: 5.75,
    name: 'FRAME 01 // BMW M4 COUPE'
  },
  frame2: {
    url: '/secondfream.glb',
    targetDim: 5.6,
    name: 'FRAME 02 // PORSCHE 911 TURBO'
  }
};

export default function CinematicSequence() {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
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
    scene.fog = new THREE.FogExp2(0x08090d, 0.035);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(1.5, 0.85, 5.0);

    // Parent group for car & round stage placed in the right side area on desktop
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.x = 1.45;
    } else if (window.innerWidth >= 768) {
      carRootGroup.position.x = 0.65;
    } else {
      carRootGroup.position.set(0, -0.2, 0);
    }
    carRootGroupRef.current = carRootGroup;
    scene.add(carRootGroup);

    // 2. Pure Automotive Detailing Studio Lighting (Clean White & Silver)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const overheadLight = new THREE.DirectionalLight(0xffffff, 4.5);
    overheadLight.position.set(0, 9, 2);
    scene.add(overheadLight);

    const leftLight = new THREE.DirectionalLight(0xf1f5f9, 3.2);
    leftLight.position.set(-6, 4, 4);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xf8fafc, 3.2);
    rightLight.position.set(6, 4, 4);
    scene.add(rightLight);

    const rearLight = new THREE.DirectionalLight(0xe2e8f0, 2.8);
    rearLight.position.set(0, 5, -6);
    scene.add(rearLight);

    const groundBounce = new THREE.DirectionalLight(0xdbeafe, 1.2);
    groundBounce.position.set(0, -3, 0);
    scene.add(groundBounce);

    // 3. Overhead Garage LED Strip Light Rig (Detailing Studio Ceiling)
    const ceilingRig = new THREE.Group();
    const stripGeom = new THREE.BoxGeometry(0.06, 0.03, 7.5);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-1.8, -0.9, 0, 0.9, 1.8].forEach((xOffset) => {
      const strip = new THREE.Mesh(stripGeom, stripMat);
      strip.position.set(xOffset, 4.2, 0);
      ceilingRig.add(strip);
    });
    scene.add(ceilingRig);

    // 4. Polished High-Gloss Dark Epoxy Garage Floor
    const floorGeom = new THREE.PlaneGeometry(35, 35);
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
    stageMesh.position.y = -1.07;
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
    
    const stageRing1Geom = new THREE.RingGeometry(2.5, 2.52, 64);
    const stageRing1 = new THREE.Mesh(stageRing1Geom, stageRingMat);
    stageRing1.rotation.x = -Math.PI / 2;
    stageRing1.position.y = -0.988;
    stageGroup.add(stageRing1);

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

    carRootGroup.add(stageGroup);

    // 6. High-Tech 3D Laser Scanning Beam (Transition Effect between Frame 1 & 2)
    const scanRig = new THREE.Group();
    scanRig.visible = false;

    // Glowing laser beam line across stage width
    const laserBeamGeom = new THREE.CylinderGeometry(0.018, 0.018, 7.2, 32);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0
    });
    const laserBeam = new THREE.Mesh(laserBeamGeom, laserBeamMat);
    laserBeam.rotation.z = Math.PI / 2;
    laserBeam.position.y = 0.05;
    scanRig.add(laserBeam);

    // Vertical translucent scanning light curtain
    const laserCurtainGeom = new THREE.PlaneGeometry(7.2, 3.2);
    const laserCurtainMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const laserCurtain = new THREE.Mesh(laserCurtainGeom, laserCurtainMat);
    laserCurtain.position.y = 0.65;
    scanRig.add(laserCurtain);

    // Stage surface contact laser line
    const groundLineGeom = new THREE.PlaneGeometry(7.2, 0.08);
    const groundLineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const groundLine = new THREE.Mesh(groundLineGeom, groundLineMat);
    groundLine.rotation.x = -Math.PI / 2;
    groundLine.position.y = -0.985;
    scanRig.add(groundLine);

    carRootGroup.add(scanRig);

    // 7. GLTF Loader Setup with Safe Material Normalization
    const loader = new GLTFLoader();

    // Helper: Normalize & center 3D model onto the round stage
    const normalizeModel = (gltfScene, targetDim = 5.6) => {
      const box = new THREE.Box3().setFromObject(gltfScene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = targetDim / maxDim;

      gltfScene.scale.setScalar(scale);
      gltfScene.position.x = -center.x * scale;
      gltfScene.position.z = -center.z * scale;
      gltfScene.position.y = -box.min.y * scale - 0.99;

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

    // Helper to safely set mesh opacity without leaving models in an invisible state
    const setMeshOpacity = (obj, opacity) => {
      if (!obj) return;
      obj.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = opacity;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = opacity;
          }
        }
      });
    };

    let frame1Loaded = false;
    let frame2Loaded = false;
    let frame1Bytes = 0;
    let frame2Bytes = 0;
    const totalEst = 59942484 + 21970656;

    const checkLoadingStatus = () => {
      const pct = Math.min(100, Math.round(((frame1Bytes + frame2Bytes) / totalEst) * 100));
      setLoadingPercent(pct);
      if (frame1Loaded || frame2Loaded) {
        setModelLoaded(true);
      }
    };

    // Load Slot 1 (Frame 01 Car - BMW M4 Prototype)
    loader.load(
      CAR_SLOTS.frame1.url,
      (gltf) => {
        const firstCar = normalizeModel(gltf.scene, CAR_SLOTS.frame1.targetDim);
        firstCar.rotation.y = -Math.PI / 2.2;
        setMeshOpacity(firstCar, 1.0);
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

    // Load Slot 2 (Frame 02 Car - Porsche 911 Turbo)
    loader.load(
      CAR_SLOTS.frame2.url,
      (gltf) => {
        const car = normalizeModel(gltf.scene, CAR_SLOTS.frame2.targetDim);
        car.rotation.y = -Math.PI / 2.2;
        setMeshOpacity(car, 1.0);
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

    // 8. Interactive Drag to Orbit & Mouse Parallax
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotY = 0;
    let dragRotX = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e) => {
      if (e.target.closest('button, a, input, select, textarea, .pointer-events-auto')) return;
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
      if (e.target.closest('button, a, input, select, textarea, .pointer-events-auto')) return;
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

    // Dynamic Animation Targets for Entire Site Scroll Effect
    let curHeroProgress = 0;
    let curGlobalProgress = 0;
    let scrollRotY = 0;
    let scrollRotX = 0;
    let targetCamX = window.innerWidth >= 1024 ? 1.45 : (window.innerWidth >= 768 ? 0.65 : 0);
    let targetCamY = 0.85;
    let targetCamZ = 5.0;

    let animId;
    let lastTelemetryUpdate = 0;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);

      const mode = activeModeRef.current;
      const model1 = coverModelRef.current;
      const model2 = carModelRef.current;

      // 3D Laser Scan Rig Animation (Active in transition window between Hero and Bay 01: 0.28 <= curHeroProgress <= 0.72)
      if (curHeroProgress >= 0.28 && curHeroProgress <= 0.72 && mode === 'auto') {
        scanRig.visible = true;
        const scanRatio = (curHeroProgress - 0.28) / 0.44; // 0.0 to 1.0
        scanRig.position.z = 2.8 - scanRatio * 5.6; // Sweeps from front bumper across car to rear
        const pulse = Math.sin(scanRatio * Math.PI); // Smooth bell curve
        laserBeamMat.opacity = pulse * 0.95;
        laserCurtainMat.opacity = pulse * 0.40;
        groundLineMat.opacity = pulse * 0.90;
        laserBeam.scale.y = 1 + Math.sin(time * 0.05) * 0.03;
      } else {
        scanRig.visible = false;
        laserBeamMat.opacity = 0;
        laserCurtainMat.opacity = 0;
        groundLineMat.opacity = 0;
      }

      // Safe Model Cross-Fade: GUARANTEES THE STAGE IS NEVER EMPTY OR BLACK!
      if (model1 && model2) {
        if (mode === 'covered') {
          model1.visible = true;
          model2.visible = false;
          model1.position.y = 0;
          setMeshOpacity(model1, 1.0);
        } else if (mode === 'unveiled') {
          model1.visible = false;
          model2.visible = true;
          setMeshOpacity(model2, 1.0);
        } else {
          // 'auto' mode:
          // 0.00 -> 0.28: Frame 01 (Hero Zoom-In)
          // 0.28 -> 0.72: 3D Laser transition effect
          // 0.72 -> 1.00+: Frame 02 (BAY 01 and throughout entire portfolio!)
          if (curHeroProgress < 0.28) {
            model1.visible = true;
            model2.visible = false;
            model1.position.y = 0;
            setMeshOpacity(model1, 1.0);
          } else if (curHeroProgress <= 0.72) {
            const transitionRatio = (curHeroProgress - 0.28) / 0.44;
            model1.visible = true;
            model2.visible = true;
            model1.position.y = transitionRatio * 0.9;
            setMeshOpacity(model1, Math.max(0.08, 1 - transitionRatio));
            setMeshOpacity(model2, Math.min(1, transitionRatio * 1.2));
          } else {
            model1.visible = false;
            model2.visible = true;
            model1.position.y = 0;
            setMeshOpacity(model2, 1.0);
          }
        }
      } else if (model1) {
        // Fallback: If only model 1 is loaded, keep it visible! NEVER turn pitch black!
        model1.visible = true;
        model1.position.y = 0;
        setMeshOpacity(model1, 1.0);
      } else if (model2) {
        // Fallback: If only model 2 is loaded, keep it visible!
        model2.visible = true;
        model2.position.y = 0;
        setMeshOpacity(model2, 1.0);
      }

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + mouseX * 0.12;
      const totalTargetRotX = scrollRotX + dragRotX + mouseY * 0.08;

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.07;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.07;

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.lookAt(carRootGroup.position.x, -0.10, 0);

      // Live telemetry coordinates update
      if (time - lastTelemetryUpdate > 80) {
        lastTelemetryUpdate = time;
        const degY = Math.round((carRootGroup.rotation.y * 180) / Math.PI) % 360;
        const degX = Math.round((carRootGroup.rotation.x * 180) / Math.PI) % 360;
        setTelemetryCoords({
          rotX: degX >= 0 ? degX : 360 + degX,
          rotY: degY >= 0 ? degY : 360 + degY,
          rotZ: Math.round(curGlobalProgress * 100)
        });
      }

      renderer.render(scene, camera);
    };
    animate(0);

    // ========================================================================
    // 🌐 ALL 3D SCROLL EFFECT CHOREOGRAPHY (Continuous across entire page)
    // ========================================================================
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = Math.max(1, document.documentElement.scrollHeight - winH);
      const globalP = Math.min(1, Math.max(0, scrollY / docH));
      curGlobalProgress = globalP;
      setScrollProgress(globalP);

      // Frame number 001 - 240
      const frame = Math.min(240, Math.max(1, Math.floor(globalP * 239) + 1));
      setCurrentFrame(frame);

      // Hero-to-Bay01 Transition Progress (0.00 at top of hero -> 1.00 entering Bay 01)
      const heroThreshold = Math.max(1, winH * 0.85);
      const heroP = Math.min(1, Math.max(0, scrollY / heroThreshold));
      curHeroProgress = heroP;
      setHeroProgress(heroP);

      const isDesktop = window.innerWidth >= 1024;
      const baseCamX = isDesktop ? 1.45 : (window.innerWidth >= 768 ? 0.65 : 0);

      // Seamless Multi-Bay 3D Camera & Turntable Choreography:
      if (heroP < 0.28) {
        // 1. HERO (Frame 01 Zoom-In)
        const r1 = heroP / 0.28;
        const ease1 = r1 * r1 * (3 - 2 * r1);
        targetCamX = baseCamX;
        targetCamZ = 5.0 - ease1 * 1.8; // Zoom in from 5.0 to 3.2
        targetCamY = 0.85 - ease1 * 0.20;
        scrollRotY = ease1 * 0.35;
        scrollRotX = ease1 * 0.02;
      } else if (heroP <= 0.72) {
        // 2. 3D LASER TRANSITION (Frame 01 -> Frame 02)
        const tr = (heroP - 0.28) / 0.44;
        targetCamX = baseCamX;
        targetCamZ = 3.2 + tr * 1.8; // Zoom out to 5.0 wide showroom view
        targetCamY = 0.65 + tr * 0.20;
        scrollRotY = 0.35 + tr * (Math.PI * 0.45);
        scrollRotX = 0.02 - tr * 0.01;
      } else if (globalP < 0.32) {
        // 3. BAY 01 // CRAFT & PHILOSOPHY (Unveiled Frame 02 Porsche 911 Turbo)
        const r = (globalP - 0.12) / 0.20;
        targetCamX = baseCamX;
        targetCamZ = 5.0;
        targetCamY = 0.85;
        scrollRotY = 0.35 + Math.PI * 0.45 + r * (Math.PI * 0.3);
        scrollRotX = 0.01;
      } else if (globalP < 0.50) {
        // 4. BAY 02 // TELEMETRY & BENCHMARKS (Side-Profile Aerodynamic View)
        const r = (globalP - 0.32) / 0.18;
        targetCamX = isDesktop ? 1.35 : baseCamX;
        targetCamZ = 4.4 + r * 0.2;
        targetCamY = 0.78 + r * 0.08;
        scrollRotY = 0.35 + Math.PI * 0.75 + r * (Math.PI * 0.45);
        scrollRotX = 0.01;
      } else if (globalP < 0.70) {
        // 5. BAY 03 // TECHNOLOGY ARCHITECTURE (Dynamic Rear-Quarter View)
        const r = (globalP - 0.50) / 0.20;
        targetCamX = isDesktop ? 0.95 : baseCamX;
        targetCamZ = 4.6 + r * 0.2;
        targetCamY = 0.86 + r * 0.06;
        scrollRotY = 0.35 + Math.PI * 1.20 + r * (Math.PI * 0.50);
        scrollRotX = 0.02;
      } else if (globalP < 0.85) {
        // 6. BAY 04 // FEATURED CREATIONS (Front 3/4 Showroom Angle)
        const r = (globalP - 0.70) / 0.15;
        targetCamX = isDesktop ? 1.30 : baseCamX;
        targetCamZ = 4.8;
        targetCamY = 0.82;
        scrollRotY = 0.35 + Math.PI * 1.70 + r * (Math.PI * 0.40);
        scrollRotX = 0.01;
      } else {
        // 7. BAY 05 & 06 // TIMELINE & TRANSMISSION (Elevated Studio Overview)
        const r = Math.min(1, (globalP - 0.85) / 0.15);
        targetCamX = isDesktop ? 0.70 : baseCamX;
        targetCamZ = 4.8 + r * 0.5;
        targetCamY = 0.82 + r * 0.65; // High studio perspective
        scrollRotY = 0.35 + Math.PI * 2.10 + r * 0.35;
        scrollRotX = r * 0.06;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth >= 1024) {
        carRootGroup.position.set(1.45, 0, 0);
      } else if (window.innerWidth >= 768) {
        carRootGroup.position.set(0.65, 0, 0);
      } else {
        carRootGroup.position.set(0, -0.2, 0);
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
      laserBeamGeom.dispose();
      laserBeamMat.dispose();
      laserCurtainGeom.dispose();
      laserCurtainMat.dispose();
      groundLineGeom.dispose();
      groundLineMat.dispose();
    };
  }, []);

  const isTransitioning = heroProgress >= 0.28 && heroProgress <= 0.72;
  const isBay01Active = heroProgress > 0.60;
  const formattedFrame = String(currentFrame).padStart(3, '0');

  // Smooth scroll directly to BAY 01 // CRAFT & PHILOSOPHY
  const scrollToPhilosophy = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('philosophy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll directly to BAY 02 // TELEMETRY
  const scrollToTelemetry = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('telemetry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="cinematic-container" className="relative w-full">
      
      {/* ==================================================================== */}
      {/* 1. PERSISTENT FULLSCREEN 3D WEBGL STUDIO CANVAS (NEVER UNPINS!)     */}
      {/* Zero empty black screen! 3D car remains active throughout entire site*/}
      {/* ==================================================================== */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="3D Supercar Detailing Garage Canvas"
        className="fixed inset-0 w-full h-full block object-cover z-0 pointer-events-none"
      />

      {/* Ambient Dark Studio Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,9,13,0.72)_100%)] z-[1]" />

      {/* ==================================================================== */}
      {/* 2. FIXED AERION-STYLE TOP HEADER HUD                                 */}
      {/* ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#08090d]/85 via-[#08090d]/40 to-transparent backdrop-blur-xs">
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
          <button 
            onClick={scrollToPhilosophy} 
            className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            PHILOSOPHY
          </button>
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

        {/* Right Controls: Model Mode Switcher + Scroll to Top */}
        <div className="flex items-center gap-3">
          {/* 3D Mode Switcher */}
          <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-[#111318]/95 border border-zinc-700/60 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase shadow-xl shadow-black/50">
            <button
              onClick={() => setActiveModelMode('auto')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeModelMode === 'auto' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Scroll Zoom 1 -> Zoom 2 Mode"
            >
              AUTO (ZOOM 1→2)
            </button>
            <button
              onClick={() => setActiveModelMode('unveiled')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeModelMode === 'unveiled' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Force View Frame 02"
            >
              FRAME 02
            </button>
            <button
              onClick={() => setActiveModelMode('covered')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-400 bg-zinc-900/60 text-zinc-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <span>TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 3. TRANSITION EFFECT OVERLAY: 3D Laser Scan Sweeping Across Screen   */}
      {/* ==================================================================== */}
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {/* Glowing Laser Scanline Sweeping Across Viewport */}
          <div
            className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_28px_#38bdf8] transition-all duration-75"
            style={{ top: `${Math.min(95, Math.max(5, ((heroProgress - 0.28) / 0.44) * 100))}%` }}
          />
          {/* Ambient High-Tech Laser Shimmer Wash */}
          <div className="absolute inset-0 bg-cyan-500/[0.04] animate-pulse" />
          {/* Floating Quantum Laser Transition Notification */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="px-5 py-2 rounded-full bg-cyan-950/95 border border-cyan-400/70 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.55)] flex items-center gap-3 text-cyan-200 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-ping" />
              <span>TRANSITION EFFECT // 3D LASER SCAN: FRAME 01 ➔ FRAME 02</span>
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-cyan-300/90 mt-1.5 uppercase drop-shadow-md">
              CALIBRATING BAY 01 // CRAFT & PHILOSOPHY
            </span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SECTION 01: HERO SECTION (Pure 3D Car on Stage, NO PNG IMAGE!)   */}
      {/* ==================================================================== */}
      <section 
        id="hero" 
        className="relative z-10 min-h-screen w-full flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto pt-24 pb-16"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Aerion-Style Non-Bold Typography & Live Telemetry HUD */}
          <div className="w-full lg:max-w-xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1017]/85 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/90">
              
              {/* Studio Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 shadow-[0_0_8px_#ffffff] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-slate-200 font-bold uppercase">
                    GARAGE DETAILING BAY
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                  HERO // STAGE 01
                </span>
              </div>

              {/* Aerion Hero Font & Studio Identity (Clean, Extra-Light, Letterspaced) */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
                    STAGE 01 // FRAME 01 ZOOM-IN
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.18em] text-white font-display leading-[0.92] drop-shadow-2xl mb-2">
                  NIHAL MV
                </h1>

                <p className="mt-2 text-[10px] sm:text-xs font-light tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400 uppercase mb-3">
                  THE ART OF CODE // MERN ARCHITECTURE
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  A study in speed, responsive form, and fullstack engineering across modern digital interfaces.
                </p>
              </div>

              {/* Live Telemetry Stats Grid in Polished Silver */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    CAMERA
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100">
                    ZOOM-IN
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    ACTIVE CAR
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100 truncate block">
                    BMW M4
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    TURNTABLE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100">
                    360° STAGE
                  </span>
                </div>
              </div>

              {/* Real-time 3D Coordinates Readout */}
              <div className="pt-3.5 pb-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-4">
                <div className="flex items-center gap-3">
                  <span>YAW: <strong className="text-slate-200 font-light">{telemetryCoords.rotY}°</strong></span>
                  <span>PITCH: <strong className="text-slate-200 font-light">{telemetryCoords.rotX}°</strong></span>
                </div>
                <span className="text-zinc-500">
                  ZOOM: {telemetryCoords.rotZ}%
                </span>
              </div>

              {/* Transition Trigger CTA Button */}
              <button
                onClick={scrollToPhilosophy}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zinc-200 via-slate-100 to-zinc-300 hover:from-white hover:to-zinc-200 text-black font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/60 group cursor-pointer"
              >
                <span>SCROLL TO BAY 01 // CRAFT & PHILOSOPHY</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Interactive 3D Orbit Hint */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
              <Move3d size={13} className="text-slate-300 animate-pulse" />
              <span>DRAG 3D CAR • ROTATE 360° ON ROUND STAGE</span>
            </div>
          </div>

          {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO PNG IMAGES! */}
          {/* Transparent floating HUD callout brackets that frame the real-time 3D model */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-black/50 border border-zinc-700/60 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>STAGE 01 // 360° TURNTABLE PLATFORM</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
                BMW M4 COUPE • CERAMIC CLEARCOAT
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
                <Move3d size={13} className="text-slate-300 animate-pulse" />
                <span>INTERACTIVE 3D WEBGL • DRAG TO ORBIT</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. SECTION 02: BAY 01 // CRAFT & PHILOSOPHY (Zero Empty Black Screen!)*/}
      {/* Frame 02 Porsche 911 Turbo on Round Stage in Heroic Showroom Stance */}
      {/* ==================================================================== */}
      <section 
        id="philosophy" 
        className="relative z-10 min-h-screen w-full flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 border-t border-zinc-800/60 scroll-mt-12"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Full Philosophy Manifesto & Architecture Specifications */}
          <div className="w-full lg:max-w-xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1017]/85 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/90">
              
              {/* Studio Detailing Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-200 font-bold uppercase">
                    BAY 01 // CRAFT & PHILOSOPHY
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                  PRECISION.STUDIO.2026
                </span>
              </div>

              {/* Title & Philosophy Manifesto */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono tracking-widest uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>STAGE 02 // FRAME 02 UNVEILED</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-extralight uppercase tracking-[0.16em] text-white font-display leading-[0.95] drop-shadow-2xl mb-2">
                  SCULPTED<br />
                  <span className="text-zinc-500">BY LOGIC.</span>
                </h2>

                <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 font-light mb-3">
                  THE ART OF CODE // ARCHITECTURAL PURITY
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  Every interface and server module is engineered around clarity, performance, and predictable state flow. No ornamental bloat — only pure purpose etched into maintainable code.
                </p>
              </div>

              {/* 3 Performance Specification Pills */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    PERFORMANCE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100">
                    &lt; 50 KB
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    ARCHITECTURE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100">
                    ATOMIC
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                    ACTIVE CAR
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-slate-100">
                    PORSCHE 911
                  </span>
                </div>
              </div>

              {/* 3 Surface Principles */}
              <div className="space-y-2 mb-5 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <span className="text-slate-400 font-bold shrink-0">01</span>
                  <span className="text-zinc-300 font-light">Modular React components with zero duplicate abstractions.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <span className="text-slate-400 font-bold shrink-0">02</span>
                  <span className="text-zinc-300 font-light">Proportioned visual rhythm & negative spaces for readable UX.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <span className="text-slate-400 font-bold shrink-0">03</span>
                  <span className="text-zinc-300 font-light">Zero technical debt: resilient async controllers & strict REST.</span>
                </div>
              </div>

              {/* Direct Flow to BAY 02 // TELEMETRY CTA */}
              <button
                onClick={scrollToTelemetry}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-zinc-200 via-slate-100 to-zinc-300 hover:from-white hover:to-zinc-200 text-black font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/60 group cursor-pointer"
              >
                <span>PROCEED TO BAY 02 // TELEMETRY</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Interactive 3D Orbit Hint */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
              <Move3d size={13} className="text-cyan-300 animate-pulse" />
              <span>FRAME 02 ACTIVE • DRAG TO ROTATE PORSCHE 360°</span>
            </div>
          </div>

          {/* Right Column: 100% PURE 3D PORSCHE 911 ON STAGE - ZERO PNG IMAGES! */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-cyan-200 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
              <span>STAGE 02 // PORSCHE 911 TURBO UNVEILED</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
                WIDE HEROIC SHOWROOM STANCE
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm flex items-center justify-end gap-2 text-[10px] font-mono text-cyan-300">
                <Move3d size={13} className="text-cyan-300 animate-pulse" />
                <span>FLOWING CONTINUOUSLY TO BAY 02</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. BOTTOM HUD FOOTER: Live Frame Status & Flow Indicators            */}
      {/* ==================================================================== */}
      <div className="fixed bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-zinc-800/80 pt-4 pointer-events-auto bg-[#08090d]/60 backdrop-blur-xs">
        {/* Left Frame Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="text-white font-light tracking-widest">
            {!isBay01Active ? 'FRAME 01 // BMW M4 ZOOM-IN' : 'FRAME 02 // PORSCHE 911 TURBO'}
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
        <div className="hidden md:flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-widest">
          <span className={`px-2.5 py-1 rounded-full border transition-all ${!isBay01Active ? 'border-white text-white bg-white/10' : 'border-zinc-800 text-zinc-600'}`}>
            01 // HERO STUDIO
          </span>
          <span className="text-cyan-400 font-bold">⚡ LASER SCAN</span>
          <span className={`px-2.5 py-1 rounded-full border transition-all ${isBay01Active ? 'border-cyan-400 text-cyan-200 bg-cyan-950/60 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-zinc-800 text-zinc-600'}`}>
            02 // BAY 01 PHILOSOPHY
          </span>
        </div>

        {/* Right Scroll Indicator */}
        <button
          onClick={!isBay01Active ? scrollToPhilosophy : scrollToTelemetry}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase group cursor-pointer"
        >
          <span>{!isBay01Active ? 'SCROLL TO BAY 01' : 'SCROLL TO BAY 02'}</span>
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform animate-bounce" />
        </button>
      </div>

    </div>
  );
}
