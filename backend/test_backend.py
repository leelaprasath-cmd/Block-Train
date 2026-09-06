from database import (
    test_db,
    get_track_sections,
    get_maintenance_tasks,
    get_block_windows,
    get_trains,
    save_plan_to_db,
    get_latest_plan,
)
from ml_prioritizer import prioritizer
from optimizer import optimize_block_schedule

def test_all():
    print("--- 1. Testing Neon DB Connection ---")
    connected = test_db()
    print(f"Connected: {connected}")
    assert connected, "Failed to connect to Neon PostgreSQL!"

    print("\n--- 2. Fetching Data from Neon DB ---")
    tasks = get_maintenance_tasks()
    windows = get_block_windows()
    trains = get_trains()
    sections = get_track_sections()
    print(f"Track Sections: {len(sections)}")
    print(f"Maintenance Tasks: {len(tasks)}")
    print(f"Corridor Windows: {len(windows)}")
    print(f"Trains: {len(trains)}")

    print("\n--- 3. Running AI Machine Learning Prioritizer ---")
    scored = prioritizer.fit_and_score(tasks)
    for t in scored:
        print(f"  • [{t.get('department')}] {t.get('task_type')} on {t.get('track_section_id')} | Overdue: {t.get('overdue_days')}d | AI Score: {t.get('ai_priority_score')} ({t.get('ai_priority_level')})")

    print("\n--- 4. Running Google OR-Tools CP-SAT Block Optimizer ---")
    result = optimize_block_schedule(scored, windows, trains)
    print(f"Solver Status: {result['status']}")
    print(f"Wall Time: {result.get('solver_wall_time_seconds')}s")
    print(f"Explanation: {result.get('explanation')}")
    print(f"Metrics: {result.get('metrics')}")

    for idx, b in enumerate(result.get("scheduled_blocks", []), 1):
        shadow_tag = " [SHADOW BLOCK / CO-UTILIZED]" if b.get("is_shadow_block") else ""
        print(f"\n  Block #{idx}{shadow_tag}: Section {b['track_section_id']} ({b['duration_minutes']} min)")
        print(f"  Window: {b['start_time']} -> {b['end_time']}")
        print(f"  Departments Co-working ({b['departments_count']}): {', '.join(b['departments'])}")
        for t in b["tasks"]:
            print(f"    - Task #{t['id']}: [{t['department']}] {t['task_type']} (Req: {t['required_duration_minutes']} min)")

    if result.get("scheduled_blocks"):
        print("\n--- 5. Persisting Plan to Neon DB ---")
        plan_id = save_plan_to_db(
            baseline_minutes=result["metrics"]["baseline_minutes"],
            optimized_minutes=result["metrics"]["optimized_minutes"],
            minutes_saved=result["metrics"]["minutes_saved"],
            metrics=result["metrics"],
            explanation=result["explanation"],
            scheduled_blocks=result["scheduled_blocks"]
        )
        print(f"Plan successfully saved with ID: #{plan_id}")

        latest = get_latest_plan()
        print(f"Retrieved Latest Plan from DB: ID #{latest['id']}, Status: {latest['status']}, Blocks: {len(latest.get('blocks', []))}")

    print("\n[SUCCESS] ALL BACKEND AND DATABASE TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
