// src/pages/RemediesPage.jsx
import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import clsx from 'clsx';

const CATEGORIES = [
  { id: 'cramps',     emoji: '😣', label: 'Cramps'      },
  { id: 'bloating',   emoji: '🫄', label: 'Bloating'    },
  { id: 'headache',   emoji: '🤕', label: 'Headache'    },
  { id: 'fatigue',    emoji: '😴', label: 'Fatigue'     },
  { id: 'acne',       emoji: '😰', label: 'Acne'        },
  { id: 'mood',       emoji: '😔', label: 'Mood Swings' },
];

const REMEDIES = {
  cramps: [
    {
      emoji: '🫚', name: 'Ginger + Jaggery Tea', rating: 4.8, reviews: 234,
      prepTime: '10 mins', effectiveness: 'High',
      ingredients: ['Ginger (1 inch)', 'Jaggery (1 tbsp)', 'Water (1 cup)'],
      steps: ['Grate fresh ginger', 'Boil with water for 5 mins', 'Add jaggery, stir well', 'Strain and sip warm'],
    },
    {
      emoji: '🌰', name: 'Ajwain Heat Pack', rating: 4.6, reviews: 189,
      prepTime: '5 mins', effectiveness: 'Very High',
      ingredients: ['Ajwain (2 tbsp)', 'Cotton cloth'],
      steps: ['Dry roast ajwain for 2 mins', 'Wrap in cotton cloth', 'Apply to lower abdomen', 'Reheat as needed'],
    },
    {
      emoji: '🥛', name: 'Haldi Doodh', rating: 4.5, reviews: 156,
      prepTime: '8 mins', effectiveness: 'High',
      ingredients: ['Turmeric (½ tsp)', 'Milk (1 cup)', 'Honey (optional)', 'Black pepper (pinch)'],
      steps: ['Heat milk on low flame', 'Add turmeric and pepper', 'Stir for 3 mins', 'Add honey and drink warm'],
    },
    {
      emoji: '🌿', name: 'Methi Water', rating: 4.7, reviews: 201,
      prepTime: 'Overnight', effectiveness: 'High',
      ingredients: ['Methi seeds (1 tsp)', 'Water (1 glass)'],
      steps: ['Soak methi seeds overnight', 'Strain in the morning', 'Drink on empty stomach'],
    },
  ],
  bloating: [
    {
      emoji: '🫙', name: 'Jeera Water', rating: 4.7, reviews: 312,
      prepTime: '5 mins', effectiveness: 'Very High',
      ingredients: ['Cumin seeds (1 tsp)', 'Water (1 glass)'],
      steps: ['Boil water with cumin for 5 mins', 'Strain and cool slightly', 'Drink before meals'],
    },
    {
      emoji: '🌿', name: 'Fennel + Ginger Tea', rating: 4.5, reviews: 178,
      prepTime: '8 mins', effectiveness: 'High',
      ingredients: ['Fennel seeds (1 tsp)', 'Ginger (½ inch)', 'Honey (1 tsp)'],
      steps: ['Crush fennel seeds lightly', 'Boil with ginger in water', 'Strain and add honey', 'Sip slowly after meals'],
    },
  ],
  headache: [
    {
      emoji: '🌿', name: 'Peppermint Compress', rating: 4.4, reviews: 145,
      prepTime: '3 mins', effectiveness: 'Moderate',
      ingredients: ['Peppermint leaves or oil', 'Cold water', 'Cloth'],
      steps: ['Soak cloth in cold peppermint water', 'Apply to forehead and temples', 'Rest for 15-20 mins'],
    },
  ],
  fatigue: [
    {
      emoji: '🍯', name: 'Ashwagandha Milk', rating: 4.6, reviews: 267,
      prepTime: '5 mins', effectiveness: 'High',
      ingredients: ['Ashwagandha powder (½ tsp)', 'Warm milk (1 cup)', 'Honey (1 tsp)'],
      steps: ['Warm milk gently', 'Stir in ashwagandha', 'Add honey and a pinch of cardamom', 'Drink before bedtime'],
    },
  ],
  acne: [
    {
      emoji: '🌹', name: 'Rose Water + Sandalwood Mask', rating: 4.3, reviews: 98,
      prepTime: '10 mins', effectiveness: 'Moderate',
      ingredients: ['Sandalwood powder (1 tsp)', 'Rose water (2 tsp)', 'Turmeric (pinch)'],
      steps: ['Mix into smooth paste', 'Apply on acne-prone areas', 'Leave for 15 mins', 'Rinse with cool water'],
    },
  ],
  mood: [
    {
      emoji: '🌸', name: 'Brahmi + Tulsi Tea', rating: 4.5, reviews: 192,
      prepTime: '7 mins', effectiveness: 'High',
      ingredients: ['Brahmi leaves (5-6)', 'Tulsi leaves (5-6)', 'Honey (1 tsp)'],
      steps: ['Boil leaves in 2 cups water', 'Simmer for 5 mins', 'Strain and add honey', 'Sip mindfully'],
    },
    {
      emoji: '🕯️', name: 'Aromatherapy with Lavender', rating: 4.4, reviews: 143,
      prepTime: '2 mins', effectiveness: 'Moderate',
      ingredients: ['Lavender essential oil (2-3 drops)', 'Diffuser or pillow'],
      steps: ['Add drops to diffuser', 'Or sprinkle on pillow', 'Breathe deeply and relax', 'Practice 5-min meditation'],
    },
  ],
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function RemediesPage() {
  const [active, setActive]   = useState('cramps');
  const [expanded, setExpanded] = useState(null);
  const remedies = REMEDIES[active] || [];

  return (
    <div className="fade-in-up">
      <PageHeader title="Home Remedies" subtitle="Traditional Indian remedies" />

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 px-5 mb-5">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setActive(c.id); setExpanded(null); }}
            className={clsx('flex items-center gap-2 px-3 py-2 rounded-2xl border-2 text-sm font-medium transition-all',
              active === c.id
                ? 'border-rose bg-rose text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-rose/30')}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Remedies */}
      <div className="px-5 space-y-3 pb-6">
        {remedies.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-3xl mb-2">🌿</p>
            <p className="text-gray-400 text-sm">Remedies coming soon for this category!</p>
          </div>
        )}
        {remedies.map((r, i) => (
          <div key={r.name} className="card">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                {r.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-charcoal text-sm">{r.name}</h3>
                </div>
                <StarRating rating={r.rating} />
                <p className="text-xs text-gray-400 mt-1">({r.reviews} reviews)</p>
                <div className="flex gap-3 mt-2">
                  <span className="badge bg-gray-100 text-gray-500">⏱ {r.prepTime}</span>
                  <span className="badge bg-sage-light text-sage-dark">✓ {r.effectiveness}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full mt-3 py-2 text-rose text-sm font-medium border border-rose/20
                         rounded-2xl hover:bg-rose-light transition-all">
              {expanded === i ? 'Hide Recipe ▲' : 'View Recipe ▼'}
            </button>

            {expanded === i && (
              <div className="mt-3 pt-3 border-t border-gray-50 fade-in-up">
                <div className="mb-3">
                  <p className="text-xs font-semibold text-charcoal mb-2">🧾 Ingredients</p>
                  <ul className="space-y-1">
                    {r.ingredients.map(ing => (
                      <li key={ing} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-rose rounded-full flex-shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal mb-2">📋 Steps</p>
                  <ol className="space-y-1.5">
                    {r.steps.map((step, si) => (
                      <li key={si} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-4 h-4 bg-rose rounded-full text-white text-[10px]
                                         flex items-center justify-center flex-shrink-0 mt-0.5">
                          {si + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Quick tips */}
        <div className="card bg-peach-light border-2 border-peach/20">
          <h3 className="font-display font-semibold text-charcoal mb-3">⚡ Quick Relief Tips</h3>
          <ul className="space-y-2">
            {[
              { icon: '🧘', tip: `Try child's pose or cat-cow stretch` },
              { icon: '🔥', tip: 'Apply hot water bottle to lower abdomen' },
              { icon: '💆', tip: 'Massage lower back with warm sesame oil' },
              { icon: '🚶', tip: 'Light walk for 10–15 minutes' },
            ].map(t => (
              <li key={t.tip} className="flex items-start gap-2 text-sm text-gray-600">
                <span>{t.icon}</span> {t.tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
