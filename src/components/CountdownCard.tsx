import { useState, useEffect, useRef } from 'react';
import { Clock, Share2, Calendar } from 'lucide-react';
import ShareModal from './ShareModal';
import { shareText } from '../lib/share';

interface NextMatch {
  weekNumber: number;
  playDate: string;
  dayOfWeek: string;
}

export default function CountdownCard({ nextMatch }: { nextMatch: NextMatch | null }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [frozenTime, setFrozenTime] = useState<typeof timeLeft | null>(null);

  useEffect(() => {
    if (!nextMatch) return;

    const target = new Date(nextMatch.playDate + 'T18:45:00'); // 6:45 PM match start

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  const fmt = (n: number) => String(n).padStart(2, '0');
  const display = frozenTime ?? timeLeft;

  const handleShare = () => {
    setFrozenTime(timeLeft); // Freeze the snapshot
    setShareOpen(true);
  };

  if (!nextMatch) return null;

  const formattedDate = new Date(nextMatch.playDate).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const countdownStr = `${display.days}d ${fmt(display.hours)}h ${fmt(display.minutes)}m`;

  return (
    <>
      {/* Visible countdown widget on the page */}
      <div className="bg-ktpba-black text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ktpba-red/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-ktpba-red" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Next Match Night</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-ktpba-red text-gray-400 hover:text-ktpba-red transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Hype
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-ktpba-red" />
            <span className="font-display font-bold text-lg uppercase tracking-tight">{formattedDate} · 6:45 PM</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Days', value: display.days },
              { label: 'Hours', value: display.hours },
              { label: 'Mins', value: display.minutes },
              { label: 'Secs', value: display.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-black text-ktpba-red leading-none tabular-nums">
                  {fmt(value)}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IG/Share card — hidden off-screen */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '600px',
          height: '600px',
          background: '#111111',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Red top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#D32F2F' }} />

        <div style={{ color: '#D32F2F', fontSize: '11px', fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '20px' }}>
          KTPBA Teams Marathon 2026
        </div>

        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '40px' }}>
          Next Match Night
        </div>

        {/* Countdown grid */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Days', value: display.days },
            { label: 'Hours', value: display.hours },
            { label: 'Mins', value: display.minutes },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ border: '2px solid rgba(211,47,47,0.4)', padding: '20px 16px' }}>
                <div style={{ color: '#D32F2F', fontSize: '64px', fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(value)}
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '8px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: 'white', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          {formattedDate}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          6:45 PM · Village Bowl, Nairobi
        </div>

        {/* Bottom strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: '#D32F2F', fontSize: '11px', fontWeight: 900, letterSpacing: '0.2em' }}>KTPBA</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700 }}>ktpba.vercel.app</div>
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => { setShareOpen(false); setFrozenTime(null); }}
        cardRef={cardRef as React.RefObject<HTMLElement>}
        filename="ktpba-countdown"
        shareTitle="KTPBA Match Night Countdown"
        shareText={shareText.countdown(countdownStr, formattedDate)}
        shareUrl="https://ktpba.vercel.app"
      />
    </>
  );
}
