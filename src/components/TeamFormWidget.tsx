import React, { useRef, useState } from 'react';
import { Share2, TrendingUp } from 'lucide-react';
import ShareModal from './ShareModal';
import { shareText } from '../lib/share';
import { cn } from '../lib/utils';

interface FormResult {
  weekNumber: number;
  result: 'W' | 'L' | 'D';
  matchPoints: number;
  opponentName: string;
}

interface TeamFormWidgetProps {
  teamName: string;
  groupName: string;
  matchPoints: number;
  rank: number;
  form: FormResult[]; // Last N results, newest first
}

export default function TeamFormWidget({ teamName, groupName, matchPoints, rank, form }: TeamFormWidgetProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const last5 = form.slice(0, 5);
  const streak = (() => {
    if (!last5.length) return '';
    const type = last5[0].result;
    let count = 0;
    for (const r of last5) {
      if (r.result === type) count++;
      else break;
    }
    return `${type}${count}`;
  })();

  const badgeStyle = (r: 'W' | 'L' | 'D') => ({
    W: 'bg-green-500 text-white',
    L: 'bg-red-600 text-white',
    D: 'bg-gray-400 text-white',
  }[r]);

  const formBoxColor = (r: 'W' | 'L' | 'D') => ({
    W: '#22c55e',
    L: '#dc2626',
    D: '#9ca3af',
  }[r]);

  const shareCaption = shareText.form(teamName, streak || 'N/A', matchPoints);

  return (
    <>
      {/* Visible widget */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-ktpba-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Recent Form</span>
          </div>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ktpba-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-ktpba-red transition-colors"
          >
            <Share2 className="w-3 h-3" />
            Share Form
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {last5.length > 0 ? last5.map((r, i) => (
            <div key={i} className="text-center">
              <span className={cn('w-9 h-9 flex items-center justify-center font-black text-xs rounded-sm', badgeStyle(r.result))}>
                {r.result}
              </span>
              <span className="text-[8px] text-gray-400 font-bold mt-1 block">Wk{r.weekNumber}</span>
            </div>
          )) : (
            <span className="text-xs text-gray-400 italic">No results yet</span>
          )}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
          {streak && (
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Streak</span>
              <span className="font-display font-black text-xl text-ktpba-red">{streak}</span>
            </div>
          )}
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Match Pts</span>
            <span className="font-display font-black text-xl">{matchPoints}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Division Rank</span>
            <span className="font-display font-black text-xl">#{rank}</span>
          </div>
        </div>
      </div>

      {/* Shareable card — off-screen */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute', left: '-9999px', top: 0,
          width: '600px', height: '400px',
          background: '#111111', fontFamily: 'Inter, sans-serif',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ background: '#D32F2F', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase' }}>KTPBA Teams Marathon 2026</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Form Guide</span>
        </div>

        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Group {groupName}
            </div>
            <div style={{ color: 'white', fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '24px' }}>
              {teamName}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {last5.map((r, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', background: formBoxColor(r.result), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', color: 'white' }}>
                    {r.result}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, marginTop: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wk{r.weekNumber}</div>
                </div>
              ))}
              {last5.length < 5 && Array.from({ length: 5 - last5.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
            {streak && (
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '4px' }}>Current Streak</div>
                <div style={{ color: '#D32F2F', fontSize: '36px', fontWeight: 900 }}>{streak}</div>
              </div>
            )}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '4px' }}>Match Points</div>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: 900 }}>{matchPoints}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '4px' }}>Division Rank</div>
              <div style={{ color: 'white', fontSize: '36px', fontWeight: 900 }}>#{rank}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: '#D32F2F', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>KTPBA</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700 }}>ktpba.vercel.app</div>
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        cardRef={cardRef as React.RefObject<HTMLElement>}
        filename={`ktpba-form-${teamName.toLowerCase().replace(/\s/g, '-')}`}
        shareTitle={`${teamName} — KTPBA Form Guide`}
        shareText={shareCaption}
        shareUrl="https://ktpba.vercel.app/standings"
      />
    </>
  );
}
