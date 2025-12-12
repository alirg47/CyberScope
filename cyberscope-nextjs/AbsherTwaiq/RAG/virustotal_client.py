# ============================================================
# VirusTotal Client for SOAx
# Returns FULL VT data in VirusTotalSchema format:
# - AI fields (malicious, suspicious, clean, score)
# - UI fields (WHOIS, ASN, country, feeds...)
# ============================================================

import os
import requests
from datetime import datetime
from dotenv import load_dotenv

from framework.SOAx_data_schema import VirusTotalSchema

load_dotenv()
VT_API_KEY = os.getenv("VT_API_KEY")


class VTClient:

    def __init__(self):
        if not VT_API_KEY:
            raise Exception("VT_API_KEY not found in .env")

        self.base_url = "https://www.virustotal.com/api/v3"
        self.headers = {"x-apikey": VT_API_KEY}

    # ---------------------------------------------------------
    # WHOIS Parser
    # ---------------------------------------------------------
    def parse_whois(self, whois_raw):
        if not whois_raw or whois_raw == "N/A":
            return {}

        parsed = {}
        address_list = []

        for line in whois_raw.split("\n"):
            if ":" not in line:
                continue

            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()

            if k.lower() == "address":
                address_list.append(v)
            else:
                parsed[k] = v

        if address_list:
            parsed["address"] = address_list

        return parsed

    # ---------------------------------------------------------
    # Get comment count (for community feeds)
    # ---------------------------------------------------------
    def get_ip_comments_count(self, ip: str) -> int:
        url = f"{self.base_url}/ip_addresses/{ip}/comments"

        try:
            resp = requests.get(url, headers=self.headers)
            if resp.status_code != 200:
                return 0

            data = resp.json()
            meta = data.get("meta", {})

            if "count" in meta:
                return meta.get("count", 0)

            return len(data.get("data", []))

        except:
            return 0

    # ---------------------------------------------------------
    # MAIN ANALYSIS FUNCTION
    # ---------------------------------------------------------
    def scan_ip(self, ip: str) -> VirusTotalSchema:

        url = f"{self.base_url}/ip_addresses/{ip}"
        response = requests.get(url, headers=self.headers)

        if response.status_code != 200:
            return {
                "malicious": 0,
                "suspicious": 0,
                "clean": 0,
                "community_score": 0,
                "malicious_vendors_count": "0/0",

                "ip_address": ip,
                "asn": None,
                "organization": None,
                "country": None,
                "ip_range": None,
                "last_analysis_date": "N/A",
                "community_feeds": 0,
                "voting_details": 0,
                "comments_count": 0,
                "whois": {}
            }

        data = response.json()
        attr = data.get("data", {}).get("attributes", {})
        stats = attr.get("last_analysis_stats", {})

        # Count groups
        malicious = stats.get("malicious", 0) + stats.get("malware", 0)
        suspicious = stats.get("suspicious", 0) + stats.get("spam", 0)
        clean = stats.get("harmless", 0)

        total = sum(stats.values()) if stats else 0

        if total > 0:
            vendor_count_text = f"{malicious}/{total} vendors flagged"
        else:
            vendor_count_text = "0/0 vendors flagged"

        # Community Score (VT UI logic)
        votes = attr.get("total_votes", {})
        harmless_votes = votes.get("harmless", 0)
        malicious_votes = votes.get("malicious", 0)
        community_score = harmless_votes - malicious_votes

        # Voting + comments = community_feeds
        voting_details = harmless_votes + malicious_votes
        comments_count = self.get_ip_comments_count(ip)
        community_feeds = voting_details + comments_count

        # Basic info
        asn = attr.get("asn", None)
        org = attr.get("as_owner", None)
        country = attr.get("country", None)

        # Parse analysis time
        last_date = attr.get("last_analysis_date")
        if last_date:
            last_analysis = datetime.utcfromtimestamp(last_date).strftime("%Y-%m-%d %H:%M:%S")
        else:
            last_analysis = "N/A"

        # IP range
        network_info = attr.get("network", None)
        if isinstance(network_info, str) and "/" in network_info:
            ip_range = network_info
        else:
            try:
                p = ip.split(".")
                ip_range = f"{p[0]}.{p[1]}.{p[2]}.0/24"
            except:
                ip_range = "N/A"

        whois_raw = attr.get("whois", "")
        whois_parsed = self.parse_whois(whois_raw)

        # -----------------------------------------------------
        # RETURN DATA IN VirusTotalSchema FORMAT
        # -----------------------------------------------------
        return {
            # AI-usable fields
            "malicious": malicious,
            "suspicious": suspicious,
            "clean": clean,
            "community_score": community_score,
            "malicious_vendors_count": vendor_count_text,

            # UI fields
            "ip_address": ip,
            "asn": asn,
            "organization": org,
            "country": country,
            "ip_range": ip_range,
            "last_analysis_date": last_analysis,
            "community_feeds": community_feeds,
            "voting_details": voting_details,
            "comments_count": comments_count,
            "whois": whois_parsed
        }
