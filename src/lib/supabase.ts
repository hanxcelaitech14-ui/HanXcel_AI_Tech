const SUPABASE_URL = 'https://qdfbqtntlksjmczzjtfk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZmJxdG50bGtzam1jenpqdGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzY5NDEsImV4cCI6MjA5MTExMjk0MX0.BxGIWEVcI2NjxTaLazT3zlw4HMOrXdY6HAi7-tU83og';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getSupabaseClient(accessToken?: string) {
  if (accessToken) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }
  return supabase;
}
