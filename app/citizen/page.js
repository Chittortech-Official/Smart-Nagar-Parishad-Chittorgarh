'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import {
  FileText, ClipboardList, CheckCircle, Clock,
  Plus, ChevronRight, ArrowRight, PhoneCall
} from 'lucide-react';

const MOCK_COMPLAINTS = [
  { id: 1, code: 'CTNP-2026-000087', category: 'कचरा एवं स्वच्छता', ward: 'वार्ड 24', status: 'in_progress', date: '28 सितं 2026', dept: 'स्वच्छता विभाग' },
  { id: 2, code: 'CTNP-2026-000065', category: 'स्ट्रीट लाइट बंद',   ward: 'वार्ड 24', status: 'resolved',    date: '20 सितं 2026', dept: 'विद्युत अनुभाग' },
  { id: 3, code: 'CTNP-2026-000041', category: 'सड़क गड्ढा मरम्मत',  ward: 'वार्ड 24', status: 'closed',      date: '10 सितं 2026', dept: 'इंजीनियरिंग' },
];

const STATUS_CONFIG = {
  submitted:    { label: 'दर्ज',        color: '#64748b', step: 0 },
  acknowledged: { label: 'स्वीकृत',   color: '#1d4ed8', step: 1 },
  assigned:     { label: 'आवंटित',       color: '#7c3aed', step: 2 },
  in_progress:  { label: 'प्रगति पर', color: '#b45309', step: 3 },
  resolved:     { label: 'निस्तारित',     color: '#15803d', step: 4 },
  closed:       { label: 'समाधान पूर्ण',  color: '#166534', step: 5 },
  reopened:     { label: 'पुनः खुली', color: '#b91c1c', step: -1 },
};

const STEPS = ['दर्ज', 'स्वीकृत', 'आवंटित', 'प्रगति पर', 'निस्तारित', 'पूर्ण'];

function ComplaintTracker({ complaint }) {
  const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.submitted;
  return (
    <div className="card" style={{ marginBottom: 10, padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <span className="complaint-code">{complaint.code}</span>
        <span className={`badge badge-${complaint.status}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.92rem', marginBottom: 2 }}>
        {complaint.category}
      </div>

      <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 10 }}>
        {complaint.ward} • {complaint.dept} • {complaint.date}
      </div>

      {/* Progress Bar */}
      {complaint.status !== 'reopened' && (
        <div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= cfg.step ? cfg.color : '#e2e8f0',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#94a3b8' }}>
            <span>शिकायत दर्ज</span>
            <span>समाधान पूर्ण</span>
          </div>
        </div>
      )}

      {/* Feedback prompt for resolved */}
      {complaint.status === 'resolved' && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 8, padding: '8px 10px', marginTop: 10,
        }}>
          <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 6, fontSize: '0.78rem' }}>
            ✅ क्या समस्या का समाधान हो गया?
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-success" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>हाँ, ठीक है</button>
            <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>पुनः खोलें</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CitizenPage() {
  const { profile } = useAuth();
  const name = profile?.full_name?.split(' ')[0] || 'नागरिक';

  return (
    <DashboardShell requiredRole="citizen">
      {/* Welcome Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>
              नगर परिषद चित्तौड़गढ़ • नागरिक सेवा
            </div>
            <h1 style={{ fontSize: '1.2rem', color: '#1e3a8a', marginTop: 1, marginBottom: 2 }}>
              नमस्ते, {name}! 👋
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              नागरिक समस्याएं दर्ज करें एवं समाधान ट्रैक करें
            </p>
          </div>
          <div style={{
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '4px 10px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            वार्ड 24
          </div>
        </div>
      </div>

      {/* Main Action Touch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <Link
          href="/citizen/report"
          id="report-problem-btn"
          style={{
            background: 'linear-gradient(135deg, #15803d, #16a34a)',
            borderRadius: 12,
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            textDecoration: 'none',
            color: '#ffffff',
            boxShadow: '0 3px 8px rgba(21, 128, 61, 0.2)',
          }}
        >
          <div style={{
            width: 38, height: 38,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Plus size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>समस्या दर्ज करें</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: 2 }}>सड़क, कचरा, लाइट आदि</div>
          </div>
        </Link>

        <Link
          href="/citizen/complaints"
          id="my-complaints-btn"
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 12,
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            textDecoration: 'none',
            color: '#0f172a',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{
            width: 38, height: 38,
            background: '#eff6ff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ClipboardList size={18} color="#1d4ed8" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.2 }}>मेरी शिकायतें</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>कुल 3 दर्ज शिकायतें</div>
          </div>
        </Link>
      </div>

      {/* Summary Counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        <div className="card" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a' }}>3</div>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>कुल शिकायतें</div>
        </div>
        <div className="card" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706' }}>1</div>
          <div style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 600 }}>प्रगति पर</div>
        </div>
        <div className="card" style={{ padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>2</div>
          <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 600 }}>निस्तारित</div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#1e3a8a', margin: 0 }}>हालिया शिकायतें (Recent)</h3>
          <Link href="/citizen/complaints" style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>
            सभी देखें →
          </Link>
        </div>
        {MOCK_COMPLAINTS.map(c => <ComplaintTracker key={c.id} complaint={c} />)}
      </div>

      {/* Helpline Info */}
      <div style={{
        marginTop: 12,
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.75rem',
        color: '#1e40af',
      }}>
        <PhoneCall size={16} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          हेल्पलाइन: <strong>01472-241246</strong> | राजस्थान संपर्क: <strong>181</strong>
        </div>
      </div>
    </DashboardShell>
  );
}
