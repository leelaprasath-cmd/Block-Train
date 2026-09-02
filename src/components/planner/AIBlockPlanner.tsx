import React, { useState } from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import { MaintenanceBlock } from '../../types/railway';
import {
  CalendarCheck,
  Zap,
  Sparkles,
  Clock,
  Wrench,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AIBlockPlanner: React.FC = () => {
  const {
    maintenanceBlocks,
    tracks,
    approveBlock,
    createMaintenanceBlock,
    setActiveView,
    simulatedTime,
  } = useRailwaySimulation();

  // Form state
  const [selectedTrackId, setSelectedTrackId] = useState<string>('TRK-TBM-CMP-DN');
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceBlock['maintenanceType']>('OHE_CATENARY');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [gangName, setGangName] = useState<string>('Gang 14 - Electrical OHE Wing');
  const [supervisor, setSupervisor] = useState<string>('A. Dhanasekaran (SSE/OHE)');

  // AI evaluation preview state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    optimalStartTime: string;
    optimalEndTime: string;
    delayImpactMinutes: number;
    delaySavedMinutes: number;
    confidenceScore: number;
    recommendedDivert: string;
    affectedTrains: string[];
  } | null>(null);

  const [authorizedSuccess, setAuthorizedSuccess] = useState<boolean>(false);

  // Trigger AI evaluation
  const handleEvaluateAI = () => {
    setIsEvaluating(true);
    setAuthorizedSuccess(false);

    setTimeout(() => {
      setIsEvaluating(false);
      setAiResult({
        optimalStartTime: '15:30',
        optimalEndTime: '17:00',
        delayImpactMinutes: 3.4,
        delaySavedMinutes: 16.8,
        confidenceScore: 96.8,
        recommendedDivert: 'Dynamic single-line working on Up Main; routing suburban EMUs via Platform 3 loop.',
        affectedTrains: ['TRN-40012 (Suburban)', 'TRN-12638 (Pandian SF)'],
      });
    }, 600);
  };

  // Authorize & Commit block
  const handleAuthorizeBlock = () => {
    if (!aiResult) return;

    const track = tracks.find(t => t.id === selectedTrackId);
    if (!track) return;

    createMaintenanceBlock({
      sectionTrackId: selectedTrackId,
      fromStation: track.fromStationId,
      toStation: track.toStationId,
      lineName: `${track.lineType} (${track.id})`,
      maintenanceType,
      startTime: aiResult.optimalStartTime,
      endTime: aiResult.optimalEndTime,
      durationMinutes,
      requestedByGang: gangName,
      supervisorName: supervisor,
      speedRestrictionKmh: 45,
      alternateRouteSuggested: aiResult.recommendedDivert,
      delayImpactMinutes: aiResult.delayImpactMinutes,
    });

    setAuthorizedSuccess(true);
    setTimeout(() => {
      setActiveView('MAP');
    }, 1500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
      {/* View Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AI MAINTENANCE BLOCK PLANNER // CASCADING DELAY SOLVER
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Ministry of Railways SIH26027 Decision-Support System: Automated multi-constraint track closure optimization, conflict resolution, and dynamic re-routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500 mr-2">CURRENT CORRIDOR CLOCK:</span>
              <span className="text-cyan-300 font-bold">{simulatedTime} IST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Block Request & AI Engine Evaluator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-blue-400" />
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              1. Request Maintenance Block Slot
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {/* Track Selection */}
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">TARGET SECTION TRACK:</label>
                <select
                  value={selectedTrackId}
                  onChange={e => setSelectedTrackId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {tracks.map(trk => (
                    <option key={trk.id} value={trk.id}>
                      {trk.id} ({trk.fromStationId} ⇄ {trk.toStationId} • {trk.lineType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Maintenance Activity */}
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">MAINTENANCE CATEGORY:</label>
                <select
                  value={maintenanceType}
                  onChange={e => setMaintenanceType(e.target.value as MaintenanceBlock['maintenanceType'])}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="OHE_CATENARY">OHE Catenary & Pantograph Overhaul</option>
                  <option value="TRACK_TAMPING">Deep Ballast Screening & Track Tamping</option>
                  <option value="SIGNAL_UPGRADE">Signal Interlocking & Point Machine Calibration</option>
                  <option value="RAIL_FRACTURE">Emergency Rail Fracture Rectification</option>
                  <option value="BRIDGE_INSPECTION">Bridge Girder & Ultrasonic Testing</option>
                </select>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">REQUESTED DURATION:</span>
                  <span className="text-cyan-300 font-bold">{durationMinutes} Minutes ({+(durationMinutes / 60).toFixed(1)} hrs)</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="240"
                  step="15"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Gang & Supervisor Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-500 text-[10px]">EXECUTING GANG:</label>
                  <input
                    type="text"
                    value={gangName}
                    onChange={e => setGangName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px]">LEAD SUPERVISOR:</label>
                  <input
                    type="text"
                    value={supervisor}
                    onChange={e => setSupervisor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Evaluate Button */}
              <button
                onClick={handleEvaluateAI}
                disabled={isEvaluating}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>SOLVING MULTI-CONSTRAINT SCHEDULE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>RUN AI CONFLICT EVALUATION</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Optimization Result Preview */}
          {aiResult && (
            <div className="bg-[#0c162d] border border-blue-500/40 rounded-2xl p-6 shadow-2xl animate-fadeIn space-y-4">
              <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    AI OPTIMIZED SLOT FOUND
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {aiResult.confidenceScore}% CONFIDENCE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">RECOMMENDED WINDOW:</span>
                  <span className="text-cyan-300 text-sm font-bold block mt-0.5">
                    {aiResult.optimalStartTime} ➔ {aiResult.optimalEndTime} IST
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DELAY MITIGATION:</span>
                  <span className="text-emerald-400 text-sm font-bold block mt-0.5 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" /> -{aiResult.delaySavedMinutes} min saved
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] mb-1">AUTONOMOUS DIVERSION STRATEGY:</span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  {aiResult.recommendedDivert}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {aiResult.affectedTrains.map(trn => (
                    <span key={trn} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {trn}
                    </span>
                  ))}
                </div>
              </div>

              {authorizedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
                  <Check className="w-4 h-4" />
                  PERMIT AUTHORIZED! PUSHING LIVE TO DIGITAL TWIN...
                </div>
              ) : (
                <button
                  onClick={handleAuthorizeBlock}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  AUTHORIZE PERMIT & DEPLOY TO CORRIDOR
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Corridor Permits & Gantt Conflict Matrix */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Active & Approved Corridor Blocks ({maintenanceBlocks.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Southern Railway Track Permitting</span>
            </div>

            <div className="space-y-3">
              {maintenanceBlocks.map(block => {
                const isActive = block.status === 'ACTIVE';
                const isApproved = block.status === 'APPROVED';
                const isPending = block.status === 'PENDING';

                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                        : isApproved
                        ? 'bg-blue-950/20 border-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white tracking-wide">
                            {block.permitNumber}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              isActive
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                                : isApproved
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {block.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-sans">
                            {block.maintenanceType.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-xs text-cyan-300 mt-1 font-mono font-bold">
                          {block.fromStation} ⇄ {block.toStation} • {block.lineName}
                        </p>

                        <p className="text-xs text-slate-400 font-sans mt-1">
                          {block.alternateRouteSuggested}
                        </p>
                      </div>

                      <div className="text-right min-w-max">
                        <div className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded border border-slate-800">
                          {block.startTime} - {block.endTime}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {block.durationMinutes} min window
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Supervisor: <span className="text-slate-200">{block.supervisorName}</span></span>

                      {isPending && (
                        <button
                          onClick={() => approveBlock(block.id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Block</span>
                        </button>
                      )}

                      {block.approvedByController && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                          <ShieldCheck className="w-3 h-3" /> Signed: {block.approvedByController}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
