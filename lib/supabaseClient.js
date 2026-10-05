import { createClient } from '@supabase/supabase-js';

const REAL_SUPABASE_URL = 'https://llbyayvgznnbqfnufolt.supabase.co';
const REAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsYnlheXZnem5uYnFmbnVmb2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwODYwOTYsImV4cCI6MjEwNjY2MjA5Nn0.oY3ZtpvsmtP-g9yLFDJfXoHTzGTiUbWLT_-tl6FdTbU';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard against dummy / placeholder environment variables configured on Vercel
const supabaseUrl = (rawUrl && !rawUrl.includes('placeholder') && !rawUrl.includes('your-project') && rawUrl.startsWith('http'))
  ? rawUrl
  : REAL_SUPABASE_URL;

const supabaseAnonKey = (rawKey && !rawKey.includes('placeholder') && rawKey.startsWith('eyJ') && rawKey.length > 50)
  ? rawKey
  : REAL_SUPABASE_ANON_KEY;

// Browser client (use in Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;

