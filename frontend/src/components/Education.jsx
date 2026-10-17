import React from 'react';
import { GraduationCap, BookOpen, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Education() {
  const educationItems = [
    {
      title: "Bachelor of Computer Applications (BCA)",
      period: "2023 – 2026",
      status: "Currently Pursuing (Final Year)",
      institution: "Undergraduate Degree Program",
      location: "Kerala, India",
      icon: GraduationCap,
      description: "Comprehensive coursework covering Computer Applications, Software Engineering, Object-Oriented Programming, and Database Systems.",
      keyTopics: [
        "Data Structures & Algorithms",
        "Database Management Systems (DBMS)",
        "Web Application Development",
        "Operating Systems & Networking Principles"
      ]
    },
    {
      title: "Personal Projects & Practical Learning",
      period: "Ongoing",
      status: "Self-Directed Practical Skill Building",
      institution: "Independent Developer Practice",
      location: "Kerala, India",
      icon: BookOpen,
      description: "Dedicated daily hands-on implementation of production-grade modern web applications and developer workflows.",
      keyTopics: [
        "React development & modern UI state management",
        "JavaScript (ES6+) asynchronous programming",
        "REST APIs & backend development with Node.js & Express",
        "MongoDB database modeling & Atlas cloud deployment",
        "Git version control & collaborative GitHub practices"
      ]
    }
  ];

  return (
    <section id="education" className="py-12 sm:py-16 relative" aria-label="Education and Growth">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Education & <span className="text-violet-400">Growth</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Academic qualifications and self-directed technical development
          </p>
        </div>

        {/* Vertical Timeline Card Container */}
        <div className="rounded-3xl bg-[#121321] border border-violet-500/15 p-7 sm:p-10 lg:p-12 shadow-2xl shadow-black/40">
          <div className="relative pl-6 sm:pl-10 border-l-2 border-violet-500/25 space-y-12">
            
            {educationItems.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div key={item.title} className="relative group">
                  {/* Timeline Glowing Node */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0b0c14] border-2 border-violet-500 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform duration-200">
                    <IconComp size={15} className="text-violet-400" />
                  </div>

                  {/* Timeline Content Card */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#0f101b]/80 border border-white/5 hover:border-violet-500/30 hover:bg-violet-950/15 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/40 border border-violet-500/30 text-violet-300 self-start sm:self-auto">
                        <Calendar size={13} aria-hidden="true" />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 mb-4">
                      <span className="font-medium text-slate-300">{item.institution}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-violet-400" />
                        {item.location}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">{item.status}</span>
                    </div>

                    <p className="text-sm text-slate-300/90 leading-relaxed mb-5">
                      {item.description}
                    </p>

                    {/* Topics Covered */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Curriculum & Core Focus:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {item.keyTopics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 size={14} className="text-violet-400 shrink-0" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}

