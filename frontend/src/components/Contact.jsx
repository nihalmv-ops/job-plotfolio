import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Contact() {
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
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters long.';
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({
          submitting: false,
          success: true,
          error: null
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Fallback message if server returns error
        throw new Error(data.message || 'Failed to send message. Please try again or email directly.');
      }
    } catch (err) {
      console.warn('API error (backend may be offline or in fallback):', err);
      // If backend API is not yet active or local development without backend running,
      // Provide an honest and helpful status
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Unable to reach the server. Please feel free to email me directly at nihalmv2004@gmail.com!'
      });
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 relative" aria-label="Contact Section">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        
        {/* Main Card */}
        <div className="rounded-3xl bg-[#121321] border border-violet-500/15 p-7 sm:p-10 lg:p-12 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 flex flex-col">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Get In <span className="text-violet-400">Touch</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-8">
                Have a project in mind or an opportunity to discuss? Feel free to send a message or connect through my social links.
              </p>

              {/* Status Alerts */}
              {formStatus.success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
                  <CheckCircle2 size={20} className="shrink-0" />
                  <span>Thank you! Your message has been sent successfully. I will get back to you soon.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
                  <AlertCircle size={20} className="shrink-0 text-rose-400" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Your Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0e0f1a] border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors ${
                      fieldErrors.name ? 'border-rose-500' : 'border-white/10 focus:border-violet-500'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-rose-400">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0e0f1a] border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors ${
                      fieldErrors.email ? 'border-rose-500' : 'border-white/10 focus:border-violet-500'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Message <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message, project idea, or inquiry here..."
                    disabled={formStatus.submitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0e0f1a] border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors resize-none ${
                      fieldErrors.message ? 'border-rose-500' : 'border-white/10 focus:border-violet-500'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-xs text-rose-400">{fieldErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed self-start mt-2"
                >
                  {formStatus.submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Contact Details Cards (Matching reference image) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Email */}
                  <a
                    href="mailto:nihalmv2004@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e0f1a]/80 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                        nihalmv2004@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/nihalmv-ops"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e0f1a]/80 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                      <GithubIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">GitHub</p>
                      <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                        github.com/nihalmv-ops
                      </p>
                    </div>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/nihal-mv-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e0f1a]/80 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                      <LinkedinIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">LinkedIn</p>
                      <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                        linkedin.com/in/nihal-mv-dev
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e0f1a]/80 border border-white/5">
                    <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                      <p className="text-sm font-medium text-white">
                        Kerala, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-8 p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-violet-300">Fast Response:</span> I actively check my inbox and typically respond within 24 hours.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
