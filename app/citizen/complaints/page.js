'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { CheckCircle, Clock, FileText, RotateCcw, Plus } from 'lucide-react';
import Link from 'next/link';

const MOCK = [
  { id: 1, code: 'CTNP-2026-000087', category: 'कचरा / स्वच्छता (Garbage)', ward: 'वार्ड 24', status: 'in_progress', dept: 'स्वास्थ्य एवं स्वच्छता विभाग',   date: '28 सितं 2026', step: 3 },
  { id: 2, code: 'CTNP-2026-000065', category: 'स्ट्रीट लाइट बंद (Street Light)',   ward: 'वार्ड 24', status: 'resolved',    dept: 'विद्युत अनुभाग',            date: '20 सितं 2026', step: 4 },
  { id: 3, code: 'CTNP-2026-000041', category: 'सड़क गड्ढा मरम्मत (Road Pothole)',  ward: 'वार्ड 24', status: 'closed',      dept: 'निर्माण / इंजीनियरिंग',     date: '10 सितं 2026', step: 5 },
  { id: 4, code: 'CTNP-2026-000018', category: 'पेयजल लीकेज (Water Pipeline)',     ward: 'वार्ड 24', status: 'reopened',    dept: 'जल प्रदाय अनुभाग',          date: '01 सितं 2026', step: -1 },
];

const STEPS = ['दर्ज', 'स्वीकृत', 'आवंटित', 'प्रगति पर', 'निस्तारित', 'पूर्ण'];
const STEP_COLORS = { 0:'#64748b', 1:'#1d4ed8', 2:'#7c3aed', 3:'#b45309', 4:'#15803d', 5:'#166534' };

export default function CitizenComplaintsPage() {
  const { profile } = useAuth();
  const [feedback, setFeedback] = useState({});

  function markFeedback(id, val) {
    setFeedback(prev => ({ ...prev, [id]: val }));
  }

  return (
    <DashboardShell requiredRole="citizen">
      <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2 }}>मेरी दर्ज शिकायतें</h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>चित्तौड़गढ़ नगर परिषद में आपकी शिकायतों की अद्यतन स्थिति</p>
          </div>
          <Link href="/citizen/report" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Plus size={16} /> नई शिकायत दर्ज करें
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="stat-card blue">
          <div className="stat-icon" style={{ background: '#eff6ff' }}><FileText size={18} color="#2563eb" /></div>
          <div className="stat-value">4</div>
          <div className="stat-label">कुल शिकायतें</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon" style={{ background: '#fef3c7' }}><Clock size={18} color="#d97706" /></div>
          <div className="stat-value">1</div>
          <div className="stat-label">प्रगति पर</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon" style={{ background: '#dcfce7' }}><CheckCircle size={18} color="#16a34a" /></div>
          <div className="stat-value">2</div>
          <div className="stat-label">निस्तारित</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon" style={{ background: '#fee2e2' }}><RotateCcw size={18} color="#dc2626" /></div>
          <div className="stat-value">1</div>
          <div className="stat-label">पुनः खुली</div>
        </div>
      </div>

      {/* Complaints List */}
      {MOCK.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 'var(--space-3)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div className="complaint-code">{c.code}</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 3, fontSize: '0.95rem' }}>{c.category}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                {c.ward} • <span style={{ color: '#1e3a8a', fontWeight: 600 }}>{c.dept}</span> • {c.date}
              </div>
            </div>
            <StatusBadge status={c.status} />
          </div>

          {/* Progress Steps */}
          {c.status !== 'reopened' && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 5, borderRadius: 3,
                    background: i <= c.step ? (STEP_COLORS[c.step] || '#15803d') : '#e2e8f0',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                {STEPS.map((s, i) => (
                  <span key={s} style={{ color: i === c.step ? STEP_COLORS[c.step] : undefined, fontWeight: i === c.step ? 700 : 500 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reopened Alert */}
          {c.status === 'reopened' && (
            <div className="alert alert-error" style={{ marginBottom: 10, padding: '10px 12px', fontSize: '0.8125rem' }}>
              यह शिकायत असंतोषजनक समाधान के कारण पुनः खोली गई है एवं संबंधित कनिष्ठ अभियंता/अधिकारी को प्रेषित है।
            </div>
          )}

          {/* Feedback section for resolved */}
          {c.status === 'resolved' && !feedback[c.id] && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 8, padding: '10px 12px',
            }}>
              <div style={{ fontWeight: 600, color: '#15803d', fontSize: '0.8125rem', marginBottom: 8 }}>
                ✅ क्या आपके वार्ड में कार्य पूरा हुआ?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-success"
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  onClick={() => markFeedback(c.id, 'resolved')}
                >
                  हाँ, समाधान हुआ
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  onClick={() => markFeedback(c.id, 'reopen')}
                >
                  नहीं, पुनः खोलें
                </button>
              </div>
            </div>
          )}

          {feedback[c.id] === 'resolved' && (
            <div style={{ color: '#16a34a', fontSize: '0.8125rem', fontWeight: 600 }}>
              ✓ आपकी संतुष्टि दर्ज कर ली गई है। धन्यवाद!
            </div>
          )}
          {feedback[c.id] === 'reopen' && (
            <div style={{ color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600 }}>
              ✓ शिकायत पुनः समीक्षा हेतु प्रेषित कर दी गई है।
            </div>
          )}
        </div>
      ))}
    </DashboardShell>
  );
}
