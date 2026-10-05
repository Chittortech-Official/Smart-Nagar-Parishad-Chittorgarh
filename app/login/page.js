'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from '@/components/ChittorgarhLogo';
import { LogIn, Eye, EyeOff, Zap, Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DEMO_LOGINS = [
  { email: 'citizen@demo.in',  name: 'राजेश कुमार (Rajesh)',  role: 'नागरिक (Citizen)',        type: 'mobile', color: '#0284c7', bg: '#e0f2fe' },
  { email: 'employee@demo.in', name: 'रमेश मीणा (Ramesh)',    role: 'कर्मचारी (Employee)',     type: 'mobile', color: '#16a34a', bg: '#dcfce7' },
  { email: 'parshad@demo.in',  name: 'श्रीमती कुसुम (Kusum - Ward 24)', role: 'वार्ड पार्षद (Councillor)',type: 'mobile', color: '#7c3aed', bg: '#f3e8ff' },
  { email: 'chairman@demo.in', name: 'श्री अनिल जी ईनाणी (Chairman)', role: 'सभापति / चेयरमैन', type: 'laptop', color: '#d97706', bg: '#fef3c7' },
];

const ROLE_PATHS = {
  citizen: '/citizen', employee: '/employee', parshad: '/parshad',
  chairman: '/chairman',
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('citizen@demo.in');
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
      router.push(ROLE_PATHS[result.role] || '/');
    }
  }

  function quickLogin(demoEmail) {
    setEmail(demoEmail);
    setPassword('demo1234');
    setError('');
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontWeight: 600, textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>मुख्य पृष्ठ (Home)</span>
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
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Official Emblem & Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <ChittorgarhLogo size={64} layout="vertical" />
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 4, fontWeight: 800 }}>
              पोर्टल लॉगिन (Sign In)
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              कृपया अपना पंजीकृत ईमेल एवं पासवर्ड दर्ज करें
            </p>
          </div>

          {/* Login Card */}
          <div className="card" style={{ marginBottom: 'var(--space-5)', padding: '28px 24px' }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="email-input">ईमेल पता (Email)</label>
                <input
                  id="email-input"
                  type="email"
                  className="form-input"
                  placeholder="name@chittorgarhmc.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" htmlFor="password-input">पासवर्ड (Password)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password-input"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', color: '#64748b', cursor: 'pointer',
                    }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                disabled={loading}
              >
                <LogIn size={18} />
                <span>{loading ? 'सत्यापित किया जा रहा है...' : 'लॉगिन करें (Sign In)'}</span>
              </button>
            </form>
          </div>

          {/* Quick Demo Logins Box */}
          <div className="card" style={{ background: '#f8fafc', padding: '18px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.8125rem', fontWeight: 700, color: '#1e3a8a',
              marginBottom: 10,
            }}>
              <Zap size={15} color="#ea580c" />
              <span>त्वरित डेमो लॉगिन (1-Click Demo Login)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_LOGINS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => quickLogin(u.email)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: email === u.email ? `2px solid ${u.color}` : '1px solid #e2e8f0',
                    background: '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: u.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {u.type === 'mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
                    <span>{u.role.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
              डेमो पासवर्ड: <code>demo1234</code> (स्वतः भरा हुआ)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
