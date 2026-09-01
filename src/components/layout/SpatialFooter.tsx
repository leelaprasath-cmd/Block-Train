import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';

export const SpatialFooter: React.FC = () => {
  const { tokens } = useMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                KINETIC UI/UX LAB
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Advancing modern web design through spatial depth, 3D scroll physics, Stitch AI design token pipelines, and tactile micro-interactions.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-medium text-slate-700 uppercase tracking-wider">
              Lab Directory
            </div>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#pipeline" className="hover:text-blue-600 transition-colors">Scroll Pipeline</a></li>
              <li><a href="#parallax" className="hover:text-blue-600 transition-colors">Spatial Parallax Deck</a></li>
              <li><a href="#tactile-lab" className="hover:text-blue-600 transition-colors">Tactile Micro-UI</a></li>
              <li><a href="#products" className="hover:text-blue-600 transition-colors">Live Products</a></li>
              <li><a href="#tokens" className="hover:text-blue-600 transition-colors">Stitch AI Tokens</a></li>
            </ul>
          </div>

          {/* System Spec */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-medium text-slate-700 uppercase tracking-wider">
              Motion Architecture Specs
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-xs text-slate-600 shadow-2xs">
              <div className="flex justify-between items-center">
                <span>Spatial Engine:</span>
                <span className="text-blue-600 font-bold">CSS 3D Perspective</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Frame Rate Target:</span>
                <span className="text-emerald-600 font-bold">60.0 FPS</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stitch Tokens:</span>
                <span className="text-slate-900 font-bold">{tokens.borderRadius}px / {tokens.primaryHue}°</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} Kinetic UI/UX Lab. Engineered with strict TypeScript and WebGL acceleration.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors text-[11px] shadow-2xs text-slate-600"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </div>
    </footer>
  );
};
