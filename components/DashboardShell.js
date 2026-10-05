'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ROLE_DEMO_USERS } from '@/lib/authContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import DesktopOnlyGuard from './DesktopOnlyGuard';
import GovLoadingScreen from './GovLoadingScreen';

// Roles that are strictly laptop/desktop only
const DESKTOP_ROLES = ['chairman'];

// Roles that are mobile-first
const MOBILE_ROLES = ['citizen', 'employee', 'parshad'];

const ROLE_LOADING_MESSAGES = {
  citizen: 'नागरिक पोर्टल लोड हो रहा है...',
  parshad: 'वार्ड पार्षद निगरानी पोर्टल लोड हो रहा है...',
  employee: 'कर्मचारी हाजिरी व कार्य पोर्टल लोड हो रहा है...',
};

export default function DashboardShell({
  children,
  requiredRole,
  allowedRoles,
  hideBottomNav = false,
  guestMode = false,
  currentProfile,
  loadingMessage,
}) {
  const { profile, loading, switchRole } = useAuth();
  const router = useRouter();
  const [shellMounted, setShellMounted] = useState(false);

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

  const activeRole = guestMode ? 'guest' : (effectiveProfile?.role || requiredRole || 'citizen');
  const isDesktopRole = DESKTOP_ROLES.includes(activeRole);
  const isMobileRole = MOBILE_ROLES.includes(activeRole) || guestMode;

  useEffect(() => {
    // Role Gate: Only citizens can browse publicly.
    // Parshad, Employee, and Chairman portals require prior login via /demo!
    if (!guestMode && requiredRole && requiredRole !== 'citizen') {
      try {
        const stored = localStorage.getItem('sc_demo_session');
        const parsed = stored ? JSON.parse(stored) : null;
        if (!parsed || parsed.role !== requiredRole) {
          router.replace('/citizen');
          return;
        }
      } catch (_) {
        router.replace('/citizen');
        return;
      }
    }

    // Official government emblem loading screen for all mobile views
    const timer = setTimeout(() => {
      setShellMounted(true);
    }, 1600);

    return () => clearTimeout(timer);
  }, [requiredRole, guestMode, router]);

  // Render official Rajasthan emblem loading screen across all mobile panels
  if (isMobileRole && !shellMounted) {
    const displayMsg = loadingMessage || ROLE_LOADING_MESSAGES[activeRole] || 'पोर्टल लोड हो रहा है...';
    return (
      <div className={`app-shell ${guestMode ? 'guest-mode' : 'mobile-mode'}`}>
        <Navbar currentProfile={effectiveProfile} guestMode={guestMode} />
        <main className="app-main mobile-app-main">
          <GovLoadingScreen message={displayMsg} />
        </main>
      </div>
    );
  }

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
