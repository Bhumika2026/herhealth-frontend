// src/pages/DietPage.jsx
import { useState } from 'react';
import { useCycle } from '@/context/CycleContext';
import PageHeader from '@/components/layout/PageHeader';
import clsx from 'clsx';

const MEALS = {
  menstrual: [
    { time: '🌅 Breakfast', name: 'Ragi Idli with Sambar', cal: 280, tags: ['Iron-rich', 'PCOS-friendly'], emoji: '🥣' },
    { time: '☀️ Lunch',     name: 'Palak Paneer + Brown Rice', cal: 420, tags: ['Iron', 'Protein'], emoji: '🍛' },
    { time: '🍵 Snack',     name: 'Chana Chaat + Herbal Tea', cal: 150, tags: ['Protein'], emoji: '🥗' },
    { time: '🌙 Dinner',    name: 'Dal Khichdi + Raita', cal: 350, tags: ['Easy digest'], emoji: '🍲' },
  ],
  follicular: [
    { time: '🌅 Breakfast', name: 'Oats Upma + Sprouts', cal: 260, tags: ['Fiber', 'Protein'], emoji: '🥣' },
    { time: '☀️ Lunch',     name: 'Rajma Chawal + Salad', cal: 450, tags: ['Protein', 'Complex carbs'], emoji: '🍛' },
    { time: '🍵 Snack',     name: 'Mixed Nuts + Banana', cal: 180, tags: ['Energy'], emoji: '🥜' },
    { time: '🌙 Dinner',    name: 'Moong Dal + Roti', cal: 320, tags: ['Light', 'Protein'], emoji: '🍞' },
  ],
  ovulation: [
    { time: '🌅 Breakfast', name: 'Coconut Chutney Dosa', cal: 300, tags: ['Cooling', 'Veg'], emoji: '🫓' },
    { time: '☀️ Lunch',     name: 'Curd Rice + Raw Mango', cal: 380, tags: ['Cooling', 'Probiotic'], emoji: '🍚' },
    { time: '🍵 Snack',     name: 'Cucumber + Hummus', cal: 120, tags: ['Hydrating'], emoji: '🥒' },
    { time: '🌙 Dinner',    name: 'Lauki Sabzi + Jowar Roti', cal: 310, tags: ['Light'], emoji: '🥬' },
  ],
  luteal: [
    { time: '🌅 Breakfast', name: 'Banana Oat Smoothie', cal: 280, tags: ['Magnesium', 'Potassium'], emoji: '🥤' },
    { time: '☀️ Lunch',     name: 'Methi Roti + Dal Fry', cal: 430, tags: ['Iron', 'Fiber'], emoji: '🍛' },
    { time: '🍵 Snack',     name: 'Dark Chocolate + Almonds', cal: 200, tags: ['Magnesium'], emoji: '🍫' },
    { time: '🌙 Dinner',    name: 'Vegetable Soup + Khichdi', cal: 300, tags: ['Easy digest'], emoji: '🥣' },
  ],
};

const SUPERFOODS = ['🥬 Spinach','🥜 Flax Seeds','🥛 Curd','🌰 Almonds','🍌 Banana','🫚 Ginger','🌿 Methi'];
const AVOID = ['☕ Caffeine','🍟 Fried Food','🧁 Refined Sugar','🥤 Cold Drinks','🍞 Maida'];

export default function DietPage() {
  const { cycleInfo, phaseInfo } = useCycle();
  const [water, setWater] = useState(3);
  const phase = cycleInfo?.phase || 'follicular';
  const meals = MEALS[phase];

  return (
    <div className="fade-in-up">
      <PageHeader title="Diet Plan" subtitle="Phase-based Indian nutrition" />

      {/* Phase banner */}
      <div className="mx-5 mb-5 p-4 rounded-3xl text-white"
           style={{ background: `linear-gradient(135deg, ${phaseInfo?.color || '#7FAF8B'}, ${phaseInfo?.color || '#7FAF8B'}99)` }}>
        <p className="text-white/70 text-xs">Current Phase</p>
        <h2 className="font-display text-lg font-bold">{phaseInfo?.emoji} {phaseInfo?.label} Phase Diet</h2>
        <p className="text-xs text-white/70 mt-1">
          {phase === 'ovulation' ? 'Focus on cooling, hydrating foods' :
           phase === 'luteal'    ? 'Magnesium & comfort foods' :
           phase === 'menstrual' ? 'Iron-rich, warming foods' :
           'Energy-building, protein-rich foods'}
        </p>
      </div>

      {/* Meals */}
      <div className="px-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-3">Today's Meal Plan</h3>
        <div className="space-y-3">
          {meals.map(m => (
            <div key={m.name} className="card flex items-start gap-3">
              <div className="text-2xl">{m.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">{m.time}</p>
                <p className="font-semibold text-charcoal text-sm">{m.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">🔥 {m.cal} kcal</span>
                  {m.tags.map(t => (
                    <span key={t} className="badge bg-sage-light text-sage-dark">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Superfoods */}
      <div className="card mx-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-3">⭐ Superfoods for This Phase</h3>
        <div className="flex flex-wrap gap-2">
          {SUPERFOODS.map(f => (
            <span key={f} className="badge bg-sage-light text-sage-dark px-3 py-1.5">{f}</span>
          ))}
        </div>
      </div>

      {/* Avoid */}
      <div className="card mx-5 mb-5">
        <h3 className="font-display font-semibold text-charcoal mb-3">⚠️ Avoid This Phase</h3>
        <div className="flex flex-wrap gap-2">
          {AVOID.map(f => (
            <span key={f} className="badge bg-red-50 text-red-400">{f}</span>
          ))}
        </div>
      </div>

      {/* Water tracker */}
      <div className="card mx-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-charcoal">💧 Hydration Goal</h3>
          <span className="text-sm font-bold text-rose">{water} / 8 glasses</span>
        </div>
        <div className="flex gap-1.5 mb-3">
          {Array(8).fill(0).map((_, i) => (
            <button key={i} onClick={() => setWater(i + 1)}
              className={clsx('flex-1 h-8 rounded-xl transition-all',
                i < water ? 'bg-rose' : 'bg-gray-100')}>
              {i < water && <span className="text-white text-xs">💧</span>}
            </button>
          ))}
        </div>
        <button onClick={() => setWater(w => Math.min(8, w + 1))}
          className="btn-outline w-full text-sm flex justify-center">
          + Add Glass
        </button>
      </div>
    </div>
  );
}
