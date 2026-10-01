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
    // If testing in demo mode and visiting a specific role route, synchronize session if needed
    if (requiredRole && ROLE_DEMO_USERS[requiredRole]) {
      if (!profile || profile.role !== requiredRole) {
        switchRole(ROLE_DEMO_USERS[requiredRole].email);
      }
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
