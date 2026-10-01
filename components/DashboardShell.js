'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ROLE_DEMO_USERS } from '@/lib/authContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import DesktopOnlyGuard from './DesktopOnlyGuard';

// Roles that are strictly laptop/desktop only
const DESKTOP_ROLES = ['chairman', 'officer'];

// Roles that are mobile-first
const MOBILE_ROLES = ['citizen', 'employee', 'parshad'];

export default function DashboardShell({ children, requiredRole, allowedRoles }) {
  const { profile, loading, switchRole } = useAuth();
  const router = useRouter();

  // If a page requires a specific role, derive an effective profile so side-by-side tabs don't clash
  const effectiveProfile = (profile && (!requiredRole || profile.role === requiredRole))
    ? profile
    : (requiredRole && ROLE_DEMO_USERS[requiredRole] ? ROLE_DEMO_USERS[requiredRole] : profile || ROLE_DEMO_USERS.citizen);

  useEffect(() => {
    // Silently synchronize demo session in localStorage without router.push reload loops
    if (requiredRole && ROLE_DEMO_USERS[requiredRole]) {
      try {
        const stored = localStorage.getItem('sc_demo_session');
        const parsed = stored ? JSON.parse(stored) : null;
        if (!parsed || parsed.role !== requiredRole) {
          localStorage.setItem('sc_demo_session', JSON.stringify(ROLE_DEMO_USERS[requiredRole]));
        }
      } catch (_) {}
    }
  }, [requiredRole]);

  const activeRole = effectiveProfile?.role || requiredRole || 'citizen';
  const isDesktopRole = DESKTOP_ROLES.includes(activeRole);
  const isMobileRole = MOBILE_ROLES.includes(activeRole);

  const content = (
    <div className={`app-shell ${isMobileRole ? 'mobile-mode' : 'desktop-mode'}`}>
      <Navbar currentProfile={effectiveProfile} />
      {/* Sidebar is ONLY rendered for desktop administrative roles */}
      {isDesktopRole && <Sidebar currentProfile={effectiveProfile} />}

      <main className={`app-main ${isMobileRole ? 'mobile-app-main' : 'admin-app-main'}`}>
        <div className={isMobileRole ? 'mobile-container' : 'page-container'}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav for citizen, employee, and parshad */}
      {isMobileRole && <MobileBottomNav role={activeRole} />}
    </div>
  );

  // Wrap in desktop guard if it's an administrative role
  if (isDesktopRole) {
    return <DesktopOnlyGuard role={activeRole}>{content}</DesktopOnlyGuard>;
  }

  return content;
}
