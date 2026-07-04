# Drafts Log

Every Gmail draft created by this system is appended to `drafts.csv` in this folder (created on first draft): `lead_id, gmail_draft_id, to_email, subject, template_used, date_created`.

Drafts are never auto-sent. Review in Gmail, send manually, then log the outcome in `tracking/response_log.csv` and update `tracking/pipeline_status.csv`.
