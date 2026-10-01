'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  Camera, MapPin, Send, AlertCircle, Trash2,
  Waves, Construction, Zap, TreePine, PawPrint,
  HelpCircle, Droplets, Building, ChevronLeft, CheckCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'कचरा / सफाई',       en: 'Garbage / Cleanliness', icon: Trash2,       color: '#16a34a', dept: 'स्वास्थ्य एवं स्वच्छता शाखा', time: '24 घंटे' },
  { id: 2, name: 'नाली / सीवरेज',      en: 'Drainage / Sewerage',   icon: Waves,        color: '#0284c7', dept: 'स्वास्थ्य एवं स्वच्छता शाखा', time: '48 घंटे' },
  { id: 3, name: 'सड़क / गड्ढा',       en: 'Road / Pothole',        icon: Construction, color: '#2563eb', dept: 'इंजीनियरिंग शाखा',          time: '72 घंटे' },
  { id: 4, name: 'पेयजल समस्या',       en: 'Water Supply',          icon: Droplets,     color: '#0891b2', dept: 'जल प्रदाय अनुभाग',          time: '24 घंटे' },
  { id: 5, name: 'स्ट्रीट लाइट',       en: 'Street Light',          icon: Zap,          color: '#d97706', dept: 'विद्युत अनुभाग',            time: '48 घंटे' },
  { id: 6, name: 'पार्क एवं उद्यान',    en: 'Public Park',           icon: TreePine,     color: '#65a30d', dept: 'उद्यान विकास शाखा',        time: '96 घंटे' },
  { id: 7, name: 'अतिक्रमण / अवैध',    en: 'Encroachment',          icon: Building,     color: '#7c3aed', dept: 'राजस्व शाखा',              time: '72 घंटे' },
  { id: 8, name: 'आवारा पशु नियंत्रण',  en: 'Stray Animals',         icon: PawPrint,     color: '#c026d3', dept: 'पशु नियंत्रण शाखा',         time: '48 घंटे' },
  { id: 9, name: 'अन्य नागरिक समस्या', en: 'Other Civic Issue',     icon: HelpCircle,   color: '#475569', dept: 'सामान्य प्रशासन',           time: '72 घंटे' },
];

const WARDS = Array.from({ length: 60 }, (_, i) => ({ id: i + 1, label: `वार्ड नं. ${i + 1}` }));

export default function ReportPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ward, setWard]         = useState('24');
  const [description, setDesc]  = useState('');
  const [photo, setPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError]     = useState('');
  const [locating, setLocating] = useState(false);
  const [address, setAddress]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complaint, setComplaint] = useState(null);

  // Automatically scroll to the top whenever moving between form steps or to the success screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [step]);

  function handlePhoto(e) {
    const f = e.target.files[0];
    if (!f) return;

    // Strict 100 KB limit as requested
    if (f.size > 100 * 1024) {
      setPhotoError(`फोटो का आकार ${Math.round(f.size / 1024)} KB है। अधिकतम सीमा 100 KB है।`);
      setPhoto(null);
      setPhotoPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setPhotoError('');
    setPhoto(f);
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  function detectLocation() {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setAddress(`अक्षांश: ${pos.coords.latitude.toFixed(4)}, देशांतर: ${pos.coords.longitude.toFixed(4)} (चित्तौड़गढ़)`);
        setLocating(false);
      },
      () => { setLocating(false); }
    );
  }

  async function handleSubmit() {
    if (!selectedCategory || !ward) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    const seq = Math.floor(Math.random() * 900) + 100;
    const generatedCode = `CTNP-2026-${String(seq).padStart(6,'0')}`;
    const newEntry = {
      id: Date.now(),
      code: generatedCode,
      category: `${selectedCategory.name} (${selectedCategory.en})`,
      ward: `वार्ड ${ward}`,
      dept: selectedCategory.dept,
      status: 'submitted',
      date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      sla: selectedCategory.time,
      statusDetail: 'शिकायत दर्ज — संबंधित शाखा को कार्य आवंटन प्रक्रियाधीन है।',
      description: description || 'नागरिक द्वारा प्रस्तुत वार्ड समस्या का विवरण।',
      location: address || `वार्ड नं. ${ward}, चित्तौड़गढ़`,
      photo: photoPreview || null,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('chittorgarh_citizen_complaints') || '[]');
      localStorage.setItem('chittorgarh_citizen_complaints', JSON.stringify([newEntry, ...existing]));
    } catch (_) {}

    setComplaint({
      code: generatedCode,
      category: `${selectedCategory.name} (${selectedCategory.en})`,
      ward: `वार्ड नं. ${ward}`,
      dept: selectedCategory.dept,
      time: selectedCategory.time,
      status: 'दर्ज (Submitted)',
    });
    setSubmitting(false);
    setStep(3);
  }

  // STEP 3: Success Screen
  if (step === 3 && complaint) {
    return (
      <DashboardShell requiredRole="citizen">
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 'var(--space-2)', paddingBottom: '60px' }}>
          <div style={{
            width: 72, height: 72, background: '#dcfce7',
            border: '2px solid #86efac', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}>
            <CheckCircle size={38} color="#16a34a" />
          </div>
          <h2 style={{ marginBottom: 6, color: '#166534', fontWeight: 800 }}>
            शिकायत सफलतापूर्वक दर्ज!
          </h2>
          <p style={{ marginBottom: 'var(--space-5)', color: '#475569', fontSize: '0.9rem' }}>
            आपकी शिकायत नगर परिषद चित्तौड़गढ़ के संबंधित विभाग को प्रेषित कर दी गई है।
          </p>

          <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--space-5)' }}>
            {[
              ['शिकायत क्रमांक (ID)', complaint.code],
              ['वार्ड (Ward)', complaint.ward],
              ['समस्या श्रेणी', complaint.category],
              ['संबंधित शाखा', complaint.dept],
              ['अनुमानित समाधान समय', complaint.time],
              ['स्थिति (Status)', complaint.status],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ fontWeight: 700, color: label.includes('ID') ? '#1e3a8a' : '#0f172a', fontSize: '0.875rem' }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
            <button className="btn btn-primary btn-lg" onClick={() => router.push('/citizen/complaints')}>
              शिकायत की स्थिति ट्रैक करें
            </button>
            <button className="btn btn-ghost" onClick={() => { setStep(1); setSelectedCategory(null); setPhoto(null); setPhotoPreview(null); setDesc(''); }}>
              अन्य समस्या दर्ज करें
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell requiredRole="citizen">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Breadcrumb Navigation on Desktop */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#64748b', marginBottom: 12 }}>
          <Link href="/citizen" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>नागरिक मुख्य पृष्ठ</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>नई समस्या दर्ज करें</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
          {step === 2 && (
            <button className="btn btn-ghost btn-icon" onClick={() => setStep(1)} title="श्रेणी पर लौटें">
              <ChevronLeft size={22} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              {step === 1 ? 'समस्या की श्रेणी चुनें (Select Category)' : `${selectedCategory?.name}`}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              {step === 1 ? 'चित्तौड़गढ़ नगर परिषद क्षेत्र की नागरिक समस्या दर्ज करने हेतु संबंधित वर्ग चुनें' : 'वार्ड का चयन करें, विवरण और फोटो (वैकल्पिक) जोड़ें'}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-6)' }}>
          {['१. श्रेणी चयन', '२. विवरण, वार्ड व फोटो', '३. पावती रसीद'].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 5, borderRadius: 3, background: i < step ? '#15803d' : '#e2e8f0', transition: 'background 0.3s', marginBottom: 5 }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: i < step ? '#15803d' : '#94a3b8' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Categories Responsive Grid */}
        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: 14
          }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`category-${cat.id}`}
                  onClick={() => { setSelectedCategory(cat); setStep(2); }}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 14,
                    padding: '18px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'; }}
                >
                  <div style={{ width: 48, height: 48, background: `${cat.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>{cat.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>{cat.en}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '3px 10px', borderRadius: 9999 }}>
                    अनुमानित समय: {cat.time}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: Responsive Form (1 Column Mobile, 2 Column Desktop) */}
        {step === 2 && selectedCategory && (
          <div className="card" style={{ padding: '20px 16px', background: '#ffffff', marginBottom: '40px' }}>
            <div className="report-form-grid">
              {/* Left Column: Category Summary & Ward Location */}
              <div>
                {/* Selected category preview */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 18,
                }}>
                  <div style={{ width: 44, height: 44, background: `${selectedCategory.color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <selectedCategory.icon size={22} style={{ color: selectedCategory.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.98rem' }}>{selectedCategory.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{selectedCategory.dept}</div>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: 2 }}>अनुमानित समय: {selectedCategory.time}</div>
                  </div>
                </div>

                {/* Ward Selection */}
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label htmlFor="ward-select" className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                      वार्ड चयन करें (Ward Number) *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 999 }}>
                      वार्ड 24 (आपका वार्ड)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                      <select
                        id="ward-select"
                        className="form-select"
                        value={ward}
                        onChange={e => setWard(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#1e3a8a',
                          background: '#ffffff',
                          borderRadius: 8,
                          border: '1.5px solid #cbd5e1',
                          outline: 'none',
                        }}
                      >
                        {WARDS.map(w => (
                          <option key={w.id} value={w.id}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={detectLocation}
                      disabled={locating}
                      style={{
                        flexShrink: 0,
                        padding: '9px 12px',
                        border: '1.5px solid #fed7aa',
                        borderRadius: 8,
                        background: '#fff7ed',
                        color: '#c2410c',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      title="GPS से वर्तमान स्थान प्राप्त करें"
                    >
                      <MapPin size={15} color="#ea580c" />
                      <span>{locating ? 'खोज...' : 'GPS'}</span>
                    </button>
                  </div>
                  {address && <p className="form-hint" style={{ color: '#15803d', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>📍 {address}</p>}
                </div>

                {/* Info Note */}
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 14px', fontSize: '0.78rem', color: '#1e40af' }}>
                  💡 <strong>सुझाव:</strong> शिकायत दर्ज होते ही आपके वार्ड के सफाई दल को तुरंत कार्य आवंटित हो जाएगा।
                </div>
              </div>

              {/* Right Column: Photo & Description & Action */}
              <div>
                {/* Photo upload with 100 KB max limit */}
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    समस्या स्थल की फोटो (वैकल्पिक — अधिकतम 100 KB)
                  </label>
                  <div
                    className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    style={{ padding: photoPreview ? 0 : '20px 16px', background: '#f8fafc', borderRadius: 12, border: '2px dashed #cbd5e1', cursor: 'pointer', textAlign: 'center' }}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="photo-preview" style={{ maxHeight: 180, width: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    ) : (
                      <>
                        <div style={{ width: 44, height: 44, background: '#e0f2fe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                          <Camera size={22} color="#0284c7" />
                        </div>
                        <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.875rem' }}>फोटो खींचें या अपलोड करें</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>कैमरा अथवा गैलरी से चुनें (अधिकतम 100 KB)</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />

                  {photoError && (
                    <div style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, marginTop: 8, background: '#fef2f2', padding: '8px 12px', borderRadius: 8, border: '1px solid #fecaca' }}>
                      ⚠️ {photoError}
                    </div>
                  )}

                  {photo && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ फोटो चयनित ({Math.round(photo.size / 1024)} KB)</span>
                      <button type="button" className="btn btn-ghost" style={{ fontSize: '0.72rem', color: '#dc2626', padding: '2px 8px' }} onClick={() => { setPhoto(null); setPhotoPreview(null); setPhotoError(''); }}>
                        फोटो हटाएं
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>समस्या का संक्षिप्त विवरण (Landmark & Details)</label>
                  <textarea
                    id="description-input"
                    className="form-textarea"
                    placeholder="निकटतम लैंडमार्क, मकान नंबर या समस्या का विवरण लिखें..."
                    value={description}
                    onChange={e => setDesc(e.target.value)}
                    rows={3}
                    style={{ padding: '10px 12px' }}
                  />
                </div>

                {/* Submit Button with clean padding and margin */}
                <button
                  id="submit-complaint-btn"
                  className="btn btn-primary btn-xl"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '0.98rem', marginTop: 6, marginBottom: '20px' }}
                >
                  {submitting ? (
                    <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> शिकायत दर्ज की जा रही है...</>
                  ) : (
                    <><Send size={18} /> शिकायत दर्ज करें (Submit)</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
