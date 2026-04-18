// src/pages/PricingPage.jsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { initiatePayment, PLANS } from '@/services/paymentService';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Check, Crown, Zap } from 'lucide-react';
import clsx from 'clsx';

const FEATURES_FREE = [
  'Basic cycle tracking',
  'Period predictions',
  'Mood logging (5/month)',
  'Community access',
  'Home remedies',
];

const FEATURES_PREMIUM = [
  'Unlimited cycle & mood tracking',
  'AI health insights (Sakhi)',
  'Personalized diet plans',
  'Ayurveda dosha analysis',
  'Doctor consultations (discounted)',
  'Health score & reports',
  'Medication reminders',
  'Export health reports',
  'Priority community support',
];

export default function PricingPage() {
  const { user, fetchMe } = useAuth();
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState('');

  const isPremium = user?.subscription?.plan === 'premium';

  const handleUpgrade = async (type) => {
    setLoading(type);
    try {
      await initiatePayment({ type, userData: { name: user.name, email: user.email } });
      toast.success('🎉 Welcome to Premium! Unlocking all features…');
      await fetchMe();
    } catch (err) {
      if (err.message !== 'Payment cancelled by user') {
        toast.error(err.message || 'Payment failed');
      }
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="fade-in-up">
      <PageHeader title="Upgrade to Premium" subtitle="Unlock your full health potential" back />

      <div className="px-5 pb-8">
        {/* Current plan */}
        {isPremium && (
          <div className="card mb-5 bg-gradient-to-r from-rose to-rose-dark text-white">
            <div className="flex items-center gap-3">
              <Crown size={24} />
              <div>
                <p className="font-semibold">You're on Premium! 🎉</p>
                <p className="text-sm text-white/70">
                  Expires: {user.subscription.endDate
                    ? new Date(user.subscription.endDate).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
          {['monthly', 'yearly'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className={clsx('flex-1 py-2.5 text-sm font-medium rounded-xl transition-all',
                billing === b ? 'bg-white shadow-sm text-rose' : 'text-gray-400')}>
              {b === 'yearly' ? '🎁 Yearly (Save 25%)' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="space-y-4">
          {/* Free */}
          <div className="card border-2 border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-charcoal">Free</h3>
                <p className="text-gray-400 text-sm">Get started</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-charcoal">₹0</p>
                <p className="text-xs text-gray-400">forever</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {FEATURES_FREE.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-sage flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="py-2.5 px-4 rounded-2xl bg-gray-100 text-center text-sm text-gray-400 font-medium">
              {isPremium ? 'Previous plan' : 'Current plan'}
            </div>
          </div>

          {/* Premium */}
          <div className="card border-2 border-rose relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="badge bg-rose text-white">
                <Crown size={10} /> Most Popular
              </span>
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-rose">Premium</h3>
                <p className="text-gray-400 text-sm">Full access</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-charcoal">
                  {billing === 'monthly' ? '₹199' : '₹1,799'}
                </p>
                <p className="text-xs text-gray-400">
                  {billing === 'monthly' ? 'per month' : 'per year'}
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {FEATURES_PREMIUM.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-rose flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              disabled={isPremium || !!loading}
              onClick={() => handleUpgrade(billing === 'monthly' ? 'premium_monthly' : 'premium_yearly')}
              className={clsx('btn-primary w-full flex justify-center items-center gap-2',
                isPremium && 'opacity-60 cursor-not-allowed')}>
              {loading === (billing === 'monthly' ? 'premium_monthly' : 'premium_yearly') && (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              )}
              {isPremium ? 'Already Premium ✓' : `Upgrade for ${billing === 'monthly' ? '₹199' : '₹1,799'}`}
            </button>
          </div>

          {/* Instant Video */}
          <div className="card border-2 border-peach">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-charcoal">
                  <Zap size={18} className="inline text-peach mr-1" />
                  Instant Video Call
                </h3>
                <p className="text-gray-400 text-sm">Connect with a doctor now</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-charcoal">₹299</p>
                <p className="text-xs text-gray-400">per call</p>
              </div>
            </div>
            <button
              disabled={!!loading}
              onClick={() => handleUpgrade('instant_video')}
              className="btn-outline w-full flex justify-center items-center gap-2 border-peach text-peach hover:bg-peach-light">
              {loading === 'instant_video' && (
                <div className="w-4 h-4 border-2 border-peach/40 border-t-peach rounded-full animate-spin"/>
              )}
              Connect Now
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['🔒 Secure Payment', '↩️ 7-day Refund', '🇮🇳 Made in India'].map(b => (
            <div key={b} className="text-center text-xs text-gray-400 bg-gray-50 rounded-2xl py-2.5 px-1">
              {b}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-300 mt-3">
          Payments secured by Razorpay • UPI, Cards, NetBanking accepted
        </p>
      </div>
    </div>
  );
}
