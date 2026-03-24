'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MilkEntry } from '@/types/milk';
import { getMilkEntriesForMonth, upsertMilkEntry } from '@/lib/milkEntries';
import MilkCalendar from './MilkCalendar';
import DayEntrySheet from './DayEntrySheet';
import MilkSummary from './MilkSummary';
import BillModal from './BillModal';

interface DoodhKaHisaabProps {
  onClose: () => void;
}

function toMonthStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function DoodhKaHisaab({ onClose }: DoodhKaHisaabProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [entries, setEntries] = useState<Record<string, MilkEntry>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animatingDays, setAnimatingDays] = useState<Set<string>>(new Set());

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const data = await getMilkEntriesForMonth(toMonthStr(currentMonth));
    const map: Record<string, MilkEntry> = {};
    data.forEach((e) => { map[e.entry_date] = e; });
    setEntries(map);
    setLoading(false);
  }, [currentMonth]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSaveEntry = async (status: 'taken' | 'skipped', litres: number | null) => {
    if (!selectedDay) return;
    const saved = await upsertMilkEntry({ entry_date: selectedDay, status, litres });

    // Optimistic update
    setEntries((prev) => ({ ...prev, [selectedDay]: saved }));

    // Trigger animation
    if (status === 'taken') {
      const day = selectedDay;
      setAnimatingDays((prev) => new Set(prev).add(day));
      setTimeout(() => {
        setAnimatingDays((prev) => {
          const next = new Set(prev);
          next.delete(day);
          return next;
        });
      }, 600);
    }
  };

  const handlePrevMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <div style={{ minHeight: '100dvh', background: '#FAFBFF', padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 0',
        position: 'sticky', top: 0, background: '#FAFBFF', zIndex: 10,
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}>
        <h1 style={{
          fontSize: '22px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 500,
          color: '#1A202C',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          🥛 Doodh ka Hisaab
        </h1>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: 'none', background: '#F0F4F8',
            cursor: 'pointer', fontSize: '20px', color: '#718096',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Calendar card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          marginBottom: '16px',
          border: '1px solid rgba(0,0,0,0.04)',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0AEC0', fontSize: '14px' }}>
              Loading…
            </div>
          ) : (
            <MilkCalendar
              currentMonth={currentMonth}
              entries={entries}
              animatingDays={animatingDays}
              onDayClick={setSelectedDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          )}
        </div>

        {/* Summary card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}>
          <MilkSummary entries={entries} onGetBill={() => setShowBillModal(true)} />
        </div>
      </div>

      {/* Day entry sheet */}
      {selectedDay && (
        <DayEntrySheet
          dateStr={selectedDay}
          existingEntry={entries[selectedDay] ?? null}
          onSave={handleSaveEntry}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Bill modal */}
      {showBillModal && (
        <BillModal entries={entries} onClose={() => setShowBillModal(false)} />
      )}
    </div>
  );
}
