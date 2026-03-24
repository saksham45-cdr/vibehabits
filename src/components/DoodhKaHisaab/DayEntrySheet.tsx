'use client';

import { useState, useEffect } from 'react';
import type { MilkEntry } from '@/types/milk';

interface DayEntrySheetProps {
  dateStr: string;
  existingEntry: MilkEntry | null;
  onSave: (status: 'taken' | 'skipped', litres: number | null) => Promise<void>;
  onClose: () => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function DayEntrySheet({ dateStr, existingEntry, onSave, onClose }: DayEntrySheetProps) {
  const [status, setStatus] = useState<'taken' | 'skipped' | null>(existingEntry?.status ?? null);
  const [litres, setLitres] = useState<string>(existingEntry?.litres != null ? String(existingEntry.litres) : '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(existingEntry?.status ?? null);
    setLitres(existingEntry?.litres != null ? String(existingEntry.litres) : '');
  }, [dateStr, existingEntry]);

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      const litresVal = status === 'taken' && litres !== '' ? parseFloat(litres) : null;
      await onSave(status, litresVal);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70,
        background: '#FFFFFF',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 24px 40px',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 4, margin: '0 auto 20px' }} />

        {/* Date label */}
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '4px', textAlign: 'center' }}>
          {formatDateLabel(dateStr)}
        </p>
        <p style={{ fontSize: '17px', fontWeight: 500, color: '#1A202C', marginBottom: '24px', textAlign: 'center' }}>
          Did you take milk today?
        </p>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setStatus('taken')}
            style={{
              flex: 1, padding: '12px',
              borderRadius: '16px',
              border: status === 'taken' ? '2px solid #6EC6E6' : '1.5px solid #E2E8F0',
              background: status === 'taken' ? '#E8F6FC' : '#FAFBFF',
              color: status === 'taken' ? '#2C7A9F' : '#718096',
              fontSize: '15px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            ✓ Taken
          </button>
          <button
            onClick={() => setStatus('skipped')}
            style={{
              flex: 1, padding: '12px',
              borderRadius: '16px',
              border: status === 'skipped' ? '2px solid #CBD5E0' : '1.5px solid #E2E8F0',
              background: status === 'skipped' ? '#F7F7F7' : '#FAFBFF',
              color: status === 'skipped' ? '#718096' : '#718096',
              fontSize: '15px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            × Skipped
          </button>
        </div>

        {/* Litres input — shown only when taken */}
        {status === 'taken' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: '#718096', display: 'block', marginBottom: '8px' }}>
              How many litres?
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                step="0.1"
                min="0"
                value={litres}
                onChange={(e) => setLitres(e.target.value)}
                placeholder="e.g. 1.5"
                style={{
                  flex: 1, padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  background: '#FAFBFF',
                  fontSize: '16px', color: '#1A202C',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '15px', color: '#718096', fontWeight: 500 }}>L</span>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!status || saving}
          style={{
            width: '100%', padding: '14px',
            borderRadius: '16px',
            border: 'none',
            background: !status ? '#E2E8F0' : '#6EC6E6',
            color: !status ? '#A0AEC0' : '#FFFFFF',
            fontSize: '16px', fontWeight: 600,
            cursor: !status ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            boxShadow: !status ? 'none' : '0 4px 12px rgba(110,198,230,0.35)',
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </>
  );
}
