'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import {
  FileText, Plus, ChevronDown, ChevronUp, MapPin, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

import CitizenOnboarding from '@/components/CitizenOnboarding';
import { getStoredCitizenProfile, getCitizenComplaints } from '@/lib/citizenService';

export default function CitizenComplaintsPage() {
  const [mounted, setMounted] = useState(false);
  const [citizen, setCitizen] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [reopenNote, setReopenNote] = useState({});
  const [showReopenInput, setShowReopenInput] = useState({});

  useEffect(() => {
    setMounted(true);
    const stored = getStoredCitizenProfile();
    if (stored) {
      setCitizen(stored);
      getCitizenComplaints(stored.phone).then(list => {
        setComplaints(list);
        if (list.length > 0) setExpandedId(list[0].id);
      });
    }
  }, []);

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function markSatisfied(id) {
    setFeedback(prev => ({ ...prev, [id]: 'resolved' }));
    setShowReopenInput(prev => ({ ...prev, [id]: false }));
  }

  function handleReopenSubmit(id) {
    const note = reopenNote[id] || 'नागरिक द्वारा समाधान असंतोषजनक बताया गया।';
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'reopened',
          statusDetail: `असंतोषजनक समाधान — नागरिक टिप्पणी: "${note}"। पुनः जांच जारी।`,
        };
      }
      return c;
    }));
    setFeedback(prev => ({ ...prev, [id]: 'reopen' }));
    setShowReopenInput(prev => ({ ...prev, [id]: false }));
  }

  // Filter logic
  const filteredComplaints = complaints.filter(c => {
    let matchesFilter = true;
    if (filter === 'open') {
      // All open/pending complaints
      matchesFilter = ['submitted', 'assigned', 'in_progress', 'reopened'].includes(c.status);
    } else if (filter === 'in_progress') {
      matchesFilter = c.status === 'in_progress';
    } else if (filter === 'resolved') {
      matchesFilter = ['resolved', 'closed'].includes(c.status);
    } else if (filter === 'reopened') {
      matchesFilter = c.status === 'reopened';
    }

    const q = search.toLowerCase();
    const matchesSearch = !q ||
      c.code.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.dept.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  // Dynamic counts
  const totalCount = complaints.length;
  const openCount = complaints.filter(c => ['submitted', 'assigned', 'in_progress', 'reopened'].includes(c.status)).length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedCount = complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
  const reopenedCount = complaints.filter(c => c.status === 'reopened').length;

  if (!mounted) {
    return (
      <DashboardShell requiredRole="citizen">
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>शिकायतें लोड हो रही हैं...</div>
        </div>
      </DashboardShell>
    );
  }

  if (!citizen) {
    return (
      <DashboardShell requiredRole="citizen" hideBottomNav={true} guestMode={true} currentProfile={null}>
        <CitizenOnboarding onComplete={newProf => {
          setCitizen(newProf);
          getCitizenComplaints(newProf.phone).then(list => {
            setComplaints(list);
            if (list.length > 0) setExpandedId(list[0].id);
          });
        }} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell requiredRole="citizen">
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        {/* Breadcrumb Navigation on Desktop */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#64748b', marginBottom: 12 }}>
          <Link href="/citizen" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>नागरिक मुख्य पृष्ठ</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>मेरी दर्ज शिकायतें (My Complaints)</span>
        </div>

        <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 3, fontWeight: 800 }}>मेरी दर्ज नागरिक शिकायतें</h1>
              <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>चित्तौड़गढ़ नगर परिषद - अपनी दर्ज शिकायतों का पूरा विवरण खोलें, स्थिति देखें व फीडबैक दें</p>
            </div>
            <Link href="/citizen/report" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.85rem', gap: 6 }}>
              <Plus size={16} /> नई समस्या दर्ज करें
            </Link>
          </div>
        </div>

        {/* Dynamic Summary Stats Grid (Clickable) */}
        <div className="citizen-stat-grid" style={{ marginBottom: 'var(--space-4)' }}>
          <div
            className="card"
            style={{
              padding: '14px 10px',
              textAlign: 'center',
              borderTop: filter === 'all' ? '4px solid #1e3a8a' : '2px solid #cbd5e1',
              cursor: 'pointer',
              background: filter === 'all' ? '#eff6ff' : '#ffffff',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 82,
            }}
            onClick={() => setFilter('all')}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल शिकायतें</div>
          </div>

          <div
            className="card"
            style={{
              padding: '14px 10px',
              textAlign: 'center',
              borderTop: filter === 'open' ? '4px solid #d97706' : '2px solid #cbd5e1',
              cursor: 'pointer',
              background: filter === 'open' ? '#fffbeb' : '#ffffff',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 82,
            }}
            onClick={() => setFilter('open')}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{openCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>खुली / लंबित</div>
          </div>

          <div
            className="card"
            style={{
              padding: '14px 10px',
              textAlign: 'center',
              borderTop: filter === 'resolved' ? '4px solid #16a34a' : '2px solid #cbd5e1',
              cursor: 'pointer',
              background: filter === 'resolved' ? '#f0fdf4' : '#ffffff',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 82,
            }}
            onClick={() => setFilter('resolved')}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>निस्तारित</div>
          </div>

          <div
            className="card"
            style={{
              padding: '14px 10px',
              textAlign: 'center',
              borderTop: filter === 'reopened' ? '4px solid #dc2626' : '2px solid #cbd5e1',
              cursor: 'pointer',
              background: filter === 'reopened' ? '#fef2f2' : '#ffffff',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 82,
            }}
            onClick={() => setFilter('reopened')}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{reopenedCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: 4 }}>पुनः खुली</div>
          </div>
        </div>

        {/* Filter Bar with Open / Closed / Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'सभी (All)' },
              { id: 'open', label: 'खुली / लंबित (Open)' },
              { id: 'in_progress', label: 'प्रगति पर' },
              { id: 'resolved', label: 'निस्तारित' },
              { id: 'reopened', label: 'पुनः खुली' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filter === f.id ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                  background: filter === f.id ? '#1d4ed8' : '#ffffff',
                  color: filter === f.id ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="शिकायत क्र., श्रेणी या स्थान खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: '0.8rem',
              width: '100%',
              maxWidth: 260,
              background: '#ffffff'
            }}
          />
        </div>

        {/* Complaints List */}
        {totalCount === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
            <div style={{
              width: 56, height: 56,
              background: '#eff6ff',
              color: '#1d4ed8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 800, margin: '0 0 6px' }}>
              वर्तमान में आपकी कोई शिकायत दर्ज नहीं है
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
              वार्ड संख्या {citizen.ward} में किसी भी समस्या (सफाई, नाली, सड़क, स्ट्रीट लाइट, पेयजल) के समाधान हेतु नई शिकायत दर्ज करें।
            </p>
            <Link
              href="/citizen/report"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px' }}
            >
              <Plus size={16} /> नई नागरिक समस्या दर्ज करें
            </Link>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>इस फ़िल्टर में कोई शिकायत नहीं मिली।</div>
            <div style={{ fontSize: '0.8rem', marginTop: 4 }}>सभी शिकायतें देखने हेतु "सभी (All)" पर क्लिक करें।</div>
          </div>
        ) : (
          filteredComplaints.map(c => {
            const isExpanded = expandedId === c.id;

            return (
              <div
                key={c.id}
                className="card"
                style={{
                  marginBottom: 14,
                  padding: '16px 18px',
                  background: '#ffffff',
                  border: isExpanded ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                  boxShadow: isExpanded ? '0 4px 14px rgba(59, 130, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Header Row: Top bar with code on left and Status Badge on right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                    <span className="complaint-code" style={{ fontSize: '0.8rem', fontWeight: 800 }}>{c.code}</span>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                {/* Complaint Title & Details */}
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', lineHeight: 1.3, marginBottom: 4 }}>
                  {c.category}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span>{c.ward}</span>
                  <span>•</span>
                  <span style={{ color: '#1e3a8a', fontWeight: 700 }}>{c.dept}</span>
                  <span>•</span>
                  <span>दर्ज: {c.date}</span>
                </div>

                {/* Status Summary Strip */}
                <div style={{
                  marginBottom: 10,
                  background: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                    <span style={{ fontWeight: 700, color: '#1e3a8a', marginRight: 6 }}>अद्यतन स्थिति:</span>
                    <span>{c.statusDetail}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    अनुमानित समय: <strong style={{ color: '#0f172a' }}>{c.sla}</strong>
                  </div>
                </div>

                {/* Sleek 100% Width Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(c.id)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: isExpanded ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    background: isExpanded ? '#eff6ff' : '#f8fafc',
                    color: isExpanded ? '#1d4ed8' : '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={15} color={isExpanded ? '#1d4ed8' : '#64748b'} />
                    <span>{isExpanded ? 'शिकायत विवरण बंद करें' : 'शिकायत विवरण देखें'}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: isExpanded ? '#1d4ed8' : '#64748b' }}>
                    <span>{isExpanded ? 'संक्षिप्त करें' : 'विस्तार से'}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {/* EXPANDED FULL DETAILS VIEW */}
                {isExpanded && (
                  <div style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '2px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    {/* Location & Assigned Staff Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: 10,
                      background: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem'
                    }}>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>📍 समस्या स्थल (Location)</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{c.location || 'वार्ड 24, चित्तौड़गढ़'}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>👷 वार्ड बीट प्रभारी / कर्मी</div>
                        <div style={{ fontWeight: 700, color: '#1e3a8a', marginTop: 2 }}>{c.assignedStaff || 'रमेश मीणा (सफाई जमादार)'}</div>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    {c.description && (
                      <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                          📝 नागरिक द्वारा दर्ज समस्या का विवरण:
                        </div>
                        <p style={{ fontSize: '0.825rem', color: '#1e293b', margin: 0, lineHeight: 1.5 }}>
                          {c.description}
                        </p>
                      </div>
                    )}

                    {/* Photo Proof Preview (if attached) */}
                    {c.photo && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                          📷 संलग्न फोटो प्रमाण:
                        </div>
                        <img
                          src={c.photo}
                          alt="Complaint Proof"
                          style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 6, border: '1px solid #cbd5e1', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Civic Helpline Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 8,
                      paddingTop: 4,
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      <span>📞 नगर परिषद कंट्रोल रूम: <strong>01472-241246</strong></span>
                      <span>राजस्थान संपर्क: <strong>181</strong> (टोल फ्री)</span>
                    </div>
                  </div>
                )}

                {/* Reopened Alert */}
                {c.status === 'reopened' && (
                  <div className="alert alert-error" style={{ marginTop: 12, marginBottom: 6, padding: '10px 14px', fontSize: '0.8125rem' }}>
                    यह शिकायत असंतोषजनक समाधान के कारण पुनः खोली गई है एवं संबंधित शाखा को प्रेषित है।
                  </div>
                )}

                {/* Feedback section for resolved complaints */}
                {(c.status === 'resolved' || c.status === 'closed') && !feedback[c.id] && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginTop: 12,
                  }}>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.85rem', marginBottom: 8 }}>
                      ✅ क्या आपके वार्ड में समस्या का संतोषजनक समाधान हुआ?
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-success"
                        style={{ fontSize: '0.78rem', padding: '7px 14px', flex: '1 1 130px', textAlign: 'center', justifyContent: 'center' }}
                        onClick={() => markSatisfied(c.id)}
                      >
                        ✓ हाँ, संतुष्ट हैं
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.78rem', padding: '7px 14px', flex: '1 1 130px', textAlign: 'center', justifyContent: 'center' }}
                        onClick={() => setShowReopenInput(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                      >
                        ✕ असंतोषजनक (पुनः खोलें)
                      </button>
                    </div>

                    {/* Reopen Reason Input Box */}
                    {showReopenInput[c.id] && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #bbf7d0' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
                          कृपया असंतोष का कारण दर्ज करें (शिकायत पुनः खोली जाएगी):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="उदा. मौके पर अभी भी कचरा पड़ा है या लाइट पुनः बंद हो गई..."
                          value={reopenNote[c.id] || ''}
                          onChange={e => setReopenNote({ ...reopenNote, [c.id]: e.target.value })}
                          style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: 6, border: '1px solid #fca5a5', marginBottom: 8 }}
                        />
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                          onClick={() => handleReopenSubmit(c.id)}
                        >
                          पुनः खोलने हेतु प्रेषित करें
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {feedback[c.id] === 'resolved' && (
                  <div style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 6 }}>
                    ✓ आपका संतोषजनक फीडबैक दर्ज कर लिया गया है। धन्यवाद!
                  </div>
                )}
                {feedback[c.id] === 'reopen' && (
                  <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 700, marginTop: 10, padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
                    ✓ शिकायत पुनः समीक्षा हेतु संबंधित शाखा प्रभारी को प्रेषित कर दी गई है।
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
