import json
import os

from l3_engine import predict_l3

# ===============================
# Paths
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_DIR = os.path.join(BASE_DIR, "..", "storage")

HISTORY_PATH = os.path.join(STORAGE_DIR, "C:\.VS Code Languages\AbsherTwaiq\storage\history.json")
OUTPUT_PATH = os.path.join(STORAGE_DIR, "C:\.VS Code Languages\AbsherTwaiq\storage\predicted_alerts.json")


# ===============================
# Load Alerts from history.json
# ===============================
def load_history():
    if not os.path.exists(HISTORY_PATH):
        raise FileNotFoundError(f"history.json not found at {HISTORY_PATH}")

    with open(HISTORY_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded {len(data)} alerts from history.json")
    return data


# ===============================
# Run Predictions for all alerts
# ===============================
def run_predictions():
    history = load_history()
    output = []

    for idx, item in enumerate(history):
        alert = item.get("alert", {})
        llm_response = item.get("llm_response", {})

        # Skip if LLM response was invalid (should not happen now)
        if any(v == "N/A" for v in llm_response.values()):
            print(f"[!] Skipping alert #{idx+1} — contains N/A fields")
            continue

        prediction = predict_l3(alert, llm_response)

        output.append({
            "alert": alert,
            "l3_prediction": prediction
        })

        print(f"[OK] Processed alert #{idx+1}")

    # Save final results
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)

    print(f"\nSaved {len(output)} L3 predictions → {OUTPUT_PATH}")


# ===============================
# Main
# ===============================
if __name__ == "__main__":
    run_predictions()
