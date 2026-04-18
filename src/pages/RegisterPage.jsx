// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Let\'s set up your profile 🌸');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lilac-light via-cream to-rose-light
                    flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🌸</div>
          <h1 className="font-display text-3xl font-bold text-charcoal">HerHealth</h1>
          <p className="text-gray-500 text-sm mt-1">Start your wellness journey today</p>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-semibold text-charcoal mb-6">Create account</h2>
          <form onSubmit={submit} className="space-y-4">
            {[
              { name: 'name',     label: 'Full Name',  type: 'text',     placeholder: 'Priya Sharma' },
              { name: 'email',    label: 'Email',      type: 'email',    placeholder: 'you@example.com' },
              { name: 'password', label: 'Password',   type: 'password', placeholder: '6+ characters' },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} onChange={handle}
                  className="input" placeholder={f.placeholder} required />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 mt-2">
              {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-rose font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
