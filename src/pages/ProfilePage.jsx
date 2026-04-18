// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/layout/PageHeader';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Crown, LogOut, ChevronRight, Bell, Shield, Moon, HelpCircle,
         Activity, Stethoscope, FileText, Pill } from 'lucide-react';
import clsx from 'clsx';

const CONDITIONS_LIST = ['PCOS', 'Thyroid', 'Endometriosis', 'Diabetes', 'Hairfall', 'Anemia', 'None'];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm]         = useState({ name: user?.name || '' });
  const [saving, setSaving]     = useState(false);

  const isPremium = user?.subscription?.plan === 'premium';

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { name: form.name });
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditOpen(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out. Take care! 🌸');
  };

  const STATS = [
    { val: user?.stats?.cyclesTracked || 0, label: 'Cycles Tracked' },
    { val: user?.stats?.daysActive    || 0, label: 'Days Active'    },
    { val: `${user?.stats?.logStreak  || 0}%`, label: 'Log Streak' },
  ];

  const MENU_SECTIONS = [
    {
      title: 'Health Profile',
      items: [
        { icon: Activity,    label: 'Personal Info',       action: () => setEditOpen(true) },
        { icon: FileText,    label: 'Health Conditions',   badge: user?.healthProfile?.healthConditions?.join(', ') || 'None' },
        { icon: Pill,        label: 'Medications',         badge: 'Add' },
        { icon: FileText,    label: 'Health Reports',      badge: 'Export' },
      ],
    },
    {
      title: 'Doctor Connectivity',
      items: [
        { icon: Stethoscope, label: 'Find a Gynecologist', action: () => navigate('/doctors') },
        { icon: Stethoscope, label: 'My Appointments',     badge: '1 upcoming' },
        { icon: Activity,    label: 'Video Consultation',  action: () => navigate('/doctors') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell,        label: 'Notifications' },
        { icon: Shield,      label: 'Privacy & Security' },
        { icon: Moon,        label: 'Appearance' },
        { icon: HelpCircle,  label: 'Help & Support' },
      ],
    },
  ];

  return (
    <div className="fade-in-up">
      <PageHeader title="Profile" noNotif />

      {/* Profile card */}
      <div className="mx-5 mb-5">
        <div className="card bg-gradient-to-br from-rose-light to-lilac-light">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose to-lilac
                            flex items-center justify-center text-white text-2xl font-bold shadow-soft">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-charcoal">{user?.name}</h2>
                {isPremium && <Crown size={16} className="text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={clsx('badge mt-1',
                isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500')}>
                {isPremium ? '👑 Premium' : 'Free Plan'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/60 rounded-2xl p-2.5 text-center">
                <p className="font-display text-xl font-bold text-charcoal">{s.val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <div className="mx-5 mb-4">
          <button onClick={() => navigate('/pricing')}
            className="w-full card border-2 border-rose/30 flex items-center gap-3
                       hover:border-rose transition-all">
            <div className="w-10 h-10 bg-rose-light rounded-xl flex items-center justify-center">
              <Crown size={18} className="text-rose" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-charcoal text-sm">Upgrade to Premium</p>
              <p className="text-xs text-gray-400">Unlock AI insights & doctor consultations</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Edit form */}
      {editOpen && (
        <div className="card mx-5 mb-4 fade-in-up">
          <h3 className="font-display font-semibold text-charcoal mb-3">Edit Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditOpen(false)} className="btn-outline flex-1 flex justify-center text-sm py-2">
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="btn-primary flex-1 flex justify-center items-center gap-1 text-sm py-2">
                {saving && <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu sections */}
      <div className="px-5 space-y-4 pb-4">
        {MENU_SECTIONS.map(section => (
          <div key={section.title} className="card p-0 overflow-hidden">
            <h3 className="font-display font-semibold text-charcoal px-4 pt-4 pb-2 text-sm">
              {section.title}
            </h3>
            <div className="divide-y divide-gray-50">
              {section.items.map(item => (
                <button key={item.label} onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-8 h-8 bg-rose-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-rose" />
                  </div>
                  <span className="flex-1 text-sm text-charcoal">{item.label}</span>
                  {item.badge ? (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.badge}</span>
                  ) : (
                    <ChevronRight size={14} className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full card flex items-center gap-3 text-left hover:bg-red-50 transition-colors border-red-100">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
            <LogOut size={16} className="text-red-400" />
          </div>
          <span className="text-sm font-medium text-red-400">Log Out</span>
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">
          HerHealth v1.0.0 • Made with 🌸 in India
        </p>
      </div>
    </div>
  );
}
