'use client';

import type { MilkEntry } from '@/types/milk';
import './milkFill.css';

interface MilkCalendarProps {
  currentMonth: Date;
  entries: Record<string, MilkEntry>;
  animatingDays: Set<string>;
  onDayClick: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function MilkCalendar({
  currentMonth,
  entries,
  animatingDays,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}: MilkCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  // Build grid cells: leading blanks + day cells
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={onPrevMonth}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#F0F4F8', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4A5568', transition: 'background 0.15s',
          }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span style={{ fontSize: '16px', fontWeight: 500, color: '#1A202C' }}>{monthLabel}</span>
        <button
          onClick={onNextMonth}
          style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#F0F4F8', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4A5568', transition: 'background 0.15s',
          }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#A0AEC0', fontWeight: 500, paddingBottom: '2px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} />;

          const dateStr = toDateStr(year, month, day);
          const entry = entries[dateStr];
          const isToday = dateStr === today;
          const isAnimating = animatingDays.has(dateStr);

          const isTaken = entry?.status === 'taken';
          const isSkipped = entry?.status === 'skipped';

          let bgColor = '#FFFFFF';
          if (isTaken && !isAnimating) bgColor = '#E8F6FC';
          if (isSkipped) bgColor = '#F7F7F7';

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '12px',
                border: isToday ? '1.5px solid #90CDF4' : '1px solid rgba(0,0,0,0.05)',
                background: isAnimating ? 'transparent' : bgColor,
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                transition: 'box-shadow 0.15s',
                boxShadow: isToday ? '0 0 0 1px #BEE3F8' : 'none',
              }}
              aria-label={dateStr}
            >
              {/* Milk fill animation layer */}
              {isAnimating && (
                <div
                  className="milk-filling"
                  style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    borderRadius: '12px',
                  }}
                />
              )}
              {/* Skipped animation layer */}
              {isSkipped && (
                <div
                  className="skip-fade-in"
                  style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: '#F7F7F7', borderRadius: '12px',
                  }}
                />
              )}

              {/* Cell content */}
              <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '100%', padding: '3px',
              }}>
                <span style={{
                  fontSize: '10px',
                  color: isTaken ? '#5A9BB8' : isSkipped ? '#A0AEC0' : '#718096',
                  lineHeight: 1,
                  marginBottom: isTaken || isSkipped ? '2px' : 0,
                }}>
                  {day}
                </span>
                {isTaken && (
                  <span style={{ fontSize: '10px', color: '#2C7A9F', fontWeight: 600, lineHeight: 1 }}>
                    {entry.litres != null ? `${entry.litres}L` : '✓'}
                  </span>
                )}
                {isSkipped && (
                  <span style={{ fontSize: '12px', color: '#CBD5E0', lineHeight: 1 }}>×</span>
                )}
                {!entry && (
                  <span style={{ fontSize: '10px', color: '#CBD5E0' }}></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
