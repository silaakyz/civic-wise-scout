// Supabase integration disabled — stub implementation

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Debug: Supabase bağlantı bilgilerini kontrol et
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('⚠️ Supabase environment variables eksik!');
  console.warn('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.warn('VITE_SUPABASE_PUBLISHABLE_KEY:', SUPABASE_PUBLISHABLE_KEY ? '✓' : '✗');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Supabase client DISABLED per user request — safe no-op stub
// This replaces the real client to fully disconnect Supabase from the codebase.
// Functions return predictable errors or null data and log a warning so the app
// can continue to run without throwing at import-time.

/* eslint-disable @typescript-eslint/no-explicit-any */

export const supabase: any = {
  auth: {
    async getSession() {
      console.warn('[supabase stub] getSession called — Supabase disabled');
      return { data: { session: null }, error: null };
    },
    onAuthStateChange(_callback: (event: string, session: any) => void) {
      console.warn('[supabase stub] onAuthStateChange registered — Supabase disabled');
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signInWithPassword() {
      console.warn('[supabase stub] signInWithPassword called — Supabase disabled');
      return { data: null, error: new Error('Supabase disabled') };
    },
    async signUp() {
      console.warn('[supabase stub] signUp called — Supabase disabled');
      return { data: null, error: new Error('Supabase disabled') };
    },
    async signOut() {
      console.warn('[supabase stub] signOut called — Supabase disabled');
      return { error: new Error('Supabase disabled') };
    },
  },
  from(_table: string) {
    console.warn('[supabase stub] DB access attempted — Supabase disabled for table:', _table);
    return {
      async select() { return { data: null, error: new Error('Supabase disabled') }; },
      async single() { return { data: null, error: new Error('Supabase disabled') }; },
      async maybeSingle() { return { data: null, error: new Error('Supabase disabled') }; },
      async insert() { return { data: null, error: new Error('Supabase disabled') }; },
      async update() { return { data: null, error: new Error('Supabase disabled') }; },
      async delete() { return { data: null, error: new Error('Supabase disabled') }; },
      eq() { return this; },
      order() { return this; },
      limit() { return this; },
    };
  },
  functions: {
    async invoke() {
      console.warn('[supabase stub] functions.invoke called — Supabase disabled');
      return { data: null, error: new Error('Supabase disabled') };
    }
  },
  storage: {
    from() { return { async upload() { return { error: new Error('Supabase disabled') } }; } },
  }
};