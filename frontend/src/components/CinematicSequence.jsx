import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

export default function CinematicSequence() {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeCarSlotIndex, setActiveCarSlotIndex] = useState(0);
  const [activeModelMode, setActiveModelMode] = useState('auto'); // 'auto', or 0..5 for manual lock
  const [loadedCount, setLoadedCount] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('CALIBRATING 3D STUDIO');

  // Dynamic transition state across all 6 frames
  const [transitionState, setTransitionState] = useState({
    active: false,
    fromIndex: 0,
    toIndex: 1,
    ratio: 0
  });

  // Live 3D telemetry coordinates state
  const [telemetryCoords, setTelemetryCoords] = useState({ rotX: 0, rotY: 0, rotZ: 0 });

  // References for cross-scope model and interaction control
  const loadedModelsRef = useRef([null, null, null, null, null, null]);
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

    // Dedicated Car & Stage Studio Key Light directly bound to the turntable
    const carKeyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    carKeyLight.position.set(0, 8, 4);
    carRootGroup.add(carKeyLight);

    const carRimLight = new THREE.DirectionalLight(0xe2e8f0, 3.2);
    carRimLight.position.set(0, 5, -5);
    carRootGroup.add(carRimLight);

    const carSideLight = new THREE.DirectionalLight(0xf1f5f9, 2.6);
    carSideLight.position.set(-5, 4, 2);
    carRootGroup.add(carSideLight);

    // 2. Pure Automotive Detailing Studio Lighting (Clean White & Silver)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const overheadLight = new THREE.DirectionalLight(0xffffff, 4.8);
    overheadLight.position.set(0, 9, 2);
    scene.add(overheadLight);

    const leftLight = new THREE.DirectionalLight(0xf1f5f9, 3.4);
    leftLight.position.set(-6, 4, 4);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xf8fafc, 3.6);
    rightLight.position.set(6, 4, 4);
    scene.add(rightLight);

    const rearLight = new THREE.DirectionalLight(0xe2e8f0, 3.0);
    rearLight.position.set(0, 5, -6);
    scene.add(rearLight);

    const groundBounce = new THREE.DirectionalLight(0xdbeafe, 1.4);
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
    const floorGeom = new THREE.PlaneGeometry(40, 40);
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

    // 6. High-Tech 3D Laser Scanning Beam (Transition Effect between Cars)
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
            child.material.envMapIntensity = 2.4;
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

    // Staggered Concurrent Loader: All 6 models start loading immediately with a tiny 200ms stagger
    CAR_SLOTS.forEach((slot, index) => {
      setTimeout(() => {
        loader.load(
          slot.url,
          (gltf) => {
            const modelWrapper = normalizeModel(gltf.scene, slot.targetDim);
            modelWrapper.rotation.y = -Math.PI / 2.2;
            modelWrapper.visible = (index === 0);
            setMeshOpacity(modelWrapper, 1.0);

            loadedModelsRef.current[index] = modelWrapper;
            carRootGroup.add(modelWrapper);

            setLoadedCount((prev) => {
              const updated = prev + 1;
              setLoadingStatusText(`FLEET READY: ${updated} / 6`);
              return updated;
            });
          },
          undefined,
          (err) => {
            console.warn(`Could not load ${slot.url}:`, err);
          }
        );
      }, index * 200);
    });

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

    const animate = (time) => {
      animId = requestAnimationFrame(animate);

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

      // 3D Laser Scan Rig Animation: Active on EVERY frame transition!
      if (curInTrans && effectiveActive !== effectiveNext) {
        scanRig.visible = true;
        scanRig.position.z = 2.8 - curTransRatio * 5.6; // Sweeps from front bumper across car to rear
        const pulse = Math.sin(curTransRatio * Math.PI); // Smooth bell curve
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

      // Model Visibility and Cross-Fade Handling: GUARANTEES STAGE IS ALWAYS OCCUPIED!
      models.forEach((m, idx) => {
        if (!m) return;
        if (curInTrans && effectiveActive !== effectiveNext) {
          if (idx === effectiveActive) {
            m.visible = true;
            m.position.y = curTransRatio * 0.7;
            setMeshOpacity(m, Math.max(0.12, 1 - curTransRatio));
          } else if (idx === effectiveNext) {
            m.visible = true;
            m.position.y = 0;
            setMeshOpacity(m, Math.min(1, curTransRatio * 1.2));
          } else {
            m.visible = false;
          }
        } else {
          if (idx === effectiveActive) {
            m.visible = true;
            m.position.y = 0;
            setMeshOpacity(m, 1.0);
          } else {
            m.visible = false;
          }
        }
      });

      // Update active slot index for UI display
      setActiveCarSlotIndex(effectiveActive);

      // Merge scroll rotation + interactive drag + mouse parallax
      const totalTargetRotY = scrollRotY + dragRotY + mouseX * 0.12;
      const totalTargetRotX = scrollRotX + dragRotX + mouseY * 0.08;

      carRootGroup.rotation.y += (totalTargetRotY - carRootGroup.rotation.y) * 0.07;
      carRootGroup.rotation.x += (totalTargetRotX - carRootGroup.rotation.x) * 0.07;

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.lookAt(targetLookX, -0.10, 0);

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
    // 🌐 ALL 6-FRAME SCROLL & SAME MODEL ZOOM EFFECT CHOREOGRAPHY
    // ========================================================================
    const sectionIds = ['hero', 'philosophy', 'telemetry', 'technology', 'creations', 'education'];

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

      let activeIdx = 0;
      let nextIdx = 0;
      let transRatio = 0;
      let transitioning = false;

      // Section boundary measurements
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        // If this section has crossed above mid-viewport, it is the primary section
        if (rect.top <= winH * 0.55) {
          activeIdx = i;
        }

        // Check transition to next section
        if (i < sectionIds.length - 1) {
          const nextEl = document.getElementById(sectionIds[i + 1]);
          if (nextEl) {
            const nextRect = nextEl.getBoundingClientRect();
            // Transition zone: when next section top is between 85% of screen and 15% of screen
            const zoneStart = winH * 0.85;
            const zoneEnd = winH * 0.15;
            if (nextRect.top <= zoneStart && nextRect.top >= zoneEnd) {
              transitioning = true;
              activeIdx = i;
              nextIdx = i + 1;
              transRatio = 1 - (nextRect.top - zoneEnd) / (zoneStart - zoneEnd);
              break;
            }
          }
        }
      }

      // If activeModelMode is manually locked (number), override activeIdx
      const mode = activeModeRef.current;
      if (typeof mode === 'number' && mode >= 0 && mode < CAR_SLOTS.length) {
        activeIdx = mode;
        transitioning = false;
      }

      curActiveIdx = activeIdx;
      curNextIdx = nextIdx;
      curTransRatio = transRatio;
      curInTrans = transitioning;

      setTransitionState({
        active: transitioning,
        fromIndex: activeIdx,
        toIndex: nextIdx,
        ratio: transRatio
      });

      const isDesktop = window.innerWidth >= 1024;
      targetCamX = isDesktop ? 0.15 : 0;
      targetLookX = isDesktop ? 0.75 : 0;

      // Signature Zoom-In -> Laser Scan -> Zoom-Out effect across EVERY frame change:
      if (transitioning) {
        // Smooth sine bell curve for zoom dip (dips from 5.0 down to 3.4 at peak)
        const zoomDip = Math.sin(transRatio * Math.PI) * 1.6;
        targetCamZ = 5.0 - zoomDip;
        targetCamY = 0.85 - Math.sin(transRatio * Math.PI) * 0.18;
        scrollRotY = activeIdx * 0.70 + transRatio * 0.70;
        scrollRotX = 0.01;
      } else {
        // Settled wide showroom stance for current active car
        targetCamZ = 5.0;
        targetCamY = activeIdx === 5 ? 1.25 : 0.85; // slightly elevated overview on final section
        scrollRotY = activeIdx * 0.70;
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
        carRootGroup.position.set(1.5, 0, 0);
      } else if (window.innerWidth >= 768) {
        carRootGroup.position.set(0.7, 0, 0);
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

  const formattedFrame = String(currentFrame).padStart(3, '0');
  const activeCar = CAR_SLOTS[activeCarSlotIndex] || CAR_SLOTS[0];

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

      {/* Subtle Studio Vignette (Clear on right side so car is 100% visible) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,transparent_55%,rgba(8,9,13,0.6)_100%)] z-[1]" />

      {/* ==================================================================== */}
      {/* 2. FIXED AERION-STYLE TOP HEADER HUD                                 */}
      {/* ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#08090d]/90 via-[#08090d]/30 to-transparent backdrop-blur-xs">
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

        {/* Right Controls: 6-Frame Fleet Switcher + Scroll to Top */}
        <div className="flex items-center gap-3">
          {/* 3D Mode Switcher supporting all 6 frames */}
          <div className="hidden sm:inline-flex items-center p-1 rounded-full bg-[#111318]/95 border border-zinc-700/60 backdrop-blur-md text-[9px] font-mono tracking-wider uppercase shadow-xl shadow-black/50">
            <button
              onClick={() => setActiveModelMode('auto')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeModelMode === 'auto' ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Auto Dynamic Scroll Mode (Cars 1 - 6)"
            >
              AUTO FLEET
            </button>
            {CAR_SLOTS.map((slot, idx) => (
              <button
                key={slot.id}
                onClick={() => setActiveModelMode(idx)}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  activeModelMode === idx ? 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black font-semibold shadow' : 'text-zinc-400 hover:text-white'
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-400 bg-zinc-900/60 text-zinc-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
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
      {transitionState.active && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {/* Glowing Laser Scanline Sweeping Across Viewport */}
          <div
            className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_28px_#38bdf8] transition-all duration-75"
            style={{ top: `${Math.min(95, Math.max(5, transitionState.ratio * 100))}%` }}
          />
          {/* Ambient High-Tech Laser Shimmer Wash */}
          <div className="absolute inset-0 bg-cyan-500/[0.04] animate-pulse" />
          {/* Floating Quantum Laser Transition Notification */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center px-4 text-center">
            <div className="px-5 py-2 rounded-full bg-cyan-950/95 border border-cyan-400/70 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.55)] flex items-center gap-3 text-cyan-200 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-ping" />
              <span>TRANSITION EFFECT // 3D LASER SCAN: FRAME 0{transitionState.fromIndex + 1} ➔ FRAME 0{transitionState.toIndex + 1}</span>
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-cyan-300/90 mt-1.5 uppercase drop-shadow-md">
              CALIBRATING {CAR_SLOTS[transitionState.toIndex]?.bay || 'DETAILING BAY'}
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
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-black/50 border border-zinc-700/60 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>STAGE 01 // 360° TURNTABLE PLATFORM</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
                {activeCar.name}
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
              <span>STAGE 02 ACTIVE • DRAG TO ROTATE 360°</span>
            </div>
          </div>

          {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO PNG IMAGES! */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[400px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-cyan-200 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
              <span>STAGE 02 // 360° ROUND TURNTABLE</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
                {activeCar.name}
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
            {activeCar.name}
          </span>
          <span>—</span>
          <span>FRAME {formattedFrame} / 240</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-600/50 text-[10px] text-slate-200 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {loadingStatusText}
          </span>
        </div>

        {/* Center Stage Indicators */}
        <div className="hidden md:flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-widest">
          {CAR_SLOTS.map((slot, idx) => (
            <span
              key={slot.id}
              className={`px-2 py-0.5 rounded-full border transition-all ${
                activeCarSlotIndex === idx 
                  ? 'border-cyan-400 text-cyan-200 bg-cyan-950/60 shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                  : 'border-zinc-800 text-zinc-600'
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
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform animate-bounce" />
        </button>
      </div>

    </div>
  );
}
