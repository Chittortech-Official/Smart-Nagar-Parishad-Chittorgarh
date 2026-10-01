'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from './ChittorgarhLogo';
import { LogOut, Phone, Home, Plus, ClipboardList } from 'lucide-react';

const ROLE_CONFIG = {
  citizen:     { label: 'नागरिक',  badgeBg: '#e0f2fe', badgeText: '#0369a1', border: '#bae6fd' },
  employee:    { label: 'कर्मचारी', badgeBg: '#dcfce7', badgeText: '#15803d', border: '#bbf7d0' },
  parshad:     { label: 'पार्षद',   badgeBg: '#f3e8ff', badgeText: '#7e22ce', border: '#e9d5ff' },
  chairman:    { label: 'सभापति (चेयरमैन)', badgeBg: '#fef3c7', badgeText: '#b45309', border: '#fde68a' },
  router:      { label: 'कंट्रोल रूम राउटर', badgeBg: '#fef3c7', badgeText: '#b45309', border: '#fde68a' },
};

export default function Navbar({ currentProfile }) {
  const [mounted, setMounted] = useState(false);
  const { profile: authProfile, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);
  const profile = currentProfile || authProfile;
  const role = profile?.role;
  const pathname = usePathname();
  const cfg = ROLE_CONFIG[role] || { label: 'पोर्टल', badgeBg: '#f1f5f9', badgeText: '#334155', border: '#e2e8f0' };

  return (
    <header className="site-header">
      {/* 1. Indian Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* 2. Official Rajasthan Helpline Top Strip (Desktop Only to prevent mobile overlap) */}
      <div className="gov-topbar hide-mobile">
        <div className="gov-topbar-inner">
          <div className="gov-topbar-left">
            <span>स्वायत्त शासन विभाग, राजस्थान सरकार</span>
            <span className="gov-sep">|</span>
            <span className="gov-highlight">चित्तौड़गढ़ नगर परिषद</span>
          </div>
          <div className="gov-topbar-right">
            <a href="tel:181" className="gov-topbar-link">
              <Phone size={12} />
              <span>संपर्क हेल्पलाइन: <strong>181</strong></span>
            </a>
            <span className="gov-sep">|</span>
            <span className="gov-topbar-link">
              <span>कंट्रोल रूम: <strong>01472-241246</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Brand & Navigation Bar */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" className="navbar-brand-link">
            <ChittorgarhLogo size={34} compact={true} />
          </Link>

          {/* Desktop Navigation for Citizen */}
          {role === 'citizen' && (
            <div className="navbar-nav-links hide-mobile">
              <Link href="/citizen" className={`nav-link-pill ${pathname === '/citizen' ? 'active' : ''}`}>
                <Home size={15} /> <span>मुख्य डैशबोर्ड</span>
              </Link>
              <Link href="/citizen/report" className={`nav-link-pill ${pathname === '/citizen/report' ? 'active' : ''}`} style={{ color: '#16a34a', fontWeight: 700 }}>
                <Plus size={15} /> <span>समस्या दर्ज करें</span>
              </Link>
              <Link href="/citizen/complaints" className={`nav-link-pill ${pathname === '/citizen/complaints' ? 'active' : ''}`}>
                <ClipboardList size={15} /> <span>मेरी शिकायतें</span>
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {profile && (
            <div className="navbar-user-block">
              {/* Role Badge */}
              <div
                className="navbar-role-pill"
                style={{
                  backgroundColor: cfg.badgeBg,
                  color: cfg.badgeText,
                  border: `1px solid ${cfg.border}`,
                }}
              >
                <span className="navbar-role-dot" style={{ backgroundColor: cfg.badgeText }} />
                <span>{cfg.label}</span>
              </div>

              {/* User Name (Desktop) - rendered client-side after mount to prevent hydration mismatch */}
              {mounted && (
                <div className="navbar-user-details hide-mobile">
                  <span className="navbar-user-name">{profile.full_name}</span>
                  {profile.ward_id && <span className="navbar-user-sub">वार्ड नं. {profile.ward_id.replace('ward-', '')}</span>}
                </div>
              )}

              {/* Logout Button (Desktop only, mobile has it in bottom nav) */}
              <button
                onClick={logout}
                className="btn-navbar-logout hide-mobile"
                title="लॉगआउट (Logout)"
              >
                <LogOut size={15} />
                <span>लॉगआउट</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
