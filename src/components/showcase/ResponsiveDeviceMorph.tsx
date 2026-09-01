import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Play, Pause } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';

export const ResponsiveDeviceMorph: React.FC = () => {
  const { tokens } = useMotion();
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [autoMorph, setAutoMorph] = useState(false);

  React.useEffect(() => {
    if (!autoMorph) return;
    const viewports: ('desktop' | 'tablet' | 'mobile')[] = ['desktop', 'tablet', 'mobile'];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % viewports.length;
      setActiveViewport(viewports[currentIdx]);
    }, 2800);
    return () => clearInterval(interval);
  }, [autoMorph]);

  return (
    <div className="p-8 rounded-3xl glass-panel border border-slate-200 bg-white/95 space-y-6 shadow-xl shadow-slate-200/50">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h4 className="text-base font-bold text-slate-900">Live Viewport Morphing Simulator</h4>
          </div>
          <p className="text-xs text-slate-500">
            Click viewports below or enable auto-morph to watch the layout container smoothly adapt in real time.
          </p>
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
            <button
              onClick={() => { setActiveViewport('desktop'); setAutoMorph(false); }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeViewport === 'desktop' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => { setActiveViewport('tablet'); setAutoMorph(false); }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeViewport === 'tablet' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => { setActiveViewport('mobile'); setAutoMorph(false); }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeViewport === 'mobile' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={() => setAutoMorph(!autoMorph)}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 hover:text-slate-900 transition-colors"
            title="Toggle auto morph"
          >
            {autoMorph ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Morphing Stage */}
      <div className="bg-slate-50 p-4 sm:p-8 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[360px] overflow-hidden">
        
        <div
          className={`transition-all duration-700 ease-in-out bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 overflow-hidden ${
            activeViewport === 'desktop'
              ? 'w-full max-w-4xl'
              : activeViewport === 'tablet'
              ? 'w-[560px]'
              : 'w-[320px]'
          }`}
          style={{ borderRadius: `${tokens.borderRadius}px` }}
        >
          {/* Header inside mock app */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-900">RESPONSIVE CONTAINER</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {activeViewport} (
              {activeViewport === 'desktop' ? '1200px' : activeViewport === 'tablet' ? '768px' : '375px'})
            </span>
          </div>

          {/* Morphing Grid inside */}
          <div
            className={`grid gap-3 transition-all duration-500 ${
              activeViewport === 'desktop'
                ? 'grid-cols-3'
                : activeViewport === 'tablet'
                ? 'grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">ACTIVE USERS</div>
              <div className="text-lg font-bold font-mono text-slate-900">48,920</div>
              <div className="text-[10px] text-emerald-600 font-semibold font-mono">+12.4% vs last hour</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">RENDER LATENCY</div>
              <div className="text-lg font-bold font-mono text-slate-900">18.4ms</div>
              <div className="text-[10px] text-blue-600 font-semibold font-mono">p99 frame budget</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">TOKEN DRIFT</div>
              <div className="text-lg font-bold font-mono text-slate-900">0.00%</div>
              <div className="text-[10px] text-slate-500 font-mono">100% Synced</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono text-slate-700 flex items-center justify-between">
            <span className="truncate">Fluid Container Queries Active</span>
            <span className="text-blue-700 font-bold">Zero Layout Shift</span>
          </div>
        </div>

      </div>

    </div>
  );
};
