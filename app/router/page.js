'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import {
  Send, CheckCircle, Clock, FileText,
  AlertTriangle, ArrowRight, ShieldCheck,
  Building2, MapPin, Phone, Image, Filter,
  CheckCircle2, Sparkles, ChevronRight
} from 'lucide-react';

const DEPARTMENTS = [
  { id: 'sanitation', name: 'स्वास्थ्य एवं स्वच्छता शाखा', icon: '🧹', color: '#16a34a' },
  { id: 'civil',      name: 'निर्माण एवं इंजीनियरिंग शाखा', icon: '🛣️', color: '#2563eb' },
  { id: 'electrical', name: 'विद्युत अनुभाग (स्ट्रीट लाइट)', icon: '💡', color: '#d97706' },
  { id: 'water',      name: 'जल प्रदाय शाखा',            icon: '🚰', color: '#0284c7' },
  { id: 'garden',     name: 'उद्यान विकास शाखा',        icon: '🌳', color: '#65a30d' },
];

const INITIAL_ROUTER_COMPLAINTS = [
  {
    id: 1,
    code: 'CTNP-2026-000125',
    ward: 'वार्ड 24',
    category: 'कचरा ओवरफ्लो',
    location: 'बस स्टैंड के पास, मुख्य सड़क',
    date: '01 अक्टू 2026, 09:30 AM',
    citizen: 'राजेश कुमार',
    citizenPhone: '98290-54321',
    description: 'बस स्टैंड के मुख्य तिराहे पर कचरा पात्र ओवरफ्लो हो रहा है एवं आवारा पशु जमा हैं। कृपया तत्काल सफाई करवाई जाए।',
    photo: true,
    routedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    status: 'assigned',
    routedAt: '01 अक्टू 2026, 09:45 AM',
  },
  {
    id: 2,
    code: 'CTNP-2026-000118',
    ward: 'वार्ड 24',
    category: 'सड़क गड्ढा',
    location: 'मुख्य बाजार सड़क, निकट क्लॉक टावर',
    date: '30 सितं 2026, 04:15 PM',
    citizen: 'महेश सोनी',
    citizenPhone: '98290-67890',
    description: 'मुख्य बाजार सड़क पर गहरा गड्ढा हो गया है, रात्रि में दुपहिया वाहन चालकों के गिरने का खतरा है। डामरीकरण आवश्यक है।',
    photo: true,
    routedDept: 'निर्माण एवं इंजीनियरिंग शाखा',
    status: 'assigned',
    routedAt: '30 सितं 2026, 04:30 PM',
  },
  {
    id: 3,
    code: 'CTNP-2026-000109',
    ward: 'वार्ड 24',
    category: 'स्ट्रीट लाइट बंद',
    location: 'न्यू कॉलोनी, गली नं. 2',
    date: '29 सितं 2026, 08:00 PM',
    citizen: 'सुनीता देवी',
    citizenPhone: '98290-33445',
    description: 'गली नं. 2 के खंभा संख्या 08 की एलईडी लाइट विगत तीन दिवस से बंद है, पूरा मोहल्ला अंधेरे में है।',
    photo: false,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
  },
  {
    id: 4,
    code: 'CTNP-2026-000104',
    ward: 'वार्ड 12',
    category: 'पेयजल पाइपलाइन लीकेज',
    location: 'स्टेशन रोड, मुख्य चौराहा',
    date: '29 सितं 2026, 10:15 AM',
    citizen: 'कैलाश चंद्र',
    citizenPhone: '98290-22114',
    description: 'स्टेशन रोड पर मुख्य पाइपलाइन में भारी रिसाव हो रहा है, हजारों लीटर पानी व्यर्थ बह रहा है।',
    photo: true,
    routedDept: null,
    status: 'submitted',
    routedAt: null,
  },
  {
    id: 5,
    code: 'CTNP-2026-000098',
    ward: 'वार्ड 24',
    category: 'नाली अवरुद्ध / जलभराव',
    location: 'प्राथमिक विद्यालय के पास, वार्ड 24',
    date: '28 सितं 2026, 11:20 AM',
    citizen: 'दिनेश कुमावत',
    citizenPhone: '98290-88776',
    description: 'नाली में कचरा फंसने से गंदा पानी सड़क पर बह रहा है। पहले समाधान बताया था परंतु समस्या बनी हुई है।',
    photo: true,
    routedDept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    status: 'reopened',
    routedAt: '28 सितं 2026, 11:40 AM',
  },
  {
    id: 6,
    code: 'CTNP-2026-000087',
    ward: 'वार्ड 08',
    category: 'सार्वजनिक पार्क में सूखी झाड़ियां',
    location: 'सुभाष पार्क, वार्ड 08',
    date: '26 सितं 2026, 02:00 PM',
    citizen: 'रामगोपाल शर्मा',
    citizenPhone: '98290-44556',
    description: 'पार्क में सूखी झाड़ियां व खरपतवार अधिक हो गई हैं, बच्चों के खेलने में परेशानी हो रही है। कटाई आवश्यक है।',
    photo: false,
    routedDept: 'उद्यान विकास शाखा',
    status: 'resolved',
    routedAt: '26 सितं 2026, 02:30 PM',
  },
];

export default function RouterPage() {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState(INITIAL_ROUTER_COMPLAINTS);
  const [filter, setFilter] = useState('all');
  const [selectedDeptMap, setSelectedDeptMap] = useState({});
  const [notification, setNotification] = useState(null);

  function routeComplaint(complaintId) {
    const deptName = selectedDeptMap[complaintId];
    if (!deptName) return;

    const now = new Date();
    const timeStr = now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) + ', ' +
                    now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          routedDept: deptName,
          status: 'assigned',
          routedAt: timeStr,
        };
      }
      return c;
    }));

    setNotification(`शिकायत को सफलतापूर्वक "${deptName}" को प्रेषित (Route) किया गया!`);
    setTimeout(() => setNotification(null), 4000);
  }

  const total = complaints.length;
  const pendingRouting = complaints.filter(c => !c.routedDept).length;
  const routedCount = complaints.filter(c => c.routedDept && c.status !== 'resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  const filtered = complaints.filter(c => {
    if (filter === 'pending') return !c.routedDept;
    if (filter === 'routed')  return c.routedDept && c.status !== 'resolved';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <DashboardShell requiredRole="router">
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '18px 22px',
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>नगर परिषद चित्तौड़गढ़</span>
              <span>•</span>
              <span style={{ color: '#1e3a8a' }}>कंट्रोल रूम शिकायत रूटिंग कंसोल</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', color: '#1e3a8a', marginTop: 4, marginBottom: 4, fontWeight: 800 }}>
              कंट्रोल रूम — शिकायत रूटिंग एवं प्रेषण
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              समस्त 60 वार्डों से प्राप्त नागरिक शिकायतों को संबंधित नगरपालिका विभागों (स्वच्छता, निर्माण, विद्युत, जल) में तत्काल प्रेषित करें।
            </p>
          </div>
          <span className="badge badge-chairman" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            कंट्रोल रूम राउटर
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div style={{
          background: '#dcfce7',
          border: '1.5px solid #86efac',
          color: '#15803d',
          padding: '12px 16px',
          borderRadius: 10,
          marginBottom: 16,
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* 2. Key Routing Stat Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <div className="card" onClick={() => setFilter('all')} style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #1e3a8a', cursor: 'pointer', background: filter === 'all' ? '#eff6ff' : '#ffffff' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल प्राप्त शिकायतें</div>
        </div>

        <div className="card" onClick={() => setFilter('pending')} style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #dc2626', cursor: 'pointer', background: filter === 'pending' ? '#fef2f2' : '#ffffff' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{pendingRouting}</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: 4 }}>रूटिंग लंबित (Pending)</div>
        </div>

        <div className="card" onClick={() => setFilter('routed')} style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #d97706', cursor: 'pointer', background: filter === 'routed' ? '#fffbeb' : '#ffffff' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{routedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>विभाग को प्रेषित</div>
        </div>

        <div className="card" onClick={() => setFilter('resolved')} style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #16a34a', cursor: 'pointer', background: filter === 'resolved' ? '#f0fdf4' : '#ffffff' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{resolvedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>निस्तारित</div>
        </div>
      </div>

      {/* 3. Incoming Complaints Routing Deck */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              वार्डवार शिकायतें एवं विभागीय प्रेषण
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              शिकायत जांचें, संबंधित शाखा का चयन करें और तत्काल रूट करें
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              सभी ({total})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              रूटिंग लंबित ({pendingRouting})
            </button>
            <button
              type="button"
              onClick={() => setFilter('routed')}
              className={`btn btn-sm ${filter === 'routed' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              प्रेषित ({routedCount})
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(c => {
            const isRouted = !!c.routedDept;
            const currentSelectedDept = selectedDeptMap[c.id] || DEPARTMENTS[0].name;

            return (
              <div
                key={c.id}
                style={{
                  border: isRouted ? '1px solid #e2e8f0' : '1.5px solid #f87171',
                  borderRadius: 12,
                  padding: '16px 18px',
                  background: isRouted ? '#ffffff' : '#fff5f5',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Top Row: Code, Ward, Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: '#1e3a8a' }}>
                      {c.code}
                    </span>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid #bfdbfe'
                    }}>
                      {c.ward}
                    </span>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                      {c.category}
                    </span>
                    {c.photo && (
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        📷 फोटो उपलब्ध
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.date}</span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                {/* Problem Description */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}>
                  "{c.description}"
                </div>

                {/* Citizen and Location Strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: '0.78rem', color: '#64748b', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📍 {c.location}</span>
                    <span>•</span>
                    <span>नागरिक: <strong>{c.citizen}</strong></span>
                    <a href={`tel:${c.citizenPhone}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
                      📞 {c.citizenPhone}
                    </a>
                  </div>

                  {isRouted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700 }}>
                      <CheckCircle2 size={16} />
                      <span>प्रेषित शाखा: {c.routedDept} ({c.routedAt})</span>
                    </div>
                  )}
                </div>

                {/* Routing Action Strip */}
                {!isRouted ? (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>
                        रूटिंग आवश्यक:
                      </span>
                      <select
                        value={selectedDeptMap[c.id] || DEPARTMENTS[0].name}
                        onChange={(e) => setSelectedDeptMap(prev => ({ ...prev, [c.id]: e.target.value }))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          background: '#ffffff',
                          color: '#0f172a',
                          cursor: 'pointer'
                        }}
                      >
                        {DEPARTMENTS.map(d => (
                          <option key={d.id} value={d.name}>
                            {d.icon} {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => routeComplaint(c.id)}
                      className="btn btn-sm btn-primary"
                      style={{
                        background: '#dc2626',
                        padding: '7px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Send size={14} /> विभाग को प्रेषित करें
                    </button>
                  </div>
                ) : (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                  }}>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>
                      ✓ यह शिकायत <strong>{c.routedDept}</strong> के कार्यक्षेत्र में आवंटित कर दी गई है।
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setComplaints(prev => prev.map(item => item.id === c.id ? { ...item, routedDept: null, status: 'submitted' } : item));
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0284c7',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'underline'
                      }}
                    >
                      पुनः रूट बदलें
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
