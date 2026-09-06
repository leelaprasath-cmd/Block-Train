import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from database import (
    test_db,
    get_track_sections,
    get_maintenance_tasks,
    get_block_windows,
    get_trains,
    get_active_blocks,
    save_plan_to_db,
    get_latest_plan,
    approve_block,
)
from ml_prioritizer import prioritizer
from optimizer import optimize_block_schedule

app = FastAPI(
    title="BlockTrain AI Autonomous Maintenance Block Planning Engine",
    description="Smart India Hackathon SIH26027: Multi-Department Track, Signal & OHE Block Optimizer with Neon PostgreSQL",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ApproveBlockRequest(BaseModel):
    block_id: str
    department: str
    block_date: str
    from_time: str
    to_time: str
    urgency: Optional[str] = "High"

@app.get("/api/health")
def health_check():
    db_ok = test_db()
    return {
        "status": "online" if db_ok else "degraded",
        "database_connected": db_ok,
        "engine": "Google OR-Tools CP-SAT + Scikit-Learn ML Prioritizer",
        "zone": "Southern Railway (MAS Division)"
    }

@app.get("/api/sections")
def list_sections():
    try:
        sections = get_track_sections()
        return {"success": True, "count": len(sections), "data": sections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks")
def list_tasks():
    try:
        raw_tasks = get_maintenance_tasks()
        # Enrich with AI prioritization scoring
        scored_tasks = prioritizer.fit_and_score(raw_tasks)
        return {"success": True, "count": len(scored_tasks), "data": scored_tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/corridor-windows")
def list_windows():
    try:
        windows = get_block_windows()
        return {"success": True, "count": len(windows), "data": windows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trains")
def list_trains():
    try:
        trains = get_trains()
        return {"success": True, "count": len(trains), "data": trains}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/active-blocks")
def list_active_blocks():
    try:
        blocks = get_active_blocks()
        return {"success": True, "count": len(blocks), "data": blocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/optimize-plan")
def trigger_optimization():
    try:
        # 1. Fetch live tasks, block opportunities, and trains from Neon DB
        raw_tasks = get_maintenance_tasks()
        windows = get_block_windows()
        trains = get_trains()

        if not raw_tasks:
            raise HTTPException(status_code=400, detail="No maintenance tasks found in database.")
        if not windows:
            raise HTTPException(status_code=400, detail="No block windows available in database.")

        # 2. Run AI Prioritization
        scored_tasks = prioritizer.fit_and_score(raw_tasks)

        # 3. Run Google OR-Tools CP-SAT Optimizer with Shadow Blocking
        result = optimize_block_schedule(scored_tasks, windows, trains)

        # 4. If feasible/optimal, persist to Neon DB plans, plan_blocks, plan_tasks
        if result.get("status") in ["OPTIMAL", "FEASIBLE"] and result.get("scheduled_blocks"):
            plan_id = save_plan_to_db(
                baseline_minutes=result["metrics"]["baseline_minutes"],
                optimized_minutes=result["metrics"]["optimized_minutes"],
                minutes_saved=result["metrics"]["minutes_saved"],
                metrics=result["metrics"],
                explanation=result["explanation"],
                scheduled_blocks=result["scheduled_blocks"]
            )
            result["plan_id"] = plan_id

        return {"success": True, **result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@app.get("/api/plans/latest")
def get_latest_optimization_plan():
    try:
        plan = get_latest_plan()
        if not plan:
            return {"success": True, "plan": None, "message": "No optimization plan generated yet."}
        return {"success": True, "plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blocks/approve")
def approve_block_permit(payload: ApproveBlockRequest):
    try:
        success = approve_block(
            block_id_str=payload.block_id,
            department=payload.department,
            block_date=payload.block_date,
            from_time=payload.from_time,
            to_time=payload.to_time,
            urgency=payload.urgency
        )
        return {
            "success": success,
            "message": f"Block permit {payload.block_id} approved and committed to active_blocks.",
            "block_id": payload.block_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
