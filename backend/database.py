import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DEFAULT_DB_URL = "postgresql://neondb_owner:npg_XWvYUc3z5lCf@ep-small-king-b3iapd9u-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def test_db():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 as connected;")
                row = cur.fetchone()
                return bool(row and row["connected"] == 1)
    except Exception as e:
        print(f"Database connection error: {e}")
        return False

def get_track_sections():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM track_sections ORDER BY id ASC;")
            return [dict(r) for r in cur.fetchall()]

def get_maintenance_tasks():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, department, task_type, track_section_id, asset, description,
                       severity, safety_criticality, asset_impact, failure_risk,
                       required_duration_minutes, overdue_days, deadline,
                       requested_start, requested_end, priority_score, priority_level, status
                FROM maintenance_tasks
                ORDER BY overdue_days DESC, safety_criticality DESC;
            """)
            return [dict(r) for r in cur.fetchall()]

def get_block_windows():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, track_section_id, start_time, end_time, availability_status, traffic_level
                FROM block_windows
                ORDER BY start_time ASC;
            """)
            return [dict(r) for r in cur.fetchall()]

def get_trains():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, train_name, train_type, current_track_section_id, scheduled_time, status
                FROM trains
                ORDER BY scheduled_time ASC;
            """)
            return [dict(r) for r in cur.fetchall()]

def get_active_blocks():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, department, block_date, from_time, to_time, urgency, created_at
                FROM active_blocks
                ORDER BY created_at DESC;
            """)
            return [dict(r) for r in cur.fetchall()]

def save_plan_to_db(baseline_minutes, optimized_minutes, minutes_saved, metrics, explanation, scheduled_blocks):
    """
    Saves the generated plan into plans, plan_blocks, and plan_tasks tables.
    """
    import json
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO plans (status, baseline_block_minutes, optimized_block_minutes, block_minutes_saved, metrics, explanation, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                RETURNING id;
            """, (
                "OPTIMIZED",
                baseline_minutes,
                optimized_minutes,
                minutes_saved,
                json.dumps(metrics),
                explanation
            ))
            plan_id = cur.fetchone()["id"]

            for b in scheduled_blocks:
                cur.execute("""
                    INSERT INTO plan_blocks (plan_id, track_section_id, start_time, end_time, duration_minutes)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    plan_id,
                    b["track_section_id"],
                    b["start_time"],
                    b["end_time"],
                    b["duration_minutes"]
                ))
                block_id = cur.fetchone()["id"]

                for task_id in b.get("task_ids", []):
                    cur.execute("""
                        INSERT INTO plan_tasks (plan_block_id, task_id)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (block_id, task_id))

            conn.commit()
            return plan_id

def get_latest_plan():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM plans ORDER BY created_at DESC LIMIT 1;")
            plan = cur.fetchone()
            if not plan:
                return None
            
            plan = dict(plan)
            cur.execute("""
                SELECT pb.id as block_id, pb.track_section_id, pb.start_time, pb.end_time, pb.duration_minutes,
                       array_agg(pt.task_id) as task_ids
                FROM plan_blocks pb
                LEFT JOIN plan_tasks pt ON pt.plan_block_id = pb.id
                WHERE pb.plan_id = %s
                GROUP BY pb.id, pb.track_section_id, pb.start_time, pb.end_time, pb.duration_minutes
                ORDER BY pb.start_time ASC;
            """, (plan["id"],))
            plan["blocks"] = [dict(r) for r in cur.fetchall()]
            return plan

def approve_block(block_id_str, department, block_date, from_time, to_time, urgency="High"):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO active_blocks (id, department, block_date, from_time, to_time, urgency, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    department = EXCLUDED.department,
                    block_date = EXCLUDED.block_date,
                    from_time = EXCLUDED.from_time,
                    to_time = EXCLUDED.to_time,
                    urgency = EXCLUDED.urgency;
            """, (block_id_str, department, str(block_date), str(from_time), str(to_time), urgency))
            conn.commit()
            return True
