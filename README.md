# Lead Generation & Outreach System

A working system for two lead-gen tracks, backed by Apollo.io (search/enrichment) and Gmail (drafts), organized as version-controlled data files in this repo.

## Structure

```
leads/
  local_businesses/         Local business leads (Bengaluru: restaurants, retail, salons)
    leads.csv
  it_gifting_companies/     IT companies that gift employees (India) — corporate gifting prospects
    tracker.csv
    research_notes.md
outreach/
  templates/                Reusable message templates per segment
  drafts_log/                Log of every Gmail draft created (id, recipient, date, status)
tracking/
  pipeline_status.csv        Single source of truth for every lead's stage + next action
  response_log.csv           Inbound replies / signals, keyed to lead id
```

## Pipeline stages

`NEW -> ENRICHED -> DRAFTED -> SENT -> REPLIED -> MEETING_SCHEDULED -> CUSTOMER -> LOST`

`tracking/pipeline_status.csv` is the single source of truth. Every lead in either `leads/` file gets one row here, keyed by `lead_id`.

## How outreach works

1. Leads land in `leads/local_businesses/leads.csv` or `leads/it_gifting_companies/tracker.csv` (via Apollo.io search/enrichment).
2. A personalized message is generated from the templates in `outreach/templates/` and saved as a **Gmail draft** (never auto-sent — draft-only mode per your instructions). Every draft is logged in `outreach/drafts_log/`.
3. You review and send drafts yourself from Gmail.
4. Replies get logged in `tracking/response_log.csv` and the lead's stage in `pipeline_status.csv` is updated.
5. When a lead reaches `MEETING_SCHEDULED` or `CUSTOMER`, see "Notifications & scheduling" below.

## IT gifting companies: how this track works

Apollo.io has no field for "gives employees gifts" — that's not enrichable data. `leads/it_gifting_companies/research_notes.md` is a **manual/ongoing research log**: candidates are added from news, Glassdoor/Fishbowl/LinkedIn posts, etc., each with a source link and a confidence rating (`unverified` / `likely` / `confirmed`). Only once a company has decent evidence does it get promoted into `tracker.csv` for actual contact enrichment (right HR/People-Ops person's email + phone via Apollo) and outreach.

Initial research pass turned up mostly anecdotal forum chatter (Glassdoor/Quora/Fishbowl), not hard confirmations — see `research_notes.md` for sources and caveats. Treat every row as a lead to verify, not a confirmed fact.

## Notifications & Google Calendar scheduling

No Google Calendar integration is connected in this environment, so meeting scheduling can't be pushed live to your calendar automatically. Workaround implemented here:
- When a lead is marked `MEETING_SCHEDULED` or `CUSTOMER` in `pipeline_status.csv`, an `.ics` calendar-invite file is generated in `tracking/calendar_invites/` that you can double-click / import into Google Calendar (or it can be emailed to you as an attachment-equivalent link).
- A recurring check-in is the mechanism for "notify me": ask to set up a scheduled trigger that re-reads `pipeline_status.csv` and messages you when any lead crosses into a hot stage.

To get real push-button Google Calendar event creation, connect a Google Calendar MCP/connector — then this same stage-change logic can call it directly instead of generating `.ics` files.
