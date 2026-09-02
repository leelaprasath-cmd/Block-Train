import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  X,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const TrackBlockInspector: React.FC = () => {
  const { selectedTrack, selectTrack, toggleTrackBlock, setActiveView } = useRailwaySimulation();

  if (!selectedTrack) return null;

  const isBlocked = selectedTrack.status === 'MAINTENANCE_BLOCKED';

  return (
    <aside aria-label="Track Segment Inspector" className="absolute bottom-6 right-6 z-30 w-96 bg-[#0a0f1d]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-5 font-mono text-slate-200 animate-slideUp">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {selectedTrack.id}
            </h4>
            <span className="text-[11px] text-slate-400 font-sans">
              {selectedTrack.fromStationId} ⇄ {selectedTrack.toStationId} Corridor
            </span>
          </div>
        </div>

        <button
          onClick={() => selectTrack(null)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Line Classification:</span>
          <span className="text-blue-400 font-bold">{selectedTrack.lineType}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Section Length:</span>
          <span className="text-white">{selectedTrack.lengthKm} Kilometers</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Speed Ceiling:</span>
          <span className="text-emerald-400 font-bold">{selectedTrack.currentSpeedLimitKmh} km/h (Permissible: {selectedTrack.speedLimitKmh} km/h)</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-800/60">
          <span className="text-slate-400">Electrification / Signaling:</span>
          <span className="text-slate-300">25KV AC • Automatic Block</span>
        </div>

        <div className="flex justify-between py-1 items-center">
          <span className="text-slate-400">Current Block Status:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isBlocked
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {selectedTrack.status}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col gap-2">
        <button
          onClick={() => toggleTrackBlock(selectedTrack.id)}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            isBlocked
              ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          }`}
        >
          {isBlocked ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>REVOKE BLOCK & RESTORE LINE</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>INJECT TRACK MAINTENANCE BLOCK</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            selectTrack(null);
            setActiveView('PLANNER');
          }}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
        >
          <span>Plan AI Optimization in Scheduler</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>
    </aside>
  );
};
