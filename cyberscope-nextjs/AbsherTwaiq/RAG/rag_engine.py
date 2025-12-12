# =======================================================
# RAG/rag_engine.py
# SOAx Threat RAG Engine
# MITRE + VirusTotal unified enrichment
# Fully compatible with SOAx_data_schema.py
# =======================================================

from RAG.mitre_client import search_attack_technique
from RAG.virustotal_client import VTClient

from framework.SOAx_data_schema import (
    AlertSchema,
    MitreSchema,
    VirusTotalSchema
)


class ThreatRAG:

    def __init__(self):
        self.vt = VTClient()

    # ---------------------------------------------------
    # Enrich Alert with MITRE + VirusTotal (FULL DATA)
    # ---------------------------------------------------
    def enrich_alert(self, alert: AlertSchema) -> dict:

        description = alert.get("description", "")
        source_ip = alert.get("source_ip", "")

        # -----------------------
        # 🔥 MITRE ENRICHMENT
        # -----------------------
        mitre_raw = search_attack_technique(description)

        # Prepare normalized MITRE schema
        mitre: MitreSchema = {
            "id": mitre_raw.get("id"),
            "name": mitre_raw.get("name"),
            "tactic": mitre_raw.get("tactic"),
            "confidence": mitre_raw.get("confidence"),

            # UI-Only Fields
            "description": mitre_raw.get("description"),
            "mitigations": mitre_raw.get("mitigations", []),
            "detection": mitre_raw.get("detection", []),
            "references": mitre_raw.get("references", []),
        }

        # -----------------------
        # 🔥 VIRUSTOTAL ENRICHMENT
        # -----------------------
        vt_raw = self.vt.scan_ip(source_ip)

        vt: VirusTotalSchema = {
            # AI-Important Fields
            "malicious": vt_raw.get("malicious", 0),
            "suspicious": vt_raw.get("suspicious", 0),
            "clean": vt_raw.get("clean", 0),
            "community_score": vt_raw.get("community_score", 0),
            "malicious_vendors_count": vt_raw.get("malicious_vendors_count", "N/A"),

            # UI-Only Fields
            "ip_address": vt_raw.get("ip_address"),
            "asn": vt_raw.get("asn"),
            "organization": vt_raw.get("organization"),
            "country": vt_raw.get("country"),
            "ip_range": vt_raw.get("ip_range"),
            "last_analysis_date": vt_raw.get("last_analysis_date"),
            "community_feeds": vt_raw.get("community_feeds"),
            "voting_details": vt_raw.get("voting_details"),
            "comments_count": vt_raw.get("comments_count"),
            "whois": vt_raw.get("whois"),
        }

        # -----------------------
        # RETURN UNIFIED RESULT
        # -----------------------
        return {
            "original_alert": alert,
            "mitre": mitre,
            "virustotal": vt
        }
