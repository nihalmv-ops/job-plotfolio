import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ArrowUp, FileText, Move3d } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Transmission({ onReplay }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Unable to transmit message. Please try again or email directly.');
      }
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Unable to reach the server. Please feel free to reach out directly at nihalmv.dev@gmail.com!'
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full bg-transparent text-white flex flex-col justify-between px-6 sm:px-12 max-w-7xl mx-auto pt-24 pb-12 z-10 border-t border-zinc-800/60"
      aria-label="Contact and Transmission"
    >
      <div className="w-full">
        {/* Section Header Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 mb-8 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-300">
              BAY 06 // TRANSMISSION & INQUIRY
            </span>
          </div>
          <div className="inline-flex items-center gap-2 border border-zinc-700/60 px-3.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
              FRAME 06 // APEX PROTOCOL ACTIVE
            </span>
          </div>
        </div>

        {/* 2-Column Split: Left holds Form & Channels; Right is 100% Open to 3D Car */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 mb-20">
          
          {/* Left Column: Form + Direct Links */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl flex flex-col gap-6">
            
            {/* Contact Form Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 backdrop-blur-xl shadow-xl shadow-black">
              <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-white mb-2">
                INITIATE CONTACT.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mb-6 leading-relaxed">
                Have a fullstack opportunity, frontend role, or engineering project to discuss? Send an inquiry directly.
              </p>

              {formStatus.success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-mono">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Transmission successful. I will respond to your inquiry shortly.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs font-mono">
                  <AlertCircle size={18} className="shrink-0 text-rose-400" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/80 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors ${
                      fieldErrors.name ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-500'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@company.com"
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/80 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors ${
                      fieldErrors.email ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-500'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    MESSAGE BODY *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project, team opportunity, or inquiry..."
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-2.5 rounded-xl bg-black/80 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors resize-none ${
                      fieldErrors.message ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-500'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-black hover:bg-zinc-900 text-white font-semibold text-xs tracking-widest uppercase transition-all self-start disabled:opacity-50 cursor-pointer shadow-lg shadow-black border border-zinc-700 hover:border-zinc-500"
                >
                  {formStatus.submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND TRANSMISSION</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Direct Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="mailto:nihalmv.dev@gmail.com"
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 backdrop-blur-xl transition-all flex items-center gap-3 group shadow-lg shadow-black"
              >
                <div className="w-9 h-9 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                    EMAIL
                  </span>
                  <span className="text-xs font-mono text-zinc-200 group-hover:text-white transition-colors truncate block">
                    nihalmv.dev@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/nihalmv-ops"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 backdrop-blur-xl transition-all flex items-center gap-3 group shadow-lg shadow-black"
              >
                <div className="w-9 h-9 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                  <GithubIcon size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                    GITHUB
                  </span>
                  <span className="text-xs font-mono text-zinc-200 group-hover:text-white transition-colors truncate block">
                    nihalmv-ops
                  </span>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/nihal-mv-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 backdrop-blur-xl transition-all flex items-center gap-3 group shadow-lg shadow-black"
              >
                <div className="w-9 h-9 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                  <LinkedinIcon size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                    LINKEDIN
                  </span>
                  <span className="text-xs font-mono text-zinc-200 group-hover:text-white transition-colors truncate block">
                    nihal-mv-dev
                  </span>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-black">
                <div className="w-9 h-9 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                    LOCATION
                  </span>
                  <span className="text-xs font-mono text-zinc-200 truncate block">
                    Kerala, India
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Download Action */}
            <a
              href="/resume.pdf"
              download="Nihal_MV_Resume.pdf"
              className="p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 backdrop-blur-xl transition-all flex items-center justify-between group shadow-lg shadow-black"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <FileText size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                    CURRICULUM VITAE
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    DOWNLOAD RESUME (PDF)
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                ↓
              </span>
            </a>

          </div>

          {/* Right Column: 100% PURE 3D CAR ON STAGE - ZERO OVERLAYS! */}
          <div className="hidden lg:flex flex-col items-end justify-between w-full max-w-md h-[560px] pointer-events-none select-none">
            <div className="px-4 py-2 rounded-full bg-black/80 border border-zinc-800 backdrop-blur-md flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>STAGE 06 // APEX PROTOCOL UNVEILED</span>
            </div>

            <div className="space-y-2 text-right">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm text-[10px] font-mono tracking-widest text-zinc-400">
                FRAME 06 // GRAND FINALE SHOWCASE
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-zinc-800 backdrop-blur-sm flex items-center justify-end gap-2 text-[10px] font-mono text-zinc-400">
                <Move3d size={13} className="text-zinc-400 animate-pulse" />
                <span>DRAG TO ROTATE 360°</span>
              </div>
            </div>
          </div>

        </div>

        {/* Studio Final Archive Section */}
        <div id="final" className="text-center flex flex-col items-center pt-16 pb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/80 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-300 uppercase">
              GARAGE DETAILING STUDIO ARCHIVE
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extralight uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white leading-[0.88] drop-shadow-2xl">
            NIHAL MV
          </h2>

          <p className="text-base sm:text-xl md:text-2xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400 uppercase mt-4">
            THE ART OF CODE
          </p>

          <p className="mt-8 text-xs sm:text-sm md:text-base text-zinc-400 font-light tracking-wider max-w-md mx-auto">
            A study in fullstack architecture, user interfaces, and responsive web systems.
          </p>

          {/* Replay 3D Experience Button */}
          <div className="mt-12">
            <button
              onClick={() => {
                if (onReplay) {
                  onReplay();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="group px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-black hover:bg-zinc-900 text-white font-semibold text-xs uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-[0_0_35px_rgba(0,0,0,0.9)] border border-zinc-700 hover:border-zinc-500 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Replay 3D Experience"
            >
              <span>REPLAY EXPERIENCE</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Studio Footer Line */}
        <footer className="w-full border-t border-zinc-800/80 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-200 font-bold tracking-widest">NIHAL MV</span>
            <span>© 2026</span>
            <span>•</span>
            <span>MERN STACK ARCHITECTURE</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>THE ART OF CODE</span>
          </div>
        </footer>

      </div>
    </section>
  );
}
