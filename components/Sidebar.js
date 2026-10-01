'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard, FileText, MapPin, Users,
  Bell, ChevronRight, Building2,
  ClipboardList, Map, Shield,
  Tag, UserCog, LogOut, CheckCircle2
} from 'lucide-react';

const NAV = {
  officer: [
    { href: '/officer',             label: 'विभागीय मुख्य पृष्ठ', sub: 'Overview',      icon: LayoutDashboard },
    { href: '/officer/complaints',  label: 'शिकायत प्रबंधन',      sub: 'Complaints',    icon: ClipboardList },
    { href: '/officer/employees',   label: 'कर्मचारी व कार्य',   sub: 'Staff & Tasks', icon: Users },
  ],
  chairman: [
    { href: '/chairman',            label: 'नगर परिषद डैशबोर्ड', sub: 'City Overview', icon: LayoutDashboard },
    { href: '/chairman/wards',      label: 'समस्त 60 वार्ड',     sub: 'All Wards',     icon: MapPin },
    { href: '/chairman/departments',label: 'नगरपालिका विभाग',   sub: 'Departments',   icon: Building2 },
  ],
  super_admin: [
    { href: '/admin',               label: 'सिस्टम ओवरव्यू',     sub: 'Overview',      icon: LayoutDashboard },
    { href: '/admin/wards',         label: 'वार्ड प्रबंधन',      sub: 'Wards',         icon: MapPin },
    { href: '/admin/departments',   label: 'विभाग प्रबंधन',      sub: 'Departments',   icon: Building2 },
    { href: '/admin/categories',    label: 'शिकायत श्रेणियां',   sub: 'Categories',    icon: Tag },
    { href: '/admin/users',         label: 'उपयोगकर्ता सूची',    sub: 'Users & Roles', icon: UserCog },
  ],
};

const ROLE_METAS = {
  officer:     { title: 'विभागीय अधिकारी', sub: 'Officer Portal', color: '#1d4ed8', bg: '#eff6ff' },
  chairman:    { title: 'सभापति / चेयरमैन', sub: 'Chittorgarh MC', color: '#b45309', bg: '#fef3c7' },
  super_admin: { title: 'सुपर एडमिन',     sub: 'System Master',  color: '#b91c1c', bg: '#fee2e2' },
};

export default function Sidebar() {
  const { profile, logout } = useAuth();
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
