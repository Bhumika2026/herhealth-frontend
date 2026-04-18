// src/pages/MoodPage.jsx
import { useState, useEffect } from 'react';
import { MOOD_EMOJIS, MOOD_COLORS, capitalize } from '@/utils/helpers';
import api from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import clsx from 'clsx';

const MOODS = Object.keys(MOOD_EMOJIS);

const ENERGY_LABELS = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

const EMOTION_TAGS = [
  'Peaceful', 'Motivated', 'Creative', 'Stressed', 'Connected',
  'Disconnected', 'Confident', 'Insecure', 'Grateful', 'Resentful',
  'Excited', 'Bored', 'Loved', 'Neglected', 'Proud',
];

export default function MoodPage() {
  const [selected, setSelected]   = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [energy, setEnergy]       = useState(3);
  const [emotions, setEmotions]   = useState([]);
  const [note, setNote]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [tab, setTab]             = useState('log'); // 'log' | 'history'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/mood/history?days=14');
      setHistory(data.logs || []);
    } catch {}
  };

  const toggleEmotion = (e) => setEmotions(prev =>
    prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
  );

  const submit = async () => {
    if (!selected) return toast.error('Please select a mood first');
    setLoading(true);
    try {
      await api.post('/mood/log', { mood: selected, intensity, energy, emotions, note });
      toast.success('Mood logged! 🌸');
      setSelected(null); setNote(''); setEmotions([]);
      fetchHistory();
    } catch {
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up">
      <PageHeader title="Mood Tracker" subtitle="How are you feeling today?" />

      {/* Tabs */}
      <div className="flex gap-1 mx-5 mb-5 bg-gray-100 p-1 rounded-2xl">
        {['log', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('flex-1 py-2 text-sm font-medium rounded-xl transition-all',
              tab === t ? 'bg-white text-rose shadow-sm' : 'text-gray-400')}>
            {t === 'log' ? '✏️ Log Mood' : '📊 History'}
          </button>
        ))}
      </div>

      {tab === 'log' ? (
        <div className="px-5 space-y-5">
          {/* Mood Grid */}
          <div className="card">
            <h3 className="font-display font-semibold text-charcoal mb-4">Select your mood</h3>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setSelected(m)}
                  className={clsx('flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 transition-all',
                    selected === m ? 'border-rose bg-rose-light scale-105' : 'border-transparent bg-gray-50 hover:bg-gray-100')}>
                  <span className="text-2xl">{MOOD_EMOJIS[m]}</span>
                  <span className="text-[10px] font-medium text-gray-500 capitalize leading-tight text-center">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <>
              {/* Intensity */}
              <div className="card">
                <h3 className="font-display font-semibold text-charcoal mb-3">
                  {MOOD_EMOJIS[selected]} How intense is this feeling?
                </h3>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} onClick={() => setIntensity(i)}
                      className={clsx('flex-1 h-10 rounded-xl text-sm font-bold border-2 transition-all',
                        intensity >= i
                          ? 'border-rose text-rose bg-rose-light'
                          : 'border-gray-200 text-gray-300')}>
                      {i}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                  {ENERGY_LABELS[intensity - 1]}
                </p>
              </div>

              {/* Energy */}
              <div className="card">
                <h3 className="font-display font-semibold text-charcoal mb-3">⚡ Energy level</h3>
                <input type="range" min={1} max={5} value={energy}
                  onChange={e => setEnergy(Number(e.target.value))}
                  className="w-full accent-rose" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Exhausted</span><span>Energized</span>
                </div>
              </div>

              {/* Emotion Tags */}
              <div className="card">
                <h3 className="font-display font-semibold text-charcoal mb-3">🏷️ What else?</h3>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_TAGS.map(e => (
                    <button key={e} onClick={() => toggleEmotion(e)}
                      className={clsx('px-3 py-1 rounded-full text-xs font-medium border transition-all',
                        emotions.includes(e)
                          ? 'border-rose bg-rose text-white'
                          : 'border-gray-200 text-gray-500 hover:border-rose/40')}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="card">
                <h3 className="font-display font-semibold text-charcoal mb-3">📝 Journal note</h3>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  className="input resize-none h-24"
                  placeholder="How are you feeling? What's on your mind today…" />
              </div>

              <button onClick={submit} disabled={loading}
                className="btn-primary w-full flex justify-center items-center gap-2 mb-4">
                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                {loading ? 'Saving…' : `Save Mood ${MOOD_EMOJIS[selected]}`}
              </button>
            </>
          )}
        </div>
      ) : (
        /* History */
        <div className="px-5 space-y-3">
          {history.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-gray-400 text-sm">No mood logs yet. Start tracking!</p>
            </div>
          ) : (
            history.map(log => (
              <div key={log._id} className="card flex items-start gap-3"
                   style={{ borderLeft: `4px solid ${MOOD_COLORS[log.mood] || '#E8647A'}` }}>
                <span className="text-2xl">{MOOD_EMOJIS[log.mood]}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-charcoal capitalize">{log.mood}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </p>
                  </div>
                  {log.emotions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.emotions.map(e => (
                        <span key={e} className="badge bg-gray-100 text-gray-500">{e}</span>
                      ))}
                    </div>
                  )}
                  {log.note && <p className="text-xs text-gray-400 mt-1 italic">"{log.note}"</p>}
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">Intensity: {'★'.repeat(log.intensity)}{'☆'.repeat(5-log.intensity)}</span>
                    {log.energy && <span className="text-xs text-gray-400">Energy: {log.energy}/5</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
