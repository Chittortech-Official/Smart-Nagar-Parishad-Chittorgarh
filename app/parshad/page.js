'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import GovLoadingScreen from '@/components/GovLoadingScreen';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints, fetchSharedLiveComplaints, subscribeToLiveComplaints } from '@/lib/citizenService';
import {
  FileText, Users, CheckCircle, Clock, AlertTriangle,
  MapPin, Phone, ArrowRight, ChevronRight, Image,
  UserCheck, ShieldCheck, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const INITIAL_WARD_STATS = {
  wardNumber: 24,
  wardName: 'भारत माता चौक क्षेत्र',
  total: 0,
  pending: 0,
  inProgress: 0,
  resolved: 0,
  employees: { total: 6, present: 5, absent: 1 },
};

const RECENT_COMPLAINTS = [];

const EMPLOYEES = [
  { id: 1, name: 'रमेश मीणा',   role: 'वरिष्ठ स्वच्छता कर्मी (जमादार)', phone: '98290-44121', status: 'present', punchTime: '07:30 AM' },
  { id: 2, name: 'सुनील कुमार', role: 'स्वच्छता कर्मी',                 phone: '98290-44122', status: 'present', punchTime: '07:25 AM' },
  { id: 3, name: 'गीता देवी',   role: 'स्वच्छता कर्मी',                 phone: '98290-44123', status: 'present', punchTime: '07:40 AM' },
  { id: 4, name: 'मोहन लाल',   role: 'निर्माण श्रमिक',                 phone: '98290-44124', status: 'present', punchTime: '07:35 AM' },
  { id: 5, name: 'प्रिया शर्मा',role: 'विद्युत लाइनमैन सहायक',          phone: '98290-44125', status: 'present', punchTime: '07:38 AM' },
  { id: 6, name: 'लखन सिंह',   role: 'स्वच्छता कर्मी',                 phone: '98290-44126', status: 'absent',  punchTime: '—' },
];

export default function ParshadPage() {
  const { profile } = useAuth();
  const [complaintsList, setComplaintsList] = useState([]);
  const [s, setStats] = useState(INITIAL_WARD_STATS);

  useEffect(() => {
    function formatAndSet(live) {
      const formatted = (live || []).map(c => ({
        id: c.id || c.code,
        code: c.code,
        category: c.category,
        status: c.status || 'submitted',
        location: c.location,
        date: c.date,
        citizen: c.citizenName || 'राजेश कुमार शर्मा',
        photo: !!c.hasPhoto,
        dept: c.dept,
        employee: 'आवंटन प्रक्रियाधीन',
        isNew: true,
      }));
      setComplaintsList(formatted);
      const pendingCount = formatted.filter(c => ['submitted', 'in_progress', 'assigned', 'reopened'].includes(c.status)).length;
      const resolvedCount = formatted.filter(c => ['resolved', 'closed'].includes(c.status)).length;
      setStats({
        wardNumber: 24,
        wardName: 'भारत माता चौक क्षेत्र',
        total: formatted.length,
        pending: pendingCount,
        inProgress: 0,
        resolved: resolvedCount,
        employees: { total: 6, present: 5, absent: 1 },
      });
    }

    // 1. Initial cached load
    formatAndSet(getSharedLiveComplaints(24));

    // 2. Fetch fresh live data from Supabase
    fetchSharedLiveComplaints(24).then(fresh => {
      if (fresh) formatAndSet(fresh);
    });

    // 3. Subscribe to real-time events & storage updates
    const unsubscribe = subscribeToLiveComplaints((all) => {
      const cleanW = '24';
      const filtered = (all || []).filter(c => String(c.ward || c.wardNumber || '').replace(/\D/g, '') === cleanW);
      formatAndSet(filtered);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DashboardShell requiredRole="parshad">
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <MapPin size={16} color="#7c3aed" />
              <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.85rem' }}>
                वार्ड संख्या {s.wardNumber} — {s.wardName}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड पार्षद निगरानी पोर्टल
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              पार्षद: <strong>{profile?.full_name || 'श्रीमती कुसुम (भाजपा)'}</strong> • नगर परिषद चित्तौड़गढ़
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            वार्ड 24 जनप्रतिनिधि
          </span>
        </div>
      </div>

      {/* 2. Parshad Dedicated 5-Tab Navigation Bar */}
      <ParshadNavTabs />

      {/* 3. Ward Complaint Metric Cards - Mobile Responsive Auto-Fit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 16 }}>
        <Link href="/parshad/complaints" className="card" style={{ padding: '12px 8px', textAlign: 'center', borderTop: '4px solid #1e3a8a', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{s.total}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल शिकायतें</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '12px 8px', textAlign: 'center', borderTop: '4px solid #d97706', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{s.pending}</div>
          <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>निस्तारण लंबित</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '12px 8px', textAlign: 'center', borderTop: '4px solid #7c3aed', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{s.inProgress}</div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, marginTop: 4 }}>प्रगति पर</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '12px 8px', textAlign: 'center', borderTop: '4px solid #16a34a', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{s.resolved}</div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>समाधान पूर्ण</div>
        </Link>
      </div>

      {/* 4. Recent Ward Complaints with Direct Page Links */}
      <div className="card" style={{ marginBottom: 16, padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              हालिया वार्ड शिकायतें
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              शिकायत पर क्लिक कर पूरा नागरिक विवरण, फोटो व रूटिंग स्थिति देखें
            </div>
          </div>
          <Link
            href="/parshad/complaints"
            style={{
              fontSize: '0.8rem',
              color: '#0284c7',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            समस्त {s.total} देखें <ChevronRight size={14} />
          </Link>
        </div>

        {complaintsList.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            borderRadius: 12,
            padding: '24px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🌿</div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#16a34a', marginBottom: 4 }}>
              वार्ड 24 में वर्तमान में कोई लंबित शिकायत नहीं है (All Clear)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
              नागरिक ई-सेवा पोर्टल से जैसे ही वार्ड 24 की नई समस्या दर्ज होगी, वह यहाँ रियल-टाइम में प्रदर्शित होगी।
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {complaintsList.map(c => (
              <Link
                key={c.code || c.id}
                href={`/parshad/complaints/${c.code || c.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div
                  style={{
                    border: c.isNew ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 16px',
                    background: c.isNew ? '#fffbeb' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    boxShadow: c.isNew ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.isNew ? '#f59e0b' : '#e2e8f0'; e.currentTarget.style.background = c.isNew ? '#fffbeb' : '#ffffff'; }}
                >
                  {/* Top Row: Token + Category + Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 800, background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                        {c.code}
                      </span>
                      <strong style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem' }}>
                        {c.category}
                      </strong>
                      {c.isNew && (
                        <span style={{
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}>
                          ✨ अभी-अभी दर्ज (Just Reported)
                        </span>
                      )}
                      {c.photo && (
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}>
                          📷 फोटो
                        </span>
                      )}
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Bottom Row: Location + Citizen + Date + Action */}
                  <div style={{
                    display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flexWrap: 'wrap',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 8,
                  fontSize: '0.78rem',
                  color: '#64748b'
                }}>
                  <div>
                    📍 {c.location} • नागरिक: <strong style={{ color: '#334155' }}>{c.citizen}</strong> • {c.date}
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.8rem' }}>
                    विवरण देखें <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>

      {/* 5. Ward 24 Field Staff Section with Phone Calls */}
      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              वार्ड 24 फील्ड कर्मचारी दल
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              प्रत्यक्ष फोन कॉल सुविधा एवं आज की उपस्थिति स्थिति
            </div>
          </div>
          <Link
            href="/parshad/employees"
            style={{
              fontSize: '0.8rem',
              color: '#0284c7',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            विस्तृत हाजिरी रजिस्टर <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EMPLOYEES.map(emp => (
            <div
              key={emp.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '12px 14px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              {/* Top Row: Avatar + Name/Role + Attendance Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: emp.status === 'present' ? '#dcfce7' : '#fee2e2',
                    border: `1.5px solid ${emp.status === 'present' ? '#86efac' : '#fca5a5'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: emp.status === 'present' ? '#15803d' : '#dc2626',
                    flexShrink: 0,
                  }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.2 }}>
                      {emp.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                      {emp.role}
                    </div>
                  </div>
                </div>

                <span
                  className={`badge ${emp.status === 'present' ? 'badge-present' : 'badge-absent'}`}
                  style={{ fontSize: '0.74rem', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 9999 }}
                >
                  {emp.status === 'present' ? `✓ उपस्थित (${emp.punchTime})` : '✗ अनुपस्थित'}
                </span>
              </div>

              {/* Bottom Row: Call Button + Full History Link */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 8,
                borderTop: '1px solid #f1f5f9',
                paddingTop: 8,
              }}>
                <a
                  href={`tel:${emp.phone}`}
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '7px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    borderRadius: 8,
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Phone size={12} style={{ flexShrink: 0 }} />
                  <span>{emp.phone}</span>
                </a>

                <Link
                  href="/parshad/employees"
                  className="btn btn-sm btn-outline"
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    padding: '7px 8px',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  <span>हाजिरी देखें →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
