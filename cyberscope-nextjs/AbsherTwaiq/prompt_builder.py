# ============================================================
# SOAx Prompt Builder
# Unified SOC L1 Prompt with MITRE + VirusTotal Intelligence
# Generates the exact 6-field format the LLM must output
# ============================================================

def build_prompt(state: dict) -> str:
    """
    state = {
        "alert": {...},
        "mitre": {...},
        "virustotal": {...}
    }
    """

    alert = state.get("alert", {})
    mitre = state.get("mitre", {})
    vt = state.get("virustotal", {})

    # -----------------------------
    # 🔵 AI-Readable MITRE Fields
    # -----------------------------
    mitre_id = mitre.get("id", "N/A")
    mitre_name = mitre.get("name", "Unknown Technique")
    mitre_tactic = mitre.get("tactic", "Unknown Tactic")
    mitre_conf = mitre.get("confidence", 40)

    # -----------------------------
    # 🔵 AI-Readable VirusTotal Fields
    # -----------------------------
    vt_mal = vt.get("malicious", 0)
    vt_susp = vt.get("suspicious", 0)
    vt_clean = vt.get("clean", 0)
    vt_score = vt.get("community_score", 0)
    vt_vendor_count = vt.get("malicious_vendors_count", "N/A")

    # -----------------------------
    # 🔵 Build Final Prompt
    # -----------------------------
    return f"""
You are a Senior SOC Level 1 Cybersecurity Analyst specializing in rapid alert triage, behavioral threat analysis, and intelligence-driven decision-making.

Your primary responsibility is to analyze this alert based on its context.  
MITRE ATT&CK and VirusTotal data are provided only as optional enrichment:
- Use them only if they logically match the alert behavior.
- If they do not clearly apply, ignore them completely.
- Never force irrelevant or misleading intelligence into your analysis.

All final conclusions must be accurate, concise, SOC-ready, and must fill every required field with meaningful content.

IMPORTANT RULES:
- Output MUST contain ONLY the 6 required fields listed below.
- No extra words, no explanations, no markdown.
- Keep answers short, clear, and SOC-friendly.
- DO NOT repeat the alert description.
- DO NOT leave any field empty or N/A.
- Use the MITRE + VirusTotal data logically to produce the best analysis.

========================
ALERT CONTEXT
========================
Description: {alert.get("description")}
User: {alert.get("username")}
Source IP: {alert.get("source_ip")}
Location: {alert.get("location")}

========================
MITRE ATT&CK (AI-usable)
========================
Technique ID: {mitre_id}
Technique Name: {mitre_name}
Threat Impact: {mitre_tactic}
AI Confidence: {mitre_conf}%

========================
VIRUSTOTAL (AI-usable)
========================
Malicious Vendors: {vt_vendor_count}
Community Score: {vt_score}
Malicious (Red Flags): {vt_mal}
Suspicious (Yellow Flags): {vt_susp}
Clean (Green Flags): {vt_clean}

========================
REQUIRED OUTPUT FORMAT
========================
Risk Score: <1-10 ONLY>
MITRE ATT&CK Technique: <ID + Name>
Behavioral Pattern: <short clear behavior>
Evidence Needed: <list of evidence>
IR Action: <specific SOC action>
AI Recommendation: <Ignore / Monitor / Escalate + reason>

""".strip()
