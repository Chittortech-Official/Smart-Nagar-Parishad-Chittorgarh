'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChairmanMapRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/chairman');
  }, [router]);

  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>डैशबोर्ड पर पुनः प्रेषित किया जा रहा है...</p>
    </div>
  );
}
