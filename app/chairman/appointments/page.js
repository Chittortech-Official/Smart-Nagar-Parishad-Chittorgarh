'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import {
  getAppointments,
  fetchAppointmentsFromCloud,
  subscribeToAppointments,
  updateAppointmentStatus,
  getChairmanTourStatus,
  setChairmanTourStatus,
} from '@/lib/appointmentService';
import {
  Calendar, Clock, Phone, MapPin, Building,
  AlertCircle, CheckCircle2, ChevronLeft, ArrowRight,
  Shield, Sparkles, Filter, Search, User, MessageCircle,
  PhoneCall, RefreshCw, Send, Check, Plane, X, AlertTriangle
} from 'lucide-react';

export default function ChairmanAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isOnTour, setIsOnTour] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'RESCHEDULED' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');

  // Modal State for Slot Approval / Rescheduling
  const [activeModal, setActiveModal] = useState(null); // { type: 'slot' | 'reschedule' | 'forward', item: appointment }
  const [slotTimeInput, setSlotTimeInput] = useState('11:30 AM');
  const [rescheduleReasonInput, setRescheduleReasonInput] = useState('सभापति जी राजकीय बैठक में व्यस्त हैं');
  const [officerForwardInput, setOfficerForwardInput] = useState('नगर परिषद आयुक्त (RAS)');

  useEffect(() => {
    setAppointments(getAppointments());
    setIsOnTour(getChairmanTourStatus());

    let isMounted = true;
    fetchAppointmentsFromCloud().then(list => {
      if (isMounted) setAppointments(list);
    });

    const unsubscribe = subscribeToAppointments(list => {
      if (isMounted) setAppointments(list);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  function handleTourToggle() {
    const nextState = !isOnTour;
    setIsOnTour(nextState);
    setChairmanTourStatus(nextState);
  }

  // Bulk reschedule today's appointments if Sabhapati goes on official tour
  function handleBulkTourReschedule() {
    if (confirm('क्या आप आज के समस्त लंबित व स्वीकृत अपॉइंटमेंट को आगामी कार्यदिवस हेतु रीशेड्यूल करना चाहते हैं?')) {
      const updated = appointments.map(a => {
        if (['pending', 'approved'].includes(a.status)) {
          return {
            ...a,
            status: 'rescheduled',
            rescheduleReason: 'सभापति जी राजकीय प्रवास / टूर पर हैं (Rescheduled by Secretariat)',
            slotTime: 'आगामी कार्यदिवस',
          };
        }
        return a;
      });
      setAppointments(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sc_sabhapati_appointments', JSON.stringify(updated));
      }
    }
  }

  async function handleApproveSlot(tokenCode) {
    const updated = await updateAppointmentStatus(tokenCode, {
      status: 'approved',
      slotTime: slotTimeInput,
      officerNotes: `सचिवालय द्वारा बैठक समय ${slotTimeInput} निश्चित किया गया।`,
    });
    setAppointments(getAppointments());
    setActiveModal(null);
  }

  async function handleRescheduleSubmit(tokenCode) {
    const updated = await updateAppointmentStatus(tokenCode, {
      status: 'rescheduled',
      rescheduleReason: rescheduleReasonInput,
      slotTime: 'आगामी कार्यदिवस',
      officerNotes: `रीशेड्यूल: ${rescheduleReasonInput}`,
    });
    setAppointments(getAppointments());
    setActiveModal(null);
  }

  async function handleMarkComplete(tokenCode) {
    await updateAppointmentStatus(tokenCode, {
      status: 'completed',
      officerNotes: 'सभापति कक्ष में व्यक्तिगत जनसुनवाई पूर्ण। आवश्यक निर्देश जारी किए गए।',
    });
    setAppointments(getAppointments());
  }

  // Filtered List
  const filteredList = useMemo(() => {
    return appointments.filter(a => {
      // Tab filter
      if (activeTab === 'PENDING' && a.status !== 'pending') return false;
      if (activeTab === 'APPROVED' && a.status !== 'approved') return false;
      if (activeTab === 'RESCHEDULED' && a.status !== 'rescheduled') return false;
      if (activeTab === 'COMPLETED' && a.status !== 'completed') return false;

      // Urgency filter
      if (selectedUrgency !== 'ALL' && a.urgency !== selectedUrgency) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = a.fullName.toLowerCase().includes(q);
        const matchesToken = (a.tokenCode || '').toLowerCase().includes(q);
        const matchesWard = String(a.wardNumber).includes(q) || `वार्ड ${a.wardNumber}`.toLowerCase().includes(q);
        const matchesPhone = (a.phonePrimary || '').includes(q) || (a.phoneSecondary || '').includes(q);
        const matchesDept = (a.department || '').toLowerCase().includes(q);
        return matchesName || matchesToken || matchesWard || matchesPhone || matchesDept;
      }

      return true;
    });
  }, [appointments, activeTab, selectedUrgency, searchQuery]);

  // Metric counts
  const stats = useMemo(() => {
    return {
      total: appointments.length,
      approved: appointments.filter(a => a.status === 'approved').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      urgent: appointments.filter(a => a.urgency === 'urgent').length,
      rescheduled: appointments.filter(a => a.status === 'rescheduled').length,
    };
  }, [appointments]);

  return (
    <DashboardShell requiredRole="chairman">
      <div style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: '60px' }}>
        
        {/* Top Header & Tour Status Toggle */}
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/chairman"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#1e3a8a',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 10,
            }}
          >
            <ChevronLeft size={16} /> वापस मुख्य प्रशासनिक डैशबोर्ड पर
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '18px 22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                  सभापति विशेषाधिकार प्रकोष्ठ
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  नगर परिषद चित्तौड़गढ़ • जनसुनवाई व्यवस्था
                </span>
              </div>
              <h1 style={{ fontSize: '1.45rem', color: '#1e3a8a', fontWeight: 900, margin: '0 0 4px 0' }}>
                सभापति मुलाकात अनुरोध एवं ई-जनता दरबार
              </h1>
              <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
                सभापति: <strong>श्री अनिल जी ईनाणी</strong> • नागरिकों से व्यक्तिगत भेंट, 2 फोन नंबर समन्वय व समय आवंटन
              </p>
            </div>

            {/* Chairman Availability Switcher (Office vs Tour) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 6,
            }}>
              <div style={{
                background: isOnTour ? '#fef2f2' : '#f0fdf4',
                border: isOnTour ? '1.5px solid #fca5a5' : '1.5px solid #86efac',
                borderRadius: 12,
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>सभापति उपस्थिति स्थिति:</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isOnTour ? '#b91c1c' : '#15803d' }}>
                    {isOnTour ? '✈️ राजकीय प्रवास / टूर पर (जयपुर)' : '🟢 कार्यालय में उपस्थित (जनसुनवाई चालू)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTourToggle}
                  style={{
                    background: isOnTour ? '#dc2626' : '#1e3a8a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {isOnTour ? 'कार्यालय उपस्थिति दर्ज करें' : 'टूर पर मार्क करें'}
                </button>
              </div>

              {isOnTour && (
                <button
                  type="button"
                  onClick={handleBulkTourReschedule}
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <RefreshCw size={12} /> आज के सभी अनुरोध आगामी तिथि पर रीशेड्यूल करें
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
          <div className="card" style={{ padding: '14px', textAlign: 'center', borderTop: '4px solid #1e3a8a' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e3a8a' }}>{stats.total}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: 2 }}>कुल प्राप्त अनुरोध</div>
          </div>
          <div className="card" style={{ padding: '14px', textAlign: 'center', borderTop: '4px solid #16a34a' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>{stats.approved}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', marginTop: 2 }}>स्वीकृत / आज भेंट</div>
          </div>
          <div className="card" style={{ padding: '14px', textAlign: 'center', borderTop: '4px solid #dc2626' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626' }}>{stats.urgent}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c', marginTop: 2 }}>अति आवश्यक प्रकरण</div>
          </div>
          <div className="card" style={{ padding: '14px', textAlign: 'center', borderTop: '4px solid #d97706' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706' }}>{stats.pending}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', marginTop: 2 }}>सचिवालय समीक्षा लंबित</div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `सभी (${stats.total})` },
              { id: 'PENDING', label: `लंबित (${stats.pending})` },
              { id: 'APPROVED', label: `स्वीकृत (${stats.approved})` },
              { id: 'RESCHEDULED', label: `रीशेड्यूल (${stats.rescheduled})` },
              { id: 'COMPLETED', label: 'सम्पन्न' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: activeTab === tab.id ? '#1e3a8a' : '#f8fafc',
                  color: activeTab === tab.id ? '#ffffff' : '#475569',
                  borderColor: activeTab === tab.id ? '#1e3a8a' : '#cbd5e1',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="नाम, टोकन या फोन से खोजें..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Appointment Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredList.map(apt => (
            <div
              key={apt.tokenCode}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${apt.urgency === 'urgent' ? '#dc2626' : apt.status === 'approved' ? '#16a34a' : '#1e3a8a'}`,
                borderRadius: 14,
                padding: '18px 20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Top Row: Token + Citizen Name + Urgency Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: '0.86rem',
                    color: '#1e3a8a',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    {apt.tokenCode}
                  </span>

                  <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                    {apt.fullName} {apt.communitySurname ? <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>({apt.communitySurname})</span> : ''}
                  </strong>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: '#e0f2fe',
                    color: '#0369a1',
                    border: '1px solid #bae6fd',
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}>
                    वार्ड संख्या {apt.wardNumber}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {apt.urgency === 'urgent' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '3px 9px', borderRadius: 9999 }}>
                      🔴 अति आवश्यक
                    </span>
                  )}
                  {apt.urgency === 'normal' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '3px 9px', borderRadius: 9999 }}>
                      🟡 सामान्य
                    </span>
                  )}
                  {apt.urgency === 'courtesy' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 9px', borderRadius: 9999 }}>
                      🟢 सौजन्य भेंट
                    </span>
                  )}

                  {apt.status === 'approved' && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', padding: '3px 10px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> समय: {apt.slotTime || 'स्वीकृत'}
                    </span>
                  )}
                  {apt.status === 'pending' && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: 9999 }}>
                      समीक्षा लंबित
                    </span>
                  )}
                  {apt.status === 'rescheduled' && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 9999 }}>
                      रीशेड्यूल किया गया
                    </span>
                  )}
                  {apt.status === 'completed' && (
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: 9999 }}>
                      ✓ भेंट सम्पन्न
                    </span>
                  )}
                </div>
              </div>

              {/* Subject Description */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 10, border: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, color: '#1e3a8a' }}>मुलाकात का विषय:</span> {apt.subject}
              </div>

              {/* Coordinator Two Phone Numbers Section + Department & Date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, fontSize: '0.78rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Building size={14} color="#7c3aed" /> {apt.department}
                  </span>
                  <span>•</span>
                  <span>
                    अपेक्षित: <strong>{apt.preferredDate}</strong> ({apt.preferredWindow === 'morning' ? 'प्रातः' : 'दोपहर'})
                  </span>
                </div>

                {/* Direct Calling & WhatsApp Actions for Both Numbers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: '#0369a1' }}>सचिवालय संपर्क:</span>
                  <a
                    href={`tel:${apt.phonePrimary}`}
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      color: '#15803d',
                      borderRadius: 6,
                      padding: '4px 8px',
                      textDecoration: 'none',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    title="मुख्य फोन नंबर पर कॉल करें"
                  >
                    <PhoneCall size={12} /> {apt.phonePrimary} (1)
                  </a>

                  <a
                    href={`https://wa.me/91${apt.phoneSecondary}?text=Namaste%20${encodeURIComponent(apt.fullName)}%20ji,%20Nagar%20Parishad%20Chittorgarh%20Sabhapati%20Secretariat%20regarding%20Token%20${apt.tokenCode}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #93c5fd',
                      color: '#1e40af',
                      borderRadius: 6,
                      padding: '4px 8px',
                      textDecoration: 'none',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    title="वैकल्पिक / WhatsApp नंबर"
                  >
                    <MessageCircle size={12} /> {apt.phoneSecondary} (2)
                  </a>
                </div>
              </div>


              {/* Action Buttons for Chairman & Secretariat */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                {apt.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal({ type: 'slot', item: apt });
                      setSlotTimeInput('11:30 AM');
                    }}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={13} /> समय स्लॉट दें (Approve Slot)
                  </button>
                )}

                {apt.status !== 'rescheduled' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal({ type: 'reschedule', item: apt });
                      setRescheduleReasonInput('सभापति जी राजकीय बैठक में व्यस्त हैं');
                    }}
                    style={{
                      background: '#f8fafc',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <RefreshCw size={13} /> दिनांक बदलें (Reschedule)
                  </button>
                )}

                {apt.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleMarkComplete(apt.tokenCode)}
                    style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ✓ भेंट सम्पन्न
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', color: '#64748b' }}>
              इस श्रेणी में कोई अपॉइंटमेंट अनुरोध नहीं मिला।
            </div>
          )}
        </div>

        {/* MODAL POPUP: SLOT APPROVAL & TIME PICKER */}
        {activeModal && activeModal.type === 'slot' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '24px',
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 800 }}>
                  समय स्लॉट निश्चित करें (Assign Slot)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 14 }}>
                नागरिक: <strong>{activeModal.item.fullName}</strong> ({activeModal.item.tokenCode})
              </p>

              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                सभापति कक्ष में उपस्थित होने का समय चुनें:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {['11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:30 PM', '03:30 PM'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSlotTimeInput(time)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: slotTimeInput === time ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: slotTimeInput === time ? '#dcfce7' : '#f8fafc',
                      color: slotTimeInput === time ? '#15803d' : '#334155',
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveSlot(activeModal.item.tokenCode)}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', background: '#16a34a' }}
                >
                  स्लॉट सुरक्षित करें
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL POPUP: RESCHEDULE */}
        {activeModal && activeModal.type === 'reschedule' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '24px',
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#b45309', fontWeight: 800 }}>
                  अपॉइंटमेंट रीशेड्यूल करें
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 14 }}>
                नागरिक <strong>{activeModal.item.fullName}</strong> के दोनों नंबरों ({activeModal.item.phonePrimary}, {activeModal.item.phoneSecondary}) पर संपर्क हेतु कारण दर्ज करें:
              </p>

              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                रीशेड्यूल का कारण:
              </label>
              <select
                value={rescheduleReasonInput}
                onChange={e => setRescheduleReasonInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.85rem',
                  marginBottom: 16,
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="सभापति जी राजकीय बैठक में व्यस्त हैं">सभापति जी राजकीय बैठक में व्यस्त हैं</option>
                <option value="सभापति जी राज्य स्तरीय प्रवास (जयपुर) पर हैं">सभापति जी राज्य स्तरीय प्रवास (जयपुर) पर हैं</option>
                <option value="संबंधित वार्ड पार्षद व तकनीकी अधिकारी की अनुपस्थिति">संबंधित वार्ड पार्षद व तकनीकी अधिकारी की अनुपस्थिति</option>
                <option value="प्रशासनिक कारणों से आगामी तिथि नियत की गई">प्रशासनिक कारणों से आगामी तिथि नियत की गई</option>
              </select>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => handleRescheduleSubmit(activeModal.item.tokenCode)}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', background: '#d97706' }}
                >
                  रीशेड्यूल दर्ज करें
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
