'use client';

import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import { useAuth } from '@/lib/authContext';
import {
  BarChart3, CheckCircle, Clock, AlertTriangle,
  Award, TrendingUp, Calendar, FileText, Download
} from 'lucide-react';

export default function ParshadReportPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="parshad">
      {/* 5-Tab Navigation Bar */}
      <ParshadNavTabs />

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड 24 — मासिक प्रगति एवं स्वच्छता रिपोर्ट
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              माह अक्टूबर 2026 • समस्या निस्तारण दर, सफाई कर्मचारी उपस्थिति एवं वार्ड प्रदर्शन
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('मासिक वार्ड प्रगति रिपोर्ट पीडीएफ डाउनलोड की जा रही है...')}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.8rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={15} /> रिपोर्ट डाउनलोड (PDF)
          </button>
        </div>
      </div>

      {/* Overview Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: '16px', borderTop: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>निस्तारण दर (Resolution Rate)</span>
            <Award size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: 6 }}>
            82.4%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: 4, fontWeight: 600 }}>
            ↑ पिछले माह से 4% सुधार
          </div>
        </div>

        <div className="card" style={{ padding: '16px', borderTop: '4px solid #1e3a8a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>औसत समाधान समय</span>
            <Clock size={18} color="#1e3a8a" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', marginTop: 6 }}>
            18.5 घंटे
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
            लक्ष्य सीमा: 24 घंटे के भीतर
          </div>
        </div>

        <div className="card" style={{ padding: '16px', borderTop: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>कर्मचारी उपस्थिति दर</span>
            <TrendingUp size={18} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', marginTop: 6 }}>
            94.2%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>
            नियमित जीपीएस बायो-पंचिंग
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card" style={{ padding: '18px' }}>
        <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, marginBottom: 12 }}>
          शाखावार समस्या निस्तारण स्थिति (अक्टूबर 2026)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px 12px' }}>नगरपालिका शाखा</th>
                <th style={{ padding: '10px 12px' }}>कुल शिकायतें</th>
                <th style={{ padding: '10px 12px' }}>समाधान पूर्ण</th>
                <th style={{ padding: '10px 12px' }}>प्रगति पर</th>
                <th style={{ padding: '10px 12px' }}>संतुष्टि दर</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>🧹 स्वास्थ्य एवं स्वच्छता शाखा</td>
                <td style={{ padding: '10px 12px', fontWeight: 800 }}>18</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>14</td>
                <td style={{ padding: '10px 12px', color: '#d97706', fontWeight: 700 }}>4</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 800 }}>92%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>🛣️ निर्माण एवं इंजीनियरिंग शाखा</td>
                <td style={{ padding: '10px 12px', fontWeight: 800 }}>6</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>3</td>
                <td style={{ padding: '10px 12px', color: '#d97706', fontWeight: 700 }}>3</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 800 }}>80%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>💡 विद्युत अनुभाग (स्ट्रीट लाइट)</td>
                <td style={{ padding: '10px 12px', fontWeight: 800 }}>5</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>4</td>
                <td style={{ padding: '10px 12px', color: '#d97706', fontWeight: 700 }}>1</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 800 }}>88%</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>🚰 जल प्रदाय शाखा</td>
                <td style={{ padding: '10px 12px', fontWeight: 800 }}>3</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>2</td>
                <td style={{ padding: '10px 12px', color: '#d97706', fontWeight: 700 }}>1</td>
                <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 800 }}>85%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
