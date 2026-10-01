'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Primary main landing page is the Citizen Portal
    router.replace('/citizen');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #cbd5e1',
          borderTopColor: '#1e3a8a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
          नगर परिषद चित्तौड़गढ़ नागरिक पोर्टल लोड हो रहा है...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
