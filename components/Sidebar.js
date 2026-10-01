'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard, FileText, MapPin, Users,
  Bell, ChevronRight, Building2,
  ClipboardList, Map, Shield,
  Tag, UserCog, LogOut, CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const NAV = {
  chairman: [
    { href: '/chairman',            label: 'नगर परिषद डैशबोर्ड', sub: 'City Overview', icon: LayoutDashboard },
    { href: '/chairman/wards',      label: 'समस्त 60 वार्ड',     sub: 'All Wards',     icon: MapPin },
    { href: '/chairman/departments',label: 'नगरपालिका विभाग',   sub: 'Departments',   icon: Building2 },
    { href: '/chairman/map',        label: 'लाइव GIS मैप',       sub: 'City GIS Map',  icon: Map },
  ],
};

const ROLE_METAS = {
  chairman: { title: 'सभापति (चेयरमैन)', sub: 'सर्वोच्च प्रशासनिक नियंत्रण · चित्तौड़गढ़', color: '#b45309', bg: '#fef3c7' },
};

export default function Sidebar({ currentProfile }) {
  const { profile: authProfile, logout } = useAuth();
  const profile = currentProfile || authProfile;
  const pathname = usePathname();
  const role = profile?.role;
  const navItems = NAV[role] || [];
  const meta = ROLE_METAS[role] || { title: 'प्रशासनिक पैनल', sub: 'Admin Portal', color: '#1e3a8a', bg: '#eff6ff' };
  const initials = profile?.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <aside className="sidebar desktop-sidebar">
      {/* Profile info card */}
      <div className="sidebar-profile-box">
        <div className="sidebar-profile-avatar" style={{ backgroundColor: meta.bg, color: meta.color, border: `1.5px solid ${meta.color}40` }}>
          {initials}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{profile?.full_name || 'Admin'}</div>
          <span className="sidebar-profile-badge" style={{ backgroundColor: meta.bg, color: meta.color }}>
            {meta.title}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <div className="sidebar-section">
        <span className="sidebar-section-label">प्रशासनिक नेविगेशन</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`sidebar-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{item.sub}</div>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 9999,
                  background: item.badgeBg || '#eff6ff',
                  color: item.badgeColor || '#1d4ed8',
                  border: `1px solid ${item.badgeColor || '#1d4ed8'}30`,
                }}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={15} color="#1d4ed8" />}
            </Link>
          );
        })}
      </div>

      {/* Official Municipality helpline tag */}
      <div className="sidebar-footer-card">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 2 }}>
          🏛️ नगर परिषद चित्तौड़गढ़
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
          कंट्रोल रूम: 01472-241246<br />
          राजस्थान संपर्क: 181
        </div>
      </div>

      {/* Logout button */}
      <div className="sidebar-bottom-action">
        <button className="sidebar-logout-btn" onClick={logout}>
          <LogOut size={16} />
          <span>लॉगआउट (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}
