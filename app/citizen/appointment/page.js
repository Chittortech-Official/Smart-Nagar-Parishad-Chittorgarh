'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { getStoredCitizenProfile } from '@/lib/citizenService';
import { bookAppointment } from '@/lib/appointmentService';
import {
  Calendar, Clock, Phone, User, MapPin, Building,
  AlertCircle, CheckCircle2, ChevronLeft, ArrowRight,
  Shield, Sparkles, Send, Copy, Check
} from 'lucide-react';

const DEPARTMENTS = [
  'स्वास्थ्य एवं स्वच्छता शाखा',
  'निर्माण एवं सड़क अनुभाग (सिविल)',
  'पट्टा एवं राजस्व शाखा (69A / नियमन)',
  'जल प्रदाय शाखा (पेयजल आपूर्ति)',
  'विद्युत अनुभाग (स्ट्रीट लाइट)',
  'उद्यान विकास शाखा (पार्क)',
  'सामान्य प्रशासन एवं अन्य प्रकरण',
];

export default function SabhapatiAppointmentPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [citizen, setCitizen] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [community, setCommunity] = useState('');
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [wardNumber, setWardNumber] = useState('24');
  const [department, setDepartment] = useState('स्वास्थ्य एवं स्वच्छता शाखा');
  const [urgency, setUrgency] = useState('urgent');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredWindow, setPreferredWindow] = useState('morning');
  const [subject, setSubject] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedAppointment, setSubmittedAppointment] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set tomorrow's date by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);

    const stored = getStoredCitizenProfile();
    if (stored) {
      setCitizen(stored);
      if (stored.name) setFullName(stored.name);
      if (stored.phone) setPhonePrimary(stored.phone);
      if (stored.ward) setWardNumber(String(stored.ward));
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    const p1 = phonePrimary.replace(/\D/g, '').slice(-10);
    const p2 = phoneSecondary.replace(/\D/g, '').slice(-10);

    if (p1.length !== 10) {
      setErrorMsg('कृपया पहला 10-अंकीय मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (p2.length !== 10) {
      setErrorMsg('कृपया दूसरा वैकल्पिक / व्हाट्सएप 10-अंकीय मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (p1 === p2) {
      setErrorMsg('पहला एवं दूसरा मोबाइल नंबर अलग-अलग होने चाहिए ताकि संपर्क सुनिश्चित हो सके।');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('कृपया मुलाकात का मुख्य विषय/समस्या का विवरण दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const res = await bookAppointment({
        fullName,
        communitySurname: community,
        phonePrimary: p1,
        phoneSecondary: p2,
        wardNumber: parseInt(wardNumber, 10),
        department,
        urgency,
        preferredDate,
        preferredWindow,
        subject,
      });

      setSubmittedAppointment(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err?.message || 'अनुरोध दर्ज करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyToken() {
    if (submittedAppointment?.tokenCode) {
      navigator.clipboard?.writeText(submittedAppointment.tokenCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!mounted) return null;

  return (
    <DashboardShell requiredRole="citizen">
      <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '60px' }}>
        {/* Navigation Breadcrumb */}
        <Link
          href="/citizen"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#1e3a8a',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            marginBottom: 14,
          }}
        >
          <ChevronLeft size={16} /> वापस नागरिक होम पर
        </Link>

        {/* Top Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          borderRadius: 16,
          padding: '20px 22px',
          color: '#ffffff',
          marginBottom: 18,
          boxShadow: '0 4px 16px rgba(30, 58, 138, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#fdba74',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>नगर परिषद चित्तौड़गढ़</span>
            <span>•</span>
            <span style={{ color: '#86efac' }}>जनसुनवाई ई-सेवा</span>
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 6px 0', lineHeight: 1.3 }}>
            सभापति जी से व्यक्तिगत भेंट / अपॉइंटमेंट अनुरोध
          </h1>
          <p style={{ fontSize: '0.825rem', color: '#e0e7ff', margin: 0, lineHeight: 1.45 }}>
            सभापति: <strong>श्री अनिल जी ईनाणी</strong> • नगर परिषद चित्तौड़गढ़ में व्यक्तिगत जनसुनवाई हेतु
          </p>
        </div>

        {/* SUCCESS CONFIRMATION SCREEN */}
        {submittedAppointment ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '2px solid #86efac',
            padding: '28px 22px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 64,
              height: 64,
              background: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid #86efac',
            }}>
              <CheckCircle2 size={36} color="#15803d" />
            </div>

            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              अनुरोध सफलतापूर्वक दर्ज (Request Registered)
            </div>

            <h2 style={{ fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 900, marginTop: 4, marginBottom: 12 }}>
              अपॉइंटमेंट टोकन जारी किया गया
            </h2>

            {/* Token Badge */}
            <div style={{
              background: '#f8fafc',
              border: '2px dashed #93c5fd',
              borderRadius: 12,
              padding: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>आपका विशिष्ट टोकन नंबर:</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1e3a8a', fontFamily: 'monospace' }}>
                  {submittedAppointment.tokenCode}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyToken}
                style={{
                  background: copied ? '#15803d' : '#1e3a8a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'background 0.2s',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'कॉपी हुआ' : 'कॉपी करें'}
              </button>
            </div>

            {/* Crucial Secretariat Follow-up Notice */}
            <div style={{
              background: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: 12,
              padding: '14px 16px',
              textAlign: 'left',
              marginBottom: 22,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Phone size={20} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.88rem', marginBottom: 4 }}>
                    सचिवालय संपर्क सूचना (Nagar Parishad Intimation)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                    नगर परिषद चित्तौड़गढ़ का सभापति सचिवालय आपके द्वारा दर्ज किए गए दोनों फोन नंबरों (<strong>{submittedAppointment.phonePrimary}</strong> एवं <strong>{submittedAppointment.phoneSecondary}</strong>) पर व्यक्तिगत संपर्क करके बैठक का समय व दिनांक निश्चित करेगा।
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div style={{
              background: '#f8fafc',
              borderRadius: 10,
              padding: '14px',
              textAlign: 'left',
              fontSize: '0.82rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 20,
              border: '1px solid #e2e8f0',
            }}>
              <div>
                <span style={{ color: '#64748b' }}>नागरिक:</span>{' '}
                <strong>{submittedAppointment.fullName} {submittedAppointment.communitySurname ? `(${submittedAppointment.communitySurname})` : ''}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>वार्ड संख्या:</span>{' '}
                <strong>वार्ड नं. {submittedAppointment.wardNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>संबंधित विभाग:</span>{' '}
                <strong>{submittedAppointment.department}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>प्राथमिकता:</span>{' '}
                <strong style={{ color: submittedAppointment.urgency === 'urgent' ? '#dc2626' : '#1e3a8a' }}>
                  {submittedAppointment.urgency === 'urgent' ? 'अति आवश्यक' : 'सामान्य'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link
                href="/citizen"
                className="btn btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.85rem' }}
              >
                नागरिक डैशबोर्ड पर लौटें
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedAppointment(null)}
                className="btn btn-outline"
                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
              >
                नया अनुरोध भरें
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '22px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            {errorMsg && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: '0.82rem',
                marginBottom: 16,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Row 1: Name and Community/Surname */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राजेश कुमार"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  उपनाम / समाज (Surname / Community)
                </label>
                <input
                  type="text"
                  placeholder="उदा. सोनी / धाकड़ / जैन"
                  value={community}
                  onChange={e => setCommunity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Row 2: 2 Phone Numbers (Mandatory for Secretariat Coordination) */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 18,
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={14} />
                <span>दो संपर्क नंबर अनिवार्य हैं (Two Contact Numbers for Direct Secretariat Coordination)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    पहला मुख्य मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-अंकीय मोबाइल"
                    value={phonePrimary}
                    onChange={e => setPhonePrimary(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    दूसरा वैकल्पिक / व्हाट्सएप नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="वैकल्पिक संपर्क नंबर"
                    value={phoneSecondary}
                    onChange={e => setPhoneSecondary(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Ward and Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  वार्ड संख्या (Ward) *
                </label>
                <select
                  value={wardNumber}
                  onChange={e => setWardNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>वार्ड संख्या {num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  संबंधित नगरपालिका शाखा (Department) *
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Urgency Selection */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                मुलाकात की प्राथमिकता (Urgency Level) *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: urgency === 'urgent' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                    background: urgency === 'urgent' ? '#fee2e2' : '#f8fafc',
                    color: urgency === 'urgent' ? '#b91c1c' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🔴 अति आवश्यक (Urgent)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('normal')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: urgency === 'normal' ? '2px solid #d97706' : '1px solid #cbd5e1',
                    background: urgency === 'normal' ? '#fef3c7' : '#f8fafc',
                    color: urgency === 'normal' ? '#92400e' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🟡 सामान्य जनसमस्या
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('courtesy')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: urgency === 'courtesy' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: urgency === 'courtesy' ? '#dcfce7' : '#f8fafc',
                    color: urgency === 'courtesy' ? '#15803d' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🟢 सौजन्य भेंट / सुझाव
                </button>
              </div>
            </div>

            {/* Row 5: Preferred Date and Time Window */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  अपेक्षित तिथि (Preferred Date)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                  समय अंतराल (Time Window)
                </label>
                <select
                  value={preferredWindow}
                  onChange={e => setPreferredWindow(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="morning">प्रातः 10:30 AM – 1:00 PM (जनसुनवाई)</option>
                  <option value="afternoon">दोपहर 3:00 PM – 5:00 PM (कार्यालय)</option>
                </select>
              </div>
            </div>

            {/* Row 6: Subject / Matter Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 6 }}>
                मुलाकात का मुख्य विषय / समस्या का विवरण (Matter Description) *
              </label>
              <textarea
                required
                rows={3}
                placeholder="सभापति जी के समक्ष प्रस्तुत किए जाने वाले प्रकरण का संक्षिप्त विवरण लिखें..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                fontSize: '0.98rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
              }}
            >
              <Send size={18} />
              {loading ? 'अनुरोध दर्ज हो रहा है...' : 'सभापति जी से भेंट हेतु अनुरोध भेजें'}
            </button>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
