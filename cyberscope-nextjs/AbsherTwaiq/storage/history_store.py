# ================================================
# storage/history_store.py
# Unified History Writer for SOAx Platform
# Stores alert, MITRE, VirusTotal, and LLM output
# in the official schema format defined in SOAx_data_schema.py
# ================================================

import json
import os
from framework.SOAx_data_schema import (
    AlertSchema,
    MitreSchema,
    VirusTotalSchema,
    LLMResponseSchema,
    HistoryRecord
)

HISTORY_PATH = "storage/history.json"


def load_history() -> list:
    """Loads existing history or returns an empty list."""
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH, "r") as file:
            return json.load(file)
    return []


def save_to_history(
    alert: AlertSchema,
    mitre: MitreSchema,
    virustotal: VirusTotalSchema,
    llm_response: LLMResponseSchema
):
    """Stores a full analysis record into history.json"""

    os.makedirs("storage", exist_ok=True)

    # Load current history
    history = load_history()

    # Create unified SOAx history record
    entry: HistoryRecord = {
        "alert": alert,
        "mitre": mitre,
        "virustotal": virustotal,
        "llm_response": llm_response
    }

    # Append record
    history.append(entry)

    # Write back to file
    with open(HISTORY_PATH, "w") as file:
        json.dump(history, file, indent=2, ensure_ascii=False)

    return entry
