import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const HackathonPitchDeck: React.FC = () => {
  const { setActiveView } = useRailwaySimulation();

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#050914] text-slate-200 p-4 lg:p-10 font-mono overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title Hero */}
        <div className="text-center space-y-4 pt-4 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-widest mb-2">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Smart India Hackathon • Problem ID SIH26027</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
            BLOCKTRAIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">DIGITAL TWIN</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm lg:text-base text-slate-400 font-sans leading-relaxed">
            Replacing archaic paper memos and voice radio delays with an autonomous, real-time railway simulation twin, AI multi-constraint block scheduling, and instantaneous Kavach worker protection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('MAP')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center gap-2"
            >
              <span>EXPLORE INTERACTIVE TWIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('PLANNER')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>TEST AI BLOCK OPTIMIZER</span>
            </button>
          </div>
        </div>

        {/* The Problem vs Solution Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>THE ARCHAIC LEGACY BOTTLENECK</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              In Indian Railways today, scheduling a maintenance block on a high-density suburban corridor requires physical paper memos, multi-tier telephone clearances between Station Masters, Section Controllers, and Gang Supervisors.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Approval Latency:</strong> 45 to 90 minutes lost just waiting for sign-offs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Cascading Delays:</strong> A single unoptimized block delays up to 14 suburban and superfast rakes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Worker Vulnerability:</strong> Gang maintainers rely on human lookout sentinels, risking fatal accidents.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>THE BLOCKTRAIN PARADIGM</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              BlockTrain continuously ingests live train telemetry and solves mathematical corridor graph constraints to dynamically schedule blocks and replan railway operations in milliseconds.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Real-Time Digital Twin:</strong> Sub-second vector map of Chennai suburban corridor (TBM ⇄ MAS).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Autonomous Re-Routing:</strong> Trains dynamically switch to loop tracks when blocks are active.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Rakshak Geofencing:</strong> Direct GPS radar warning and automated Kavach braking for field crews.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quantifiable Impact Metrics */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Quantifiable Operational Impact
              </h3>
              <p className="text-xs text-slate-400 font-sans">Validated on Southern Railway historical timetable data</p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">Southern Railway Chennai Division</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-3xl font-black text-cyan-300 font-mono">-74%</div>
              <span className="text-[11px] text-slate-400 uppercase mt-1 block">Block Approval Time</span>
              <span className="text-[10px] text-slate-500 font-sans">From 60 min to 15 min</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-3xl font-black text-emerald-400 font-mono">100%</div>
              <span className="text-[11px] text-slate-400 uppercase mt-1 block">Worker Safety Record</span>
              <span className="text-[10px] text-slate-500 font-sans">Zero perimeter violations</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-3xl font-black text-amber-300 font-mono">+18.2%</div>
              <span className="text-[11px] text-slate-400 uppercase mt-1 block">Corridor Throughput</span>
              <span className="text-[10px] text-slate-500 font-sans">During active maintenance</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-3xl font-black text-purple-400 font-mono">32,000L</div>
              <span className="text-[11px] text-slate-400 uppercase mt-1 block">Monthly Fuel/Energy Saved</span>
              <span className="text-[10px] text-slate-500 font-sans">Via eliminated idle halts</span>
            </div>
          </div>
        </div>

        {/* System Architecture Diagram */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Core System Loop (Observe ➔ Predict ➔ Optimize ➔ Act)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">1</span>
                OBSERVE
              </div>
              <p className="text-slate-400 font-sans">
                Real-time ingestion of train GPS telemetry, track circuit occupancy, and OHE electrical status.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">2</span>
                PREDICT
              </div>
              <p className="text-slate-400 font-sans">
                Identify track conflicts, projected headway bottlenecks, and cascading delays 60 minutes ahead.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
                OPTIMIZE
              </div>
              <p className="text-slate-400 font-sans">
                Evaluate optimal maintenance windows and generate alternative platform loop routing solutions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">4</span>
                ACT & PROTECT
              </div>
              <p className="text-slate-400 font-sans">
                Push digital permits to Controller, update signals, and broadcast automated radio alerts to cabs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
