import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: danger ? '#FEE2E2' : '#DBEAFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <AlertTriangle size={20} style={{ color: danger ? '#DC2626' : '#2563EB' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
          </div>
          <button onClick={onCancel} style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600,
              background: danger ? '#DC2626' : 'var(--color-primary)', color: 'white',
              transition: 'background 0.2s',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
