'use client';

import { useState } from 'react';
import type { MilkEntry } from '@/types/milk';

interface BillModalProps {
  entries: Record<string, MilkEntry>;
  onClose: () => void;
}

export default function BillModal({ entries, onClose }: BillModalProps) {
  const [costPerLitre, setCostPerLitre] = useState('');

  const totalLitres = Object.values(entries)
    .filter((e) => e.status === 'taken')
    .reduce((sum, e) => sum + (e.litres ?? 0), 0);

  const totalCost = costPerLitre !== '' ? totalLitres * parseFloat(costPerLitre) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 90,
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '28px 24px',
        width: '90%', maxWidth: '360px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A202C', margin: 0 }}>
            🧾 Monthly Bill
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              border: 'none', background: '#F0F4F8',
              cursor: 'pointer', fontSize: '16px', color: '#718096',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Total litres — read only */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#A0AEC0', display: 'block', marginBottom: '6px' }}>
            Total litres this month
          </label>
          <div style={{
            padding: '12px 14px',
            borderRadius: '14px',
            background: '#E8F6FC',
            fontSize: '16px', fontWeight: 500, color: '#2C7A9F',
          }}>
            {totalLitres % 1 === 0 ? totalLitres : totalLitres.toFixed(1)} L
          </div>
        </div>

        {/* Cost per litre */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#A0AEC0', display: 'block', marginBottom: '6px' }}>
            Cost per litre
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', color: '#718096' }}>₹</span>
            <input
              type="number"
              step="0.5"
              min="0"
              value={costPerLitre}
              onChange={(e) => setCostPerLitre(e.target.value)}
              placeholder="e.g. 65"
              autoFocus
              style={{
                flex: 1, padding: '12px 14px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                background: '#FAFBFF',
                fontSize: '16px', color: '#1A202C',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#EDF2F7', marginBottom: '16px' }} />

        {/* Total cost */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', color: '#718096', fontWeight: 500 }}>Total Cost</span>
          <span style={{ fontSize: '24px', fontWeight: 600, color: totalCost != null ? '#1A202C' : '#CBD5E0' }}>
            {totalCost != null
              ? `₹ ${totalCost % 1 === 0 ? totalCost : totalCost.toFixed(2)}`
              : '₹ —'}
          </span>
        </div>
      </div>
    </>
  );
}
