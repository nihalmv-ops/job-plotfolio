import React, { useState } from 'react';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

function ProjectCard({ project, index }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-3xl bg-zinc-950/70 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Project Image / Dedicated Space Slot */}
        <div className="relative w-full aspect-video bg-[#0a0a0e] border-b border-white/5 overflow-hidden flex items-center justify-center">
          {!imageError ? (
            <img
              src={project.image}
              alt={`${project.title} Preview`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-zinc-950/80">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-2 group-hover:scale-105 transition-transform">
                <ImageIcon size={22} />
              </div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                PROJECT IMAGE SPACE
              </span>
              <span className="text-[10px] font-mono text-zinc-600 mt-1">
                {project.image}
              </span>
            </div>
          )}

          {/* Project Number Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-300 uppercase backdrop-blur-md">
            CREATION 0{index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="p-7 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-white mb-3">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors"
          >
            <span>LIVE DEMO</span>
            <ExternalLink size={13} />
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors"
          >
            <GithubIcon size={14} />
            <span>SOURCE</span>
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
      title: 'TrachMart — TechNest Laptops & Mobiles',
      description: 'A high-performance e-commerce frontend built for technology electronics. Features responsive shopping cart management, product filtering, and client-side routing.',
      technologies: ['React.js', 'JavaScript', 'Vite', 'Tailwind CSS'],
      image: '/projects/trachmart.png',
      liveUrl: 'https://trachmartshop.vercel.app/',
      githubUrl: 'https://github.com/nihalmv-ops/trachmartshop'
    },
    {
      title: 'GoTravel — Responsive Travel Platform',
      description: 'A modern travel discovery website emphasizing fluid layout adaptation, reusable component systems, and clean interactive user experiences across desktop and mobile.',
      technologies: ['React.js', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
      image: '/projects/gotravel.png',
      liveUrl: 'https://rgotravel.vercel.app/',
      githubUrl: 'https://github.com/nihalmv-ops/rgotravel'
    }
  ];

  return (
    <section
      id="creations"
      className="relative min-h-screen w-full bg-[#08090d] text-white flex flex-col justify-center px-4 sm:px-6 md:px-16 py-24 sm:py-28 z-20 border-t border-zinc-800/80"
      aria-label="Featured Creations"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header Line */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-300">
              BAY 04 // FEATURED CREATIONS
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest text-zinc-500">
            PRODUCTIONS.DEPLOYED.2026
          </span>
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white leading-[0.95] mb-4">
            REAL WORLD<br />
            <span className="text-zinc-500">APPLICATIONS.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            Real production deployments built with modern web technologies, strict responsive layouts, and verified GitHub repositories.
          </p>
        </div>

        {/* Projects 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((proj, index) => (
            <ProjectCard key={index} project={proj} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

