'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, CheckCircle, Clock, Calendar,
  Fingerprint, ClipboardList, CheckSquare, ShieldCheck
} from 'lucide-react';

const MOCK_TASKS = [
  { id: 1, title: 'मुख्य बाजार सड़क झाडू व कचरा उठाव — वार्ड 24', area: 'कलेक्टर सर्किल से मुख्य बाजार', priority: 'high'   },
  { id: 2, title: 'कचरा डिपो सफाई एवं टिपर वाहन में लोडिंग',         area: 'बस स्टैंड के पास, वार्ड 24',      priority: 'high' },
  { id: 3, title: 'खुली नालियों की डी-सिल्टिंग व सफाई',           area: 'न्यू कॉलोनी गली नं. 3',         priority: 'normal' },
  { id: 4, title: 'कीटनाशक व चूना छिड़काव कार्य',                area: 'सब्जी मंडी परिसर',              priority: 'normal' },
];

const PRIORITY_COLORS = { high: '#dc2626', normal: '#d97706', low: '#64748b' };

export default function EmployeePage() {
  const { profile } = useAuth();
  const [attended, setAttended]   = useState(false);
  const [attendTime, setAttendTime] = useState('');
  const [locating, setLocating]   = useState(false);
  const [tasks, setTasks]         = useState(MOCK_TASKS.map(t => ({ ...t, done: false })));
  const now = new Date();
  const dateStr = now.toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  function markAttendance() {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      () => {
        const t = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
        setAttendTime(t);
        setAttended(true);
        setLocating(false);
      },
      () => {
        const t = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
        setAttendTime(t);
        setAttended(true);
        setLocating(false);
      }
    );
  }

  function markDone(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
  }

  const doneTasks = tasks.filter(t => t.done).length;

  return (
    <DashboardShell requiredRole="employee">
      {/* Employee Header Profile */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 'var(--space-4)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              फील्ड कर्मचारी पोर्टल • नगर परिषद चित्तौड़गढ़
            </div>
            <h2 style={{ color: '#1e3a8a', fontSize: '1.25rem', marginTop: 2, marginBottom: 4 }}>
              {profile?.full_name || 'रमेश मीणा (सफाईकर्मी)'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '0.8125rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} color="#ea580c" /> {dateStr}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="#15803d" /> वार्ड नं. 24 • स्वास्थ्य एवं स्वच्छता विभाग
              </span>
            </div>
          </div>
          {attended ? (
            <span className="badge badge-present" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
              ✓ उपस्थित — {attendTime}
            </span>
          ) : (
            <span className="badge badge-absent" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
              हाजिरी लंबित
            </span>
          )}
        </div>
      </div>

      {/* ── ATTENDANCE BUTTON ── */}
      <button
        id="mark-attendance-btn"
        className={`attendance-btn ${attended ? 'marked' : ''}`}
        onClick={markAttendance}
        disabled={attended || locating}
        style={{ marginBottom: 'var(--space-4)', padding: '18px 20px', borderRadius: 14 }}
      >
        {locating ? (
          <>
            <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
            GPS लोकेशन जांची जा रही है...
          </>
        ) : attended ? (
          <>
            <CheckCircle size={24} />
            हाजिरी दर्ज: {attendTime} (वार्ड 24)
          </>
        ) : (
          <>
            <Fingerprint size={26} />
            दैनिक GPS हाजिरी दर्ज करें (Punch In)
          </>
        )}
      </button>

      {/* Attendance Confirmation Summary */}
      {attended && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 'var(--space-4)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>समय (Time)</div>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>{attendTime}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>वार्ड (Ward)</div>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>वार्ड 24</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>स्थिति (Status)</div>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.95rem' }}>सत्यापित ✓</div>
          </div>
        </div>
      )}

      {/* ── TODAY'S TASKS ── */}
      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
            <ClipboardList size={18} color="#15803d" />
            आज के आवंटित कार्य (Today's Tasks)
          </h3>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#16a34a' }}>
            {doneTasks}/{tasks.length} पूर्ण
          </span>
        </div>

        {/* Task progress bar */}
        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, marginBottom: 16 }}>
          <div style={{ height: '100%', borderRadius: 3, background: '#16a34a', width: `${(doneTasks / tasks.length) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map(task => (
            <div
              key={task.id}
              style={{
                background: task.done ? '#f0fdf4' : '#ffffff',
                border: `1.5px solid ${task.done ? '#bbf7d0' : '#e2e8f0'}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                background: task.done ? '#dcfce7' : '#f8fafc',
                border: `1.5px solid ${task.done ? '#86efac' : '#cbd5e1'}`,
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {task.done ? (
                  <CheckSquare size={18} color="#15803d" />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[task.priority] }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: '0.875rem',
                  color: task.done ? '#64748b' : '#0f172a',
                  textDecoration: task.done ? 'line-through' : 'none',
                  lineHeight: 1.3,
                }}>
                  {task.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} color="#ea580c" /> {task.area}
                </div>
              </div>

              <button
                id={`complete-task-${task.id}`}
                className="btn btn-sm"
                onClick={() => markDone(task.id)}
                disabled={task.done || !attended}
                style={{
                  background: task.done ? '#dcfce7' : '#15803d',
                  color: task.done ? '#15803d' : '#ffffff',
                  border: task.done ? '1px solid #86efac' : 'none',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  borderRadius: 8,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {task.done ? '✓ पूर्ण' : 'पूर्ण करें'}
              </button>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {doneTasks === tasks.length && (
          <div style={{
            marginTop: 16, textAlign: 'center',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>👏</div>
            <h4 style={{ color: '#15803d', marginBottom: 2 }}>आज के सभी कार्य पूर्ण हुए!</h4>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>वार्ड 24 में आपकी सेवा सराहनीय है।</p>
          </div>
        )}

        {!attended && (
          <p style={{ textAlign: 'center', color: '#d97706', fontSize: '0.8125rem', marginTop: 12, fontWeight: 500 }}>
            ⚠️ कार्य पूर्ण मार्क करने से पहले कृपया ऊपर दिए गए बटन से हाजिरी लगाएं।
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
