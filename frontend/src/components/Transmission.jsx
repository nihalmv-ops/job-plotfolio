import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ArrowUp, FileText } from 'lucide-react';
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
        error: 'Unable to reach the server. Please feel free to reach out directly at nihalmv2004@gmail.com!'
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between px-4 sm:px-6 md:px-16 pt-24 pb-12 z-20 border-t border-white/5"
      aria-label="Contact and Transmission"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header Line */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400">
              06 / TRANSMISSION & INQUIRY
            </span>
          </div>
          <span className="text-xs font-mono tracking-widest text-zinc-600">
            CONNECT.DIRECT.2026
          </span>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-md">
            <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-wider text-white mb-2">
              INITIATE CONTACT.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mb-8 leading-relaxed">
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div>
                <label htmlFor="name" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-2">
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
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors ${
                    fieldErrors.name ? 'border-rose-500' : 'border-white/10 focus:border-white/40'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-2">
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
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors ${
                    fieldErrors.email ? 'border-rose-500' : 'border-white/10 focus:border-white/40'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-2">
                  MESSAGE BODY *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your project, team opportunity, or inquiry..."
                  disabled={formStatus.submitting}
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-zinc-100 placeholder-zinc-600 text-sm font-sans focus:outline-none transition-colors resize-none ${
                    fieldErrors.message ? 'border-rose-500' : 'border-white/10 focus:border-white/40'
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{fieldErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={formStatus.submitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all self-start disabled:opacity-50"
              >
                {formStatus.submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <span>SEND TRANSMISSION</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Verified Details & Resume */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Email Direct */}
            <a
              href="mailto:nihalmv2004@gmail.com"
              className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  DIRECT EMAIL
                </span>
                <span className="text-sm font-mono text-zinc-200 group-hover:text-white transition-colors">
                  nihalmv2004@gmail.com
                </span>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/nihalmv-ops"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                <GithubIcon size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  GITHUB REPOSITORY
                </span>
                <span className="text-sm font-mono text-zinc-200 group-hover:text-white transition-colors">
                  github.com/nihalmv-ops
                </span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/nihal-mv-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                <LinkedinIcon size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  LINKEDIN NETWORK
                </span>
                <span className="text-sm font-mono text-zinc-200 group-hover:text-white transition-colors">
                  linkedin.com/in/nihal-mv-dev
                </span>
              </div>
            </a>

            {/* Location */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  BASE LOCATION
                </span>
                <span className="text-sm font-mono text-zinc-200">
                  Kerala, India
                </span>
              </div>
            </div>

            {/* Resume Download Action (Space only) */}
            <a
              href="/resume.pdf"
              download="Nihal_MV_Resume.pdf"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                    CURRICULUM VITAE
                  </span>
                  <span className="text-sm font-semibold text-white">
                    DOWNLOAD RESUME (PDF)
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                ↓
              </span>
            </a>
          </div>

        </div>

        {/* Aerion Signature Final Archive Section */}
        <div id="final" className="my-auto text-center flex flex-col items-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase">
              NIHAL MV ARCHIVE
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
              className="group px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95"
              aria-label="Replay 3D Experience"
            >
              <span>REPLAY EXPERIENCE</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Aerion Footer Line */}
        <footer className="w-full border-t border-white/10 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="text-zinc-200 font-bold tracking-widest">NIHAL MV</span>
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

