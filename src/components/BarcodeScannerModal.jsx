import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [lastScannedCode, setLastScannedCode] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const barcodeDetectorRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Close camera on modal unmount / close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setBarcodeInput('');
      setLastScannedCode('');
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
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play error:', e));
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

  const handleScanSubmit = useCallback(async (codeToScan) => {
    const targetCode = codeToScan || barcodeInput;
    if (!targetCode || !targetCode.trim() || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setLoading(true);
    setScanResult(null);

    try {
      const res = await orderService.scanOrderBarcode(targetCode.trim());
      setScanResult({
        success: true,
        message: res.message,
        order: res.order,
        status: res.status
      });

      setLastScannedCode(targetCode.trim());
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
      // Brief cooldown to avoid double scanning
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
    }
  }, [barcodeInput, onScanSuccess, showToast]);

  // Live video frame barcode detection loop
  useEffect(() => {
    let animId;
    let isCancelled = false;

    const detectFrame = async () => {
      if (useCamera && videoRef.current && videoRef.current.readyState === 4 && !isProcessingRef.current) {
        try {
          if ('BarcodeDetector' in window) {
            if (!barcodeDetectorRef.current) {
              const formats = await window.BarcodeDetector.getSupportedFormats().catch(() => ['code_128', 'qr_code', 'code_39', 'ean_13', 'upc_a']);
              barcodeDetectorRef.current = new window.BarcodeDetector({ formats: formats.length ? formats : ['code_128', 'qr_code', 'code_39'] });
            }

            const barcodes = await barcodeDetectorRef.current.detect(videoRef.current);
            if (barcodes && barcodes.length > 0 && !isCancelled && !isProcessingRef.current) {
              const detected = barcodes[0].rawValue;
              if (detected && detected.trim() && detected.trim() !== lastScannedCode) {
                if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
                handleScanSubmit(detected.trim());
              }
            }
          }
        } catch (e) {
          // Silent catch for frame read glitches
        }
      }

      if (useCamera && !isCancelled) {
        animId = requestAnimationFrame(detectFrame);
      }
    };

    if (useCamera) {
      animId = requestAnimationFrame(detectFrame);
    }

    return () => {
      isCancelled = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [useCamera, lastScannedCode, handleScanSubmit]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(6px)',
      zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0.5rem', boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: 520,
        maxHeight: '92vh', overflowY: 'auto', overflowX: 'hidden', boxShadow: 'var(--shadow-xl)',
        display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)',
        boxSizing: 'border-box'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', flexShrink: 0 }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
              FreshLync Logistics Control
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarcodeIcon size={18} style={{ color: 'var(--color-primary)' }} /> Order Barcode Scanner
            </h3>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Instructions */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.75rem', borderRadius: 10, fontSize: '0.8rem', color: '#1E40AF', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <Truck size={18} style={{ color: '#1D4ED8', flexShrink: 0, marginTop: 2 }} />
            <div style={{ width: '100%' }}>
              <strong>Barcode Order Workflow:</strong>
              <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', lineHeight: 1.35 }}>
                • <strong>Scan 1 (Dispatch)</strong>: <em>Pending</em> ➔ <strong style={{ color: '#1E40AF' }}>IN TRANSIT 🚚</strong><br />
                • <strong>Scan 2 (Delivery)</strong>: <em>In Transit</em> ➔ <strong style={{ color: '#15803D' }}>DELIVERED 📦</strong>
              </div>
            </div>
          </div>

          {/* Camera Viewfinder */}
          {useCamera ? (
            <div style={{ position: 'relative', background: '#000', borderRadius: 12, overflow: 'hidden', height: 230, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Target overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid rgba(16, 185, 129, 0.6)', borderRadius: 12, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%', height: 2, background: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, color: 'white', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                  {loading ? 'Processing scan...' : 'Align barcode within frame — Auto-Detect Active'}
                </div>
              </div>

              <button
                onClick={stopCamera}
                style={{ position: 'absolute', bottom: 10, background: 'rgba(0,0,0,0.75)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Camera
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="btn-secondary"
              style={{ padding: '0.85rem', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, background: '#F8FAFC', border: '1.5px dashed var(--color-primary)', width: '100%', boxSizing: 'border-box' }}
            >
              <Camera size={18} style={{ color: 'var(--color-primary)' }} />
              <span>📷 Open Phone Camera / Webcam Scanner</span>
            </button>
          )}

          {cameraError && (
            <div style={{ color: '#EF4444', fontSize: '0.78rem', textAlign: 'center', padding: '0.4rem', background: '#FEF2F2', borderRadius: 6 }}>
              {cameraError}. You can enter barcode manually below.
            </div>
          )}

          {/* Form container optimized for Mobile screens */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleScanSubmit(); }} 
            style={{ display: 'flex', gap: '0.5rem', width: '100%', boxSizing: 'border-box', flexWrap: 'wrap' }}
          >
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <input
                className="input-field"
                placeholder="Scan or type barcode (e.g. BC-ORD-1049)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ paddingRight: '2rem', width: '100%', boxSizing: 'border-box', fontSize: '0.85rem' }}
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
              style={{ padding: '0.55rem 1.1rem', whiteSpace: 'nowrap', flex: '1 1 auto', justifyContent: 'center', fontSize: '0.85rem' }}
            >
              {loading ? 'Scanning...' : 'Process Scan'}
            </button>
          </form>

          {/* Scan Results Display */}
          {scanResult && (
            <div style={{
              padding: '0.875rem', borderRadius: 10, width: '100%', boxSizing: 'border-box',
              background: scanResult.success ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${scanResult.success ? '#A7F3D0' : '#FCA5A5'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {scanResult.success ? <CheckCircle2 size={18} style={{ color: '#16A34A' }} /> : <AlertCircle size={18} style={{ color: '#EF4444' }} />}
                <strong style={{ fontSize: '0.88rem', color: scanResult.success ? '#15803D' : '#991B1B' }}>
                  {scanResult.success ? 'Scan Processed Successfully' : 'Scan Failed'}
                </strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: scanResult.success ? '#166534' : '#991B1B', fontWeight: 600 }}>
                {scanResult.message}
              </div>
              {scanResult.order && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.4rem' }}>
                  Order: <strong>#{scanResult.order._id?.slice(-6)?.toUpperCase()}</strong> | Buyer: {scanResult.order.delivery?.firstName || scanResult.order.buyer?.name || 'Customer'}
                </div>
              )}
            </div>
          )}

          {/* Quick One-Tap Test Barcodes */}
          {availableOrders.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.875rem', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} style={{ color: '#F59E0B' }} /> Quick One-Click Barcode Test Buttons:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 140, overflowY: 'auto' }}>
                {availableOrders.slice(0, 5).map((o, idx) => {
                  const bc = o.trackingBarcode || `BC-ORD-${o._id?.slice(-6)?.toUpperCase()}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleScanSubmit(bc)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.45rem 0.75rem', borderRadius: 6, background: '#F8FAFC',
                        border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '0.78rem',
                        boxSizing: 'border-box'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#EEF2FF'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                        <strong style={{ fontFamily: 'var(--font-mono)' }}>{bc}</strong>
                        <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>(#{o._id?.slice(-6)?.toUpperCase()})</span>
                      </div>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 4, flexShrink: 0,
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
        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--color-border)', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button className="btn-secondary" onClick={() => { stopCamera(); onClose(); }} style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
}
