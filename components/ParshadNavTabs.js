'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, Users,
  MapPin, BarChart3, ChevronRight
} from 'lucide-react';

const TABS = [
  { href: '/parshad',            label: 'मुख्य अवलोकन',    sub: 'Overview',        icon: LayoutDashboard },
  { href: '/parshad/complaints', label: 'वार्ड शिकायतें',   sub: '32 शिकायतें',     icon: ClipboardList, badge: '32' },
  { href: '/parshad/employees',  label: 'कर्मचारी व हाजिरी', sub: '6 फील्ड कर्मी',   icon: Users,         badge: '6' },
  { href: '/parshad/areas',      label: 'वार्ड क्षेत्र व बीट', sub: 'प्रमुख चौक व क्षेत्र', icon: MapPin },
  { href: '/parshad/report',     label: 'मासिक रिपोर्ट',   sub: 'वार्ड विश्लेषण',    icon: BarChart3 },
];

export default function ParshadNavTabs() {
  const pathname = usePathname();

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '6px',
      marginBottom: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflowX: 'auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 'max-content',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href ||
            (tab.href !== '/parshad' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                color: isActive ? '#ffffff' : '#475569',
                background: isActive ? '#7c3aed' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 9999,
                }}>
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
