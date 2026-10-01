'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ROLE_DEMO_USERS } from '@/lib/authContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import DesktopOnlyGuard from './DesktopOnlyGuard';

// Roles that are strictly laptop/desktop only
const DESKTOP_ROLES = ['chairman'];

// Roles that are mobile-first
const MOBILE_ROLES = ['citizen', 'employee', 'parshad'];

export default function DashboardShell({
  children,
  requiredRole,
  allowedRoles,
  hideBottomNav = false,
  guestMode = false,
  currentProfile,
}) {
  const { profile, loading, switchRole } = useAuth();
  const router = useRouter();

  // If in guest mode, do not assign any profile or role links
  const effectiveProfile = guestMode
    ? null
    : (currentProfile !== undefined
        ? currentProfile
        : ((profile && (!requiredRole || profile.role === requiredRole))
            ? profile
            : (requiredRole && ROLE_DEMO_USERS[requiredRole] ? ROLE_DEMO_USERS[requiredRole] : profile || ROLE_DEMO_USERS.citizen)
          )
      );

  useEffect(() => {
    // Silently synchronize demo session in localStorage ONLY if authenticated
    if (!guestMode && requiredRole && ROLE_DEMO_USERS[requiredRole]) {
      try {
        const stored = localStorage.getItem('sc_demo_session');
        const parsed = stored ? JSON.parse(stored) : null;
        if (!parsed || parsed.role !== requiredRole) {
          localStorage.setItem('sc_demo_session', JSON.stringify(ROLE_DEMO_USERS[requiredRole]));
        }
      } catch (_) {}
    }
  }, [requiredRole, guestMode]);

  const activeRole = guestMode ? 'guest' : (effectiveProfile?.role || requiredRole || 'citizen');
  const isDesktopRole = DESKTOP_ROLES.includes(activeRole);
  const isMobileRole = MOBILE_ROLES.includes(activeRole) || guestMode;

  const content = (
    <div className={`app-shell ${guestMode ? 'guest-mode' : (isMobileRole ? 'mobile-mode' : 'desktop-mode')}`}>
      <Navbar currentProfile={effectiveProfile} guestMode={guestMode} />
      {/* Sidebar is ONLY rendered for desktop administrative roles */}
      {isDesktopRole && !guestMode && <Sidebar currentProfile={effectiveProfile} />}

      <main
        className={`app-main ${guestMode ? 'guest-app-main' : (isMobileRole ? 'mobile-app-main' : 'admin-app-main')}`}
        style={guestMode ? { paddingBottom: 0 } : (isMobileRole && hideBottomNav ? { paddingBottom: '24px' } : undefined)}
      >
        <div className={guestMode ? 'guest-full-container' : (isMobileRole ? 'mobile-container' : 'page-container')}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav for citizen, employee, and parshad */}
      {isMobileRole && !hideBottomNav && !guestMode && <MobileBottomNav role={activeRole} />}
    </div>
  );

  // Wrap in desktop guard if it's an administrative role
  if (isDesktopRole) {
    return <DesktopOnlyGuard role={activeRole}>{content}</DesktopOnlyGuard>;
  }

  return content;
}
