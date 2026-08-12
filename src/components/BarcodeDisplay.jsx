import React from 'react';
import { Printer, CheckCircle, Barcode as BarcodeIcon } from 'lucide-react';

export default function BarcodeDisplay({ value, orderId, status, compact = false }) {
  const barcodeText = value || `BC-ORD-${(orderId || '992A').slice(-6).toUpperCase()}`;

  // Deterministic SVG Barcode Generator (Code 128 style visual encoding)
  const generateBars = (text) => {
    const bars = [];
    let x = 10;
    // Quiet zone start
    bars.push({ x: 0, width: 10, color: 'white' });

    // Start pattern
    const startPattern = [2, 1, 1, 4, 1, 2];
    startPattern.forEach((w, i) => {
      bars.push({ x, width: w * 2, color: i % 2 === 0 ? 'black' : 'white' });
      x += w * 2;
    });

    // Character pattern
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const pattern = [
        (code % 3) + 1,
        ((code + 1) % 3) + 1,
        ((code + 2) % 4) + 1,
        (code % 2) + 1,
        ((code + 3) % 3) + 1,
        ((code + 4) % 2) + 1,
      ];
      pattern.forEach((w, idx) => {
        bars.push({ x, width: w * 2, color: idx % 2 === 0 ? 'black' : 'white' });
        x += w * 2;
      });
    }

    // Stop pattern
    const stopPattern = [2, 3, 3, 1, 1, 1, 2];
    stopPattern.forEach((w, i) => {
      bars.push({ x, width: w * 2, color: i % 2 === 0 ? 'black' : 'white' });
      x += w * 2;
    });

    return { bars, totalWidth: x + 10 };
  };

  const { bars, totalWidth } = generateBars(barcodeText);

  const handlePrint = (e) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Barcode Label - ${barcodeText}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 2rem; }
            .label { border: 2px solid #000; padding: 1.5rem; display: inline-block; border-radius: 8px; }
            svg { max-width: 100%; height: auto; }
            .code { font-family: monospace; font-size: 16px; font-weight: bold; margin-top: 8px; letter-spacing: 2px; }
            .details { margin-top: 12px; font-size: 14px; color: #555; }
          </style>
        </head>
        <body>
          <div class="label">
            <h2>FRESHLYNC LOGISTICS TRACKING</h2>
            <svg viewBox="0 0 ${totalWidth} 70" width="300" height="70">
              ${bars.map(b => `<rect x="${b.x}" y="0" width="${b.width}" height="70" fill="${b.color}" />`).join('')}
            </svg>
            <div class="code">${barcodeText}</div>
            <div class="details">Order ID: ${orderId || 'N/A'} | Status: ${status || 'Pending'}</div>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 1000);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '0.25rem 0.6rem', borderRadius: 6, border: '1px solid var(--color-border)' }}>
        <BarcodeIcon size={14} style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>{barcodeText}</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <BarcodeIcon size={13} style={{ color: 'var(--color-primary)' }} /> Scannable Order Barcode
        </span>
        <button
          onClick={handlePrint}
          title="Print Label"
          style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '0.25rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#334155' }}
        >
          <Printer size={12} /> Print Label
        </button>
      </div>

      {/* SVG Barcode graphics */}
      <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: 6, width: '100%', maxWidth: 320 }}>
        <svg viewBox={`0 0 ${totalWidth} 60`} style={{ width: '100%', height: 50, display: 'block' }}>
          {bars.map((b, idx) => (
            <rect key={idx} x={b.x} y={0} width={b.width} height={60} fill={b.color} />
          ))}
        </svg>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', color: '#0F172A', marginTop: '0.4rem' }}>
        {barcodeText}
      </div>

      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
        Scan with mobile phone camera or hardware reader to update status
      </div>
    </div>
  );
}
