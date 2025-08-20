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



---
---


# Lead Generation Application

A modern, AI-powered lead generation application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to scrape, validate, deduplicate, filter, and export leads with an intuitive and beautiful user interface.

## Features

### Core Functionality
- **Web Scraping**: Extract leads from websites using keywords or specific URLs
- **CSV Upload**: Import existing lead data from CSV files
- **Email Validation**: Comprehensive email validation including format checking and MX record verification
- **Lead Scoring**: AI-powered scoring system to rank lead quality
- **Deduplication**: Automatic removal of duplicate leads based on email addresses
- **Advanced Filtering**: Filter leads by status, score, company, and more
- **Export**: Export filtered leads to CSV format

### User Interface
- **Modern Design**: Clean, responsive interface with gradient backgrounds and smooth animations
- **Real-time Stats**: Live statistics showing lead quality metrics
- **Interactive Tables**: Sortable and filterable lead tables with bulk actions
- **Smart Filters**: Expandable filter panel with search and quick filters
- **Loading States**: Beautiful loading indicators and error handling

#### Application Screenshots

**Main Dashboard with Lead Generation Interface**
![Lead Generation Dashboard](Screenshot%202025-08-20%20at%2011.04.44%20PM.png)

**Lead Results Table with Filtering and Export Options**
![Lead Results Table](Screenshot%202025-08-20%20at%2011.07.07%20PM.png)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Heroicons
- **State Management**: React hooks (useState, useCallback)
- **API**: Next.js API routes
- **Email Validation**: Custom validation with DNS MX record checking

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leadgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Generate Leads
- **Keyword Search**: Enter keywords to scrape leads from various sources
- **URL Scraping**: Provide specific URLs to extract contact information
- **CSV Upload**: Upload existing lead data in CSV format with drag and drop support

### 2. Lead Processing
The application automatically processes leads through the following pipeline:
1. **Scraping/Import**: Collect lead data from various sources
2. **Validation**: Verify email addresses and check MX records
3. **Scoring**: Calculate lead quality scores based on multiple factors
4. **Deduplication**: Remove duplicate entries based on email addresses

### 3. Lead Management
- **View Statistics**: Monitor lead quality metrics in real-time
- **Apply Filters**: Use advanced filters to find specific leads
- **Sort Data**: Sort leads by name, company, email, score, or date
- **Bulk Actions**: Select multiple leads for bulk operations

### 4. Export Data
- **CSV Export**: Export filtered leads to CSV format
- **Automatic Naming**: Files are automatically named with timestamps
- **UTF-8 Encoding**: Proper encoding for international characters

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── scrape/route.ts      # Lead scraping API
│   │   ├── validate/route.ts    # Email validation API
│   │   ├── dedup/route.ts       # Deduplication API
│   │   └── export/route.ts      # Export API
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── UploadArea.tsx           # Data input component
│   ├── QuickStats.tsx           # Statistics display
│   ├── FiltersBar.tsx           # Filtering interface
│   └── LeadTable.tsx            # Lead data table
├── lib/
│   ├── email.ts                 # Email validation utilities
│   ├── scoring.ts               # Lead scoring algorithms
│   ├── csv.ts                   # CSV processing utilities
│   └── utils.ts                 # General utilities
└── types/
    └── lead.ts                  # TypeScript type definitions
```

## API Endpoints

### POST /api/scrape
Scrape leads from keywords or URLs
```json
{
  "keyword": "software company",
  "urls": ["https://example.com"]
}
```

### POST /api/validate
Validate email addresses and check MX records
```json
{
  "leads": [/* array of lead objects */]
}
```

### POST /api/dedup
Remove duplicate leads
```json
{
  "leads": [/* array of lead objects */],
  "key": "email"
}
```

### POST /api/export
Export leads to CSV format
```json
{
  "leads": [/* array of lead objects */],
  "format": "csv"
}
```

## Styling

The application uses Tailwind CSS for styling with:
- **Gradient Backgrounds**: Beautiful gradient overlays
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Mobile-first responsive layout
- **Modern Components**: Clean, professional interface elements
- **Color Coding**: Visual indicators for lead quality and status

## Testing

The application includes:
- **Mock Data Generation**: Realistic test data for development
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Proper loading indicators throughout the app
- **Edge Case Handling**: Validation for empty states and invalid inputs

## Deployment

The application is ready for deployment on Vercel:

1. **Connect to Vercel**
   ```bash
   vercel
   ```

2. **Configure Environment**
   - No additional environment variables required for basic functionality
   - Add any API keys for real web scraping services if needed

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Future Enhancements

- **Real Web Scraping**: Integration with actual web scraping services
- **XLSX Export**: Support for Excel file format
- **Email Templates**: Lead outreach email templates
- **CRM Integration**: Connect with popular CRM systems
- **Advanced Analytics**: Detailed lead analytics and reporting
- **Team Collaboration**: Multi-user support and sharing


