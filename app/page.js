'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from '@/components/ChittorgarhLogo';
import {
  UserCircle, Users, Briefcase, Building2,
  Crown, Shield, ArrowRight, MapPin, CheckCircle,
  Phone, Globe, Smartphone, Monitor
} from 'lucide-react';

const MOBILE_PORTALS = [
  { href: '/login?role=citizen',  label: 'नागरिक पोर्टल',  en: 'Citizen Portal',     desc: 'समस्या दर्ज करें व स्थिति ट्रैक करें', icon: UserCircle,  color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' },
  { href: '/login?role=employee', label: 'फील्ड कर्मचारी', en: 'Field Employee',     desc: 'GPS हाजिरी व कार्य पूर्णता',        icon: Users,       color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  { href: '/login?role=parshad',  label: 'वार्ड पार्षद',   en: 'Ward Councillor',    desc: 'अपने वार्ड की सभी समस्याओं पर नजर', icon: Briefcase,   color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff' },
];

const LAPTOP_PORTALS = [
  { href: '/login?role=officer',  label: 'विभागीय अधिकारी', en: 'Dept. Officer',    desc: 'शिकायत निस्तारण व टीम प्रबंधन',   icon: Building2,   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { href: '/login?role=chairman', label: 'चेयरमैन / सभापति', en: 'Chairman Portal',   desc: 'पूरे चित्तौड़गढ़ नगर का नियंत्रण',   icon: Crown,       color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  { href: '/login?role=admin',    label: 'सुपर एडमिन',     en: 'Super Admin',       desc: 'सिस्टम, वार्ड व यूजर कॉन्फ़िगरेशन',  icon: Shield,      color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
];

const HIGHLIGHTS = [
  'समस्त 60 वार्ड एवं 6 नगरपालिका विभाग लाइव',
  'राजस्थान संपर्क (181) एवं स्वायत्त शासन समन्वय',
  'नागरिकों, कर्मचारियों एवं पार्षदों हेतु मोबाइल इंटरफेस',
  'अधिकारियों एवं चेयरमैन हेतु संपूर्ण डेटा नियंत्रण कक्ष',
];

export default function HomePage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile) {
      const paths = { citizen:'/citizen', employee:'/employee', parshad:'/parshad', officer:'/officer', chairman:'/chairman', super_admin:'/admin' };
      if (paths[profile.role]) router.replace(paths[profile.role]);
    }
  }, [profile, loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: '#64748b' }}>लोड हो रहा है... (Loading Smart Chittorgarh)</p>
      </div>
    );
  }

  return (
    <main className="landing-hero">
      {/* Official Top Tricolor Bar */}
      <div className="gov-tricolor-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0 }} />

      {/* Official Rajasthan Header Strip */}
      <div style={{
        position: 'fixed',
        top: 4,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#475569',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, color: '#1e3a8a' }}>स्वायत्त शासन विभाग, राजस्थान सरकार</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: '#ea580c', fontWeight: 600 }}>चित्तौड़गढ़ नगर परिषद (Chittorgarh MC)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="hide-mobile">हेल्पलाइन: <strong>01472-241246</strong></span>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>टोल फ्री: 181</span>
        </div>
      </div>

      {/* Emblem & Branding */}
      <div className="landing-emblem" style={{ marginTop: 'var(--space-8)' }}>
        <ChittorgarhLogo size={80} layout="vertical" />
      </div>

      {/* Main Headline */}
      <div style={{ maxWidth: 680, width: '100%', marginTop: 'var(--space-2)' }}>
        <h1 style={{ color: '#1e3a8a', marginBottom: '0.4rem', fontWeight: 800 }}>
          स्मार्ट चित्तौड़गढ़ नगर परिषद
        </h1>
        <h2 style={{ fontWeight: 600, fontSize: '1.15rem', color: '#c2410c', marginBottom: 'var(--space-4)' }}>
          एकीकृत नगरपालिका नागरिक एवं प्रशासनिक पोर्टल
        </h2>
        <p style={{ maxWidth: 560, margin: '0 auto', fontSize: '0.9375rem', color: '#334155' }}>
          चित्तौड़गढ़ नगर परिषद के नागरिकों, सफाई कर्मचारियों, वार्ड पार्षदों, विभागीय अधिकारियों एवं सभापति को जोड़ने वाला डिजिटल ई-गवर्नेंस मंच।
        </p>

        {/* Feature Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
          {HIGHLIGHTS.map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-full)', padding: '5px 12px',
              fontSize: '0.75rem', color: '#15803d', fontWeight: 600,
            }}>
              <CheckCircle size={13} />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Login CTA Button */}
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/login" className="btn btn-primary btn-lg" style={{ gap: 10, padding: '12px 28px', fontSize: '0.95rem' }}>
          पोर्टल में लॉगिन करें (Sign In) <ArrowRight size={18} />
        </Link>
      </div>

      {/* SECTION 1: Mobile-First Services (Citizen, Employee, Parshad) */}
      <div style={{ maxWidth: 900, width: '100%', marginTop: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 'var(--space-3)',
          color: '#0284c7',
          fontWeight: 700,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <Smartphone size={16} />
          <span>नागरिक एवं फील्ड सेवाएं (Mobile-First Portals)</span>
        </div>

        <div className="role-portal-grid" style={{ marginTop: 0 }}>
          {MOBILE_PORTALS.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} className="portal-card">
                <div className="portal-icon" style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
                  <Icon size={26} style={{ color: p.color }} />
                </div>
                <div className="portal-label">{p.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>{p.en}</div>
                <div className="portal-desc">{p.desc}</div>
                <span className="portal-badge" style={{ background: p.bg, color: p.color }}>
                  📱 मोबाइल फ्रेंडली
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Laptop-Only Administrative Services (Officer, Chairman, Admin) */}
      <div style={{ maxWidth: 900, width: '100%', marginTop: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 'var(--space-3)',
          color: '#ea580c',
          fontWeight: 700,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <Monitor size={16} />
          <span>प्रशासनिक नियंत्रण एवं समीक्षा (Laptop / Desktop Only)</span>
        </div>

        <div className="role-portal-grid" style={{ marginTop: 0 }}>
          {LAPTOP_PORTALS.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} className="portal-card">
                <div className="portal-icon" style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
                  <Icon size={26} style={{ color: p.color }} />
                </div>
                <div className="portal-label">{p.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>{p.en}</div>
                <div className="portal-desc">{p.desc}</div>
                <span className="portal-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  💻 केवल लैपटॉप / डेस्कटॉप
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Official Government Footer & UIT Reference */}
      <div style={{
        marginTop: 'var(--space-10)',
        paddingTop: 'var(--space-6)',
        borderTop: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: 900,
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.8125rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4, fontWeight: 600, color: '#1e3a8a' }}>
          <MapPin size={14} color="#ea580c" />
          <span>कार्यालय: नगर परिषद चित्तौड़गढ़, रेलवे ओवरब्रिज के पास, चित्तौड़गढ़ (राज.) 312001</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
          <span>📞 दूरभाष: 01472-241246</span>
          <span>✉️ mc_chittorgarh@yahoo.co.in</span>
          <a href="https://urban.rajasthan.gov.in/uitchittorgarh" target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>
            यूआईटी चित्तौड़गढ़ (UIT Portal)
          </a>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#94a3b8' }}>
          नगर परिषद चित्तौड़गढ़ © {new Date().getFullYear()} • सर्वाधिकार सुरक्षित • स्वायत्त शासन विभाग राजस्थान
        </div>
      </div>
    </main>
  );
}
