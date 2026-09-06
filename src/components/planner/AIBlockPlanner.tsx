import React, { useState, useEffect } from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  CalendarCheck,
  Zap,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingDown,
  Check,
  Database,
  Layers,
  Cpu,
  AlertTriangle,
  Share2,
  BarChart3,
  Activity,
  Workflow,
} from 'lucide-react';
import {
  fetchHealth,
  fetchTasks,
  runAIOptimization,
  approveBlockPermit,
  BackendTask,
  OptimizationResult,
  ScheduledBlock,
} from '../../lib/apiService';

export interface AIBlockPlannerProps {
  onBlockAuthorized?: (sectionId: string) => void;
  onClose?: () => void;
}

export const AIBlockPlanner: React.FC<AIBlockPlannerProps> = ({ onBlockAuthorized, onClose }) => {
  const {
    createMaintenanceBlock,
    simulatedTime,
  } = useRailwaySimulation();

  // Backend & Neon DB state
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'OPTIMIZER' | 'LIVE_TASKS' | 'GANTT'>('OPTIMIZER');
  const [authorizedSuccess, setAuthorizedSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load database tasks and connection health on mount
  useEffect(() => {
    async function loadData() {
      try {
        const health = await fetchHealth();
        setDbConnected(health.database_connected);
        if (health.database_connected) {
          const dbTasks = await fetchTasks();
          setTasks(dbTasks);
        }
      } catch (e) {
        console.warn('Initial backend load error:', e);
      }
    }
    loadData();
  }, []);

  // Trigger Google OR-Tools AI Optimization
  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    setErrorMsg(null);
    setAuthorizedSuccess(null);

    try {
      const result = await runAIOptimization();
      setOptimizationResult(result);
    } catch (err: any) {
      console.error('Optimization error:', err);
      setErrorMsg(err.message || 'Optimization solver failed.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Authorize & Deploy block into Neon DB active_blocks and local digital twin
  const handleAuthorizeBlock = async (block: ScheduledBlock) => {
    try {
      const blockId = `BLK-COA-${block.window_id}-${block.track_section_id}`;
      const deptName = block.departments.join(' + ');
      const [fromTime, toTime] = [
        block.start_time.includes('T') ? block.start_time.split('T')[1].slice(0, 5) : '14:00',
        block.end_time.includes('T') ? block.end_time.split('T')[1].slice(0, 5) : '15:30',
      ];
      const blockDate = block.start_time.includes('T') ? block.start_time.split('T')[0] : '2026-08-23';

      // 1. Commit to Neon PostgreSQL DB
      await approveBlockPermit({
        block_id: blockId,
        department: deptName,
        block_date: blockDate,
        from_time: fromTime,
        to_time: toTime,
        urgency: block.is_shadow_block ? 'Critical' : 'High',
      });

      // 2. Push to local Digital Twin state
      createMaintenanceBlock({
        sectionTrackId: block.track_section_id,
        fromStation: block.track_section_id.split('-')[0] || 'TBM',
        toStation: block.track_section_id.split('-')[1] || 'CMP',
        lineName: `Main Corridor (${block.track_section_id})`,
        maintenanceType: block.is_shadow_block ? 'OHE_CATENARY' : 'TRACK_TAMPING',
        startTime: fromTime,
        endTime: toTime,
        durationMinutes: block.duration_minutes,
        requestedByGang: `Joint Task Force: ${deptName}`,
        supervisorName: 'A. Dhanasekaran (Chief Section Controller)',
        speedRestrictionKmh: 45,
        alternateRouteSuggested: block.is_shadow_block
          ? 'Shadow Block Co-utilization: Single-line working on Up Main; routing EMUs via loop.'
          : 'Normal single-line bypass authorized.',
        delayImpactMinutes: 4.2,
      });

      // 3. Notify real-world track view
      if (onBlockAuthorized) {
        onBlockAuthorized(block.track_section_id);
      }

      setAuthorizedSuccess(blockId);
      setTimeout(() => {
        setAuthorizedSuccess(null);
      }, 3000);
    } catch (e: any) {
      alert(`Authorization failed: ${e.message}`);
    }
  };

  return (
    <div className="w-full h-full bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
      {/* View Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AI AUTOMATIC BLOCK PLANNING SYSTEM // COA-TMS-SMMS-TDMS
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Ministry of Railways SIH26027: Multi-Department Co-Scheduling, Shadow Blocking & Cascading Delay Optimization with Neon PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                title="Return to Real World Track Map"
              >
                <span>✕ Back to Real World Track</span>
              </button>
            )}

            {/* Neon DB Status Badge */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
              <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-slate-400">NEON DB:</span>
              <span className={`font-bold ${dbConnected ? 'text-emerald-300' : 'text-amber-300'}`}>
                {dbConnected ? 'CONNECTED (ep-small-king)' : 'CONNECTING...'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500 mr-2">CORRIDOR CLOCK:</span>
              <span className="text-cyan-300 font-bold">{simulatedTime} IST</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setActiveTab('OPTIMIZER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'OPTIMIZER'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI OPTIMIZER & SHADOW BLOCKS
          </button>
          <button
            onClick={() => setActiveTab('LIVE_TASKS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'LIVE_TASKS'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            LIVE TMS/SMMS/TDMS DEMANDS ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('GANTT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'GANTT'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            MULTI-DEPT GANTT TIMELINE & ARCHITECTURE
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'OPTIMIZER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel: Solver Control & Metrics */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Google OR-Tools CP-SAT Solver
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Shadow Blocking v2.4
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-5">
                  Reads real-time maintenance requests across Engineering (P-Way), S&T, and Traction from Neon DB. Solves multi-department corridor allocation to maximize shadow co-utilization and eliminate train traffic downtime.
                </p>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleRunOptimizer}
                  disabled={isOptimizing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-90 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-50 text-xs"
                >
                  {isOptimizing ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-yellow-300" />
                      <span>SOLVING MULTI-DEPARTMENT CONSTRAINTS...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>EXECUTE AI MULTI-BLOCK OPTIMIZER</span>
                    </>
                  )}
                </button>

                {optimizationResult && (
                  <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">SOLVER STATUS:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        {optimizationResult.status} ({optimizationResult.solver_wall_time_seconds}s)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">DOWNTIME SAVED</span>
                        <span className="text-emerald-400 text-base font-bold flex items-center gap-1 mt-0.5">
                          <TrendingDown className="w-4 h-4" />
                          -{optimizationResult.metrics.minutes_saved} min
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">SHADOW BLOCKS</span>
                        <span className="text-cyan-300 text-base font-bold flex items-center gap-1 mt-0.5">
                          <Share2 className="w-4 h-4" />
                          {optimizationResult.metrics.shadow_blocks_count} Co-utilized
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-sans text-slate-300">
                      {optimizationResult.explanation}
                    </div>

                    {optimizationResult.plan_id && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Committed to Neon DB (Plan #{optimizationResult.plan_id})
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Scheduled Blocks & Shadow Blocks Visualization */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Optimized Corridor Schedule ({optimizationResult?.scheduled_blocks.length || 0} Windows)
                </h3>
                <span className="text-[10px] text-slate-500">Auto-calculated from COA & Timetable</span>
              </div>

              {!optimizationResult ? (
                <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-500/40 animate-pulse" />
                  Click <strong className="text-slate-300">"Execute AI Multi-Block Optimizer"</strong> to pull tasks from Neon DB, calculate AI risk scores, and generate the optimal multi-department schedule.
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizationResult.scheduled_blocks.map((block, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border transition-all ${
                        block.is_shadow_block
                          ? 'bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-900/80 border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.15)]'
                          : 'bg-[#0b1222] border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-bold text-white">
                              Section {block.track_section_id}
                            </span>
                            {block.is_shadow_block && (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex items-center gap-1 shadow-sm">
                                <Share2 className="w-3 h-3" />
                                SHADOW BLOCK ({block.departments_count} DEPARTMENTS CO-WORKING)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-cyan-300 font-mono">
                            Window: {block.start_time.replace('T', ' ').slice(0, 16)} ➔ {block.end_time.replace('T', ' ').slice(11, 16)} ({block.duration_minutes} Minutes)
                          </p>
                        </div>

                        {authorizedSuccess === `BLK-COA-${block.window_id}-${block.track_section_id}` ? (
                          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> DEPLOYED LIVE
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAuthorizeBlock(block)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorize & Deploy</span>
                          </button>
                        )}
                      </div>

                      {/* Tasks executed concurrently within this block */}
                      <div className="space-y-2 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                          Concurrent Maintenance Tasks in this Block:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {block.tasks.map(t => (
                            <div
                              key={t.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col justify-between gap-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  t.department === 'ENGINEERING'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : t.department === 'SNT'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {t.department}
                                </span>
                                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                                  Score: {t.ai_priority_score}
                                </span>
                              </div>
                              <span className="text-slate-200 font-sans text-xs font-semibold">
                                {t.task_type}
                              </span>
                              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>Asset: {t.asset}</span>
                                <span>Dur: {t.required_duration_minutes}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Tasks from Neon DB Tab */}
        {activeTab === 'LIVE_TASKS' && (
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Neon DB: Live Ingested Demands (TMS, SMMS, TDMS)
              </h3>
              <span className="text-xs text-slate-500">Synchronized with PostgreSQL</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">DEPARTMENT</th>
                    <th className="pb-3">TASK TYPE</th>
                    <th className="pb-3">SECTION</th>
                    <th className="pb-3">ASSET</th>
                    <th className="pb-3">SEVERITY</th>
                    <th className="pb-3">OVERDUE</th>
                    <th className="pb-3">REQ DUR</th>
                    <th className="pb-3">AI CRITICALITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tasks.map(t => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 text-cyan-300 font-bold">#{t.id}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.department === 'ENGINEERING'
                            ? 'bg-blue-500/20 text-blue-300'
                            : t.department === 'SNT'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {t.department}
                        </span>
                      </td>
                      <td className="py-3 font-sans font-semibold text-slate-200">{t.task_type}</td>
                      <td className="py-3 text-slate-300">{t.track_section_id}</td>
                      <td className="py-3 text-slate-400">{t.asset}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold ${
                          t.severity === 'HIGH' || t.severity === 'CRITICAL' ? 'text-red-400' : 'text-slate-400'
                        }`}>
                          {t.severity}
                        </span>
                      </td>
                      <td className="py-3 text-amber-300 font-bold">{t.overdue_days} days</td>
                      <td className="py-3 text-slate-300">{t.required_duration_minutes} min</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          {t.ai_priority_score || 'Calculating...'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Multi-Department Gantt Timeline & Architecture Tab */}
        {activeTab === 'GANTT' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  DEPARTMENT DEMANDS
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  6 Tasks Ingested
                </span>
                <span className="text-[11px] text-blue-400 mt-0.5 block">
                  TMS (2) • SMMS (2) • TDMS (2)
                </span>
              </div>

              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  DECENTRALIZED BASELINE
                </span>
                <span className="text-xl font-bold text-slate-300 mt-1 block">
                  300 Total Minutes
                </span>
                <span className="text-[11px] text-red-400 mt-0.5 block">
                  Independent Sidelined Outages
                </span>
              </div>

              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  AI CO-SCHEDULED TIME
                </span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">
                  270 Minutes
                </span>
                <span className="text-[11px] text-emerald-300 mt-0.5 block">
                  -30 Min Saved (10.0% Gain)
                </span>
              </div>

              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 shadow-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  CO-UTILIZATION
                </span>
                <span className="text-xl font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  3 Depts Merged
                </span>
                <span className="text-[11px] text-cyan-400 mt-0.5 block">
                  TBM ⇄ CMP (14:00 - 15:30)
                </span>
              </div>
            </div>

            {/* Master Corridor Gantt Schedule */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    Corridor Multi-Department Shadow Block Gantt Timeline (24h)
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Section Tambaram (TBM) ⇄ Chromepet (CMP) • Mainlines & OHE Overhead Corridors
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 text-blue-300">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Engineering (TMS)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> S&T (SMMS)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Traction (TDMS)
                  </span>
                </div>
              </div>

              {/* Gantt Timeline Swimlanes */}
              <div className="space-y-4">
                {/* Time Markers Header */}
                <div className="grid grid-cols-8 text-center text-[10px] text-slate-500 font-mono border-b border-slate-800/80 pb-2">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span className="text-cyan-400 font-bold">14:00</span>
                  <span className="text-cyan-400 font-bold">16:00</span>
                  <span>18:00</span>
                  <span>20:00</span>
                  <span>22:00</span>
                </div>

                {/* Swimlane 1: Engineering (TMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      1. ENGINEERING (P-WAY / TMS)
                    </span>
                    <span className="text-slate-500">Track Alignment & Rail Grinding</span>
                  </div>
                  <div className="relative h-11 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/60 flex items-center px-3 text-xs text-white font-bold shadow-md"
                      style={{ left: '37.5%', width: '18.75%' }}
                    >
                      <span className="truncate">Track Alignment Repair (90 min)</span>
                    </div>
                  </div>
                </div>

                {/* Swimlane 2: S&T (SMMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      2. SIGNAL & TELECOM (S&T / SMMS)
                    </span>
                    <span className="text-slate-500">Signal Circuit & Point Machine 104A</span>
                  </div>
                  <div className="relative h-11 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/60 flex items-center px-3 text-xs text-white font-bold shadow-md"
                      style={{ left: '37.5%', width: '9.375%' }}
                    >
                      <span className="truncate">Signal Circuit Inspection (45 min)</span>
                    </div>
                  </div>
                </div>

                {/* Swimlane 3: Traction (TDMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      3. TRACTION DISTRIBUTION (TRD / TDMS)
                    </span>
                    <span className="text-slate-500">25 kV OHE Catenary Maintenance</span>
                  </div>
                  <div className="relative h-11 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 border border-amber-400/60 flex items-center px-3 text-xs text-white font-bold shadow-md"
                      style={{ left: '40.625%', width: '12.5%' }}
                    >
                      <span className="truncate">OHE Tensioning (60 min)</span>
                    </div>
                  </div>
                </div>

                {/* Shadow Block Co-working Bracket Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-emerald-950/40 border border-cyan-500/40 shadow-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        AI SHADOW BLOCK DETECTED & CO-SCHEDULED
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          14:00 - 15:30 IST
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Instead of granting 3 separate traffic disconnections totaling 195 minutes of line closure, the AI CP-SAT solver aligned Engineering, S&T, and Traction into a <strong>single 90-minute window</strong>.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs">
                    +105 Min Line Availability
                  </span>
                </div>
              </div>

              {/* Suburban Train Traffic Profile (COA Feed) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Suburban Line Train Density Profile (COA Feeder)
                  </span>
                  <span className="text-slate-400">Optimal Non-Peak Window Selection</span>
                </div>

                <div className="grid grid-cols-8 gap-1.5 h-16 pt-2 items-end font-mono text-[9px] text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-500/60 rounded-t h-12" title="Peak Hour: 28 Trains/hr" />
                    <span>28 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-500/60 rounded-t h-14" title="Peak Hour: 32 Trains/hr" />
                    <span>32 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-amber-500/60 rounded-t h-8" title="Mid-day: 14 Trains/hr" />
                    <span>14 t/h</span>
                  </div>
                  {/* Selected Window */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-500 rounded-t h-3 ring-2 ring-emerald-400 animate-pulse" title="AI Slot: 4 Trains/hr (Optimal)" />
                    <span className="text-emerald-400 font-bold">4 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-500/80 rounded-t h-4" title="Afternoon: 6 Trains/hr" />
                    <span>6 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-500/60 rounded-t h-12" title="Evening Peak: 26 Trains/hr" />
                    <span>26 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-500/60 rounded-t h-14" title="Evening Peak: 30 Trains/hr" />
                    <span>30 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-amber-500/60 rounded-t h-6" title="Night: 10 Trains/hr" />
                    <span>10 t/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* End-to-End Integration Architecture Flow */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                Integrated System Architecture (TMS + SMMS + TDMS + COA ➔ Neon DB ➔ CP-SAT)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {/* 1. TMS */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-blue-400 uppercase">1. TMS INGESTION</div>
                  <div className="font-bold text-white">Track Management</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Track geometry car defects, ultrasonic flaw detections, and overdue sleeper replacements.
                  </p>
                </div>

                {/* 2. SMMS */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">2. SMMS INGESTION</div>
                  <div className="font-bold text-white">Signalling System</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Point machine motor clearances, track circuit testing, and axle counter recalibrations.
                  </p>
                </div>

                {/* 3. TDMS & COA */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">3. TDMS + COA</div>
                  <div className="font-bold text-white">Traction & Paths</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    25 kV OHE line disconnections coupled with live train path availability from COA.
                  </p>
                </div>

                {/* 4. Neon PostgreSQL + OR-Tools */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">4. AI ENGINE</div>
                  <div className="font-bold text-white">OR-Tools + Scikit</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Unified Criticality Scoring (UCI) and CP-SAT constraint optimization for shadow blocks.
                  </p>
                </div>

                {/* 5. One-Click Permit */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">5. DIGITAL PERMIT</div>
                  <div className="font-bold text-white">Active Block Permit</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Form T/409 digital authority issued directly to Section Controller & Track Supervisors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
