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
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
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
        <div className="flex items-center gap-2 mt-4">
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
      </div>
    </div>
  );
};
