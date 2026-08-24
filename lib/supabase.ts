import { createBrowserClient } from '@supabase/ssr';
export function browserSupabase(){ const u=process.env.NEXT_PUBLIC_SUPABASE_URL; const k=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; if(!u||!k) return null; return createBrowserClient(u,k); }
