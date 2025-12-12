# =======================================================
# framework/graph_definition.py
# SOAx Agent Graph Pipeline (MITRE + VT + LLM + History)
# Now fully compatible with SOAx_data_schema.py
# =======================================================

from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional

from RAG.rag_engine import ThreatRAG
from prompt_builder import build_prompt
from LLM import call_llm
from storage.history_store import save_to_history

from framework.SOAx_data_schema import (
    AlertSchema,
    MitreSchema,
    VirusTotalSchema,
    LLMResponseSchema,
    HistoryRecord
)


# -------------------------------
# Unified Agent State
# -------------------------------
class AlertState(TypedDict):
    alert: AlertSchema
    mitre: Optional[MitreSchema]
    virustotal: Optional[VirusTotalSchema]
    prompt: Optional[str]
    llm_response: Optional[LLMResponseSchema]


# -------------------------------
# Node 1: RAG Enrichment
# -------------------------------
def enrich_rag(state: AlertState) -> AlertState:
    rag = ThreatRAG()
    enriched = rag.enrich_alert(state["alert"])

    full_mitre = enriched["mitre"]
    full_vt = enriched["virustotal"]

    # -------------------------------
    # Prepare MITRE data for AI + UI
    # -------------------------------
    mitre: MitreSchema = {
        "id": full_mitre.get("id"),
        "name": full_mitre.get("name"),
        "tactic": full_mitre.get("tactic"),
        "confidence": full_mitre.get("confidence"),

        # UI-only fields
        "description": full_mitre.get("description"),
        "mitigations": full_mitre.get("mitigations", []),
        "detection": full_mitre.get("detection", []),
        "references": full_mitre.get("references", []),
    }

    # -------------------------------
    # Prepare VirusTotal data for AI + UI
    # -------------------------------
    vt: VirusTotalSchema = {
        # AI Use
        "malicious": full_vt.get("malicious"),
        "suspicious": full_vt.get("suspicious"),
        "clean": full_vt.get("clean"),
        "community_score": full_vt.get("community_score"),
        "malicious_vendors_count": full_vt.get("malicious_vendors_count"),

        # UI-Only
        "ip_address": full_vt.get("ip_address"),
        "asn": full_vt.get("asn"),
        "organization": full_vt.get("organization"),
        "country": full_vt.get("country"),
        "ip_range": full_vt.get("ip_range"),
        "last_analysis_date": full_vt.get("last_analysis_date"),
        "community_feeds": full_vt.get("community_feeds"),
        "voting_details": full_vt.get("voting_details"),
        "comments_count": full_vt.get("comments_count"),
        "whois": full_vt.get("whois"),
    }

    state["mitre"] = mitre
    state["virustotal"] = vt

    return state


# -------------------------------
# Node 2: Build SOC Prompt
# -------------------------------
def build_prompt_node(state: AlertState) -> AlertState:
    state["prompt"] = build_prompt({
        "alert": state["alert"],
        "mitre": state["mitre"],
        "virustotal": state["virustotal"]
    })
    return state


# -------------------------------
# Node 3: LLM Execution
# -------------------------------
def llm_node(state: AlertState) -> AlertState:
    raw = call_llm(state["prompt"])

    from prompt_generator import parse_llm_response

    raw = call_llm(state["prompt"])
    parsed = parse_llm_response(raw)
    state["llm_response"] = parsed


    state["llm_response"] = parsed
    return state


# Simple parser helper
def extract_value(label: str, text: str) -> str:
    try:
        part = text.split(label)[1].strip()
        return part.split("\n")[0].strip()
    except:
        return "N/A"


# -------------------------------
# Node 4: Save to History
# -------------------------------
def save_history_node(state: AlertState) -> AlertState:

    save_to_history(
        alert=state["alert"],
        mitre=state["mitre"],
        virustotal=state["virustotal"],
        llm_response=state["llm_response"]
    )

    return state


# -------------------------------
# Build the Graph
# -------------------------------
graph_builder = StateGraph(AlertState)

graph_builder.add_node("enrich_rag", enrich_rag)
graph_builder.add_node("build_prompt", build_prompt_node)
graph_builder.add_node("llm_call", llm_node)
graph_builder.add_node("save_history", save_history_node)

graph_builder.set_entry_point("enrich_rag")

graph_builder.add_edge("enrich_rag", "build_prompt")
graph_builder.add_edge("build_prompt", "llm_call")
graph_builder.add_edge("llm_call", "save_history")
graph_builder.add_edge("save_history", END)

graph = graph_builder.compile()
