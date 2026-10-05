'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSharedLiveComplaints } from '@/lib/citizenService';
import {
  LayoutDashboard, ClipboardList, Users,
  MapPin
} from 'lucide-react';

export default function ParshadNavTabs() {
  const pathname = usePathname();
  const [complaintCount, setComplaintCount] = useState(0);

  useEffect(() => {
    const live = getSharedLiveComplaints(24) || [];
    setComplaintCount(live.length);
  }, []);

  const TABS = [
    { href: '/parshad',            label: 'मुख्य अवलोकन',       sub: 'Overview',                                         icon: LayoutDashboard },
    { href: '/parshad/complaints', label: 'वार्ड शिकायतें',      sub: `${complaintCount} शिकायतें`,                       icon: ClipboardList, badge: String(complaintCount) },
    { href: '/parshad/employees',  label: 'कर्मचारी व हाजिरी',    sub: '6 फील्ड कर्मी',                                    icon: Users,         badge: '6' },
    { href: '/parshad/areas',      label: 'वार्ड क्षेत्र व बीट', sub: '5 प्रमुख बीट',                                    icon: MapPin,        badge: '5' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: 8,
      marginBottom: 16,
      width: '100%',
      boxSizing: 'border-box',
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '9px 10px',
              borderRadius: 12,
              textDecoration: 'none',
              border: isActive ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
              background: isActive ? '#7c3aed' : '#ffffff',
              color: isActive ? '#ffffff' : '#1e293b',
              boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.22)' : '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease',
              minWidth: 0,
              boxSizing: 'border-box',
              minHeight: 78,
            }}
          >
            {/* Top row: Icon and Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: isActive ? 'rgba(255,255,255,0.2)' : '#f3e8ff',
                color: isActive ? '#ffffff' : '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} />
              </div>

              {tab.badge && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#eff6ff',
                  color: isActive ? '#ffffff' : '#1d4ed8',
                  border: isActive ? 'none' : '1px solid #bfdbfe',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 9999,
                  flexShrink: 0,
                }}>
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Bottom: Title & Subtitle - 100% visible, zero truncation, words wrap cleanly */}
            <div style={{ width: '100%', minWidth: 0 }}>
              <div style={{
                fontWeight: 800,
                fontSize: '0.80rem',
                lineHeight: 1.25,
                color: isActive ? '#ffffff' : '#0f172a',
                wordBreak: 'keep-all',
              }}>
                {tab.label}
              </div>
              <div style={{
                fontSize: '0.67rem',
                color: isActive ? '#e9d5ff' : '#64748b',
                marginTop: 2,
                wordBreak: 'keep-all',
              }}>
                {tab.sub}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
