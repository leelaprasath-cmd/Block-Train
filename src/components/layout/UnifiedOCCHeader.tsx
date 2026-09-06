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
  mode: 'satellite' | 'real_track';
  onToggleMode: (mode: 'satellite' | 'real_track') => void;
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
    <header className="w-full h-16 occ-header-glass px-4 lg:px-6 flex items-center justify-between gap-3 z-50 fixed top-0 inset-x-0 select-none text-slate-200">
      {/* 1. Left: Official Southern Railway MAS Division Branding */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-700/20 border border-blue-500/40 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <Train className="w-5 h-5 text-cyan-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full occ-badge-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 font-mono">
              BLOCK<span className="text-blue-400">TRAIN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-sans font-bold">
                OCC TWIN 2.0
              </span>
            </h1>
            <span className="text-[11px] text-slate-500 hidden sm:inline-block font-mono">| SIH26027</span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono leading-tight">
            <span className="text-emerald-400 font-bold">SOUTHERN RAILWAY</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">CHENNAI DIVISION (MAS)</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">CGL ⇄ MAS (62.8 R-KM)</span>
          </p>
        </div>
      </div>

      {/* 2. Center: Live Operations Control Centre (OCC) Telemetry HUD */}
      <div className="hidden xl:flex items-center gap-3 occ-pill-glass px-3.5 py-1.5 rounded-xl text-xs font-mono shadow-inner">
        {/* Master Clock */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[10px] uppercase font-bold">IST:</span>
          <span className="font-bold text-white tracking-widest text-xs bg-black/50 px-2 py-0.5 rounded border border-slate-800">
            {simulatedTime || '15:30:00'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Active Trains on Section */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 text-[10px] uppercase font-bold">RAKES:</span>
          <span className="font-bold text-emerald-300">7 Active</span>
        </div>

        {/* 25 kV AC OHE Status */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[10px] uppercase font-bold">OHE:</span>
          <span className="font-bold text-amber-300">25 kV AC</span>
        </div>

        {/* Signalling Status */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 text-[10px] uppercase font-bold">SIGNALLING:</span>
          <span className="font-bold text-blue-300">ABS / 4-ASPECT</span>
        </div>

        {/* Neon DB Status */}
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[10px] uppercase font-bold">DB:</span>
          <span className="font-bold text-cyan-300">NEON PG</span>
        </div>
      </div>

      {/* 3. Right: Consolidated Mission-Critical Action Suite */}
      <div className="flex items-center gap-2 shrink-0 font-mono">
        {/* Quick Block Simulation Button */}
        <button
          onClick={onToggleBlock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
            blockActive
              ? 'bg-red-600/90 hover:bg-red-500 text-white border-red-500 ring-2 ring-red-400/40 occ-warning-pulse'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
          }`}
          title={blockActive ? 'Maintenance Block Active at TBM-CMP. Click to Restore Normal Flow.' : 'Inject Test Maintenance Block at TBM-CMP'}
        >
          <Construction className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">
            {blockActive ? 'BLOCK ACTIVE (TBM-CMP)' : 'SIMULATE BLOCK'}
          </span>
          {blockActive ? (
            <AlertTriangle className="w-3.5 h-3.5 text-white animate-bounce" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </button>

        {/* AI Block Planner Modal Trigger */}
        <button
          onClick={onOpenPlanner}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/60 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all ring-1 ring-blue-400/30"
          title="Open AI Block Planning Engine (Neon DB + Google OR-Tools + Scikit-Learn)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden md:inline">AI Planner</span>
          <span className="px-1 py-0.2 rounded text-[9px] bg-white/20 font-sans font-black">CP-SAT</span>
        </button>

        {/* Where Is My Train Drawer Trigger */}
        <button
          onClick={onToggleWimt}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            isWimtOpen
              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/30 shadow-md'
              : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
          }`}
          title="Open Indian Railways Live NTES Timetable & Running Status"
        >
          <Train className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Where Is My Train</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Display Mode Segmented Switcher */}
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onToggleMode('satellite')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              mode === 'satellite'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Satellite GIS View with Real Surveyed Railway Tracks"
          >
            <Satellite className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Satellite GIS</span>
          </button>
          <button
            onClick={() => onToggleMode('real_track')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              mode === 'real_track'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Extracted Real-World Track Vector Geometry"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Track Twin</span>
          </button>
        </div>

        {/* Sim Speed Multiplier */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                speedMultiplier === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
