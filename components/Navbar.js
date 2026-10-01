'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import ChittorgarhLogo from './ChittorgarhLogo';
import { LogOut, Phone } from 'lucide-react';

const ROLE_CONFIG = {
  citizen:     { label: 'नागरिक',  badgeBg: '#e0f2fe', badgeText: '#0369a1', border: '#bae6fd' },
  employee:    { label: 'कर्मचारी', badgeBg: '#dcfce7', badgeText: '#15803d', border: '#bbf7d0' },
  parshad:     { label: 'पार्षद',   badgeBg: '#f3e8ff', badgeText: '#7e22ce', border: '#e9d5ff' },
  officer:     { label: 'अधिकारी',  badgeBg: '#eff6ff', badgeText: '#1d4ed8', border: '#bfdbfe' },
  chairman:    { label: 'सभापति',   badgeBg: '#fef3c7', badgeText: '#b45309', border: '#fde68a' },
  super_admin: { label: 'एडमिन',    badgeBg: '#fee2e2', badgeText: '#b91c1c', border: '#fca5a5' },
};

export default function Navbar({ currentProfile }) {
  const { profile: authProfile, logout } = useAuth();
  const profile = currentProfile || authProfile;
  const role = profile?.role;
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
        <Link href="/" className="navbar-brand-link">
          <ChittorgarhLogo size={34} compact={true} />
        </Link>

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

              {/* User Name (Desktop) */}
              <div className="navbar-user-details hide-mobile">
                <span className="navbar-user-name">{profile.full_name}</span>
                {profile.ward_id && <span className="navbar-user-sub">वार्ड नं. {profile.ward_id.replace('ward-', '')}</span>}
              </div>

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
