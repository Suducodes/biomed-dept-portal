import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The portal runs in two modes:
//  - "live"  : real Supabase project configured -> data + auth + storage.
//  - "demo"  : no env vars yet -> pages render from bundled sample data,
//              admin login is disabled. Lets us build/preview with zero setup.
export const isLive = Boolean(url && anonKey);

export const supabase = isLive ? createClient(url, anonKey) : null;
