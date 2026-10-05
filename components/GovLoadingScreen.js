'use client';

import { Loader2 } from 'lucide-react';

export default function GovLoadingScreen({ 
  message = 'नागरिक पोर्टल लोड हो रहा है...', 
  subtext = 'स्वायत्त शासन विभाग, राजस्थान सरकार' 
}) {
  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      {/* Official Government Emblem Container - Pure white background card with zero clipping */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: 16,
        padding: '16px 24px',
        boxShadow: '0 4px 24px rgba(30, 58, 138, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
      }}>
        <img
          src="/logo.png"
          alt="Government of Rajasthan - Emblem of India"
          style={{
            height: 68,
            width: 'auto',
            maxWidth: 160,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Official Department Subtitle */}
      <div style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        color: '#c2410c',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 4,
      }}>
        {subtext}
      </div>

      {/* Municipal Title */}
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        color: '#1e3a8a',
        marginBottom: 16,
      }}>
        नगर परिषद चित्तौड़गढ़
      </div>

      {/* Loading Status Pill with dynamic spinning Loader2 */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        padding: '8px 20px',
        borderRadius: 9999,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}>
        <Loader2 
          size={18} 
          color="#ea580c" 
          className="gov-spinner-active" 
          style={{ 
            animation: 'govSpinContinuous 0.8s linear infinite', 
            flexShrink: 0 
          }} 
        />
        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e3a8a' }}>
          {message}
        </span>
      </div>
    </div>
  );
}
