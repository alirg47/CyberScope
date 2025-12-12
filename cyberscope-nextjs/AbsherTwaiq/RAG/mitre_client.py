# ============================================================
# MITRE ATT&CK Client for SOAx (Smart Enriched Edition)
# - Intelligent Similarity Matching
# - Correct STIX Mitigation Extraction
# - Parent Technique Inheritance for Sub-Techniques
# ============================================================

from attackcti import attack_client
import difflib

# Initialize ATT&CK Client
lift = attack_client()
techniques = lift.get_techniques()


# ------------------------------------------------------------
# Extract tactic (kill-chain phase)
# ------------------------------------------------------------
def extract_tactic(technique: dict) -> str:
    phases = technique.get("kill_chain_phases", [])
    if phases:
        return phases[0].get("phase_name", "Unknown").title()
    return "Unknown"


# ------------------------------------------------------------
# Extract mitigations, detection, references
# ------------------------------------------------------------
def extract_extra_fields(technique: dict):
    mitigations = []
    detection = []
    references = []

    stix_id = technique.get("id", "")

    # --- References ---
    for ref in technique.get("external_references", []):
        url = ref.get("url")
        if url:
            references.append(url)

    # --- Detection (simple heuristic from description) ---
    desc = technique.get("description", "")
    if any(word in desc.lower() for word in ["detect", "monitor"]):
        detection.append(desc)

    # --- Mitigations via STIX relationships ---
    try:
        mitigation_objects = lift.get_mitigations_by_technique(stix_id)
        for m in mitigation_objects:
            txt = m.get("description") or m.get("name")
            if txt:
                mitigations.append(txt)
    except:
        pass

    return mitigations, detection, references


# ------------------------------------------------------------
# Helper: Get Parent Technique (for sub-techniques)
# ------------------------------------------------------------
def get_parent_technique(external_id: str):
    """
    Example:
        T1016.001 → T1016
        T1059.003 → T1059
    """
    if "." not in external_id:
        return None  # already a parent

    parent_id = external_id.split(".")[0]  # T1016
    for t in techniques:
        ext_refs = t.get("external_references", [{}])
        if ext_refs and ext_refs[0].get("external_id") == parent_id:
            return t

    return None


# ------------------------------------------------------------
# Compute similarity between keyword and technique fields
# ------------------------------------------------------------
def compute_similarity(keyword: str, technique: dict) -> float:
    name = technique.get("name", "").lower()
    desc = technique.get("description", "").lower()

    score_name = difflib.SequenceMatcher(None, keyword, name).ratio()
    score_desc = difflib.SequenceMatcher(None, keyword, desc).ratio()

    return max(score_name, score_desc)


# ------------------------------------------------------------
# MAIN: Smart MITRE Matching
# ------------------------------------------------------------
def search_attack_technique(keyword: str) -> dict:
    keyword = keyword.lower()
    best_match = None
    best_score = 0.0

    # --- 1) Find best matching technique ---
    for t in techniques:
        score = compute_similarity(keyword, t)
        if score > best_score:
            best_score = score
            best_match = t

    # --- 2) No good match ---
    if not best_match or best_score < 0.30:
        return {
            "id": "N/A",
            "name": "Unknown",
            "description": "No MITRE technique matched this keyword.",
            "tactic": "Unknown",
            "confidence": 40,
            "mitigations": [],
            "detection": [],
            "references": []
        }

    # --- 3) Extract main technique info ---
    ext = best_match.get("external_references", [{}])[0]
    external_id = ext.get("external_id", "N/A")
    name = best_match.get("name", "Unknown")
    description = best_match.get("description", "")
    tactic = extract_tactic(best_match)
    confidence = int(best_score * 100)

    # --- 4) Extract fields from the sub-technique ---
    mitigations, detection, references = extract_extra_fields(best_match)

    # --- 5) Smart Mode: Inherit from Parent if empty ---
    if (not mitigations or not detection) and "." in external_id:
        parent = get_parent_technique(external_id)
        if parent:
            pm, pd, pr = extract_extra_fields(parent)

            if not mitigations:
                mitigations = pm
            if not detection:
                detection = pd
            if not references:
                references = pr

    # --- 6) Return enriched technique ---
    return {
        "id": external_id,
        "name": name,
        "description": description,
        "tactic": tactic,
        "confidence": confidence,
        "mitigations": mitigations,
        "detection": detection,
        "references": references
    }
