'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import {
  FileText, ClipboardList, CheckCircle, Clock,
  Plus, ChevronRight, ArrowRight, PhoneCall,
  MapPin, Truck, UserCheck, ShieldCheck, AlertCircle,
  HelpCircle, Sparkles, CheckCircle2
} from 'lucide-react';

const MOCK_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000087', category: 'कचरा एवं स्वच्छता', ward: 'वार्ड 24', status: 'in_progress', date: '28 सितं 2026', dept: 'स्वास्थ्य एवं स्वच्छता विभाग', location: 'भारत माता चौक, मुख्य बाजार', sla: '24 घंटे', statusDetail: 'कार्य प्रगति पर है — सफाई टीम मौके पर कार्यरत है।' },
  { id: 2, code: 'CTNP-2026-000065', category: 'स्ट्रीट लाइट बंद',   ward: 'वार्ड 24', status: 'resolved',    date: '20 सितं 2026', dept: 'विद्युत अनुभाग', location: 'गली संख्या 3, पोस्ट ऑफिस पास', sla: '48 घंटे', statusDetail: 'स्ट्रीट लाइट मरम्मत कार्य पूर्ण।' },
  { id: 3, code: 'CTNP-2026-000041', category: 'सड़क गड्ढा मरम्मत',  ward: 'वार्ड 24', status: 'closed',      date: '10 सितं 2026', dept: 'इंजीनियरिंग शाखा', location: 'स्टेशन रोड कॉर्नर', sla: '72 घंटे', statusDetail: 'डामरीकरण कार्य पूर्ण एवं सत्यापित।' },
];

const STATUS_CONFIG = {
  submitted:    { label: 'दर्ज',        color: '#64748b' },
  acknowledged: { label: 'स्वीकृत',   color: '#1d4ed8' },
  assigned:     { label: 'आवंटित',       color: '#7c3aed' },
  in_progress:  { label: 'प्रगति पर', color: '#b45309' },
  resolved:     { label: 'निस्तारित',     color: '#15803d' },
  closed:       { label: 'समाधान पूर्ण',  color: '#166534' },
  reopened:     { label: 'पुनः खुली', color: '#b91c1c' },
};

function ComplaintTracker({ complaint }) {
  const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.submitted;
  return (
    <div className="card" style={{ marginBottom: 12, padding: '14px 16px', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
        <span className="complaint-code" style={{ fontSize: '0.8rem' }}>{complaint.code}</span>
        <span className={`badge badge-${complaint.status}`} style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.98rem', marginBottom: 3 }}>
        {complaint.category}
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span>📍 {complaint.location || complaint.ward}</span>
        <span>•</span>
        <span style={{ color: '#1e40af', fontWeight: 600 }}>{complaint.dept}</span>
        <span>•</span>
        <span>{complaint.date}</span>
      </div>

      {/* Clean Status Box (No Slider / No Graph) */}
      <div style={{
        background: '#f8fafc',
        padding: '9px 12px',
        borderRadius: 8,
        border: '1px solid #f1f5f9',
        fontSize: '0.78rem',
        color: '#334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <div>
          <span style={{ fontWeight: 700, color: '#1e3a8a', marginRight: 6 }}>वर्तमान स्थिति:</span>
          <span style={{ fontWeight: 600, color: cfg.color }}>{complaint.statusDetail || cfg.label}</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
          अनुमानित समय: <strong style={{ color: '#0f172a' }}>{complaint.sla || '24-48 घंटे'}</strong>
        </span>
      </div>
    </div>
  );
}

export default function CitizenPage() {
  const { profile } = useAuth();
  const [complaintList, setComplaintList] = useState(MOCK_COMPLAINTS);
  const name = profile?.full_name?.split(' ')[0] || 'राजेश कुमार';

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chittorgarh_citizen_complaints');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingCodes = new Set(MOCK_COMPLAINTS.map(m => m.code));
          const newItems = parsed.filter(p => !existingCodes.has(p.code));
          setComplaintList([...newItems, ...MOCK_COMPLAINTS]);
        }
      }
    } catch (_) {}
  }, []);

  const total = complaintList.length;
  const inProgress = complaintList.filter(c => ['in_progress', 'submitted', 'assigned', 'reopened'].includes(c.status)).length;
  const resolved = complaintList.filter(c => ['resolved', 'closed'].includes(c.status)).length;

  const activeComplaint = complaintList.find(c => ['in_progress', 'submitted', 'assigned', 'reopened'].includes(c.status)) || complaintList[0];

  return (
    <DashboardShell requiredRole="citizen">
      {/* 1. Top Welcome Banner (Mobile + Desktop Responsive) */}
      <div className="citizen-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>नगर परिषद चित्तौड़गढ़</span>
              <span>•</span>
              <span style={{ color: '#16a34a' }}>नागरिक ई-सेवा पोर्टल</span>
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginTop: 4, marginBottom: 4, fontWeight: 800 }}>
              नमस्ते, {name} जी! 👋
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
              अपने वार्ड की नागरिक समस्याएं दर्ज करें, प्रगति ट्रैक करें और पारदर्शी समाधान प्राप्त करें।
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '6px 14px',
              borderRadius: 9999,
              fontSize: '0.8rem',
              fontWeight: 700,
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <MapPin size={14} />
              <span>वार्ड संख्या 24 (चित्तौड़गढ़)</span>
            </div>

            <Link
              href="/citizen/report"
              className="btn btn-primary hide-mobile"
              style={{ padding: '8px 16px', fontSize: '0.825rem', gap: 6 }}
            >
              <Plus size={16} /> नई समस्या दर्ज करें
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Responsive Stat Grid (2x2 on Mobile, 4-col on Desktop) */}
      <div className="citizen-stat-grid">
        <Link href="/citizen/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #1e3a8a', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल शिकायतें</div>
        </Link>
        <Link href="/citizen/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #d97706', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{inProgress}</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>प्रगति पर</div>
        </Link>
        <Link href="/citizen/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #16a34a', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{resolved}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>निस्तारित</div>
        </Link>
        <div className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #0284c7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7', lineHeight: 1 }}>24h</div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>औसत समय</div>
        </div>
      </div>

      {/* 3. Main Action Touch Cards (Mobile First, Prominent on Mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Link
          href="/citizen/report"
          id="report-problem-btn"
          style={{
            background: 'linear-gradient(135deg, #15803d, #16a34a)',
            borderRadius: 14,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            textDecoration: 'none',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: 40, height: 40,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Plus size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.2 }}>समस्या दर्ज करें</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.9, marginTop: 3 }}>कचरा, सड़क, स्ट्रीट लाइट, जल आदि</div>
          </div>
        </Link>

        <Link
          href="/citizen/complaints"
          id="my-complaints-btn"
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 14,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            textDecoration: 'none',
            color: '#0f172a',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: 40, height: 40,
            background: '#eff6ff',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ClipboardList size={20} color="#1d4ed8" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1e3a8a', lineHeight: 1.2 }}>मेरी शिकायतें</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>स्थिति ट्रैक करें व फीडबैक दें ({total})</div>
          </div>
        </Link>
      </div>

      {/* 4. Responsive 2-Column Grid (Main Complaints Left + Civic Info Sidebar Right) */}
      <div className="citizen-grid-layout">
        {/* LEFT COLUMN: Live Tracker & Recent Complaints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Active Complaint Highlight */}
          {activeComplaint && (
            <div className="card" style={{ padding: '16px 18px', borderLeft: '4px solid #b45309' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="#b45309" />
                  <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.85rem' }}>वर्तमान में सक्रिय समस्या (Active Issue)</span>
                </div>
                <span className="complaint-code">{activeComplaint.code}</span>
              </div>

              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e3a8a', marginBottom: 4 }}>
                {activeComplaint.category}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 12px 0' }}>
                स्थान: {activeComplaint.location || 'वार्ड 24'} • {activeComplaint.dept}
              </p>

              {/* Clean Status Info (No Slider / No Graph) */}
              <div style={{
                background: '#fffbeb',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#b45309', marginRight: 6 }}>वर्तमान स्थिति:</span>
                  <span style={{ fontSize: '0.825rem', color: '#78350f', fontWeight: 600 }}>
                    {activeComplaint.statusDetail || 'कार्य प्रगति पर है।'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                  अनुमानित समय: {activeComplaint.sla || '24 घंटे'}
                </span>
              </div>
            </div>
          )}

          {/* Recent Complaints List */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f5f9', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '0.96rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>हालिया शिकायतें</h3>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>वार्ड 24 में आपकी दर्ज समस्याएं</span>
              </div>
              <Link
                href="/citizen/complaints"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#1d4ed8',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '5px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>सभी {total} देखें</span>
                <span>&rarr;</span>
              </Link>
            </div>
            {complaintList.slice(0, 3).map(c => <ComplaintTracker key={c.id} complaint={c} />)}
          </div>
        </div>

        {/* RIGHT COLUMN (Desktop Sidebar & Mobile Civic Desk) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ward 24 Local Representatives Card */}
          <div className="card" style={{ padding: '16px 18px', background: '#fcfcfd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
              <MapPin size={18} color="#7c3aed" />
              <h3 style={{ fontSize: '0.92rem', color: '#1e3a8a', margin: 0, fontWeight: 700 }}>
                वार्ड 24 स्थानीय सेवा केंद्र
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>वार्ड पार्षद</div>
                  <strong style={{ color: '#0f172a' }}>श्रीमती कमला बाई</strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#f3e8ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  पार्षद
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>वार्ड स्वच्छता कर्मचारी / बीट प्रभारी</div>
                  <strong style={{ color: '#0f172a' }}>रमेश मीणा</strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  कर्मचारी
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>सफाई बीट कर्मी</div>
                  <strong style={{ color: '#0f172a' }}>रमेश मीणा</strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  आज उपस्थित ✓
                </span>
              </div>
            </div>
          </div>

          {/* Door-to-Door Garbage Vehicle Live Tracker Card */}
          <div className="card" style={{ padding: '16px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Truck size={18} color="#16a34a" />
              <strong style={{ fontSize: '0.875rem', color: '#166534' }}>कचरा संग्रहण वाहन (Door-to-Door)</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
              वाहन: <strong>RJ-09-GC-1024</strong><br />
              स्थिति: <span style={{ fontWeight: 700 }}>वार्ड 24 में भ्रमण पूर्ण (प्रातः 8:30 बजे)</span> ✅
            </div>
          </div>

          {/* 24x7 Official Helpline Card */}
          <div className="card" style={{ padding: '16px 18px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <PhoneCall size={18} color="#2563eb" />
              <strong style={{ fontSize: '0.875rem', color: '#1e40af' }}>आपातकालीन नागरिक सहायता</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: '#1e3a8a' }}>
              <div>📞 नगर परिषद कंट्रोल रूम: <strong>01472-241246</strong></div>
              <div>🟢 राजस्थान संपर्क (टोल फ्री): <strong>181</strong> (24x7)</div>
              <div>🚒 फायर ब्रिगेड: <strong>101</strong> | 🚑 एम्बुलेंस: <strong>108</strong></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
