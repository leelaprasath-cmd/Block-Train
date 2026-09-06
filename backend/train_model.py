"""
Ministry of Railways - Automatic Block Planning System
Machine Learning Training Pipeline: Maintenance Task Prioritization & Grant Probability
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, roc_auc_score, accuracy_score

# Ensure target directory exists
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def generate_railway_dataset(num_samples: int = 500, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates realistic historical maintenance demand records across
    Engineering (TMS), Signalling (SMMS), and Traction (TDMS).
    """
    np.random.seed(random_seed)

    departments = ["ENGINEERING", "SNT", "TRACTION"]
    dept_weights = [0.45, 0.30, 0.25]
    dept_choices = np.random.choice(departments, size=num_samples, p=dept_weights)

    task_types_map = {
        "ENGINEERING": ["Rail Grinding", "Ultrasonic Flaw Detection (USFD)", "Track Alignment / Tamping", "Turnout Deep Screening", "Sleeper Renewal", "Fishplate & Fastening Inspection"],
        "SNT": ["Point Machine 104A Overhaul", "Track Circuit Drop Test", "Axle Counter Recalibration", "Electronic Interlocking Maintenance", "Signal Lamp Unit Replacement", "Block Instrument Telemetry"],
        "TRACTION": ["25 kV OHE Catenary Tensioning", "Neutral Section Inspection", "Pantograph Carbon Strip Clearance", "Isolator & Switchgear Testing", "Substation Transformer Overhaul", "Feeder Line Mast Repair"]
    }

    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    sev_weights = [0.20, 0.40, 0.25, 0.15]

    track_sections = ["MS-MKK", "MKK-MBM", "MBM-GDY", "GDY-STM", "STM-TBM", "TBM-CMP", "CMP-PV", "PV-TLM", "TLM-SKL", "SKL-CGL"]
    track_types = ["MAINLINE_UP", "MAINLINE_DOWN", "SUBURBAN_FAST", "SUBURBAN_SLOW"]

    rows = []
    for i in range(num_samples):
        dept = dept_choices[i]
        task_type = np.random.choice(task_types_map[dept])
        severity = np.random.choice(severities, p=sev_weights)
        section = np.random.choice(track_sections)
        track_type = np.random.choice(track_types)

        # Realistic domain correlations
        if severity == "CRITICAL":
            safety = np.random.uniform(75, 100)
            failure_risk = np.random.uniform(70, 100)
            asset_impact = np.random.uniform(65, 95)
            overdue_days = np.random.randint(5, 45)
            speed_restriction = np.random.choice([0, 1], p=[0.2, 0.8])
        elif severity == "HIGH":
            safety = np.random.uniform(55, 85)
            failure_risk = np.random.uniform(50, 80)
            asset_impact = np.random.uniform(50, 80)
            overdue_days = np.random.randint(0, 30)
            speed_restriction = np.random.choice([0, 1], p=[0.5, 0.5])
        elif severity == "MEDIUM":
            safety = np.random.uniform(35, 65)
            failure_risk = np.random.uniform(30, 60)
            asset_impact = np.random.uniform(30, 65)
            overdue_days = np.random.randint(0, 20)
            speed_restriction = np.random.choice([0, 1], p=[0.8, 0.2])
        else: # LOW
            safety = np.random.uniform(10, 45)
            failure_risk = np.random.uniform(10, 40)
            asset_impact = np.random.uniform(10, 40)
            overdue_days = np.random.randint(0, 10)
            speed_restriction = 0

        traffic_density_gmt = np.random.uniform(15, 65) # Annual GMT
        required_duration = int(np.random.choice([30, 45, 60, 90, 120, 180]))

        # Target 1: Ground-truth Unified Criticality Index (UCI) with non-linear noise
        overdue_factor = min(overdue_days * 3.33, 100.0)
        base = (
            safety * 0.35 +
            failure_risk * 0.25 +
            asset_impact * 0.20 +
            overdue_factor * 0.20
        )
        sev_mult = {"CRITICAL": 1.20, "HIGH": 1.10, "MEDIUM": 1.00, "LOW": 0.85}[severity]
        speed_bonus = 8.0 if speed_restriction == 1 else 0.0
        gmt_bonus = (traffic_density_gmt / 65.0) * 5.0

        target_score = (base * sev_mult) + speed_bonus + gmt_bonus + np.random.normal(0, 1.5)
        target_score = round(float(np.clip(target_score, 5.0, 100.0)), 2)

        # Target 2: Block Approval Classification (COA Section Controller approval probability)
        # Highly critical tasks get granted (>70% prob), whereas low priority tasks in dense traffic get deferred
        grant_logit = (target_score - 55.0) / 15.0 - (traffic_density_gmt - 35.0) / 30.0
        grant_prob = 1.0 / (1.0 + np.exp(-grant_logit))
        grant_approval = int(np.random.rand() < grant_prob)

        rows.append({
            "task_id": 1000 + i,
            "department": dept,
            "task_type": task_type,
            "severity": severity,
            "track_section_id": section,
            "track_type": track_type,
            "safety_criticality": round(safety, 1),
            "failure_risk": round(failure_risk, 1),
            "asset_impact": round(asset_impact, 1),
            "overdue_days": overdue_days,
            "speed_restriction": speed_restriction,
            "traffic_density_gmt": round(traffic_density_gmt, 1),
            "required_duration_minutes": required_duration,
            "ai_priority_score": target_score,
            "grant_approval": grant_approval
        })

    return pd.DataFrame(rows)

def train_and_evaluate():
    print("=" * 65)
    print("[IR] INDIAN RAILWAYS: AI TASK PRIORITIZATION & GRANT MODEL TRAINING")
    print("=" * 65)

    df = generate_railway_dataset(num_samples=600, random_seed=42)
    print(f"Generated {len(df)} synthetic historical railway maintenance records.")

    feature_cols_num = [
        "safety_criticality", "failure_risk", "asset_impact", 
        "overdue_days", "speed_restriction", "traffic_density_gmt", 
        "required_duration_minutes"
    ]
    feature_cols_cat = ["department", "severity", "track_type"]

    X = df[feature_cols_num + feature_cols_cat]
    y_reg = df["ai_priority_score"]
    y_clf = df["grant_approval"]

    # Strict 80/20 train/test split BEFORE fitting preprocessor
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.20, random_state=42
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), feature_cols_num),
            ("cat", OneHotEncoder(handle_unknown="ignore"), feature_cols_cat)
        ]
    )

    # 1. Evaluate Multiple Regression Models
    print("\n--- Model Benchmark 1: Unified Criticality Score (Regression) ---")
    models = {
        "Ridge Baseline": Ridge(alpha=1.0),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        "HistGradientBoosting": HistGradientBoostingRegressor(max_iter=100, random_state=42)
    }

    results = {}
    best_reg_name = None
    best_r2 = -float("inf")
    best_reg_pipeline = None

    for name, model in models.items():
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("regressor", model)])
        pipe.fit(X_train, y_reg_train)
        preds = pipe.predict(X_test)

        mae = mean_absolute_error(y_reg_test, preds)
        rmse = np.sqrt(mean_squared_error(y_reg_test, preds))
        r2 = r2_score(y_reg_test, preds)

        results[name] = {"MAE": round(mae, 3), "RMSE": round(rmse, 3), "R2": round(r2, 4)}
        print(f"[{name}] -> R2: {r2:.4f} | MAE: {mae:.2f} | RMSE: {rmse:.2f}")

        if r2 > best_r2:
            best_r2 = r2
            best_reg_name = name
            best_reg_pipeline = pipe

    print(f"\n[WINNER] Best Regression Model: {best_reg_name} (R2 = {best_r2:.4f})")

    # 2. Train Classification Model for Block Grant Probability
    print("\n--- Model Benchmark 2: Section Controller Approval (Classification) ---")
    clf_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=80, max_depth=8, random_state=42))
    ])
    clf_pipeline.fit(X_train, y_clf_train)
    clf_preds = clf_pipeline.predict(X_test)
    clf_probs = clf_pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_clf_test, clf_preds)
    roc = roc_auc_score(y_clf_test, clf_probs)
    print(f"[Random Forest Classifier] -> Accuracy: {acc * 100:.1f}% | ROC-AUC: {roc:.3f}")

    # Extract Feature Importance from Random Forest
    rf_reg = best_reg_pipeline.named_steps["regressor"]
    rf_for_importance = rf_reg if hasattr(rf_reg, "feature_importances_") else clf_pipeline.named_steps["classifier"]
    if hasattr(rf_for_importance, "feature_importances_"):
        ohe = clf_pipeline.named_steps["preprocessor"].named_transformers_["cat"]
        cat_feature_names = list(ohe.get_feature_names_out(feature_cols_cat))
        all_features = feature_cols_num + cat_feature_names
        importances = rf_for_importance.feature_importances_
        feature_importance_map = sorted(
            [{"feature": f, "importance": round(float(imp), 4)} for f, imp in zip(all_features, importances)],
            key=lambda x: x["importance"],
            reverse=True
        )
    else:
        feature_importance_map = []

    print("\nTop 5 Drivers of Maintenance Urgency:")
    for item in feature_importance_map[:5]:
        print(f" * {item['feature']}: {item['importance'] * 100:.1f}%")

    # 3. Save Model Artifacts
    reg_path = os.path.join(MODEL_DIR, "task_prioritizer.joblib")
    clf_path = os.path.join(MODEL_DIR, "grant_classifier.joblib")
    metrics_path = os.path.join(MODEL_DIR, "model_metrics.json")

    joblib.dump(best_reg_pipeline, reg_path)
    joblib.dump(clf_pipeline, clf_path)

    metrics_payload = {
        "status": "TRAINED",
        "best_regression_model": best_reg_name,
        "regression_metrics": results,
        "classification_metrics": {
            "model": "Random Forest Classifier",
            "accuracy": round(acc, 4),
            "roc_auc": round(roc, 4)
        },
        "top_feature_drivers": feature_importance_map[:7],
        "total_training_samples": len(df),
        "test_samples": len(X_test)
    }

    with open(metrics_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\n[OK] Successfully serialized models to:")
    print(f" * Regressor: {reg_path}")
    print(f" * Classifier: {clf_path}")
    print(f" * Metrics JSON: {metrics_path}")
    print("=" * 65)

    return metrics_payload

if __name__ == "__main__":
    train_and_evaluate()
