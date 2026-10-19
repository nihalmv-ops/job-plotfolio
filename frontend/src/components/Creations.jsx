import React, { useState } from 'react';
import { ExternalLink, ImageIcon, Move3d } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

function ProjectCard({ project, index }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black flex flex-col justify-between">
      <div>
        {/* Header with Project Number Badge & Verification */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
              CREATION 0{index + 1}
            </span>
          </div>
          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700/60 text-zinc-300">
            VERIFIED BUILD
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-light uppercase tracking-wider text-white mb-2 group-hover:text-zinc-200 transition-colors">
          {project.title}
        </h3>

        <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Technology Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-mono tracking-wider text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-zinc-900 text-white font-semibold text-[10px] tracking-wider uppercase shadow-md shadow-black border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer"
          >
            <span>LIVE DEMO</span>
            <ExternalLink size={12} />
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
          >
            <GithubIcon size={12} />
            <span>SOURCE CODE</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Creations() {
  const projects = [
    {
      title: 'SmartMart AI — Supermarket Management',
      description: 'A comprehensive supermarket billing and stock management application designed to streamline retail operations with real-time product catalogs and transaction handling.',
      technologies: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
      image: '/projects/smartmart.png',
      liveUrl: 'https://smartsh-ai-hrkd.vercel.app/',
      githubUrl: 'https://github.com/nihalmv-ops/smartshAI'
    },
    {
      title: 'GoTravel — Full-Stack Travel Web Application',
      description: 'A full-stack travel web application built with modern web development technologies, responsive React.js frontend interface, backend API services, and MongoDB database connectivity.',
      technologies: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
      image: '/projects/gotravel.png',
      liveUrl: 'https://rgotravel.vercel.app/',
      githubUrl: 'https://github.com/nihalmv-ops/rgotravel'
    },
    {
      title: 'TrachMart — TechNest Laptops & Mobiles',
      description: 'A high-performance e-commerce frontend built for technology electronics. Features responsive shopping cart management, product filtering, and client-side routing.',
      technologies: ['React.js', 'JavaScript', 'Vite', 'Tailwind CSS'],
      image: '/projects/trachmart.png',
      liveUrl: 'https://trachmartshop.vercel.app/',
      githubUrl: 'https://github.com/nihalmv-ops/trachmartshop'
    }
  ];

  return (
    <section
      id="creations"
      className="relative min-h-screen w-full bg-transparent text-white flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 sm:py-28 z-10 border-t border-zinc-800/60"
      aria-label="Featured Creations"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Projects Manifest (Kept in left container so 3D Car on right is 100% visible) */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl">
          {/* Section Header Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-300">
                BAY 04 // FEATURED CREATIONS
              </span>
            </div>
            <div className="inline-flex items-center gap-2 border border-zinc-700/60 px-3.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                FRAME 05 // CREATIONS MONSTER ACTIVE
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.16em] text-white leading-[0.95] mb-3">
              REAL WORLD<br />
              <span className="text-zinc-400">APPLICATIONS.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-lg">
              Real production deployments built with modern web technologies, strict responsive layouts, and verified GitHub repositories.
            </p>
          </div>

          {/* Projects Stack */}
          <div className="flex flex-col gap-4">
            {projects.map((proj, index) => (
              <ProjectCard key={index} project={proj} index={index} />
            ))}
          </div>
        </div>

        {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO OVERLAYS! */}
        <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[520px] pointer-events-none select-none">
          <div className="px-4 py-2 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>STAGE 05 // CREATIONS MONSTER UNVEILED</span>
          </div>

          <div className="space-y-2 text-right">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
              FRAME 05 // TURNTABLE ROTATION
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
              <Move3d size={13} className="text-zinc-400 animate-pulse" />
              <span>DRAG TO ROTATE 360°</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
