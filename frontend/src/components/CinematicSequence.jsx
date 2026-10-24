import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  ArrowDown, 
  ArrowUp, 
  Move3d
} from 'lucide-react';

// ============================================================================
// 🏎️ SINGLE HIGH-PERFORMANCE FLAGSHIP 3D MODEL CONFIGURATION
// Flagship model: /secondfream.glb (Porsche 911 Turbo)
// 6-Bay stage angles represent 6 dynamic studio perspectives as the user scrolls
// ============================================================================
export const CAR_CONFIG = {
  id: 1,
  name: 'PORSCHE 911 TURBO',
  url: '/secondfream.glb',
  targetDim: 4.1,
  bay: 'PORSCHE 911 // 360° STEALTH GARAGE'
};

export const BAY_STAGES = [
  { id: 1, name: 'STAGE 01 // FRONT THREE-QUARTER', bay: 'HERO STUDIO', angle: -0.45, camY: 0.70, camZ: 5.2, label: '01 HERO' },
  { id: 2, name: 'STAGE 02 // SIDE PROFILE & AERO', bay: 'BAY 01 // PHILOSOPHY', angle: Math.PI / 2.0, camY: 0.70, camZ: 5.2, label: '02 PHILOSOPHY' },
  { id: 3, name: 'STAGE 03 // REAR PERFORMANCE ANGLE', bay: 'BAY 02 // TELEMETRY', angle: Math.PI * 0.90, camY: 0.70, camZ: 5.3, label: '03 TELEMETRY' },
  { id: 4, name: 'STAGE 04 // OVERHEAD COCKPIT & CHASSIS', bay: 'BAY 03 // TECHNOLOGY', angle: Math.PI * 1.35, camY: 1.05, camZ: 5.0, label: '04 TECHNOLOGY' },
  { id: 5, name: 'STAGE 05 // LOW AGGRESSIVE TRACK STANCE', bay: 'BAY 04 // CREATIONS', angle: Math.PI * 1.75, camY: 0.60, camZ: 5.3, label: '05 CREATIONS' },
  { id: 6, name: 'STAGE 06 // APEX PROTOCOL 360° FINALE', bay: 'BAY 05 & 06 // APEX', angle: Math.PI * 2.0 - 0.45, camY: 0.95, camZ: 5.2, label: '06 APEX' }
];

export default function CinematicSequence({ onHeroProgress, onHeroReady }) {
  const canvasRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('CALIBRATING 3D STUDIO');
  const [heroLoadProgress, setHeroLoadProgress] = useState(0);
  const [isHeroModelReady, setIsHeroModelReady] = useState(false);

  // Direct DOM references for ultra-smooth 120 FPS HUD updates without React re-renders
  const hudFrameRef = useRef(null);
  const hudYawRef = useRef(null);
  const hudPitchRef = useRef(null);
  const hudZoomRef = useRef(null);

  // References for cross-scope model and interaction control
  const loadedModelRef = useRef(null);
  const carRootGroupRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. High-Precision WebGL Renderer for Automotive Studio
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);

    // Generate photorealistic procedural studio environment cubemap for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnvTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const scene = new THREE.Scene();
    scene.environment = studioEnvTexture;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      43,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    // Camera initial framing
    const isInitialDesktop = window.innerWidth >= 1024;
    camera.position.set(isInitialDesktop ? 0.25 : 0, 0.70, isInitialDesktop ? 5.2 : 6.3);

    // Parent group for car & round stage placed in the right side area on desktop
    const carRootGroup = new THREE.Group();
    if (window.innerWidth >= 1024) {
      carRootGroup.position.set(1.0, 0, 0);
    } else if (window.innerWidth >= 768) {
      carRootGroup.position.set(0.5, 0, 0);
    } else {
      carRootGroup.position.set(0, -0.2, 0);
    }
    carRootGroupRef.current = carRootGroup;
    scene.add(carRootGroup);

    // 2. Pure Automotive Studio Lighting calibrated to faithfully render authentic .glb colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const overheadKeyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    overheadKeyLight.position.set(2.0, 7.0, 3.0);
    scene.add(overheadKeyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.65);
    fillLight.position.set(-4.0, 3.0, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 3.5, -4.0);
    scene.add(rimLight);

    const frontAccent = new THREE.DirectionalLight(0xffffff, 0.65);
    frontAccent.position.set(2.0, 1.5, 4.0);
    scene.add(frontAccent);

    // 3. Full On Pure Pitch Black Automotive Floor (Zero Glare, Seamless Black Void)
    const floorGeom = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.98;
    scene.add(floor);

    // 4. Photorealistic Automotive Turntable Round Stage in Pure Stealth Black Theme
    const stageGroup = new THREE.Group();

    const STAGE_RADIUS = 2.4;
    const STAGE_HEIGHT = 0.10;
    const STAGE_Y = -0.93;
    const STAGE_TOP_Y = STAGE_Y + STAGE_HEIGHT / 2; // -0.88

    // Stage Top / Main Cylindrical Disc Platform (Pure Solid Obsidian Stealth Black)
    const stageGeom = new THREE.CylinderGeometry(STAGE_RADIUS, STAGE_RADIUS + 0.10, STAGE_HEIGHT, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x060608,
      metalness: 0.15,
      roughness: 0.8,
      envMapIntensity: 0.2
    });
    const stageMesh = new THREE.Mesh(stageGeom, stageMat);
    stageMesh.position.y = STAGE_Y;
    stageGroup.add(stageMesh);

    // Beveled Outer Bezel Edge Ring (Stealth Solid Dark Charcoal Finish)
    const bezelGeom = new THREE.TorusGeometry(STAGE_RADIUS + 0.01, 0.02, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f13,
      metalness: 0.25,
      roughness: 0.65,
      envMapIntensity: 0.25
    });
    const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.y = STAGE_TOP_Y - 0.005;
    stageGroup.add(bezelMesh);

    // Stage Surface Concentric Detailing Ring (Subtle Monochromatic Dark Line)
    const stageRingMat = new THREE.MeshBasicMaterial({ color: 0x18181d, transparent: true, opacity: 0.4 });
    const stageRingGeom = new THREE.RingGeometry(STAGE_RADIUS - 0.2, STAGE_RADIUS - 0.185, 64);
    const stageRing = new THREE.Mesh(stageRingGeom, stageRingMat);
    stageRing.rotation.x = -Math.PI / 2;
    stageRing.position.y = STAGE_TOP_Y + 0.0006;
    stageGroup.add(stageRing);

    carRootGroup.add(stageGroup);

    // 5. Grounding Contact Shadow (Soft Radial Shadow directly under the wheels)
    const createContactShadowTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(c);
    };

    const contactShadowGeom = new THREE.PlaneGeometry(2.1, 4.3);
    const contactShadowTexture = createContactShadowTexture();
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const contactShadowMesh = new THREE.Mesh(contactShadowGeom, contactShadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.set(0, STAGE_TOP_Y + 0.0005, 0);
    carRootGroup.add(contactShadowMesh);

    // 6. GLTF Loader Setup with Native Meshopt Compression Support
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    // Helper: Normalize, center and precisely ground 3D model onto the round stage
    const normalizeModel = (gltfScene, targetDim = 4.1) => {
      // 1. Hide Sketchfab baked shadow plane (material_0 / Object_140)
      gltfScene.traverse((child) => {
        if (child.isMesh && child.material && child.material.name === 'material_0') {
          child.visible = false;
        }
      });

      // 2. Force matrix update and compute EXACT vertex-level bounding box
      // (Using expandByPoint per vertex avoids AABB inflation from rotated node matrices)
      gltfScene.updateMatrixWorld(true);
      const carBox = new THREE.Box3();
      const tempVec = new THREE.Vector3();

      gltfScene.traverse((child) => {
        if (child.isMesh && child.visible && child.geometry && child.geometry.attributes.position) {
          const pos = child.geometry.attributes.position;
          const mw = child.matrixWorld;
          for (let i = 0; i < pos.count; i++) {
            tempVec.set(pos.getX(i), pos.getY(i), pos.getZ(i));
            tempVec.applyMatrix4(mw);
            carBox.expandByPoint(tempVec);
          }
        }
      });

      const center = carBox.getCenter(new THREE.Vector3());
      const size = carBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = targetDim / maxDim;

      gltfScene.scale.setScalar(scale);

      // Dead-center the car horizontally on the turntable (X=0, Z=0)
      gltfScene.position.x = -center.x * scale;
      gltfScene.position.z = -center.z * scale;

      // Rest tires flush on top of the turntable stage disc (STAGE_TOP_Y = -0.880)
      gltfScene.position.y = -carBox.min.y * scale + STAGE_TOP_Y + 0.001;

      // 3. Materials clearcoat & reflection enhancement (Preserves authentic car colors 100%)
      gltfScene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.frustumCulled = false;

          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            if (mat && (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)) {
              mat.envMapIntensity = 0.95;
              const name = (mat.name || '').toLowerCase();
              if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
                mat.roughness = 0.05;
                mat.metalness = 0.1;
                mat.envMapIntensity = 1.35;
              } else if (name.includes('wheel') || name.includes('rim') || name.includes('caliper')) {
                mat.envMapIntensity = 1.15;
              }
              mat.needsUpdate = true;
            }
          });
        }
      });

      const wrapper = new THREE.Group();
      wrapper.add(gltfScene);
      return wrapper;
    };

    // Load the Single High-Quality Porsche 911 Turbo Model
    loader.load(
      CAR_CONFIG.url,
      (gltf) => {
        const modelWrapper = normalizeModel(gltf.scene, CAR_CONFIG.targetDim);
        modelWrapper.rotation.y = 0; // Perfectly aligned with the turntable stage
        modelWrapper.visible = true;

        loadedModelRef.current = modelWrapper;
        carRootGroup.add(modelWrapper);

        setIsHeroModelReady(true);
        setLoadingStatusText('PORSCHE 911 TURBO // GARAGE READY');
        if (onHeroReady) onHeroReady();
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
          setHeroLoadProgress(percent);
          if (onHeroProgress) onHeroProgress(percent, xhr.loaded, xhr.total);
          setLoadingStatusText(`INGESTING PORSCHE 911: ${percent}%`);
        }
      },
      (err) => {
        console.warn(`Could not load ${CAR_CONFIG.url}:`, err);
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
    let curGlobalProgress = 0;
    let scrollRotY = 0;
    let scrollRotX = 0;
    const isDesk = window.innerWidth >= 1024;
    let targetCamX = isDesk ? 0.25 : 0;
    let targetLookX = isDesk ? 0.85 : 0;
    let targetCamY = 0.70;
    let targetCamZ = isDesk ? 5.2 : 6.3;

    let animId = null;
    let lastTelemetryUpdate = 0;
    let isTabVisible = !document.hidden;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    let lastActiveStageSlot = -1;
    let lastFrameNum = -1;

    const animate = (time) => {
      if (!isTabVisible) {
        animId = null;
        return;
      }
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

      // 2. Section boundary calculations using pre-cached offsets
      let activeIdx = 0;
      let transRatio = 0;

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
            transRatio = 1 - (nextTop - zoneEnd) / (zoneStart - zoneEnd);
            break;
          }
        }
      }

      // Smooth section-to-section camera and angle interpolation
      const currentStage = BAY_STAGES[activeIdx] || BAY_STAGES[0];
      const nextStage = BAY_STAGES[Math.min(activeIdx + 1, BAY_STAGES.length - 1)];

      const isDesktop = window.innerWidth >= 1024;
      targetCamX = isDesktop ? 0.25 : 0;
      targetLookX = isDesktop ? 0.85 : 0;

      // Smooth rotational staging for Porsche 911 Turbo
      const baseAngle = currentStage.angle + (nextStage.angle - currentStage.angle) * transRatio;
      scrollRotY = prefersReducedMotion ? currentStage.angle : baseAngle;
      scrollRotX = 0.01;

      targetCamY = currentStage.camY + (nextStage.camY - currentStage.camY) * transRatio;
      targetCamZ = (isDesktop ? currentStage.camZ : currentStage.camZ + 1.1) + (nextStage.camZ - currentStage.camZ) * transRatio;

      // Notify React only when stage actually changes
      if (activeIdx !== lastActiveStageSlot) {
        lastActiveStageSlot = activeIdx;
        setActiveStageIndex(activeIdx);
      }

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + (prefersReducedMotion ? 0 : mouseX * 0.12);
      const totalTargetRotX = scrollRotX + dragRotX + (prefersReducedMotion ? 0 : mouseY * 0.08);

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.1;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.1;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(targetLookX, isDesktop ? -0.1 : -0.2, 0);

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

    // Pause animation when tab is inactive to save battery and GPU
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animId) {
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth >= 1024) {
        carRootGroup.position.set(1.0, 0, 0);
      } else if (window.innerWidth >= 768) {
        carRootGroup.position.set(0.5, 0, 0);
      } else {
        carRootGroup.position.set(0, -0.2, 0);
      }
      measureSectionTops();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      contactShadowGeom.dispose();
      contactShadowTexture.dispose();
      contactShadowMat.dispose();
      floorGeom.dispose();
      floorMat.dispose();
      stageGeom.dispose();
      stageMat.dispose();
      bezelGeom.dispose();
      bezelMat.dispose();
      stageRingGeom.dispose();
      stageRingMat.dispose();
      pmremGenerator.dispose();
      studioEnvTexture.dispose();
    };
  }, []);

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

  const activeStage = BAY_STAGES[activeStageIndex] || BAY_STAGES[0];

  return (
    <div id="cinematic-container" className="relative w-full">
      
      {/* ==================================================================== */}
      {/* 1. PERSISTENT FULLSCREEN 3D WEBGL FULL BLACK GARAGE CANVAS           */}
      {/* ==================================================================== */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="3D Supercar Garage Canvas"
        className="fixed inset-0 w-full h-full block object-cover z-0 pointer-events-none"
      />

      {/* Subtle Pure Black Studio Vignette (Deep pure pitch black edge fade) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_65%_50%,transparent_50%,rgba(0,0,0,0.98)_100%)] z-[1]" />

      {/* ==================================================================== */}
      {/* 2. FIXED TOP HEADER HUD                                              */}
      {/* ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto bg-black/40 backdrop-blur-xl border-b border-white/[0.08]">
        {/* Logo & Status */}
        <a href="#" className="flex items-center gap-3.5 group focus:outline-none" aria-label="Nihal MV - Return to top">
          <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-lg shadow-black/80">
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

        {/* Right Controls: Single Model Studio Badge + Scroll to Top */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl text-[9px] font-mono tracking-wider uppercase text-zinc-300 shadow-2xl shadow-black">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>PORSCHE 911 TURBO // 360° GARAGE</span>
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
      {/* 3. SECTION 01: HERO SECTION (Pure 3D Car on Stage, NO PNG IMAGE!)   */}
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
                    STAGE 01 // PORSCHE 911 TURBO
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
                    GARAGE
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200">
                    BLACK
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                    ACTIVE CAR
                  </span>
                  <span className="text-xs sm:text-sm font-light font-mono text-zinc-200 truncate block">
                    PORSCHE 911
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
              <span>{isHeroModelReady ? 'STAGE 01 // 360° OBSIDIAN TURNTABLE' : `CALIBRATING 3D MODEL • ${heroLoadProgress}%`}</span>
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
                  PORSCHE 911 TURBO • {heroLoadProgress}%
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-right">
                <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl text-[10px] font-mono tracking-widest text-zinc-400">
                  {CAR_CONFIG.name}
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
      {/* 4. SECTION 02: BAY 01 // CRAFT & PHILOSOPHY                          */}
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
                  PRECISION.GARAGE.2026
                </span>
              </div>

              {/* Title & Philosophy Manifesto */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-zinc-300 text-[9px] font-mono tracking-widest uppercase mb-3 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STAGE 02 // SIDE PROFILE & AERO</span>
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
              <span>STAGE 02 // 360° OBSIDIAN TURNTABLE</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest text-zinc-400">
                {CAR_CONFIG.name}
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
      {/* 5. BOTTOM HUD FOOTER: Live Stage Status & Quick Stage Jumps          */}
      {/* ==================================================================== */}
      <div className="fixed bottom-6 left-0 right-0 z-30 px-6 sm:px-12 flex items-center justify-between border-t border-white/[0.08] pt-4 pointer-events-auto bg-black/40 backdrop-blur-xl">
        {/* Left Frame Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="text-white font-light tracking-widest">
            {CAR_CONFIG.name}
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
          {BAY_STAGES.map((stage, idx) => (
            <span
              key={stage.id}
              className={`px-2.5 py-0.5 rounded-full border transition-all ${
                activeStageIndex === idx 
                  ? 'border-white/30 text-white bg-black/60 font-bold shadow-md shadow-black backdrop-blur-md' 
                  : 'border-white/10 text-zinc-400 bg-black/30 backdrop-blur-sm'
              }`}
            >
              {stage.label}
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
