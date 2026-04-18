// src/pages/CalendarPage.jsx
import { useState } from 'react';
import { useCycle } from '@/context/CycleContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatDate, addDaysTo } from '@/utils/helpers';
import clsx from 'clsx';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format, addMonths, subMonths,
} from 'date-fns';

const LEGEND = [
  { color: '#E8647A', label: 'Period' },
  { color: '#7FAF8B', label: 'Fertile' },
  { color: '#F4A97F', label: 'Ovulation' },
  { color: '#E8647A33', label: 'Predicted' },
];

export default function CalendarPage() {
  const { cycleInfo } = useCycle();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay]   = useState(new Date());

  const monthStart  = startOfMonth(currentMonth);
  const monthEnd    = endOfMonth(currentMonth);
  const calStart    = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd      = endOfWeek(monthEnd,    { weekStartsOn: 0 });
  const days        = eachDayOfInterval({ start: calStart, end: calEnd });

  // Build date metadata from cycle info
  const getDayType = (day) => {
    if (!cycleInfo) return null;
    const lastPeriod = cycleInfo.lastPeriodDate ? new Date(cycleInfo.lastPeriodDate) : null;
    if (!lastPeriod) return null;

    const pred = cycleInfo.predictions;
    const pStart  = lastPeriod;
    const pEnd    = addDaysTo(lastPeriod, 4);
    const ovDay   = pred?.ovulationDate ? new Date(pred.ovulationDate) : null;
    const fStart  = pred?.fertileStart  ? new Date(pred.fertileStart)  : null;
    const fEnd    = pred?.fertileEnd    ? new Date(pred.fertileEnd)    : null;
    const nextP   = pred?.nextPeriod    ? new Date(pred.nextPeriod)    : null;
    const nextPEnd = nextP ? addDaysTo(nextP, 4) : null;

    if (day >= pStart && day <= pEnd) return 'period';
    if (ovDay && isSameDay(day, ovDay)) return 'ovulation';
    if (fStart && fEnd && day >= fStart && day <= fEnd) return 'fertile';
    if (nextP && nextPEnd && day >= nextP && day <= nextPEnd) return 'predicted';
    return null;
  };

  const DAY_STYLES = {
    period:    'bg-rose text-white',
    fertile:   'bg-sage text-white',
    ovulation: 'bg-peach text-white ring-2 ring-peach ring-offset-1',
    predicted: 'bg-rose/20 text-rose',
  };

  const selectedType = getDayType(selectedDay);

  const selectedDayLogs = [
    selectedType === 'period'    && { emoji: '🩸', text: 'Period day' },
    selectedType === 'ovulation' && { emoji: '✨', text: 'Ovulation day' },
    selectedType === 'fertile'   && { emoji: '🌿', text: 'Fertile window' },
    selectedType === 'predicted' && { emoji: '📅', text: 'Predicted period' },
    isSameDay(selectedDay, new Date()) && { emoji: '📍', text: 'Today' },
  ].filter(Boolean);

  return (
    <div className="fade-in-up">
      <PageHeader title="Cycle Calendar" />

      {/* Month nav */}
      <div className="flex items-center justify-between px-5 mb-4">
        <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-charcoal hover:bg-rose-light hover:text-rose transition-all">
          ‹
        </button>
        <h2 className="font-display font-bold text-charcoal">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-charcoal hover:bg-rose-light hover:text-rose transition-all">
          ›
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap px-5 mb-4">
        {LEGEND.map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
            <span className="text-xs text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mx-5 card mb-4 p-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-300 py-1">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map(day => {
            const type    = getDayType(day);
            const isToday = isSameDay(day, new Date());
            const isSel   = isSameDay(day, selectedDay);
            const inMonth = isSameMonth(day, currentMonth);

            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(day)}
                className={clsx(
                  'relative h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all',
                  !inMonth && 'opacity-30',
                  type && DAY_STYLES[type],
                  !type && isToday && 'ring-2 ring-rose text-rose',
                  !type && !isToday && 'text-charcoal hover:bg-gray-50',
                  isSel && !type && 'bg-rose-light text-rose',
                )}>
                {format(day, 'd')}
                {isToday && !type && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day info */}
      <div className="card mx-5 mb-4">
        <h3 className="font-display font-semibold text-charcoal mb-3">
          📅 {format(selectedDay, 'MMMM d, yyyy')}
          {isSameDay(selectedDay, new Date()) && (
            <span className="ml-2 badge bg-rose text-white">Today</span>
          )}
        </h3>
        {selectedDayLogs.length > 0 ? (
          <div className="space-y-2">
            {selectedDayLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <span>{log.emoji}</span>
                <span className="text-sm text-charcoal">{log.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No cycle events on this day.</p>
        )}
      </div>

      {/* Upcoming dates */}
      {cycleInfo?.predictions && (
        <div className="card mx-5 mb-4">
          <h3 className="font-display font-semibold text-charcoal mb-3">🌸 Upcoming</h3>
          <div className="space-y-3">
            {[
              { label: '🩸 Next Period',          date: cycleInfo.predictions.nextPeriod },
              { label: '✨ Ovulation',             date: cycleInfo.predictions.ovulationDate },
              { label: '🌿 Fertile Window Start',  date: cycleInfo.predictions.fertileStart },
              { label: '🌿 Fertile Window End',    date: cycleInfo.predictions.fertileEnd },
            ].map(item => {
              if (!item.date) return null;
              const d = new Date(item.date);
              const daysFromNow = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={item.label} className="flex items-center justify-between
                                                  py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-charcoal">{formatDate(d, 'MMM d')}</p>
                    <p className="text-xs text-gray-400">
                      {daysFromNow > 0 ? `in ${daysFromNow} days` : daysFromNow === 0 ? 'Today' : `${Math.abs(daysFromNow)} days ago`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
