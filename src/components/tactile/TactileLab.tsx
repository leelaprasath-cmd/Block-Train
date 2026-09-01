import React, { useState } from 'react';
import { Sparkles, Move, Volume2, Flame, Layers } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { TiltCard } from './TiltCard';

export const TactileLab: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'haptic' | 'spring' | 'spatial'>('haptic');
  const [springStrength, setSpringStrength] = useState(72);
  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [magneticClicks, setMagneticClicks] = useState(0);

  const segments = [
    { id: 'haptic', label: 'Haptic Feedback' },
    { id: 'spring', label: 'Spring Dynamics' },
    { id: 'spatial', label: 'Spatial Lighting' },
  ];

  return (
    <section id="tactile-lab" className="py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-blue-600 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MICRO-INTERACTION PHYSICS LAB</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Tactile Physics & <span className="text-gradient-cyan">Kinetic Micro-UI</span>.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Interact with magnetic pull fields, specular 3D gyro tilt cards, and spring-damped segmented controls in real time.
        </p>
      </div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Magnetic Buttons & Spring Controls (Col 6) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Magnetic Physics Pull */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 bg-white/95 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-blue-600 font-bold uppercase">PHYSICS EXPERIMENT 01</span>
                <h3 className="text-xl font-bold text-slate-900">Magnetic Cursor Attraction</h3>
              </div>
              <Move className="w-5 h-5 text-blue-600" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hover near the button below. The element calculates cursor vector proximity and magnetically pulls towards the pointer with elastic damping.
            </p>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center min-h-[140px]">
              <MagneticButton
                onClick={() => setMagneticClicks((prev) => prev + 1)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95"
              >
                <Flame className="w-4 h-4 mr-2" />
                <span>Magnetic Trigger ({magneticClicks})</span>
              </MagneticButton>
            </div>
          </div>

          {/* Card 2: Fluid Segmented Control & Springs */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 bg-white/95 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-blue-600 font-bold uppercase">PHYSICS EXPERIMENT 02</span>
                <h3 className="text-xl font-bold text-slate-900">Fluid Segmented Spring Pill</h3>
              </div>
              <Layers className="w-5 h-5 text-blue-600" />
            </div>

            {/* Segmented Pill Selector */}
            <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-3 gap-1 relative">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id as any)}
                  className={`py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    activeSegment === seg.id
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>

            {/* Spring Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Spring Damping Coefficient</span>
                <span className="text-blue-600 font-bold">{springStrength}%</span>
              </div>
              <input
                type="range"
                value={springStrength}
                onChange={(e) => setSpringStrength(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Haptic Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono text-slate-700">Auditory Waveform Simulation</span>
              </div>
              <button
                onClick={() => setToggleSwitch(!toggleSwitch)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  toggleSwitch ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Holographic Tilt Cards (Col 6) */}
        <div className="lg:col-span-6 space-y-6">
          <TiltCard
            title="Holographic Specular Elevation"
            subtitle="Real-time light refraction calculation based on pointer angle"
            metric="$2,489,100"
            badge="OPTICAL REFLECTION"
          />

          <TiltCard
            title="Spatial Telemetry Node"
            subtitle="Sub-pixel 3D matrix transform with persistent 60 FPS hardware acceleration"
            metric="0.000 CLS"
            badge="DETERMINISTIC RENDERING"
          />
        </div>

      </div>

    </section>
  );
};
