'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OfficerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/router');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b', fontSize: '0.9rem' }}>
      कंट्रोल रूम राउटर कंसोल पर अग्रसारित किया जा रहा है...
    </div>
  );
}
