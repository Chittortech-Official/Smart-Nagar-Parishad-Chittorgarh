'use client';

import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';

const OFFICER_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000125', category: 'कचरा डिपो सफाई', ward: 'वार्ड 24', status: 'in_progress', employee: 'रमेश मीणा', date: '01 अक्टू 2026', sla: '24 घंटे' },
  { id: 2, code: 'CTNP-2026-000119', category: 'नाली ओवरफ्लो', ward: 'वार्ड 18', status: 'assigned', employee: 'सुनील कुमार', date: '01 अक्टू 2026', sla: '48 घंटे' },
  { id: 3, code: 'CTNP-2026-000104', category: 'सड़क मृत पशु उठाव', ward: 'वार्ड 8', status: 'submitted', employee: 'आवंटन शेष', date: '01 अक्टू 2026', sla: '12 घंटे' },
  { id: 4, code: 'CTNP-2026-000088', category: 'कचरा पात्र स्थापना', ward: 'वार्ड 32', status: 'resolved', employee: 'गीता देवी', date: '30 सितं 2026', sla: '72 घंटे' },
  { id: 5, code: 'CTNP-2026-000072', category: 'बाजार रात्रि सफाई', ward: 'वार्ड 15', status: 'closed', employee: 'रमेश मीणा', date: '29 सितं 2026', sla: '24 घंटे' },
];

export default function OfficerComplaintsPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="officer">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/officer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस विभागीय मुख्य पृष्ठ पर
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2 }}>
              विभागीय शिकायत प्रबंधन — स्वास्थ्य एवं स्वच्छता
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              अधिकारी: {profile?.full_name || 'सुरेश शर्मा'} • कुल 98 शिकायतें
            </p>
          </div>
          <span className="badge badge-officer">स्वास्थ्य एवं स्वच्छता विभाग</span>
        </div>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OFFICER_COMPLAINTS.map(c => (
            <div key={c.id} style={{
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <span className="complaint-code">{c.code}</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{c.category}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  {c.ward} • SLA सीमा: {c.sla} • दिनांक: {c.date}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: 2 }}>
                  आवंटित सफाईकर्मी: {c.employee}
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
