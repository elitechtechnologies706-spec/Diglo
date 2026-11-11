import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// The anon key is public by design; Supabase row-level security must protect write access.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
