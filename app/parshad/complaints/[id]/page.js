'use client';

import { use, useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints } from '@/lib/citizenService';
import {
  ArrowLeft, MapPin, Phone, Calendar,
  Clock, Image, Send, ShieldCheck, CheckCircle2,
  AlertTriangle, User, Building2, CheckSquare
} from 'lucide-react';
import Link from 'next/link';

const ALL_COMPLAINTS_DATA = {
  '1': {
    id: 1,
    code: 'CTNP-2026-000125',
    category: 'कचरा सफाई (Garbage Clearance)',
    status: 'in_progress',
    ward: 'वार्ड 24',
    location: 'बस स्टैंड के पास, मुख्य सड़क तिराहा',
    date: '01 अक्टू 2026, 09:30 AM',
    citizen: 'राजेश कुमार',
    citizenPhone: '98290-54321',
    description: 'बस स्टैंड के मुख्य तिराहे पर कचरा पात्र ओवरफ्लो हो रहा है एवं आवारा पशु जमा हैं। दुकानदारों व राहगीरों को भारी परेशानी हो रही है। कृपया तत्काल कचरा उठवाकर चूना छिड़काव करवाया जाए।',
    photo: true,
    photoLabel: 'कचरा डिपो ओवरफ्लो — लाइव साइट फोटो',
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा (सफाई जमादार)',
    employeePhone: '98290-44121',
    routedBy: 'कंट्रोल रूम राउटर द्वारा प्रेषित (01 अक्टू, 09:45 AM)',
    priority: 'उच्च प्राथमिकता (High)',
  },
  '2': {
    id: 2,
    code: 'CTNP-2026-000118',
    category: 'सड़क गड्ढा मरम्मत (Road Pothole)',
    status: 'assigned',
    ward: 'वार्ड 24',
    location: 'मुख्य बाजार सड़क, निकट क्लॉक टावर',
    date: '30 सितं 2026, 04:15 PM',
    citizen: 'महेश सोनी',
    citizenPhone: '98290-67890',
    description: 'मुख्य बाजार की सड़क पर बारिश के बाद गहरा गड्ढा हो गया है, रात्रि में दुपहिया वाहन चालकों के गिरने की दुर्घटनाएं हो रही हैं। डामरीकरण व पैचवर्क आवश्यक है।',
    photo: true,
    photoLabel: 'सड़क डामर उखड़ने का फोटो प्रमाण',
    dept: 'निर्माण एवं इंजीनियरिंग शाखा',
    employee: 'सुनील कुमार (निर्माण सहायक)',
    employeePhone: '98290-44122',
    routedBy: 'कंट्रोल रूम राउटर द्वारा प्रेषित (30 सितं, 04:30 PM)',
    priority: 'मध्यम प्राथमिकता',
  },
  '3': {
    id: 3,
    code: 'CTNP-2026-000109',
    category: 'स्ट्रीट लाइट बंद (Street Light)',
    status: 'submitted',
    ward: 'वार्ड 24',
    location: 'न्यू कॉलोनी, गली नं. 2, खंभा नं. 08',
    date: '29 सितं 2026, 08:00 PM',
    citizen: 'सुनीता देवी',
    citizenPhone: '98290-33445',
    description: 'गली नं. 2 के खंभा संख्या 08 की एलईडी लाइट विगत तीन दिवस से बंद है, पूरा मोहल्ला अंधेरे में है। रात्रि में सुरक्षा की समस्या हो रही है।',
    photo: false,
    photoLabel: 'फोटो उपलब्ध नहीं',
    dept: 'विद्युत अनुभाग',
    employee: 'विद्युत लाइनमैन टीम (आवंटन प्रक्रियाधीन)',
    employeePhone: '01472-241246',
    routedBy: 'कंट्रोल रूम द्वारा विद्युत शाखा को प्रेषण प्रक्रियाधीन',
    priority: 'सामान्य',
  },
  '4': {
    id: 4,
    code: 'CTNP-2026-000098',
    category: 'नाली अवरुद्ध / जलभराव (Drainage)',
    status: 'reopened',
    ward: 'वार्ड 24',
    location: 'प्राथमिक विद्यालय के पास, वार्ड 24',
    date: '28 सितं 2026, 11:20 AM',
    citizen: 'दिनेश कुमावत',
    citizenPhone: '98290-88776',
    description: 'नाली में प्लास्टिक कचरा फंसने से गंदा पानी सड़क पर बह रहा है। विद्यालय के बच्चों को निकलने में कठिनाई है। पूर्व में सफाई की सूचना दी गई थी परंतु समाधान असंतोषजनक रहा, अतः पुनः खुली।',
    photo: true,
    photoLabel: 'नाली अवरुद्ध स्थल फोटो प्रमाण',
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'रमेश मीणा (सफाई जमादार)',
    employeePhone: '98290-44121',
    routedBy: 'पुनः खुली — प्राथमिक स्तर पर मौका निरीक्षण जारी',
    priority: 'अति-आवश्यक (Urgent)',
  },
  '5': {
    id: 5,
    code: 'CTNP-2026-000085',
    category: 'पेयजल लीकेज (Water Pipeline)',
    status: 'resolved',
    ward: 'वार्ड 24',
    location: 'चौराहा प्याऊ के पास, वार्ड 24',
    date: '25 सितं 2026, 03:00 PM',
    citizen: 'सुरेश कुमावत',
    citizenPhone: '98290-11223',
    description: 'प्याऊ के पास पाइपलाइन में मुख्य जोड़ पर लीकेज हो रहा था, जिससे हजारों लीटर पेयजल बह रहा था। टीम द्वारा वाल्व व पाइप ठीक कर दिया गया।',
    photo: true,
    photoLabel: 'समाधान पश्चात लीकेज बंद फोटो',
    dept: 'जल प्रदाय शाखा',
    employee: 'दिनेश शर्मा (जल प्रदाय प्रभारी)',
    employeePhone: '98290-44127',
    routedBy: 'जल प्रदाय शाखा द्वारा निस्तारित एवं सत्यापित',
    priority: 'निस्तारित',
  },
  '6': {
    id: 6,
    code: 'CTNP-2026-000072',
    category: 'सफाई व्यवस्था (Area Sanitation)',
    status: 'closed',
    ward: 'वार्ड 24',
    location: 'सब्जी मंडी चौक, वार्ड 24',
    date: '20 सितं 2026, 08:30 AM',
    citizen: 'अशोक जैन',
    citizenPhone: '98290-99887',
    description: 'सब्जी मंडी के पीछे कचरे के ढेर का नियमित उठाव नहीं हो रहा था। टीम द्वारा सम्पूर्ण सफाई करवा दी गई।',
    photo: true,
    photoLabel: 'सफाई पूर्ण फोटो प्रमाण',
    dept: 'स्वास्थ्य एवं स्वच्छता शाखा',
    employee: 'गीता देवी (सफाईकर्मी)',
    employeePhone: '98290-44123',
    routedBy: 'सत्यापित एवं समाधान पूर्ण',
    priority: 'समाधान पूर्ण',
  },
};

export default function ParshadComplaintDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id || '1';
  const [complaint, setComplaint] = useState(ALL_COMPLAINTS_DATA[id] || ALL_COMPLAINTS_DATA['1']);

  useEffect(() => {
    const liveList = getSharedLiveComplaints();
    const liveMatch = liveList.find(item => String(item.id) === String(id) || item.code === id);
    if (liveMatch) {
      setComplaint({
        id: liveMatch.id,
        code: liveMatch.code,
        category: liveMatch.category,
        status: liveMatch.status || 'submitted',
        ward: liveMatch.ward || 'वार्ड 24',
        location: liveMatch.location || 'वार्ड 24, चित्तौड़गढ़',
        date: liveMatch.date || 'आज',
        citizen: liveMatch.citizenName || 'राजेश कुमार शर्मा',
        citizenPhone: liveMatch.citizenPhone || '98290-12345',
        description: liveMatch.description || 'नागरिक द्वारा प्रस्तुत वार्ड समस्या का विवरण।',
        photo: !!liveMatch.hasPhoto,
        photoLabel: 'नागरिक द्वारा प्रेषित समस्या प्रमाण फोटो',
        dept: liveMatch.dept || 'स्वास्थ्य एवं स्वच्छता शाखा',
        employee: 'कार्य आवंटन प्रक्रियाधीन (संबंधित शाखा)',
        employeePhone: '181 (कंट्रोल रूम)',
        routedBy: 'नागरिक ई-सेवा पोर्टल द्वारा स्वतः विभागीय रूटिंग',
        priority: 'उच्च प्राथमिकता (✨ अभी-अभी दर्ज)',
        isLive: true,
      });
    } else if (ALL_COMPLAINTS_DATA[id]) {
      setComplaint(ALL_COMPLAINTS_DATA[id]);
    }
  }, [id]);

  const c = complaint;

  return (
    <DashboardShell requiredRole="parshad">
      {/* Parshad 5-Tab Navigation Bar */}
      <ParshadNavTabs />

      {/* Back Button & Dossier Title */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/parshad/complaints"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#1e3a8a',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: 10,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} /> वापस समस्त वार्ड शिकायतें
        </Link>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '16px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 800, color: '#1e3a8a' }}>
                {c.code}
              </span>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {c.ward}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '4px 0', fontWeight: 800 }}>
              {c.category}
            </h1>
            <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
              दर्ज समय: {c.date} • प्राथमिकता: <strong>{c.priority}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={c.status} />
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Details & Photo) + Right Column (Citizen & Staff Actions) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Left Column: Complaint Text & Photo Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Citizen Description Card */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              नागरिक द्वारा दर्ज समस्या विवरण:
            </div>
            <div style={{
              background: '#f8fafc',
              borderLeft: '4px solid #3b82f6',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: '0.9rem',
              color: '#0f172a',
              lineHeight: 1.6,
            }}>
              "{c.description}"
            </div>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem', color: '#475569' }}>
              <MapPin size={16} color="#ea580c" />
              <span><strong>घटना स्थल:</strong> {c.location}</span>
            </div>
          </div>

          {/* Site Photo Card */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              मौका मुआयना — फोटो प्रमाण:
            </div>

            {c.photo ? (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '24px 16px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: '#0369a1'
                }}>
                  <Image size={28} />
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginBottom: 4 }}>
                  {c.photoLabel}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 12 }}>
                  नागरिक द्वारा मोबाइल से मौके पर ली गई फोटो • जीपीएस अक्षांश-देशांतर सत्यापित
                </div>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 12px',
                  borderRadius: 9999,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid #86efac'
                }}>
                  ✓ फोटो सत्यापित
                </span>
              </div>
            ) : (
              <div style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: 12,
                padding: '20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.85rem'
              }}>
                इस शिकायत में नागरिक द्वारा कोई फोटो संलग्न नहीं की गई है।
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Citizen, Department & Staff */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Citizen Contact Card */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              शिकायतकर्ता नागरिक जानकारी:
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1d4ed8'
                }}>
                  <User size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    {c.citizen}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    नागरिक • वार्ड 24, चित्तौड़गढ़
                  </div>
                </div>
              </div>

              <a
                href={`tel:${c.citizenPhone}`}
                className="btn btn-sm"
                style={{
                  background: '#15803d',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Phone size={14} /> कॉल करें ({c.citizenPhone})
              </a>
            </div>
          </div>

          {/* Department & Worker Card */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              विभागीय आवंटन एवं बीट कर्मचारी:
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>संबंधित शाखा:</div>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem', marginTop: 2 }}>
                {c.dept}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: 3 }}>
                {c.routedBy}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>आवंटित फील्ड कर्मी:</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginTop: 2 }}>
                  {c.employee}
                </div>
              </div>

              <a
                href={`tel:${c.employeePhone}`}
                className="btn btn-sm btn-outline"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Phone size={12} /> कर्मी को कॉल
              </a>
            </div>
          </div>

          {/* Parshad Action Strip */}
          <div className="card" style={{ padding: '18px', background: '#f5f3ff', border: '1.5px solid #ddd6fe' }}>
            <div style={{ fontWeight: 800, color: '#7c3aed', fontSize: '0.95rem', marginBottom: 4 }}>
              पार्षद विशेषाधिकार व निगरानी कार्रवाई
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>
              यदि कार्य समय पर नहीं हो रहा है, तो कंट्रोल रूम या अधिशाषी अधिकारी को प्राथमिकता प्रेषित करें।
            </p>

            <button
              type="button"
              onClick={() => alert(`कंट्रोल रूम को त्वरित समाधान हेतु अलर्ट भेज दिया गया है!`)}
              className="btn btn-sm"
              style={{
                width: '100%',
                background: '#7c3aed',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Send size={15} /> कंट्रोल रूम को त्वरित कार्यवाही संदेश भेजें
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
