import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  Play,
  Pause,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Zap,
  RotateCcw,
  Train,
  Clock,
  Activity,
} from 'lucide-react';

export const CommandHeader: React.FC = () => {
  const {
    isRunning,
    speedMultiplier,
    simulatedTime,
    trains,
    maintenanceBlocks,
    audioChatterEnabled,
    activeEmergencyBrake,
    toggleSimulation,
    setSpeedMultiplier,
    toggleAudioChatter,
    triggerEmergencyBrake,
    resetEmergencyBrake,
  } = useRailwaySimulation();

  const activeBlockCount = maintenanceBlocks.filter(b => b.status === 'ACTIVE').length;

  return (
    <header className="w-full bg-[#0a0f1d] border-b border-slate-800/80 px-4 lg:px-6 py-3 select-none flex flex-wrap items-center justify-between gap-4 z-40 relative">
      {/* Brand & Division Info */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Train className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-wider text-white flex items-center gap-2 font-mono">
              BLOCKTRAIN <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-sans">TWIN 2.0</span>
            </h1>
            <span className="text-xs text-slate-500 hidden sm:inline-block font-mono">| SIH26027</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <span className="text-emerald-400 font-semibold">SOUTHERN RAILWAY</span>
            <span>•</span>
            <span>CHENNAI SUBURBAN CORRIDOR (TBM ⇄ MAS)</span>
          </p>
        </div>
      </div>

      {/* Center Live Telemetry Strip */}
      <div className="hidden xl:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs shadow-inner">
        {/* Master Clock */}
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-500 text-[10px] uppercase">DIV CLOCK:</span>
          <span className="font-bold text-white tracking-widest text-sm bg-black/40 px-1.5 py-0.5 rounded border border-slate-800">
            {simulatedTime} <span className="text-[10px] text-slate-400 font-normal">IST</span>
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Active Trains */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 text-[11px]">ACTIVE RAKES:</span>
          <span className="font-bold text-emerald-300">{trains.length} Units</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Punctuality Index */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px]">PUNCTUALITY:</span>
          <span className="font-bold text-amber-300">99.4%</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Active Blocks */}
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400 text-[11px]">BLOCKS:</span>
          <span className={`font-bold ${activeBlockCount > 0 ? 'text-orange-300' : 'text-slate-400'}`}>
            {activeBlockCount} Active
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Kavach Anti-Collision Status */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[11px]">KAVACH:</span>
          <span className="text-cyan-300 font-bold flex items-center gap-1">
            ARMED
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Simulation Controls & Emergency SOS */}
      <div className="flex items-center gap-2.5">
        {/* Play / Pause */}
        <button
          onClick={toggleSimulation}
          title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
        </button>

        {/* Speed Multiplier Pills */}
        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
          {[1, 5, 10, 50].map(speed => (
            <button
              key={speed}
              onClick={() => setSpeedMultiplier(speed)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                speedMultiplier === speed
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Radio Audio Chatter Toggle */}
        <button
          onClick={toggleAudioChatter}
          title={audioChatterEnabled ? 'Mute Radio Audio Chatter' : 'Enable Radio Audio Chatter'}
          className={`p-2 rounded-lg border transition-all ${
            audioChatterEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* SOS Emergency Brake */}
        {activeEmergencyBrake ? (
          <button
            onClick={resetEmergencyBrake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all animate-pulse"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET KAVACH</span>
          </button>
        ) : (
          <button
            onClick={() => triggerEmergencyBrake()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-mono text-xs font-bold border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">EMERGENCY BRAKE</span>
            <span className="sm:hidden">SOS</span>
          </button>
        )}
      </div>
    </header>
  );
};
