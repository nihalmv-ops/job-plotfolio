import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, ImageIcon } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projects } from '../data/projects';
import TiltCard from './TiltCard';
import ScrollReveal from './ScrollReveal';

export default function Projects() {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="projects" className="py-16 sm:py-20 relative z-10" aria-label="Featured Projects">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                My <span className="text-violet-400">Projects</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Real-world web applications built with modern frontend and backend technologies
              </p>
            </div>

            <a
              href="https://github.com/nihalmv-ops"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors self-start sm:self-auto group"
            >
              <span>View All Projects</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </ScrollReveal>

        {/* 3 Project Cards in One Row on Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, idx) => {
            const hasImage = project.image && !imageErrors[project.id];

            return (
              <ScrollReveal key={project.id} delay={idx * 150}>
                <TiltCard className="h-full rounded-3xl" maxTilt={6}>
                  <article className="h-full rounded-3xl bg-[#121321]/90 backdrop-blur-md border border-violet-500/15 p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/25 transition-all duration-300 group">
                    <div>
                      {/* Dedicated Project Image Space */}
                      <div className="w-full h-48 rounded-2xl bg-[#151728] border border-white/5 relative overflow-hidden mb-6 flex items-center justify-center group-hover:border-violet-500/30 transition-colors">
                        {hasImage ? (
                          /* User's Project Image */
                          <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            onError={() => handleImageError(project.id)}
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          /* Clean, Minimalist Image Placeholder Slot for User */
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 border border-dashed border-violet-500/25 rounded-2xl bg-violet-950/10 text-center">
                            <div className="w-12 h-12 rounded-xl bg-violet-900/30 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-2.5 shadow-sm">
                              <ImageIcon size={22} aria-hidden="true" />
                            </div>
                            <span className="text-xs font-semibold text-slate-300">
                              Project Screenshot
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5">
                              Add your image here
                            </span>
                          </div>
                        )}

                        {/* Gradient overlay for contrast */}
                        {hasImage && (
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121321] via-transparent to-black/20 pointer-events-none" />
                        )}

                        {/* Category Pill Tag */}
                        <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-violet-300 border border-violet-500/30 z-10">
                          {project.badge}
                        </span>
                      </div>

                      {/* Project Details */}
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                        {project.title}
                      </h3>

                      {project.subtitle && (
                        <p className="text-xs font-semibold text-violet-400/90 mb-3">
                          {project.subtitle}
                        </p>
                      )}

                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-2 mb-8" aria-label="Technologies used">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-slate-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: Live Demo & GitHub */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-sm font-semibold">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors"
                          aria-label={`Open live demo for ${project.title}`}
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={15} aria-hidden="true" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors ml-auto"
                          aria-label={`Open GitHub repository for ${project.title}`}
                        >
                          <GithubIcon size={16} aria-hidden="true" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </article>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
