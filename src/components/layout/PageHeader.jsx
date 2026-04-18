// src/components/layout/PageHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

export default function PageHeader({ title, subtitle, back, action, noNotif }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-4">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-charcoal" />
          </button>
        )}
        <div>
          <h1 className="font-display text-xl font-bold text-charcoal">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action || (!noNotif && (
        <button className="relative p-2 rounded-2xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-charcoal" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose rounded-full" />
        </button>
      ))}
    </div>
  );
}
