import React, { useState } from 'react';
import { Sparkles, Sliders, Menu, X, ArrowUpRight } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';

interface MinimalNavProps {
  onOpenTokenDrawer: () => void;
}

export const MinimalNav: React.FC<MinimalNavProps> = ({ onOpenTokenDrawer }) => {
  const { scrollProgress, scrollVelocity } = useMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Ambient Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-slate-200 z-50 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 transition-all duration-100 ease-out"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* Floating Header Navigation */}
      <header className="fixed top-3 left-0 right-0 z-40 px-4 sm:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl glass-panel shadow-lg shadow-slate-200/60 border-slate-200/80 backdrop-blur-2xl">
          
          {/* Brand Mark */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 font-sans">
                KINETIC
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-bold">
                UI/UX LAB
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-xs text-slate-600">
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">
              Scroll Pipeline
            </a>
            <a href="#parallax" className="hover:text-blue-600 transition-colors">
              Spatial Parallax
            </a>
            <a href="#tactile-lab" className="hover:text-blue-600 transition-colors">
              Tactile Micro-UI
            </a>
            <a href="#products" className="hover:text-blue-600 transition-colors">
              Live Product UIs
            </a>
            <a href="#tokens" className="hover:text-blue-600 transition-colors">
              Stitch Tokens
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Scroll Metric Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
              <span className="text-slate-400">Scroll:</span>
              <span className="text-blue-600 font-bold">{Math.round(scrollProgress * 100)}%</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{Math.round(scrollVelocity)} v/s</span>
            </div>

            {/* Stitch Token Trigger */}
            <button
              onClick={onOpenTokenDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
              title="Open Live Stitch AI Token Engine"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline font-medium">Design Tokens</span>
            </button>

            {/* Contact Link */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              <span>Explore Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-md mx-auto rounded-2xl glass-panel p-4 border border-slate-200 shadow-xl flex flex-col gap-2 bg-white">
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-800"
            >
              Scroll Pipeline
            </a>
            <a
              href="#parallax"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-800"
            >
              Spatial Parallax
            </a>
            <a
              href="#tactile-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-800"
            >
              Tactile Micro-UI
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-800"
            >
              Live Product UIs
            </a>
            <a
              href="#tokens"
              onClick={() => { setMobileMenuOpen(false); onOpenTokenDrawer(); }}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-800"
            >
              Stitch Design Tokens
            </a>
          </div>
        )}
      </header>
    </>
  );
};
