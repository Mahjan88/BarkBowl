import { createClient } from '@supabase/supabase-js'

const IS_MOCK      = import.meta.env.VITE_MOCK_MODE === 'true'
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// In mock mode we still create a client (needed for import), but it won't be called
export const supabase = IS_MOCK
  ? {
      auth: {
        getSession:       async () => ({ data: { session: null } }),
        onAuthStateChange: ()      => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp:           async () => ({ data: {}, error: null }),
        signInWithPassword: async () => ({ data: {}, error: null }),
        signOut:          async () => ({ error: null }),
      },
    }
  : createClient(supabaseUrl, supabaseKey)
