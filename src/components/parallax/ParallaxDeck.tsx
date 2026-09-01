import React from 'react';
import { Move, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { parallaxParadigms } from '../../data/motionShowcaseData';
import { useMotion } from '../../context/MotionContext';

export const ParallaxDeck: React.FC = () => {
  const { scrollY } = useMotion();

  return (
    <section id="parallax" className="py-28 px-4 sm:px-8 max-w-7xl mx-auto relative border-b border-slate-200/80">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 shadow-xs">
          <Move className="w-3.5 h-3.5" />
          <span>SPATIAL PARALLAX ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Multi-Plane <span className="text-gradient-cyan">Spatial Depth</span> & Velocity.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Asymmetrical scroll-speed interpolation simulating real optical depth across four foundational UI/UX paradigms.
        </p>
      </div>

      {/* Parallax Cards Grid with dynamic translateY offsets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {parallaxParadigms.map((item, index) => {
          // Asynchronous scroll parallax offset
          const parallaxOffset = (scrollY * item.depthRatio * 0.08) % 25;

          return (
            <div
              key={item.id}
              className="p-8 sm:p-9 rounded-3xl glass-panel-interactive border border-slate-200 bg-white/90 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-lg shadow-slate-200/50"
              style={{
                transform: `translateY(${index % 2 === 1 ? parallaxOffset : -parallaxOffset}px)`,
              }}
            >
              {/* Top Card Banner */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">DEPTH: {item.depthRatio * 10}x</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-blue-600 font-medium">
                  {item.headline}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100 relative z-10">
                {item.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Interactive Trigger */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 relative z-10">
                <span>Hardware Acceleration</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Inspect Paradigm</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
