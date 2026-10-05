'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import { useAuth } from '@/lib/authContext';
import {
  Users, Phone, ArrowLeft, CheckCircle2,
  Calendar, Clock, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import Link from 'next/link';

const EMPLOYEES = [
  {
    id: 1,
    name: 'रमेश मीणा',
    role: 'वरिष्ठ स्वच्छता कर्मी (जमादार)',
    phone: '98290-44121',
    status: 'present',
    punchTime: '07:30 AM',
    attendance: { total: 30, present: 25, holiday: 4, leave: 1, absent: 0 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'present', time: '07:30 AM' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:28 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:42 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'present', time: '07:35 AM' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
  {
    id: 2,
    name: 'सुनील कुमार',
    role: 'स्वच्छता कर्मी',
    phone: '98290-44122',
    status: 'present',
    punchTime: '07:25 AM',
    attendance: { total: 30, present: 26, holiday: 4, leave: 0, absent: 0 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'present', time: '07:25 AM' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:30 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:20 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'present', time: '07:34 AM' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
  {
    id: 3,
    name: 'गीता देवी',
    role: 'स्वच्छता कर्मी',
    phone: '98290-44123',
    status: 'present',
    punchTime: '07:40 AM',
    attendance: { total: 30, present: 24, holiday: 4, leave: 2, absent: 0 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'present', time: '07:40 AM' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:45 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:38 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'leave', time: 'स्वीकृत अवकाश' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
  {
    id: 4,
    name: 'मोहन लाल',
    role: 'निर्माण एवं सड़क श्रमिक',
    phone: '98290-44124',
    status: 'present',
    punchTime: '07:35 AM',
    attendance: { total: 30, present: 25, holiday: 4, leave: 1, absent: 0 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'present', time: '07:35 AM' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:30 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:40 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'present', time: '07:32 AM' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
  {
    id: 5,
    name: 'प्रिया शर्मा',
    role: 'विद्युत लाइनमैन सहायक',
    phone: '98290-44125',
    status: 'present',
    punchTime: '07:38 AM',
    attendance: { total: 30, present: 26, holiday: 4, leave: 0, absent: 0 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'present', time: '07:38 AM' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:35 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:40 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'present', time: '07:36 AM' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
  {
    id: 6,
    name: 'लखन सिंह',
    role: 'स्वच्छता कर्मी',
    phone: '98290-44126',
    status: 'absent',
    punchTime: '—',
    attendance: { total: 30, present: 21, holiday: 4, leave: 2, absent: 3 },
    recentLog: [
      { date: '1 अक्टू 2026', day: 'गुरुवार', status: 'absent', time: 'अनुपस्थित' },
      { date: '30 सितं 2026', day: 'बुधवार', status: 'present', time: '07:35 AM' },
      { date: '29 सितं 2026', day: 'मंगलवार', status: 'present', time: '07:40 AM' },
      { date: '28 सितं 2026', day: 'सोमवार', status: 'absent', time: 'अनुपस्थित' },
      { date: '27 सितं 2026', day: 'रविवार', status: 'holiday', time: 'साप्ताहिक अवकाश' },
    ]
  },
];

export default function ParshadEmployeesPage() {
  const { profile } = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  const presentCount = EMPLOYEES.filter(e => e.status === 'present').length;
  const absentCount = EMPLOYEES.filter(e => e.status === 'absent').length;

  return (
    <DashboardShell requiredRole="parshad">
      <ParshadNavTabs />
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/parshad"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#1e3a8a',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: 8,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} /> वापस वार्ड ओवरव्यू
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड 24 — फील्ड कर्मचारी दल
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              पार्षद: {profile?.full_name || 'श्रीमती कुसुम (भाजपा)'} • कुल {EMPLOYEES.length} फील्ड कर्मचारी
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-present" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {presentCount} उपस्थित
            </span>
            <span className="badge badge-absent" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {absentCount} अनुपस्थित
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EMPLOYEES.map(emp => {
            const isSelected = selectedId === emp.id;
            return (
              <div
                key={emp.id}
                style={{
                  border: isSelected ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  background: '#ffffff',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                }}>
                  {/* Top Row: Avatar + Name/Role + Attendance Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: emp.status === 'present' ? '#dcfce7' : '#fee2e2',
                        border: `1.5px solid ${emp.status === 'present' ? '#86efac' : '#fca5a5'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: emp.status === 'present' ? '#15803d' : '#dc2626',
                        flexShrink: 0,
                      }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.2 }}>
                          {emp.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                          {emp.role}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`badge ${emp.status === 'present' ? 'badge-present' : 'badge-absent'}`}
                      style={{ fontSize: '0.74rem', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 9999 }}
                    >
                      {emp.status === 'present' ? `✓ उपस्थित (${emp.punchTime})` : '✗ अनुपस्थित'}
                    </span>
                  </div>

                  {/* Bottom Row: Call Button + Toggle Attendance */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 8,
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 8,
                  }}>
                    <a
                      href={`tel:${emp.phone}`}
                      style={{
                        background: '#15803d',
                        color: '#ffffff',
                        padding: '7px 8px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        borderRadius: 8,
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <Phone size={12} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.phone}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedId(isSelected ? null : emp.id)}
                      className="btn btn-sm btn-outline"
                      style={{
                        padding: '7px 8px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isSelected ? 'हाजिरी बंद ▴' : 'हाजिरी ▾'}
                      </span>
                    </button>
                  </div>
                </div>

                {isSelected && (
                  <div style={{ padding: '14px 16px', borderTop: '1px solid #bbf7d0', background: '#f8fafc' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 8 }}>
                      {emp.name} — इस माह की कुल हाजिरी:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: 8, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '1.1rem' }}>{emp.attendance.total}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>कुल दिन</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: 8, textAlign: 'center', border: '1px solid #86efac' }}>
                        <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>{emp.attendance.present}</div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>उपस्थित</div>
                      </div>
                      <div style={{ background: '#eff6ff', padding: '8px', borderRadius: 8, textAlign: 'center', border: '1px solid #bfdbfe' }}>
                        <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.1rem' }}>{emp.attendance.holiday}</div>
                        <div style={{ fontSize: '0.68rem', color: '#0284c7' }}>रविवार</div>
                      </div>
                      <div style={{ background: '#fef2f2', padding: '8px', borderRadius: 8, textAlign: 'center', border: '1px solid #fecaca' }}>
                        <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '1.1rem' }}>{emp.attendance.absent}</div>
                        <div style={{ fontSize: '0.68rem', color: '#dc2626' }}>अनुपस्थित</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      हालिया 5 दिनों की उपस्थिति:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {emp.recentLog.map((log, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: '#ffffff',
                            borderRadius: 6,
                            border: '1px solid #f1f5f9',
                            fontSize: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={12} color="#ea580c" />
                            <strong>{log.date}</strong> ({log.day})
                          </div>
                          <div>
                            {log.status === 'present' && (
                              <span style={{ color: '#15803d', fontWeight: 700 }}>
                                ✓ उपस्थित ({log.time})
                              </span>
                            )}
                            {log.status === 'holiday' && (
                              <span style={{ color: '#64748b' }}>{log.time}</span>
                            )}
                            {log.status === 'leave' && (
                              <span style={{ color: '#b45309' }}>{log.time}</span>
                            )}
                            {log.status === 'absent' && (
                              <span style={{ color: '#dc2626', fontWeight: 700 }}>✗ अनुपस्थित</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
