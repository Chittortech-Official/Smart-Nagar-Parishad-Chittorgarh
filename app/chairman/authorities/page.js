'use client';

import DashboardShell from '@/components/DashboardShell';
import {
  Landmark, Award, Phone, Mail, MapPin, Building2,
  Shield, CheckCircle2, ExternalLink, ArrowRight, UserCheck,
  Crown, Star, FileText, Users, MessageSquare, Briefcase
} from 'lucide-react';
import Link from 'next/link';

// Official WhatsApp Brand SVG Icon
const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const KEY_AUTHORITIES = [
  {
    category: 'संसदीय एवं विधान मंडल जनप्रतिनिधि (Elected Representatives)',
    items: [
      {
        id: 'mp',
        title: 'सांसद (Member of Parliament - Lok Sabha)',
        name: 'श्री चंद्र प्रकाश (सी.पी.) जोशी',
        designation: 'सांसद, चित्तौड़गढ़ संसदीय निर्वाचन क्षेत्र (Lok Sabha)',
        party: 'भारतीय जनता पार्टी (BJP)',
        office: 'सांसद सेवा केंद्र, कलेक्ट्रेट रोड, चित्तौड़गढ़ (राज.)',
        phone: '01472-240001',
        displayPhone: '01472-240001',
        whatsapp: '9829000001',
        email: 'cpjoshi.mp@sansad.nic.in',
        roleType: 'संसद सदस्य (MP)',
        badgeColor: '#ea580c',
        badgeBg: '#ffedd5',
        badgeBorder: '#fdba74',
        avatarBg: '#fff7ed',
        icon: Award,
        isVIP: true,
      },
      {
        id: 'mla',
        title: 'विधायक (Member of Legislative Assembly - MLA)',
        name: 'श्री चंद्रभान सिंह आक्या',
        designation: 'विधायक, चित्तौड़गढ़ विधानसभा निर्वाचन क्षेत्र',
        party: 'जनप्रतिनिधि, चित्तौड़गढ़',
        office: 'विधायक जनसुनवाई कार्यालय, सेंथी, चित्तौड़गढ़',
        phone: '01472-241500',
        displayPhone: '01472-241500',
        whatsapp: '9829000002',
        email: 'mla.chittorgarh@rajasthan.gov.in',
        roleType: 'विधानसभा सदस्य (MLA)',
        badgeColor: '#2563eb',
        badgeBg: '#eff6ff',
        badgeBorder: '#bfdbfe',
        avatarBg: '#eff6ff',
        icon: Landmark,
        isVIP: true,
      },
    ]
  },
  {
    category: 'जिला प्रशासन नेतृत्व (District Collectorate Administration)',
    items: [
      {
        id: 'collector',
        title: 'जिला कलेक्टर एवं जिला मजिस्ट्रेट (District Collector & DM)',
        name: 'डॉ. मंजू (IAS)',
        designation: 'जिला कलक्टर एवं जिला मजिस्ट्रेट, चित्तौड़गढ़',
        department: 'भारतीय प्रशासनिक सेवा (IAS) · राजस्थान कैडर',
        office: 'कलेक्टर कक्ष, कलेक्ट्रेट परिसर, चित्तौड़गढ़ (राज.)',
        phone: '01472-240002',
        displayPhone: '01472-240002',
        whatsapp: '9829000003',
        email: 'dm-chit-rj@nic.in',
        roleType: 'प्रशासनिक प्रमुख (DM & Collector)',
        badgeColor: '#1e3a8a',
        badgeBg: '#eff6ff',
        badgeBorder: '#93c5fd',
        avatarBg: '#eff6ff',
        icon: Shield,
        isVIP: true,
      },
      {
        id: 'zila_pramukh',
        title: 'जिला प्रमुख (Zila Pramukh - Zila Parishad)',
        name: 'डॉ. सुरेश धाकड़',
        designation: 'जिला प्रमुख, जिला परिषद चित्तौड़गढ़',
        department: 'पंचायती राज एवं ग्रामीण विकास विभाग, राजस्थान',
        office: 'जिला परिषद भवन, कलेक्ट्रेट सर्किल, चित्तौड़गढ़',
        phone: '01472-240030',
        displayPhone: '01472-240030',
        whatsapp: '9829000030',
        email: 'ceo-zp-chit-rj@nic.in',
        roleType: 'जिला परिषद अध्यक्ष',
        badgeColor: '#15803d',
        badgeBg: '#f0fdf4',
        badgeBorder: '#86efac',
        avatarBg: '#f0fdf4',
        icon: Users,
      },
      {
        id: 'adm',
        title: 'अतिरिक्त जिला कलक्टर (ADM Administration)',
        name: 'अतिरिक्त जिला कलेक्टर (प्रशासन)',
        designation: 'एडीएम एवं अपर जिला मजिस्ट्रेट, चित्तौड़गढ़',
        department: 'राजस्व एवं विधि व्यवस्था संभाग',
        office: 'कमरा नं. 14, कलेक्ट्रेट परिसर, चित्तौड़गढ़',
        phone: '01472-240004',
        displayPhone: '01472-240004',
        whatsapp: '9829000004',
        email: 'adm-chit-rj@nic.in',
        roleType: 'अपर जिला मजिस्ट्रेट (ADM)',
        badgeColor: '#475569',
        badgeBg: '#f1f5f9',
        badgeBorder: '#cbd5e1',
        avatarBg: '#f8fafc',
        icon: FileText,
      },
    ]
  },
  {
    category: 'नगर परिषद चित्तौड़गढ़ शीर्ष नेतृत्व (Municipal Council Chittorgarh)',
    items: [
      {
        id: 'chairman',
        title: 'सभापति (Chairman / President, Municipal Council)',
        name: 'श्री अनिल ईनाणी',
        designation: 'सभापति (चेयरमैन), नगर परिषद चित्तौड़गढ़ · निर्वाचित पार्षद वार्ड 15',
        party: 'भारतीय जनता पार्टी (BJP)',
        office: 'सभापति कक्ष, नगर परिषद मुख्यालय, चित्तौड़गढ़',
        phone: '01472-241246',
        displayPhone: '01472-241246',
        whatsapp: '9829000015',
        email: 'chairman@chittorgarhnp.rajasthan.gov.in',
        roleType: 'सर्वोच्च नगर परिषद प्रमुख',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        badgeBorder: '#fde68a',
        avatarBg: '#fffbeb',
        icon: Crown,
        isVIP: true,
      },
      {
        id: 'vice_chairman',
        title: 'उपसभापति (Vice Chairman, Municipal Council)',
        name: 'श्री सुदर्शन रामपुरिया',
        designation: 'उपसभापति, नगर परिषद चित्तौड़गढ़ · निर्वाचित पार्षद वार्ड 31',
        party: 'भारतीय जनता पार्टी (BJP)',
        office: 'उपसभापति कक्ष, नगर परिषद, चित्तौड़गढ़',
        phone: '01472-241247',
        displayPhone: '01472-241247',
        whatsapp: '9829000031',
        email: 'vicechairman@chittorgarhnp.rajasthan.gov.in',
        roleType: 'उप प्रमुख, नगर परिषद',
        badgeColor: '#1d4ed8',
        badgeBg: '#eff6ff',
        badgeBorder: '#93c5fd',
        avatarBg: '#eff6ff',
        icon: Star,
        isVIP: true,
      },
      {
        id: 'commissioner',
        title: 'नगर परिषद आयुक्त (Commissioner / Executive Officer)',
        name: 'श्री रविंद्र यादव (RAS)',
        designation: 'आयुक्त (कमिश्नर), नगर परिषद चित्तौड़गढ़',
        department: 'स्वायत्त शासन विभाग (DLB), राजस्थान सरकार',
        office: 'आयुक्त कार्यालय, नगर परिषद मुख्यालय, चित्तौड़गढ़',
        phone: '01472-241248',
        displayPhone: '01472-241248',
        whatsapp: '9829000000',
        email: 'commissioner@chittorgarhnp.rajasthan.gov.in',
        roleType: 'मुख्य प्रशासनिक अधिकारी (Commissioner)',
        badgeColor: '#0f766e',
        badgeBg: '#f0fdfa',
        badgeBorder: '#99f6e4',
        avatarBg: '#f0fdfa',
        icon: Briefcase,
        isVIP: true,
      },
    ]
  }
];

export default function AuthoritiesPage() {
  return (
    <DashboardShell requiredRole="chairman">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <Link href="/chairman" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
          ← वापस मुख्य डैशबोर्ड पर
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              चित्तौड़गढ़ — प्रमुख प्रशासनिक नेतृत्व एवं जनप्रतिनिधि
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              चित्तौड़गढ़ संसदीय क्षेत्र, विधानसभा, जिला कलेक्ट्रेट एवं नगर परिषद के शीर्ष नीति-निर्माता व वरिष्ठ अधिकारी
            </p>
          </div>
          <span className="badge badge-chairman" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            🏛️ उच्चाधिकारी प्रकोष्ठ (Key Authorities)
          </span>
        </div>
      </div>

      {/* Authority Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {KEY_AUTHORITIES.map(group => (
          <div key={group.category}>
            <div style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#1e3a8a',
              marginBottom: 12,
              paddingBottom: 6,
              borderBottom: '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Landmark size={18} color="#1e3a8a" />
              {group.category}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 }}>
              {group.items.map(auth => {
                const IconComponent = auth.icon;
                const whatsappUrl = `https://wa.me/91${auth.whatsapp}?text=${encodeURIComponent(`नमस्ते ${auth.name} जी, नगर परिषद चित्तौड़गढ़ संदर्भ में...`)}`;
                const mailtoUrl = `mailto:${auth.email}?subject=${encodeURIComponent('नगर परिषद चित्तौड़गढ़ — प्रशासनिक संदर्भ')}`;

                return (
                  <div
                    key={auth.id}
                    className="card"
                    style={{
                      padding: '20px',
                      borderRadius: 14,
                      border: `1.5px solid ${auth.isVIP ? auth.badgeBorder : '#e2e8f0'}`,
                      background: auth.isVIP ? `linear-gradient(180deg, ${auth.avatarBg} 0%, #ffffff 100%)` : '#ffffff',
                      boxShadow: auth.isVIP ? `0 4px 14px ${auth.badgeColor}18` : '0 1px 3px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minWidth: 0,
                    }}
                  >
                    <div>
                      {/* Top Row: Title Badge & Party Tag */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: 6,
                          background: auth.badgeBg,
                          color: auth.badgeColor,
                          border: `1px solid ${auth.badgeBorder}`,
                        }}>
                          {auth.roleType}
                        </span>
                        {auth.party && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                            {auth.party}
                          </span>
                        )}
                      </div>

                      {/* Official Icon & Name Header (Icon never overflows) */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: auth.badgeBg,
                          color: auth.badgeColor,
                          border: `1.5px solid ${auth.badgeBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 2px 6px ${auth.badgeColor}20`,
                        }}>
                          <IconComponent size={24} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{
                            fontSize: '1.15rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            lineHeight: 1.35,
                            wordBreak: 'break-word',
                          }}>
                            {auth.name}
                          </div>
                          <div style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: auth.badgeColor,
                            marginTop: 2,
                            lineHeight: 1.3,
                            wordBreak: 'break-word',
                          }}>
                            {auth.title}
                          </div>
                        </div>
                      </div>

                      {/* Designation Subtitle with clean wrap */}
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        lineHeight: 1.45,
                        marginBottom: 12,
                        wordBreak: 'break-word',
                      }}>
                        {auth.designation}
                      </p>
                    </div>

                    {/* Office Location & Contact Row */}
                    <div>
                      <div style={{
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: 10,
                        marginBottom: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        fontSize: '0.75rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#475569' }}>
                          <MapPin size={13} style={{ flexShrink: 0, marginTop: 2, color: '#94a3b8' }} />
                          <span style={{ wordBreak: 'break-word' }}>{auth.office}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a8a', fontWeight: 700 }}>
                          <Phone size={13} style={{ flexShrink: 0, color: '#1e3a8a' }} />
                          <span>दूरभाष: {auth.displayPhone}</span>
                        </div>
                        {auth.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                            <Mail size={13} style={{ flexShrink: 0, color: '#94a3b8' }} />
                            <span style={{ wordBreak: 'break-all' }}>{auth.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Quick-Action Buttons (WhatsApp, Email & Call) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: auth.email ? '1fr 1fr' : '1fr',
                        gap: 8,
                        paddingTop: 6,
                      }}>
                        {/* WhatsApp Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            background: '#25D366',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: 8,
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#1ebc59'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = ''; }}
                        >
                          <WhatsAppIcon size={15} />
                          <span>व्हाट्सएप संदेश</span>
                        </a>

                        {/* Email Button */}
                        {auth.email && (
                          <a
                            href={mailtoUrl}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              background: '#1e3a8a',
                              color: '#ffffff',
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              textDecoration: 'none',
                              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#1e3a8a'; e.currentTarget.style.transform = ''; }}
                          >
                            <Mail size={14} />
                            <span>ईमेल भेजें</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
