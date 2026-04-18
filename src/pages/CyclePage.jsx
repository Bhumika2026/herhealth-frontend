// src/pages/CyclePage.jsx
import { useState } from 'react';
import { useCycle } from '@/context/CycleContext';
import PageHeader from '@/components/layout/PageHeader';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { formatDate } from '@/utils/helpers';

const FLOW_OPTIONS = [
  { id: 'spotting', label: 'Spotting', emoji: '💧' },
  { id: 'light',    label: 'Light',    emoji: '🩸' },
  { id: 'medium',   label: 'Medium',   emoji: '🩸🩸' },
  { id: 'heavy',    label: 'Heavy',    emoji: '🩸🩸🩸' },
];

const SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood Swings',
  'Breast Tenderness', 'Acne', 'Back Pain', 'Nausea', 'Insomnia',
  'Food Cravings', 'Hot Flashes', 'Light Sensitivity', 'Dizziness',
];

export default function CyclePage() {
  const { cycleInfo, phaseInfo, logPeriod, PHASE_INFO } = useCycle();
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({ startDate: '', flow: 'medium', symptoms: [], notes: '' });
  const [loading, setLoading] = useState(false);

  const toggle = (symptom) => setForm(p => ({
    ...p,
    symptoms: p.symptoms.includes(symptom)
      ? p.symptoms.filter(s => s !== symptom)
      : [...p.symptoms, symptom],
  }));

  const submit = async () => {
    if (!form.startDate) return toast.error('Please select start date');
    setLoading(true);
    try {
      await logPeriod(form);
      toast.success('Period logged! 🌸');
      setShowLog(false);
      setForm({ startDate: '', flow: 'medium', symptoms: [], notes: '' });
    } catch {
      toast.error('Failed to log period');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up">
      <PageHeader title="Cycle Tracker" subtitle="Track your menstrual health" />

      {/* Current phase */}
      {cycleInfo ? (
        <div className="mx-5 mb-5">
          <div className="rounded-3xl p-5 text-white relative overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${phaseInfo?.color}, ${phaseInfo?.color}aa)` }}>
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <p className="text-white/70 text-xs mb-1">Current Phase</p>
              <h2 className="font-display text-2xl font-bold mb-3">
                {phaseInfo?.emoji} {phaseInfo?.label} Phase
              </h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-white/60 text-xs">Cycle Day</p>
                  <p className="font-display text-2xl font-bold">{cycleInfo.dayOfCycle}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Period in</p>
                  <p className="font-display text-2xl font-bold">{cycleInfo.daysUntilPeriod}d</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Cycle</p>
                  <p className="font-display text-2xl font-bold">{cycleInfo.cycleLength}d</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Phase overview */}
      <div className="px-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-3">Cycle Phases</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PHASE_INFO).map(([phase, info]) => (
            <div key={phase}
                 className={clsx('p-3 rounded-2xl border-2 transition-all',
                   cycleInfo?.phase === phase ? 'border-rose' : 'border-transparent')}
                 style={{ backgroundColor: info.bg }}>
              <p className="text-lg mb-1">{info.emoji}</p>
              <p className="text-xs font-semibold text-charcoal">{info.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {phase === 'menstrual' ? 'Days 1–5' :
                 phase === 'follicular' ? 'Days 6–13' :
                 phase === 'ovulation' ? 'Days 14–16' : 'Days 17–28'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming predictions */}
      {cycleInfo?.predictions && (
        <div className="card mx-5 mb-5">
          <h3 className="font-display font-semibold text-charcoal mb-3">📅 Upcoming</h3>
          <div className="space-y-2">
            {[
              { label: '🌸 Next Period', date: cycleInfo.predictions.nextPeriod },
              { label: '✨ Ovulation', date: cycleInfo.predictions.ovulationDate },
              { label: '🌿 Fertile Window Start', date: cycleInfo.predictions.fertileStart },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal">
                  {item.date ? formatDate(item.date, 'MMM d') : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log button */}
      <div className="px-5">
        <button onClick={() => setShowLog(s => !s)} className="btn-primary w-full flex justify-center">
          {showLog ? 'Cancel' : '🩸 Log Period'}
        </button>
      </div>

      {/* Log form */}
      {showLog && (
        <div className="card mx-5 mt-4 fade-in-up">
          <h3 className="font-display font-semibold text-charcoal mb-4">Log Period</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Start Date</label>
              <input type="date" className="input"
                value={form.startDate} max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Flow</label>
              <div className="flex gap-2">
                {FLOW_OPTIONS.map(f => (
                  <button key={f.id} onClick={() => setForm(p => ({ ...p, flow: f.id }))}
                    className={clsx('flex-1 py-2 text-xs rounded-2xl border-2 transition-all',
                      form.flow === f.id ? 'border-rose bg-rose-light' : 'border-gray-200')}>
                    <div>{f.emoji}</div>
                    <div className="text-gray-500 mt-0.5">{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(s => (
                  <button key={s} onClick={() => toggle(s)}
                    className={clsx('px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                      form.symptoms.includes(s)
                        ? 'border-rose bg-rose text-white'
                        : 'border-gray-200 text-gray-500')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="input resize-none h-20" placeholder="Any additional notes…" />
            </div>

            <button onClick={submit} disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
              {loading ? 'Saving…' : 'Save Period Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
