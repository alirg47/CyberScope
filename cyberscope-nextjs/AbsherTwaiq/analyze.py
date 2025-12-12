# ============================================================
# analyze.py
# Batch Analyzer for SOAx
# Runs all alerts through the SOAx Agent Pipeline
# ============================================================

import json
from framework.run_agent import run_alert
from framework.SOAx_data_schema import AlertSchema


ALERTS_FILE = "alert.json"


def load_alerts() -> list[AlertSchema]:
    """Loads alerts from alert.json."""
    with open(ALERTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def analyze_all_alerts():
    """Runs every alert in alert.json through the SOAx Agent."""
    
    alerts = load_alerts()
    print(f"\n📌 Loaded {len(alerts)} alerts.\n")

    results = []

    for i, alert in enumerate(alerts, start=1):
        print(f"\n================ ALERT {i} ================\n")
        result = run_alert(alert)
        results.append(result)

    return results


# ------------------------------------------------------------
# Manual Execution
# ------------------------------------------------------------
if __name__ == "__main__":
    final_results = analyze_all_alerts()

    print("\n\n🎉 All alerts processed successfully!")
    print(f"Total results saved: {len(final_results)}")
