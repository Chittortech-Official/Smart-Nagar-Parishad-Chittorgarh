import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://llbyayvgznnbqfnufolt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsYnlheXZnem5uYnFmbnVmb2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwODYwOTYsImV4cCI6MjEwNjY2MjA5Nn0.oY3ZtpvsmtP-g9yLFDJfXoHTzGTiUbWLT_-tl6FdTbU';

// Browser client (use in Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
