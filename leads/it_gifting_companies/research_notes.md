# IT Gifting Companies — Research Log (India)

Goal: identify IT/tech companies operating in India that give employees gifts on joining (onboarding kits) or at festivals/other occasions, as prospects for corporate gifting outreach.

**Method note:** Apollo.io has no "gives employee gifts" field — it's not structured/enrichable data. This log is a running research trail: every candidate needs a source and a confidence rating before it's promoted into `tracker.csv` for contact enrichment + outreach. Confidence levels:
- `unverified` — a forum post or single anecdote, unconfirmed
- `likely` — multiple independent mentions, or a company blog/press mention
- `confirmed` — official company source (careers page, press release) or first-hand verified account

## Candidates found in initial pass (2026-07-04)

| Company | Occasion | What (reported) | Confidence | Source |
|---|---|---|---|---|
| Intel India | Joining | Laptop + charger as part of onboarding; bag not confirmed | unverified | [Glassdoor forum thread](https://www.glassdoor.co.in/Community/intel-corporation/hi-all-i-am-joining-intel-this-month-what-are-all-the-things-i-can-expect-as-a-welcome-kit-do-they-give-a-bag-pack-how-is-the) |
| Infosys | Diwali | Multiple accounts say Infosys does **not** give Diwali gifts/bonus — negative signal, exclude for now | confirmed (negative) | [Quora](https://www.quora.com/Does-Infosys-give-a-Diwali-bonus-to-its-employees), [Fishbowl](https://www.fishbowlapp.com/post/what-is-infosys-giving-for-diwali) |
| TCS / Capgemini | Diwali | Referenced in discussion thread but no specifics confirmed | unverified | [Quora](https://www.quora.com/What-gifts-do-MNCs-like-TCS-and-Capgemini-give-in-Diwali-to-their-employees) |
| SAP Labs India | General perks | Large India R&D center (8-10K employees); benefits page exists but no gift specifics found yet | unverified | [SAP Careers Benefits](https://www.sap.com/india/about/careers/joining/benefits.html), [Glassdoor Benefits](https://www.glassdoor.co.in/Benefits/SAP-India-Benefits-EI_IE10471.0,3_IL.4,9_IN115.htm) |
| Google India, Microsoft India, Amazon India | Diwali | Frequently asked about on Quora/Fishbowl but no confirmed specifics surfaced in this pass | unverified | [Quora thread](https://www.quora.com/Did-Google-Facebook-or-Amazon-in-India-give-Diwali-Bonus-or-gifts-to-their-employees) |

**Bottom line from this pass:** industry chatter suggests large IT *services* firms (TCS/Infosys/Wipro-style) have been scaling back festival gifting as they grew, while product companies / GCCs (Google, Microsoft, SAP Labs, Amazon India) and mid-size product/SaaS companies (Zoho, Freshworks, Razorpay, Postman) are the more promising segment to verify — but generic search didn't surface hard evidence for them either. None of the above should be treated as a confirmed prospect yet.

## Candidates found in second pass (2026-07-04, deeper research)

| Company | Occasion | What (reported) | Confidence | Source |
|---|---|---|---|---|
| Razorpay | Joining | Sends new joiners a customized welcome kit including branded cookies, each carrying a Razorpay company value; part of a documented remote-onboarding program | **confirmed** | [Razorpay's own blog](https://razorpay.com/blog/remote-onboarding-razorpay/) |
| Zoho | Joining | Zoho People's own HR blog discusses welcome kits as a standard part of pre-onboarding, but doesn't confirm Zoho itself sends one (it's guidance content, not a first-person account) | unverified | [Zoho People HR blog](https://www.zoho.com/people/hrknowledgehive/the-process-of-employee-onboarding.html) |

**Promoted to `tracker.csv`:** Razorpay (only candidate meeting the confirmed/likely bar so far). Contact person (HR/People Ops) not yet identified — needs Apollo enrichment (blocked on current plan) or manual LinkedIn/careers-page research.

No further evidence found for Freshworks, Chargebee, Postman, Zerodha, CRED, Swiggy, or Meesho in this pass — searches returned only generic third-party corporate-gifting-vendor content, not first-party confirmation.

## Better sources to check next (not yet done — needs a human researcher or authenticated access)
- LinkedIn: search "day 1 at [company]" / "onboarding kit" posts by employees — most concrete, photo evidence, but requires LinkedIn access this session doesn't have.
- Glassdoor / Fishbowl / AmbitionBox company-specific benefit pages (per-company, not generic search).
- Company careers/benefits pages directly (official = highest confidence).
- News coverage around Diwali/New Year each year ("X company gifts employees Y") — search fresh each festival season.
- Corporate gifting vendors' client/case-study pages (e.g. vendors who publicly name clients like Zoho, Freshworks) — treat as marketing, verify independently.

## Promotion rule
A company only moves into `tracker.csv` (and gets Apollo contact enrichment + outreach) once it has at least one `likely` or `confirmed` entry above. Update this file first, then run enrichment.
