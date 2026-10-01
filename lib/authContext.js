'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from './supabaseClient';

// ─── Demo accounts for development (no Supabase required) ─────────────────
const DEMO_USERS = {
  'citizen@demo.in':    { id: 'demo-citizen',  role: 'citizen',     full_name: 'Rajesh Kumar',     ward_id: 'ward-24', department_id: null },
  'employee@demo.in':   { id: 'demo-employee', role: 'employee',    full_name: 'Ramesh Meena',     ward_id: 'ward-24', department_id: 'dept-sanitation' },
  'parshad@demo.in':    { id: 'demo-parshad',  role: 'parshad',     full_name: 'Smt. Kamla Bai',   ward_id: 'ward-24', department_id: null },
  'officer@demo.in':    { id: 'demo-officer',  role: 'officer',     full_name: 'Suresh Sharma',    ward_id: null,      department_id: 'dept-sanitation' },
  'chairman@demo.in':   { id: 'demo-chairman', role: 'chairman',    full_name: 'Prem Singh Ji',    ward_id: null,      department_id: null },
  'admin@demo.in':      { id: 'demo-admin',    role: 'super_admin', full_name: 'System Admin',     ward_id: null,      department_id: null },
};

const DEMO_PASSWORD = 'demo1234';

const ROLE_HOME = {
  citizen:     '/citizen',
  employee:    '/employee',
  parshad:     '/parshad',
  officer:     '/officer',
  chairman:    '/chairman',
  super_admin: '/admin',
};

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load session on mount ────────────────────────────────────────────────
  useEffect(() => {
    // Check localStorage for demo session first
    const stored = localStorage.getItem('sc_demo_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ id: parsed.id, email: parsed.email });
        setProfile(parsed);
        setLoading(false);
        return;
      } catch (_) {}
    }

    // Otherwise check real Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  }

  // ── Login ────────────────────────────────────────────────────────────────
  async function login(email, password) {
    const emailLower = email.toLowerCase().trim();

    // Demo mode
    if (DEMO_USERS[emailLower] && password === DEMO_PASSWORD) {
      const demoProfile = { ...DEMO_USERS[emailLower], email: emailLower };
      localStorage.setItem('sc_demo_session', JSON.stringify(demoProfile));
      setUser({ id: demoProfile.id, email: emailLower });
      setProfile(demoProfile);
      return { error: null, role: demoProfile.role };
    }

    // Real Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    await loadProfile(data.user.id);
    return { error: null };
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async function logout() {
    localStorage.removeItem('sc_demo_session');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  }

  // ── Quick role switcher (dev only) ───────────────────────────────────────
  function switchRole(email) {
    if (DEMO_USERS[email]) {
      const demoProfile = { ...DEMO_USERS[email], email };
      localStorage.setItem('sc_demo_session', JSON.stringify(demoProfile));
      setUser({ id: demoProfile.id, email });
      setProfile(demoProfile);
      router.push(ROLE_HOME[demoProfile.role]);
    }
  }

  const role = profile?.role || null;

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, login, logout, switchRole, ROLE_HOME }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
