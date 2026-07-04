#!/usr/bin/env python3
"""
Scans pipeline_status.csv for leads in a "hot" stage (MEETING_SCHEDULED or CUSTOMER).

This script only detects and reports — it has no Google API access itself. It's meant
to be run by Claude (via the daily "Lead pipeline check-in" trigger), which then:
  1. Reads this script's JSON output.
  2. For each lead needing a calendar event, calls the Google Calendar MCP tool
     (mcp__Google_Calendar__create_event) directly to create a real event, and writes
     the returned event id into `calendar_event_id`.
  3. Notifies the user for anything not yet `notified`, then marks it `notified=yes`.
  4. Falls back to generating a .ics file (via --ics) only if no Google Calendar
     connector is available in that session.

Usage:
  python3 tracking/check_pipeline.py            # print JSON of what needs action
  python3 tracking/check_pipeline.py --ics       # also write .ics fallback files
"""
import csv
import json
import os
import sys
import uuid
from datetime import datetime, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
PIPELINE_CSV = os.path.join(HERE, "pipeline_status.csv")
INVITES_DIR = os.path.join(HERE, "calendar_invites")

HOT_STAGES = {"MEETING_SCHEDULED", "CUSTOMER"}


def make_ics(lead_id, name, meeting_dt, location):
    dtstamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    dtstart = meeting_dt.strftime("%Y%m%dT%H%M%S")
    dtend = (meeting_dt + timedelta(minutes=30)).strftime("%Y%m%dT%H%M%S")
    uid = f"{lead_id}-{uuid.uuid4().hex}@lead-gen-outreach"
    return "\r\n".join([
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//lead-gen-outreach-system//EN",
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{dtstamp}",
        f"DTSTART;TZID=Asia/Kolkata:{dtstart}",
        f"DTEND;TZID=Asia/Kolkata:{dtend}",
        f"SUMMARY:Meeting with {name}",
        f"LOCATION:{location or ''}",
        f"DESCRIPTION:Lead {lead_id} ({name}) reached MEETING_SCHEDULED in the pipeline tracker.",
        "END:VEVENT",
        "END:VCALENDAR",
        "",
    ])


def main():
    write_ics = "--ics" in sys.argv

    if not os.path.exists(PIPELINE_CSV):
        print(json.dumps({"error": "pipeline_status.csv not found"}))
        return

    with open(PIPELINE_CSV, newline="") as f:
        rows = list(csv.DictReader(f))

    needs_notify = []
    needs_calendar_event = []
    for row in rows:
        stage = row.get("stage")
        if stage not in HOT_STAGES:
            continue
        if row.get("notified", "no").lower() != "yes":
            needs_notify.append(row["lead_id"])
        if (stage == "MEETING_SCHEDULED"
                and row.get("meeting_datetime_ist", "").strip()
                and not row.get("calendar_event_id", "").strip()):
            needs_calendar_event.append({
                "lead_id": row["lead_id"],
                "name": row["name"],
                "meeting_datetime_ist": row["meeting_datetime_ist"],
                "meeting_location_or_link": row.get("meeting_location_or_link", ""),
            })

    result = {
        "needs_notify": needs_notify,
        "needs_calendar_event": needs_calendar_event,
    }

    if write_ics and needs_calendar_event:
        os.makedirs(INVITES_DIR, exist_ok=True)
        for item in needs_calendar_event:
            try:
                meeting_dt = datetime.strptime(item["meeting_datetime_ist"], "%Y-%m-%d %H:%M")
            except ValueError:
                continue
            ics_path = os.path.join(INVITES_DIR, f"{item['lead_id']}.ics")
            with open(ics_path, "w") as f:
                f.write(make_ics(item["lead_id"], item["name"], meeting_dt,
                                  item["meeting_location_or_link"]))
            result.setdefault("ics_written", []).append(ics_path)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
