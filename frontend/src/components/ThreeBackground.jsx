import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // --- 2. 3D Floating Geometry Elements ---
    // Floating Wireframe Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(3.5, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(16, 5, -10);
    scene.add(icosahedron);

    // Floating Torus Knot
    const torusGeometry = new THREE.TorusKnotGeometry(2.5, 0.6, 64, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x6d28d9,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    torusKnot.position.set(-16, -15, -15);
    scene.add(torusKnot);

    // Subtle Octahedron
    const octGeometry = new THREE.OctahedronGeometry(2, 0);
    const octMaterial = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const octahedron = new THREE.Mesh(octGeometry, octMaterial);
    octahedron.position.set(12, -28, -8);
    scene.add(octahedron);

    // --- 3. 3D Starfield & Particle Constellation ---
    const particleCount = 750;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color(0x8b5cf6);
    const violetLightColor = new THREE.Color(0xc084fc);
    const blueColor = new THREE.Color(0x38bdf8);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute in a 3D cylindrical space along the page length
      posArray[i] = (Math.random() - 0.5) * 60;
      posArray[i + 1] = (Math.random() - 0.5) * 120;
      posArray[i + 2] = (Math.random() - 0.5) * 45;

      // Color variation (purple, violet, cyan, soft white)
      const rand = Math.random();
      let chosenColor = purpleColor;
      if (rand < 0.3) chosenColor = violetLightColor;
      else if (rand < 0.6) chosenColor = blueColor;
      else if (rand < 0.8) chosenColor = whiteColor;

      colorArray[i] = chosenColor.r;
      colorArray[i + 1] = chosenColor.g;
      colorArray[i + 2] = chosenColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Particle Material with circular texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- 4. Interactive Mouse Parallax & Scroll Listeners ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentScroll = 0;
    let targetScroll = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // --- 5. Animation Loop with Smooth Easing ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Smooth scroll lerp
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // 3D Geometric shapes slow rotations & float
      icosahedron.rotation.x = elapsedTime * 0.15;
      icosahedron.rotation.y = elapsedTime * 0.2;
      icosahedron.position.y = 5 + Math.sin(elapsedTime * 0.7) * 1.5;

      torusKnot.rotation.x = elapsedTime * 0.12;
      torusKnot.rotation.y = elapsedTime * 0.18;
      torusKnot.position.y = -15 + Math.cos(elapsedTime * 0.6) * 1.5;

      octahedron.rotation.x = elapsedTime * 0.2;
      octahedron.rotation.z = elapsedTime * 0.25;

      // Particles gentle drift
      particlesMesh.rotation.y = elapsedTime * 0.02;

      // Scroll effect: move camera smoothly through the 3D space
      // Max scroll height approximation
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollProgress = currentScroll / maxScroll;

      // Camera transitions through the 3D space as user scrolls
      camera.position.y = -scrollProgress * 40;
      camera.position.x = targetX * 1.8;
      camera.position.z = 25 - scrollProgress * 10;
      camera.rotation.x = -targetY * 0.08;
      camera.rotation.y = -targetX * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      icoGeometry.dispose();
      icoMaterial.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      octGeometry.dispose();
      octMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
