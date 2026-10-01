'use client';

import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, Users, CheckCircle, Clock,
  ArrowRight, ShieldCheck, Phone, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const WARD_AREAS = [
  {
    id: 1,
    name: 'भारत माता चौक एवं मुख्य बाजार',
    type: 'व्यावसायिक क्षेत्र (Commercial Market)',
    assignedWorkers: ['रमेश मीणा (सफाई जमादार)', 'सुनील कुमार (सफाईकर्मी)'],
    workersPhone: '98290-44121',
    cleanSchedule: 'प्रातः 07:00 AM से दोपहर 02:00 PM (दैनिक 2 बार)',
    activeComplaints: 1,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 2,
    name: 'बस स्टैंड परिसर एवं मुख्य तिराहा',
    type: 'उच्च आवागमन क्षेत्र (High Transit Area)',
    assignedWorkers: ['रमेश मीणा (सफाई जमादार)', 'लखन सिंह (अनुपस्थित)'],
    workersPhone: '98290-44121',
    cleanSchedule: 'प्रातः 06:30 AM एवं सायंकाल 04:00 PM',
    activeComplaints: 1,
    status: 'टिपर वाहन मौके पर कार्यरत',
  },
  {
    id: 3,
    name: 'न्यू कॉलोनी (गली नं. 1, 2 व 3)',
    type: 'आवासीय क्षेत्र (Residential Zone)',
    assignedWorkers: ['गीता देवी (सफाईकर्मी)'],
    workersPhone: '98290-44123',
    cleanSchedule: 'प्रातः 07:30 AM से 11:30 AM',
    activeComplaints: 1,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 4,
    name: 'सब्जी मंडी चौक एवं स्टेशन रोड कॉर्नर',
    type: 'मंडी व व्यापारिक क्षेत्र (Market & Stalls)',
    assignedWorkers: ['मोहन लाल (सड़क/निर्माण श्रमिक)', 'सुनील कुमार (सफाईकर्मी)'],
    workersPhone: '98290-44124',
    cleanSchedule: 'दैनिक निरंतर सफाई व चूना छिड़काव',
    activeComplaints: 0,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 5,
    name: 'कलेक्टर सर्किल व मुख्य चौराहा मार्ग',
    type: 'प्रशासनिक व वीआईपी मार्ग (VIP Route)',
    assignedWorkers: ['प्रिया शर्मा (विद्युत सहायक)', 'रमेश मीणा (जमादार)'],
    workersPhone: '98290-44125',
    cleanSchedule: 'प्रातः 07:00 AM नियमित निरीक्षण',
    activeComplaints: 0,
    status: 'स्ट्रीट लाइट व मार्ग सत्यापित ✓',
  },
];

export default function ParshadAreasPage() {
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
              वार्ड 24 — प्रमुख क्षेत्र एवं बीट आवंटन
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              वार्ड के समस्त 5 प्रमुख क्षेत्रों की सफाई व्यवस्था, बीट कर्मचारी आवंटन व नियमित समय-सारिणी
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            5 मुख्य बीट क्षेत्र
          </span>
        </div>
      </div>

      {/* Areas Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WARD_AREAS.map(area => (
          <div
            key={area.id}
            className="card"
            style={{
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e9d5ff'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                    {area.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {area.type}
                  </div>
                </div>
              </div>

              <span style={{
                background: '#f0fdf4',
                color: '#15803d',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #bbf7d0'
              }}>
                {area.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, background: '#f8fafc', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>आवंटित फील्ड कर्मी:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {area.assignedWorkers.join(', ')}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b' }}>सफाई समय-सारिणी:</span>
                <div style={{ fontWeight: 600, color: '#1e3a8a', marginTop: 2 }}>
                  {area.cleanSchedule}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#64748b' }}>सक्रिय शिकायतें:</span>
                  <div style={{ fontWeight: 800, color: area.activeComplaints > 0 ? '#d97706' : '#16a34a', marginTop: 2 }}>
                    {area.activeComplaints} शिकायत
                  </div>
                </div>

                <a
                  href={`tel:${area.workersPhone}`}
                  className="btn btn-sm"
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Phone size={12} /> बीट कर्मी को कॉल
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
