import React from 'react';
import { ExternalLink, ShoppingBag, BarChart3, Store, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { projects } from '../data/projects';

export default function Projects() {
  const getProjectIcon = (type) => {
    switch (type) {
      case 'shopping-bag':
        return <ShoppingBag className="w-12 h-12 text-violet-400" />;
      case 'chart':
        return <BarChart3 className="w-12 h-12 text-violet-400" />;
      case 'ai-cart':
        return <Store className="w-12 h-12 text-violet-400" />;
      default:
        return <ShoppingBag className="w-12 h-12 text-violet-400" />;
    }
  };

  return (
    <section id="projects" className="py-12 sm:py-16 relative" aria-label="Featured Projects">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
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

        {/* 3 Project Cards in One Row on Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-3xl bg-[#121321] border border-violet-500/15 p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-violet-500/35 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/20 transition-all duration-300 group"
            >
              <div>
                {/* Visual Thumbnail Area matching reference image */}
                <div className="w-full h-44 rounded-2xl bg-[#191a2e]/60 border border-white/5 flex items-center justify-center relative overflow-hidden mb-6 group-hover:border-violet-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-purple-600/10 opacity-70" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-md text-violet-300 border border-violet-500/20">
                    {project.badge}
                  </span>

                  {/* Centered Graphic Icon */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-900/20 group-hover:scale-110 transition-transform duration-300">
                    {getProjectIcon(project.iconType)}
                  </div>
                </div>

                {/* Project Details */}
                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-violet-300 transition-colors">
                  {project.title}
                </h3>

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
          ))}
        </div>

      </div>
    </section>
  );
}
