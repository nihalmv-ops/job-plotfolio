import React, { useState, useEffect } from 'react';
import { Download, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c14]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg p-1"
          aria-label="Nihal MV - Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform duration-200">
            <span className="font-extrabold text-white text-xl">N</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Nihal <span className="text-violet-400">Mv</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <ul className="flex items-center gap-7 list-none">
            {navItems.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <li key={item.name} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-sm font-medium py-2 transition-colors duration-200 ${
                      isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Download CV Button */}
        <div className="hidden md:block">
          <a
            href="/resume.pdf"
            download="Nihal_MV_Resume.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            aria-label="Download Nihal MV Resume PDF"
          >
            <Download size={15} aria-hidden="true" />
            <span>Download CV</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white border border-white/10 hover:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 bg-[#0e0f1a]/98 backdrop-blur-xl border-b border-violet-900/30 px-6 py-6 shadow-2xl transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <ul className="flex flex-col gap-3 mb-6 list-none">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block py-2 text-base border-b border-white/5 transition-colors ${
                    isActive ? 'text-violet-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="/resume.pdf"
          download="Nihal_MV_Resume.pdf"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-600/30"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Download size={16} aria-hidden="true" />
          <span>Download CV</span>
        </a>
      </div>
    </header>
  );
}
