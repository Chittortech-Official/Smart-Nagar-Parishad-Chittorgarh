'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GovLoadingScreen from '@/components/GovLoadingScreen';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Primary main landing page is the Citizen Portal - display emblem for at least 2.2s
    const timer = setTimeout(() => {
      router.replace('/citizen');
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f8fafc',
    }}>
      <GovLoadingScreen
        message="नगर परिषद चित्तौड़गढ़ पोर्टल लोड हो रहा है..."
        subtext="स्वायत्त शासन विभाग, राजस्थान सरकार"
      />
    </div>
  );
}

