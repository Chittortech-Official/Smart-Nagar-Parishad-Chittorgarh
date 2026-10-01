'use client';

import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { FileText, Users, CheckCircle, Clock, AlertTriangle, MapPin, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

const WARD_STATS = {
  wardNumber: 24, wardName: 'भारत माता चौक क्षेत्र',
  total: 32, pending: 8, inProgress: 7, resolved: 17,
  todayComplaints: 4,
  employees: { total: 6, present: 5, absent: 1 },
  tasks: { total: 15, completed: 12, pending: 3 },
};

const RECENT_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000125', category: 'कचरा सफाई',   status: 'in_progress', location: 'बस स्टैंड के पास',      employee: 'रमेश मीणा',   isOverdue: false },
  { id: 2, code: 'CTNP-2026-000118', category: 'सड़क गड्ढा',    status: 'assigned',    location: 'मुख्य बाजार सड़क',     employee: 'सुनील कुमार',  isOverdue: false },
  { id: 3, code: 'CTNP-2026-000109', category: 'स्ट्रीट लाइट',  status: 'submitted',   location: 'कॉलोनी गली नं. 2',      employee: 'विद्युत टीम',  isOverdue: false },
  { id: 4, code: 'CTNP-2026-000098', category: 'नाली अवरुद्ध', status: 'reopened',    location: 'प्राथमिक विद्यालय पास', employee: 'रमेश मीणा',   isOverdue: true  },
];

const EMPLOYEES = [
  { id: 1, name: 'रमेश मीणा',  role: 'स्वच्छता कर्मी', status: 'present', tasksToday: 4, done: 3 },
  { id: 2, name: 'सुनील कुमार', role: 'स्वच्छता कर्मी', status: 'present', tasksToday: 3, done: 3 },
  { id: 3, name: 'गीता देवी',   role: 'स्वच्छता कर्मी', status: 'present', tasksToday: 3, done: 2 },
  { id: 4, name: 'मोहन लाल',   role: 'निर्माण श्रमिक', status: 'present', tasksToday: 2, done: 1 },
  { id: 5, name: 'प्रिया शर्मा',role: 'लाइनमैन सहायक',  status: 'present', tasksToday: 2, done: 2 },
  { id: 6, name: 'लखन सिंह',   role: 'स्वच्छता कर्मी', status: 'absent',  tasksToday: 3, done: 0 },
];

function StatCard({ label, value, color, icon: Icon, sub }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-icon" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="stat-value" style={{ fontSize: '1.6rem', color: '#0f172a' }}>{value}</div>
      <div className="stat-label" style={{ color: '#475569' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function ParshadPage() {
  const { profile } = useAuth();
  const s = WARD_STATS;

  return (
    <DashboardShell requiredRole="parshad">
      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 'var(--space-4)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <MapPin size={16} color="#7c3aed" />
              <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.8125rem' }}>
                वार्ड संख्या {s.wardNumber} — {s.wardName}
              </span>
            </div>
            <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2 }}>
              वार्ड पार्षद निगरानी पोर्टल
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              पार्षद: <strong>{profile?.full_name || 'श्रीमती कमला बाई'}</strong> • नगर परिषद चित्तौड़गढ़
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
            वार्ड पार्षद
          </span>
        </div>
      </div>

      {/* ── Complaint Stats ── */}
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
        वार्ड शिकायत विवरण (Ward Complaints)
      </div>
      <div className="stat-grid" style={{ marginBottom: 'var(--space-4)' }}>
        <StatCard label="कुल शिकायतें"   value={s.total}           color="#2563eb" icon={FileText}      sub="समस्त समय" />
        <StatCard label="निस्तारण लंबित" value={s.pending}         color="#d97706" icon={Clock}         sub="कार्यवाही हेतु" />
        <StatCard label="प्रगति पर"      value={s.inProgress}      color="#7c3aed" icon={AlertTriangle} sub="फील्ड में सक्रिय" />
        <StatCard label="समाधान पूर्ण"   value={s.resolved}        color="#16a34a" icon={CheckCircle}   sub="53% निस्तारण दर" />
      </div>

      {/* ── Employee Attendance & Tasks ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
        {/* Workers Attendance */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 10 }}>
            वार्ड कर्मचारी उपस्थिति
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{s.employees.total}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>कुल</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{s.employees.present}</div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>उपस्थित</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{s.employees.absent}</div>
              <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600 }}>अनुपस्थित</div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 10 }}>
            दैनिक सफाई कार्य प्रगति
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>कार्य पूर्ण:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
              {s.tasks.completed}/{s.tasks.total} ({Math.round((s.tasks.completed / s.tasks.total) * 100)}%)
            </span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3 }}>
            <div style={{ height: '100%', width: `${(s.tasks.completed / s.tasks.total) * 100}%`, background: '#16a34a', borderRadius: 3 }} />
          </div>
        </div>
      </div>

      {/* ── Recent Complaints ── */}
      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: '16px' }}>
        <div className="card-header" style={{ marginBottom: 10, paddingBottom: 8 }}>
          <h3 className="card-title" style={{ fontSize: '0.95rem' }}>हालिया वार्ड शिकायतें (Recent)</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>वार्ड 24</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECENT_COMPLAINTS.map(c => (
            <div key={c.id} style={{
              padding: '10px 12px',
              border: '1px solid #f1f5f9',
              borderRadius: 10,
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 700 }}>{c.code}</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{c.category}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {c.location} • कर्मचारी: {c.employee || 'आवंटन शेष'}</div>
              </div>
              <StatusBadge status={c.isOverdue ? 'overdue' : c.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Ward Employees List ── */}
      <div className="card" style={{ padding: '16px' }}>
        <div className="card-header" style={{ marginBottom: 10, paddingBottom: 8 }}>
          <h3 className="card-title" style={{ fontSize: '0.95rem' }}>वार्ड 24 के सफाई व रखरखाव कर्मचारी</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {EMPLOYEES.map(emp => (
            <div key={emp.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', background: '#f8fafc',
              borderRadius: 8, border: '1px solid #e2e8f0',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: emp.status === 'present' ? '#dcfce7' : '#fee2e2',
                border: `1.5px solid ${emp.status === 'present' ? '#86efac' : '#fca5a5'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8125rem', fontWeight: 700,
                color: emp.status === 'present' ? '#15803d' : '#dc2626',
              }}>
                {emp.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{emp.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${emp.status === 'present' ? 'badge-present' : 'badge-absent'}`} style={{ fontSize: '0.7rem' }}>
                  {emp.status === 'present' ? 'उपस्थित' : 'अनुपस्थित'}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                  {emp.done}/{emp.tasksToday} कार्य
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
