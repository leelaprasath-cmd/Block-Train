import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  X,
  ShieldCheck,
  Gauge,
  Zap,
  Users,
  Radio,
  AlertTriangle,
  Flame,
  Activity,
} from 'lucide-react';

export const TrainTelemetryModal: React.FC = () => {
  const { selectedTrain, selectTrain, triggerEmergencyBrake } = useRailwaySimulation();

  if (!selectedTrain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090e1a] border border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-slate-200">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wider">
                  TRAIN {selectedTrain.number} // {selectedTrain.name.toUpperCase()}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRIORITY {selectedTrain.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {selectedTrain.origin} ➔ {selectedTrain.destination}
              </p>
            </div>
          </div>

          <button
            onClick={() => selectTrain(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 space-y-6">
          {/* Top Gauges: Speedometer + Traction Power */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Speed Gauge */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" /> SPEEDOMETER
              </span>
              <div className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">
                {selectedTrain.currentSpeedKmh} <span className="text-xs text-slate-400 font-normal">KM/H</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(selectedTrain.currentSpeedKmh / selectedTrain.maxSpeedKmh) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1">CEILING: {selectedTrain.maxSpeedKmh} KM/H</span>
            </div>

            {/* Traction Power */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> TRACTION POWER
              </span>
              <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                {selectedTrain.tractionPowerKw} <span className="text-xs text-slate-400 font-normal">KW</span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                25KV AC Pantograph Engaged
              </span>
            </div>

            {/* Brake Cylinder Pressure */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> BRAKE PIPE
              </span>
              <div className="text-3xl font-extrabold text-rose-300 font-mono tracking-tight">
                {selectedTrain.brakePressureKgCm2} <span className="text-xs text-slate-400 font-normal">KG/CM²</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-3">Twin-Pipe Air Brake Pressure</span>
            </div>
          </div>

          {/* Kavach Anti-Collision Section */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">KAVACH TCAS TELEMETRY</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {selectedTrain.kavachStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Autonomous Braking & Signal Passed At Danger (SPAD) Prevention System Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">RADIO LINK:</span>
                <span className="text-cyan-300 font-bold">{selectedTrain.kavachSignalStrength}% UHF 433MHz</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SAFE BRAKE DIST:</span>
                <span className="text-emerald-300 font-bold">420 Meters</span>
              </div>
            </div>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">LOCO PILOT</span>
              <span className="text-white font-semibold block truncate">{selectedTrain.locoPilotName}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PASSENGERS</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Users className="w-3 h-3" /> {selectedTrain.passengerCount} ({selectedTrain.coaches} Coaches)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">NEXT ETA</span>
              <span className="text-amber-300 font-semibold">{selectedTrain.nextStationEta}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SCHEDULE DELAY</span>
              <span className={`font-semibold ${selectedTrain.delayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {selectedTrain.delayMinutes === 0 ? 'Right Time (0m)' : `+${selectedTrain.delayMinutes} min`}
              </span>
            </div>
          </div>

          {/* Emergency Intervention Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-sans">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              Direct Cab Dispatch Channel Armed
            </span>

            <button
              onClick={() => {
                triggerEmergencyBrake(selectedTrain.id);
                selectTrain(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <AlertTriangle className="w-4 h-4" />
              TRIP KAVACH EMERGENCY BRAKE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
