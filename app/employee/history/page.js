'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import { Calendar, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ATTENDANCE_HISTORY = [
  { date: '01 अक्टू 2026', time: '07:45 AM', status: 'उपस्थित (Present)', ward: 'वार्ड 24', tasksCompleted: 4 },
  { date: '30 सितं 2026', time: '07:30 AM', status: 'उपस्थित (Present)', ward: 'वार्ड 24', tasksCompleted: 4 },
  { date: '29 सितं 2026', time: '07:50 AM', status: 'उपस्थित (Present)', ward: 'वार्ड 24', tasksCompleted: 3 },
  { date: '28 सितं 2026', time: '07:40 AM', status: 'उपस्थित (Present)', ward: 'वार्ड 24', tasksCompleted: 4 },
  { date: '27 सितं 2026', time: '—',        status: 'साप्ताहिक अवकाश', ward: 'वार्ड 24', tasksCompleted: 0 },
  { date: '26 सितं 2026', time: '07:35 AM', status: 'उपस्थित (Present)', ward: 'वार्ड 24', tasksCompleted: 4 },
];

export default function EmployeeHistoryPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="employee">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/employee" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस दैनिक कार्य पर
        </Link>
        <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2 }}>
          हाजिरी एवं कार्य इतिहास
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          कर्मचारी: {profile?.full_name} • वार्ड नं. 24
        </p>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ATTENDANCE_HISTORY.map((item, i) => (
            <div
              key={i}
              style={{
                background: item.status.includes('Present') ? '#ffffff' : '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                  <Calendar size={14} color="#ea580c" /> {item.date}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  पंच समय: <strong>{item.time}</strong> • कार्य पूर्ण: <strong>{item.tasksCompleted}</strong>
                </div>
              </div>
              <span className={`badge ${item.status.includes('Present') ? 'badge-present' : 'badge-submitted'}`} style={{ fontSize: '0.7rem' }}>
                {item.status.includes('Present') ? '✓ उपस्थित' : 'अवकाश'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
