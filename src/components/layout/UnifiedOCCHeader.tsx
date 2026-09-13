import React from 'react';
import {
  Train,
  Clock,
  Activity,
  Zap,
  ShieldCheck,
  Sparkles,
  Database,
  Construction,
  AlertTriangle,
  CheckCircle2,
  Satellite,
  Compass
} from 'lucide-react';

export interface UnifiedOCCHeaderProps {
  simulatedTime: string;
  mode: 'spatial_3d' | 'satellite' | 'real_track';
  onToggleMode: (mode: 'spatial_3d' | 'satellite' | 'real_track') => void;
  speedMultiplier: number;
  onSetSpeed: (speed: number) => void;
  blockActive: boolean;
  onToggleBlock: () => void;
  onOpenPlanner: () => void;
  onToggleWimt: () => void;
  isWimtOpen: boolean;
}

export const UnifiedOCCHeader: React.FC<UnifiedOCCHeaderProps> = ({
  simulatedTime,
  mode,
  onToggleMode,
  speedMultiplier,
  onSetSpeed,
  blockActive,
  onToggleBlock,
  onOpenPlanner,
  onToggleWimt,
  isWimtOpen
}) => {
  const speeds = [1, 2, 5, 10];

  return (
    <header className="w-full h-16 occ-header-glass px-4 lg:px-6 flex items-center justify-between gap-3 z-50 fixed top-0 inset-x-0 select-none text-slate-800">
      {/* 1. Left: Official Southern Railway MAS Division Branding */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-blue-600 shadow-sm">
          <Train className="w-5 h-5 text-blue-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full occ-badge-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5 font-mono">
              BLOCK<span className="text-blue-600">TRAIN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-sans font-bold">
                OCC TWIN 2.0
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 hidden sm:inline-block font-mono">| SIH26027</span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono leading-tight">
            <span className="text-emerald-600 font-bold">SOUTHERN RAILWAY</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-medium">CHENNAI DIVISION (MAS)</span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="text-slate-500 hidden md:inline">CGL ⇄ MAS (62.8 R-KM)</span>
          </p>
        </div>
      </div>

      {/* 2. Center: Live Operations Control Centre (OCC) Telemetry HUD (Bright Clean Pills) */}
      <div className="hidden xl:flex items-center gap-3 occ-pill-glass px-3.5 py-1.5 rounded-xl text-xs font-mono shadow-sm">
        {/* Master Clock */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 text-[10px] uppercase font-bold">IST:</span>
          <span className="font-bold text-slate-900 tracking-widest text-xs bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            {simulatedTime || '15:30:00'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Active Trains on Section */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-500 text-[10px] uppercase font-bold">RAKES:</span>
          <span className="font-bold text-emerald-700">7 Active</span>
        </div>

        {/* 25 kV AC OHE Status */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-slate-500 text-[10px] uppercase font-bold">OHE:</span>
          <span className="font-bold text-amber-700">25 kV AC</span>
        </div>

        {/* Signalling Status */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 text-[10px] uppercase font-bold">SIGNALLING:</span>
          <span className="font-bold text-blue-700">ABS / 4-ASPECT</span>
        </div>

        {/* Neon DB Status */}
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-slate-500 text-[10px] uppercase font-bold">DB:</span>
          <span className="font-bold text-indigo-700">NEON PG</span>
        </div>
      </div>

      {/* 3. Right: Consolidated Mission-Critical Action Suite (Bright Theme) */}
      <div className="flex items-center gap-2 shrink-0 font-mono">
        {/* Quick Block Simulation Button */}
        <button
          onClick={onToggleBlock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
            blockActive
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 ring-2 ring-red-400/40 occ-warning-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-900 shadow-xs'
          }`}
          title={blockActive ? 'Maintenance Block Active at TBM-CMP. Click to Restore Normal Flow.' : 'Inject Test Maintenance Block at TBM-CMP'}
        >
          <Construction className={`w-3.5 h-3.5 ${blockActive ? 'text-amber-300' : 'text-amber-600'}`} />
          <span className="hidden sm:inline">
            {blockActive ? 'BLOCK ACTIVE (TBM-CMP)' : 'SIMULATE BLOCK'}
          </span>
          {blockActive ? (
            <AlertTriangle className="w-3.5 h-3.5 text-white animate-bounce" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
        </button>

        {/* AI Block Planner Modal Trigger */}
        <button
          onClick={onOpenPlanner}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border border-blue-500 shadow-sm transition-all ring-1 ring-blue-400/30"
          title="Open AI Block Planning Engine (Neon DB + Google OR-Tools + Scikit-Learn)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden md:inline">AI Planner</span>
          <span className="px-1 py-0.2 rounded text-[9px] bg-white/20 font-sans font-black">CP-SAT</span>
        </button>

        {/* Where Is My Train Drawer Trigger */}
        <button
          onClick={onToggleWimt}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-xs ${
            isWimtOpen
              ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/30 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
          title="Open Indian Railways Live NTES Timetable & Running Status"
        >
          <Train className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden lg:inline">Where Is My Train</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* Display Mode Segmented Switcher (ThreeUI Enhanced) */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => onToggleMode('spatial_3d')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mode === 'spatial_3d'
                ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400/40'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="ThreeUI 3D WebGL Spatial Railway Digital Twin with Kavach TCAS Radar"
          >
            <Zap className={`w-3.5 h-3.5 ${mode === 'spatial_3d' ? 'text-cyan-300 animate-pulse' : 'text-blue-600'}`} />
            <span>3D Spatial Twin</span>
            <span className={`px-1 py-0.2 rounded text-[8px] font-mono ${
              mode === 'spatial_3d' ? 'bg-white/20 text-cyan-200' : 'bg-blue-100 text-blue-700'
            }`}>
              3D
            </span>
          </button>
          <button
            onClick={() => onToggleMode('satellite')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              mode === 'satellite'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="Satellite GIS View with Real Surveyed Railway Tracks"
          >
            <Satellite className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Satellite GIS</span>
          </button>
          <button
            onClick={() => onToggleMode('real_track')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              mode === 'real_track'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="Extracted Real-World Track Vector Geometry"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Track Twin</span>
          </button>
        </div>

        {/* Sim Speed Multiplier */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                speedMultiplier === s
                  ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
