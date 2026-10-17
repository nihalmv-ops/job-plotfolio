import React from 'react';
import { GraduationCap, MapPin, Mail, Briefcase, Lightbulb, Users, TrendingUp } from 'lucide-react';

const qualities = [
  {
    title: 'Problem Solver',
    description: 'I enjoy finding simple and effective solutions to complex problems.',
    icon: Lightbulb
  },
  {
    title: 'Team Player',
    description: 'I value communication, collaboration, and teamwork.',
    icon: Users
  },
  {
    title: 'Continuous Learner',
    description: 'I continuously explore new technologies and improve my development skills.',
    icon: TrendingUp
  }
];

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 relative" aria-label="About Me">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="relative rounded-3xl bg-[#121321] border border-violet-500/15 p-7 sm:p-10 lg:p-12 shadow-2xl shadow-black/40 hover:border-violet-500/30 transition-all duration-300">
          
          {/* Subtle Corner Glow Accent */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Bio & Badges */}
            <div className="lg:col-span-7 flex flex-col">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5">
                About <span className="text-violet-400">Me</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed mb-8">
                I am a passionate web developer interested in building modern web applications.
                I enjoy learning new technologies, solving programming problems, and creating
                useful digital solutions.
              </p>

              {/* Information Pills */}
              <div className="flex flex-wrap gap-3" role="list" aria-label="Personal Information">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-200 hover:border-violet-500/40 hover:bg-violet-950/20 transition-colors" role="listitem">
                  <GraduationCap size={17} className="text-violet-400" aria-hidden="true" />
                  <span>BCA, 2023–2026</span>
                </div>

                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-200 hover:border-violet-500/40 hover:bg-violet-950/20 transition-colors" role="listitem">
                  <MapPin size={17} className="text-violet-400" aria-hidden="true" />
                  <span>Kerala, India</span>
                </div>

                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-200 hover:border-violet-500/40 hover:bg-violet-950/20 transition-colors" role="listitem">
                  <Mail size={17} className="text-violet-400" aria-hidden="true" />
                  <a href="mailto:nihalmv2004@gmail.com" className="hover:text-violet-300 transition-colors">
                    nihalmv2004@gmail.com
                  </a>
                </div>

                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/30 border border-emerald-500/30 text-sm font-semibold text-emerald-400" role="listitem">
                  <Briefcase size={17} className="text-emerald-400" aria-hidden="true" />
                  <span>Open to Work</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Professional Qualities */}
            <div className="lg:col-span-5 flex flex-col gap-4" role="list" aria-label="Professional Qualities">
              {qualities.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#0f101b]/80 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 hover:translate-x-1 transition-all duration-200"
                    role="listitem"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 shadow-sm" aria-hidden="true">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
