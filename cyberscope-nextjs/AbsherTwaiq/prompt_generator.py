# ============================================================
# prompt_generator.py
# Strong, SOC-grade parser for structured LLM output
# - Validates each field
# - Removes garbage formatting
# - Prevents N/A results
# - Ensures SOC-safe fallbacks
# ============================================================

import re
from framework.SOAx_data_schema import LLMResponseSchema


# -----------------------------
# SOC-safe fallback values
# -----------------------------
FALLBACK = {
    "risk_score": "3",
    "mitre": "Unknown Technique",
    "behavior": "Suspicious activity detected.",
    "evidence": "Logs, authentication events, system activity.",
    "ir_action": "Monitor",
    "recommendation": "Monitor – insufficient model output."
}


# -----------------------------
# Extract a field using regex
# -----------------------------
def extract_field(label: str, text: str) -> str:
    pattern = rf"{label}\s*(.+)"
    match = re.search(pattern, text, re.IGNORECASE)

    if not match:
        return None  # return None, NOT "N/A"

    value = match.group(1).strip()

    # Remove bullets, numbering, weird characters
    value = re.sub(r"^[\-\•\d\.\)\s]+", "", value).strip()

    # Stop when next field appears
    stop_labels = [
        "Risk Score:",
        "MITRE ATT&CK Technique:",
        "Behavioral Pattern:",
        "Evidence Needed:",
        "IR Action:",
        "AI Recommendation:"
    ]

    for stop in stop_labels:
        if stop.lower() != label.lower() and stop.lower() in value.lower():
            value = value.split(stop)[0].strip()

    # Remove trailing punctuation
    value = value.rstrip(" .,-")

    return value if value else None


# -----------------------------
# Validate & normalize outputs
# -----------------------------
def normalize(parsed: dict) -> dict:
    clean = {}

    # --- Risk Score ---
    rs = parsed.get("risk_score")
    try:
        rs_int = int(re.findall(r"\d+", rs or "")[0])
        if not 1 <= rs_int <= 10:
            rs_int = 3
        clean["risk_score"] = str(rs_int)
    except:
        clean["risk_score"] = FALLBACK["risk_score"]

    # --- MITRE ---
    mitre = parsed.get("mitre")
    if not mitre or len(mitre) < 3:
        clean["mitre"] = FALLBACK["mitre"]
    else:
        clean["mitre"] = mitre.strip()

    # --- Behavior ---
    behavior = parsed.get("behavior")
    clean["behavior"] = behavior.strip() if behavior else FALLBACK["behavior"]

    # --- Evidence ---
    evidence = parsed.get("evidence")
    clean["evidence"] = evidence.strip() if evidence else FALLBACK["evidence"]

    # --- IR Action ---
    ir = parsed.get("ir_action")
    clean["ir_action"] = ir.strip() if ir else FALLBACK["ir_action"]

    # --- Recommendation ---
    rec = parsed.get("recommendation")
    clean["recommendation"] = rec.strip() if rec else FALLBACK["recommendation"]

    return clean


# -----------------------------
# Main LLM Output Parser
# -----------------------------
def parse_llm_response(raw_output: str) -> LLMResponseSchema:
    """
Parses raw LLM output into a structured 6-field SOC alert schema.

This function extracts and sanitizes each expected field using robust pattern matching,
validates the values, and applies SOC-safe defaults where data is missing or malformed.
Ensures the final output is clean, complete, and suitable for automated downstream use
in security operations workflows.
"""


    parsed = {
        "risk_score": extract_field("Risk Score:", raw_output),
        "mitre": extract_field("MITRE ATT&CK Technique:", raw_output),
        "behavior": extract_field("Behavioral Pattern:", raw_output),
        "evidence": extract_field("Evidence Needed:", raw_output),
        "ir_action": extract_field("IR Action:", raw_output),
        "recommendation": extract_field("AI Recommendation:", raw_output)
    }

    # Normalize & fallback if needed
    final = normalize(parsed)

    return final
