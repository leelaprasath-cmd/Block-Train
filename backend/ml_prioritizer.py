import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

def compute_task_priority(task: dict) -> dict:
    """
    Computes domain-specific railway risk and criticality score for a maintenance task.
    """
    safety = float(task.get("safety_criticality") or 50)
    failure_risk = float(task.get("failure_risk") or 50)
    asset_impact = float(task.get("asset_impact") or 50)
    overdue_days = float(task.get("overdue_days") or 0)
    severity = str(task.get("severity") or "MEDIUM").upper()

    # Normalize overdue impact (caps at 30 days = 100 points)
    overdue_score = min(overdue_days * 3.33, 100.0)

    # Multi-criteria weighted formulation
    base_score = (
        safety * 0.35 +
        failure_risk * 0.25 +
        asset_impact * 0.20 +
        overdue_score * 0.20
    )

    # Severity adjustment multiplier
    severity_multipliers = {
        "CRITICAL": 1.20,
        "HIGH": 1.10,
        "MEDIUM": 1.00,
        "LOW": 0.85
    }
    mult = severity_multipliers.get(severity, 1.00)
    final_score = round(min(100.0, base_score * mult), 2)

    # Priority level categorization
    if final_score >= 80:
        level = "CRITICAL"
    elif final_score >= 65:
        level = "HIGH"
    elif final_score >= 45:
        level = "MEDIUM"
    else:
        level = "LOW"

    task_copy = dict(task)
    task_copy["ai_priority_score"] = final_score
    task_copy["ai_priority_level"] = level
    return task_copy

class MaintenancePrioritizer:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=30, random_state=42)
        self.is_fitted = False

    def fit_and_score(self, tasks: list[dict]) -> list[dict]:
        if not tasks:
            return []

        # Compute deterministic multi-criteria scores
        scored_tasks = [compute_task_priority(t) for t in tasks]

        # Convert to DataFrame for ML feature extraction
        df = pd.DataFrame(scored_tasks)
        
        # Features
        feature_cols = []
        for col in ["safety_criticality", "failure_risk", "asset_impact", "overdue_days", "required_duration_minutes"]:
            df[col] = pd.to_numeric(df.get(col, 0), errors="coerce").fillna(0)
            feature_cols.append(col)

        # Department one-hot encoding if present
        if "department" in df.columns:
            dept_dummies = pd.get_dummies(df["department"], prefix="dept", drop_first=False)
            df = pd.concat([df, dept_dummies], axis=1)
            feature_cols.extend(dept_dummies.columns.tolist())

        X = df[feature_cols].values
        y = df["ai_priority_score"].values

        # Fit Random Forest to capture non-linear feature interactions
        try:
            self.model.fit(X, y)
            self.is_fitted = True
            df["ai_predicted_urgency"] = np.round(self.model.predict(X), 2)
        except Exception as e:
            print(f"ML fit fallback: {e}")
            df["ai_predicted_urgency"] = df["ai_priority_score"]

        # Sort tasks descending by priority
        df = df.sort_values(by="ai_priority_score", ascending=False)
        return df.to_dict(orient="records")

prioritizer = MaintenancePrioritizer()
