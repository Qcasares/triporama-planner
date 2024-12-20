import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okfnhoegpnahzezlgfto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZm5ob2VncG5haHplemxnZnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjY1ODEsImV4cCI6MjA1MDMwMjU4MX0.q2Eyn_V-NY--TWodPjmJCd-spa038Easta8jxr-f8GI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);