import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowRight, 
  Gauge, 
  Cpu, 
  Database, 
  Layout, 
  Sparkles, 
  Move3d, 
  ShieldCheck, 
  Wrench, 
  Camera, 
  Layers, 
  Car 
} from 'lucide-react';

// ============================================================================
// 🏎️ 3D CAR SLOTS CONFIGURATION
// Swap or configure your car .glb models here.
// Files reside in frontend/public/
// ============================================================================
export const CAR_SLOTS = {
  frame1: {
    url: '/firstfream.glb', // First car (Frame 01 prototype)
    targetDim: 5.75,
    name: 'FRAME 01 // BMW M4 COUPE'
  },
  frame2: {
    url: '/secondfream.glb', // Second car (Frame 02 unveiled hero car)
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

  // Toggle between high-resolution Hero Photograph and 3D Interactive Turntable
  const [heroViewMode, setHeroViewMode] = useState('both'); // 'photo', '3d', 'both'

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
    camera.position.set(1.5, 0.85, 4.8);

    // Parent group for car & round stage placed in the right side area
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.x = 1.45;
    } else if (window.innerWidth >= 768) {
      carRootGroup.position.x = 0.6;
    } else {
      carRootGroup.position.x = 0;
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

    // Helper to safely set mesh opacity without leaving models in an invisible/NaN state
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
      // Don't drag if clicking buttons, links or UI cards
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

      const mode = activeModeRef.current;
      const model1 = coverModelRef.current;
      const model2 = carModelRef.current;

      // 3D Laser Scan Rig Animation (Active in transition window 0.32 <= currentScroll <= 0.58)
      if (currentScroll >= 0.32 && currentScroll <= 0.58) {
        scanRig.visible = true;
        const scanRatio = (currentScroll - 0.32) / 0.26; // 0.0 to 1.0
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
          // 0.00 -> 0.35: Frame 01 (Zoom-In focus)
          // 0.35 -> 0.55: 3D Laser transition effect
          // 0.55 -> 1.00: Frame 02 (BAY 01 // CRAFT & PHILOSOPHY)
          if (currentScroll < 0.35) {
            model1.visible = true;
            model2.visible = false;
            model1.position.y = 0;
            setMeshOpacity(model1, 1.0);
          } else if (currentScroll < 0.55) {
            const transitionRatio = (currentScroll - 0.35) / 0.20;
            model1.visible = true;
            model2.visible = true;
            model1.position.y = transitionRatio * 0.9;
            setMeshOpacity(model1, Math.max(0.1, 1 - transitionRatio));
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

    // Scroll listener: Responsive, smooth transition without endless black gaps
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
      // Stage 1 (0.00 -> 0.35): ZOOM IN TO FIRST FRAME (Camera 5.0 -> 2.8 close-up)
      // Morph Point (0.35 -> 0.55): Laser Scan sweeps across car as Frame 1 transforms into Frame 2
      // Stage 2 (0.55 -> 0.88): ZOOM OUT TO SECOND FRAME (Camera 2.8 -> 5.0 wide 3/4 heroic showroom stance)
      // Stage 3 (0.88 -> 1.00): Settled stance as user scrolls directly into BAY 02 // TELEMETRY
      if (progress < 0.35) {
        const r1 = progress / 0.35;
        const ease1 = r1 * r1 * (3 - 2 * r1);
        targetCamZ = 5.0 - ease1 * 2.2; // from 5.0 down to 2.8 (Smooth Zoom In)
        targetCamY = 0.82 - ease1 * 0.25;
        scrollRotY = ease1 * 0.35;
        scrollRotX = ease1 * 0.03;
      } else if (progress < 0.88) {
        const r2 = (progress - 0.35) / 0.53;
        const ease2 = r2 * r2 * (3 - 2 * r2);
        targetCamZ = 2.8 + ease2 * 2.2; // from 2.8 up to 5.0 (Smooth Zoom Out)
        targetCamY = 0.57 + ease2 * 0.28;
        scrollRotY = 0.35 + ease2 * (Math.PI * 0.85);
        scrollRotX = 0.03 - ease2 * 0.02;
      } else {
        targetCamZ = 5.0;
        targetCamY = 0.85;
        scrollRotY = 0.35 + Math.PI * 0.85;
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
        carRootGroup.position.x = 1.45;
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
      laserBeamGeom.dispose();
      laserBeamMat.dispose();
      laserCurtainGeom.dispose();
      laserCurtainMat.dispose();
      groundLineGeom.dispose();
      groundLineMat.dispose();
    };
  }, []);

  // Determine current active stage (0: Frame 01 Hero, 1: Frame 02 BAY 01 // CRAFT & PHILOSOPHY)
  const isFrame2Active = scrollProgress >= 0.45;
  const isTransitioning = scrollProgress >= 0.32 && scrollProgress <= 0.58;
  const formattedFrame = String(currentFrame).padStart(3, '0');

  // Smooth scroll directly to Frame 2 (BAY 01 // CRAFT & PHILOSOPHY)
  const scrollToPhilosophy = (e) => {
    if (e) e.preventDefault();
    if (containerRef.current) {
      const scrollable = containerRef.current.offsetHeight - window.innerHeight;
      const targetY = containerRef.current.offsetTop + scrollable * 0.70;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
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
    <div
      ref={containerRef}
      id="cinematic-sequence"
      className="relative w-full h-[160vh] bg-[#08090d]"
    >
      {/* Sticky 100dvh Viewport Container - ZERO empty black screen! */}
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

          {/* Right Controls: Model Mode Switcher + Quick Top Action */}
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

        {/* TRANSITION EFFECT: Screen-Space Laser Sweep Beam & HUD Telemetry Overlay */}
        {isTransitioning && (
          <>
            {/* Glowing Laser Scanline Sweeping Across Viewport */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_28px_#38bdf8] z-30 pointer-events-none transition-all duration-75"
              style={{ top: `${Math.min(95, Math.max(5, ((scrollProgress - 0.32) / 0.26) * 100))}%` }}
            />
            {/* Ambient High-Tech Laser Shimmer Wash */}
            <div className="absolute inset-0 bg-cyan-500/[0.04] z-20 pointer-events-none animate-pulse" />
            {/* Floating Quantum Laser Transition Notification */}
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
              <div className="px-5 py-2 rounded-full bg-cyan-950/95 border border-cyan-400/70 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.55)] flex items-center gap-3 text-cyan-200 text-[10px] font-mono tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-ping" />
                <span>TRANSITION EFFECT // 3D LASER SCAN: FRAME 01 ➔ FRAME 02</span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.3em] text-cyan-300/90 mt-1.5 uppercase drop-shadow-md">
                CALIBRATING BAY 01 // CRAFT & PHILOSOPHY
              </span>
            </div>
          </>
        )}

        {/* MAIN HUD CONTENT: Responsive Detailing Bay Layout */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 pt-20 pb-16 pointer-events-none select-none">
          
          {/* LEFT COLUMN: Dynamic Car Care Garage Telemetry HUD Dashboard */}
          <div id="philosophy" className="w-full lg:max-w-md xl:max-w-lg pointer-events-auto select-auto">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0e1017]/90 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/90 transition-all duration-300">
              
              {/* FRAME 01: HERO SECTION */}
              {!isFrame2Active ? (
                <div>
                  {/* HUD Status Header */}
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

                  {/* Aerion Hero Font & Studio Identity */}
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
                        STAGE 01 // FRAME 01 ZOOM-IN
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight uppercase tracking-[0.18em] text-white font-display leading-[0.9] drop-shadow-2xl mb-2">
                      NIHAL MV
                    </h1>

                    <p className="mt-2 text-[10px] sm:text-xs font-light tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400 uppercase mb-3">
                      THE ART OF CODE // MERN ARCHITECTURE
                    </p>

                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      A study in speed, responsive form, and fullstack engineering across modern digital interfaces.
                    </p>
                  </div>

                  {/* Mobile-Only BMW Hero Image Preview (Guarantees zero blank screen on phones!) */}
                  <div className="lg:hidden mb-5 rounded-2xl border border-zinc-700/60 bg-black/60 overflow-hidden relative shadow-xl">
                    <img
                      src="/hero-image.png"
                      alt="BMW M4 Coupe Hero"
                      className="w-full max-h-[220px] object-cover"
                    />
                    <div className="p-2.5 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-300">
                      <span>BMW M4 COUPE</span>
                      <span className="text-emerald-400">CERAMIC 9H ACTIVE</span>
                    </div>
                  </div>

                  {/* Live Telemetry Stats Grid in Polished Silver */}
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                        CAMERA
                      </span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-slate-100">
                        ZOOM-IN
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                        ACTIVE CAR
                      </span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-slate-100 truncate block">
                        BMW M4
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
                  <div className="pt-3.5 pb-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-4">
                    <div className="flex items-center gap-3">
                      <span>YAW: <strong className="text-slate-200">{telemetryCoords.rotY}°</strong></span>
                      <span>PITCH: <strong className="text-slate-200">{telemetryCoords.rotX}°</strong></span>
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
                    <span>TRANSITION TO BAY 01 // CRAFT & PHILOSOPHY</span>
                    <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              ) : (
                /* FRAME 02: BAY 01 // CRAFT & PHILOSOPHY */
                <div>
                  {/* Detailing Studio Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_#ffffff] animate-pulse" />
                      <span className="text-[10px] font-mono tracking-[0.25em] text-slate-200 font-bold uppercase">
                        BAY 01 // CRAFT & PHILOSOPHY
                      </span>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                      PRECISION.STUDIO.2026
                    </span>
                  </div>

                  {/* Title & Philosophy Manifesto */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono tracking-widest uppercase mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>STAGE 02 // FRAME 02 UNVEILED</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extralight uppercase tracking-[0.16em] text-white font-display leading-[0.95] drop-shadow-2xl mb-1.5">
                      SCULPTED<br />
                      <span className="text-zinc-500">BY LOGIC.</span>
                    </h2>

                    <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-light mb-3">
                      THE ART OF CODE // ARCHITECTURAL PURITY
                    </p>

                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      Every interface and server module is engineered around clarity, performance, and predictable state flow. No ornamental bloat — only pure purpose etched into maintainable code.
                    </p>
                  </div>

                  {/* 3 Performance Specification Pills */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-black/60 border border-zinc-800">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                        PERFORMANCE
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-100">
                        &lt; 50 KB
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/60 border border-zinc-800">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                        ARCHITECTURE
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-100">
                        ATOMIC
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/60 border border-zinc-800">
                      <span className="text-[7.5px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                        ACTIVE CAR
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-100">
                        PORSCHE 911
                      </span>
                    </div>
                  </div>

                  {/* 3 Surface Principles */}
                  <div className="space-y-1.5 mb-4 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2">
                      <span className="text-slate-400 font-bold shrink-0">01</span>
                      <span className="text-zinc-300 font-light">Modular React components with zero duplicate abstractions.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2">
                      <span className="text-slate-400 font-bold shrink-0">02</span>
                      <span className="text-zinc-300 font-light">Proportioned visual rhythm & negative spaces for readable UX.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2">
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
              )}

            </div>

            {/* Interactive 3D Orbit Hint */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
              <Move3d size={13} className="text-slate-300 animate-pulse" />
              <span>DRAG 3D CAR • ROTATE 360° ON ROUND STAGE</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Hero Car Presentation & Round Stage Showcase */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full max-w-lg xl:max-w-xl pointer-events-auto select-auto">
            
            {/* FRAME 01: High-Definition BMW Hero Photograph & Studio Stage */}
            {!isFrame2Active ? (
              <div className="w-full rounded-3xl bg-[#0e1017]/85 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/95 p-4 transition-all duration-300 relative group">
                
                {/* Top Card HUD Header & Mode Switcher */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/90 mb-3 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="tracking-[0.2em] text-slate-200 font-semibold uppercase">
                      ACTIVE SPEC // BMW M4 COUPE
                    </span>
                  </div>

                  {/* Toggle between Photo & 3D Interactive Stage */}
                  <div className="inline-flex items-center p-0.5 rounded-full bg-black/60 border border-zinc-700">
                    <button
                      onClick={() => setHeroViewMode('photo')}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                        heroViewMode === 'photo' ? 'bg-zinc-200 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      PHOTO
                    </button>
                    <button
                      onClick={() => setHeroViewMode('both')}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                        heroViewMode === 'both' ? 'bg-zinc-200 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      STUDIO
                    </button>
                    <button
                      onClick={() => setHeroViewMode('3d')}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                        heroViewMode === '3d' ? 'bg-zinc-200 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      3D ORBIT
                    </button>
                  </div>
                </div>

                {/* Hero Car Showcase Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/80 flex items-center justify-center min-h-[380px] max-h-[440px]">
                  
                  {/* The User's Uploaded BMW Sports Car Image */}
                  <img
                    src="/hero-image.png"
                    alt="BMW M4 Coupe Hero - Garage Detailing Bay"
                    className={`w-full h-full max-h-[440px] object-cover transition-opacity duration-500 ${
                      heroViewMode === '3d' ? 'opacity-20' : 'opacity-100'
                    }`}
                  />

                  {/* Ambient Round Turntable Stage Glow Effect */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-14 rounded-full bg-slate-100/10 blur-xl pointer-events-none" />

                  {/* Telemetry Overlays on Image */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 border border-zinc-700/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-zinc-300">
                    STAGE 01 // TURNTABLE PLATFORM
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 border border-zinc-700/80 backdrop-blur-md text-[9px] font-mono tracking-widest text-emerald-400">
                    CLEARCOAT: 9H CERAMIC
                  </div>

                  {/* Bottom Image Caption & Specifications */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/85 border border-zinc-800 backdrop-blur-md flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-300">
                      S58 3.0L TWIN-TURBO • 503 HP
                    </span>
                    <span className="text-slate-200 font-semibold">
                      GLOSS: 98.4 GU
                    </span>
                  </div>
                </div>

                {/* Mode description footer */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-slate-300" />
                    <span>PRECISION GERMAN AUTOMOTIVE FORM</span>
                  </span>
                  <span className="text-zinc-500 uppercase">
                    DETAIL FINISH // SILVER & CARBON
                  </span>
                </div>

              </div>
            ) : (
              /* FRAME 02: Porsche 911 Turbo 3D Stage Callout */
              <div className="w-full rounded-3xl bg-[#0e1017]/85 border border-zinc-700/60 backdrop-blur-xl shadow-2xl shadow-black/95 p-4 transition-all duration-300 relative">
                
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                    <span className="tracking-[0.2em] text-cyan-200 font-semibold uppercase">
                      FRAME 02 // PORSCHE 911 TURBO
                    </span>
                  </div>
                  <span className="text-zinc-400">
                    WIDE HEROIC STANCE
                  </span>
                </div>

                {/* 3D Round Stage Showcase Callout Box */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-[#111625]/60 to-black/80 p-6 flex flex-col justify-between min-h-[380px]">
                  
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                      UNVEILED STAGE ARCHITECTURE
                    </span>
                    <h3 className="text-2xl font-extralight uppercase tracking-[0.15em] text-white font-display mb-3">
                      STAGE 02 // 360° ROUND TURNTABLE
                    </h3>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
                      Frame 02 unrolls the Porsche 911 Turbo in a wide showroom stance, illuminated by overhead LED arrays and ground halo reflectors.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-black/70 border border-zinc-800">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                        STAGE ROTATION
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {telemetryCoords.rotY}° YAW
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/70 border border-zinc-800">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                        PITCH ANGLE
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {telemetryCoords.rotX}° PITCH
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-200 text-[10px] font-mono flex items-center justify-between">
                    <span>DRAG TO ORBIT 3D CAR</span>
                    <Move3d size={14} className="animate-pulse" />
                  </div>

                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500 uppercase">
                    3D GLB ACTIVE
                  </span>
                  <span className="text-cyan-400">
                    FLOWING TO BAY 02
                  </span>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* BOTTOM HUD FOOTER: Progress Bar & Direct Bay Navigation */}
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-zinc-800 pt-4 pointer-events-auto">
          {/* Left Frame Status */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-white font-medium tracking-widest">
              {!isFrame2Active ? 'FRAME 01 // BMW M4 ZOOM-IN' : 'FRAME 02 // PORSCHE 911 TURBO'}
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
            <span className={`px-2.5 py-1 rounded-full border transition-all ${!isFrame2Active ? 'border-white text-white bg-white/10' : 'border-zinc-800 text-zinc-600'}`}>
              01 // HERO STUDIO
            </span>
            <span className="text-cyan-400 font-bold">⚡ LASER SCAN</span>
            <span className={`px-2.5 py-1 rounded-full border transition-all ${isFrame2Active ? 'border-cyan-400 text-cyan-200 bg-cyan-950/60 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'border-zinc-800 text-zinc-600'}`}>
              02 // BAY 01 PHILOSOPHY
            </span>
          </div>

          {/* Right Scroll Indicator */}
          <button
            onClick={!isFrame2Active ? scrollToPhilosophy : scrollToTelemetry}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase group cursor-pointer"
          >
            <span>{!isFrame2Active ? 'SCROLL TO BAY 01' : 'SCROLL TO BAY 02'}</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform animate-bounce" />
          </button>
        </div>

      </div>
    </div>
  );
}
