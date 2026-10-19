import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  ArrowDown, 
  ArrowUp, 
  Move3d
} from 'lucide-react';

// ============================================================================
// 🏎️ 6-BAY 3D CAR FLEET CONFIGURATION
// All 6 GLB models mapped across the entire portfolio journey:
// 1. Hero: firstfream.glb (BMW M4 Prototype)
// 2. Bay 01: secondfream.glb (Porsche 911 Turbo)
// 3. Bay 02: thirdfream.glb (Telemetry Spec)
// 4. Bay 03: forthfream.glb (Technology Hypercar)
// 5. Bay 04: fifthfream.glb (Creations Track Machine)
// 6. Bay 05 & 06: sixthfream.glb (Apex Masterpiece)
// ============================================================================
export const CAR_SLOTS = [
  { id: 1, name: 'FRAME 01 // BMW M4 COUPE', url: '/firstfream.glb', targetDim: 5.75, bay: 'HERO STUDIO' },
  { id: 2, name: 'FRAME 02 // PORSCHE 911 TURBO', url: '/secondfream.glb', targetDim: 5.6, bay: 'BAY 01 // PHILOSOPHY' },
  { id: 3, name: 'FRAME 03 // TELEMETRY GT', url: '/thirdfream.glb', targetDim: 5.6, bay: 'BAY 02 // TELEMETRY' },
  { id: 4, name: 'FRAME 04 // TECH HYPERCAR', url: '/forthfream.glb', targetDim: 5.6, bay: 'BAY 03 // TECHNOLOGY' },
  { id: 5, name: 'FRAME 05 // CREATIONS MONSTER', url: '/fifthfream.glb', targetDim: 5.6, bay: 'BAY 04 // CREATIONS' },
  { id: 6, name: 'FRAME 06 // APEX PROTOCOL', url: '/sixthfream.glb', targetDim: 5.6, bay: 'BAY 05 & 06 // TRANSMISSION' }
];

export default function CinematicSequence({ onHeroProgress, onHeroReady }) {
  const canvasRef = useRef(null);
  const [activeCarSlotIndex, setActiveCarSlotIndex] = useState(0);
  const [activeModelMode, setActiveModelMode] = useState('auto'); // 'auto', or 0..5 for manual lock
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('CALIBRATING 3D STUDIO');
  const [heroLoadProgress, setHeroLoadProgress] = useState(0);
  const [isHeroModelReady, setIsHeroModelReady] = useState(false);

  // Direct DOM references for ultra-smooth 120 FPS HUD updates without React re-renders
  const hudFrameRef = useRef(null);
  const hudYawRef = useRef(null);
  const hudPitchRef = useRef(null);
  const hudZoomRef = useRef(null);
  const transitionOverlayRef = useRef(null);
  const laserLineRef = useRef(null);
  const transitionBadgeRef = useRef(null);
  const transitionSubRef = useRef(null);

  // References for cross-scope model and interaction control
  const loadedModelsRef = useRef([null, null, null, null, null, null]);
  const carRootGroupRef = useRef(null);
  const activeModeRef = useRef('auto');
  activeModeRef.current = activeModelMode;
  const curActiveIdxRef = useRef(0);
  const requestCarModelRef = useRef(null);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);

    // Generate photorealistic procedural studio environment cubemap for reflections across all car bodies
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnvTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const scene = new THREE.Scene();
    scene.environment = studioEnvTexture;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Camera is framed to highlight the right-side turntable stage on desktop
    camera.position.set(0.15, 0.85, 5.0);

    // Parent group for car & round stage placed in the right side area on desktop
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.set(1.5, 0, 0);
    } else if (window.innerWidth >= 768) {
      carRootGroup.position.set(0.7, 0, 0);
    } else {
      carRootGroup.position.set(0, -0.2, 0);
    }
    carRootGroupRef.current = carRootGroup;
    scene.add(carRootGroup);

    // 2. Pure Automotive Studio Lighting calibrated to faithfully render authentic .glb colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const overheadKeyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    overheadKeyLight.position.set(2, 8, 4);
    scene.add(overheadKeyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 3. Overhead Garage Fixture Rig in Pure Stealth Black
    const ceilingRig = new THREE.Group();
    const stripGeom = new THREE.BoxGeometry(0.06, 0.03, 7.5);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    [-1.8, -0.9, 0, 0.9, 1.8].forEach((xOffset) => {
      const strip = new THREE.Mesh(stripGeom, stripMat);
      strip.position.set(xOffset, 4.2, 0);
      ceilingRig.add(strip);
    });
    scene.add(ceilingRig);

    // 4. Pure Pitch Black Automotive Floor (Full On Black Theme - Eliminates Gray Glare)
    const floorGeom = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.15;
    scene.add(floor);

    // 5. Photorealistic Automotive Turntable Round Stage in Pure Black Stealth Theme
    const stageGroup = new THREE.Group();

    // Stage Top / Main Cylindrical Disc Platform (Pure Solid Obsidian Black)
    const stageGeom = new THREE.CylinderGeometry(3.5, 3.65, 0.16, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.1,
      roughness: 0.88,
      envMapIntensity: 0.12
    });
    const stageMesh = new THREE.Mesh(stageGeom, stageMat);
    stageMesh.position.y = -1.07;
    stageMesh.receiveShadow = true;
    stageMesh.castShadow = true;
    stageGroup.add(stageMesh);

    // Beveled Outer Bezel Edge Ring (Stealth Solid Black Finish)
    const bezelGeom = new THREE.TorusGeometry(3.51, 0.035, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.35,
      roughness: 0.65,
      envMapIntensity: 0.15
    });
    const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.y = -0.99;
    stageGroup.add(bezelMesh);

    // Stage Surface Concentric Detailing Rings (Subtle Monochromatic Dark Lines)
    const stageRingMat = new THREE.MeshBasicMaterial({ color: 0x121214, transparent: true, opacity: 0.4 });
    
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

    // Stage LED Halo Ring (Full on Black Theme - Zero Unwanted Color Tint)
    const haloGeom = new THREE.RingGeometry(3.55, 3.7, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = -1.145;
    stageGroup.add(haloMesh);

    carRootGroup.add(stageGroup);

    // 6. High-Tech 3D Laser Scanning Beam (Transition Effect between Cars in Pure Monochrome)
    const scanRig = new THREE.Group();
    scanRig.visible = false;

    // Glowing laser beam line across stage width
    const laserBeamGeom = new THREE.CylinderGeometry(0.018, 0.018, 7.2, 32);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
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
      color: 0xffffff,
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
          child.frustumCulled = false;

          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            if (mat && (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)) {
              mat.envMapIntensity = 0.55;
              // Preserve original colors, textures, and diffuse maps 100% intact
              mat.needsUpdate = true;
            }
          });
        }
      });

      const wrapper = new THREE.Group();
      wrapper.add(gltfScene);
      return wrapper;
    };

    // Helper to safely set mesh opacity without leaving models in an invisible or sorting-glitched state
    const setMeshOpacity = (obj, opacity) => {
      if (!obj) return;
      obj.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (mat.userData.origTransparent === undefined) {
              mat.userData.origTransparent = !!mat.transparent;
              mat.userData.origOpacity = typeof mat.opacity === 'number' ? mat.opacity : 1.0;
            }
            if (opacity < 0.98) {
              mat.transparent = true;
              mat.opacity = opacity * (mat.userData.origOpacity || 1.0);
            } else {
              mat.transparent = mat.userData.origTransparent;
              mat.opacity = mat.userData.origOpacity;
            }
          });
        }
      });
    };

    // Sequential Priority Loader for 3D Fleet:
    // Frame 01 (Hero BMW M4) loads FIRST with full dedicated bandwidth and real-time progress callbacks.
    // Once Frame 01 is mounted, subsequent frames load sequentially in the background.
    // If the user scrolls or selects a frame that isn't loaded yet, it jumps to the front of the queue!
    const loadingStarted = new Set();
    let isCurrentlyLoading = false;

    const loadCarModel = (index) => {
      if (index < 0 || index >= CAR_SLOTS.length) return;
      if (loadedModelsRef.current[index] || loadingStarted.has(index)) return;

      loadingStarted.add(index);
      isCurrentlyLoading = true;
      const slot = CAR_SLOTS[index];

      loader.load(
        slot.url,
        (gltf) => {
          const modelWrapper = normalizeModel(gltf.scene, slot.targetDim);
          modelWrapper.rotation.y = -Math.PI / 2.2;
          modelWrapper.visible = (index === 0);
          setMeshOpacity(modelWrapper, 1.0);

          loadedModelsRef.current[index] = modelWrapper;
          carRootGroup.add(modelWrapper);
          isCurrentlyLoading = false;

          setLoadedCount((prev) => {
            const updated = prev + 1;
            setLoadingStatusText(updated === 6 ? 'ALL 6 CARS READY' : `FLEET READY: ${updated} / 6`);
            return updated;
          });

          if (index === 0) {
            setIsHeroModelReady(true);
            if (onHeroReady) onHeroReady();
          }

          // Continue queueing next frames sequentially
          loadNextInQueue();
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            const percent = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
            if (index === 0) {
              setHeroLoadProgress(percent);
              if (onHeroProgress) onHeroProgress(percent, xhr.loaded, xhr.total);
              setLoadingStatusText(`CALIBRATING HERO: ${percent}%`);
            } else {
              setLoadingStatusText(`DOWNLOADING FRAME 0${index + 1}: ${percent}%`);
            }
          }
        },
        (err) => {
          console.warn(`Could not load ${slot.url}:`, err);
          loadingStarted.delete(index);
          isCurrentlyLoading = false;
          loadNextInQueue();
        }
      );
    };

    const loadNextInQueue = () => {
      if (isCurrentlyLoading) return;
      const active = curActiveIdxRef.current || 0;
      const next = (active + 1) % CAR_SLOTS.length;

      // Priority order: Hero Frame 01 -> currently active frame -> next frame -> remaining in order
      const priorityOrder = [0, active, next, 1, 2, 3, 4, 5];
      for (const idx of priorityOrder) {
        if (!loadedModelsRef.current[idx] && !loadingStarted.has(idx)) {
          loadCarModel(idx);
          return;
        }
      }
    };

    requestCarModelRef.current = (idx) => {
      if (!loadedModelsRef.current[idx] && !loadingStarted.has(idx)) {
        loadCarModel(idx);
      }
    };

    // Kick off Frame 01 (Hero BMW M4) immediately with 100% bandwidth!
    loadCarModel(0);

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

    // Animation & Choreography Targets
    let curActiveIdx = 0;
    let curNextIdx = 1;
    let curTransRatio = 0;
    let curInTrans = false;

    let curGlobalProgress = 0;
    let scrollRotY = 0;
    let scrollRotX = 0;
    const isDesk = window.innerWidth >= 1024;
    let targetCamX = isDesk ? 0.15 : 0;
    let targetLookX = isDesk ? 0.75 : 0;
    let targetCamY = 0.85;
    let targetCamZ = 5.0;

    let animId;
    let lastTelemetryUpdate = 0;

    // Cached section offsets to eliminate forced layout reflows (ZERO getBoundingClientRect calls during scroll)
    const sectionIds = ['hero', 'philosophy', 'telemetry', 'technology', 'creations', 'education'];
    let sectionTops = [0, 0, 0, 0, 0, 0];

    const measureSectionTops = () => {
      sectionTops = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        let top = 0;
        let curr = el;
        while (curr) {
          top += curr.offsetTop || 0;
          curr = curr.offsetParent;
        }
        return top;
      });
    };
    measureSectionTops();
    setTimeout(measureSectionTops, 300);
    setTimeout(measureSectionTops, 1200);

    let lastActiveCarSlot = -1;
    let lastFrameNum = -1;
    let needsResetAfterTrans = true;
    let lastSettledActiveIdx = -1;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);

      // 1. Fluid, non-blocking scroll measurement
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const winH = window.innerHeight || 1;
      const docH = Math.max(1, document.documentElement.scrollHeight - winH);
      const globalP = Math.min(1, Math.max(0, scrollY / docH));
      curGlobalProgress = globalP;

      // Direct DOM update for frame counter (zero React re-render)
      const frame = Math.min(240, Math.max(1, Math.floor(globalP * 239) + 1));
      if (lastFrameNum !== frame) {
        lastFrameNum = frame;
        if (hudFrameRef.current) {
          hudFrameRef.current.textContent = `FRAME ${String(frame).padStart(3, '0')} / 240`;
        }
      }

      // 2. Section boundary calculations using pre-cached offsets (ZERO getBoundingClientRect calls!)
      let activeIdx = 0;
      let nextIdx = 0;
      let transRatio = 0;
      let transitioning = false;

      for (let i = 0; i < sectionIds.length; i++) {
        const top = sectionTops[i] - scrollY;
        if (top <= winH * 0.55) {
          activeIdx = i;
        }
        if (i < sectionIds.length - 1) {
          const nextTop = sectionTops[i + 1] - scrollY;
          const zoneStart = winH * 0.85;
          const zoneEnd = winH * 0.15;
          if (nextTop <= zoneStart && nextTop >= zoneEnd) {
            transitioning = true;
            activeIdx = i;
            nextIdx = i + 1;
            transRatio = 1 - (nextTop - zoneEnd) / (zoneStart - zoneEnd);
            break;
          }
        }
      }

      const mode = activeModeRef.current;
      if (typeof mode === 'number' && mode >= 0 && mode < CAR_SLOTS.length) {
        activeIdx = mode;
        transitioning = false;
      }

      curActiveIdx = activeIdx;
      curNextIdx = nextIdx;
      curTransRatio = transRatio;
      curInTrans = transitioning;

      // Update current section index ref and prioritize downloading active / next car if not already loaded
      curActiveIdxRef.current = activeIdx;
      if (!loadedModelsRef.current[activeIdx] && !loadingStarted.has(activeIdx)) {
        loadCarModel(activeIdx);
      }
      if (transitioning && !loadedModelsRef.current[nextIdx] && !loadingStarted.has(nextIdx)) {
        loadCarModel(nextIdx);
      }

      // 3. Direct DOM update for laser scanning transition HUD overlay (hardware accelerated)
      if (transitionOverlayRef.current) {
        if (transitioning) {
          transitionOverlayRef.current.style.opacity = '1';
          if (laserLineRef.current) {
            laserLineRef.current.style.transform = `translate3d(0, ${Math.min(95, Math.max(5, transRatio * 100))}vh, 0)`;
          }
          if (transitionBadgeRef.current) {
            transitionBadgeRef.current.textContent = `TRANSITION EFFECT // 3D LASER SCAN: FRAME 0${activeIdx + 1} ➔ FRAME 0${nextIdx + 1}`;
          }
          if (transitionSubRef.current) {
            transitionSubRef.current.textContent = `CALIBRATING ${CAR_SLOTS[nextIdx]?.bay || 'DETAILING BAY'}`;
          }
        } else {
          transitionOverlayRef.current.style.opacity = '0';
        }
      }

      // 4. Camera target positions & smooth zoom transitions
      const isDesktop = window.innerWidth >= 1024;
      targetCamX = isDesktop ? 0.15 : 0;
      targetLookX = isDesktop ? 0.75 : 0;

      if (transitioning) {
        const zoomDip = Math.sin(transRatio * Math.PI) * 1.6;
        targetCamZ = 5.0 - zoomDip;
        targetCamY = 0.85 - Math.sin(transRatio * Math.PI) * 0.18;
        scrollRotY = activeIdx * 0.70 + transRatio * 0.70;
        scrollRotX = 0.01;
      } else {
        targetCamZ = 5.0;
        targetCamY = activeIdx === 5 ? 1.25 : 0.85;
        scrollRotY = activeIdx * 0.70;
        scrollRotX = 0.01;
      }

      const models = loadedModelsRef.current;

      // Check if target model is loaded; if not loaded, fallback to closest loaded model
      let effectiveActive = curActiveIdx;
      while (effectiveActive > 0 && !models[effectiveActive]) {
        effectiveActive--;
      }
      let effectiveNext = curNextIdx;
      while (effectiveNext > 0 && !models[effectiveNext]) {
        effectiveNext--;
      }

      // 3D Laser Scan Rig Animation
      if (curInTrans && effectiveActive !== effectiveNext) {
        scanRig.visible = true;
        scanRig.position.z = 2.8 - curTransRatio * 5.6;
        const pulse = Math.sin(curTransRatio * Math.PI);
        laserBeamMat.opacity = pulse * 0.95;
        laserCurtainMat.opacity = pulse * 0.45;
        groundLineMat.opacity = pulse * 0.90;
        laserBeam.scale.y = 1 + Math.sin(time * 0.05) * 0.03;
      } else {
        scanRig.visible = false;
        laserBeamMat.opacity = 0;
        laserCurtainMat.opacity = 0;
        groundLineMat.opacity = 0;
      }

      // Ultra-Smooth 60/120 FPS Laser Scan Car Transition (ZERO shader recompile, ZERO lag):
      // The 3D laser scan beam sweeps across the turntable (Z = 2.8 -> -2.8).
      // We cleanly switch active/next model visibility at the laser sweep midpoint.
      if (curInTrans && effectiveActive !== effectiveNext) {
        const showNext = curTransRatio >= 0.5;
        models.forEach((m, idx) => {
          if (!m) return;
          const shouldBeVisible = showNext ? (idx === effectiveNext) : (idx === effectiveActive);
          if (m.visible !== shouldBeVisible) {
            m.visible = shouldBeVisible;
          }
          m.position.y = 0;
        });
        needsResetAfterTrans = true;
      } else {
        if (needsResetAfterTrans || effectiveActive !== lastSettledActiveIdx) {
          models.forEach((m, idx) => {
            if (!m) return;
            const shouldBeVisible = (idx === effectiveActive);
            if (m.visible !== shouldBeVisible) {
              m.visible = shouldBeVisible;
            }
            m.position.y = 0;
          });
          needsResetAfterTrans = false;
          lastSettledActiveIdx = effectiveActive;
        }
      }

      // Only notify React when active car slot index actually changes! (Max 5 times across whole page)
      if (effectiveActive !== lastActiveCarSlot) {
        lastActiveCarSlot = effectiveActive;
        setActiveCarSlotIndex(effectiveActive);
      }

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + mouseX * 0.12;
      const totalTargetRotX = scrollRotX + dragRotX + mouseY * 0.08;

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.1;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.1;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(targetLookX, -0.10, 0);

      // Direct DOM update for live telemetry HUD (zero React re-render)
      if (time - lastTelemetryUpdate > 80) {
        lastTelemetryUpdate = time;
        const degY = Math.round((carRootGroup.rotation.y * 180) / Math.PI) % 360;
        const degX = Math.round((carRootGroup.rotation.x * 180) / Math.PI) % 360;
        const degYFinal = degY >= 0 ? degY : 360 + degY;
        const degXFinal = degX >= 0 ? degX : 360 + degX;
        const zoomVal = Math.round(curGlobalProgress * 100);

        if (hudYawRef.current) hudYawRef.current.textContent = `${degYFinal}°`;
        if (hudPitchRef.current) hudPitchRef.current.textContent = `${degXFinal}°`;
        if (hudZoomRef.current) hudZoomRef.current.textContent = `ZOOM: ${zoomVal}%`;
      }

      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth >= 1024) {
        carRootGroup.position.set(1.5, 0, 0);
      } else if (window.innerWidth >= 768) {
        carRootGroup.position.set(0.7, 0, 0);
      } else {
        carRootGroup.position.set(0, -0.2, 0);
      }
      measureSectionTops();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
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
      pmremGenerator.dispose();
      studioEnvTexture.dispose();
    };
  }, []);

  const activeCar = CAR_SLOTS[activeCarSlotIndex] || CAR_SLOTS[0];

  // Smooth scroll directly to BAY 01 // CRAFT & PHILOSOPHY
  const scrollToPhilosophy = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('philosophy');
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: 0, duration: 1.1 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Smooth scroll directly to BAY 02 // TELEMETRY
  const scrollToTelemetry = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('telemetry');
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: 0, duration: 1.1 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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

      {/* Subtle Studio Vignette (Pure black vignette fading into edges) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,transparent_55%,rgba(0,0,0,0.95)_100%)] z-[1]" />

      {/* ==================================================================== */}
      {/* 2. FIXED AERION-STYLE TOP HEADER HUD                                 */}
      {/* ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto bg-black/40 backdrop-blur-xl border-b border-white/[0.08]">
        {/* Logo & Status */}
        <a href="#" className="flex items-center gap-3.5 group focus:outline-none" aria-label="Nihal MV - Return to top">
          <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-lg shadow-black/80">
            <span className="text-xs font-mono font-bold">N</span>
          </div>
          <div>
            <span className="text-base sm:text-lg font-light tracking-[0.3em] text-white uppercase font-display leading-none group-hover:text-zinc-200 transition-colors block">
              NIHAL MV
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
              MERN GARAGE STUDIO
            </span>
          </div>
        </a>

        {/* Center Monospaced Navigation */}
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

        {/* Right Controls: 6-Frame Fleet Switcher + Scroll to Top */}
        <div className="flex items-center gap-3">
          {/* 3D Mode Switcher supporting all 6 frames */}
          <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl text-[9px] font-mono tracking-wider uppercase shadow-2xl shadow-black">
            <button
              onClick={() => setActiveModelMode('auto')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeModelMode === 'auto' ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-md shadow-black' : 'text-zinc-400 hover:text-white'
              }`}
              title="Auto Dynamic Scroll Mode (Cars 1 - 6)"
            >
              AUTO FLEET
            </button>
            {CAR_SLOTS.map((slot, idx) => (
              <button
                key={slot.id}
                onClick={() => {
                  setActiveModelMode(idx);
                  if (requestCarModelRef.current) {
                    requestCarModelRef.current(idx);
                  }
                }}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  activeModelMode === idx ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-md shadow-black' : 'text-zinc-400 hover:text-white'
                }`}
                title={`Force View ${slot.name}`}
              >
                F0{idx + 1}
              </button>
            ))}
          </div>

          {/* Scroll to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md text-zinc-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer shadow-lg shadow-black"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <span>TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 3. DYNAMIC TRANSITION EFFECT OVERLAY: Works across ALL 6 Frames!      */}
      {/* ==================================================================== */}
      <div 
        ref={transitionOverlayRef} 
        className="fixed inset-0 pointer-events-none z-30 opacity-0 transition-opacity duration-150"
      >
        {/* Glowing Laser Scanline Sweeping Across Viewport */}
        <div
          ref={laserLineRef}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.7)] will-change-transform"
        />
        {/* Ambient High-Tech Laser Shimmer Wash */}
        <div className="absolute inset-0 bg-white/[0.015] animate-pulse" />
        {/* Floating Quantum Laser Transition Notification */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center px-4 text-center">
          <div className="px-5 py-2 rounded-full bg-black/95 border border-white/20 backdrop-blur-xl shadow-2xl shadow-black flex items-center gap-3 text-white text-[10px] font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
            <span ref={transitionBadgeRef}>TRANSITION EFFECT // 3D LASER SCAN: FRAME 01 ➔ FRAME 02</span>
          </div>
          <span ref={transitionSubRef} className="text-[9px] font-mono tracking-[0.3em] text-zinc-400 mt-1.5 uppercase drop-shadow-md">
            CALIBRATING DETAILING BAY
          </span>
        </div>
      </div>

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
            <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black">
              
              {/* Studio Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-300 font-bold uppercase">
                    GARAGE DETAILING BAY
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                  HERO // STAGE 01
                </span>
              </div>

              {/* Aerion Hero Font & Studio Identity (Clean, Extra-Light, Letterspaced) */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md mb-3 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase">
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

              {/* Live Telemetry Stats Grid in Deep Stealth Glass */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    CAMERA
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    ZOOM-IN
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    ACTIVE CAR
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200 truncate block">
                    BMW M4
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    TURNTABLE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    360° STAGE
                  </span>
                </div>
              </div>

              {/* Real-time 3D Coordinates Readout */}
              <div className="pt-3.5 pb-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-4">
                <div className="flex items-center gap-3">
                  <span>YAW: <strong ref={hudYawRef} className="text-zinc-200 font-light">0°</strong></span>
                  <span>PITCH: <strong ref={hudPitchRef} className="text-zinc-200 font-light">0°</strong></span>
                </div>
                <span ref={hudZoomRef} className="text-zinc-400">
                  ZOOM: 0%
                </span>
              </div>

              {/* Transition Trigger CTA Button */}
              <button
                onClick={scrollToPhilosophy}
                className="w-full py-3.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl shadow-black border border-white/20 hover:border-white/40 group cursor-pointer backdrop-blur-md"
              >
                <span>SCROLL TO BAY 01 // CRAFT & PHILOSOPHY</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Interactive 3D Orbit Hint */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-wider">
              <Move3d size={13} className="text-zinc-400 animate-pulse" />
              <span>DRAG 3D CAR • ROTATE 360° ON ROUND STAGE</span>
            </div>
          </div>

          {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO PNG IMAGES! */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
              <span className={`w-2 h-2 rounded-full ${isHeroModelReady ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white shadow-[0_0_8px_#ffffff]'} animate-pulse`} />
              <span>{isHeroModelReady ? 'STAGE 01 // 360° TURNTABLE PLATFORM' : `CALIBRATING 3D MODEL • ${heroLoadProgress}%`}</span>
            </div>

            {!isHeroModelReady ? (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col gap-2.5 text-right w-64 shadow-2xl shadow-black">
                <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-300 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>STREAMING GLTF MESH</span>
                </div>
                <div className="w-full h-1.5 bg-black border border-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-300 transition-all duration-150"
                    style={{ width: `${Math.max(8, heroLoadProgress)}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                  BMW M4 PROTOTYPE • {heroLoadProgress}%
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-right">
                <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl text-[10px] font-mono tracking-widest text-zinc-400">
                  {activeCar.name}
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
                  <Move3d size={13} className="text-zinc-400 animate-pulse" />
                  <span>INTERACTIVE 3D WEBGL • DRAG TO ORBIT</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. SECTION 02: BAY 01 // CRAFT & PHILOSOPHY (Zero Empty Black Screen!)*/}
      {/* Frame 02 Porsche 911 Turbo on Round Stage in Heroic Showroom Stance */}
      {/* ==================================================================== */}
      <section 
        id="philosophy" 
        className="relative z-10 min-h-screen w-full flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 border-t border-white/[0.08] scroll-mt-12"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Full Philosophy Manifesto & Architecture Specifications */}
          <div className="w-full lg:max-w-xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black">
              
              {/* Studio Detailing Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-300 font-bold uppercase">
                    BAY 01 // CRAFT & PHILOSOPHY
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                  PRECISION.STUDIO.2026
                </span>
              </div>

              {/* Title & Philosophy Manifesto */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-zinc-300 text-[9px] font-mono tracking-widest uppercase mb-3 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STAGE 02 // FRAME 02 UNVEILED</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-extralight uppercase tracking-[0.16em] text-white font-display leading-[0.95] drop-shadow-2xl mb-2">
                  SCULPTED<br />
                  <span className="text-zinc-400">BY LOGIC.</span>
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
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    PERFORMANCE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    &lt; 50 KB
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    ARCHITECTURE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    ATOMIC
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    ACTIVE CAR
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    PORSCHE 911
                  </span>
                </div>
              </div>

              {/* 3 Surface Principles */}
              <div className="space-y-2 mb-5 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-start gap-2.5 backdrop-blur-md">
                  <span className="text-white font-bold shrink-0">01</span>
                  <span className="text-zinc-300 font-light">Modular React components with zero duplicate abstractions.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-start gap-2.5 backdrop-blur-md">
                  <span className="text-white font-bold shrink-0">02</span>
                  <span className="text-zinc-300 font-light">Proportioned visual rhythm & negative spaces for readable UX.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-start gap-2.5 backdrop-blur-md">
                  <span className="text-white font-bold shrink-0">03</span>
                  <span className="text-zinc-300 font-light">Zero technical debt: resilient async controllers & strict REST.</span>
                </div>
              </div>

              {/* Direct Flow to BAY 02 // TELEMETRY CTA */}
              <button
                onClick={scrollToTelemetry}
                className="w-full py-3.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl shadow-black border border-white/20 hover:border-white/40 group cursor-pointer backdrop-blur-md"
              >
                <span>PROCEED TO BAY 02 // TELEMETRY</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Interactive 3D Orbit Hint */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-wider">
              <Move3d size={13} className="text-zinc-400 animate-pulse" />
              <span>STAGE 02 ACTIVE • DRAG TO ROTATE 360°</span>
            </div>
          </div>

          {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO PNG IMAGES! */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>STAGE 02 // 360° ROUND TURNTABLE</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest text-zinc-400">
                {activeCar.name}
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
                <Move3d size={13} className="text-zinc-400 animate-pulse" />
                <span>FLOWING CONTINUOUSLY TO BAY 02</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. BOTTOM HUD FOOTER: Live Frame Status & Flow Indicators            */}
      {/* ==================================================================== */}
      <div className="fixed bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-white/[0.08] pt-4 pointer-events-auto bg-black/40 backdrop-blur-xl">
        {/* Left Frame Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="text-white font-light tracking-widest">
            {activeCar.name}
          </span>
          <span>—</span>
          <span ref={hudFrameRef}>FRAME 001 / 240</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] text-zinc-200 font-bold backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {loadingStatusText}
          </span>
        </div>

        {/* Center Stage Indicators */}
        <div className="hidden md:flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-widest">
          {CAR_SLOTS.map((slot, idx) => (
            <span
              key={slot.id}
              className={`px-2.5 py-0.5 rounded-full border transition-all ${
                activeCarSlotIndex === idx 
                  ? 'border-white/30 text-white bg-black/60 font-bold shadow-md shadow-black backdrop-blur-md' 
                  : 'border-white/10 text-zinc-400 bg-black/30 backdrop-blur-sm'
              }`}
            >
              0{idx + 1}
            </span>
          ))}
        </div>

        {/* Right Scroll Indicator */}
        <button
          onClick={scrollToTelemetry}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors tracking-widest uppercase group cursor-pointer"
        >
          <span>PROCEED TO NEXT BAY</span>
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform animate-bounce text-zinc-400" />
        </button>
      </div>

    </div>
  );
}
