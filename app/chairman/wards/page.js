'use client';

import { useState, useMemo } from 'react';
import DashboardShell from '@/components/DashboardShell';
import {
  MapPin, ArrowLeft, Users, CheckCircle, Clock, AlertTriangle,
  Search, Filter, Phone, Award, Crown, Star, FileText, CheckCircle2,
  Calendar, User, Tag
} from 'lucide-react';
import Link from 'next/link';
import { CHITTORGARH_60_WARDS, PARTY_COLORS } from '@/lib/data/wardsResults';
import { INITIAL_COMPLAINTS } from '@/lib/data/routerData';
import { getSharedLiveComplaints } from '@/lib/citizenService';

// Enhance the official election results with clean municipal complaint stats (no safai karmi)
const WARDS_DATA = CHITTORGARH_60_WARDS.map((w, i) => {
  const isChair = w.isChairman;
  const isVice = w.isViceChairman;
  const isWard24 = w.num === 24;

  let baseTotal = ((i * 7 + 11) % 15) + 5;
  let baseResolved = Math.min(baseTotal, Math.max(2, ((i * 5 + 3) % 11) + 3));

  if (isChair) {
    baseTotal = 15;
    baseResolved = 15; // 100% resolved for Chairman Anil Inani
  } else if (isVice) {
    baseTotal = 14;
    baseResolved = 14; // 100% resolved for Vice Chairman Sudarshan Rampuriya
  } else if (isWard24) {
    baseTotal = 5;
    baseResolved = 3;  // Ward 24 Demo: 3 resolved, 2 pending
  }

  return {
    ...w,
    name: `वार्ड संख्या ${w.num}`,
    total: baseTotal,
    resolved: baseResolved,
    pending: baseTotal - baseResolved,
    phone: `98290-${String(20000 + w.num * 143).slice(0, 5)}`,
  };
});

// Helper to generate or fetch realistic complaints for any selected ward
function getWardComplaintsList(ward) {
  let baseList = [];
  if (ward.num === 24) {
    // Official Ward 24 demo complaints
    baseList = [
      ...INITIAL_COMPLAINTS.filter(c => c.wardNum === 24).map(c => ({
        id: c.code,
        category: c.category,
        location: c.location,
        date: c.date,
        citizen: c.citizen,
        citizenPhone: c.citizenPhone,
        description: c.description,
        dept: c.suggestedDept || c.routedDept || 'स्वास्थ्य एवं स्वच्छता शाखा',
        status: c.status === 'resolved' ? 'resolved' : 'pending',
      })),
      {
        id: 'CTNP-2026-000098',
        category: 'पेयजल लीकेज मरम्मत',
        location: 'गली नं. 4, मकान सं. 12 के सामने',
        date: '28 सितं 2026, 10:00 AM',
        citizen: 'राधेश्याम धाकड़',
        citizenPhone: '98290-44556',
        description: 'जल प्रदाय पाइपलाइन से लगातार जल रिसाव हो रहा था, तकनीकी दल द्वारा वाल्व बदलकर समस्या का पूर्ण निस्तारण कर दिया गया है।',
        dept: 'जल प्रदाय शाखा',
        status: 'resolved',
      },
    ];
  } else {
    // Realistic complaints generator for any other ward clicked (e.g. Ward 20 Sandeep Singh, Ward 15 Anil Inani)
    const categories = [
      { cat: 'कचरा पात्र एवं नाली सफाई', dept: 'स्वास्थ्य एवं स्वच्छता शाखा', desc: 'मुख्य तिराहे पर कचरा जमा होने की सूचना पर स्वच्छता दल भेजकर त्वरित सफाई करवाई गई।' },
      { cat: 'स्ट्रीट लाइट मरम्मत', dept: 'विद्युत अनुभाग (स्ट्रीट लाइट)', desc: 'मोहल्ले के खंभे की लाइट बंद होने की शिकायत दर्ज हुई, नया एलईडी बल्ब लगाकर चालू किया गया।' },
      { cat: 'सड़क पेचवर्क एवं मरम्मत', dept: 'निर्माण एवं इंजीनियरिंग शाखा', desc: 'सड़क पर बने गड्ढे से आवागमन बाधित था, डामरीकरण पेचवर्क कर दुरुस्त किया गया।' },
      { cat: 'पेयजल पाइपलाइन रिसाव', dept: 'जल प्रदाय शाखा', desc: 'सड़क किनारे पाइपलाइन में रिसाव की शिकायत पर वाल्व एवं पाइप रिपेयर किया गया।' },
      { cat: 'पार्क एवं वृक्ष छंटाई', dept: 'उद्यान विकास शाखा', desc: 'विद्युत तारों को छूती पेड़ों की शाखाओं की सुरक्षित कटाई एवं छंटाई करवाई गई।' },
    ];

    const citizens = ['सुरेश मेनारिया', 'मुकेश कुमावत', 'गोपाल शर्मा', 'संजय जैन', 'सुनील खटीक', 'कैलाश गुर्जर', 'राधेश्याम तेली', 'अशोक सोनी'];
    const locations = [
      `वार्ड ${ward.num} मुख्य बाजार`,
      `वार्ड ${ward.num} न्यू कॉलोनी, गली नं. 3`,
      `वार्ड ${ward.num} राजकीय विद्यालय के पास`,
      `वार्ड ${ward.num} सामुदायिक भवन परिसर`,
      `वार्ड ${ward.num} माताजी मंदिर रोड`,
      `वार्ड ${ward.num} बस स्टैंड चौराहा`,
    ];

    const list = [];
    const totalCount = ward.total;
    const resolvedCount = ward.resolved;

    for (let i = 0; i < totalCount; i++) {
      const isResolved = i < resolvedCount;
      const catObj = categories[i % categories.length];
      const codeNum = String(1000 + ward.num * 23 + i).slice(-4);
      const day = Math.max(1, 30 - i * 2);

      list.push({
        id: `CTNP-2026-00${codeNum}`,
        category: catObj.cat,
        dept: catObj.dept,
        location: locations[i % locations.length],
        date: `${day} सितं 2026, ${10 + (i % 8)}:30 AM`,
        citizen: citizens[(ward.num + i) % citizens.length],
        citizenPhone: `98290-${String(30000 + ward.num * 100 + i).slice(0, 5)}`,
        description: catObj.desc,
        status: isResolved ? 'resolved' : 'pending',
      });
    }
    baseList = list;
  }

  // Prepend live citizen complaints if submitted via /citizen
  try {
    const live = getSharedLiveComplaints(ward.num);
    if (live && live.length > 0) {
      const liveMapped = live.map(c => ({
        id: c.code,
        category: c.category,
        location: c.location,
        date: c.date,
        citizen: c.citizenName || 'नागरिक',
        citizenPhone: c.citizenPhone || '98290-00000',
        description: c.description || 'नागरिक द्वारा दर्ज शिकायत',
        dept: c.dept || 'स्वास्थ्य एवं स्वच्छता शाखा',
        status: c.status === 'resolved' ? 'resolved' : 'pending',
        isNew: true,
      }));
      const existing = new Set(baseList.map(b => b.id));
      const fresh = liveMapped.filter(m => !existing.has(m.id));
      return [...fresh, ...baseList];
    }
  } catch (_) {}

  return baseList;
}

export default function ChairmanWardsPage() {
  const [selectedWard, setSelectedWard] = useState(null);
  const [filterParty, setFilterParty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintTab, setComplaintTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'RESOLVED'

  const filteredWards = useMemo(() => {
    return WARDS_DATA.filter(w => {
      // Leadership filters
      if (filterParty === 'CHAIRMAN' && !w.isChairman) return false;
      if (filterParty === 'VICE_CHAIRMAN' && !w.isViceChairman) return false;
      if (['भाजपा', 'कांग्रेस', 'निर्दलीय'].includes(filterParty) && w.party !== filterParty) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = String(w.num).includes(q) || `वार्ड ${w.num}`.toLowerCase().includes(q) || `ward ${w.num}`.toLowerCase().includes(q);
        const matchesName = w.councillor.toLowerCase().includes(q);
        const matchesParty = w.party.toLowerCase().includes(q);
        const matchesRes = w.reservation.toLowerCase().includes(q);
        const matchesDesig = (w.designation || '').toLowerCase().includes(q);
        return matchesNum || matchesName || matchesParty || matchesRes || matchesDesig;
      }
      return true;
    });
  }, [filterParty, searchQuery]);

  const partyCounts = useMemo(() => {
    return {
      total: WARDS_DATA.length,
      bjp: WARDS_DATA.filter(w => w.party === 'भाजपा').length,
      inc: WARDS_DATA.filter(w => w.party === 'कांग्रेस').length,
      ind: WARDS_DATA.filter(w => w.party === 'निर्दलीय').length,
    };
  }, []);

  const wardComplaints = useMemo(() => {
    if (!selectedWard) return [];
    const list = getWardComplaintsList(selectedWard);
    if (complaintTab === 'RESOLVED') return list.filter(c => c.status === 'resolved');
    if (complaintTab === 'PENDING') return list.filter(c => c.status === 'pending');
    return list;
  }, [selectedWard, complaintTab]);

  return (
    <DashboardShell requiredRole="chairman">
      {/* Page Title & Navigation */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/chairman" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस मुख्य डैशबोर्ड पर
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              समस्त 60 वार्ड — निर्वाचित पार्षद व लाइव रिपोर्ट
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              चित्तौड़गढ़ नगर परिषद के समस्त 60 वार्डों के निर्वाचित पार्षद, राजनैतिक दल एवं नागरिक शिकायत समाधान स्थिति
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-chairman" style={{ fontSize: '0.75rem' }}>
              कुल 60 वार्ड
            </span>
            <span style={{ fontSize: '0.72rem', background: '#ffedd5', color: '#c2410c', padding: '3px 8px', borderRadius: 6, fontWeight: 700, border: '1px solid #fdba74' }}>
              भाजपा {partyCounts.bjp}
            </span>
            <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: 6, fontWeight: 700, border: '1px solid #93c5fd' }}>
              कांग्रेस {partyCounts.inc}
            </span>
            <span style={{ fontSize: '0.72rem', background: '#f3e8ff', color: '#6b21a8', padding: '3px 8px', borderRadius: 6, fontWeight: 700, border: '1px solid #d8b4fe' }}>
              निर्दलीय {partyCounts.ind}
            </span>
          </div>
        </div>
      </div>

      {selectedWard ? (
        /* ============================================================ */
        /* SELECTED WARD DETAILED VIEW: COUNCILLOR + COMPLAINTS LIST    */
        /* ============================================================ */
        <div className="card" style={{ padding: '24px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
            <div>
              <button
                className="btn btn-ghost"
                onClick={() => { setSelectedWard(null); setComplaintTab('ALL'); }}
                style={{ marginBottom: 12, padding: '5px 12px', fontSize: '0.82rem' }}
              >
                ← वापस समस्त 60 वार्ड सूची पर
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: selectedWard.isChairman ? '#b45309' : selectedWard.isViceChairman ? '#1d4ed8' : '#1e3a8a',
                  background: selectedWard.isChairman ? '#fef3c7' : selectedWard.isViceChairman ? '#eff6ff' : '#f1f5f9',
                  padding: '6px 16px',
                  borderRadius: 10,
                  border: `2px solid ${selectedWard.isChairman ? '#f59e0b' : selectedWard.isViceChairman ? '#3b82f6' : '#cbd5e1'}`
                }}>
                  वार्ड {selectedWard.num}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>
                      {selectedWard.councillor}
                    </h2>
                    {selectedWard.isChairman && (
                      <span style={{ background: '#fef3c7', color: '#b45309', border: '1.5px solid #f59e0b', fontSize: '0.78rem', fontWeight: 800, padding: '3px 10px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Crown size={14} /> सभापति (CHAIRMAN)
                      </span>
                    )}
                    {selectedWard.isViceChairman && (
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1.5px solid #3b82f6', fontSize: '0.78rem', fontWeight: 800, padding: '3px 10px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Star size={14} /> उपसभापति (VICE CHAIRMAN)
                      </span>
                    )}
                    {selectedWard.num === 24 && (
                      <span style={{ background: '#ecfdf5', color: '#047857', border: '1.5px solid #6ee7b7', fontSize: '0.75rem', fontWeight: 800, padding: '2px 9px', borderRadius: 9999 }}>
                        ⭐ डेमो वार्ड (Showcase Ward)
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 9px',
                      borderRadius: 9999,
                      background: PARTY_COLORS[selectedWard.party]?.bg || '#f1f5f9',
                      color: PARTY_COLORS[selectedWard.party]?.text || '#334155',
                      border: `1px solid ${PARTY_COLORS[selectedWard.party]?.border || '#cbd5e1'}`,
                    }}>
                      दल: {selectedWard.party}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '2px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      आरक्षण: {selectedWard.reservation}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                      जीत अंतर: {selectedWard.margin} वोट (प्राप्त वोट: {selectedWard.votes})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                निकटतम प्रतिद्वंद्वी: <strong>{selectedWard.runnerUp}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 700, marginTop: 6 }}>
                <Phone size={14} style={{ display: 'inline', marginRight: 4 }} />
                पार्षद संपर्क: {selectedWard.phone}
              </div>
            </div>
          </div>

          {/* 3 Clean Complaint KPI Counters (No Safai Karmi) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <div style={{ textAlign: 'center', padding: '16px 12px', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 10 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e3a8a' }}>{selectedWard.total}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', marginTop: 2 }}>कुल नागरिक शिकायतें</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 12px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>{selectedWard.resolved}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', marginTop: 2 }}>सफलतापूर्वक निस्तारित</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px 12px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b45309' }}>{selectedWard.pending}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', marginTop: 2 }}>लंबित / प्रगति पर</div>
            </div>
          </div>

          {/* Ward Complaints List Register */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{
              background: '#f8fafc',
              padding: '12px 18px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={17} color="#1e3a8a" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  वार्ड संख्या {selectedWard.num} — दर्ज नागरिक शिकायतों की सूची
                </span>
                <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: 999, fontWeight: 700, color: '#475569' }}>
                  {wardComplaints.length} शिकायतें
                </span>
              </div>

              {/* Sub Tabs */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setComplaintTab('ALL')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    background: complaintTab === 'ALL' ? '#1e3a8a' : '#ffffff',
                    color: complaintTab === 'ALL' ? '#ffffff' : '#64748b',
                    borderColor: complaintTab === 'ALL' ? '#1e3a8a' : '#cbd5e1',
                  }}
                >
                  सभी ({selectedWard.total})
                </button>
                <button
                  onClick={() => setComplaintTab('RESOLVED')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    background: complaintTab === 'RESOLVED' ? '#16a34a' : '#ffffff',
                    color: complaintTab === 'RESOLVED' ? '#ffffff' : '#16a34a',
                    borderColor: complaintTab === 'RESOLVED' ? '#16a34a' : '#cbd5e1',
                  }}
                >
                  निस्तारित ({selectedWard.resolved})
                </button>
                <button
                  onClick={() => setComplaintTab('PENDING')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    background: complaintTab === 'PENDING' ? '#d97706' : '#ffffff',
                    color: complaintTab === 'PENDING' ? '#ffffff' : '#d97706',
                    borderColor: complaintTab === 'PENDING' ? '#d97706' : '#cbd5e1',
                  }}
                >
                  लंबित ({selectedWard.pending})
                </button>
              </div>
            </div>

            {/* Complaint Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', divideY: '1px solid #f1f5f9' }}>
              {wardComplaints.map(comp => (
                <div key={comp.id} style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', background: '#eff6ff', padding: '2px 7px', borderRadius: 4 }}>
                        {comp.id}
                      </span>
                      {comp.isNew && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', padding: '2px 6px', borderRadius: 4 }}>
                          ✨ नया नागरिक पोर्टल
                        </span>
                      )}
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                        {comp.category}
                      </strong>
                      <span style={{ fontSize: '0.72rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '1px 7px', borderRadius: 4 }}>
                        {comp.dept}
                      </span>
                    </div>

                    <div>
                      {comp.status === 'resolved' ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={12} /> सफलतापूर्वक निस्तारित
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', padding: '3px 9px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> कार्यवाही प्रगति पर / लंबित
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0 8px', lineHeight: 1.45 }}>
                    {comp.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.74rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {comp.location}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <User size={12} /> नागरिक: {comp.citizen} ({comp.citizenPhone})
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {comp.date}
                    </span>
                  </div>
                </div>
              ))}

              {wardComplaints.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748b', fontSize: '0.85rem' }}>
                  इस श्रेणी में कोई शिकायत नहीं है।
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* 60 WARDS CARDS GRID (NO SAFAI KARMI, CLEAN PERFORMANCE STATS)*/
        /* ============================================================ */
        <div className="card" style={{ padding: '20px' }}>
          {/* Controls: Search + Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
            {/* Search Box */}
            <div style={{ position: 'relative', minWidth: 260, maxWidth: 360, flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="वार्ड संख्या, पार्षद का नाम या दल खोजें..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filter Pills with Leadership Highlights */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setFilterParty('ALL')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterParty === 'ALL' ? '#1e3a8a' : '#f8fafc',
                  color: filterParty === 'ALL' ? '#ffffff' : '#475569',
                  borderColor: filterParty === 'ALL' ? '#1e3a8a' : '#cbd5e1',
                }}
              >
                सभी ({partyCounts.total})
              </button>
              <button
                onClick={() => setFilterParty('CHAIRMAN')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1.5px solid #f59e0b',
                  background: filterParty === 'CHAIRMAN' ? '#b45309' : '#fffbeb',
                  color: filterParty === 'CHAIRMAN' ? '#ffffff' : '#b45309',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title="सभापति श्री अनिल ईनाणी (वार्ड 15)"
              >
                <Crown size={13} /> सभापति (वार्ड 15)
              </button>
              <button
                onClick={() => setFilterParty('VICE_CHAIRMAN')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1.5px solid #3b82f6',
                  background: filterParty === 'VICE_CHAIRMAN' ? '#1d4ed8' : '#eff6ff',
                  color: filterParty === 'VICE_CHAIRMAN' ? '#ffffff' : '#1d4ed8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title="उपसभापति श्री सुदर्शन रामपुरिया (वार्ड 31)"
              >
                <Star size={13} /> उपसभापति (वार्ड 31)
              </button>
              <button
                onClick={() => setFilterParty('भाजपा')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterParty === 'भाजपा' ? '#ea580c' : '#ffedd5',
                  color: filterParty === 'भाजपा' ? '#ffffff' : '#c2410c',
                  borderColor: '#fdba74',
                }}
              >
                भाजपा ({partyCounts.bjp})
              </button>
              <button
                onClick={() => setFilterParty('कांग्रेस')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterParty === 'कांग्रेस' ? '#2563eb' : '#dbeafe',
                  color: filterParty === 'कांग्रेस' ? '#ffffff' : '#1e40af',
                  borderColor: '#93c5fd',
                }}
              >
                कांग्रेस ({partyCounts.inc})
              </button>
              <button
                onClick={() => setFilterParty('निर्दलीय')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterParty === 'निर्दलीय' ? '#9333ea' : '#f3e8ff',
                  color: filterParty === 'निर्दलीय' ? '#ffffff' : '#6b21a8',
                  borderColor: '#d8b4fe',
                }}
              >
                निर्दलीय ({partyCounts.ind})
              </button>
            </div>
          </div>

          {/* 60 Wards Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {filteredWards.map(w => {
              const partyStyle = PARTY_COLORS[w.party] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };

              // Determine card theme
              let cardBg = '#ffffff';
              let cardBorder = '#e2e8f0';
              let cardShadow = '0 1px 3px rgba(0,0,0,0.04)';

              if (w.isChairman) {
                cardBg = 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)';
                cardBorder = '#f59e0b';
                cardShadow = '0 3px 10px rgba(245, 158, 11, 0.18)';
              } else if (w.isViceChairman) {
                cardBg = 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)';
                cardBorder = '#3b82f6';
                cardShadow = '0 3px 10px rgba(59, 130, 246, 0.18)';
              } else if (w.num === 24) {
                cardBorder = '#10b981';
                cardBg = 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)';
              }

              return (
                <div
                  key={w.num}
                  id={`ward-card-${w.num}`}
                  onClick={() => { setSelectedWard(w); setComplaintTab('ALL'); }}
                  style={{
                    background: cardBg,
                    border: `2px solid ${cardBorder}`,
                    borderRadius: 12,
                    padding: '14px 12px',
                    cursor: 'pointer',
                    boxShadow: cardShadow,
                    transition: 'all 0.18s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '170px',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = w.isChairman ? '#b45309' : w.isViceChairman ? '#1d4ed8' : '#1e3a8a';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = w.isChairman ? '0 8px 18px rgba(245, 158, 11, 0.28)' : '0 8px 18px rgba(30,58,138,0.14)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = cardBorder;
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = cardShadow;
                  }}
                >
                  {/* Top Leadership Badge if Chairman / Vice-Chairman / Demo */}
                  {w.isChairman && (
                    <div style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      borderRadius: 6,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      marginBottom: 8,
                    }}>
                      <Crown size={12} /> सभापति (Chairman)
                    </div>
                  )}

                  {w.isViceChairman && (
                    <div style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      borderRadius: 6,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      marginBottom: 8,
                    }}>
                      <Star size={12} /> उपसभापति (Vice Chairman)
                    </div>
                  )}

                  {w.num === 24 && (
                    <div style={{
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0',
                      borderRadius: 6,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      marginBottom: 8,
                    }}>
                      ⭐ मुख्य डेमो वार्ड 24
                    </div>
                  )}

                  {/* Top Row: Ward Number + Party Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <span style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: w.isChairman ? '#b45309' : w.isViceChairman ? '#1d4ed8' : '#1e3a8a'
                      }}>
                        {w.num}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
                        वार्ड {w.num}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: partyStyle.bg,
                      color: partyStyle.text,
                      border: `1px solid ${partyStyle.border}`,
                    }}>
                      {w.party}
                    </span>
                  </div>

                  {/* Parshad (Councillor) Name */}
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.45,
                    paddingTop: 2,
                    paddingBottom: 2,
                  }}>
                    {w.councillor}
                  </div>

                  {/* Reservation Category */}
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    lineHeight: 1.4,
                    paddingBottom: 8,
                  }}>
                    {w.reservation}
                  </div>

                  {/* Clean Complaint Stats (No Safai Karmi) */}
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 8,
                    marginTop: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                      <span style={{ color: '#64748b' }}>कुल शिकायतें:</span>
                      <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{w.total}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ color: '#16a34a', fontWeight: 800 }}>✓ {w.resolved} हल</span>
                      <span style={{ color: w.pending > 0 ? '#d97706' : '#16a34a', fontWeight: 700 }}>
                        {w.pending > 0 ? `${w.pending} लंबित` : '100% पूर्ण'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              कोई वार्ड नहीं मिला। कृपया अपनी खोज बदलें।
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
