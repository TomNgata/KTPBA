import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Trophy, RefreshCw, AlertCircle, Clock, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface ExcelApiResponse {
  lastFetched?: string;
  sheets?: string[];
  data?: Record<string, Record<string, unknown>[]>;
  error?: string;
  message?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook — polls the serverless function every 60 seconds
// ──────────────────────────────────────────────────────────────────────────────
function useExcelData(pollMs = 60_000) {
  const [response, setResponse] = useState<ExcelApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/excel-results');
      const json: ExcelApiResponse = await res.json();
      setResponse(json);
      setLastRefresh(new Date());
      if (json.error) setError(json.error);
    } catch (e) {
      setError('Network error — could not reach the results API.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, pollMs);
    return () => clearInterval(interval);
  }, [fetch_, pollMs]);

  return { response, loading, lastRefresh, error, refresh: fetch_ };
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-component — renders a single sheet as a scrollable table
// ──────────────────────────────────────────────────────────────────────────────
const SheetTable: React.FC<{
  name: string;
  rows: Record<string, unknown>[];
}> = ({ name, rows }) => {
  const [open, setOpen] = useState(true);

  if (!rows || rows.length === 0) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 bg-ktpba-black text-white font-display font-bold uppercase tracking-widest text-sm"
        >
          <span>{name}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {open && (
          <div className="border border-gray-200 p-8 text-center text-gray-400 text-sm">
            No data in this sheet.
          </div>
        )}
      </div>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="mb-10">
      {/* Sheet header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-ktpba-black text-white font-display font-bold uppercase tracking-widest text-sm hover:bg-ktpba-red transition-colors"
      >
        <span>{name}</span>
        <span className="flex items-center gap-3">
          <span className="text-gray-400 font-normal text-xs normal-case tracking-normal">
            {rows.length} rows
          </span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="overflow-x-auto border border-gray-200 border-t-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 hover:bg-red-50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-3 text-gray-700 whitespace-nowrap font-mono text-xs"
                    >
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────────────────────
export default function ExcelResults() {
  const { response, loading, lastRefresh, error, refresh } = useExcelData(60_000);

  const isPending = !response?.data && !error && !loading;
  const isNotConfigured =
    response?.error?.includes('EXCEL_PUBLISHED_URL') ||
    response?.message?.includes('not been linked');

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 border-4 border-ktpba-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-display uppercase tracking-widest text-sm">
            Fetching live data…
          </p>
        </div>
      </div>
    );
  }

  // ── Not yet configured (URL missing) ─────────────────────────────────────
  if (isNotConfigured || isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <PageHeader />
        <div className="max-w-2xl mx-auto mt-16">
          <div className="border-2 border-dashed border-gray-300 p-16 text-center">
            <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-widest text-gray-400 mb-4">
              Awaiting Connection
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              The live spreadsheet link hasn't been set up yet.
              The tournament administrator needs to generate a{' '}
              <span className="font-semibold text-gray-700">Publish-to-Web</span> URL from the
              official results spreadsheet.
            </p>
            <div className="mt-8 bg-gray-50 border border-gray-200 p-6 text-left text-xs text-gray-500 font-mono space-y-1">
              <p className="font-sans font-bold text-gray-700 text-xs uppercase tracking-wider mb-3">
                Admin Instructions
              </p>
              <p>1. Open the spreadsheet in Excel / SharePoint Online</p>
              <p>2. Click File → Share → Embed</p>
              <p>3. Click "Generate"</p>
              <p>4. Send the URL to the web developer</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error && !response?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <PageHeader />
        <div className="max-w-xl mx-auto mt-16">
          <div className="bg-red-50 border border-red-200 p-10 text-center">
            <AlertCircle className="w-12 h-12 text-ktpba-red mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold uppercase tracking-widest text-ktpba-red mb-3">
              Connection Error
            </h2>
            <p className="text-gray-600 text-sm mb-6">{response?.message || error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 bg-ktpba-red text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success state — render sheets ─────────────────────────────────────────
  const sheets = response?.data ?? {};
  const sheetNames = response?.sheets ?? Object.keys(sheets);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <PageHeader />

      {/* Metadata bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-6 text-xs text-gray-500">
          {lastRefresh && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {sheetNames.length} sheet{sheetNames.length !== 1 ? 's' : ''}
          </span>
          {/* Live pulse indicator */}
          <span className="flex items-center gap-1.5 text-green-600 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live — refreshes every 60s
          </span>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-ktpba-red transition-colors font-semibold uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh now
        </button>
      </div>

      {/* Sheets */}
      {sheetNames.length > 0 ? (
        sheetNames.map((name) => (
          <SheetTable key={name} name={name} rows={sheets[name] ?? []} />
        ))
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="font-display uppercase tracking-widest text-sm">
            The spreadsheet appears to be empty.
          </p>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Shared page header
// ──────────────────────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-1 bg-ktpba-red text-white font-display text-sm font-bold uppercase tracking-[0.3em] mb-6">
        Official Record
      </span>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase">
        LIVE <span className="text-ktpba-red">RESULTS</span>
      </h1>
      <p className="text-gray-500 max-w-2xl mx-auto text-lg">
        Data sourced directly from the tournament's official spreadsheet, updated
        automatically as the president records results.
      </p>
    </div>
  );
}
