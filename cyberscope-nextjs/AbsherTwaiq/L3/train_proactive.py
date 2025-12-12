import json
import pandas as pd
import numpy as np
import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))      # مجلد L3
MODEL_DIR = os.path.join(BASE_DIR, "models")               # مجلد models داخل L3

# تأكد من وجود المجلد
os.makedirs(MODEL_DIR, exist_ok=True)

# ==============================================
# STEP 1 — Load history.json (Correct Path)
# ==============================================

# history.json موجود في مجلد SOAx الرئيسي وليس داخل L3
HISTORY_PATH = "C:\.VS Code Languages\AbsherTwaiq\storage\history.json"

with open(HISTORY_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Flatten JSON structure
df = pd.json_normalize(data)
print("Loaded alerts:", len(df))


# ==============================================
# STEP 2 — Basic Cleaning & Target Preparation
# ==============================================

# Convert risk_score to int
df["llm_response.risk_score"] = df["llm_response.risk_score"].astype(int)

# Clean MITRE technique (extract only ID like T1059)
def clean_mitre(x):
    if isinstance(x, str):
        return x.split()[0]  # يأخذ Txxxx فقط
    return "UNKNOWN"

df["mitre_clean"] = df["llm_response.mitre"].apply(clean_mitre)

# Escalation label:
# 0 = Low (1–3), 1 = Medium (4–6), 2 = High (7–10)
def map_escalation(score):
    if score <= 3:
        return 0
    elif score <= 6:
        return 1
    else:
        return 2

df["escalation_label"] = df["llm_response.risk_score"].apply(map_escalation)

# Build a single text feature for TF-IDF model
df["text_feature"] = (
    df["alert.description"].fillna("") + " "
    + df["llm_response.behavior"].fillna("") + " "
    + df["llm_response.evidence"].fillna("")
)

print("\n===== SAMPLE CLEANED DATA =====")
print(df[[
    "text_feature",
    "llm_response.risk_score",
    "mitre_clean",
    "escalation_label"
]].head())
print("================================\n")

print("Step 1 + Step 2 completed successfully.")


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# ==============================================
# STEP 3 — TF-IDF Vectorization + Label Encoding
# ==============================================

print("Building TF-IDF vectorizer...")

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    stop_words="english"
)

X_text = vectorizer.fit_transform(df["text_feature"])

print("TF-IDF shape:", X_text.shape)

# Encode MITRE labels
label_encoder = LabelEncoder()
y_mitre = label_encoder.fit_transform(df["mitre_clean"])

# Risk score target
y_risk = df["llm_response.risk_score"].values

# Escalation target
y_escalation = df["escalation_label"].values

# Train/test split
X_train, X_test, y_risk_train, y_risk_test = train_test_split(
    X_text, y_risk, test_size=0.2, random_state=42
)

_, _, y_mitre_train, y_mitre_test = train_test_split(
    X_text, y_mitre, test_size=0.2, random_state=42
)

_, _, y_esc_train, y_esc_test = train_test_split(
    X_text, y_escalation, test_size=0.2, random_state=42
)
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.pkl"))
print("Saved TF-IDF vectorizer → models/tfidf.pkl")
print("Step 3 completed successfully.")



from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
import joblib
import os

# ==============================================
# STEP 4 — Train Risk Score Prediction Model
# ==============================================
print("\nTraining Risk Score Prediction Model (RandomForest + GridSearchCV)...")

# Parameter grid for tuning
param_grid_risk = {
    "n_estimators": [100, 200, 300],
    "max_depth": [None, 10, 20, 30],
    "min_samples_split": [2, 5],
}

rf = RandomForestClassifier(random_state=42)

# GridSearchCV setup
grid_risk = GridSearchCV(
    rf,
    param_grid_risk,
    cv=3,
    scoring="accuracy",
    n_jobs=-1,
    verbose=1
)

# Train
grid_risk.fit(X_train, y_risk_train)

print("Best parameters for risk model:", grid_risk.best_params_)
print("Best score:", grid_risk.best_score_)

# Save the trained model
model_path = os.path.join("models", "risk_model.pkl")
joblib.dump(grid_risk.best_estimator_, model_path)

print(f"Risk model saved → {model_path}")
print("Step 4 completed successfully.")

from sklearn.linear_model import LogisticRegression

# ==============================================
# STEP 5 — Train MITRE Technique Prediction Model
# ==============================================
print("\nTraining MITRE Technique Model (LogisticRegression + GridSearchCV)...")

param_grid_mitre = {
    "C": [0.1, 1, 10],
    "solver": ["lbfgs"],
    "max_iter": [300, 500]
}

log_reg = LogisticRegression()

grid_mitre = GridSearchCV(
    log_reg,
    param_grid_mitre,
    cv=3,
    scoring="accuracy",
    n_jobs=-1,
    verbose=1
)

grid_mitre.fit(X_train, y_mitre_train)

print("Best MITRE model params:", grid_mitre.best_params_)
print("Best MITRE model score:", grid_mitre.best_score_)

# Save model + label encoder
joblib.dump(grid_mitre.best_estimator_, "models/mitre_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")

print("MITRE model + encoder saved.")
print("Step 5 completed successfully.")


# ==============================================
# STEP 6 — Train Escalation Prediction Model
# ==============================================
print("\nTraining Escalation Model (RandomForest + GridSearchCV)...")

param_grid_escalation = {
    "n_estimators": [100, 200],
    "max_depth": [None, 20, 40],
    "min_samples_split": [2, 5],
}

rf_esc = RandomForestClassifier(random_state=42)

grid_esc = GridSearchCV(
    rf_esc,
    param_grid_escalation,
    cv=3,
    scoring="accuracy",
    n_jobs=-1,
    verbose=1
)

grid_esc.fit(X_train, y_esc_train)

print("Best escalation model params:", grid_esc.best_params_)
print("Best escalation model score:", grid_esc.best_score_)

# Save model
joblib.dump(grid_esc.best_estimator_, "models/escalation_model.pkl")

print("Escalation model saved successfully.")
print("Step 6 completed successfully.\n")

from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# ==============================================
# STEP 7 — Clustering Model (Behavior Grouping)
# ==============================================
print("\nTraining Clustering Model (KMeans)...")

best_k = 0
best_score = -1
best_model = None

# نجرب بين 2 إلى 6 clusters
for k in range(2, 7):
    kmeans = KMeans(n_clusters=k, random_state=42)
    labels = kmeans.fit_predict(X_text)

    score = silhouette_score(X_text, labels)

    print(f"K={k}, Silhouette Score={score}")

    if score > best_score:
        best_score = score
        best_k = k
        best_model = kmeans

# Save best clustering model
joblib.dump(best_model, "models/cluster_model.pkl")

print(f"\nBest cluster count: {best_k}")
print(f"Clustering model saved → models/cluster_model.pkl")
print("Step 7 completed successfully.\n")

