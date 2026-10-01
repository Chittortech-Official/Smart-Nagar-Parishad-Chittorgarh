'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  Camera, MapPin, Send, AlertCircle, Trash2,
  Waves, Construction, Zap, TreePine, PawPrint,
  HelpCircle, Droplets, Building, ChevronLeft, CheckCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'कचरा / सफाई',       en: 'Garbage / Cleanliness', icon: Trash2,       color: '#16a34a', dept: 'स्वास्थ्य एवं स्वच्छता विभाग', sla: '24 घंटे' },
  { id: 2, name: 'नाली / सीवरेज',      en: 'Drainage / Sewerage',   icon: Waves,        color: '#0284c7', dept: 'स्वास्थ्य एवं स्वच्छता विभाग', sla: '48 घंटे' },
  { id: 3, name: 'सड़क / गड्ढा',       en: 'Road / Pothole',        icon: Construction, color: '#2563eb', dept: 'निर्माण / इंजीनियरिंग विभाग', sla: '72 घंटे' },
  { id: 4, name: 'पेयजल समस्या',       en: 'Water Supply',          icon: Droplets,     color: '#0891b2', dept: 'जल प्रदाय अनुभाग',          sla: '24 घंटे' },
  { id: 5, name: 'स्ट्रीट लाइट',       en: 'Street Light',          icon: Zap,          color: '#d97706', dept: 'विद्युत अनुभाग',            sla: '48 घंटे' },
  { id: 6, name: 'पार्क एवं उद्यान',    en: 'Public Park',           icon: TreePine,     color: '#65a30d', dept: 'उद्यान विकास विभाग',        sla: '96 घंटे' },
  { id: 7, name: 'अतिक्रमण / अवैध',    en: 'Encroachment',          icon: Building,     color: '#7c3aed', dept: 'राजस्व एवं विधिक शाखा',     sla: '72 घंटे' },
  { id: 8, name: 'आवारा पशु नियंत्रण',  en: 'Stray Animals',         icon: PawPrint,     color: '#c026d3', dept: 'पशु नियंत्रण शाखा',         sla: '48 घंटे' },
  { id: 9, name: 'अन्य नागरिक समस्या', en: 'Other Civic Issue',     icon: HelpCircle,   color: '#475569', dept: 'सामान्य प्रशासन विभाग',       sla: '72 घंटे' },
];

const WARDS = Array.from({ length: 60 }, (_, i) => ({ id: i + 1, label: `वार्ड संख्या ${i + 1} (Ward ${i + 1})` }));

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
  const [locating, setLocating] = useState(false);
  const [address, setAddress]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complaint, setComplaint] = useState(null);

  function handlePhoto(e) {
    const f = e.target.files[0];
    if (!f) return;
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
    await new Promise(r => setTimeout(r, 1200));
    const seq = Math.floor(Math.random() * 900) + 100;
    setComplaint({
      code: `CTNP-2026-${String(seq).padStart(6,'0')}`,
      category: `${selectedCategory.name} (${selectedCategory.en})`,
      ward: `वार्ड नं. ${ward}`,
      dept: selectedCategory.dept,
      sla: selectedCategory.sla,
      status: 'दर्ज (Submitted)',
    });
    setSubmitting(false);
    setStep(3);
  }

  // STEP 3: Success Screen
  if (step === 3 && complaint) {
    return (
      <DashboardShell requiredRole="citizen">
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 'var(--space-4)' }}>
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
              ['संबंधित विभाग', complaint.dept],
              ['अनुमानित समाधान समय', complaint.sla],
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
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
          {step === 2 && (
            <button className="btn btn-ghost btn-icon" onClick={() => setStep(1)}>
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.35rem', color: '#1e3a8a', marginBottom: 2 }}>
              {step === 1 ? 'समस्या की श्रेणी चुनें' : `${selectedCategory?.name}`}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              {step === 1 ? 'चित्तौड़गढ़ नगर परिषद क्षेत्र की नागरिक समस्या रिपोर्ट करें' : 'विवरण और फोटो (वैकल्पिक) जोड़ें'}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-4)' }}>
          {['1. श्रेणी चयन', '2. विवरण व फोटो', '3. रसीद'].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ height: 4, borderRadius: 2, background: i < step ? '#15803d' : '#e2e8f0', transition: 'background 0.3s', marginBottom: 4 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: i < step ? '#15803d' : '#94a3b8' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Categories */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`category-${cat.id}`}
                  onClick={() => { setSelectedCategory(cat); setStep(2); }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 14,
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'; }}
                >
                  <div style={{ width: 44, height: 44, background: `${cat.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>{cat.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{cat.en}</div>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 9999 }}>
                    निस्तारण: {cat.sla}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && selectedCategory && (
          <div className="card" style={{ padding: '20px' }}>
            {/* Selected category preview */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}>
              <div style={{ width: 38, height: 38, background: `${selectedCategory.color}20`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <selectedCategory.icon size={20} style={{ color: selectedCategory.color }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem' }}>{selectedCategory.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>विभाग: {selectedCategory.dept} • समय: {selectedCategory.sla}</div>
              </div>
            </div>

            {/* Ward */}
            <div className="form-group">
              <label className="form-label">वार्ड चयन करें (Select Ward) *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select id="ward-select" className="form-select" value={ward} onChange={e => setWard(e.target.value)}>
                  {WARDS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                </select>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={detectLocation}
                  disabled={locating}
                  style={{ flexShrink: 0 }}
                  title="GPS से स्थान प्राप्त करें"
                >
                  <MapPin size={16} color="#ea580c" />
                  <span>{locating ? 'खोज...' : 'GPS'}</span>
                </button>
              </div>
              {address && <p className="form-hint" style={{ color: '#15803d' }}>📍 {address}</p>}
            </div>

            {/* Photo upload */}
            <div className="form-group">
              <label className="form-label">घटना स्थल की फोटो (Photo - Optional)</label>
              <div
                className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`}
                onClick={() => fileRef.current?.click()}
                style={{ padding: photoPreview ? 0 : '24px 16px', background: '#f8fafc' }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="photo-preview" />
                ) : (
                  <>
                    <div style={{ width: 44, height: 44, background: '#e0f2fe', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={22} color="#0284c7" />
                    </div>
                    <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '0.875rem' }}>फोटो खींचें या अपलोड करें</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>कैमरा अथवा गैलरी से सेलेक्ट करें</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />
              {photoPreview && (
                <button className="btn btn-ghost" style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626' }} onClick={() => { setPhoto(null); setPhotoPreview(null); }}>
                  फोटो हटाएं
                </button>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">समस्या का संक्षिप्त विवरण (Description)</label>
              <textarea
                id="description-input"
                className="form-textarea"
                placeholder="स्थान का लैंडमार्क या समस्या की स्थिति बताएं..."
                value={description}
                onChange={e => setDesc(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit */}
            <button
              id="submit-complaint-btn"
              className="btn btn-primary btn-xl"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> शिकायत दर्ज की जा रही है...</>
              ) : (
                <><Send size={18} /> शिकायत दर्ज करें (Submit)</>
              )}
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
