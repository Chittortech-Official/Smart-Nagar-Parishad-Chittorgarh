'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Users, UserCircle, Briefcase, Building2,
  Crown, Shield, X, Smartphone, Monitor
} from 'lucide-react';

const MOBILE_ROLES = [
  { email: 'citizen@demo.in',  label: 'नागरिक (Citizen)',        sub: 'Rajesh Kumar · Ward 24',   icon: UserCircle, color: '#0284c7', role: 'citizen',     path: '/citizen' },
  { email: 'employee@demo.in', label: 'कर्मचारी (Employee)',     sub: 'Ramesh Meena · Sanitation', icon: Users,      color: '#16a34a', role: 'employee',    path: '/employee' },
  { email: 'parshad@demo.in',  label: 'पार्षद (Councillor)',     sub: 'Kamla Bai · Ward 24',       icon: Briefcase,  color: '#7c3aed', role: 'parshad',     path: '/parshad' },
];

const LAPTOP_ROLES = [
  { email: 'officer@demo.in',  label: 'अधिकारी (Officer)',       sub: 'Suresh Sharma · Sanitation',icon: Building2,  color: '#2563eb', role: 'officer',     path: '/officer' },
  { email: 'chairman@demo.in', label: 'चेयरमैन (Chairman)',      sub: 'Prem Singh Ji · All Wards', icon: Crown,      color: '#d97706', role: 'chairman',    path: '/chairman' },
  { email: 'admin@demo.in',    label: 'एडमिन (Super Admin)',     sub: 'System Admin · Chittorgarh',icon: Shield,     color: '#dc2626', role: 'super_admin', path: '/admin' },
];

export default function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { switchRole, profile } = useAuth();
  const router = useRouter();

  function handleSwitch(r) {
    switchRole(r.email);
    router.push(r.path);
    setOpen(false);
  }

  return (
    <div className="role-switcher hide-mobile">
      {open && (
        <div className="role-switcher-menu">
          <div className="role-switcher-header">
            <span className="role-switcher-title">रोल स्विचर (Dev Role Switcher)</span>
            <button className="role-switcher-close" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Mobile Group */}
          <div className="role-group-label">
            <Smartphone size={13} color="#0284c7" />
            <span>मोबाइल पोर्टल (Mobile Views)</span>
          </div>
          {MOBILE_ROLES.map((r) => {
            const Icon = r.icon;
            const isCurrent = profile?.role === r.role;
            return (
              <button
                key={r.email}
                className={`role-option ${isCurrent ? 'current' : ''}`}
                onClick={() => handleSwitch(r)}
              >
                <span className="role-dot" style={{ background: r.color }} />
                <Icon size={15} style={{ color: r.color, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <span className="role-name">
                    {r.label} {isCurrent && '✓'}
                  </span>
                  <span className="role-sub">{r.sub}</span>
                </span>
              </button>
            );
          })}

          <div className="role-group-divider" />

          {/* Laptop Group */}
          <div className="role-group-label">
            <Monitor size={13} color="#ea580c" />
            <span>लैपटॉप पोर्टल (Laptop Only)</span>
          </div>
          {LAPTOP_ROLES.map((r) => {
            const Icon = r.icon;
            const isCurrent = profile?.role === r.role;
            return (
              <button
                key={r.email}
                className={`role-option ${isCurrent ? 'current' : ''}`}
                onClick={() => handleSwitch(r)}
              >
                <span className="role-dot" style={{ background: r.color }} />
                <Icon size={15} style={{ color: r.color, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <span className="role-name">
                    {r.label} {isCurrent && '✓'}
                  </span>
                  <span className="role-sub">{r.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <button
        className="role-switcher-toggle"
        onClick={() => setOpen(!open)}
        title="स्विच रोल (Switch Role)"
      >
        {open ? <X size={16} /> : <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>⚡ रोल बदलें</span>}
      </button>
    </div>
  );
}
