import React from 'react';
import { Layout, Server, Database, Wrench, Cloud, Sparkles } from 'lucide-react';
import { skillCategories, techIcons } from '../data/skills.jsx';
import TiltCard from './TiltCard';
import ScrollReveal from './ScrollReveal';

const categoryIcons = {
  Layout,
  Server,
  Database,
  Wrench,
  Cloud,
  Sparkles
};

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-20 relative z-10" aria-label="Technical Skills">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        
        {/* Main Card Wrapper */}
        <ScrollReveal>
          <div className="rounded-3xl bg-[#121321]/90 backdrop-blur-md border border-violet-500/15 p-7 sm:p-10 lg:p-12 shadow-2xl shadow-black/40 hover:border-violet-500/30 transition-all duration-300">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  My <span className="text-violet-400">Skills</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-400">
                  Core technologies, languages, cloud platforms, and developer tooling
                </p>
              </div>
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/25 text-xs font-semibold text-violet-300 self-start sm:self-auto">
                <span>Full-Stack &amp; Cloud Ready</span>
              </div>
            </div>

            {/* Featured Technology Icons Grid */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0e0f1b]/80 border border-white/5 mb-12">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6 text-center sm:text-left">
                Core Tech Stack &amp; Tools
              </h3>
              
              <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-6">
                {techIcons.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-2.5 p-2 group cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:scale-110"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 group-hover:border-violet-500/50 group-hover:bg-violet-950/40 group-hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] flex items-center justify-center transition-all duration-200 shadow-sm">
                      {tech.svg}
                    </div>
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors text-center whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorized Skills Section (6 structured domains) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((cat, idx) => {
                const IconComp = categoryIcons[cat.icon] || Layout;
                return (
                  <ScrollReveal key={cat.category} delay={idx * 100}>
                    <TiltCard className="h-full rounded-2xl" maxTilt={6}>
                      <div className="h-full p-6 rounded-2xl bg-[#0f101b]/90 border border-white/5 hover:border-violet-500/35 hover:bg-violet-950/20 transition-all duration-200 flex flex-col justify-between">
                        <div>
                          {/* Category Title & Icon */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-sm">
                              <IconComp size={18} />
                            </div>
                            <h4 className="text-base font-bold text-white tracking-wide">
                              {cat.category}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {cat.skills.map((skill) => (
                            <span
                              key={skill.name}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-200 border border-white/10 hover:border-violet-400/50 hover:text-white hover:bg-violet-950/30 transition-colors"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                );
              })}
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
