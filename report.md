# AI-Readiness LeadGen Prototype — 5-Hour Report (Detailed)

**Objective & Business Rationale**
Sales teams waste time on bad or duplicate contacts. Under a strict 5-hour cap, I prioritized **lead quality** (to cut bounce and save SDR time) and **throughput** (to process more lists fast). The product outputs a **clean, validated, de-duplicated, and scored** list that’s ready for CRM via one-click export.

---

## What I Built (Dual Approach)

### 1) Quality-First (depth on data quality)

* **Validation:** Email **format check** (regex) + **DNS MX lookup** (deliverability signal).
* **Deduplication:** By `email` (fallback: `domain+name`).
* **Scoring (rule-based):** Boost **senior roles** (Founder/CEO/VP Sales/Head of Growth), **good TLDs** (`.com`, `.io`, `.ai`), and **non-generic** mailboxes; penalize flags.
* **Smart Filters:** Senior roles only; Good TLDs; free-text search; sortable table.
* **Analytics:** Total leads, Valid (format), No-MX count, Duplicates, **Average Score**.
* **Export:** **Filtered CSV** (or All) for instant SDR handoff.

### 2) Quantity-Driven (breadth via mini-utilities)

* **URL List Checker:** Single **HEAD/GET** per URL (robots-friendly), parse title/meta, extract `mailto:`; then run the same quality pipeline.
* **CSV Header Mapper & Normalizer:** Align arbitrary headers to the canonical schema; trim/lowercase; flag missing columns.
* **Saved Filter Presets:** e.g., *Decision Makers + Good TLDs* for repeatable targeting.
* **Quick Stats Generator:** Batch KPIs (valid %, no-MX %, dupes removed) for easy reporting.

---

## Lead Generation Methods (3 Inputs)

### A) Keyword / Company Search

* **Input:** Sector/company keywords (e.g., “SaaS startup, fintech, AI tools”).
* **Behavior:** Seed candidate domains (demo/mock or user-provided), then **Normalize → Validate (format+MX) → Dedup → Score → Filter → Export**.
* **Best for:** Early discovery when you don’t yet have a list.

**API sketch**

```http
POST /api/scrape
{ "keyword": "SaaS startup, fintech" }
→ { "leads": [ { "name": "...", "company": "...", "domain": "...", "email": "..." } ] }
```

### B) URL List

* **Input:** Homepages/profile URLs.
* **Behavior:** Single-page check (status/title/meta/`mailto:`) → then **Validate, Dedup, Score, Filter, Export**.
* **Best for:** Fast triage of known companies without aggressive crawling.

**API sketch**

```http
POST /api/scrape
{ "urls": ["https://acme.io", "https://contoso.com"] }
→ { "leads": [ { "company": "Acme", "domain": "acme.io", "email": "info@acme.io" } ] }
```

### C) CSV Upload

* **Input:** Existing list (emails/domains/names/roles).
* **Behavior:** **Header Mapper → Normalize → Validate (format+MX) → Dedup → Score → Filter → Export (Filtered/All)**.
* **Best for:** Quickly cleaning and prioritizing third-party lists.

**Canonical schema**

```
name | role | company | domain | email | (optional: source, industry, country)
```

**Quality gates applied to all three:** Validation (regex + MX), Dedup, Scoring, Smart Filters, Export.

---

## Architecture & Flow

`Input (Keyword/URLs/CSV) → Normalize/Map → Validate (format + MX) → Dedup → Score → Filter/Sort → Export CSV`

* Single **Next.js + TypeScript** app (UI + API Routes) for rapid demo/deploy.
* Composable helpers: `validate`, `dedup`, `score`, `export`.
* MX used as a **deliverability signal**; SMTP ping intentionally omitted for speed and ethics.

**Data model**

```ts
{ name?, role?, company?, domain?, email?, source?, industry?, score?, flags?: string[] }
```

`flags`: `invalid_format`, `no_mx`, `duplicate`.

---

## UX & Product Decisions

* **Health cards**: Total, Valid (format), No-MX, Duplicates, Avg Score (with % bars).
* **Inline badges** next to emails: `Valid`, `MX`.
* **Smart Filters**: Senior roles, Good TLDs, free-text; column sorting.
* **Export Filtered**: Keeps SDRs focused on the highest-intent subset.
* **(Optional)** Saved presets for one-click repeatability.

---

## Functional Evaluation (demo dataset from screenshots)

* **9 total leads**, **Valid (format): 9 = 100%**, **No-MX: 4 (44.4%)**, **Duplicates: 0**, **Avg Score: 74/100**.
* **Time-to-CSV:** seconds for \~100–300 rows.
* **Outcome:** Cleaner lists, clearer prioritization, and faster handoff to outreach.

---

## Ethical Notes & Limits

* No aggressive crawling; uses user-provided inputs and single-page checks (respect **ToS/robots**).
* MX is strong but not definitive; SMTP validation is **out of scope** for this sprint.
* No CAPTCHA/anti-bot handling (can be added later with rate-limits/rotations).

---

## Next Steps

1. Optional SMTP verification (rate-limited) + bounce learning loop.
2. Open-source enrichment (industry/location) for better scoring.
3. Direct CRM exporters (HubSpot/Pipedrive) & webhooks.
4. Scoring calibration using reply/bounce labels over time.

---

## Tech & Links

* **Stack:** Next.js, TypeScript, DNS MX check, CSV util.
* **GitHub:** *<add repository URL>*
* **Demo Video (1–2 min):** *<add link>*

> Design choice: **Quality-First** increases conversion efficiency; **Quantity-Driven** adds lightweight utilities to maximize usable output—together delivering immediate sales impact within a 5-hour build.
