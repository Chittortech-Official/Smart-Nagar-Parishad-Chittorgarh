'use client';

export default function ChittorgarhLogo({ size = 32, showText = true, layout = 'horizontal', compact = false }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      flexDirection: layout === 'vertical' ? 'column' : 'row',
      textAlign: layout === 'vertical' ? 'center' : 'left',
      minWidth: 0,
    }}>
      {/* Official Emblem: Chittorgarh Vijay Stambh */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <circle cx="60" cy="60" r="58" fill="#ffffff" stroke="#c2410c" strokeWidth="3" />
        <circle cx="60" cy="60" r="54" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="47" fill="#1e3a8a" />

        {/* Base steps */}
        <rect x="36" y="94" width="48" height="6" rx="1.5" fill="#fef08a" />
        <rect x="40" y="89" width="40" height="5" rx="1" fill="#fde047" />
        <rect x="44" y="85" width="32" height="4" rx="1" fill="#facc15" />

        {/* Tiers */}
        <path d="M46 85 L48 72 L72 72 L74 85 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <rect x="44" y="70" width="32" height="2.5" rx="0.5" fill="#fde047" />
        <path d="M49 70 L51 57 L69 57 L71 70 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <rect x="47" y="55" width="26" height="2.5" rx="0.5" fill="#fde047" />
        <path d="M51 55 L53 43 L67 43 L69 55 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <rect x="49" y="41" width="22" height="2.5" rx="0.5" fill="#fde047" />
        <path d="M53 41 L54 30 L66 30 L67 41 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M51 30 Q60 22 69 30 Z" fill="#eab308" />
        <line x1="60" y1="23" x2="60" y2="16" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="15" r="2.5" fill="#f59e0b" />

        {/* Windows */}
        <rect x="58" y="76" width="4" height="6" rx="2" fill="#1e3a8a" />
        <rect x="58" y="61" width="4" height="6" rx="2" fill="#1e3a8a" />
        <rect x="58" y="47" width="4" height="5" rx="2" fill="#1e3a8a" />
        <rect x="58" y="33" width="4" height="4" rx="2" fill="#1e3a8a" />

        <polygon points="26,60 28,64 33,64 29,67 31,72 26,69 22,72 24,67 20,64 25,64" fill="#fde047" />
        <polygon points="94,60 96,64 101,64 97,67 99,72 94,69 90,72 92,67 88,64 93,64" fill="#fde047" />
        <path d="M22 96 Q60 114 98 96" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      {/* Title */}
      {showText && (
        <div style={{ lineHeight: 1.15, minWidth: 0 }}>
          <div style={{
            fontSize: size >= 48 ? '1.15rem' : '0.875rem',
            fontWeight: 800,
            color: '#1e3a8a',
            fontFamily: 'var(--font-heading)',
            whiteSpace: 'nowrap',
          }}>
            नगर परिषद चित्तौड़गढ़
          </div>
          {!compact && (
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#c2410c',
              whiteSpace: 'nowrap',
            }}>
              Municipal Council Chittorgarh
            </div>
          )}
          {layout === 'vertical' && (
            <div style={{
              fontSize: '0.6875rem',
              color: '#64748b',
              marginTop: 2,
            }}>
              स्वायत्त शासन विभाग, राजस्थान सरकार
            </div>
          )}
        </div>
      )}
    </div>
  );
}
