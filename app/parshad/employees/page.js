'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import { Users, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const EMPLOYEES = [
  { id: 1, name: 'रमेश मीणा',   role: 'वरिष्ठ स्वच्छता कर्मी', phone: '98290-XXXX1', status: 'present', tasksToday: 4, done: 3 },
  { id: 2, name: 'सुनील कुमार', role: 'स्वच्छता कर्मी',       phone: '98290-XXXX2', status: 'present', tasksToday: 3, done: 3 },
  { id: 3, name: 'गीता देवी',   role: 'स्वच्छता कर्मी',       phone: '98290-XXXX3', status: 'present', tasksToday: 3, done: 2 },
  { id: 4, name: 'मोहन लाल',   role: 'निर्माण श्रमिक',       phone: '98290-XXXX4', status: 'present', tasksToday: 2, done: 1 },
  { id: 5, name: 'प्रिया शर्मा',role: 'विद्युत सहायक',        phone: '98290-XXXX5', status: 'present', tasksToday: 2, done: 2 },
  { id: 6, name: 'लखन सिंह',   role: 'स्वच्छता कर्मी',       phone: '98290-XXXX6', status: 'absent',  tasksToday: 3, done: 0 },
];

export default function ParshadEmployeesPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="parshad">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/parshad" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस वार्ड ओवरव्यू
        </Link>
        <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2 }}>
          वार्ड 24 — फील्ड कर्मचारी दल
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          पार्षद: {profile?.full_name} • कुल 6 फील्ड कर्मचारी
        </p>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EMPLOYEES.map(emp => (
            <div key={emp.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: '#ffffff',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: emp.status === 'present' ? '#dcfce7' : '#fee2e2',
                  border: `1.5px solid ${emp.status === 'present' ? '#86efac' : '#fca5a5'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700,
                  color: emp.status === 'present' ? '#15803d' : '#dc2626',
                }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.role} • 📞 {emp.phone}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${emp.status === 'present' ? 'badge-present' : 'badge-absent'}`} style={{ fontSize: '0.7rem' }}>
                  {emp.status === 'present' ? 'उपस्थित' : 'अनुपस्थित'}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, marginTop: 3 }}>
                  {emp.done}/{emp.tasksToday} कार्य पूर्ण
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
