'use client';

import { useState } from 'react';
import { saveCitizenProfile, lookupCitizenByPhone, DEFAULT_MOCK_CITIZENS } from '@/lib/citizenService';
import { CHITTORGARH_60_WARDS } from '@/lib/data/wardsResults';
import ChittorgarhLogo from './ChittorgarhLogo';
import {
  User, Phone, MapPin, Lock,
  ArrowRight, Search, CheckCircle2, AlertCircle,
  KeyRound, Sparkles, ShieldCheck, ClipboardList, Clock, HelpCircle,
  ChevronDown, Check
} from 'lucide-react';

export default function CitizenOnboarding({ onComplete }) {
  const [mode, setMode] = useState('register'); // 'register' | 'lookup'
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [wardNum, setWardNum] = useState('24');
  const [pin, setPin] = useState('');
  
  // Lookup fields
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupPin, setLookupPin] = useState('');
  const [pinRequiredName, setPinRequiredName] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setError('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!wardNum) {
      setError('कृपया अपनी वार्ड संख्या चुनें।');
      return;
    }

    if (pin && pin.length !== 4) {
      setError('सुरक्षा पिन ठीक 4 अंकों का होना चाहिए।');
      return;
    }

    setLoading(true);
    try {
      const saved = await saveCitizenProfile({
        name: fullName.trim(),
        phone: cleanMobile,
        ward: wardNum,
        pin: pin.trim(),
      });
      setSuccessMsg('पंजीकरण सफल! पोर्टल लोड हो रहा है...');
      setTimeout(() => {
        if (onComplete) onComplete(saved);
      }, 500);
    } catch (err) {
      setError(err?.message || 'पंजीकरण में त्रुटि आई।');
      setLoading(false);
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const clean = lookupPhone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      const result = await lookupCitizenByPhone(clean, lookupPin);
      if (result?.requiresPin) {
        setPinRequiredName(result.name);
        setLoading(false);
        return;
      }

      if (result) {
        setSuccessMsg(`स्वागत है, ${result.name} जी!`);
        setTimeout(() => {
          if (onComplete) onComplete(result);
        }, 500);
      } else {
        setError('इस नंबर से कोई पूर्व खाता नहीं मिला। कृपया "नया पंजीकरण" करें।');
        setLoading(false);
      }
    } catch (err) {
      setError(err?.message || 'खाता खोजने में त्रुटि।');
      setLoading(false);
    }
  }

  return (
    <div className="onboarding-screen-wrapper">
      <div className="onboarding-split-grid">
        
        {/* ============================================================ */}
        {/* 1. LEFT HALF: Municipal Showcase (Spans from Left Corner to Partition) */}
        {/* ============================================================ */}
        <div className="onboarding-showcase-panel">
          <div style={{ maxWidth: 540, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-evenly' }}>
            
            {/* Header: Seal + Department Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <ChittorgarhLogo size={52} showText={false} />
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    padding: '2px 9px',
                    borderRadius: 9999,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#c2410c',
                    marginBottom: 3
                  }}>
                    <span>स्वायत्त शासन विभाग • राजस्थान सरकार</span>
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(1.4rem, 2vw, 1.75rem)',
                    fontWeight: 900,
                    color: '#1e3a8a',
                    margin: 0,
                    lineHeight: 1.2
                  }}>
                    नगर परिषद चित्तौड़गढ़
                  </h1>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700, marginTop: 2 }}>
                    नागरिक ई-सेवा एवं जन-समाधान पोर्टल
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <p style={{
                fontSize: 'clamp(0.8rem, 1.1vw, 0.88rem)',
                color: '#334155',
                lineHeight: 1.6,
                margin: '10px 0 0 0',
                borderLeft: '3.5px solid #2563eb',
                paddingLeft: 12
              }}>
                वीर भूमि चित्तौड़गढ़ के समस्त <strong>60 वार्डों</strong> के नागरिकों के लिए पारदर्शी, त्वरित एवं जवाबदेह नगर पालिका सेवाएं। बिना कतार, बिना जटिलता — सीधे अपनी समस्या दर्ज करें और वार्ड स्तर पर तुरंत समाधान पाएं।
              </p>
            </div>

            {/* Key Highlights Cards (Auto-sized) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#ffffff',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}>
                <div style={{ background: '#e0f2fe', color: '#0369a1', padding: 7, borderRadius: 8, flexShrink: 0 }}>
                  <Sparkles size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 2 }}>
                    त्वरित शून्य-ओटीपी लॉगिन
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    केवल 10-अंकीय मोबाइल नंबर द्वारा तुरंत खाता सक्रिय करें अथवा पूर्व शिकायतें लोड करें।
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#ffffff',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}>
                <div style={{ background: '#dcfce7', color: '#15803d', padding: 7, borderRadius: 8, flexShrink: 0 }}>
                  <MapPin size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534', marginBottom: 2 }}>
                    सभी 60 वार्डों में सीधी निगरानी
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    सड़क, कचरा, स्ट्रीट लाइट, सीवरेज व पेयजल समस्याओं पर क्षेत्रीय बीट प्रभारी से समन्वय।
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#ffffff',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}>
                <div style={{ background: '#fef3c7', color: '#b45309', padding: 7, borderRadius: 8, flexShrink: 0 }}>
                  <Clock size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400e', marginBottom: 2 }}>
                    24 से 72 घंटे में समयबद्ध निस्तारण (SLA)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    कार्यवाही विवरण, समाधान पूर्व व पश्चात फोटो सत्यापन तथा नागरिक संतुष्टि फीडबैक।
                  </div>
                </div>
              </div>
            </div>

            {/* Official Helpline Footer */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Phone size={15} color="#c2410c" />
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>
                  जन अभियोग हेल्पलाइन: <strong style={{ color: '#0f172a' }}>181</strong>
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                कंट्रोल रूम: <strong style={{ color: '#0f172a' }}>01472-241246</strong>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. RIGHT HALF: Login / Registration Form (Spans to Right Corner) */}
        {/* ============================================================ */}
        <div className="onboarding-form-column">
          <div className="onboarding-card-box" style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            boxSizing: 'border-box',
            width: '100%',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa',
                padding: '2px 10px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: 4
              }}>
                <Sparkles size={12} />
                <span>चित्तौड़गढ़ नागरिक ई-सेवा</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 1.6vw, 1.35rem)',
                color: '#1e3a8a',
                fontWeight: 800,
                margin: '2px 0 3px 0',
                lineHeight: 1.25
              }}>
                {mode === 'register' ? 'नागरिक त्वरित पंजीकरण' : 'पंजीकृत खाता खोजें'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                {mode === 'register'
                  ? 'बिना ओटीपी के 10 सेकंड में अपना खाता बनाएं'
                  : 'अपना मोबाइल नंबर दर्ज करके पूर्व शिकायतें लोड करें'}
              </p>
            </div>

            {/* Segmented Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 4,
              background: '#f1f5f9',
              padding: 3,
              borderRadius: 8,
              marginBottom: 12,
            }}>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setPinRequiredName(null); }}
                style={{
                  padding: '7px 10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'register' ? '#1e3a8a' : 'transparent',
                  color: mode === 'register' ? '#ffffff' : '#64748b',
                  boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                नया पंजीकरण
              </button>
              <button
                type="button"
                onClick={() => { setMode('lookup'); setError(''); }}
                style={{
                  padding: '7px 10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'lookup' ? '#1e3a8a' : 'transparent',
                  color: mode === 'lookup' ? '#ffffff' : '#64748b',
                  boxShadow: mode === 'lookup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                पहले से पंजीकृत?
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '8px 10px',
                borderRadius: 7,
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '8px 10px',
                borderRadius: 7,
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 1: New Citizen Registration Form */}
            {/* ============================================================ */}
            {mode === 'register' ? (
              <form onSubmit={handleRegister}>
                {/* Full Name */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 3, lineHeight: 1.3 }}>
                    पूरा नाम (Full Name) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="devanagari-input"
                      placeholder="उदा. राजेश कुमार"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{ width: '100%' }}
                      required
                    />
                    <User size={15} color="#64748b" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Mobile Number */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 3, lineHeight: 1.3 }}>
                    मोबाइल नंबर (10 Digit Mobile) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      maxLength={10}
                      className="devanagari-input"
                      placeholder="उदा. 9829012345"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      style={{ width: '100%' }}
                      required
                    />
                    <Phone size={15} color="#64748b" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Ward Select */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 3, lineHeight: 1.3 }}>
                    वार्ड संख्या (Ward) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={wardNum}
                      onChange={e => setWardNum(e.target.value)}
                      className="devanagari-select"
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        paddingRight: '34px',
                        appearance: 'none',
                        WebkitAppearance: 'none'
                      }}
                      required
                    >
                      {CHITTORGARH_60_WARDS.map(w => (
                        <option key={w.num} value={w.num}>
                          वार्ड {w.num} — {w.councillor} ({w.party})
                        </option>
                      ))}
                    </select>
                    <MapPin size={15} color="#64748b" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>

                  {/* Dynamic Ward Councillor (पार्षद प्रतिनिधि) Live Info Card */}
                  {(() => {
                    const currentWard = CHITTORGARH_60_WARDS.find(w => w.num === parseInt(wardNum, 10)) || CHITTORGARH_60_WARDS[23];
                    const isBjp = currentWard.partyCode === 'bjp';
                    const isInc = currentWard.partyCode === 'inc';
                    const partyTheme = isBjp
                      ? { bg: '#fff7ed', border: '#fdba74', accent: '#ea580c', tagBg: '#ffedd5', tagText: '#c2410c' }
                      : isInc
                      ? { bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', tagBg: '#dbeafe', tagText: '#1e40af' }
                      : { bg: '#faf5ff', border: '#e9d5ff', accent: '#9333ea', tagBg: '#f3e8ff', tagText: '#6b21a8' };

                    return (
                      <div style={{
                        marginTop: 7,
                        background: partyTheme.bg,
                        border: `1.5px solid ${partyTheme.border}`,
                        borderLeft: `4px solid ${partyTheme.accent}`,
                        borderRadius: 8,
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#ffffff',
                            color: partyTheme.accent,
                            border: `1.5px solid ${partyTheme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            flexShrink: 0
                          }}>
                            {currentWard.councillor.charAt(0)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                              वार्ड {currentWard.num} के निर्वाचित पार्षद:
                            </div>
                            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {currentWard.isChairman ? `${currentWard.councillor} (सभापति)` : currentWard.isViceChairman ? `${currentWard.councillor} (उपसभापति)` : currentWard.councillor}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 9999,
                            background: partyTheme.tagBg,
                            color: partyTheme.tagText,
                            border: `1px solid ${partyTheme.border}`,
                            display: 'inline-block'
                          }}>
                            {currentWard.party}
                          </span>
                          {currentWard.reservation && (
                            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 2 }}>
                              {currentWard.reservation.split(' ')[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 4-Digit MPIN for Security */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', lineHeight: 1.3 }}>
                      4-अंकीय सुरक्षा पिन (MPIN)
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>वैकल्पिक</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      maxLength={4}
                      className="devanagari-input"
                      placeholder="उदा. 1234"
                      value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                      style={{ width: '100%', letterSpacing: pin ? '0.25em' : 'normal' }}
                    />
                    <Lock size={15} color="#64748b" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3, lineHeight: 1.3 }}>
                    🔒 कोई अन्य व्यक्ति आपका मोबाइल डालकर खाता न खोल सके
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    minHeight: 42,
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 9,
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    boxShadow: '0 2px 8px rgba(30,58,138,0.22)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{loading ? 'सत्यापित हो रहा है...' : 'पोर्टल में प्रवेश करें'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* ============================================================ */
              /* TAB 2: Equal-Sized, Symmetrical Lookup Form */
              /* ============================================================ */
              <form onSubmit={handleLookup}>
                {/* Field 1: Mobile */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 3, lineHeight: 1.3 }}>
                    पंजीकृत 10-अंकीय मोबाइल नंबर <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      maxLength={10}
                      className="devanagari-input"
                      placeholder="उदा. 9829012345"
                      value={lookupPhone}
                      onChange={e => setLookupPhone(e.target.value.replace(/\D/g, ''))}
                      style={{ width: '100%' }}
                      required
                    />
                    <Phone size={15} color="#64748b" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Field 2: MPIN (Always available or conditionally prompted) */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: pinRequiredName ? '#1e3a8a' : '#334155', lineHeight: 1.3 }}>
                      {pinRequiredName ? `सुरक्षा पिन दर्ज करें (${pinRequiredName})` : '4-अंकीय सुरक्षा पिन (यदि सेट किया हो)'}
                    </label>
                    {pinRequiredName && <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>आवश्यक</span>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      maxLength={4}
                      className="devanagari-input"
                      placeholder="उदा. 1234"
                      value={lookupPin}
                      onChange={e => setLookupPin(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '100%',
                        letterSpacing: lookupPin ? '0.25em' : 'normal',
                        borderColor: pinRequiredName ? '#3b82f6' : undefined,
                        backgroundColor: pinRequiredName ? '#eff6ff' : undefined
                      }}
                      autoFocus={!!pinRequiredName}
                    />
                    <KeyRound size={15} color={pinRequiredName ? '#2563eb' : '#64748b'} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Quick Demo Test Chips */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 5 }}>
                    ⚡ त्वरित डेमो खाते (क्लिक करके टेस्ट करें):
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {Object.entries(DEFAULT_MOCK_CITIZENS).map(([ph, c]) => {
                      const isSelected = lookupPhone === ph;
                      return (
                        <button
                          key={ph}
                          type="button"
                          onClick={() => {
                            setLookupPhone(ph);
                            setLookupPin(c.pin || '');
                            setPinRequiredName(c.pin ? c.name : null);
                            setError('');
                          }}
                          style={{
                            background: isSelected ? '#eff6ff' : '#f8fafc',
                            border: `1.5px solid ${isSelected ? '#2563eb' : '#cbd5e1'}`,
                            borderRadius: 6,
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: isSelected ? 800 : 600,
                            cursor: 'pointer',
                            color: isSelected ? '#1d4ed8' : '#334155',
                            transition: 'all 0.1s ease',
                            lineHeight: 1.3
                          }}
                        >
                          {c.name.split(' ')[0]} ({c.pin ? `PIN: ${c.pin}` : 'बिना PIN'})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Informative Civic Feature Strip - Balances height & shapes */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '8px 11px',
                  marginBottom: 12,
                  fontSize: '0.74rem',
                  color: '#475569',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  lineHeight: 1.3
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#1e3a8a' }}>
                    <ClipboardList size={13} color="#2563eb" />
                    <span>खाता खोज से क्या लोड होगा?</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={13} color="#16a34a" />
                    <span>वार्ड की समस्त पूर्व शिकायतें, फोटो व स्थिति रिपोर्ट</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={13} color="#16a34a" />
                    <span>क्षेत्रीय सफाई बीट कर्मी एवं वार्ड पार्षद संपर्क</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    minHeight: 42,
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 9,
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    boxShadow: '0 2px 8px rgba(30,58,138,0.22)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Search size={16} />
                  <span>{loading ? 'खोजा जा रहा है...' : pinRequiredName ? 'पिन सत्यापित करें' : 'खाता खोजें एवं प्रवेश करें'}</span>
                </button>
              </form>
            )}

            {/* Trust strip */}
            <div style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              fontSize: '0.7rem',
              color: '#64748b',
              lineHeight: 1.3
            }}>
              <ShieldCheck size={13} color="#16a34a" />
              <span>सुरक्षित एवं अधिकृत नागरिक सेवा • नगर परिषद चित्तौड़गढ़</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
