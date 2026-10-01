'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  Calendar, CheckCircle, Clock, MapPin, ArrowLeft,
  CalendarDays, Check
} from 'lucide-react';
import Link from 'next/link';

// Full 30 days of the month (Clear, realistic municipal sanitation worker record)
const FULL_MONTH_DAYS = [
  { id: 1,  date: '1 अक्टूबर 2026',  day: 'गुरुवार (आज)', time: '07:30 AM', status: 'present',  ward: 'वार्ड 24 (भारत माता चौक)' },
  { id: 2,  date: '30 सितंबर 2026', day: 'बुधवार',       time: '07:28 AM', status: 'present',  ward: 'वार्ड 24 (कलेक्टर सर्किल)' },
  { id: 3,  date: '29 सितंबर 2026', day: 'मंगलवार',      time: '07:42 AM', status: 'present',  ward: 'वार्ड 24 (न्यू कॉलोनी)' },
  { id: 4,  date: '28 सितंबर 2026', day: 'सोमवार',       time: '07:35 AM', status: 'present',  ward: 'वार्ड 24 (मुख्य बाजार)' },
  { id: 5,  date: '27 सितंबर 2026', day: 'रविवार',        time: '—',        status: 'holiday',  ward: '—' },
  { id: 6,  date: '26 सितंबर 2026', day: 'शनिवार',       time: '07:31 AM', status: 'present',  ward: 'वार्ड 24 (भारत माता चौक)' },
  { id: 7,  date: '25 सितंबर 2026', day: 'शुक्रवार',      time: '07:40 AM', status: 'present',  ward: 'वार्ड 24 (बस स्टैंड रोड)' },
  { id: 8,  date: '24 सितंबर 2026', day: 'गुरुवार',      time: '07:29 AM', status: 'present',  ward: 'वार्ड 24 (सब्जी मंडी)' },
  { id: 9,  date: '23 सितंबर 2026', day: 'बुधवार',       time: '07:44 AM', status: 'present',  ward: 'वार्ड 24 (गली नं. 3)' },
  { id: 10, date: '22 सितंबर 2026', day: 'मंगलवार',     time: '07:38 AM', status: 'present',  ward: 'वार्ड 24 (कलेक्टर सर्किल)' },
  { id: 11, date: '21 सितंबर 2026', day: 'सोमवार',      time: '—',        status: 'leave',    ward: '—' },
  { id: 12, date: '20 सितंबर 2026', day: 'रविवार',       time: '—',        status: 'holiday',  ward: '—' },
  { id: 13, date: '19 सितंबर 2026', day: 'शनिवार',      time: '07:34 AM', status: 'present',  ward: 'वार्ड 24 (भारत माता चौक)' },
  { id: 14, date: '18 सितंबर 2026', day: 'शुक्रवार',     time: '07:30 AM', status: 'present',  ward: 'वार्ड 24 (मुख्य बाजार)' },
  { id: 15, date: '17 सितंबर 2026', day: 'गुरुवार',      time: '07:26 AM', status: 'present',  ward: 'वार्ड 24 (न्यू कॉलोनी)' },
  { id: 16, date: '16 सितंबर 2026', day: 'बुधवार',       time: '07:45 AM', status: 'present',  ward: 'वार्ड 24 (बस स्टैंड)' },
  { id: 17, date: '15 सितंबर 2026', day: 'मंगलवार',     time: '07:33 AM', status: 'present',  ward: 'वार्ड 24 (सब्जी मंडी)' },
  { id: 18, date: '14 सितंबर 2026', day: 'सोमवार',       time: '07:39 AM', status: 'present',  ward: 'वार्ड 24 (भारत माता चौक)' },
  { id: 19, date: '13 सितंबर 2026', day: 'रविवार',       time: '—',        status: 'holiday',  ward: '—' },
  { id: 20, date: '12 सितंबर 2026', day: 'शनिवार',      time: '07:28 AM', status: 'present',  ward: 'वार्ड 24 (कलेक्टर सर्किल)' },
  { id: 21, date: '11 सितंबर 2026', day: 'शुक्रवार',     time: '07:41 AM', status: 'present',  ward: 'वार्ड 24 (मुख्य बाजार)' },
  { id: 22, date: '10 सितंबर 2026', day: 'गुरुवार',      time: '07:30 AM', status: 'present',  ward: 'वार्ड 24 (गली नं. 3)' },
  { id: 23, date: '09 सितंबर 2026', day: 'बुधवार',       time: '07:36 AM', status: 'present',  ward: 'वार्ड 24 (सब्जी मंडी)' },
  { id: 24, date: '08 सितंबर 2026', day: 'मंगलवार',     time: '07:32 AM', status: 'present',  ward: 'वार्ड 24 (बस स्टैंड)' },
  { id: 25, date: '07 सितंबर 2026', day: 'सोमवार',       time: '07:40 AM', status: 'present',  ward: 'वार्ड 24 (न्यू कॉलोनी)' },
  { id: 26, date: '06 सितंबर 2026', day: 'रविवार',       time: '—',        status: 'holiday',  ward: '—' },
  { id: 27, date: '05 सितंबर 2026', day: 'शनिवार',      time: '07:27 AM', status: 'present',  ward: 'वार्ड 24 (भारत माता चौक)' },
  { id: 28, date: '04 सितंबर 2026', day: 'शुक्रवार',     time: '07:35 AM', status: 'present',  ward: 'वार्ड 24 (कलेक्टर सर्किल)' },
  { id: 29, date: '03 सितंबर 2026', day: 'गुरुवार',      time: '07:30 AM', status: 'present',  ward: 'वार्ड 24 (मुख्य बाजार)' },
  { id: 30, date: '02 सितंबर 2026', day: 'बुधवार',       time: '07:29 AM', status: 'present',  ward: 'वार्ड 24 (सब्जी मंडी)' },
];

export default function EmployeeHistoryPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [records, setRecords] = useState(FULL_MONTH_DAYS);

  // Sync today's real punch if employee punched in today
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sc_employee_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.attended && parsed.attendTime) {
          setRecords(prev => prev.map((item, idx) => {
            if (idx === 0) {
              return {
                ...item,
                time: parsed.attendTime,
                status: 'present',
              };
            }
            return item;
          }));
        }
      }
    } catch (_) {}
  }, []);

  const totalCount = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const holidayCount = records.filter(r => r.status === 'holiday').length;
  const leaveCount = records.filter(r => r.status === 'leave').length;

  const filteredRecords = records.filter(item => {
    if (filter === 'present') return item.status === 'present';
    if (filter === 'holiday') return item.status === 'holiday';
    if (filter === 'leave')   return item.status === 'leave';
    return true;
  });

  return (
    <DashboardShell requiredRole="employee">
      {/* 1. Header with Clean Back Navigation */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/employee"
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
          <ArrowLeft size={16} /> वापस हाजिरी पंच पर
        </Link>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            नगर परिषद चित्तौड़गढ़ • सफाई कर्मचारी रजिस्टर
          </div>
          <h1 style={{ fontSize: '1.25rem', color: '#1e3a8a', marginTop: 2, marginBottom: 4, fontWeight: 800 }}>
            माह की कुल हाजिरी
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {profile?.full_name || 'रमेश मीणा (सफाई जमादार)'} • वार्ड संख्या 24
          </div>
        </div>
      </div>

      {/* 2. Simple, Worker-Friendly Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        <div
          className="card"
          onClick={() => setFilter('all')}
          style={{
            padding: '12px 6px',
            textAlign: 'center',
            borderTop: filter === 'all' ? '3px solid #1e3a8a' : '2px solid #cbd5e1',
            background: filter === 'all' ? '#eff6ff' : '#ffffff',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{totalCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: 4 }}>कुल दिन</div>
        </div>

        <div
          className="card"
          onClick={() => setFilter('present')}
          style={{
            padding: '12px 6px',
            textAlign: 'center',
            borderTop: filter === 'present' ? '3px solid #16a34a' : '2px solid #cbd5e1',
            background: filter === 'present' ? '#f0fdf4' : '#ffffff',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{presentCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>उपस्थित</div>
        </div>

        <div
          className="card"
          onClick={() => setFilter('holiday')}
          style={{
            padding: '12px 6px',
            textAlign: 'center',
            borderTop: filter === 'holiday' ? '3px solid #0284c7' : '2px solid #cbd5e1',
            background: filter === 'holiday' ? '#f0f9ff' : '#ffffff',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7', lineHeight: 1 }}>{holidayCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>रविवार छुट्टी</div>
        </div>

        <div
          className="card"
          onClick={() => setFilter('leave')}
          style={{
            padding: '12px 6px',
            textAlign: 'center',
            borderTop: filter === 'leave' ? '3px solid #d97706' : '2px solid #cbd5e1',
            background: filter === 'leave' ? '#fffbeb' : '#ffffff',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{leaveCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, marginTop: 4 }}>स्वीकृत छुट्टी</div>
        </div>
      </div>

      {/* 3. Simple Date-Wise Attendance List */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: '0.98rem', color: '#1e3a8a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarDays size={18} color="#15803d" />
            तारीखवार हाजिरी विवरण
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredRecords.map(item => {
            const isPresent = item.status === 'present';
            const isHoliday = item.status === 'holiday';
            const isLeave   = item.status === 'leave';

            return (
              <div
                key={item.id}
                style={{
                  background: isPresent ? '#ffffff' : (isHoliday ? '#f8fafc' : '#fffbeb'),
                  border: `1.5px solid ${isPresent ? '#e2e8f0' : (isHoliday ? '#e2e8f0' : '#fde68a')}`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                      {item.date}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ({item.day})
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {isPresent ? (
                      <>
                        <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> समय: {item.time}
                        </span>
                        <span>•</span>
                        <span style={{ color: '#64748b' }}>{item.ward}</span>
                      </>
                    ) : isHoliday ? (
                      <span style={{ color: '#64748b' }}>साप्ताहिक अवकाश (रविवार)</span>
                    ) : (
                      <span style={{ color: '#b45309', fontWeight: 600 }}>स्वीकृत आकस्मिक अवकाश</span>
                    )}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isPresent && (
                    <span className="badge badge-present" style={{ fontSize: '0.75rem', padding: '5px 12px', fontWeight: 700 }}>
                      ✓ उपस्थित
                    </span>
                  )}
                  {isHoliday && (
                    <span style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid #cbd5e1'
                    }}>
                      रविवार
                    </span>
                  )}
                  {isLeave && (
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid #fde68a'
                    }}>
                      छुट्टी
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
