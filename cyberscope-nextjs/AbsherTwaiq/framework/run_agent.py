# ============================================================
# framework/run_agent.py
# SOAx Agent Runner
# Executes the full pipeline: RAG → Prompt → LLM → History
# Returns final state in unified schema format
# ============================================================

from framework.graph_definition import graph
from framework.SOAx_data_schema import (
    AlertSchema,
    HistoryRecord
)

from pprint import pprint


def run_alert(alert: AlertSchema) -> HistoryRecord:
    """
    Runs a single alert through the SOAx Agent Pipeline.
    
    Returns:
        Final state containing:
            - alert
            - mitre (full)
            - virustotal (full)
            - llm_response (6 fields)
    """

    print("\n🚀 Running SOAx Agent Pipeline...\n")

    result = graph.invoke({"alert": alert})

    # Normalize final JSON
    final_state: HistoryRecord = {
        "alert": result.get("alert"),
        "mitre": result.get("mitre"),
        "virustotal": result.get("virustotal"),
        "llm_response": result.get("llm_response")
    }

    print("✅ Final State:")
    pprint(final_state)

    return final_state


# ------------------------------------------------------------
# Manual Test (Optional)
# ------------------------------------------------------------
if __name__ == "__main__":

    sample_alert = {
        "description": "Multiple failed SSH login attempts detected on server.",
        "source_ip": "185.23.91.10",
        "username": "admin1",
        "location": "Riyadh Datacenter"
    }

    run_alert(sample_alert)
