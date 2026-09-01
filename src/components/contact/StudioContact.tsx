import React, { useState } from 'react';
import { Mail, Send, Copy, Check, Sparkles, CheckCircle2 } from 'lucide-react';

export const StudioContact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Product Design & Motion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const directEmail = 'lab@kinetic-ui.studio';

  const handleCopy = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COLLABORATION & STUDIO INQUIRIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Let&apos;s Build <span className="text-gradient-cyan">Kinetic Experiences</span>.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Available for flagship UI/UX product design, interactive web platforms, design systems engineering, and spatial motion advisory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 bg-white/95 space-y-5 shadow-xl shadow-slate-200/50">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Direct Studio Access
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We collaborate with high-growth startups, product teams, and venture-backed founders to ship world-class web experiences.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono text-slate-900 font-medium">{directEmail}</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-900 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Response velocity: Typically &lt;6 hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/60">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Transmitted</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We will review your product goals and connect with motion prototypes.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl text-xs font-mono bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-600">Your Name / Organization</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Chen, Design Lead"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-600">Work Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maya@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-600">Primary Objective</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-sans"
                  >
                    <option value="Product Design & Motion">Flagship Web Product Design & Kinetic Motion</option>
                    <option value="Stitch AI Design Tokens">Stitch AI & DESIGN.md Token System Architecture</option>
                    <option value="Full-Stack Engineering">High-Performance Full-Stack Engineering</option>
                    <option value="Spatial Advisory">Spatial UI/UX & WebGL Consultation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-600">Project Overview & Vision</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about what you want to create, your aesthetic vision, and timeline..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-xs bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-slate-900/15"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Studio Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};
