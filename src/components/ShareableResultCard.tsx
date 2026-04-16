import React, { useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';
import { shareText } from '../lib/share';

interface ShareableResultCardProps {
  homeTeam: string;
  awayTeam: string;
  homePoints: number;
  awayPoints: number;
  homePinfall: number;
  awayPinfall: number;
  weekLabel: string;
  date: string;
  phase?: 'seeding' | 'regular';
}

export default function ShareableResultCard({
  homeTeam,
  awayTeam,
  homePoints,
  awayPoints,
  homePinfall,
  awayPinfall,
  weekLabel,
  date,
  phase = 'regular',
}: ShareableResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const isSeeding = phase === 'seeding';
  const winner = isSeeding
    ? (homePinfall > awayPinfall ? homeTeam : homePinfall < awayPinfall ? awayTeam : 'Draw')
    : (homePoints > awayPoints ? homeTeam : homePoints < awayPoints ? awayTeam : 'Draw');

  const resultCaption = isSeeding
    ? `${homeTeam} ${homePinfall} — ${awayPinfall} ${awayTeam}`
    : `${homeTeam} ${homePoints} — ${awayPoints} ${awayTeam}`;

  return (
    <>
      {/* The card that gets captured — always hidden below-screen */}
      <div
        ref={cardRef}
        className="absolute"
        style={{
          left: '-9999px',
          top: 0,
          width: '600px',
          height: '600px',
          background: '#111111',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top bar */}
        <div style={{ background: '#D32F2F', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'white', fontSize: '11px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            KTPBA Teams Marathon 2026
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {weekLabel} · {date}
          </span>
        </div>

        {/* Title */}
        <div style={{ padding: '28px 28px 16px', textAlign: 'center' }}>
          <div style={{ color: '#D32F2F', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
            {isSeeding ? 'Seeding Round Result' : 'Match Result'}
          </div>
          <div style={{ color: 'white', fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>
            Full Match Summary
          </div>
        </div>

        {/* Scoreboard */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: '0' }}>
          {/* Home Team */}
          <div style={{ flex: 1, textAlign: 'right', paddingRight: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {homeTeam === winner ? '🏆 Winner' : ''}
            </div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>{homeTeam}</div>
            {!isSeeding && (
              <div style={{ color: '#D32F2F', fontSize: '52px', fontWeight: 900, lineHeight: 1 }}>{homePoints}</div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 700 }}>{homePinfall.toLocaleString()} pins</div>
          </div>

          {/* VS Divider */}
          <div style={{ width: '2px', height: '120px', background: 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: '#111', border: '2px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 900,
              letterSpacing: '0.15em', padding: '6px 10px'
            }}>VS</div>
          </div>

          {/* Away Team */}
          <div style={{ flex: 1, textAlign: 'left', paddingLeft: '24px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {awayTeam === winner ? '🏆 Winner' : ''}
            </div>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>{awayTeam}</div>
            {!isSeeding && (
              <div style={{ color: '#D32F2F', fontSize: '52px', fontWeight: 900, lineHeight: 1 }}>{awayPoints}</div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 700 }}>{awayPinfall.toLocaleString()} pins</div>
          </div>
        </div>

        {/* Scoring system note */}
        {!isSeeding && (
          <div style={{ textAlign: 'center', padding: '0 28px 16px', color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Match Points out of 11 · Singles · Doubles · Teams
          </div>
        )}

        {/* Footer */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#D32F2F', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>KTPBA</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em' }}>ktpba.vercel.app</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700 }}>Village Bowl · Nairobi</div>
        </div>
      </div>

      {/* Share trigger button */}
      <button
        onClick={() => setShareOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-ktpba-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-ktpba-red transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        cardRef={cardRef as React.RefObject<HTMLElement>}
        filename={`ktpba-result-${weekLabel.toLowerCase().replace(/\s/g, '-')}`}
        shareTitle="KTPBA Match Result"
        shareText={shareText.matchResult({
          homeTeam,
          awayTeam,
          homePoints: homePoints || 0,
          awayPoints: awayPoints || 0,
          date
        })}
        shareUrl="https://ktpba.vercel.app/results"
      />
    </>
  );
}
