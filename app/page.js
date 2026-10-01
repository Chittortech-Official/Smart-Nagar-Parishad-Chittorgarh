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
  { href: '/citizen',  label: 'नागरिक पोर्टल',  en: 'Citizen Portal',     desc: 'समस्या दर्ज करें व स्थिति ट्रैक करें', icon: UserCircle,  color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd', roleEmail: 'citizen@demo.in' },
  { href: '/employee', label: 'फील्ड कर्मचारी', en: 'Field Employee',     desc: 'GPS हाजिरी व कार्य पूर्णता',        icon: Users,       color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', roleEmail: 'employee@demo.in' },
  { href: '/parshad',  label: 'वार्ड पार्षद',   en: 'Ward Councillor',    desc: 'अपने वार्ड की सभी समस्याओं पर नजर', icon: Briefcase,   color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff', roleEmail: 'parshad@demo.in' },
];

const LAPTOP_PORTALS = [
  { href: '/officer',  label: 'विभागीय अधिकारी', en: 'Dept. Officer',    desc: 'शिकायत निस्तारण व टीम प्रबंधन',   icon: Building2,   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', roleEmail: 'officer@demo.in' },
  { href: '/chairman', label: 'चेयरमैन / सभापति', en: 'Chairman Portal',   desc: 'पूरे चित्तौड़गढ़ नगर का नियंत्रण',   icon: Crown,       color: '#d97706', bg: '#fef3c7', border: '#fde68a', roleEmail: 'chairman@demo.in' },
  { href: '/admin',    label: 'सुपर एडमिन',     en: 'Super Admin',       desc: 'सिस्टम, वार्ड व यूजर कॉन्फ़िगरेशन',  icon: Shield,      color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', roleEmail: 'admin@demo.in' },
];

const HIGHLIGHTS = [
  'समस्त 60 वार्ड एवं 6 नगरपालिका विभाग लाइव',
  'राजस्थान संपर्क (181) एवं स्वायत्त शासन समन्वय',
  'नागरिकों, कर्मचारियों एवं पार्षदों हेतु मोबाइल इंटरफेस',
  'अधिकारियों एवं चेयरमैन हेतु संपूर्ण डेटा नियंत्रण कक्ष',
];

const FEATURED_TEST_ROLES = [
  {
    title: 'नागरिक पोर्टल (Citizen)',
    roleName: 'Rajesh Kumar (वार्ड 24)',
    path: '/citizen',
    icon: UserCircle,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    desc: 'समस्या दर्ज करें, स्थिति ट्रैक करें, समाधान फीडबैक दें।',
    badge: '📱 मोबाइल फर्स्ट'
  },
  {
    title: 'सभापति / चेयरमैन (Chairman)',
    roleName: 'Prem Singh Ji (समस्त 60 वार्ड)',
    path: '/chairman',
    icon: Crown,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    desc: 'समस्त 60 वार्डों की लाइव समीक्षा, विभागवार प्रदर्शन व GIS मैप।',
    badge: '💻 नियंत्रण कक्ष'
  },
  {
    title: 'विभागीय अधिकारी (Officer)',
    roleName: 'Suresh Sharma (स्वच्छता विभाग)',
    path: '/officer',
    icon: Building2,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    desc: 'आने वाली शिकायतें जांचें, कर्मचारियों को कार्य आवंटित करें।',
    badge: '💻 प्रबंधन डेस्क'
  },
  {
    title: 'वार्ड पार्षद (Parshad)',
    roleName: 'Smt. Kamla Bai (वार्ड 24 पार्षद)',
    path: '/parshad',
    icon: Briefcase,
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    desc: 'वार्ड की समस्याएं, उपस्थित सफाईकर्मी एवं प्रगति समीक्षा।',
    badge: '📱 मोबाइल फर्स्ट'
  },
];

export default function HomePage() {
  const { profile, loading, switchRole } = useAuth();
  const router = useRouter();

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

      {/* SIDE-BY-SIDE MULTI-ROLE TESTING HUB */}
      <div style={{
        maxWidth: 960,
        width: '100%',
        marginTop: 'var(--space-8)',
        background: '#ffffff',
        border: '2px solid #bfdbfe',
        borderRadius: 16,
        padding: '20px 18px',
        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.08)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #bfdbfe'
              }}>
                ⚡ साइड-बाय-साइड लाइव टेस्टिंग (Side-by-Side Live Testing)
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                प्रत्येक पोर्टल के लिए अलग रूट
              </span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', marginTop: 4, marginBottom: 2 }}>
              नागरिक, सभापति, अधिकारी एवं पार्षद पोर्टल सीधे टेस्ट करें
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              आप अलग-अलग विंडो/टैब में इन्हें खोलकर समानांतर रूप से (Side-by-Side) परीक्षण कर सकते हैं:
            </p>
          </div>

          <Link href="/login" style={{
            fontSize: '0.8125rem',
            color: '#1d4ed8',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            पासवर्ड लॉगिन फॉर्म <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Featured Test Role Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12
        }}>
          {FEATURED_TEST_ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.path}
                style={{
                  background: r.bg,
                  border: `1.5px solid ${r.border}`,
                  borderRadius: 12,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}>
                      <Icon size={20} style={{ color: r.color }} />
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: '#ffffff',
                      color: r.color,
                      border: `1px solid ${r.border}`
                    }}>
                      {r.badge}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: 2 }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: r.color, fontWeight: 700, marginBottom: 4 }}>
                    रूट: {r.path}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    {r.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <Link
                    href={r.path}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      fontSize: '0.75rem',
                      justifyContent: 'center',
                      background: r.color,
                      borderColor: r.color,
                    }}
                  >
                    पोर्टल खोलें
                  </Link>
                  <a
                    href={r.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="नई विंडो/टैब में खोलें (Open in New Tab / Side-by-Side)"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '7px 10px',
                      background: '#ffffff',
                      border: `1.5px solid ${r.border}`,
                      borderRadius: 8,
                      color: r.color,
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    अलग विंडो 🔗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
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
              <div key={p.href} className="portal-card" style={{ position: 'relative' }}>
                <Link href={p.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div className="portal-icon" style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
                    <Icon size={26} style={{ color: p.color }} />
                  </div>
                  <div className="portal-label">{p.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>{p.en}</div>
                  <div className="portal-desc">{p.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <span className="portal-badge" style={{ background: p.bg, color: p.color }}>
                      📱 मोबाइल फ्रेंडली
                    </span>
                    <span style={{ fontSize: '0.75rem', color: p.color, fontWeight: 700 }}>
                      प्रवेश करें &rarr;
                    </span>
                  </div>
                </Link>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'none' }}
                  >
                    🔗 नई विंडो में खोलें
                  </a>
                </div>
              </div>
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
              <div key={p.href} className="portal-card" style={{ position: 'relative' }}>
                <Link href={p.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div className="portal-icon" style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
                    <Icon size={26} style={{ color: p.color }} />
                  </div>
                  <div className="portal-label">{p.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>{p.en}</div>
                  <div className="portal-desc">{p.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <span className="portal-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      💻 केवल लैपटॉप / डेस्कटॉप
                    </span>
                    <span style={{ fontSize: '0.75rem', color: p.color, fontWeight: 700 }}>
                      प्रवेश करें &rarr;
                    </span>
                  </div>
                </Link>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'none' }}
                  >
                    🔗 नई विंडो में खोलें
                  </a>
                </div>
              </div>
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
