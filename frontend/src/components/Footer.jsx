import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="border-t border-white/5 py-10 bg-[#080910] relative" aria-label="Site Footer">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Copyright & Info */}
          <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-300">
              © 2026 Nihal MV. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Built with React, Tailwind CSS, Node.js, and Express.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com/nihalmv-ops"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"
              aria-label="GitHub profile"
            >
              <GithubIcon size={18} />
            </a>

            <a
              href="https://linkedin.com/in/nihal-mv-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon size={18} />
            </a>

            <a
              href="mailto:nihalmv2004@gmail.com"
              className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors"
              aria-label="Email Nihal MV"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-950/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 group"
            aria-label="Back to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>
      </div>
    </footer>
  );
}
