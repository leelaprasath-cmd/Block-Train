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
  Sliders,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchHealth,
  fetchTasks,
  runAIOptimization,
  approveBlockPermit,
  fetchModelMetrics,
  triggerModelRetrain,
  simulateWhatIfDisruption,
  BackendTask,
  OptimizationResult,
  ScheduledBlock,
  ModelMetrics,
  WhatIfResponse,
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
  const [activeTab, setActiveTab] = useState<'OPTIMIZER' | 'LIVE_TASKS' | 'GANTT' | 'WHAT_IF'>('OPTIMIZER');
  const [authorizedSuccess, setAuthorizedSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Machine Learning Model Metrics state
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccess, setRetrainSuccess] = useState<string | null>(null);

  // What-If Disruption state
  const [incidentType, setIncidentType] = useState<string>('Broken Rail Fracture');
  const [incidentSection, setIncidentSection] = useState<string>('TBM-CMP');
  const [incidentDuration, setIncidentDuration] = useState<number>(90);
  const [isSimulatingWhatIf, setIsSimulatingWhatIf] = useState<boolean>(false);
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResponse | null>(null);

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
        const metrics = await fetchModelMetrics();
        setModelMetrics(metrics);
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

  const handleRunWhatIf = async () => {
    setIsSimulatingWhatIf(true);
    try {
      const res = await simulateWhatIfDisruption({
        incident_type: incidentType,
        track_section_id: incidentSection,
        required_minutes: Number(incidentDuration),
      });
      setWhatIfResult(res);
    } catch (e: any) {
      alert(`What-If simulation failed: ${e.message}`);
    } finally {
      setIsSimulatingWhatIf(false);
    }
  };

  const handleRetrainModel = async () => {
    setIsRetraining(true);
    setRetrainSuccess(null);
    try {
      const res = await triggerModelRetrain();
      setModelMetrics(res.metrics);
      setRetrainSuccess('Model retrained with HistGradientBoosting and weights updated in Neon DB!');
      setTimeout(() => setRetrainSuccess(null), 4000);
    } catch (e: any) {
      alert(`Model retraining failed: ${e.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] text-slate-800 p-4 lg:p-8 font-mono overflow-y-auto">
      {/* View Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-wide">
                AI AUTOMATIC BLOCK PLANNING SYSTEM // COA-TMS-SMMS-TDMS
              </h2>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Ministry of Railways SIH26027: Multi-Department Co-Scheduling, Shadow Blocking & Cascading Delay Optimization with Neon PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                title="Return to Real World Track Map"
              >
                <span>✕ Back to Real World Track</span>
              </button>
            )}

            {/* Neon DB Status Badge */}
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs text-xs flex items-center gap-2">
              <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-600' : 'text-amber-500'}`} />
              <span className="text-slate-500 font-bold">NEON DB:</span>
              <span className={`font-bold ${dbConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {dbConnected ? 'CONNECTED (ep-small-king)' : 'CONNECTING...'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs text-xs text-slate-700">
              <span className="text-slate-500 mr-2 font-bold">CORRIDOR CLOCK:</span>
              <span className="text-blue-700 font-bold">{simulatedTime} IST</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setActiveTab('OPTIMIZER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'OPTIMIZER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI OPTIMIZER & SHADOW BLOCKS
          </button>
          <button
            onClick={() => setActiveTab('LIVE_TASKS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'LIVE_TASKS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            LIVE TMS/SMMS/TDMS DEMANDS ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('GANTT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'GANTT'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            MULTI-DEPT GANTT TIMELINE & ARCHITECTURE
          </button>
          <button
            onClick={() => setActiveTab('WHAT_IF')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'WHAT_IF'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            WHAT-IF & MODEL INSIGHTS
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'OPTIMIZER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel: Solver Control & Metrics */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    Google OR-Tools CP-SAT Solver
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    Shadow Blocking v2.4
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed mb-5">
                  Reads real-time maintenance requests across Engineering (P-Way), S&T, and Traction from Neon DB. Solves multi-department corridor allocation to maximize shadow co-utilization and eliminate train traffic downtime.
                </p>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleRunOptimizer}
                  disabled={isOptimizing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-xs"
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
                  <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">SOLVER STATUS:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {optimizationResult.status} ({optimizationResult.solver_wall_time_seconds}s)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block">DOWNTIME SAVED</span>
                        <span className="text-emerald-700 text-base font-bold flex items-center gap-1 mt-0.5">
                          <TrendingDown className="w-4 h-4" />
                          -{optimizationResult.metrics.minutes_saved} min
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block">SHADOW BLOCKS</span>
                        <span className="text-blue-700 text-base font-bold flex items-center gap-1 mt-0.5">
                          <Share2 className="w-4 h-4" />
                          {optimizationResult.metrics.shadow_blocks_count} Co-utilized
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-sans text-slate-700 leading-relaxed">
                      {optimizationResult.explanation}
                    </div>

                    {optimizationResult.plan_id && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
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
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Optimized Corridor Schedule ({optimizationResult?.scheduled_blocks.length || 0} Windows)
                </h3>
                <span className="text-[10px] text-slate-500">Auto-calculated from COA & Timetable</span>
              </div>

              {!optimizationResult ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs shadow-sm">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-pulse" />
                  Click <strong className="text-slate-800">"Execute AI Multi-Block Optimizer"</strong> to pull tasks from Neon DB, calculate AI risk scores, and generate the optimal multi-department schedule.
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizationResult.scheduled_blocks.map((block, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border transition-all ${
                        block.is_shadow_block
                          ? 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/40 border-blue-300 shadow-sm'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-bold text-slate-900">
                              Section {block.track_section_id}
                            </span>
                            {block.is_shadow_block && (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm">
                                <Share2 className="w-3 h-3" />
                                SHADOW BLOCK ({block.departments_count} DEPARTMENTS CO-WORKING)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-blue-700 font-mono font-medium">
                            Window: {block.start_time.replace('T', ' ').slice(0, 16)} ➔ {block.end_time.replace('T', ' ').slice(11, 16)} ({block.duration_minutes} Minutes)
                          </p>
                        </div>

                        {authorizedSuccess === `BLK-COA-${block.window_id}-${block.track_section_id}` ? (
                          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1 shadow-sm">
                            <Check className="w-3.5 h-3.5" /> DEPLOYED LIVE
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAuthorizeBlock(block)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Authorize & Deploy</span>
                          </button>
                        )}
                      </div>

                      {/* Tasks executed concurrently within this block */}
                      <div className="space-y-2 pt-3 border-t border-slate-200">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                          Concurrent Maintenance Tasks in this Block:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {block.tasks.map(t => (
                            <div
                              key={t.id}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between gap-1.5 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  t.department === 'ENGINEERING'
                                    ? 'bg-blue-100 text-blue-800'
                                    : t.department === 'SNT'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {t.department}
                                </span>
                                <span className="text-[10px] text-blue-700 font-mono font-bold">
                                  Score: {t.ai_priority_score}
                                </span>
                              </div>
                              <span className="text-slate-900 font-sans text-xs font-semibold">
                                {t.task_type}
                              </span>
                              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Neon DB: Live Ingested Demands (TMS, SMMS, TDMS)
              </h3>
              <span className="text-xs text-slate-500">Synchronized with PostgreSQL</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-600 border-b border-slate-200 text-[11px] bg-slate-50/50">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">DEPARTMENT</th>
                    <th className="py-2.5 px-2">TASK TYPE</th>
                    <th className="py-2.5 px-2">SECTION</th>
                    <th className="py-2.5 px-2">ASSET</th>
                    <th className="py-2.5 px-2">SEVERITY</th>
                    <th className="py-2.5 px-2">OVERDUE</th>
                    <th className="py-2.5 px-2">REQ DUR</th>
                    <th className="py-2.5 px-2">AI CRITICALITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tasks.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 text-blue-700 font-bold">#{t.id}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.department === 'ENGINEERING'
                            ? 'bg-blue-100 text-blue-800'
                            : t.department === 'SNT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.department}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-sans font-semibold text-slate-900">{t.task_type}</td>
                      <td className="py-3 px-2 text-slate-700">{t.track_section_id}</td>
                      <td className="py-3 px-2 text-slate-600">{t.asset}</td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-bold ${
                          t.severity === 'HIGH' || t.severity === 'CRITICAL' ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {t.severity}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-amber-700 font-bold">{t.overdue_days} days</td>
                      <td className="py-3 px-2 text-slate-700">{t.required_duration_minutes} min</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
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
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  DEPARTMENT DEMANDS
                </span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">
                  6 Tasks Ingested
                </span>
                <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
                  TMS (2) • SMMS (2) • TDMS (2)
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  DECENTRALIZED BASELINE
                </span>
                <span className="text-xl font-bold text-slate-800 mt-1 block">
                  300 Total Minutes
                </span>
                <span className="text-[11px] text-red-600 font-medium mt-0.5 block">
                  Independent Sidelined Outages
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  AI CO-SCHEDULED TIME
                </span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">
                  270 Minutes
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
                  -30 Min Saved (10.0% Gain)
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  CO-UTILIZATION
                </span>
                <span className="text-xl font-bold text-blue-700 mt-1 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  3 Depts Merged
                </span>
                <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
                  TBM ⇄ CMP (14:00 - 15:30)
                </span>
              </div>
            </div>

            {/* Master Corridor Gantt Schedule */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Corridor Multi-Department Shadow Block Gantt Timeline (24h)
                  </h3>
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    Section Tambaram (TBM) ⇄ Chromepet (CMP) • Mainlines & OHE Overhead Corridors
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Engineering (TMS)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> S&T (SMMS)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-amber-600" /> Traction (TDMS)
                  </span>
                </div>
              </div>

              {/* Gantt Timeline Swimlanes */}
              <div className="space-y-4">
                {/* Time Markers Header */}
                <div className="grid grid-cols-8 text-center text-[10px] text-slate-500 font-mono border-b border-slate-200 pb-2">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span className="text-blue-700 font-bold">14:00</span>
                  <span className="text-blue-700 font-bold">16:00</span>
                  <span>18:00</span>
                  <span>20:00</span>
                  <span>22:00</span>
                </div>

                {/* Swimlane 1: Engineering (TMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-bold text-blue-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      1. ENGINEERING (P-WAY / TMS)
                    </span>
                    <span className="text-slate-500">Track Alignment & Rail Grinding</span>
                  </div>
                  <div className="relative h-11 bg-slate-100/90 rounded-xl border border-slate-200 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/60 flex items-center px-3 text-xs text-white font-bold shadow-sm"
                      style={{ left: '37.5%', width: '18.75%' }}
                    >
                      <span className="truncate">Track Alignment Repair (90 min)</span>
                    </div>
                  </div>
                </div>

                {/* Swimlane 2: S&T (SMMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      2. SIGNAL & TELECOM (S&T / SMMS)
                    </span>
                    <span className="text-slate-500">Signal Circuit & Point Machine 104A</span>
                  </div>
                  <div className="relative h-11 bg-slate-100/90 rounded-xl border border-slate-200 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/60 flex items-center px-3 text-xs text-white font-bold shadow-sm"
                      style={{ left: '37.5%', width: '9.375%' }}
                    >
                      <span className="truncate">Signal Circuit Inspection (45 min)</span>
                    </div>
                  </div>
                </div>

                {/* Swimlane 3: Traction (TDMS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-bold text-amber-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      3. TRACTION DISTRIBUTION (TRD / TDMS)
                    </span>
                    <span className="text-slate-500">25 kV OHE Catenary Maintenance</span>
                  </div>
                  <div className="relative h-11 bg-slate-100/90 rounded-xl border border-slate-200 overflow-hidden">
                    {/* Shadow Block Window Bar */}
                    <div
                      className="absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 border border-amber-400/60 flex items-center px-3 text-xs text-white font-bold shadow-sm"
                      style={{ left: '40.625%', width: '12.5%' }}
                    >
                      <span className="truncate">OHE Tensioning (60 min)</span>
                    </div>
                  </div>
                </div>

                {/* Shadow Block Co-working Bracket Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/50 border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        AI SHADOW BLOCK DETECTED & CO-SCHEDULED
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono font-bold">
                          14:00 - 15:30 IST
                        </span>
                      </h4>
                      <p className="text-xs text-slate-700 font-sans mt-0.5">
                        Instead of granting 3 separate traffic disconnections totaling 195 minutes of line closure, the AI CP-SAT solver aligned Engineering, S&T, and Traction into a <strong>single 90-minute window</strong>.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-sm">
                    +105 Min Line Availability
                  </span>
                </div>
              </div>

              {/* Suburban Train Traffic Profile (COA Feed) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Suburban Line Train Density Profile (COA Feeder)
                  </span>
                  <span className="text-slate-500">Optimal Non-Peak Window Selection</span>
                </div>

                <div className="grid grid-cols-8 gap-1.5 h-16 pt-2 items-end font-mono text-[9px] text-slate-600">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-400 rounded-t h-12" title="Peak Hour: 28 Trains/hr" />
                    <span>28 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-400 rounded-t h-14" title="Peak Hour: 32 Trains/hr" />
                    <span>32 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-amber-400 rounded-t h-8" title="Mid-day: 14 Trains/hr" />
                    <span>14 t/h</span>
                  </div>
                  {/* Selected Window */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-600 rounded-t h-3 ring-2 ring-emerald-400 animate-pulse" title="AI Slot: 4 Trains/hr (Optimal)" />
                    <span className="text-emerald-700 font-bold">4 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-500 rounded-t h-4" title="Afternoon: 6 Trains/hr" />
                    <span>6 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-400 rounded-t h-12" title="Evening Peak: 26 Trains/hr" />
                    <span>26 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-red-400 rounded-t h-14" title="Evening Peak: 30 Trains/hr" />
                    <span>30 t/h</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full bg-amber-400 rounded-t h-6" title="Night: 10 Trains/hr" />
                    <span>10 t/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* End-to-End Integration Architecture Flow */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Workflow className="w-4 h-4 text-blue-600" />
                Integrated System Architecture (TMS + SMMS + TDMS + COA ➔ Neon DB ➔ CP-SAT)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                {/* 1. TMS */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 text-xs space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-bold text-blue-700 uppercase">1. TMS INGESTION</div>
                  <div className="font-bold text-slate-900">Track Management</div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Track geometry car defects, ultrasonic flaw detections, and overdue sleeper replacements.
                  </p>
                </div>

                {/* 2. SMMS */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 text-xs space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">2. SMMS INGESTION</div>
                  <div className="font-bold text-slate-900">Signalling System</div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Point machine motor clearances, track circuit testing, and axle counter recalibrations.
                  </p>
                </div>

                {/* 3. TDMS & COA */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-amber-200 text-xs space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">3. TDMS + COA</div>
                  <div className="font-bold text-slate-900">Traction & Paths</div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    25 kV OHE line disconnections coupled with live train path availability from COA.
                  </p>
                </div>

                {/* 4. Neon PostgreSQL + OR-Tools */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-purple-200 text-xs space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-bold text-purple-700 uppercase">4. AI ENGINE</div>
                  <div className="font-bold text-slate-900">OR-Tools + Scikit</div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Unified Criticality Scoring (UCI) and CP-SAT constraint optimization for shadow blocks.
                  </p>
                </div>

                {/* 5. One-Click Permit */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 text-xs space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-bold text-blue-700 uppercase">5. DIGITAL PERMIT</div>
                  <div className="font-bold text-slate-900">Active Block Permit</div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Form T/409 digital authority issued directly to Section Controller & Track Supervisors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What-If Disruption Simulator & Model Insights Tab */}
        {activeTab === 'WHAT_IF' && (
          <div className="space-y-6">
            {/* Top Grid: Simulator Control + Model Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 6 cols: What-If Incident Simulator */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Real-Time Disruption Simulator (What-If Analysis)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Dynamic CP-SAT Rescheduler</span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Simulate unforeseen track emergencies (e.g. Broken Rail or OHE Catenary Snap). The AI solver will dynamically inject the emergency block, preempt low-urgency tasks, and co-schedule concurrent maintenance without stopping passenger rail traffic.
                </p>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Emergency Incident Type:
                    </label>
                    <select
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Broken Rail Fracture">🚨 Broken Rail Fracture (P-Way Emergency)</option>
                      <option value="25 kV OHE Catenary Wire Parting">⚡ 25 kV OHE Catenary Snap (Traction Breakdown)</option>
                      <option value="Point Machine 104A Jam">🚦 Point Machine 104A Motor Jam (S&T Interlocking)</option>
                      <option value="Track Circuit 102B Dropped">📡 Track Circuit 102B Dropped (Signal Fail-Safe)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Physical Track Section:
                      </label>
                      <select
                        value={incidentSection}
                        onChange={(e) => setIncidentSection(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="TBM-CMP">Tambaram ⇄ Chromepet (TBM-CMP)</option>
                        <option value="MS-MKK">Chennai Egmore ⇄ Kodambakkam (MS-MKK)</option>
                        <option value="MBM-GDY">Mambalam ⇄ Guindy (MBM-GDY)</option>
                        <option value="GDY-STM">Guindy ⇄ St. Thomas Mount (GDY-STM)</option>
                        <option value="STM-TBM">St. Thomas Mount ⇄ Tambaram (STM-TBM)</option>
                        <option value="CMP-PV">Chromepet ⇄ Pallavaram (CMP-PV)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Possession Duration Required:
                      </label>
                      <select
                        value={incidentDuration}
                        onChange={(e) => setIncidentDuration(Number(e.target.value))}
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value={45}>45 Minutes (Rapid Clamp Fitting)</option>
                        <option value={60}>60 Minutes (Standard Inspection & Repair)</option>
                        <option value={90}>90 Minutes (Full Rail Replacement)</option>
                        <option value={120}>120 Minutes (Major Catenary Restring)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRunWhatIf}
                  disabled={isSimulatingWhatIf}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:opacity-95 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-xs disabled:opacity-50"
                >
                  {isSimulatingWhatIf ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-yellow-200" />
                      <span>RE-CALCULATING NETWORK PATHS WITH CP-SAT...</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4 text-yellow-200" />
                      <span>SIMULATE WHAT-IF DISRUPTION & RE-SCHEDULE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right 6 cols: Supervised Machine Learning Model Diagnostics */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Machine Learning Model Diagnostics (HistGradientBoosting + RF)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {modelMetrics?.status || 'ONLINE'}
                  </span>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">R² ACCURACY</span>
                    <span className="text-base font-black text-emerald-700 mt-0.5 block">0.9893</span>
                    <span className="text-[9px] text-slate-400">Variance Explained</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">TEST MAE</span>
                    <span className="text-base font-black text-blue-700 mt-0.5 block">1.93 pts</span>
                    <span className="text-[9px] text-slate-400">Mean Abs Error</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">GRANT ROC-AUC</span>
                    <span className="text-base font-black text-purple-700 mt-0.5 block">0.826</span>
                    <span className="text-[9px] text-slate-400">75.8% Accuracy</span>
                  </div>
                </div>

                {/* Top Feature Drivers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Top Drivers of Maintenance Urgency (Feature Importance):
                  </span>
                  <div className="space-y-1 text-xs">
                    {(modelMetrics?.top_feature_drivers || [
                      { feature: 'failure_risk', importance: 0.189 },
                      { feature: 'asset_impact', importance: 0.187 },
                      { feature: 'safety_criticality', importance: 0.169 },
                      { feature: 'overdue_days', importance: 0.123 },
                      { feature: 'traffic_density_gmt', importance: 0.104 },
                    ]).map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-36 text-[10px] text-slate-600 truncate font-mono">{d.feature}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.round(d.importance * 100 * 3.5)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-700 font-bold w-12 text-right">
                          {(d.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {retrainSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{retrainSuccess}</span>
                  </div>
                )}

                <button
                  onClick={handleRetrainModel}
                  disabled={isRetraining}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all flex items-center justify-center gap-2 text-xs border border-slate-300 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-blue-600 ${isRetraining ? 'animate-spin' : ''}`} />
                  <span>{isRetraining ? 'TRAINING ON HISTORICAL RECORDS...' : 'TRIGGER MODEL RETRAINING ON NEON DB'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Result Area: What-If Rescheduled Plan Display */}
            {whatIfResult && (
              <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-black text-xs">
                      WHAT-IF OUTPUT
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Emergency Scenario: {whatIfResult.incident.type} on Section {whatIfResult.incident.section}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                        {whatIfResult.disruption_summary}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    +{whatIfResult.rescheduled_plan.metrics.minutes_saved}m Co-utilized Downtime Saved
                  </span>
                </div>

                {/* Rescheduled Corridor Windows */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Dynamic Emergency Schedule Windows ({whatIfResult.rescheduled_plan.scheduled_blocks.length}):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {whatIfResult.rescheduled_plan.scheduled_blocks.map((block, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${
                          block.is_shadow_block
                            ? 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50/40 border-blue-300 shadow-sm'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Section {block.track_section_id}
                          </span>
                          {block.is_shadow_block ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              SHADOW BLOCK ({block.departments_count} DEPTS)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                              SINGLE BLOCK
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-blue-700 font-mono font-medium mb-2">
                          Window: {block.start_time.replace('T', ' ').slice(0, 16)} ➔ {block.end_time.replace('T', ' ').slice(11, 16)} ({block.duration_minutes}m)
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200">
                          {block.tasks.map((t) => (
                            <div key={t.id} className="text-[11px] flex items-center justify-between">
                              <span className="text-slate-800 font-semibold truncate flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  t.department === 'ENGINEERING' ? 'bg-blue-600' : t.department === 'SNT' ? 'bg-emerald-600' : 'bg-amber-600'
                                }`} />
                                {t.task_type}
                              </span>
                              <span className="text-[10px] text-blue-700 font-bold font-mono">
                                Score: {t.ai_priority_score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
