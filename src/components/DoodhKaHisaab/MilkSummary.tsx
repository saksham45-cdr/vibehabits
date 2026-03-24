'use client';

import type { MilkEntry } from '@/types/milk';

interface MilkSummaryProps {
  entries: Record<string, MilkEntry>;
  onGetBill: () => void;
}

export default function MilkSummary({ entries, onGetBill }: MilkSummaryProps) {
  const allEntries = Object.values(entries);
  const takenEntries = allEntries.filter((e) => e.status === 'taken');
  const skippedEntries = allEntries.filter((e) => e.status === 'skipped');
  const totalLitres = takenEntries.reduce((sum, e) => sum + (e.litres ?? 0), 0);

  const cards = [
    { icon: '🥛', label: 'Total Litres', value: `${totalLitres % 1 === 0 ? totalLitres : totalLitres.toFixed(1)} L` },
    { icon: '✓', label: 'Days Taken', value: String(takenEntries.length) },
    { icon: '×', label: 'Days Skipped', value: String(skippedEntries.length) },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 10px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{card.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: '#1A202C', lineHeight: 1.2 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '10px', color: '#A0AEC0', marginTop: '3px', letterSpacing: '0.02em' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onGetBill}
        style={{
          width: '100%', padding: '13px',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          background: '#FAFBFF',
          color: '#2C7A9F',
          fontSize: '14px', fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s',
          letterSpacing: '0.01em',
        }}
      >
        🧾 Get the Bill
      </button>
    </div>
  );
}
