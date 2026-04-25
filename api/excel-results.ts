import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as XLSX from 'xlsx';

// ──────────────────────────────────────────────
// CONFIGURATION
// Set EXCEL_PUBLISHED_URL in Vercel Environment Variables
// once the president generates the Publish-to-Web URL from:
//   File → Share → Embed → Generate (in SharePoint / Excel Online)
// ──────────────────────────────────────────────
const PUBLISHED_URL = process.env.EXCEL_PUBLISHED_URL || '';

// How long to cache the response (seconds). 60s = results update within 1 min.
const CACHE_TTL = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers — allow the frontend to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── Guard: URL not yet configured ──────────────────────────────────────────
  if (!PUBLISHED_URL) {
    return res.status(503).json({
      error: 'EXCEL_PUBLISHED_URL is not set.',
      message:
        'The tournament spreadsheet has not been linked yet. ' +
        'The president needs to generate a Publish-to-Web URL from ' +
        'File → Share → Embed in SharePoint / Excel Online.',
      data: null,
    });
  }

  try {
    // ── Fetch the Excel binary ─────────────────────────────────────────────
    const response = await fetch(PUBLISHED_URL, {
      headers: {
        // Some SharePoint endpoints require an Accept header
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
      },
      // Node 18+ fetch — no timeout built in, wrap in AbortController
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Failed to fetch spreadsheet: HTTP ${response.status}`,
        message:
          response.status === 403
            ? 'The spreadsheet URL may have expired or been revoked. Ask the president to regenerate the Publish-to-Web link.'
            : `Upstream error ${response.status}.`,
        data: null,
      });
    }

    const buffer = await response.arrayBuffer();

    // ── Parse workbook ────────────────────────────────────────────────────
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

    // Return a list of all sheet names so we can debug the structure
    const sheetNames = workbook.SheetNames;

    // ── Extract each sheet into JSON ──────────────────────────────────────
    const sheets: Record<string, unknown[]> = {};
    for (const name of sheetNames) {
      sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
        defval: '',   // empty cells → empty string (not undefined)
        raw: false,   // dates as strings, not serial numbers
      });
    }

    // ── Cache header — Vercel edge will respect this ──────────────────────
    res.setHeader(
      'Cache-Control',
      `s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 5}`
    );

    return res.status(200).json({
      lastFetched: new Date().toISOString(),
      sheets: sheetNames,
      data: sheets,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[excel-results] Error:', message);

    return res.status(500).json({
      error: 'Internal server error while fetching spreadsheet.',
      detail: message,
      data: null,
    });
  }
}
