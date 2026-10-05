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
      {/* Official Emblem: Government of Rajasthan */}
      <img
        src="/logo.png"
        alt="Government of Rajasthan - नगर परिषद चित्तौड़गढ़"
        width={Math.round(size * (863 / 625))}
        height={size}
        style={{
          height: size,
          width: 'auto',
          maxHeight: size,
          objectFit: 'contain',
          flexShrink: 0,
          display: 'block',
        }}
      />

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
