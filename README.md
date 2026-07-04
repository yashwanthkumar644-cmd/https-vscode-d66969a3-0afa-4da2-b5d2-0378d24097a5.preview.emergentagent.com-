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
- Update a lead's `stage` to `MEETING_SCHEDULED` in `tracking/pipeline_status.csv`, filling in `meeting_datetime_ist` (format `YYYY-MM-DD HH:MM`) and `meeting_location_or_link`.
- `tracking/check_pipeline.py` scans for leads in `MEETING_SCHEDULED`/`CUSTOMER` that haven't been notified yet (`notified` column), and writes a `.ics` file to `tracking/calendar_invites/<lead_id>.ics` — double-click it (or import into Google Calendar) to add the event.
- A daily scheduled trigger ("Lead pipeline check-in", 9am) runs this script automatically, notifies you here when a lead goes hot, and marks it `notified` so you don't get duplicate pings.

To get real push-button Google Calendar event creation (no `.ics` step), connect a Google Calendar MCP/connector — then the same stage-change logic in `check_pipeline.py` can call it directly.

## Known limitations (current state)

- **Apollo.io search is blocked** on the connected account's free plan (both organization search and people search return `API_INACCESSIBLE`). Local business leads were sourced via web search instead of Apollo, and IT-gifting-company contact enrichment (finding the right person's email/phone) is not yet automated — upgrading the Apollo plan would unblock both `apollo_mixed_companies_search` and `apollo_mixed_people_api_search`.
- **No verified contact emails yet** for the seeded local business leads — phone numbers/addresses came from public listings (Tripadvisor, Sulekha, Justdial), but owner/manager email addresses need manual verification (business websites were bot-blocked from automated fetching). Draft email bodies are saved in `outreach/drafts_log/local_businesses/*.md` with `To: PENDING_VERIFICATION` — fill in the verified email and the bracketed offer line, then paste into Gmail to send.
- **No IT gifting companies have been promoted to `tracker.csv` yet** — the initial research pass only turned up unverified forum chatter (see `leads/it_gifting_companies/research_notes.md`). Promote a company once it has `likely`/`confirmed` evidence, then re-run enrichment (once Apollo search/enrichment is available on the account).
