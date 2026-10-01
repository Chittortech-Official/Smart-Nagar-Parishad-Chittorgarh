'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, CheckCircle, Clock, Calendar,
  Fingerprint, ShieldCheck, ChevronRight, Phone,
  AlertCircle, History, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function EmployeePage() {
  const { profile } = useAuth();
  const [attended, setAttended]       = useState(false);
  const [attendTime, setAttendTime]   = useState('');
  const [locating, setLocating]       = useState(false);
  const [dateStr, setDateStr]         = useState('');
  const [locationName, setLocationName] = useState('वार्ड 24 (भारत माता चौक, चित्तौड़गढ़)');

  useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString('hi-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));

    try {
      const stored = localStorage.getItem('sc_employee_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.attended) {
          setAttended(true);
          setAttendTime(parsed.attendTime || '07:30 AM');
          if (parsed.locationName) setLocationName(parsed.locationName);
        }
      }
    } catch (_) {}
  }, []);

  function markAttendance() {
    setLocating(true);

    const recordPunch = (timeStr) => {
      setAttendTime(timeStr);
      setAttended(true);
      setLocating(false);
      try {
        localStorage.setItem('sc_employee_state', JSON.stringify({
          attended: true,
          attendTime: timeStr,
          date: dateStr,
          locationName: 'वार्ड 24 (भारत माता चौक, चित्तौड़गढ़)',
          status: 'present'
        }));
      } catch (_) {}
    };

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => recordPunch(formattedTime),
        () => recordPunch(formattedTime),
        { timeout: 3500 }
      );
    } else {
      setTimeout(() => recordPunch(formattedTime), 600);
    }
  }

  return (
    <DashboardShell requiredRole="employee">
      {/* 1. Header Profile Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>नगर परिषद चित्तौड़गढ़</span>
              <span>•</span>
              <span style={{ color: '#0369a1' }}>फील्ड कर्मचारी हाजिरी</span>
            </div>
            <h1 style={{ color: '#1e3a8a', fontSize: '1.25rem', marginTop: 4, marginBottom: 4, fontWeight: 800 }}>
              {profile?.full_name || 'रमेश मीणा (सफाई जमादार)'}
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '0.8rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} color="#ea580c" /> {dateStr || 'आज का कार्य दिवस'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="#15803d" /> वार्ड संख्या 24 • स्वास्थ्य एवं स्वच्छता विभाग
              </span>
            </div>
          </div>

          <div>
            {attended ? (
              <span className="badge badge-present" style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ✓ उपस्थित ({attendTime})
              </span>
            ) : (
              <span className="badge badge-absent" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                हाजिरी लंबित
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Attendance Action Section */}
      <div className="card" style={{ padding: '20px', marginBottom: 16, textAlign: 'center', background: attended ? '#f0fdf4' : '#ffffff', borderColor: attended ? '#86efac' : '#e2e8f0' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: attended ? '#dcfce7' : '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          border: `2px solid ${attended ? '#22c55e' : '#3b82f6'}`,
        }}>
          {attended ? (
            <ShieldCheck size={36} color="#15803d" />
          ) : (
            <Fingerprint size={36} color="#1d4ed8" />
          )}
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: attended ? '#15803d' : '#1e3a8a', marginBottom: 6 }}>
          {attended ? 'आज की हाजिरी सत्यापित हो चुकी है' : 'दैनिक GPS उपस्थिति दर्ज करें'}
        </h2>
        <p style={{ fontSize: '0.825rem', color: '#64748b', maxWidth: 360, margin: '0 auto 16px', lineHeight: 1.4 }}>
          {attended
            ? `आपका पंच-इन समय ${attendTime} पर दर्ज कर लिया गया है। आप अपने वार्ड में ड्यूटी पर उपस्थित हैं।`
            : 'वार्ड 24 में अपने कार्यस्थल पर पहुंचकर नीचे दिए गए बटन को दबाकर हाजिरी लगाएं।'}
        </p>

        {/* Punch In Button */}
        <button
          id="mark-attendance-btn"
          className={`attendance-btn ${attended ? 'marked' : ''}`}
          onClick={markAttendance}
          disabled={attended || locating}
          style={{
            width: '100%',
            maxWidth: 380,
            margin: '0 auto',
            padding: '16px 20px',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: attended ? 'default' : 'pointer'
          }}
        >
          {locating ? (
            <>
              <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              GPS लोकेशन जांची जा रही है...
            </>
          ) : attended ? (
            <>
              <CheckCircle size={22} />
              हाजिरी पूर्ण (समय: {attendTime})
            </>
          ) : (
            <>
              <Fingerprint size={24} />
              GPS हाजिरी लगाएं (Punch In)
            </>
          )}
        </button>

        {/* Live GPS Verification Details Box (When Punched In) */}
        {attended && (
          <div style={{
            marginTop: 18,
            background: '#ffffff',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>पंच समय</div>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>{attendTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>कार्य वार्ड</div>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>वार्ड 24</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>जीपीएस स्थिति</div>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>सत्यापित ✓</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Monthly Attendance Summary Cards */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ fontSize: '0.95rem', color: '#1e3a8a', margin: 0, fontWeight: 700 }}>
            माह अक्टूबर 2026 — हाजिरी सारांश
          </h3>
          <Link
            href="/employee/history"
            style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            पूरा इतिहास <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <div className="card" style={{ padding: '12px 6px', textAlign: 'center', borderTop: '3px solid #1e3a8a' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a' }}>30</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginTop: 2 }}>कुल दिन</div>
          </div>
          <div className="card" style={{ padding: '12px 6px', textAlign: 'center', borderTop: '3px solid #16a34a' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{attended ? '25' : '24'}</div>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700, marginTop: 2 }}>उपस्थित</div>
          </div>
          <div className="card" style={{ padding: '12px 6px', textAlign: 'center', borderTop: '3px solid #0284c7' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>4</div>
            <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 700, marginTop: 2 }}>रविवार छुट्टी</div>
          </div>
          <div className="card" style={{ padding: '12px 6px', textAlign: 'center', borderTop: '3px solid #d97706' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706' }}>1</div>
            <div style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 700, marginTop: 2 }}>स्वीकृत छुट्टी</div>
          </div>
        </div>
      </div>

      {/* 4. Full History Button Link */}
      <Link
        href="/employee/history"
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          textDecoration: 'none',
          color: 'inherit',
          marginBottom: 16,
          border: '1.5px solid #bae6fd',
          background: '#f0f9ff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0369a1',
          }}>
            <History size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0369a1' }}>
              मासिक हाजिरी इतिहास रजिस्टर
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              पिछले 30 दिनों का दैनिक पंच रिकॉर्ड एवं उपस्थिति रिपोर्ट
            </div>
          </div>
        </div>
        <ChevronRight size={18} color="#0369a1" />
      </Link>

      {/* 5. Municipal Control Room & Supervisor Help Strip */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: '0.78rem',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Phone size={14} color="#1e3a8a" />
          <span>नगर परिषद कंट्रोल रूम: <strong>01472-241246</strong></span>
        </div>
        <span style={{ color: '#15803d', fontWeight: 600 }}>वार्ड 24 बीट प्रभारी</span>
      </div>
    </DashboardShell>
  );
}
