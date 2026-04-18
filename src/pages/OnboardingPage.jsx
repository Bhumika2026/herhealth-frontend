// src/pages/OnboardingPage.jsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const HEALTH_GOALS = [
  { id: 'track_cycle',    emoji: '🌸', label: 'Track my cycle' },
  { id: 'get_pregnant',   emoji: '👶', label: 'Get pregnant' },
  { id: 'avoid_pregnancy',emoji: '🛡️', label: 'Avoid pregnancy' },
  { id: 'manage_pcos',    emoji: '💪', label: 'Manage PCOS' },
  { id: 'hormone_balance',emoji: '⚖️', label: 'Hormone balance' },
  { id: 'track_symptoms', emoji: '📊', label: 'Track symptoms' },
  { id: 'weight',         emoji: '🏃‍♀️', label: 'Weight management' },
  { id: 'mental_wellness',emoji: '🧘', label: 'Mental wellness' },
];

const CONDITIONS = ['PCOS', 'Thyroid', 'Endometriosis', 'Diabetes', 'None'];
const DIETS = [
  { id: 'vegetarian',    emoji: '🥬', label: 'Vegetarian' },
  { id: 'non-vegetarian',emoji: '🍗', label: 'Non-Vegetarian' },
  { id: 'eggetarian',    emoji: '🥚', label: 'Eggetarian' },
  { id: 'jain',          emoji: '🌿', label: 'Jain' },
  { id: 'vegan',         emoji: '🌱', label: 'Vegan' },
];

export default function OnboardingPage() {
  const { updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    lastPeriodDate: '', cycleLength: 28, periodLength: 5,
    healthGoals: [], healthConditions: [], dietPreference: 'vegetarian',
    regionalCuisine: 'All cuisines', ayurvedicSuggestions: true,
  });

  const toggle = (key, val) => setData(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val],
  }));

  const submit = async () => {
    if (!data.lastPeriodDate) return toast.error('Please enter your last period date');
    setLoading(true);
    try {
      const res = await api.put('/auth/onboarding', data);
      updateUser(res.data.user);
      toast.success('All set! Welcome to HerHealth 🌸');
    } catch (err) {
      toast.error('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-light/30 to-lilac-light
                    flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose rounded-full transition-all duration-500"
                 style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="card fade-in-up">
            <h2 className="font-display text-xl font-bold text-charcoal mb-1">
              Let's learn about your cycle
            </h2>
            <p className="text-sm text-gray-400 mb-6">This helps us give accurate predictions</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  When did your last period start?
                </label>
                <input type="date" className="input"
                  value={data.lastPeriodDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setData(p => ({ ...p, lastPeriodDate: e.target.value }))} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">
                  Typical cycle length
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[25,28,30,32].map(d => (
                    <button key={d} onClick={() => setData(p => ({ ...p, cycleLength: d }))}
                      className={clsx('px-4 py-2 rounded-2xl text-sm font-medium border-2 transition-all',
                        data.cycleLength === d
                          ? 'border-rose bg-rose text-white'
                          : 'border-gray-200 text-gray-600 hover:border-rose/50')}>
                      {d} days
                    </button>
                  ))}
                  <button onClick={() => setData(p => ({ ...p, cycleLength: 0 }))}
                    className={clsx('px-4 py-2 rounded-2xl text-sm font-medium border-2 transition-all',
                      data.cycleLength === 0
                        ? 'border-rose bg-rose text-white'
                        : 'border-gray-200 text-gray-600 hover:border-rose/50')}>
                    Irregular
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">
                  Period duration
                </label>
                <div className="flex gap-2">
                  {[3,5,7].map(d => (
                    <button key={d} onClick={() => setData(p => ({ ...p, periodLength: d }))}
                      className={clsx('flex-1 py-2 rounded-2xl text-sm font-medium border-2 transition-all',
                        data.periodLength === d
                          ? 'border-rose bg-rose text-white'
                          : 'border-gray-200 text-gray-600 hover:border-rose/50')}>
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full mt-6 flex justify-center">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card fade-in-up">
            <h2 className="font-display text-xl font-bold text-charcoal mb-1">Your health goals</h2>
            <p className="text-sm text-gray-400 mb-4">Select all that apply</p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {HEALTH_GOALS.map(g => (
                <button key={g.id} onClick={() => toggle('healthGoals', g.id)}
                  className={clsx('p-3 rounded-2xl text-left border-2 transition-all',
                    data.healthGoals.includes(g.id)
                      ? 'border-rose bg-rose-light'
                      : 'border-gray-100 bg-gray-50 hover:border-rose/30')}>
                  <div className="text-xl mb-1">{g.emoji}</div>
                  <div className="text-xs font-medium text-charcoal">{g.label}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Any health conditions?
              </label>
              <div className="flex gap-2 flex-wrap">
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => toggle('healthConditions', c)}
                    className={clsx('px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all',
                      data.healthConditions.includes(c)
                        ? 'border-rose bg-rose text-white'
                        : 'border-gray-200 text-gray-600 hover:border-rose/50')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 flex justify-center">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 flex justify-center">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card fade-in-up">
            <h2 className="font-display text-xl font-bold text-charcoal mb-1">Dietary preferences</h2>
            <p className="text-sm text-gray-400 mb-5">For personalized meal suggestions</p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {DIETS.map(d => (
                <button key={d.id} onClick={() => setData(p => ({ ...p, dietPreference: d.id }))}
                  className={clsx('p-3 rounded-2xl text-center border-2 transition-all',
                    data.dietPreference === d.id
                      ? 'border-rose bg-rose-light'
                      : 'border-gray-100 bg-gray-50 hover:border-rose/30')}>
                  <div className="text-2xl mb-1">{d.emoji}</div>
                  <div className="text-xs font-medium text-charcoal">{d.label}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-sage-light rounded-2xl">
              <div>
                <p className="text-sm font-medium text-charcoal">Include Ayurvedic suggestions</p>
                <p className="text-xs text-gray-400">Dosha-based tips</p>
              </div>
              <button onClick={() => setData(p => ({ ...p, ayurvedicSuggestions: !p.ayurvedicSuggestions }))}
                className={clsx('w-12 h-6 rounded-full transition-colors relative',
                  data.ayurvedicSuggestions ? 'bg-sage' : 'bg-gray-200')}>
                <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  data.ayurvedicSuggestions ? 'translate-x-6' : 'translate-x-0.5')} />
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="btn-outline flex-1 flex justify-center">Back</button>
              <button onClick={submit} disabled={loading}
                className="btn-primary flex-1 flex justify-center items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                {loading ? 'Setting up…' : 'Start Tracking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
