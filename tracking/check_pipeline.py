#!/usr/bin/env python3
"""
Scans pipeline_status.csv for leads in a "hot" stage (MEETING_SCHEDULED or CUSTOMER)
that haven't been notified yet, prints a notification summary, and generates a
Google-Calendar-importable .ics file for any MEETING_SCHEDULED lead that has a
meeting_datetime_ist set.

Run manually, or via a scheduled trigger that asks Claude to run this and act on
the output (send a notification, mark `notified` = yes).

Usage: python3 tracking/check_pipeline.py
"""
import csv
import os
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
    if not os.path.exists(PIPELINE_CSV):
        print("No pipeline_status.csv found.")
        return

    with open(PIPELINE_CSV, newline="") as f:
        rows = list(csv.DictReader(f))

    to_notify = []
    for row in rows:
        if row.get("stage") in HOT_STAGES and row.get("notified", "no").lower() != "yes":
            to_notify.append(row)

    if not to_notify:
        print("Nothing new to notify.")
        return

    os.makedirs(INVITES_DIR, exist_ok=True)
    for row in to_notify:
        print(f"NOTIFY: {row['lead_id']} ({row['name']}) is now {row['stage']}.")
        dt_raw = row.get("meeting_datetime_ist", "").strip()
        if row["stage"] == "MEETING_SCHEDULED" and dt_raw:
            try:
                meeting_dt = datetime.strptime(dt_raw, "%Y-%m-%d %H:%M")
            except ValueError:
                print(f"  WARNING: could not parse meeting_datetime_ist '{dt_raw}' "
                      f"(expected 'YYYY-MM-DD HH:MM'), skipping .ics generation.")
                continue
            ics_path = os.path.join(INVITES_DIR, f"{row['lead_id']}.ics")
            with open(ics_path, "w") as f:
                f.write(make_ics(row["lead_id"], row["name"], meeting_dt,
                                  row.get("meeting_location_or_link", "")))
            print(f"  Calendar invite written to {ics_path} — import into Google Calendar.")


if __name__ == "__main__":
    main()
