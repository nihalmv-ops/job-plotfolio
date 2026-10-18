import React from 'react';
import { GraduationCap, Code2, Calendar, MapPin } from 'lucide-react';

export default function EducationTimeline() {
  const items = [
    {
      period: '2023 — 2026',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'University / College, Kerala, India',
      description: 'Core foundation in computer applications, programming fundamentals, data structures, algorithms, relational databases, and software lifecycle design.',
      icon: GraduationCap
    },
    {
      period: '2023 — PRESENT',
      degree: 'Fullstack & MERN Engineering',
      institution: 'Self-Directed & Project Mastery',
      description: 'Production implementations across React.js, Node.js, Express.js, MongoDB, RESTful API design, state orchestration, Three.js 3D web graphics, and responsive UI engineering.',
      icon: Code2
    }
  ];

  return (
    <section
      id="education"
      className="relative min-h-[70vh] w-full bg-[#08090d] text-white flex flex-col justify-center px-4 sm:px-6 md:px-16 py-24 sm:py-28 z-20 border-t border-zinc-800/80"
      aria-label="Education & Background"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header Line */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-300">
              BAY 05 // FOUNDATION & ACADEMICS
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest text-zinc-500">
            KERALA.INDIA.2026
          </span>
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white leading-[0.95] mb-4">
            DISCIPLINED<br />
            <span className="text-zinc-500">TRAJECTORY.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            Combining academic principles in computer science with daily hands-on implementation in production-grade web technologies.
          </p>
        </div>

        {/* Timeline Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 tracking-wider">
                      <Calendar size={13} className="text-zinc-500" />
                      {item.period}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-light uppercase tracking-wider text-white mb-2">
                    {item.degree}
                  </h3>

                  <p className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
                    <MapPin size={12} className="text-zinc-500" />
                    {item.institution}
                  </p>

                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

