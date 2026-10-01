'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import {
  AlertCircle, CheckCircle, Clock, FileText,
  AlertTriangle, Users, X, Send, UserCheck
} from 'lucide-react';

const MOCK_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000125', category: 'Garbage', ward: 24, location: 'Near Bus Stand',      status: 'submitted',   isOverdue: false, photo: true,  citizen: 'Rajesh Kumar' },
  { id: 2, code: 'CTNP-2026-000118', category: 'Garbage', ward: 24, location: 'Main Road',           status: 'assigned',    isOverdue: false, photo: true,  citizen: 'Priya Singh' },
  { id: 3, code: 'CTNP-2026-000109', category: 'Drainage',ward: 18, location: 'Back of Market',      status: 'in_progress', isOverdue: true,  photo: false, citizen: 'Mohan Das' },
  { id: 4, code: 'CTNP-2026-000098', category: 'Garbage', ward: 24, location: 'Near School',         status: 'reopened',    isOverdue: true,  photo: true,  citizen: 'Sunita Devi' },
  { id: 5, code: 'CTNP-2026-000087', category: 'Garbage', ward: 12, location: 'Station Road',        status: 'resolved',    isOverdue: false, photo: false, citizen: 'Ramesh Patel' },
];

const EMPLOYEES = [
  { id: 1, name: 'Ramesh Meena',  ward: 24, status: 'present', tasksToday: 4 },
  { id: 2, name: 'Sunil Kumar',   ward: 24, status: 'present', tasksToday: 3 },
  { id: 3, name: 'Geeta Devi',    ward: 18, status: 'present', tasksToday: 2 },
  { id: 4, name: 'Lakhan Singh',  ward: 12, status: 'absent',  tasksToday: 0 },
];

const STATS = { new: 2, assigned: 1, inProgress: 1, resolved: 1, overdue: 2 };

export default function OfficerPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);

  function assignComplaint() {
    if (!selectedEmployee) return;
    const emp = EMPLOYEES.find(e => e.id === parseInt(selectedEmployee));
    setComplaints(prev =>
      prev.map(c =>
        c.id === assignModal.id
          ? { ...c, status: 'assigned', assignedTo: emp.name }
          : c
      )
    );
    setAssignModal(null);
    setSelectedEmployee('');
  }

  function updateStatus(id, status) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  return (
    <DashboardShell requiredRole="officer">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>Sanitation Department</h1>
            <p>Manage incoming complaints and field employees</p>
          </div>
          <span className="badge badge-officer" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            {profile?.full_name}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'New Complaints', val: STATS.new,        color: '#3b82f6', Icon: FileText },
          { label: 'Assigned',       val: STATS.assigned,   color: '#8b5cf6', Icon: UserCheck },
          { label: 'In Progress',    val: STATS.inProgress, color: '#f59e0b', Icon: Clock },
          { label: 'Resolved',       val: STATS.resolved,   color: '#10b981', Icon: CheckCircle },
          { label: 'OVERDUE ⚠️',    val: STATS.overdue,    color: '#ef4444', Icon: AlertTriangle },
        ].map(({ label, val, color, Icon }) => (
          <div key={label} className="stat-card" style={{ borderTop: `2px solid ${color}` }}>
            <div className="stat-icon" style={{ background: `${color}1a` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.75rem' }}>{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[['complaints','Complaints'], ['employees','Employees & Tasks']].map(([key, label]) => (
          <button key={key} className={`tab-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div>
          {/* Overdue Alert Banner */}
          {complaints.some(c => c.isOverdue) && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
              <AlertTriangle size={18} />
              <div>
                <strong>{complaints.filter(c => c.isOverdue).length} complaint(s) are OVERDUE</strong>
                <div style={{ fontSize: '0.8125rem', marginTop: 2 }}>These have exceeded SLA — the Chairman has been notified.</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {complaints.map(c => (
              <div
                key={c.id}
                className="card"
                style={{
                  borderColor: c.isOverdue ? 'rgba(239,68,68,0.35)' : c.status === 'reopened' ? 'rgba(239,68,68,0.35)' : undefined,
                  background: c.isOverdue || c.status === 'reopened' ? 'rgba(239,68,68,0.03)' : undefined,
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <span className="complaint-code">{c.code}</span>
                      {c.isOverdue && <span className="badge badge-overdue">OVERDUE</span>}
                    </div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>{c.category}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: 2 }}>
                      Ward {c.ward} · {c.location} · by {c.citizen}
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Photo badge */}
                {c.photo && (
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-400)', background: 'rgba(59,130,246,0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(59,130,246,0.3)' }}>
                      📷 Photo Available
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {(c.status === 'submitted' || c.status === 'reopened') && (
                    <button
                      id={`assign-btn-${c.id}`}
                      className="btn btn-accent"
                      style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                      onClick={() => setAssignModal(c)}
                    >
                      <Users size={14} /> Assign Employee
                    </button>
                  )}
                  {c.status === 'assigned' && (
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                      onClick={() => updateStatus(c.id, 'in_progress')}
                    >
                      Mark In Progress
                    </button>
                  )}
                  {c.status === 'in_progress' && (
                    <button
                      className="btn btn-success"
                      style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                      onClick={() => updateStatus(c.id, 'resolved')}
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </button>
                  )}
                  {c.status === 'resolved' && (
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                      onClick={() => updateStatus(c.id, 'closed')}
                    >
                      Close Complaint
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPLOYEES TAB */}
      {activeTab === 'employees' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {EMPLOYEES.map(emp => (
              <div key={emp.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: emp.status === 'present' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    border: `2px solid ${emp.status === 'present' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: emp.status === 'present' ? 'var(--success-500)' : 'var(--danger-500)',
                  }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>Ward {emp.ward}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={emp.status} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>
                      {emp.tasksToday} tasks today
                    </div>
                  </div>
                </div>

                {emp.status === 'present' && (
                  <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, fontSize: '0.8125rem' }}>
                      View Tasks
                    </button>
                    <button className="btn btn-accent" style={{ flex: 1, fontSize: '0.8125rem' }}>
                      <Send size={14} /> Assign Task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Assign Employee</h3>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{assignModal.code} — {assignModal.category} — Ward {assignModal.ward}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setAssignModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Select Field Employee</label>
              <select
                id="assign-employee-select"
                className="form-select"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="">— Choose Employee —</option>
                {EMPLOYEES.filter(e => e.status === 'present').map(e => (
                  <option key={e.id} value={e.id}>{e.name} — Ward {e.ward}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAssignModal(null)}>Cancel</button>
              <button
                id="confirm-assign-btn"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={!selectedEmployee}
                onClick={assignComplaint}
              >
                <UserCheck size={16} /> Assign & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
