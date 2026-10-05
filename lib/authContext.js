'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from './supabaseClient';

// ─── Demo accounts for development (no Supabase required) ─────────────────
export const ROLE_DEMO_USERS = {
  citizen:     { id: 'demo-citizen',  role: 'citizen',     email: 'citizen@demo.in',  full_name: 'राजेश कुमार (नागरिक)',      ward_id: 'ward-24', department_id: null },
  employee:    { id: 'demo-employee', role: 'employee',    email: 'employee@demo.in', full_name: 'रमेश मीणा (कर्मचारी)',     ward_id: 'ward-24', department_id: 'dept-sanitation' },
  parshad:     { id: 'demo-parshad',  role: 'parshad',     email: 'parshad@demo.in',  full_name: 'श्रीमती कुसुम (पार्षद - भाजपा)', ward_id: 'ward-24', department_id: null },
  chairman:    { id: 'demo-chairman', role: 'chairman',    email: 'chairman@demo.in', full_name: 'श्री अनिल जी ईनाणी (सभापति)', ward_id: null, department_id: null },
};

export const DEMO_USERS = {
  'citizen@demo.in':    ROLE_DEMO_USERS.citizen,
  'employee@demo.in':   ROLE_DEMO_USERS.employee,
  'parshad@demo.in':    ROLE_DEMO_USERS.parshad,
  'chairman@demo.in':   ROLE_DEMO_USERS.chairman,
  'admin@demo.in':      ROLE_DEMO_USERS.chairman, // Alias for chairman
};

export const DEMO_PASSWORD = 'demo1234';

export const ROLE_HOME = {
  citizen:     '/citizen',
  employee:    '/employee',
  parshad:     '/parshad',
  chairman:    '/chairman',
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
        const canonical = ROLE_DEMO_USERS[parsed.role] ? { ...ROLE_DEMO_USERS[parsed.role], ...parsed, full_name: ROLE_DEMO_USERS[parsed.role].full_name } : parsed;
        setUser({ id: canonical.id, email: canonical.email });
        setProfile(canonical);
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
