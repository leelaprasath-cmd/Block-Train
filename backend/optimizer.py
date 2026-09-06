from datetime import datetime
from ortools.sat.python import cp_model

def optimize_block_schedule(tasks: list[dict], windows: list[dict], trains: list[dict] = None) -> dict:
    """
    Multi-department railway maintenance block optimizer using Google OR-Tools CP-SAT.
    Enforces section matching, duration limits, department co-utilization (Shadow Blocking),
    and train traffic conflict minimization.
    """
    if not tasks or not windows:
        return {
            "status": "NO_DATA",
            "message": "Both tasks and available corridor windows are required.",
            "scheduled_blocks": [],
            "metrics": {
                "total_tasks_scheduled": 0,
                "baseline_minutes": 0,
                "optimized_minutes": 0,
                "minutes_saved": 0,
                "shadow_blocks_count": 0,
                "co_utilization_percent": 0
            }
        }

    model = cp_model.CpModel()

    # Pre-process window durations
    processed_windows = []
    for w in windows:
        st = w["start_time"] if isinstance(w["start_time"], datetime) else datetime.fromisoformat(str(w["start_time"]).replace("Z", "+00:00"))
        et = w["end_time"] if isinstance(w["end_time"], datetime) else datetime.fromisoformat(str(w["end_time"]).replace("Z", "+00:00"))
        duration_mins = int((et - st).total_seconds() / 60)
        processed_windows.append({
            **w,
            "start_dt": st,
            "end_dt": et,
            "duration_minutes": duration_mins
        })

    # Decision variables: x[(task_id, window_id)] = 1 if task is scheduled in window
    x = {}
    for task in tasks:
        t_id = task["id"]
        t_dur = int(task.get("required_duration_minutes") or 60)
        t_sec = str(task.get("track_section_id") or "")

        for win in processed_windows:
            w_id = win["id"]
            w_sec = str(win.get("track_section_id") or "")
            w_dur = win["duration_minutes"]

            # Feasibility check: must be on same section and fit within window duration
            if (not t_sec or not w_sec or t_sec == w_sec) and t_dur <= w_dur:
                x[(t_id, w_id)] = model.NewBoolVar(f"x_{t_id}_{w_id}")

    if not x:
        return {
            "status": "INFEASIBLE",
            "message": "No tasks can fit into the provided corridor windows.",
            "scheduled_blocks": [],
            "metrics": {
                "total_tasks_scheduled": 0,
                "baseline_minutes": 0,
                "optimized_minutes": 0,
                "minutes_saved": 0,
                "shadow_blocks_count": 0,
                "co_utilization_percent": 0
            }
        }

    # Constraint 1: Each task can be scheduled AT MOST ONCE
    for task in tasks:
        t_id = task["id"]
        assigned_slots = [x[(t_id, win["id"])] for win in processed_windows if (t_id, win["id"]) in x]
        if assigned_slots:
            model.Add(sum(assigned_slots) <= 1)

    # Constraint 2: Department-level concurrency
    # Within any single window, at most 1 task per department (Engineering, S&T, Traction)
    departments = list({t.get("department", "GENERAL") for t in tasks})
    
    # Track which windows are utilized by each department
    window_dept_vars = {}
    for win in processed_windows:
        w_id = win["id"]
        for dept in departments:
            dept_tasks = [
                x[(t["id"], w_id)] for t in tasks 
                if t.get("department") == dept and (t["id"], w_id) in x
            ]
            if dept_tasks:
                model.Add(sum(dept_tasks) <= 1)
                d_var = model.NewBoolVar(f"dept_{dept}_win_{w_id}")
                model.Add(sum(dept_tasks) == d_var)
                window_dept_vars[(w_id, dept)] = d_var

    # Shadow block indicator: window is co-utilized by >= 2 departments
    shadow_vars = {}
    for win in processed_windows:
        w_id = win["id"]
        active_dept_vars = [window_dept_vars[(w_id, dept)] for dept in departments if (w_id, dept) in window_dept_vars]
        if len(active_dept_vars) >= 2:
            is_shadow = model.NewBoolVar(f"is_shadow_{w_id}")
            # If >= 2 departments are active in this window, is_shadow can be 1
            model.Add(sum(active_dept_vars) >= 2).OnlyEnforceIf(is_shadow)
            model.Add(sum(active_dept_vars) < 2).OnlyEnforceIf(is_shadow.Not())
            shadow_vars[w_id] = is_shadow

    # Objective Function:
    # Maximize (Task AI Priority Score) + Shadow Block Bonus - Train Traffic Penalty
    objective_terms = []
    for (t_id, w_id), var in x.items():
        task = next(t for t in tasks if t["id"] == t_id)
        win = next(w for w in processed_windows if w["id"] == w_id)

        priority_reward = int(float(task.get("ai_priority_score", 50)) * 10)
        
        # Traffic penalty (higher delay penalty for high-traffic windows)
        traffic_level = str(win.get("traffic_level", "MEDIUM")).upper()
        traffic_penalty = 60 if traffic_level == "HIGH" else (30 if traffic_level == "MEDIUM" else 10)

        objective_terms.append(var * (priority_reward - traffic_penalty))

    # Add significant bonus for multi-department co-utilization (Shadow Blocking)
    for w_id, s_var in shadow_vars.items():
        objective_terms.append(s_var * 250)

    model.Maximize(sum(objective_terms))

    # Solve with Google OR-Tools CP-SAT
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    status = solver.Solve(model)

    if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        return {
            "status": "INFEASIBLE",
            "message": "Solver could not find a feasible schedule.",
            "scheduled_blocks": [],
            "metrics": {
                "total_tasks_scheduled": 0,
                "baseline_minutes": 0,
                "optimized_minutes": 0,
                "minutes_saved": 0,
                "shadow_blocks_count": 0,
                "co_utilization_percent": 0
            }
        }

    # Extract Results
    scheduled_blocks_dict = {}
    total_baseline_minutes = 0

    for (t_id, w_id), var in x.items():
        if solver.Value(var) == 1:
            task = next(t for t in tasks if t["id"] == t_id)
            win = next(w for w in processed_windows if w["id"] == w_id)
            task_duration = int(task.get("required_duration_minutes") or 60)
            total_baseline_minutes += task_duration

            if w_id not in scheduled_blocks_dict:
                scheduled_blocks_dict[w_id] = {
                    "window_id": w_id,
                    "track_section_id": win.get("track_section_id"),
                    "start_time": win["start_dt"].isoformat(),
                    "end_time": win["end_dt"].isoformat(),
                    "duration_minutes": win["duration_minutes"],
                    "tasks": [],
                    "task_ids": [],
                    "departments": set(),
                }
            
            scheduled_blocks_dict[w_id]["tasks"].append(task)
            scheduled_blocks_dict[w_id]["task_ids"].append(t_id)
            scheduled_blocks_dict[w_id]["departments"].add(task.get("department"))

    scheduled_blocks = []
    total_optimized_minutes = 0
    shadow_count = 0

    for w_id, b in scheduled_blocks_dict.items():
        depts = list(b["departments"])
        is_co_utilized = len(depts) > 1
        if is_co_utilized:
            shadow_count += 1
        total_optimized_minutes += b["duration_minutes"]

        scheduled_blocks.append({
            "window_id": w_id,
            "track_section_id": b["track_section_id"],
            "start_time": b["start_time"],
            "end_time": b["end_time"],
            "duration_minutes": b["duration_minutes"],
            "task_ids": b["task_ids"],
            "tasks": b["tasks"],
            "departments": depts,
            "is_shadow_block": is_co_utilized,
            "departments_count": len(depts)
        })

    minutes_saved = max(0, total_baseline_minutes - total_optimized_minutes)
    co_util_percent = round((shadow_count / len(scheduled_blocks) * 100) if scheduled_blocks else 0, 1)

    return {
        "status": "OPTIMAL" if status == cp_model.OPTIMAL else "FEASIBLE",
        "solver_wall_time_seconds": round(solver.WallTime(), 3),
        "scheduled_blocks": scheduled_blocks,
        "metrics": {
            "total_tasks_scheduled": sum(len(b["task_ids"]) for b in scheduled_blocks),
            "total_tasks_available": len(tasks),
            "baseline_minutes": total_baseline_minutes,
            "optimized_minutes": total_optimized_minutes,
            "minutes_saved": minutes_saved,
            "shadow_blocks_count": shadow_count,
            "co_utilization_percent": co_util_percent
        },
        "explanation": f"Scheduled {sum(len(b['task_ids']) for b in scheduled_blocks)} tasks into {len(scheduled_blocks)} corridor windows. Achieved {shadow_count} joint shadow blocks across multiple departments, saving {minutes_saved} minutes of track downtime."
    }
