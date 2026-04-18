// src/pages/AyurvedaPage.jsx
import { useState } from 'react';
import { useCycle } from '@/context/CycleContext';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/layout/PageHeader';
import clsx from 'clsx';

const HERBS = [
  { name: 'Shatavari',   emoji: '🌿', benefit: 'Hormonal balance',  dose: '1 tsp with milk',  color: '#7FAF8B' },
  { name: 'Ashwagandha', emoji: '🌱', benefit: 'Stress relief',     dose: '500mg daily',      color: '#B8A9C9' },
  { name: 'Brahmi',      emoji: '🍃', benefit: 'Mental clarity',    dose: '1 tsp as tea',     color: '#7FB3D3' },
  { name: 'Lodhra',      emoji: '🌸', benefit: 'Menstrual health',  dose: 'With honey',       color: '#E8647A' },
  { name: 'Triphala',    emoji: '🫙', benefit: 'Gut health',        dose: '1 tsp at night',   color: '#F4A97F' },
  { name: 'Turmeric',    emoji: '🟡', benefit: 'Anti-inflammatory', dose: '1 tsp golden milk', color: '#F4D03F' },
];

const DINACHARYA = [
  { time: '6:00 AM',  title: 'Warm Water + Honey',     desc: 'Start day with warm water and 1 tsp honey',       icon: '💧' },
  { time: '6:30 AM',  title: 'Abhyanga (Self-Massage)', desc: 'Warm coconut oil massage for 10 minutes',          icon: '🫧' },
  { time: '7:00 AM',  title: 'Pranayama',              desc: 'Sheetali (cooling breath) for 5 minutes',          icon: '🧘' },
  { time: '7:30 AM',  title: 'Yoga',                   desc: 'Gentle asanas suited for your current phase',      icon: '🤸' },
  { time: '9:00 PM',  title: 'Golden Milk',            desc: 'Warm turmeric milk before bed for better sleep',   icon: '🥛' },
];

const YOGA = [
  { name: 'Moon Salutation', duration: '15 min', type: 'Cooling', phase: 'ovulation', emoji: '🌙' },
  { name: "Child's Pose",    duration: '10 min', type: 'Restorative', phase: 'menstrual', emoji: '🤲' },
  { name: 'Cat-Cow Stretch', duration: '8 min',  type: 'Pain relief', phase: 'menstrual', emoji: '🐱' },
  { name: 'Sun Salutation',  duration: '20 min', type: 'Energising', phase: 'follicular', emoji: '☀️' },
  { name: 'Butterfly Pose',  duration: '10 min', type: 'Fertility',  phase: 'follicular', emoji: '🦋' },
  { name: 'Supported Bridge', duration: '12 min',type: 'Hormone balance', phase: 'luteal', emoji: '🌉' },
];

const DOSHA_QUIZ = [
  { q: 'Your body frame is…',          opts: ['Thin/light', 'Medium/muscular', 'Larger/sturdy'] },
  { q: 'Your skin tends to be…',        opts: ['Dry/rough', 'Warm/oily', 'Smooth/moist'] },
  { q: 'Your energy level is…',         opts: ['Variable', 'Intense', 'Steady/slow'] },
  { q: 'You handle stress by…',         opts: ['Worrying/anxious', 'Irritable/intense', 'Withdrawing/slow'] },
];

export default function AyurvedaPage() {
  const { cycleInfo, phaseInfo } = useCycle();
  const { user } = useAuth();
  const [tab, setTab]       = useState('daily');
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [dosha, setDosha]   = useState(
    user?.healthProfile?.dosha || { vata: 30, pitta: 50, kapha: 20 }
  );

  const dominantDosha = Object.entries(dosha).sort((a, b) => b[1] - a[1])[0][0];

  const calcDosha = () => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(quizAnswers).forEach(i => {
      if (i === 0) counts.vata++;
      if (i === 1) counts.pitta++;
      if (i === 2) counts.kapha++;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    setDosha({
      vata:  Math.round((counts.vata / total)  * 100),
      pitta: Math.round((counts.pitta / total) * 100),
      kapha: Math.round((counts.kapha / total) * 100),
    });
    setQuizOpen(false);
  };

  const TABS = ['daily', 'herbs', 'yoga'];

  return (
    <div className="fade-in-up">
      <PageHeader title="Ayurveda" subtitle="Ancient wisdom for modern wellness" />

      {/* Dosha card */}
      <div className="card mx-5 mb-5 bg-gradient-to-br from-sage-light to-lilac-light">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">Your Dosha</p>
            <h3 className="font-display text-xl font-bold text-charcoal capitalize">
              {dominantDosha}-{Object.entries(dosha).sort((a,b)=>b[1]-a[1])[1][0]}
            </h3>
          </div>
          <button onClick={() => setQuizOpen(q => !q)}
            className="text-xs text-rose font-medium border border-rose px-3 py-1.5 rounded-xl">
            Retake Quiz
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(dosha).map(([d, val]) => (
            <div key={d}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="capitalize font-medium text-charcoal">{d}</span>
                <span className="text-gray-500">{val}%</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                     style={{ width: `${val}%`, background: d==='vata'?'#B8A9C9':d==='pitta'?'#E8647A':'#7FAF8B' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      {quizOpen && (
        <div className="card mx-5 mb-4 fade-in-up">
          <h3 className="font-display font-semibold text-charcoal mb-4">🔮 Dosha Quiz</h3>
          <div className="space-y-4">
            {DOSHA_QUIZ.map((q, qi) => (
              <div key={qi}>
                <p className="text-sm font-medium text-charcoal mb-2">{q.q}</p>
                <div className="space-y-1.5">
                  {q.opts.map((opt, oi) => (
                    <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={clsx('w-full text-left px-3 py-2 rounded-xl text-sm border transition-all',
                        quizAnswers[qi] === oi
                          ? 'border-rose bg-rose-light text-rose'
                          : 'border-gray-200 text-gray-600 hover:border-rose/30')}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={calcDosha} disabled={Object.keys(quizAnswers).length < DOSHA_QUIZ.length}
            className="btn-primary w-full mt-4 flex justify-center">
            Calculate Dosha
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mx-5 mb-4 bg-gray-100 p-1 rounded-2xl">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('flex-1 py-2 text-xs font-medium rounded-xl capitalize transition-all',
              tab === t ? 'bg-white text-rose shadow-sm' : 'text-gray-400')}>
            {t === 'daily' ? '🕐 Daily Routine' : t === 'herbs' ? '🌿 Herbs' : '🧘 Yoga'}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <div className="px-5 space-y-3 pb-4">
          <div className="card mb-2 bg-sage-light/60">
            <p className="text-sm font-medium text-sage-dark">
              ☯️ Balance {dominantDosha.charAt(0).toUpperCase() + dominantDosha.slice(1)} Energy
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dominantDosha === 'pitta'
                ? 'Focus on cooling foods and avoid spicy meals to maintain balance.'
                : dominantDosha === 'vata'
                ? 'Warm, grounding foods and regular routine help stabilize Vata.'
                : 'Light, stimulating foods and exercise help balance Kapha.'}
            </p>
          </div>
          {DINACHARYA.map(d => (
            <div key={d.title} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-16 text-right">
                <p className="text-xs text-gray-400 font-medium">{d.time}</p>
              </div>
              <div className="flex-shrink-0 w-8 h-8 bg-sage-light rounded-xl flex items-center justify-center">
                {d.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{d.title}</p>
                <p className="text-xs text-gray-400">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'herbs' && (
        <div className="px-5 space-y-3 pb-4">
          {HERBS.map(h => (
            <div key={h.name} className="card flex items-start gap-3"
                 style={{ borderLeft: `4px solid ${h.color}` }}>
              <span className="text-2xl">{h.emoji}</span>
              <div>
                <p className="font-semibold text-charcoal text-sm">{h.name}</p>
                <p className="text-xs text-gray-400">{h.benefit}</p>
                <p className="text-xs font-medium mt-1" style={{ color: h.color }}>
                  Dose: {h.dose}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'yoga' && (
        <div className="px-5 space-y-3 pb-4">
          {YOGA.map(y => (
            <div key={y.name} className={clsx('card border-2 transition-all',
              cycleInfo?.phase === y.phase ? 'border-rose' : 'border-transparent')}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-rose-light rounded-2xl flex items-center justify-center text-xl">
                  {y.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-charcoal text-sm">{y.name}</p>
                    {cycleInfo?.phase === y.phase && (
                      <span className="badge bg-rose text-white">Recommended</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{y.duration} • {y.type}</p>
                  <p className="text-xs text-gray-300 capitalize mt-0.5">Best for {y.phase} phase</p>
                </div>
                <button className="w-8 h-8 bg-rose rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs">▶</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
