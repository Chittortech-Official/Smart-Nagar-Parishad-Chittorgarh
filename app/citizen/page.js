'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import CitizenOnboarding from '@/components/CitizenOnboarding';
import GovLoadingScreen from '@/components/GovLoadingScreen';
import {
  getStoredCitizenProfile,
  getCitizenComplaints,
  clearStoredCitizenProfile
} from '@/lib/citizenService';
import Link from 'next/link';
import {
  FileText, ClipboardList, CheckCircle, Clock,
  Plus, ChevronRight, ArrowRight, PhoneCall,
  MapPin, Truck, UserCheck, ShieldCheck, AlertCircle,
  HelpCircle, Sparkles, CheckCircle2, User, LogOut, Phone,
  Crown, Calendar
} from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const [citizen, setCitizen] = useState(null);
  const [complaintList, setComplaintList] = useState([]);

  useEffect(() => {
    // Keep official emblem loading screen visible for at least 2.2s for authentic state presence
    const timer = setTimeout(() => {
      setMounted(true);
    }, 2200);

    const stored = getStoredCitizenProfile();
    if (stored) {
      setCitizen(stored);
      getCitizenComplaints(stored.phone).then(list => setComplaintList(list));
    }

    return () => clearTimeout(timer);
  }, []);

  function handleOnboardSuccess(profile) {
    setCitizen(profile);
    getCitizenComplaints(profile.phone).then(list => setComplaintList(list));
  }

  function handleSwitchProfile() {
    if (confirm('क्या आप प्रोफाइल बदलना या लॉगआउट करना चाहते हैं?')) {
      clearStoredCitizenProfile();
      setCitizen(null);
      setComplaintList([]);
    }
  }

  if (!mounted) {
    return (
      <DashboardShell requiredRole="citizen" hideBottomNav={true}>
        <GovLoadingScreen message="नागरिक पोर्टल लोड हो रहा है..." />
      </DashboardShell>
    );
  }

  // If no citizen profile exists, render Zero-OTP Onboarding Form
  if (!citizen) {
    return (
      <DashboardShell requiredRole="citizen" hideBottomNav={true} guestMode={true} currentProfile={null}>
        <CitizenOnboarding onComplete={handleOnboardSuccess} />
      </DashboardShell>
    );
  }

  const total = complaintList.length;
  const inProgress = complaintList.filter(c => ['in_progress', 'submitted', 'assigned', 'reopened'].includes(c.status)).length;
  const resolved = complaintList.filter(c => ['resolved', 'closed'].includes(c.status)).length;
  const reopened = complaintList.filter(c => c.status === 'reopened').length;

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
              नमस्ते, {citizen.name} जी! 👋
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
              मोबाइल: <strong>{citizen.phone}</strong> {citizen.mohalla ? `• ${citizen.mohalla}` : ''}
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
              <span>वार्ड संख्या {citizen.ward} (चित्तौड़गढ़)</span>
            </div>

            <Link
              href="/citizen/report"
              className="btn btn-primary hide-mobile"
              style={{ padding: '8px 16px', fontSize: '0.825rem', gap: 6 }}
            >
              <Plus size={16} /> नई समस्या दर्ज करें
            </Link>

            <button
              type="button"
              onClick={handleSwitchProfile}
              className="btn btn-sm btn-outline"
              title="प्रोफाइल बदलें"
              style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#64748b' }}
            >
              <LogOut size={13} /> बदलें
            </button>
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
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>खुली / लंबित</div>
        </Link>
        <Link href="/citizen/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #16a34a', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{resolved}</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>निस्तारित</div>
        </Link>
        <Link href="/citizen/complaints" className="card" style={{ padding: '14px 10px', textAlign: 'center', borderTop: '4px solid #dc2626', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 82 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{reopened}</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: 4 }}>पुनः खुली</div>
        </Link>
      </div>

      {/* 2.5 Sabhapati Meeting / Appointment Booking Card */}
      <Link
        href="/citizen/appointment"
        id="sabhapati-appointment-btn"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          textDecoration: 'none',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(30, 58, 138, 0.22)',
          marginBottom: 16,
          border: '1.5px solid #f59e0b',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
          }}>
            <Crown size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                सभापति जी से व्यक्तिगत भेंट / जनसुनवाई
              </span>
              <span style={{ fontSize: '0.68rem', background: '#f59e0b', color: '#78350f', padding: '1px 6px', borderRadius: 4, fontWeight: 900 }}>
                ई-अपॉइंटमेंट
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: 2 }}>
              सभापति श्री अनिल जी ईनाणी के समक्ष व्यक्तिगत प्रकरण प्रस्तुत करने हेतु टोकन लें
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}>
          अनुरोध करें <ChevronRight size={14} />
        </div>
      </Link>

      {/* 3. Main Action Touch Cards */}
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
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>स्थिति ट्रैक करें ({total})</div>
          </div>
        </Link>
      </div>

      {/* 4. Responsive 2-Column Grid */}
      <div className="citizen-grid-layout">
        {/* LEFT COLUMN: Live Tracker & Complaints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {total === 0 ? (
            /* Clean Civic Empty State */
            <div className="card" style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{
                width: 60, height: 60,
                background: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 800, margin: '0 0 6px' }}>
                वर्तमान में आपकी कोई शिकायत दर्ज नहीं है
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
                वार्ड संख्या {citizen.ward} में सफाई, स्ट्रीट लाइट, सड़क, पेयजल अथवा किसी भी नगरपालिका समस्या के समाधान हेतु पहली शिकायत दर्ज करें।
              </p>
              <Link
                href="/citizen/report"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontSize: '0.9rem' }}
              >
                <Plus size={18} /> पहली नागरिक समस्या दर्ज करें
              </Link>
            </div>
          ) : (
            <>
              {activeComplaint && (
                <div className="card" style={{ padding: '16px 18px', borderLeft: '4px solid #b45309' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={16} color="#b45309" />
                      <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.85rem' }}>सक्रिय समस्या (Active Issue)</span>
                    </div>
                    <span className="complaint-code">{activeComplaint.code}</span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e3a8a', marginBottom: 4 }}>
                    {activeComplaint.category}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 12px 0' }}>
                    स्थान: {activeComplaint.location || `वार्ड ${citizen.ward}`} • {activeComplaint.dept}
                  </p>

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
                      <span style={{ fontWeight: 700, color: '#b45309', marginRight: 6 }}>स्थिति:</span>
                      <span style={{ fontSize: '0.825rem', color: '#78350f', fontWeight: 600 }}>
                        {activeComplaint.statusDetail || 'प्रक्रियाधीन'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                      समय: {activeComplaint.sla || '24-48 घंटे'}
                    </span>
                  </div>
                </div>
              )}

              {/* Recent Complaints List */}
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f5f9', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>आपकी दर्ज शिकायतें</h3>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>वार्ड संख्या {citizen.ward}</span>
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
            </>
          )}
        </div>

        {/* RIGHT COLUMN (Civic Desk) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ward Local Representatives Card */}
          <div className="card" style={{ padding: '16px 18px', background: '#fcfcfd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
              <MapPin size={18} color="#7c3aed" />
              <h3 style={{ fontSize: '0.92rem', color: '#1e3a8a', margin: 0, fontWeight: 700 }}>
                वार्ड {citizen.ward} स्थानीय सेवा केंद्र
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>वार्ड पार्षद</div>
                  <strong style={{ color: '#0f172a' }}>
                    {citizen.ward === '24' ? 'श्रीमती कुसुम (भाजपा)' : `पार्षद प्रतिनिधि (वार्ड ${citizen.ward})`}
                  </strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#f3e8ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  पार्षद
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>वार्ड स्वच्छता बीट प्रभारी</div>
                  <strong style={{ color: '#0f172a' }}>रमेश मीणा</strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                  उपस्थित ✓
                </span>
              </div>
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
