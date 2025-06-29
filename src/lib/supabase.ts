
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mvzjlugmomgmsvmwzwmj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12empsdWdtb21nbXN2bXd6d21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDI2MTQsImV4cCI6MjA2Njc3ODYxNH0.v48NN__NywVBdNjqeq1EU7u65lkaKwO7kf515DRDr4I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
