import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Sliders, Play, Pause, Layers } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';

interface SpatialHeroProps {
  onOpenTokenDrawer: () => void;
}

export const SpatialHero: React.FC<SpatialHeroProps> = ({ onOpenTokenDrawer }) => {
  const { scrollY, tokens } = useMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [liveMetric, setLiveMetric] = useState(148200);
  const [activeSegment, setActiveSegment] = useState<'realtime' | 'mesh' | 'tokens'>('realtime');

  // Compute 3D perspective rotation based on scroll position (0 to 500px)
  const scrollFactor = Math.min(Math.max(scrollY / 500, 0), 1);
  const rotateX = (1 - scrollFactor) * 22; // 22deg -> 0deg
  const rotateY = (1 - scrollFactor) * -8;  // -8deg -> 0deg
  const scale = 0.90 + scrollFactor * 0.10; // 0.90 -> 1.00
  const translateY = (1 - scrollFactor) * 40; // 40px -> 0px
  const specularOpacity = 0.6 - scrollFactor * 0.3;

  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      setLiveMetric((prev) => prev + Math.floor(Math.random() * 8) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveStream]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[140vh] pt-32 pb-24 px-4 sm:px-8 flex flex-col items-center justify-start bg-kinetic-grid overflow-hidden border-b border-slate-200/80"
    >
      {/* Dynamic Cursor Light Spot in Bright Mode */}
      <div
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x || 600}px ${mousePos.y || 400}px, rgba(37, 99, 235, 0.08), transparent 80%)`,
        }}
      />

      {/* Top Ambient Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-blue-400/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Headline & Value Statement */}
      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 pt-4 pb-12">
        
        {/* Lab Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-xs font-mono text-slate-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>KINETIC MOTION & UI/UX CAPABILITIES ENGINE</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-bold">60 FPS Hardware Physics</span>
        </div>

        {/* Main Kinetic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900">
          Physicality, Motion & <br />
          <span className="text-gradient-cyan">Spatial Depth</span> in Modern Web.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          An interactive laboratory showcasing hyper-realistic scroll animations, 3D viewport perspective morphing, Stitch AI design token pipelines, and tactile micro-interactions.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/15 active:scale-95"
          >
            <ArrowDown className="w-4 h-4" />
            <span>Scroll to Unfold 3D Viewport</span>
          </a>

          <button
            onClick={onOpenTokenDrawer}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-xs glass-panel text-slate-800 hover:text-blue-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Test Stitch AI Tokens</span>
          </button>
        </div>

        {/* Scroll Prompt Notice */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          <span>Scroll down to see the 3D canvas rotate, unroll, and snap into full focus</span>
        </div>

      </div>

      {/* 3D Spatial Device Viewport (Scroll-Driven Transform) */}
      <div className="w-full max-w-5xl mx-auto perspective-1200 relative z-20 mt-4">
        
        <div
          className="w-full rounded-3xl glass-panel border border-slate-200/90 shadow-2xl overflow-hidden bg-white/95 transition-transform duration-100 ease-out preserve-3d"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            boxShadow: `0 30px 60px -15px rgba(15, 23, 42, 0.12), 0 0 ${30 * scrollFactor}px rgba(37, 99, 235, 0.15)`,
          }}
        >
          {/* Specular Glare Overlay Layer */}
          <div
            className="absolute inset-0 pointer-events-none specular-glare transition-opacity duration-300 z-30"
            style={{ opacity: specularOpacity }}
          />

          {/* Viewport Top Header Chrome */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-600 flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>kinetic-canvas://viewport-3d</span>
              </div>
            </div>

            {/* Segment Controls */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setActiveSegment('realtime')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeSegment === 'realtime' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => setActiveSegment('mesh')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeSegment === 'mesh' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                3D Mesh
              </button>
              <button
                onClick={() => setActiveSegment('tokens')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeSegment === 'tokens' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tokens
              </button>
            </div>
          </div>

          {/* Viewport Interactive Surface */}
          <div className="p-6 sm:p-8 min-h-[380px] bg-white relative z-20 space-y-6">
            
            {/* Top Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-1 group hover:border-blue-400/80 transition-colors shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>LIVE REQ THROUGHPUT</span>
                  <button
                    onClick={() => setIsLiveStream(!isLiveStream)}
                    className="text-slate-400 hover:text-slate-900 p-1"
                    title="Toggle stream"
                  >
                    {isLiveStream ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
                  <span>{liveMetric.toLocaleString()}</span>
                  <span className="text-xs text-emerald-600 font-sans font-semibold">+18.4%</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">60 FPS RAF Batching</div>
              </div>

              <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>3D VIEWPORT ROTATION</span>
                  <span className="text-blue-600 font-bold font-mono">
                    {Math.round(rotateX)}°X {Math.round(rotateY)}°Y
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  Scale {(scale * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] font-mono text-emerald-600 font-semibold">GPU Hardware Accelerated</div>
              </div>

              <div className="p-4 rounded-custom bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>STITCH DESIGN TOKENS</span>
                  <span className="text-blue-600 font-bold font-mono">LIVE</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {tokens.borderRadius}px Radius
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Primary Hue: {tokens.primaryHue}°
                </div>
              </div>

            </div>

            {/* Interactive Kinetic Graph Canvas */}
            <div className="p-5 rounded-custom bg-slate-50/80 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-800 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Kinetic Waveform & Spectral Telemetry</span>
                </span>
                <span className="text-emerald-600 font-bold">Sub-35ms INP</span>
              </div>

              {/* Dynamic Bar Spectrum */}
              <div className="h-28 flex items-end gap-1.5 pt-2 border-b border-slate-200 pb-2">
                {[35, 52, 68, 48, 85, 92, 76, 95, 88, 100, 82, 94, 60, 78, 90, 84, 96, 70, 85, 92, 100, 88].map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${val}%` }}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      idx === 20 ? 'bg-blue-600 shadow-md shadow-blue-500/30' : 'bg-blue-200/80 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Rendering Mode: Direct WebGL Composite</span>
                <span className="text-blue-600 font-medium">Scroll down to continue pipeline</span>
              </div>
            </div>

          </div>

          {/* Viewport Bottom Chrome */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>3D Perspective Matrix active</span>
            </div>
            <span>Scroll Progress: {Math.round(scrollFactor * 100)}%</span>
          </div>

        </div>

      </div>
    </section>
  );
};
