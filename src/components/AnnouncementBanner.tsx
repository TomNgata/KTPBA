import { useState, useEffect } from 'react';
import { X, AlertTriangle, Megaphone } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Announcement {
  id: string;
  title: string;
  body: string | null;
  type: 'general' | 'result' | 'urgent';
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedId = sessionStorage.getItem('ktpba_dismissed_announcement');

    async function fetchLatest() {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data } = await supabase
        .from('announcements')
        .select('id, title, body, type')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        if (data.id === dismissedId) {
          setDismissed(true);
        } else {
          setAnnouncement(data);
        }
      }
    }

    fetchLatest();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      sessionStorage.setItem('ktpba_dismissed_announcement', announcement.id);
    }
    setDismissed(true);
  };

  if (!announcement || dismissed) return null;

  const isUrgent = announcement.type === 'urgent';
  const isResult = announcement.type === 'result';

  return (
    <div className={cn(
      'relative z-50 w-full py-3 px-4',
      isUrgent ? 'bg-ktpba-red text-white' : isResult ? 'bg-ktpba-black text-white' : 'bg-amber-50 border-b border-amber-200 text-amber-900'
    )}>
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
        ) : (
          <Megaphone className="w-4 h-4 flex-shrink-0" />
        )}
        <div className="flex-1 flex items-center gap-3 text-sm font-bold">
          <span className="uppercase tracking-widest text-[10px] opacity-70 flex-shrink-0">
            {isUrgent ? 'URGENT' : isResult ? 'RESULT' : 'NOTICE'}
          </span>
          <span>{announcement.title}</span>
          {announcement.body && (
            <span className="opacity-70 font-normal hidden md:inline">· {announcement.body}</span>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
