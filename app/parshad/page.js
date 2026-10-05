'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints } from '@/lib/citizenService';
import {
  FileText, Users, CheckCircle, Clock, AlertTriangle,
  MapPin, Phone, ArrowRight, ChevronRight, Image,
  UserCheck, ShieldCheck, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const WARD_STATS = {
  wardNumber: 24,
  wardName: 'भारत माता चौक क्षेत्र',
  total: 32,
  pending: 8,
  inProgress: 7,
  resolved: 17,
  employees: { total: 6, present: 5, absent: 1 },
};

const RECENT_COMPLAINTS = [
  {
    id: 1,
    code: 'CTNP-2026-000125',
    category: 'कचरा सफाई (Garbage Clearance)',
    status: 'in_progress',
    location: 'बस स्टैंड के पास, वार्ड 24',
    date: '01 अक्टू 2026',
    citizen: 'राजेश कुमार',
    photo: true,
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा',
  },
  {
    id: 2,
    code: 'CTNP-2026-000118',
    category: 'सड़क गड्ढा मरम्मत (Road Pothole)',
    status: 'assigned',
    location: 'मुख्य बाजार सड़क, निकट क्लॉक टावर',
    date: '30 सितं 2026',
    citizen: 'महेश सोनी',
    photo: true,
    dept: 'निर्माण एवं इंजीनियरिंग शाखा',
    employee: 'सुनील कुमार',
  },
  {
    id: 3,
    code: 'CTNP-2026-000109',
    category: 'स्ट्रीट लाइट बंद (Street Light)',
    status: 'submitted',
    location: 'न्यू कॉलोनी, गली नं. 2',
    date: '29 सितं 2026',
    citizen: 'सुनीता देवी',
    photo: false,
    dept: 'विद्युत अनुभाग',
    employee: 'विद्युत टीम',
  },
  {
    id: 4,
    code: 'CTNP-2026-000098',
    category: 'नाली अवरुद्ध / जलभराव (Drainage)',
    status: 'reopened',
    location: 'प्राथमिक विद्यालय पास',
    date: '28 सितं 2026',
    citizen: 'दिनेश कुमावत',
    photo: true,
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा',
  },
];

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
  const [complaintsList, setComplaintsList] = useState(RECENT_COMPLAINTS);
  const [s, setStats] = useState(WARD_STATS);

  useEffect(() => {
    const live = getSharedLiveComplaints(24);
    if (live && live.length > 0) {
      const formatted = live.map(c => ({
        id: c.id || c.code,
        code: c.code,
        category: c.category,
        status: c.status || 'submitted',
        location: c.location,
        date: c.date,
        citizen: c.citizenName || 'नागरिक',
        photo: !!c.hasPhoto,
        dept: c.dept,
        employee: 'आवंटन प्रक्रियाधीन',
        isNew: true,
      }));
      const existingCodes = new Set(RECENT_COMPLAINTS.map(c => c.code));
      const newItems = formatted.filter(item => !existingCodes.has(item.code));
      if (newItems.length > 0) {
        setComplaintsList([...newItems, ...RECENT_COMPLAINTS]);
        setStats(prev => ({
          ...prev,
          total: prev.total + newItems.length,
          pending: prev.pending + newItems.length,
        }));
      }
    }
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
        <Link href="/parshad/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #1e3a8a', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{s.total}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल शिकायतें</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #d97706', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{s.pending}</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>निस्तारण लंबित</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #7c3aed', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{s.inProgress}</div>
          <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700, marginTop: 4 }}>प्रगति पर</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #16a34a', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{s.resolved}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>समाधान पूर्ण</div>
        </Link>
      </div>

      {/* 4. Recent Ward Complaints with Direct Page Links */}
      <div className="card" style={{ marginBottom: 16, padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              हालिया वार्ड शिकायतें (क्लिक करने पर अलग पेज खुलेगा)
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              शिकायत पर क्लिक कर पूरा नागरिक विवरण, फोटो व रूटिंग स्थिति देखें
            </div>
          </div>
          <Link
            href="/parshad/complaints"
            style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            समस्त 32 देखें <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {complaintsList.map(c => (
            <Link
              key={c.id}
              href={`/parshad/complaints/${c.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '14px 16px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
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
      </div>

      {/* 5. Ward 24 Field Staff Section with Phone Calls */}
      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              वार्ड 24 फील्ड कर्मचारी दल
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              प्रत्यक्ष फोन कॉल सुविधा एवं आज की उपस्थिति स्थिति
            </div>
          </div>
          <Link
            href="/parshad/employees"
            style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
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
                padding: '12px 16px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: emp.status === 'present' ? '#dcfce7' : '#fee2e2',
                  border: `1.5px solid ${emp.status === 'present' ? '#86efac' : '#fca5a5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: emp.status === 'present' ? '#15803d' : '#dc2626',
                }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {emp.role}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${emp.status === 'present' ? 'badge-present' : 'badge-absent'}`} style={{ fontSize: '0.75rem' }}>
                  {emp.status === 'present' ? `✓ उपस्थित (${emp.punchTime})` : '✗ अनुपस्थित'}
                </span>

                <a
                  href={`tel:${emp.phone}`}
                  className="btn btn-sm"
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    borderRadius: 8
                  }}
                >
                  <Phone size={12} /> कॉल करें
                </a>

                <Link
                  href="/parshad/employees"
                  className="btn btn-sm btn-outline"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  हाजिरी देखें →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
