'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Normal public traffic to /login redirects to Citizen Portal
    // Demo login is exclusively accessed via /demo
    router.replace('/citizen');
  }, [router]);

  return null;
}
