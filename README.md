# KTPBA Teams Marathon 2026 — Workspace Transfer Pack

## Workspace Snapshot
- **Project name:** KTPBA Teams Marathon 2026
- **Repository / workspace name:** KTPBA
- **Main objective:** Official tournament management, standings app, and data ingestion layer for a 13-week bowling marathon in Nairobi.
- **Current status:** Frontend UI is robust. The app displays Matchups, Standings, and Schedules. Logic to parse complex Excel sheets and PDF fixtures into Supabase is actively being worked on.
- **Biggest risk:** Maintaining data accuracy when translating multi-sheet Excel workbooks (the source of truth) into structured Supabase database records.
- **Next immediate action:** Finalize the 60-second revalidation sync layer/script that continuously updates Supabase from the SharePoint Excel spreadsheet.

## 1. Project Overview
The KTPBA app tracks the "Teams Marathon 2026" bowling tournament held at Village Bowl. It must display Singles, Doubles (Baker's Style), and Teams formats over a 13-week period. It serves players needing live standings and administrators needing to ingest complex Excel/PDF scoring data into a modern dashboard.

## 2. Current State
A React/Vite Single Page Application (SPA) utilizing Tailwind CSS and Framer Motion. The core pages (`Home`, `Schedule`, `Standings`, `Results`) are built. There is a strong focus currently on data processing utilities (`pdf-parse`, `xlsx`) meant to extract scores from offline documents and push them to Supabase.

## 3. Workspace Map
- `src/App.tsx & main.tsx`: React router and application entry points.
- `src/pages/`: Core views including `Home`, `Admin/`, `Standings`, `ExcelResults`, `Schedule`, and `TeamDetail`.
- `src/components/`: Reusable UI elements (`MatchupCard`, `ShareableResultCard`, `TeamFormWidget`).
- `scripts/`: Data ingestion logic (e.g., `analyze-excel.cjs`).
- `metadata.json`: Workspace configuration file.

## 4. Technical Stack
- **Framework:** React 19 / Vite 6
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Data Parsing:** `xlsx`, `pdf-parse`
- **Database:** Supabase (`@supabase/supabase-js`, `@supabase/mcp-server-supabase`)
- **AI Integration:** Google GenAI (`@google/genai`) for match summaries.
- **Charts:** Recharts

## 5. Setup and Run Instructions
1. Install dependencies: `npm install`
2. Environment Setup: Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.
3. Start Development Server: `npm run dev`

## 6. What Is Already Working
- Responsive layout with custom KTPBA branding.
- Complex UI components for Matchups and Leaderboards.
- Shareable Result Cards (leveraging `html-to-image`).
- AI Match summary architecture.

## 7. What Is In Progress
- The `Admin/` data ingestion pipeline.
- Excel extraction utilities (`analyze-excel.cjs`) tailored to read specific spreadsheet formatting and map it to `schema.sql`.

## 8. Open Issues and Risks
- Ensuring the 60-second revalidation sync layer operates without hitting rate limits or corrupting local React state.
- Accurately parsing edge cases in the Excel spreadsheet (e.g., identical pinfall roll-off games).

## 9. Key Decisions and Conventions
- **Source of Truth:** A view-only SharePoint Excel spreadsheet acts as the master record. The app acts as an ingestion and presentation layer over it.
- **AI Tooling:** Gemini Flash is explicitly utilized to generate flavor text/summaries for matchups automatically to save manual PR effort.

## 10. External Dependencies and Integrations
- **Supabase:** PostgreSQL database and Auth.
- **Google GenAI:** For generative summaries.

## 11. Safe Handling Notes
- `.env` contains Supabase keys and a Gemini API Key. Do not expose `GEMINI_API_KEY` to the client bundle if it allows unrestricted access. Ensure admin routes are properly protected.

## 12. Resume Plan
1. **Audit Data Sync:** Review `scripts/analyze-excel.cjs` against `schema.sql` to ensure the parsed JSON perfectly matches Supabase DDL expectations.
2. **Test Sync Layer:** Run the data ingestion script locally to test the Upsert behavior into Supabase.
3. **Frontend Hydration:** Verify that `src/pages/Standings.tsx` properly fetches the newly ingested data from Supabase instead of relying on mock fixtures.

## 13. Minimal Handoff Summary
KTPBA is a React/Vite dashboard tracking a 13-week bowling tournament. The UI is built. The current focus is finalizing an ETL sync layer that reads complex Excel spreadsheets and pushes them to Supabase to serve live standings. Next step: execute and validate the Excel ingestion scripts.
