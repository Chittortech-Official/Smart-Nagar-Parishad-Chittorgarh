'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import {
  FileText, AlertTriangle, CheckCircle, Clock,
  Users, MapPin, Building2, RotateCcw, ChevronRight,
  UserCheck, UserX, BarChart3, Map, ShieldAlert,
  ArrowRight, CheckSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CITY_STATS = {
  total: 247, open: 48, inProgress: 63, resolved: 124, overdue: 12,
  employees: { total: 312, present: 281, absent: 31 },
  tasks: { total: 520, completed: 441, pending: 79 },
};

const DEPT_DATA = [
  { name: 'स्वास्थ्य एवं स्वच्छता', complaints: 98,  resolved: 72, color: '#16a34a' },
  { name: 'निर्माण / इंजीनियरिंग', complaints: 64,  resolved: 38, color: '#2563eb' },
  { name: 'जल प्रदाय अनुभाग',     complaints: 42,  resolved: 28, color: '#0284c7' },
  { name: 'विद्युत अनुभाग',        complaints: 28,  resolved: 21, color: '#d97706' },
  { name: 'उद्यान विकास',         complaints: 15,  resolved: 9,  color: '#65a30d' },
];

const CATEGORY_PIE = [
  { name: 'कचरा सफाई',   value: 38, color: '#16a34a' },
  { name: 'सड़क मरम्मत',  value: 24, color: '#2563eb' },
  { name: 'पेयजल लीकेज', value: 17, color: '#0284c7' },
  { name: 'स्ट्रीट लाइट', value: 11, color: '#d97706' },
  { name: 'अन्य समस्याएं', value: 10, color: '#64748b' },
];

const WARDS_SAMPLE = Array.from({ length: 60 }, (_, i) => {
  const baseTotal = ((i * 7 + 11) % 13) + 4;
  const baseResolved = Math.min(baseTotal - 1, Math.max(1, ((i * 5 + 3) % 9) + 2));
  const empTotal = ((i * 3 + 2) % 4) + 4;
  const empPresent = Math.max(empTotal - 1, empTotal - (i % 5 === 0 ? 1 : 0));
  return {
    num: i + 1,
    name: `वार्ड संख्या ${i + 1}`,
    total: baseTotal,
    resolved: baseResolved,
    employees: empTotal,
    present: empPresent,
    overdue: (i === 7 || i === 14 || i === 31 || i === 44) ? 1 : 0,
  };
});

const OVERDUE_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000072', category: 'कचरा डिपो उठाव', ward: 8,  dept: 'स्वास्थ्य एवं स्वच्छता', hoursOverdue: 36, officer: 'सुरेश शर्मा' },
  { id: 2, code: 'CTNP-2026-000061', category: 'मुख्य सड़क गड्ढा', ward: 15, dept: 'निर्माण / इंजीनियरिंग', hoursOverdue: 48, officer: 'इंजीनियर मोहन' },
  { id: 3, code: 'CTNP-2026-000054', category: 'पेयजल पाइपलाइन लीकेज', ward: 32, dept: 'जल प्रदाय शाखा', hoursOverdue: 12, officer: 'कनिष्ठ अभियंता जल' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', fontSize: '0.8125rem', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: 4 }}>{label}</div>
        {payload.map(p => <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function ChairmanPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWard, setSelectedWard] = useState(null);
  const s = CITY_STATS;

  return (
    <DashboardShell requiredRole="chairman">
      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '18px 22px',
        marginBottom: 'var(--space-4)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              सर्वोच्च प्रशासनिक एवं नीतिगत नियंत्रण कक्ष
            </div>
            <h1 style={{ fontSize: '1.45rem', color: '#1e3a8a', marginTop: 2, marginBottom: 2 }}>
              🏛️ चित्तौड़गढ़ नगर परिषद — सभापति डैशबोर्ड
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              समग्र शहर निगरानी • सभापति: <strong>{profile?.full_name || 'श्री प्रेम सिंह जी'}</strong> • समस्त 60 वार्ड
            </p>
          </div>
          <span className="badge badge-chairman" style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>
            सभापति / चेयरमैन
          </span>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {s.overdue > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)', padding: '12px 16px' }}>
          <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.875rem' }}>
              ⚠️ {s.overdue} नागरिक शिकायतें तय समय सीमा (SLA) से अधिक लंबित हैं!
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: 2 }}>
              संबंधित विभागीय अधिकारियों को तत्काल निस्तारण हेतु कारण बताओ चेतावनी प्रेषित की गई है।
            </div>
          </div>
          <button
            onClick={() => setActiveTab('overdue')}
            style={{
              background: '#ffffff',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            विवरण देखें →
          </button>
        </div>
      )}

      {/* Citywide Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
        {[
          { label: 'कुल शिकायतें', val: s.total,        color: '#2563eb', Icon: FileText,   badge: 'समस्त' },
          { label: 'लंबित शिकायतें', val: s.open,        color: '#d97706', Icon: Clock,      badge: 'नियमित' },
          { label: 'प्रगति पर',    val: s.inProgress,    color: '#7c3aed', Icon: AlertTriangle, badge: 'फील्ड में' },
          { label: 'निस्तारित',    val: s.resolved,      color: '#16a34a', Icon: CheckCircle, badge: '50.2%' },
          { label: 'अवधि पार',     val: s.overdue,       color: '#dc2626', Icon: AlertTriangle, badge: 'तत्काल' },
          { label: 'कुल कर्मचारी',  val: s.employees.total, color: '#0284c7', Icon: Users,     badge: '60 वार्ड' },
          { label: 'आज उपस्थित',   val: s.employees.present, color: '#16a34a', Icon: UserCheck, badge: '90.1%' },
          { label: 'आज अनुपस्थित', val: s.employees.absent,  color: '#dc2626', Icon: UserX,     badge: 'छुट्टी/बिना सूचना' },
        ].map((item) => {
          const Icon = item.Icon;
          return (
            <div key={item.label} className="card" style={{ padding: '12px', borderTop: `3px solid ${item.color}`, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={item.color} />
                </div>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{item.val}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={15} />
          <span>सिस्टम ओवरव्यू एवं चार्ट्स</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'wards' ? 'active' : ''}`}
          onClick={() => setActiveTab('wards')}
        >
          <MapPin size={15} />
          <span>समस्त 60 वार्ड स्थिति</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          <Building2 size={15} />
          <span>नगरपालिका विभाग कार्यप्रणाली</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          <AlertTriangle size={15} color="#dc2626" />
          <span>अवधि पार शिकायतें ({s.overdue})</span>
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW & CHARTS ── */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
            {/* Department Bar Chart */}
            <div className="card" style={{ padding: '16px' }}>
              <div className="card-header" style={{ marginBottom: 12, paddingBottom: 8 }}>
                <h3 className="card-title" style={{ fontSize: '0.95rem' }}>विभागवार शिकायत एवं समाधान स्थिति</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DEPT_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="complaints" fill="#2563eb" radius={[4,4,0,0]} name="कुल प्राप्त" />
                  <Bar dataKey="resolved"   fill="#16a34a" radius={[4,4,0,0]} name="निस्तारित" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie Chart */}
            <div className="card" style={{ padding: '16px' }}>
              <div className="card-header" style={{ marginBottom: 12, paddingBottom: 8 }}>
                <h3 className="card-title" style={{ fontSize: '0.95rem' }}>समस्या श्रेणीवार विभाजन</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={CATEGORY_PIE} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                    {CATEGORY_PIE.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {CATEGORY_PIE.map(c => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#475569' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    {c.name} ({c.value}%)
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Citywide Progress Bar */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 className="card-title" style={{ fontSize: '0.95rem', margin: 0 }}>
                समग्र शहर में आज के स्वच्छता एवं मरम्मत कार्य की प्रगति
              </h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>
                {Math.round((s.tasks.completed / s.tasks.total) * 100)}% पूर्ण
              </span>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>{s.tasks.total}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>कुल आवंटित कार्य</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{s.tasks.completed}</div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>सफलतापूर्वक पूर्ण</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{s.tasks.pending}</div>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>प्रगति पर / शेष</div>
              </div>
            </div>

            <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${(s.tasks.completed / s.tasks.total) * 100}%`, background: '#16a34a', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: WARDS TAB ── */}
      {activeTab === 'wards' && (
        <div>
          {selectedWard ? (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <button className="btn btn-ghost" onClick={() => setSelectedWard(null)}>← वापस सूची पर</button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e3a8a' }}>
                  {selectedWard.name} — विस्तृत रिपोर्ट
                </h2>
                {selectedWard.overdue > 0 && (
                  <span className="badge badge-overdue">⚠️ 1 अवधि पार शिकायत</span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {[
                  ['कुल शिकायतें', selectedWard.total, '#2563eb'],
                  ['समाधान पूर्ण', selectedWard.resolved, '#16a34a'],
                  ['लंबित कार्य', selectedWard.total - selectedWard.resolved, '#d97706'],
                  ['स्वीकृत सफाईकर्मी', selectedWard.employees, '#7c3aed'],
                  ['आज उपस्थित', selectedWard.present, '#16a34a'],
                  ['आज अनुपस्थित', selectedWard.employees - selectedWard.present, '#dc2626'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: 12, color: '#64748b', fontSize: '0.85rem' }}>
                चित्तौड़गढ़ नगर परिषद के किसी भी वार्ड पर क्लिक करके उसकी लाइव स्थिति देखें:
              </p>
              <div className="ward-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                {WARDS_SAMPLE.map(w => (
                  <div
                    key={w.num}
                    id={`ward-${w.num}`}
                    onClick={() => setSelectedWard(w)}
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${w.overdue > 0 ? '#fca5a5' : '#e2e8f0'}`,
                      borderRadius: 10,
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: w.overdue > 0 ? '#dc2626' : '#1e3a8a' }}>
                      {w.num}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>वार्ड {w.num}</div>
                    <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 600, marginTop: 2 }}>
                      {w.resolved}/{w.total} हल
                    </div>
                    {w.overdue > 0 && (
                      <div style={{ fontSize: '0.6rem', color: '#dc2626', fontWeight: 700, marginTop: 2 }}>
                        ⚠️ अवधि पार
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: DEPARTMENTS TAB ── */}
      {activeTab === 'departments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEPT_DATA.map(dept => {
            const rate = Math.round((dept.resolved / dept.complaints) * 100);
            return (
              <div key={dept.name} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: `${dept.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} color={dept.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.95rem' }}>{dept.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        कुल शिकायतें: <strong>{dept.complaints}</strong> • निस्तारित: <strong>{dept.resolved}</strong> • शेष: <strong>{dept.complaints - dept.resolved}</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: dept.color }}>{rate}%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>निस्तारण दर</div>
                  </div>
                </div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${rate}%`, background: dept.color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 4: OVERDUE TAB ── */}
      {activeTab === 'overdue' && (
        <div>
          <div className="alert alert-error" style={{ marginBottom: 12 }}>
            <AlertTriangle size={18} />
            ये शिकायतें अपनी तय समय सीमा (SLA) पार कर चुकी हैं। सभापति कार्यालय से तत्काल कार्यवाही निर्देशित है।
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OVERDUE_COMPLAINTS.map(c => (
              <div key={c.id} className="card" style={{ border: '1.5px solid #fca5a5', background: '#fff5f5', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span className="complaint-code">{c.code}</span>
                    <div style={{ fontWeight: 700, color: '#991b1b', marginTop: 2, fontSize: '0.95rem' }}>{c.category}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      वार्ड संख्या {c.ward} • विभाग: {c.dept} • जिम्मेदार अधिकारी: <strong>{c.officer}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-overdue">अवधि पार (+{c.hoursOverdue} घंटे)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
