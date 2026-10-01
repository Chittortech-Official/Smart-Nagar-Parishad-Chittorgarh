'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OfficerComplaintsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/citizen');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b', fontSize: '0.9rem' }}>
      नागरिक पोर्टल पर अग्रसारित किया जा रहा है...
    </div>
  );
}
