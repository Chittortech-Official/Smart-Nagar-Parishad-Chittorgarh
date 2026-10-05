'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Users, UserCircle, Briefcase, Building2,
  Crown, Shield, X, Smartphone, Monitor, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const ALL_ROLES = [
  { email: 'citizen@demo.in',  label: 'नागरिक (Citizen)',        sub: 'राजेश कुमार · वार्ड 24 (Mobile & Desktop)',   icon: UserCircle, color: '#0284c7', role: 'citizen',     path: '/citizen' },
  { email: 'employee@demo.in', label: 'कर्मचारी (Employee)',     sub: 'रमेश मीणा · स्वास्थ्य शाखा (Mobile Only)',   icon: Users,      color: '#16a34a', role: 'employee',    path: '/employee' },
  { email: 'parshad@demo.in',  label: 'वार्ड पार्षद (Councillor)', sub: 'श्रीमती कुसुम (भाजपा) · वार्ड 24 (Mobile & Desktop)', icon: Briefcase, color: '#7c3aed', role: 'parshad', path: '/parshad' },
  { email: 'chairman@demo.in', label: 'सभापति (Chairman)',       sub: 'श्री अनिल जी ईनाणी · सर्वोच्च नियंत्रण कक्ष',  icon: Crown,      color: '#d97706', role: 'chairman',   path: '/chairman' },
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
    <div className="role-switcher">
      {open && (
        <div className="role-switcher-menu">
          <div className="role-switcher-header">
            <span className="role-switcher-title">रोल स्विचर (Dev Role Switcher)</span>
            <button className="role-switcher-close" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Role list */}
          <div className="role-group-label">
            <Crown size={13} color="#ea580c" />
            <span>नगर परिषद पोर्टल (Official Portals)</span>
          </div>
          {ALL_ROLES.map((r) => {
            const Icon = r.icon;
            const isCurrent = profile?.role === r.role;
            return (
              <div key={r.email} style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%', marginBottom: 4 }}>
                <button
                  className={`role-option ${isCurrent ? 'current' : ''}`}
                  onClick={() => handleSwitch(r)}
                  style={{ flex: 1 }}
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
                <a
                  href={r.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="अलग टैब में खोलें (Open in New Tab)"
                  style={{
                    padding: '8px',
                    color: '#64748b',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1e3a8a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                  <ExternalLink size={14} />
                </a>
              </div>
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
