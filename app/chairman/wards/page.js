'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { MapPin, ArrowLeft, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const WARDS_DATA = Array.from({ length: 60 }, (_, i) => {
  const baseTotal = ((i * 7 + 11) % 15) + 5;
  const baseResolved = Math.min(baseTotal - 1, Math.max(1, ((i * 5 + 3) % 11) + 2));
  const empTotal = ((i * 3 + 2) % 4) + 4;
  const empPresent = Math.max(empTotal - 1, empTotal - (i % 5 === 0 ? 1 : 0));
  return {
    num: i + 1,
    name: `वार्ड संख्या ${i + 1}`,
    councillor: `पार्षद प्रतिनिधि वार्ड ${i + 1}`,
    total: baseTotal,
    resolved: baseResolved,
    employees: empTotal,
    present: empPresent,
    overdue: (i === 7 || i === 14 || i === 31 || i === 44) ? 1 : 0,
  };
});

export default function ChairmanWardsPage() {
  const [selectedWard, setSelectedWard] = useState(null);

  return (
    <DashboardShell requiredRole="chairman">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/chairman" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस मुख्य डैशबोर्ड पर
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2 }}>
              समस्त 60 वार्ड — लाइव स्थिति एवं रिपोर्ट
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              चित्तौड़गढ़ नगर परिषद के सभी 60 वार्डों की सफाई, कर्मचारी व समस्या समाधान स्थिति
            </p>
          </div>
          <span className="badge badge-chairman" style={{ fontSize: '0.75rem' }}>
            कुल 60 वार्ड
          </span>
        </div>
      </div>

      {selectedWard ? (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button className="btn btn-ghost" onClick={() => setSelectedWard(null)}>← वापस 60 वार्ड सूची पर</button>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e3a8a' }}>
              {selectedWard.name} ({selectedWard.councillor})
            </h2>
            {selectedWard.overdue > 0 && (
              <span className="badge badge-overdue">⚠️ अवधि पार शिकायत मौजूद</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {[
              ['कुल नागरिक शिकायतें', selectedWard.total, '#2563eb'],
              ['सफलतापूर्वक निस्तारित', selectedWard.resolved, '#16a34a'],
              ['लंबित कार्यवाही', selectedWard.total - selectedWard.resolved, '#d97706'],
              ['तैनात सफाईकर्मी', selectedWard.employees, '#7c3aed'],
              ['आज उपस्थित', selectedWard.present, '#16a34a'],
              ['आज अनुपस्थित', selectedWard.employees - selectedWard.present, '#dc2626'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ textAlign: 'center', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
            किसी भी वार्ड कार्ड पर क्लिक करके उसकी विस्तृत कर्मचारी और नागरिक रिपोर्ट देखें:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {WARDS_DATA.map(w => (
              <div
                key={w.num}
                onClick={() => setSelectedWard(w)}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${w.overdue > 0 ? '#fca5a5' : '#e2e8f0'}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1e3a8a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = w.overdue > 0 ? '#fca5a5' : '#e2e8f0'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: w.overdue > 0 ? '#dc2626' : '#1e3a8a' }}>
                  {w.num}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>वार्ड {w.num}</div>
                <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, marginTop: 3 }}>
                  {w.resolved}/{w.total} हल
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 1 }}>
                  कर्मचारी: {w.present}/{w.employees}
                </div>
                {w.overdue > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 700, marginTop: 3, background: '#fee2e2', borderRadius: 4, padding: '1px 4px' }}>
                    ⚠️ अवधि पार
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
