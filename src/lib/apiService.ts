export interface BackendTask {
  id: number;
  department: string;
  task_type: string;
  track_section_id: string;
  asset: string;
  description: string;
  severity: string;
  safety_criticality: number;
  asset_impact: number;
  failure_risk: number;
  required_duration_minutes: number;
  overdue_days: number;
  ai_priority_score?: number;
  ai_priority_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
}

export interface ScheduledBlock {
  window_id: number;
  track_section_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  task_ids: number[];
  tasks: BackendTask[];
  departments: string[];
  is_shadow_block: boolean;
  departments_count: number;
}

export interface OptimizationResult {
  success: boolean;
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE' | 'NO_DATA';
  solver_wall_time_seconds: number;
  plan_id?: number;
  scheduled_blocks: ScheduledBlock[];
  metrics: {
    total_tasks_scheduled: number;
    total_tasks_available: number;
    baseline_minutes: number;
    optimized_minutes: number;
    minutes_saved: number;
    shadow_blocks_count: number;
    co_utilization_percent: number;
  };
  explanation: string;
}

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string; database_connected: boolean; zone: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API backend not reachable, using fallback:', err);
    return { status: 'offline', database_connected: false, zone: 'Fallback Mock' };
  }
}

export async function fetchTasks(): Promise<BackendTask[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const json = await res.json();
  return json.data || [];
}

export async function fetchCorridorWindows(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/corridor-windows`);
  if (!res.ok) throw new Error('Failed to fetch corridor windows');
  const json = await res.json();
  return json.data || [];
}

export async function runAIOptimization(): Promise<OptimizationResult> {
  const res = await fetch(`${API_BASE}/optimize-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Optimization request failed' }));
    throw new Error(err.detail || 'Optimization failed');
  }
  return await res.json();
}

export async function approveBlockPermit(payload: {
  block_id: string;
  department: string;
  block_date: string;
  from_time: string;
  to_time: string;
  urgency?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/blocks/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to approve block');
  return await res.json();
}
