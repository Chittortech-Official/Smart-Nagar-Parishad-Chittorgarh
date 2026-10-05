'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import ParshadNavTabs from '@/components/ParshadNavTabs';
import StatusBadge from '@/components/StatusBadge';
import { getSharedLiveComplaints, fetchSharedLiveComplaints, updateComplaintStatusByParshad } from '@/lib/citizenService';
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

export default function ParshadComplaintDetailPage() {
  const routeParams = useParams();
  const rawId = routeParams?.id;
  const id = typeof rawId === 'string' ? decodeURIComponent(rawId) : String(rawId || '1');

  const [complaint, setComplaint] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const liveList = getSharedLiveComplaints();
        const liveMatch = liveList.find(item => String(item.id) === String(id) || item.code === id);
        if (liveMatch) {
          return {
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
          };
        }
      } catch (_) {}
    }
    return ALL_COMPLAINTS_DATA[id] || ALL_COMPLAINTS_DATA['1'] || {};
  });

  useEffect(() => {
    function matchAndSet(liveList) {
      const liveMatch = (liveList || []).find(item => String(item.id) === String(id) || item.code === id);
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
        return true;
      }
      return false;
    }

    const foundInCache = matchAndSet(getSharedLiveComplaints());
    if (!foundInCache) {
      fetchSharedLiveComplaints().then(fresh => {
        const found = matchAndSet(fresh);
        if (!found && ALL_COMPLAINTS_DATA[id]) {
          setComplaint(ALL_COMPLAINTS_DATA[id]);
        }
      });
    } else if (ALL_COMPLAINTS_DATA[id]) {
      // Fallback
    }
  }, [id]);

  const c = complaint;

  const [selectedStatus, setSelectedStatus] = useState('in_progress');
  const [parshadMessage, setParshadMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (complaint?.status === 'submitted') {
      setSelectedStatus('in_progress');
    } else if (complaint?.status === 'in_progress') {
      setSelectedStatus('resolved');
    } else if (complaint?.status) {
      setSelectedStatus(complaint.status);
    }
  }, [complaint?.status]);

  async function handleParshadUpdate() {
    if (!complaint?.code && !id) return;
    setUpdating(true);
    setUpdateSuccess('');
    try {
      const codeToUse = complaint.code || id;
      const res = await updateComplaintStatusByParshad({
        complaintCode: codeToUse,
        newStatus: selectedStatus,
        note: parshadMessage,
        parshadName: 'श्रीमती कुसुम (पार्षद, वार्ड 24)',
      });

      setComplaint(prev => ({
        ...prev,
        status: selectedStatus,
        parshadNote: res.parshadNote,
      }));

      setUpdateSuccess('कार्रवाई अद्यतन पूर्ण! नागरिक व कंट्रोल रूम को स्थिति प्रेषित कर दी गई है।');
      setParshadMessage('');
      setTimeout(() => setUpdateSuccess(''), 6000);
    } catch (e) {
      alert('अद्यतन विफल: ' + (e?.message || e));
    } finally {
      setUpdating(false);
    }
  }

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
        {/* Left Column: Complaint Text, Parshad Actions & Photo Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Active Parshad Action Banner (if already taken) */}
          {c.parshadNote && (
            <div className="card" style={{
              padding: '14px 18px',
              background: '#fdf4ff',
              border: '2px solid #d8b4fe',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed', fontWeight: 800, fontSize: '0.85rem', marginBottom: 4 }}>
                <ShieldCheck size={18} />
                <span>पार्षद स्तर पर दर्ज कार्रवाई व नागरिक संदेश:</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#1e1b4b', fontWeight: 700, lineHeight: 1.45 }}>
                "{c.parshadNote}"
              </div>
            </div>
          )}

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

          {/* Parshad Direct Action & Citizen Notification Panel */}
          <div className="card" style={{ padding: '20px', background: '#fdf4ff', border: '2px solid #e9d5ff', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#7c3aed', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#6b21a8', fontSize: '1rem', lineHeight: 1.2 }}>
                  पार्षद सीधी कार्रवाई एवं स्थिति अद्यतन
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7e22ce' }}>
                  श्रीमती कुसुम (पार्षद, वार्ड 24) • लाइव नागरिक संचार
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px', lineHeight: 1.45 }}>
              यहाँ से आप स्थिति बदलकर नागरिक को सीधा संदेश भेज सकते हैं। यह अद्यतन तुरंत नागरिक पोर्टल पर प्रदर्शित होगा।
            </p>

            {/* 1. Status Selection */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                1. शिकायत स्थिति चुनें:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {[
                  { id: 'in_progress', label: 'कार्य प्रगति पर', icon: '🟡', sub: 'In Progress' },
                  { id: 'resolved',    label: 'निस्तारित',       icon: '🟢', sub: 'Resolved' },
                  { id: 'assigned',    label: 'कार्य आवंटित',     icon: '🔵', sub: 'Assigned' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStatus(opt.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: selectedStatus === opt.id ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      background: selectedStatus === opt.id ? '#7c3aed' : '#ffffff',
                      color: selectedStatus === opt.id ? '#ffffff' : '#1e293b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{opt.icon} {opt.label}</span>
                    <span style={{ fontSize: '0.65rem', opacity: selectedStatus === opt.id ? 0.9 : 0.6 }}>{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Message to Citizen / Quick Chips */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                2. नागरिक को स्थिति संदेश / टिप्पणी भेजें:
              </label>

              {/* Quick Template Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {[
                  '⚡ मौके पर टीम भेजकर कार्य शुरू कराया गया।',
                  '📞 संबंधित शाखा प्रभारी को त्वरित निराकरण के निर्देश दिए।',
                  '✅ स्थल निरीक्षण उपरांत समस्या का पूर्ण समाधान हो गया।',
                ].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setParshadMessage(chip)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 9px',
                      borderRadius: 6,
                      background: parshadMessage === chip ? '#e9d5ff' : '#ffffff',
                      border: '1px solid #d8b4fe',
                      color: '#6b21a8',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                value={parshadMessage}
                onChange={e => setParshadMessage(e.target.value)}
                placeholder="यहाँ नागरिक के लिए संदेश या कार्रवाई विवरण दर्ज करें..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Success Message Banner */}
            {updateSuccess && (
              <div style={{
                background: '#dcfce7',
                border: '1.5px solid #86efac',
                color: '#166534',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span>{updateSuccess}</span>
              </div>
            )}

            {/* 3. Action Submit Button */}
            <button
              type="button"
              disabled={updating}
              onClick={handleParshadUpdate}
              style={{
                width: '100%',
                background: '#7c3aed',
                color: '#ffffff',
                padding: '11px 16px',
                borderRadius: 10,
                fontSize: '0.88rem',
                fontWeight: 800,
                border: 'none',
                cursor: updating ? 'not-allowed' : 'pointer',
                opacity: updating ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Send size={16} />
              {updating ? 'स्थिति अद्यतन हो रही है...' : 'स्थिति अद्यतन करें एवं नागरिक को सूचित करें'}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
