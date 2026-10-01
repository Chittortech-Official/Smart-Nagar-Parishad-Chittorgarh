'use client';

import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { MapPin, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

const WARD_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000125', category: 'कचरा सफाई',   status: 'in_progress', location: 'बस स्टैंड के पास',      employee: 'रमेश मीणा',   date: '01 अक्टू 2026' },
  { id: 2, code: 'CTNP-2026-000118', category: 'सड़क गड्ढा',    status: 'assigned',    location: 'मुख्य बाजार सड़क',     employee: 'सुनील कुमार',  date: '30 सितं 2026' },
  { id: 3, code: 'CTNP-2026-000109', category: 'स्ट्रीट लाइट',  status: 'submitted',   location: 'कॉलोनी गली नं. 2',      employee: 'विद्युत टीम',  date: '29 सितं 2026' },
  { id: 4, code: 'CTNP-2026-000098', category: 'नाली अवरुद्ध', status: 'reopened',    location: 'प्राथमिक विद्यालय पास', employee: 'रमेश मीणा',   date: '28 सितं 2026' },
  { id: 5, code: 'CTNP-2026-000085', category: 'पेयजल लीकेज',   status: 'resolved',    location: 'चौराहा प्याऊ के पास',  employee: 'जल प्रदाय',    date: '25 सितं 2026' },
  { id: 6, code: 'CTNP-2026-000072', category: 'सफाई व्यवस्था', status: 'closed',      location: 'सब्जी मंडी चौक',       employee: 'गीता देवी',    date: '20 सितं 2026' },
];

export default function ParshadComplaintsPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="parshad">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/parshad" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस वार्ड ओवरव्यू
        </Link>
        <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2 }}>
          वार्ड 24 — समस्त नागरिक शिकायतें
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          पार्षद: {profile?.full_name} • कुल 32 शिकायतें (6 हालिया प्रदर्शित)
        </p>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WARD_COMPLAINTS.map(c => (
            <div key={c.id} style={{
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 700 }}>{c.code}</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{c.category}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  📍 {c.location} • {c.date}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: 2 }}>
                  आवंटित कर्मचारी: {c.employee}
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
