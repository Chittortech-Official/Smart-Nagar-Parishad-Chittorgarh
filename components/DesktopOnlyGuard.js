'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from './ChittorgarhLogo';
import { Monitor, Smartphone, ArrowRight, LogOut, ShieldAlert } from 'lucide-react';

const DESKTOP_ROLES = ['chairman'];

const ROLE_NAMES = {
  chairman: 'चेयरमैन / सभापति',
};

export default function DesktopOnlyGuard({ children, role }) {
  const { switchRole, logout } = useAuth();
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [checked, setChecked] = useState(false);

  const isDesktopRole = DESKTOP_ROLES.includes(role);

  useEffect(() => {
    function handleResize() {
      // 1024px is standard laptop / desktop breakpoint
      setIsMobileScreen(window.innerWidth < 1024);
      setChecked(true);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!checked) {
    return null; // Brief flash prevention
  }

  // If testing in preview / side-by-side mode on narrow screens
  if (isDesktopRole && isMobileScreen && bypass) {
    return (
      <>
        <div style={{
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#1e40af',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          <span>🖥️ <strong>साइड-बाय-साइड टेस्टिंग मोड:</strong> डेस्कटॉप व्यू का पूर्वावलोकन सक्रिय है</span>
          <button
            onClick={() => setBypass(false)}
            style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: '0.72rem',
              color: '#1e40af',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            बंद करें
          </button>
        </div>
        {children}
      </>
    );
  }

  // If this role requires desktop and user is on mobile screen width:
  if (isDesktopRole && isMobileScreen && !bypass) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        textAlign: 'center',
        color: '#0f172a',
      }}>
        {/* Tricolor top strip */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #f97316 0%, #f97316 33.3%, #ffffff 33.3%, #ffffff 66.6%, #16a34a 66.6%, #16a34a 100%)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }} />

        <div style={{
          maxWidth: 480,
          width: '100%',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 20,
          padding: '32px 24px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <ChittorgarhLogo size={56} layout="vertical" />
          </div>

          {/* Desktop Only Notice Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            padding: '6px 14px',
            borderRadius: 9999,
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: 16,
          }}>
            <Monitor size={16} />
            <span>लैपटॉप / डेस्कटॉप आवश्यक (Laptop Only)</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#1e3a8a',
            marginBottom: 8,
            lineHeight: 1.3,
          }}>
            {ROLE_NAMES[role] || 'प्रशासनिक पोर्टल'}
          </h2>

          <p style={{
            fontSize: '0.875rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            चित्तौड़गढ़ नगर परिषद के <strong>एडमिन, चेयरमैन एवं अधिकारी</strong> पोर्टल प्रशासनिक नियंत्रण, 60 वार्डों के विस्तृत डेटा, कर्मचारियों की निगरानी एवं शिकायतों के त्वरित निस्तारण हेतु <strong>केवल लैपटॉप अथवा कंप्यूटर स्क्रीन (1024px+)</strong> पर चलने के लिए डिज़ाइन किए गए हैं।
          </p>

          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: '14px',
            fontSize: '0.8125rem',
            color: '#1e40af',
            marginBottom: 20,
            textAlign: 'left',
            display: 'flex',
            gap: 10,
          }}>
            <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: 2, color: '#2563eb' }} />
            <div>
              <strong>सुझाव:</strong> यह पोर्टल लैपटॉप/डेस्कटॉप के लिए अनुकूलित है। यदि आप साइड-बाय-साइड या मोबाइल स्क्रीन पर टेस्ट कर रहे हैं, तो नीचे दिए गए बटन से पूर्वावलोकन देख सकते हैं।
            </div>
          </div>

          {/* Test in Preview Button */}
          <button
            onClick={() => setBypass(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              marginBottom: 20,
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>👁️ साइड-बाय-साइड / मोबाइल पूर्वावलोकन देखें</span>
          </button>

          {/* Mobile Portals Quick Links */}
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: 10 }}>
              मोबाइल फ्रेंडली पोर्टल चुनें (Mobile Views):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => switchRole('citizen@demo.in')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#0284c7" />
                  🧑 नागरिक पोर्टल (Citizen Portal)
                </span>
                <ArrowRight size={15} color="#64748b" />
              </button>

              <button
                onClick={() => switchRole('employee@demo.in')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#16a34a" />
                  👷 फील्ड कर्मचारी (Field Employee)
                </span>
                <ArrowRight size={15} color="#64748b" />
              </button>

              <button
                onClick={() => switchRole('parshad@demo.in')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Smartphone size={16} color="#7c3aed" />
                  🏘️ वार्ड पार्षद (Ward Councillor)
                </span>
                <ArrowRight size={15} color="#64748b" />
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={logout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '10px',
              border: '1px solid #cbd5e1',
              borderRadius: 10,
              background: '#ffffff',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>लॉगआउट करें (Sign Out)</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: '0.75rem', color: '#94a3b8' }}>
          नगर परिषद चित्तौड़गढ़ (राजस्थान) • संपर्क: 01472-241246 | टोल फ्री: 181
        </div>
      </div>
    );
  }

  // Otherwise, render regular desktop view
  return children;
}
