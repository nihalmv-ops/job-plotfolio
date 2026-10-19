import React from 'react';
import { GraduationCap, Code2, Calendar, MapPin, Move3d } from 'lucide-react';

export default function EducationTimeline() {
  const items = [
    {
      period: '2023 — 2026',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Safa Arts and Science College | University of Calicut, Kerala',
      description: 'Core coursework in Data Structures & Algorithms, Object-Oriented Programming (OOP), Database Management Systems (DBMS), Web Technologies, and Software Engineering.',
      icon: GraduationCap
    },
    {
      period: '2023 — PRESENT',
      degree: 'Fullstack & MERN Engineering',
      institution: 'Specializations & Professional Certifications',
      description: 'Certifications in Full-Stack MERN Development, Modern React with Hooks & Redux, and JavaScript Algorithms & Data Structures. Production deployments across React.js, Node.js, Express.js, MongoDB, and Three.js.',
      icon: Code2
    }
  ];

  return (
    <section
      id="education"
      className="relative min-h-screen w-full bg-transparent text-white flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto py-24 sm:py-28 z-10 border-t border-white/[0.08]"
      aria-label="Education & Background"
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Academic Manifest (Fits on left side so 3D Car on right is 100% visible) */}
        <div className="w-full lg:max-w-xl xl:max-w-2xl">
          {/* Section Header Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-300">
                BAY 05 // FOUNDATION & ACADEMICS
              </span>
            </div>
            <div className="inline-flex items-center gap-2 border border-white/10 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-xl shadow-lg w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                FRAME 06 // APEX PROTOCOL ACTIVE
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight uppercase tracking-[0.16em] text-white leading-[0.95] mb-3">
              DISCIPLINED<br />
              <span className="text-zinc-400">TRAJECTORY.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-lg">
              Combining academic principles in computer science with daily hands-on implementation in production-grade web technologies.
            </p>
          </div>

          {/* Timeline Items Stack - Sleek Glassmorphic Cards */}
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 hover:bg-black/50 transition-all duration-300 shadow-2xl shadow-black"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 tracking-wider">
                      <Calendar size={13} className="text-zinc-400" />
                      {item.period}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg font-light uppercase tracking-wider text-white mb-1.5 group-hover:text-zinc-200 transition-colors">
                    {item.degree}
                  </h3>

                  <p className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                    <MapPin size={12} className="text-zinc-400" />
                    {item.institution}
                  </p>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-3">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO OVERLAYS! */}
        <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[420px] pointer-events-none select-none">
          <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>STAGE 06 // APEX PROTOCOL UNVEILED</span>
          </div>

          <div className="space-y-2 text-right">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl text-[10px] font-mono tracking-widest text-zinc-400">
              FRAME 06 // FLAGSHIP 360° TURNTABLE
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
              <Move3d size={13} className="text-zinc-400 animate-pulse" />
              <span>DRAG TO ROTATE 360°</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
