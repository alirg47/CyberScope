# ================================================
# SOAx Unified Data Schema
# This file defines the official structure for:
# - Alert Input
# - MITRE ATT&CK Enrichment
# - VirusTotal Enrichment
# - AI (LLM) Analysis Output
# - Final Unified History Record
# ================================================

from typing import TypedDict, List, Optional


# -------------------------------
# 1) Alert Input Schema
# -------------------------------
class AlertSchema(TypedDict):
    description: str
    username: str
    source_ip: str
    location: str


# -------------------------------
# 2) MITRE ATT&CK Schema
# -------------------------------
class MitreSchema(TypedDict):
    id: str                       # Technique ID (used by AI)
    name: str                     # Technique Name (used by AI)
    tactic: str                   # Threat Impact (used by AI)
    confidence: int               # AI Confidence (used by AI)

    # Additional Details (UI Only)
    description: Optional[str]
    mitigations: Optional[List[str]]
    detection: Optional[List[str]]
    references: Optional[List[str]]


# -------------------------------
# 3) VirusTotal Schema
# -------------------------------
class VirusTotalSchema(TypedDict):
    # Used by AI Agent
    malicious: int
    suspicious: int
    clean: int
    community_score: int
    malicious_vendors_count: str

    # Additional Data (UI Only)
    ip_address: Optional[str]
    asn: Optional[int]
    organization: Optional[str]
    country: Optional[str]
    ip_range: Optional[str]
    last_analysis_date: Optional[str]
    community_feeds: Optional[int]
    voting_details: Optional[int]
    comments_count: Optional[int]
    whois: Optional[dict]


# -------------------------------
# 4) LLM Response Schema (6 fields)
# -------------------------------
class LLMResponseSchema(TypedDict):
    risk_score: str
    mitre: str
    behavior: str
    evidence: str
    ir_action: str
    recommendation: str


# -------------------------------
# 5) FINAL History Record Schema
# -------------------------------
class HistoryRecord(TypedDict):
    alert: AlertSchema
    mitre: MitreSchema
    virustotal: VirusTotalSchema
    llm_response: LLMResponseSchema


# -------------------------------
# Exported Schema
# -------------------------------
__all__ = [
    "AlertSchema",
    "MitreSchema",
    "VirusTotalSchema",
    "LLMResponseSchema",
    "HistoryRecord"
]
