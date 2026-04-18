// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCycle } from '@/context/CycleContext';
import { getGreeting, formatDate, PHASE_TIPS, MOOD_EMOJIS } from '@/utils/helpers';
import { Calendar, Stethoscope, Salad, Leaf, FlaskConical, Plus, Droplets, Moon } from 'lucide-react';
import api from '@/services/api';
import clsx from 'clsx';

const QUICK_ACTIONS = [
  { icon: Calendar,     label: 'Calendar',     to: '/calendar'  },
  { icon: Stethoscope,  label: 'Find Doctor',  to: '/doctors'   },
  { icon: Salad,        label: 'Diet Plan',    to: '/diet'      },
  { icon: Leaf,         label: 'Ayurveda',     to: '/ayurveda'  },
  { icon: FlaskConical, label: 'Remedies',     to: '/remedies'  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { cycleInfo, phaseInfo } = useCycle();
  const navigate = useNavigate();
  const [todayMood, setTodayMood] = useState(null);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    api.get('/mood/today').then(r => setTodayMood(r.data.moodLog)).catch(() => {});
    api.get('/reminders').then(r => setReminders(r.data.reminders || [])).catch(() => {});
  }, []);

  const greeting = getGreeting();
  const today = formatDate(new Date(), 'EEEE, MMM d');

  return (
    <div className="px-5 pt-12 pb-4 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">{today}</p>
          <h1 className="font-display text-2xl font-bold text-charcoal">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
        </div>
        <button onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-rose rounded-full flex items-center justify-center
                     text-white font-bold text-sm shadow-soft">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </button>
      </div>

      {/* Cycle Card */}
      {cycleInfo ? (
        <div className="rounded-3xl p-5 mb-5 text-white relative overflow-hidden"
             style={{ background: `linear-gradient(135deg, ${phaseInfo?.color || '#E8647A'}, ${phaseInfo?.color || '#E8647A'}99)` }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white
                          translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/70 text-xs">Current Phase</p>
                <h2 className="font-display text-lg font-bold">
                  {phaseInfo?.emoji} {phaseInfo?.label} Phase
                </h2>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Day</p>
                <p className="font-display text-3xl font-bold">{cycleInfo.dayOfCycle}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-white/60 text-xs">Period in</p>
                <p className="font-semibold">{cycleInfo.daysUntilPeriod} days</p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Cycle length</p>
                <p className="font-semibold">{cycleInfo.cycleLength} days</p>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/cycle')}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white text-sm
                       font-medium py-2 rounded-2xl transition-all">
            Log Period
          </button>
        </div>
      ) : (
        <div className="card mb-5 border-2 border-dashed border-rose/20">
          <p className="text-center text-gray-400 text-sm mb-3">No cycle data yet</p>
          <button onClick={() => navigate('/cycle')} className="btn-primary w-full flex justify-center">
            Start Tracking
          </button>
        </div>
      )}

      {/* Today Summary */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-charcoal">Today's Summary</h3>
          <button onClick={() => navigate('/mood')} className="text-rose text-xs font-medium">Log now</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: todayMood ? MOOD_EMOJIS[todayMood.mood] : '😊', label: 'Mood',
              val: todayMood?.mood || 'Log it' },
            { emoji: '😴', label: 'Sleep', val: '7h 30m' },
            { emoji: '💧', label: 'Water', val: '5 / 8' },
            { emoji: '⚡', label: 'Energy', val: todayMood?.energy ? `${todayMood.energy}/5` : '—' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-2xl p-2.5 text-center">
              <div className="text-xl mb-1">{item.emoji}</div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs font-semibold text-charcoal mt-0.5">{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Tips */}
      {cycleInfo && (
        <div className="card mb-5" style={{ background: phaseInfo?.bg }}>
          <h3 className="font-display font-semibold text-charcoal mb-3">
            💡 Tips for {phaseInfo?.label} Phase
          </h3>
          <ul className="space-y-2">
            {PHASE_TIPS[cycleInfo.phase]?.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-rose mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-3">Quick Actions</h3>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_ACTIONS.map(({ icon: Icon, label, to }) => (
            <button key={to} onClick={() => navigate(to)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 bg-rose-light rounded-2xl flex items-center justify-center">
                <Icon size={20} className="text-rose" />
              </div>
              <span className="text-[10px] font-medium text-gray-500 w-14 text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-charcoal">Reminders</h3>
          <button className="w-6 h-6 bg-rose-light rounded-full flex items-center justify-center">
            <Plus size={14} className="text-rose" />
          </button>
        </div>
        {reminders.length > 0 ? (
          <div className="space-y-2">
            {reminders.slice(0, 3).map(r => (
              <div key={r._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-8 h-8 bg-lilac-light rounded-xl flex items-center justify-center">
                  {r.type === 'medicine' ? '💊' : r.type === 'appointment' ? '🩺' : '🔔'}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">No reminders yet. Add one!</p>
        )}
      </div>
    </div>
  );
}
