import React, { useState } from 'react';
import { Layers, ArrowUpRight, Play, Pause } from 'lucide-react';
import { liveProductItems } from '../../data/motionShowcaseData';
import { ResponsiveDeviceMorph } from './ResponsiveDeviceMorph';
import { useMotion } from '../../context/MotionContext';

export const LiveProductsGallery: React.FC = () => {
  const { tokens } = useMotion();
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Live media player simulation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackProgress, setTrackProgress] = useState(42);

  // Fintech chart timeframe simulation
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');

  const currentItem = liveProductItems[activeItemIndex];

  return (
    <section id="products" className="py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80 space-y-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 shadow-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>INTERACTIVE REAL-WORLD PRODUCTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            High-Fidelity <span className="text-gradient-cyan">Product Interfaces</span>.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Clickable real-world applications showcasing complex UI states, high-density data visualizations, and interactive audio/visual workflows.
          </p>
        </div>

        {/* Product Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {liveProductItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveItemIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeItemIndex === idx
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Product Showcase Card */}
      <div
        className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-200 shadow-2xl space-y-8 bg-white/95"
        style={{ borderRadius: `${tokens.borderRadius * 1.5}px` }}
      >
        {/* Product Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-600 uppercase font-bold">{currentItem.type}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">60 FPS Render</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{currentItem.title}</h3>
            <p className="text-xs text-slate-500 max-w-xl">{currentItem.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {currentItem.metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
                <div className="text-[10px] font-mono text-slate-400">{m.label}</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive UI Sandbox */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 min-h-[320px] flex flex-col justify-between">
          
          {/* PRODUCT 1: Fintech Telemetry */}
          {activeItemIndex === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-slate-500">LIQUIDITY VOLUME (USD)</div>
                  <div className="text-3xl font-bold font-mono text-slate-900">$48,290,410.00</div>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 text-xs font-mono shadow-xs">
                  {(['1H', '24H', '7D', '30D'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        timeframe === tf ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Simulated Waveform */}
              <div className="h-32 flex items-end gap-2 border-b border-slate-200 pb-3">
                {[45, 60, 52, 78, 88, 95, 70, 85, 92, 100, 80, 94, 68, 85, 92, 105, 88, 96].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        idx === 15 ? 'bg-blue-600 shadow-md shadow-blue-500/25' : 'bg-blue-200/80 hover:bg-blue-400'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Timeframe: <strong>{timeframe}</strong></span>
                <span className="text-emerald-600 font-semibold">Sub-35ms WebSocket Flush</span>
              </div>
            </div>
          )}

          {/* PRODUCT 2: Spatial AI Workspace */}
          {activeItemIndex === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <span className="text-xs font-mono text-blue-600 font-bold">PROMPT NODE GRAPH</span>
                <span className="text-xs font-mono text-slate-500">Active Zoom: 1.0x</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-slate-900 space-y-1 shadow-xs">
                  <div className="text-[10px] text-blue-600 font-bold">NODE 01: INPUT</div>
                  <div className="font-bold text-slate-900">Natural Language Vibe</div>
                  <div className="text-[10px] text-slate-500">Stitch Prompt Spec</div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-slate-900 space-y-1 shadow-xs">
                  <div className="text-[10px] text-purple-600 font-bold">NODE 02: COMPILE</div>
                  <div className="font-bold text-slate-900">Token Generation</div>
                  <div className="text-[10px] text-slate-500">DESIGN.md AST Parser</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-900 space-y-1 shadow-xs">
                  <div className="text-[10px] text-emerald-600 font-bold">NODE 03: RENDER</div>
                  <div className="font-bold text-slate-900">60 FPS Hardware UI</div>
                  <div className="text-[10px] text-slate-500">Zero-Layout Shift React</div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-500 text-center">
                Interactive spatial canvas rendering with WebGL
              </div>
            </div>
          )}

          {/* PRODUCT 3: Spatial Media Player */}
          {activeItemIndex === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-blue-600 font-bold">NOW PLAYING</div>
                  <div className="text-xl font-bold text-slate-900">Spatial Frequency Modulation</div>
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Waveform Scrubber */}
              <div className="space-y-2">
                <div className="h-16 flex items-center gap-1 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  {[20, 35, 60, 80, 45, 75, 90, 100, 85, 60, 40, 70, 95, 80, 50, 65, 85, 100, 75, 45, 30, 55, 75, 90].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-full transition-all ${
                        (i / 24) * 100 <= trackProgress ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trackProgress}
                  onChange={(e) => setTrackProgress(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Buffer: 192 kHz Lossless</span>
                <span>Scrub: <strong>{trackProgress}%</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {currentItem.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {t}
              </span>
            ))}
          </div>

          <span className="text-xs font-mono text-blue-600 font-semibold flex items-center gap-1">
            <span>Production Verified</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>

      {/* Embedded Viewport Morphing Simulator */}
      <ResponsiveDeviceMorph />

    </section>
  );
};
