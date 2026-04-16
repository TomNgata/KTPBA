import { useState, useEffect } from 'react';
import { Megaphone, Plus, Eye, EyeOff, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSupabase } from '../../lib/supabase';

const getAdminClient = () => getSupabase();

type AnnouncementType = 'general' | 'result' | 'urgent';

interface Announcement {
  id: string;
  title: string;
  body: string | null;
  type: AnnouncementType;
  is_published: boolean;
  created_at: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: '',
    body: '',
    type: 'general' as AnnouncementType,
    is_published: true,
  });

  const fetchAll = async () => {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = getAdminClient();
    await supabase.from('announcements').insert(form);
    setSaved(true);
    setForm({ title: '', body: '', type: 'general', is_published: true });
    await fetchAll();
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePublish = async (id: string, current: boolean) => {
    const supabase = getAdminClient();
    await supabase.from('announcements').update({ is_published: !current }).eq('id', id);
    await fetchAll();
  };

  const handleDelete = async (id: string) => {
    const supabase = getAdminClient();
    await supabase.from('announcements').delete().eq('id', id);
    await fetchAll();
  };

  const typeColors: Record<AnnouncementType, string> = {
    general: 'bg-amber-100 text-amber-700',
    result: 'bg-blue-100 text-blue-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Megaphone className="w-7 h-7 text-ktpba-red" />
        <h1 className="text-3xl font-bold uppercase tracking-tighter">Announcements</h1>
      </div>

      {/* Create Form */}
      <div className="bg-white border border-gray-200 p-8 mb-10">
        <h2 className="font-display font-bold text-lg uppercase tracking-wider mb-6">New Announcement</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Match Night Reminder — Week 3"
              className="w-full border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-ktpba-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Body (optional)</label>
            <textarea
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              placeholder="Additional details displayed below the title..."
              rows={3}
              className="w-full border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-ktpba-red transition-colors resize-none"
            />
          </div>

          <div className="flex gap-6 flex-wrap">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Type</label>
              <div className="flex gap-2">
                {(['general', 'result', 'urgent'] as AnnouncementType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={cn(
                      'px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all',
                      form.type === t ? 'bg-ktpba-black text-white border-ktpba-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Visibility</label>
              <button
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all',
                  form.is_published ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-500'
                )}
              >
                {form.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {form.is_published ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={saving || !form.title.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-ktpba-red text-white font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Posting...' : saved ? 'Posted!' : 'Post Announcement'}
          </button>
        </div>
      </div>

      {/* Existing Announcements */}
      <h2 className="font-display font-bold text-lg uppercase tracking-wider mb-5">All Announcements</h2>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-ktpba-red" /></div>
      ) : announcements.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 p-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
          No announcements yet
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 p-6 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn('px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-sm', typeColors[a.type])}>
                    {a.type}
                  </span>
                  {!a.is_published && (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-sm bg-gray-100 text-gray-400">Draft</span>
                  )}
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="font-bold text-sm">{a.title}</p>
                {a.body && <p className="text-xs text-gray-500 mt-1">{a.body}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(a.id, a.is_published)}
                  className={cn(
                    'p-2 transition-colors rounded',
                    a.is_published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                  )}
                  title={a.is_published ? 'Unpublish' : 'Publish'}
                >
                  {a.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
