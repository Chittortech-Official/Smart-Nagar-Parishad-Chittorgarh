'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from '@/components/ChittorgarhLogo';
import { LogIn, Eye, EyeOff, Zap, Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DEMO_LOGINS = [
  { email: 'citizen@demo.in',  name: 'राजेश कुमार (नागरिक)',         role: 'नागरिक पोर्टल',            desc: 'शिकायत दर्ज व ट्रैकिंग', type: 'mobile', color: '#0284c7', bg: '#e0f2fe' },
  { email: 'employee@demo.in', name: 'रमेश मीणा (सफाई कर्मचारी)',   role: 'कर्मचारी फील्ड पोर्टल',     desc: 'GPS हाजिरी व कार्य',      type: 'mobile', color: '#16a34a', bg: '#dcfce7' },
  { email: 'parshad@demo.in',  name: 'श्रीमती कुसुम (पार्षद - वार्ड 24)', role: 'वार्ड पार्षद निगरानी पोर्टल', desc: 'वार्ड 24 शिकायत व टीम', type: 'mobile', color: '#7c3aed', bg: '#f3e8ff' },
  { email: 'chairman@demo.in', name: 'श्री अनिल जी ईनाणी (सभापति)', role: 'सभापति / चेयरमैन कक्ष',     desc: 'जनता दरबार व नगर नियंत्रण', type: 'laptop', color: '#d97706', bg: '#fef3c7' },
];

const ROLE_PATHS = {
  citizen: '/citizen',
  employee: '/employee',
  parshad: '/parshad',
  chairman: '/chairman',
};

export default function DemoLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('parshad@demo.in');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('कृपया ईमेल और पासवर्ड दर्ज करें।'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(ROLE_PATHS[result.role] || '/citizen');
    }
  }

  async function handleOneClickLogin(demoEmail) {
    setEmail(demoEmail);
    setPassword('demo1234');
    setError('');
    setLoading(true);
    const result = await login(demoEmail, 'demo1234');
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(ROLE_PATHS[result.role] || '/citizen');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
    }}>
      {/* Top Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* Official Top Strip */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8125rem',
      }}>
        <Link href="/citizen" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>नागरिक पोर्टल पर लौटें (Citizen Portal)</span>
        </Link>
        <div style={{ color: '#64748b' }}>
          टोल फ्री: <strong style={{ color: '#16a34a' }}>181</strong> | कंट्रोल रूम: <strong>01472-241246</strong>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* Official Emblem & Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <ChittorgarhLogo size={64} layout="vertical" />
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 4, fontWeight: 800 }}>
              पोर्टल लॉगिन (Sign In)
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              कृपया अपना पंजीकृत ईमेल एवं पासवर्ड दर्ज करें
            </p>
          </div>

          {/* Quick 1-Click Role Switcher */}
          <div className="card" style={{ padding: '16px', marginBottom: 18, border: '1.5px solid #bfdbfe', background: '#f0f9ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Zap size={15} color="#2563eb" />
              <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1-क्लिक त्वरित डेमो लॉगिन (One-Click Demo Access)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              {DEMO_LOGINS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleOneClickLogin(demo.email)}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1.5px solid ${demo.color}40`,
                    background: '#ffffff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = demo.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${demo.color}40`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: demo.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: demo.color,
                  }}>
                    {demo.type === 'laptop' ? <Monitor size={16} /> : <Smartphone size={16} />}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                      {demo.role}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {demo.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Form */}
          <div className="card" style={{ padding: '22px' }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: '0.82rem',
                marginBottom: 16,
                fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 5 }}>
                  पंजीकृत ईमेल (Registered Email)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@demo.in"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 5 }}>
                  पासवर्ड (Password)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      padding: 0,
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <LogIn size={16} />
                {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें (Sign In)'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
