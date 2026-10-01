'use client';

import DashboardShell from '@/components/DashboardShell';
import { Building2, ArrowLeft, Users, CheckCircle, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

const DEPARTMENTS = [
  {
    id: 'dept-sanitation',
    name: 'स्वास्थ्य एवं स्वच्छता विभाग (Sanitation & Health)',
    officer: 'श्री सुरेश शर्मा (मुख्य स्वास्थ्य निरीक्षक)',
    phone: '01472-241246 Ext. 101',
    totalComplaints: 98,
    resolved: 72,
    pending: 26,
    staffCount: 184,
    presentToday: 168,
    slaCompliance: 86,
    color: '#16a34a',
  },
  {
    id: 'dept-engineering',
    name: 'निर्माण एवं सड़क अनुभाग (Engineering & Roads)',
    officer: 'श्री मोहन लाल खटीक (अधिशासी अभियंता)',
    phone: '01472-241246 Ext. 102',
    totalComplaints: 64,
    resolved: 38,
    pending: 26,
    staffCount: 42,
    presentToday: 39,
    slaCompliance: 74,
    color: '#2563eb',
  },
  {
    id: 'dept-water',
    name: 'जल प्रदाय शाखा (Water Supply & Drainage)',
    officer: 'श्री राजेंद्र जोशी (सहायक अभियंता जल)',
    phone: '01472-241246 Ext. 103',
    totalComplaints: 42,
    resolved: 28,
    pending: 14,
    staffCount: 36,
    presentToday: 34,
    slaCompliance: 81,
    color: '#0284c7',
  },
  {
    id: 'dept-electrical',
    name: 'विद्युत एवं प्रकाश व्यवस्था (Street Lighting & Electrical)',
    officer: 'श्री मुकेश टेलर (कनिष्ठ अभियंता विद्युत)',
    phone: '01472-241246 Ext. 104',
    totalComplaints: 28,
    resolved: 21,
    pending: 7,
    staffCount: 28,
    presentToday: 26,
    slaCompliance: 92,
    color: '#d97706',
  },
  {
    id: 'dept-parks',
    name: 'उद्यान एवं पर्यावरण विकास (Parks & Greenery)',
    officer: 'श्री श्याम सुंदर (उद्यान अधीक्षक)',
    phone: '01472-241246 Ext. 105',
    totalComplaints: 15,
    resolved: 9,
    pending: 6,
    staffCount: 22,
    presentToday: 20,
    slaCompliance: 78,
    color: '#65a30d',
  },
];

export default function ChairmanDepartmentsPage() {
  return (
    <DashboardShell requiredRole="chairman">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link href="/chairman" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          <ArrowLeft size={16} /> वापस मुख्य डैशबोर्ड पर
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2 }}>
              नगर परिषद चित्तौड़गढ़ — नगरपालिका विभाग प्रबंधन
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              सभी 5 नगरपालिका विभागों की कार्य निष्पादन रिपोर्ट, स्टाफ उपस्थिति व निस्तारण दर
            </p>
          </div>
          <span className="badge badge-chairman" style={{ fontSize: '0.75rem' }}>
            5 प्रशासनिक विभाग
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {DEPARTMENTS.map(dept => {
          const rate = Math.round((dept.resolved / dept.totalComplaints) * 100);
          return (
            <div key={dept.id} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${dept.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={24} color={dept.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', margin: 0 }}>{dept.name}</h2>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                      प्रभारी अधिकारी: <strong>{dept.officer}</strong> • संपर्क: {dept.phone}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: dept.color }}>{rate}%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>समाधान दर</div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, marginBottom: 14 }}>
                <div style={{ height: '100%', width: `${rate}%`, background: dept.color, borderRadius: 3 }} />
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, background: '#f8fafc', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>कुल शिकायतें</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{dept.totalComplaints}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>निस्तारित</div>
                  <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>{dept.resolved}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#d97706' }}>कार्यवाही लंबित</div>
                  <div style={{ fontWeight: 800, color: '#d97706', fontSize: '1.1rem' }}>{dept.pending}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>फील्ड कर्मचारी</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{dept.presentToday}/{dept.staffCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#1e3a8a' }}>SLA अनुपालन दर</div>
                  <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '1.1rem' }}>{dept.slaCompliance}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
