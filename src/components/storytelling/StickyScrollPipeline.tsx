import React, { useState, useEffect, useRef } from 'react';
import { Layers, Sparkles, CheckCircle2, Check } from 'lucide-react';
import { stickyPipelineStages } from '../../data/motionShowcaseData';
import { useMotion } from '../../context/MotionContext';

export const StickyScrollPipeline: React.FC = () => {
  const { tokens } = useMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Micro-interaction test state inside stage 2/3
  const [toggleState, setToggleState] = useState(true);
  const [sliderValue, setSliderValue] = useState(65);
  const [clickCount, setClickCount] = useState(12);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / containerHeight, 0), 0.999);
      const stage = Math.floor(progress * 4);
      setActiveStageIndex(stage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStage = stickyPipelineStages[activeStageIndex] || stickyPipelineStages[0];

  return (
    <section
      id="pipeline"
      ref={containerRef}
      className="relative min-h-[380vh] bg-slate-50 border-b border-slate-200/80"
    >
      {/* Sticky Container Viewport */}
      <div className="sticky top-0 min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        
        {/* Background Ambient Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-blue-500/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Narrative Story Progression (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 shadow-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>SCROLL-LINKED STORYTELLING</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-blue-600 font-bold tracking-widest uppercase">
                {currentStage.tag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {currentStage.title}
              </h2>
              <p className="text-xs font-mono text-slate-600 font-medium pt-1">
                {currentStage.subtitle}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {currentStage.description}
              </p>
            </div>

            {/* Capability Pill */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-xs font-mono text-slate-700">
                <span className="text-slate-400">Capability: </span>
                <span className="text-slate-900 font-semibold">{currentStage.keyCapability}</span>
              </div>
            </div>

            {/* Stage Step Progress Indicator Pills */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {stickyPipelineStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    activeStageIndex === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400">0{idx + 1}</div>
                  <div className={`text-xs font-bold truncate mt-0.5 ${activeStageIndex === idx ? 'text-blue-600' : 'text-slate-600'}`}>
                    {stage.stateLabel.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Morphing Component Canvas (Col 7) */}
          <div className="lg:col-span-7 relative">
            
            {/* Morphing Card Wrapper */}
            <div
              className={`w-full rounded-3xl transition-all duration-500 ease-out overflow-hidden shadow-xl ${
                activeStageIndex === 0
                  ? 'border-2 border-dashed border-sky-400 bg-sky-50/60 p-8 wireframe-grid'
                  : activeStageIndex === 1
                  ? 'border border-blue-200 bg-white p-8 shadow-md'
                  : activeStageIndex === 2
                  ? 'border border-sky-300 bg-white p-8 shadow-lg shadow-blue-500/10'
                  : 'glass-panel border-slate-200/90 p-8 shadow-2xl backdrop-blur-3xl bg-white/95'
              }`}
              style={{
                borderRadius: activeStageIndex === 0 ? '4px' : `${tokens.borderRadius}px`,
              }}
            >
              
              {/* Header inside Morphing Component */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    activeStageIndex === 0
                      ? 'border border-dashed border-blue-500 text-blue-600 bg-white'
                      : 'bg-primary text-white shadow-md'
                  }`}>
                    UI
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Dynamic Telemetry Node</h4>
                    <div className="text-xs font-mono text-slate-500">STATE: {currentStage.stateLabel}</div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  activeStageIndex === 0
                    ? 'border border-dashed border-blue-400 text-blue-600 bg-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeStageIndex === 0 ? 'SKELETON' : 'LIVE COMPONENT'}
                </span>
              </div>

              {/* Dynamic Body Evolution based on Stage */}
              <div className="space-y-6">
                
                {/* STAGE 0: Wireframe Blueprint */}
                {activeStageIndex === 0 && (
                  <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
                    <div className="p-4 border border-dashed border-blue-400 rounded bg-white/80 space-y-2">
                      <div className="flex justify-between text-blue-600">
                        <span>&lt;Container flex-row gap-4&gt;</span>
                        <span>w: 100% • h: auto</span>
                      </div>
                      <div className="h-4 bg-blue-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-blue-100 rounded w-1/2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-dashed border-blue-300 rounded h-16 flex items-center justify-center text-blue-600 bg-white/60">
                        [ Metric Card 01 Skeleton ]
                      </div>
                      <div className="p-3 border border-dashed border-blue-300 rounded h-16 flex items-center justify-center text-blue-600 bg-white/60">
                        [ Metric Card 02 Skeleton ]
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 1: Stitch Token Ingestion */}
                {activeStageIndex === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 shadow-2xs">
                      <div className="text-blue-600 font-bold">// Stitch AI Design Tokens Mapping</div>
                      <div>--color-primary: <span className="text-blue-600 font-bold">hsl({tokens.primaryHue}, 83%, 53%)</span></div>
                      <div>--border-radius: <span className="text-slate-900 font-bold">{tokens.borderRadius}px</span></div>
                      <div>--font-sans: <span className="text-slate-900">"Plus Jakarta Sans"</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-custom bg-blue-50 border border-blue-200 text-slate-900 font-mono text-xs shadow-2xs">
                        <div className="text-[10px] text-blue-600 font-semibold">PRIMARY HUE</div>
                        <div className="text-base font-bold text-blue-900 mt-1">{tokens.primaryHue}°</div>
                      </div>
                      <div className="p-3.5 rounded-custom bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs shadow-2xs">
                        <div className="text-[10px] text-slate-500 font-semibold">CORNER RADIUS</div>
                        <div className="text-base font-bold text-slate-900 mt-1">{tokens.borderRadius}px</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 2: Micro-Interactions & Physics */}
                {activeStageIndex === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-800 font-bold">PHYSICS LEVER TRIGGER</span>
                        <button
                          onClick={() => setToggleState(!toggleState)}
                          className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                            toggleState ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-slate-600">
                          <span>Spring Force</span>
                          <span className="text-blue-600 font-bold">{sliderValue}%</span>
                        </div>
                        <input
                          type="range"
                          value={sliderValue}
                          onChange={(e) => setSliderValue(Number(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setClickCount((prev) => prev + 1)}
                      className="w-full py-3 rounded-custom bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold text-xs active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Test Kinetic Spring Click ({clickCount})</span>
                    </button>
                  </div>
                )}

                {/* STAGE 3: Production Spatial Glassmorphism */}
                {activeStageIndex === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500">SYSTEM VELOCITY</div>
                        <div className="text-xl font-bold font-mono text-slate-900">2.4M req/s</div>
                        <div className="text-[10px] font-mono text-emerald-600 font-semibold">Sub-35ms Latency</div>
                      </div>

                      <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500">LIGHTHOUSE SCORE</div>
                        <div className="text-xl font-bold font-mono text-slate-900">100 / 100</div>
                        <div className="text-[10px] font-mono text-blue-600 font-semibold">Zero Jank 60 FPS</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-custom bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono text-emerald-700">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>High-Fidelity Production Ready</span>
                      </span>
                      <span className="font-bold">WCAG AAA</span>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
