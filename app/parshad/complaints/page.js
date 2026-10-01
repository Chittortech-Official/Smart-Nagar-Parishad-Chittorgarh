'use client';

import { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, ArrowLeft, Filter, Search,
  ChevronRight, Image, Phone
} from 'lucide-react';
import Link from 'next/link';

const WARD_COMPLAINTS = [
  {
    id: 1,
    code: 'CTNP-2026-000125',
    category: 'कचरा सफाई (Garbage Clearance)',
    status: 'in_progress',
    location: 'बस स्टैंड के पास, वार्ड 24',
    date: '01 अक्टू 2026, 09:30 AM',
    citizen: 'राजेश कुमार',
    citizenPhone: '98290-54321',
    description: 'बस स्टैंड के मुख्य तिराहे पर कचरा पात्र ओवरफ्लो हो रहा है एवं आवारा पशु जमा हैं। कृपया तत्काल सफाई करवाई जाए।',
    photo: true,
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा (सफाई जमादार)',
    routedBy: 'कंट्रोल रूम राउटर द्वारा स्वास्थ्य शाखा को प्रेषित',
  },
  {
    id: 2,
    code: 'CTNP-2026-000118',
    category: 'सड़क गड्ढा मरम्मत (Road Pothole)',
    status: 'assigned',
    location: 'मुख्य बाजार सड़क, निकट क्लॉक टावर',
    date: '30 सितं 2026, 04:15 PM',
    citizen: 'महेश सोनी',
    citizenPhone: '98290-67890',
    description: 'मुख्य बाजार की सड़क पर गहरा गड्ढा हो गया है, रात्रि में दुपहिया वाहन चालकों के गिरने का खतरा है।',
    photo: true,
    dept: 'निर्माण एवं इंजीनियरिंग शाखा',
    employee: 'सुनील कुमार (निर्माण सहायक)',
    routedBy: 'कंट्रोल रूम राउटर द्वारा निर्माण शाखा को प्रेषित',
  },
  {
    id: 3,
    code: 'CTNP-2026-000109',
    category: 'स्ट्रीट लाइट बंद (Street Light)',
    status: 'submitted',
    location: 'न्यू कॉलोनी, गली नं. 2',
    date: '29 सितं 2026, 08:00 PM',
    citizen: 'सुनीता देवी',
    citizenPhone: '98290-33445',
    description: 'गली नं. 2 के खंभा संख्या 08 की एलईडी लाइट विगत तीन दिवस से बंद है, पूरा मोहल्ला अंधेरे में है।',
    photo: false,
    dept: 'विद्युत अनुभाग',
    employee: 'विद्युत टीम (आवंटन प्रक्रियाधीन)',
    routedBy: 'नया पंजीकरण — कंट्रोल रूम रूटिंग लंबित',
  },
  {
    id: 4,
    code: 'CTNP-2026-000098',
    category: 'नाली अवरुद्ध / जलभराव (Drainage)',
    status: 'reopened',
    location: 'प्राथमिक विद्यालय पास',
    date: '28 सितं 2026, 11:20 AM',
    citizen: 'दिनेश कुमावत',
    citizenPhone: '98290-88776',
    description: 'नाली में कचरा फंसने से गंदा पानी सड़क पर बह रहा है। विद्यालय के बच्चों को निकलने में कठिनाई है।',
    photo: true,
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा (सफाई जमादार)',
    routedBy: 'पुनः खुली — प्राथमिक स्तर पर जांच जारी',
  },
  {
    id: 5,
    code: 'CTNP-2026-000085',
    category: 'पेयजल लीकेज (Water Pipeline)',
    status: 'resolved',
    location: 'चौराहा प्याऊ के पास',
    date: '25 सितं 2026, 03:00 PM',
    citizen: 'सुरेश कुमावत',
    citizenPhone: '98290-11223',
    description: 'प्याऊ के पास पाइपलाइन में मुख्य जोड़ पर लीकेज हो रहा था, जिससे पानी बह रहा था।',
    photo: true,
    dept: 'जल प्रदाय शाखा',
    employee: 'दिनेश शर्मा (जल प्रदाय प्रभारी)',
    routedBy: 'जल प्रदाय शाखा द्वारा निस्तारित',
  },
  {
    id: 6,
    code: 'CTNP-2026-000072',
    category: 'सफाई व्यवस्था (Area Sanitation)',
    status: 'closed',
    location: 'सब्जी मंडी चौक',
    date: '20 सितं 2026, 08:30 AM',
    citizen: 'अशोक जैन',
    citizenPhone: '98290-99887',
    description: 'सब्जी मंडी के पीछे कचरे के ढेर का नियमित उठाव नहीं हो रहा था। टीम द्वारा सम्पूर्ण सफाई पूर्ण।',
    photo: true,
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'गीता देवी (सफाईकर्मी)',
    routedBy: 'सत्यापित एवं समाधान पूर्ण',
  },
];

export default function ParshadComplaintsPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = WARD_COMPLAINTS.filter(c => {
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
              वार्ड 24 — समस्त नागरिक शिकायतें (32)
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
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            सभी (All)
          </button>
          <button
            type="button"
            onClick={() => setFilter('open')}
            className={`btn btn-sm ${filter === 'open' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            लंबित / प्रगति पर (4)
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`btn btn-sm ${filter === 'resolved' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '6px 14px' }}
          >
            निस्तारित (2)
          </button>
        </div>

        <div style={{ position: 'relative', width: 240 }}>
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
              border: '1px solid #cbd5e1'
            }}
          />
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: 9, top: 10 }} />
        </div>
      </div>

      {/* Complaints List with Direct Links */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => (
            <Link
              key={c.id}
              href={`/parshad/complaints/${c.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '14px 16px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 800 }}>
                      {c.code}
                    </span>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                      {c.category}
                    </span>
                    {c.photo && (
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                      }}>
                        📷 फोटो संलग्न
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                    "{c.description}"
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    📍 {c.location} • नागरिक: <strong>{c.citizen}</strong> • {c.date}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={c.status} />
                  <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                    पूरा विवरण <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
