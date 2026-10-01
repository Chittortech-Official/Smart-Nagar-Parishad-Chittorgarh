'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, Building2, Tag, Users, Settings,
  Plus, Edit3, Trash2, Check, X, Clock,
  ToggleLeft, ToggleRight, Shield
} from 'lucide-react';

// Mock state for admin configuration
const INITIAL_DEPTS = [
  { id: 1, name: 'Sanitation',    color: '#10b981', officer: 'Suresh Sharma',    categories: 3, employees: 42 },
  { id: 2, name: 'Engineering',   color: '#3b82f6', officer: 'Vikram Patel',     categories: 2, employees: 28 },
  { id: 3, name: 'Water Supply',  color: '#06b6d4', officer: 'Anita Meena',      categories: 2, employees: 19 },
  { id: 4, name: 'Electrical',    color: '#f59e0b', officer: 'Ramesh Gupta',     categories: 2, employees: 15 },
  { id: 5, name: 'Parks & Garden',color: '#84cc16', officer: 'Kavita Singh',     categories: 1, employees: 8 },
  { id: 6, name: 'Animal Control',color: '#8b5cf6', officer: 'Dr. Mohan Joshi',  categories: 1, employees: 6 },
];

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Garbage / Cleanliness', dept: 'Sanitation',    sla: 24,  active: true },
  { id: 2, name: 'Drainage / Sewerage',   dept: 'Sanitation',    sla: 48,  active: true },
  { id: 3, name: 'Road / Pothole',        dept: 'Engineering',   sla: 72,  active: true },
  { id: 4, name: 'Public Infrastructure', dept: 'Engineering',   sla: 72,  active: true },
  { id: 5, name: 'Water Supply',          dept: 'Water Supply',  sla: 24,  active: true },
  { id: 6, name: 'Water Leakage',         dept: 'Water Supply',  sla: 24,  active: true },
  { id: 7, name: 'Street Light',          dept: 'Electrical',    sla: 48,  active: true },
  { id: 8, name: 'Electrical Issue',      dept: 'Electrical',    sla: 48,  active: true },
  { id: 9, name: 'Public Park',           dept: 'Parks & Garden',sla: 96,  active: true },
  { id: 10,name: 'Stray Animals',         dept: 'Animal Control',sla: 48,  active: true },
  { id: 11,name: 'Other',                 dept: 'Sanitation',    sla: 72,  active: true },
];

const PLATFORM_STATS = { totalUsers: 384, citizens: 300, employees: 48, parshads: 18, officers: 12, chairmen: 1, admins: 5 };

export default function AdminPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [editSla, setEditSla] = useState(null);
  const [slaValue, setSlaValue] = useState('');

  function toggleCategory(id) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  function startEditSla(cat) {
    setEditSla(cat.id);
    setSlaValue(cat.sla.toString());
  }

  function saveSla(id) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, sla: parseInt(slaValue) || c.sla } : c));
    setEditSla(null);
  }

  return (
    <DashboardShell requiredRole="super_admin">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1><Shield size={28} style={{ display: 'inline', marginRight: 10, color: 'var(--danger-500)' }} />Super Admin</h1>
            <p>Platform configuration and system management</p>
          </div>
          <span className="badge badge-super_admin" style={{ fontSize: '0.875rem', padding: '8px 18px' }}>
            {profile?.full_name}
          </span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Users',  val: PLATFORM_STATS.totalUsers,  color: '#3b82f6' },
          { label: 'Citizens',     val: PLATFORM_STATS.citizens,     color: '#06b6d4' },
          { label: 'Employees',    val: PLATFORM_STATS.employees,    color: '#10b981' },
          { label: 'Councillors',  val: PLATFORM_STATS.parshads,     color: '#8b5cf6' },
          { label: 'Officers',     val: PLATFORM_STATS.officers,     color: '#f59e0b' },
        ].map(({ label, val, color }) => (
          <div key={label} className="stat-card" style={{ borderTop: `2px solid ${color}` }}>
            <div className="stat-value" style={{ fontSize: '1.75rem', color }}>{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          ['overview', 'Overview'],
          ['departments', 'Departments'],
          ['categories', 'Categories & SLA'],
          ['users', 'Users'],
        ].map(([key, label]) => (
          <button key={key} className={`tab-item ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Quick Links */}
          {[
            { icon: MapPin,    label: 'Manage Wards',          sub: '60 wards configured',      color: '#10b981', tab: 'departments' },
            { icon: Building2, label: 'Manage Departments',    sub: '6 active departments',      color: '#3b82f6', tab: 'departments' },
            { icon: Tag,       label: 'Categories & SLA',      sub: '11 complaint categories',  color: '#f59e0b', tab: 'categories'  },
            { icon: Users,     label: 'User Management',       sub: '384 registered users',     color: '#8b5cf6', tab: 'users'       },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="card"
                style={{ cursor: 'pointer', borderColor: `${card.color}22` }}
                onClick={() => setActiveTab(card.tab)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ width: 50, height: 50, background: `${card.color}1a`, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} style={{ color: card.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{card.label}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{card.sub}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DEPARTMENTS TAB ── */}
      {activeTab === 'departments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
            <button id="add-department-btn" className="btn btn-primary">
              <Plus size={16} /> Add Department
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {INITIAL_DEPTS.map(dept => (
              <div key={dept.id} className="card" style={{ borderLeft: `4px solid ${dept.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ width: 44, height: 44, background: `${dept.color}1a`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} style={{ color: dept.color }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.0625rem' }}>{dept.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                        Officer: <span style={{ color: 'var(--accent-400)' }}>{dept.officer}</span>
                        {' · '}{dept.categories} categories · {dept.employees} employees
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-icon" title="Edit"><Edit3 size={15} /></button>
                    <button className="btn btn-ghost btn-icon" title="Delete" style={{ color: 'var(--danger-500)' }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORIES & SLA TAB ── */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <p>Configure complaint categories, department mapping, and SLA deadlines.</p>
            <button id="add-category-btn" className="btn btn-primary">
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Department</th>
                    <th>SLA (Hours)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{cat.name}</td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--accent-400)' }}>{cat.dept}</span>
                      </td>
                      <td>
                        {editSla === cat.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              id={`sla-input-${cat.id}`}
                              type="number"
                              value={slaValue}
                              onChange={e => setSlaValue(e.target.value)}
                              style={{
                                width: 70, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--primary-500)', borderRadius: 'var(--radius-sm)',
                                padding: '4px 8px', color: '#f1f5f9', fontFamily: 'var(--font-body)',
                              }}
                            />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>hrs</span>
                            <button className="btn btn-icon" style={{ width: 28, height: 28, background: 'rgba(34,197,94,0.15)' }} onClick={() => saveSla(cat.id)}>
                              <Check size={13} style={{ color: 'var(--primary-500)' }} />
                            </button>
                            <button className="btn btn-icon" style={{ width: 28, height: 28 }} onClick={() => setEditSla(null)}>
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={13} style={{ color: 'var(--warning-500)' }} />
                            <span style={{ fontWeight: 600 }}>{cat.sla}h</span>
                            <button
                              id={`edit-sla-${cat.id}`}
                              className="btn btn-icon"
                              style={{ width: 24, height: 24, opacity: 0.5 }}
                              onClick={() => startEditSla(cat)}
                            >
                              <Edit3 size={11} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          id={`toggle-category-${cat.id}`}
                          onClick={() => toggleCategory(cat.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          {cat.active
                            ? <><ToggleRight size={22} style={{ color: 'var(--primary-500)' }} /><span style={{ fontSize: '0.8125rem', color: 'var(--primary-400)' }}>Active</span></>
                            : <><ToggleLeft size={22} style={{ color: 'var(--gray-500)' }} /><span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Inactive</span></>
                          }
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }}><Edit3 size={13} /></button>
                          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--danger-500)' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
            <button id="add-user-btn" className="btn btn-primary">
              <Plus size={16} /> Add User
            </button>
          </div>

          {/* Role Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            {[
              ['Citizens',     PLATFORM_STATS.citizens,    'citizen',     '#06b6d4'],
              ['Employees',    PLATFORM_STATS.employees,   'employee',    '#10b981'],
              ['Councillors',  PLATFORM_STATS.parshads,    'parshad',     '#8b5cf6'],
              ['Officers',     PLATFORM_STATS.officers,    'officer',     '#3b82f6'],
              ['Chairman',     PLATFORM_STATS.chairmen,    'chairman',    '#f59e0b'],
              ['Admins',       PLATFORM_STATS.admins,      'super_admin', '#ef4444'],
            ].map(([label, count, role, color]) => (
              <div key={label} className="card" style={{ textAlign: 'center', borderTop: `2px solid ${color}` }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color, fontFamily: 'var(--font-heading)' }}>{count}</div>
                <span className={`badge badge-${role}`} style={{ marginTop: 4 }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="alert alert-info">
            <Settings size={16} />
            <div>
              <strong>User Management Note</strong>
              <div style={{ fontSize: '0.8125rem', marginTop: 2 }}>
                Connect to Supabase to manage real users. Set up demo users by running the SQL schema and creating auth accounts via Supabase Dashboard → Authentication → Users.
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
