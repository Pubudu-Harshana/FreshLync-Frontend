import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Barcode as BarcodeIcon, Truck, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useNotification } from '../context/NotificationContext';

export default function BarcodeScannerModal({ isOpen, onClose, onScanSuccess, availableOrders = [] }) {
  const { showToast } = useNotification();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Close camera on modal unmount
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setBarcodeInput('');
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setUseCamera(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this browser/device');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera on phones
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access phone camera');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const handleScanSubmit = async (codeToScan) => {
    const targetCode = codeToScan || barcodeInput;
    if (!targetCode || !targetCode.trim()) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await orderService.scanOrderBarcode(targetCode);
      setScanResult({
        success: true,
        message: res.message,
        order: res.order,
        status: res.status
      });

      showToast(res.message, 'success');
      setBarcodeInput('');

      if (onScanSuccess) {
        onScanSuccess(res.order);
      }
    } catch (err) {
      console.error('Scan error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Barcode scan failed';
      setScanResult({
        success: false,
        message: errMsg
      });
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(5px)',
      zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)',
        display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
              FreshLync Logistics Control
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarcodeIcon size={20} style={{ color: 'var(--color-primary)' }} /> Order Barcode Scanner
            </h3>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Instructions */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.875rem', borderRadius: 10, fontSize: '0.82rem', color: '#1E40AF', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Truck size={20} style={{ color: '#1D4ED8', flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Barcode Order Workflow:</strong>
              <div style={{ fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.4 }}>
                • <strong>Scan 1 (Dispatch)</strong>: Updates order status from <em>Pending</em> ➔ <strong style={{ color: '#1E40AF' }}>IN TRANSIT 🚚</strong><br />
                • <strong>Scan 2 (Delivery)</strong>: Updates order status from <em>In Transit</em> ➔ <strong style={{ color: '#15803D' }}>DELIVERED 📦</strong>
              </div>
            </div>
          </div>

          {/* Camera Scanner Viewfinder */}
          {useCamera ? (
            <div style={{ position: 'relative', background: '#000', borderRadius: 12, overflow: 'hidden', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Scanning red line animation */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid rgba(16, 185, 129, 0.6)', borderRadius: 12, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: 2, background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
              </div>
              <button
                onClick={stopCamera}
                style={{ position: 'absolute', bottom: 12, background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem 0.8rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Camera
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="btn-secondary"
              style={{ padding: '0.875rem', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, background: '#F8FAFC', border: '1px dashed var(--color-primary)' }}
            >
              <Camera size={18} style={{ color: 'var(--color-primary)' }} />
              <span>📷 Open Phone Camera / Webcam Scanner</span>
            </button>
          )}

          {cameraError && (
            <div style={{ color: '#EF4444', fontSize: '0.78rem', textAlign: 'center' }}>
              {cameraError}. Use manual barcode input below.
            </div>
          )}

          {/* Manual Input / Barcode Gun Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleScanSubmit(); }} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                className="input-field"
                placeholder="Scan or enter Barcode (e.g. BC-ORD-1049)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                autoFocus
                style={{ paddingRight: '2rem' }}
              />
              {barcodeInput && (
                <button
                  type="button"
                  onClick={() => setBarcodeInput('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !barcodeInput.trim()}
              className="btn-primary"
              style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}
            >
              {loading ? 'Scanning...' : 'Process Scan'}
            </button>
          </form>

          {/* Scan Results Display */}
          {scanResult && (
            <div style={{
              padding: '1rem', borderRadius: 10,
              background: scanResult.success ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${scanResult.success ? '#A7F3D0' : '#FCA5A5'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                {scanResult.success ? <CheckCircle2 size={18} style={{ color: '#16A34A' }} /> : <AlertCircle size={18} style={{ color: '#EF4444' }} />}
                <strong style={{ fontSize: '0.9rem', color: scanResult.success ? '#15803D' : '#991B1B' }}>
                  {scanResult.success ? 'Scan Processed Successfully' : 'Scan Failed'}
                </strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: scanResult.success ? '#166534' : '#991B1B', fontWeight: 600 }}>
                {scanResult.message}
              </div>
              {scanResult.order && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                  Order: <strong>#{scanResult.order._id?.slice(-6)?.toUpperCase()}</strong> | Buyer: {scanResult.order.delivery?.firstName || scanResult.order.buyer?.name || 'Customer'}
                </div>
              )}
            </div>
          )}

          {/* Quick One-Tap Test Barcodes */}
          {availableOrders.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} style={{ color: '#F59E0B' }} /> Quick One-Click Barcode Test Buttons:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 150, overflowY: 'auto' }}>
                {availableOrders.slice(0, 5).map((o, idx) => {
                  const bc = o.trackingBarcode || `BC-ORD-${o._id?.slice(-6)?.toUpperCase()}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleScanSubmit(bc)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.45rem 0.75rem', borderRadius: 6, background: '#F8FAFC',
                        border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '0.78rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#EEF2FF'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    >
                      <div>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{bc}</strong>
                        <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>(Order #{o._id?.slice(-6)?.toUpperCase()})</span>
                      </div>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 4,
                        background: o.status === 'In Transit' ? '#FEF3C7' : (o.status === 'Delivered' ? '#DCFCE7' : '#EFF6FF'),
                        color: o.status === 'In Transit' ? '#B45309' : (o.status === 'Delivered' ? '#166534' : '#1D4ED8')
                      }}>
                        {o.status || 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => { stopCamera(); onClose(); }} style={{ padding: '0.5rem 1.25rem' }}>
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
}
