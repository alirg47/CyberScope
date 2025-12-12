import os
import joblib
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer

# ================================
# Load all models from /models
# ================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

risk_model = joblib.load(os.path.join(MODEL_DIR, "risk_model.pkl"))
mitre_model = joblib.load(os.path.join(MODEL_DIR, "mitre_model.pkl"))
escalation_model = joblib.load(os.path.join(MODEL_DIR, "escalation_model.pkl"))
cluster_model = joblib.load(os.path.join(MODEL_DIR, "cluster_model.pkl"))

vectorizer = joblib.load(os.path.join(MODEL_DIR, "vectorizer.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))


# ================================
# Helper: Build text feature
# ================================
def build_text_feature(alert: dict, llm_response: dict):
    desc = alert.get("description", "")
    behavior = llm_response.get("behavior", "")
    evidence = llm_response.get("evidence", "")

    return f"{desc} {behavior} {evidence}"


# ================================
# Main Prediction Function
# ================================
def predict_l3(alert: dict, llm_response: dict):
    """
    Inputs:
        alert = original alert (description, username, ip, location)
        llm_response = the 6-field SOAx LLM output
    
    Returns:
        dict = predictions for L3 dashboard
    """

    # Step 1 — Build combined text
    text = build_text_feature(alert, llm_response)

    # Step 2 — Vectorize
    X = vectorizer.transform([text])

    # Step 3 — Predict Risk
    predicted_risk = int(risk_model.predict(X)[0])

    # Step 4 — Predict MITRE
    mitre_encoded = mitre_model.predict(X)[0]
    predicted_mitre = label_encoder.inverse_transform([mitre_encoded])[0]

    # Step 5 — Predict Escalation
    escalation_level = int(escalation_model.predict(X)[0])

    # Step 6 — Predict Cluster
    cluster_id = int(cluster_model.predict(X)[0])

    # Step 7 — Build Insight (simple auto message)
    insight = "This alert resembles cluster pattern #{}, which often matches similar historical attack behaviors.".format(cluster_id)

    # Final L3 Output
    return {
        "predicted_risk": predicted_risk,
        "predicted_mitre": predicted_mitre,
        "escalation_level": escalation_level,
        "cluster": cluster_id,
        "insight": insight
    }
