'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints } from '@/lib/citizenService';
import {
  MapPin, ArrowLeft, Filter, Search,
  ChevronRight, Image, Phone, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const WARD_COMPLAINTS = [];

export default function ParshadComplaintsPage() {
  const { profile } = useAuth();
  const [allComplaints, setAllComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    function refreshComplaints() {
      const live = getSharedLiveComplaints(24) || [];
      const formatted = live.map(c => ({
        id: c.id || c.code,
        code: c.code,
        category: c.category,
        status: c.status || 'submitted',
        location: c.location,
        date: c.date,
        citizen: c.citizenName || 'राजेश कुमार शर्मा',
        citizenPhone: c.citizenPhone || '98290-12345',
        description: c.description || 'नागरिक द्वारा दर्ज शिकायत',
        photo: !!c.hasPhoto,
        dept: c.dept,
        employee: 'कार्य आवंटन प्रक्रियाधीन',
        routedBy: 'नागरिक पोर्टल द्वारा स्वतः रूटेड',
        isNew: true,
      }));
      setAllComplaints(formatted);
    }
    refreshComplaints();
    window.addEventListener('storage', refreshComplaints);
    return () => window.removeEventListener('storage', refreshComplaints);
  }, []);

  const filtered = allComplaints.filter(c => {
    if (filter === 'open' && !['submitted', 'assigned', 'in_progress', 'reopened'].includes(c.status)) return false;
    if (filter === 'resolved' && !['resolved', 'closed'].includes(c.status)) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.code.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <DashboardShell requiredRole="parshad">
      {/* Parshad 5-Tab Navigation Bar */}
      <ParshadNavTabs />

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड 24 — समस्त नागरिक शिकायतें ({allComplaints.length})
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              किसी भी शिकायत पर क्लिक करके उसका पूरा विवरण, फोटो प्रमाण व रूटिंग स्थिति देखें
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            वार्ड 24
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            सभी ({allComplaints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`btn btn-sm ${filter === 'open' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            लंबित / प्रगति पर ({allComplaints.filter(c => ['submitted', 'assigned', 'in_progress', 'reopened'].includes(c.status)).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`btn btn-sm ${filter === 'resolved' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            निस्तारित ({allComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 200, flex: '1 1 200px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="शिकायत खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 30px',
              fontSize: '0.8rem',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box'
            }}
          />
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: 9, top: 10 }} />
        </div>
      </div>

      {/* Complaints List with Direct Links */}
      <div className="card" style={{ padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            borderRadius: 12,
            padding: '32px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🌿</div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#16a34a', marginBottom: 4 }}>
              वार्ड 24 में कोई लंबित शिकायत नहीं है (All Clear)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              नागरिक ई-सेवा पोर्टल से जैसे ही वार्ड 24 की नई समस्या दर्ज होगी, वह यहाँ तुरंत प्रदर्शित होगी।
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(c => (
              <Link
                key={c.id}
                href={`/parshad/complaints/${c.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    border: c.isNew ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 16px',
                    background: c.isNew ? '#fffbeb' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    boxShadow: c.isNew ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.isNew ? '#f59e0b' : '#e2e8f0'; e.currentTarget.style.background = c.isNew ? '#fffbeb' : '#ffffff'; }}
                >
                  {/* Top Row: Token + Category + Photo Badge + Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 800, background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                        {c.code}
                      </span>
                      <strong style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem' }}>
                        {c.category}
                      </strong>
                      {c.isNew && (
                        <span style={{
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}>
                          ✨ अभी-अभी दर्ज (New)
                        </span>
                      )}
                      {c.photo && (
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}>
                          📷 फोटो संलग्न
                        </span>
                      )}
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                {/* Description Quote */}
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '8px 12px', borderRadius: 8, borderLeft: '3px solid #cbd5e1' }}>
                  &ldquo;{c.description}&rdquo;
                </div>

                {/* Bottom Row: Location + Citizen + Date + Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flexWrap: 'wrap',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 8,
                  fontSize: '0.78rem',
                  color: '#64748b'
                }}>
                  <div>
                    📍 {c.location} • नागरिक: <strong style={{ color: '#334155' }}>{c.citizen}</strong> • {c.date}
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.8rem' }}>
                    पूरा विवरण <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </DashboardShell>
  );
}
