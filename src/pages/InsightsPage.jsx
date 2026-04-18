// src/pages/InsightsPage.jsx
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import PageHeader from '@/components/layout/PageHeader';
import { Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SYMPTOM_DATA = [
  { name: 'Cramps',      pct: 75 },
  { name: 'Bloating',    pct: 60 },
  { name: 'Fatigue',     pct: 55 },
  { name: 'Mood Swings', pct: 45 },
  { name: 'Headache',    pct: 30 },
];

export default function InsightsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [period, setPeriod]     = useState('month');
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    api.get('/insights/summary').then(r => setInsights(r.data.insights)).catch(() => {});
    api.get('/mood/trend').then(r => setMoodData(r.data.trend || [])).catch(() => {});
  }, []);

  const isPremium = user?.subscription?.plan === 'premium';

  const healthScore = insights?.healthScore || 82;

  // Mock mood data if empty
  const chartData = moodData.length > 0 ? moodData.map(d => ({
    date: d._id?.slice(5),
    mood: Math.round(d.avgIntensity * 20),
    energy: Math.round(d.avgEnergy * 20),
  })) : Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    mood: 50 + Math.round(Math.random() * 40),
    energy: 40 + Math.round(Math.random() * 50),
  }));

  return (
    <div className="fade-in-up">
      <PageHeader title="Insights" subtitle="Your health analytics" />

      {/* Period filter */}
      <div className="flex gap-1 mx-5 mb-5 bg-gray-100 p-1 rounded-2xl">
        {['week', 'month', '3months', 'year'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${period === p ? 'bg-white text-rose shadow-sm' : 'text-gray-400'}`}>
            {p === '3months' ? '3 Mo' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Cycle overview */}
      <div className="px-5 mb-5">
        <div className="card">
          <h3 className="font-display font-semibold text-charcoal mb-4">📊 Cycle Overview</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { val: insights?.avgCycleLength || 28, label: 'Avg. Cycle', unit: 'days' },
              { val: insights?.avgPeriodLength || 5,  label: 'Avg. Period', unit: 'days' },
              { val: `${insights?.predictionAccuracy || 92}%`, label: 'Prediction', unit: '' },
            ].map(item => (
              <div key={item.label} className="bg-rose-light rounded-2xl p-3">
                <p className="font-display text-2xl font-bold text-rose">{item.val}{item.unit && <span className="text-sm font-normal ml-0.5">{item.unit}</span>}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood & Energy Chart */}
      <div className="card mx-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-4">😊 Mood & Energy Trends</h3>
        <div className="flex gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><span className="w-3 h-1 bg-rose rounded-full inline-block"/> Mood</span>
          <span className="flex items-center gap-1"><span className="w-3 h-1 bg-lilac rounded-full inline-block"/> Energy</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8647A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E8647A" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8A9C9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#B8A9C9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} hide />
            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="mood" stroke="#E8647A" strokeWidth={2} fill="url(#moodGrad)" dot={false} />
            <Area type="monotone" dataKey="energy" stroke="#B8A9C9" strokeWidth={2} fill="url(#energyGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Symptom Patterns */}
      <div className="card mx-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-4">🤕 Symptom Patterns</h3>
        <div className="space-y-3">
          {SYMPTOM_DATA.map(s => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{s.name}</span>
                <span className="text-rose font-medium">{s.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose to-rose/60 rounded-full transition-all"
                     style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div className="card mx-5 mb-5 bg-gradient-to-br from-sage-light to-lilac-light">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-charcoal">⭐ Health Score</h3>
          <div className="font-display text-3xl font-bold text-sage">{healthScore}</div>
        </div>
        {[
          { label: 'Sleep Quality',       val: 80 },
          { label: 'Cycle Regularity',    val: 92 },
          { label: 'Symptom Management',  val: 75 },
        ].map(item => (
          <div key={item.label} className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-charcoal">{item.val}%</span>
            </div>
            <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-sage rounded-full" style={{ width: `${item.val}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <div className="card mx-5 mb-4 border-2 border-rose/20 bg-rose-light/30">
          <div className="flex items-start gap-3">
            <Crown size={20} className="text-rose flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-charcoal text-sm">Unlock full AI insights</p>
              <p className="text-xs text-gray-400 mb-3">Get detailed cycle predictions, AI health summaries, and export reports.</p>
              <button onClick={() => navigate('/pricing')} className="btn-primary text-sm py-2">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
