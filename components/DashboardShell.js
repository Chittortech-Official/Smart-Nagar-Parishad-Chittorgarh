'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import DesktopOnlyGuard from './DesktopOnlyGuard';

// Roles that are strictly laptop/desktop only
const DESKTOP_ROLES = ['super_admin', 'chairman', 'officer'];

// Roles that are mobile-first
const MOBILE_ROLES = ['citizen', 'employee', 'parshad'];

export default function DashboardShell({ children, requiredRole, allowedRoles }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!profile) { router.replace('/login'); return; }
      const allowed = allowedRoles || (requiredRole ? [requiredRole] : null);
      if (allowed && !allowed.includes(profile.role)) {
        const paths = {
          citizen: '/citizen',
          employee: '/employee',
          parshad: '/parshad',
          officer: '/officer',
          chairman: '/chairman',
          super_admin: '/admin'
        };
        router.replace(paths[profile.role] || '/login');
      }
    }
  }, [profile, loading]);

  if (loading || !profile) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>लोड हो रहा है... (Loading Smart Chittorgarh)</p>
      </div>
    );
  }

  const isDesktopRole = DESKTOP_ROLES.includes(profile.role);
  const isMobileRole = MOBILE_ROLES.includes(profile.role);

  const content = (
    <div className={`app-shell ${isMobileRole ? 'mobile-mode' : 'desktop-mode'}`}>
      <Navbar />
      {/* Sidebar is ONLY rendered for desktop administrative roles */}
      {isDesktopRole && <Sidebar />}

      <main className={`app-main ${isMobileRole ? 'mobile-app-main' : 'admin-app-main'}`}>
        <div className={isMobileRole ? 'mobile-container' : 'page-container'}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav for citizen, employee, and parshad */}
      {isMobileRole && <MobileBottomNav role={profile.role} />}
    </div>
  );

  // Wrap in desktop guard if it's an administrative role
  if (isDesktopRole) {
    return <DesktopOnlyGuard role={profile.role}>{content}</DesktopOnlyGuard>;
  }

  return content;
}
