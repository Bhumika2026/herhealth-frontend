// src/components/layout/AppLayout.jsx
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, Users, User, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { to: '/',         icon: Home,      label: 'Home'      },
  { to: '/insights', icon: BarChart2, label: 'Insights'  },
  { to: '/sakhi',    icon: Sparkles,  label: 'Sakhi AI'  },
  { to: '/community',icon: Users,     label: 'Community' },
  { to: '/profile',  icon: User,      label: 'Profile'   },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col max-w-md mx-auto relative">
      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      bg-white border-t border-gray-100 px-2 py-2 z-50
                      flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              clsx('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200',
                isActive ? 'text-rose' : 'text-gray-400 hover:text-gray-600')
            }>
            {({ isActive }) => (
              <>
                <div className={clsx('p-1.5 rounded-xl transition-all',
                  isActive && 'bg-rose-light')}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
