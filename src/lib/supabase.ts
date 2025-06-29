
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hovrnjpmzcumgdjmsdxq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdnJuanBtemN1bWdkam1zZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzcwOTYsImV4cCI6MjA1OTAxMzA5Nn0.34_m2BQnuZcB3CofiIke0Xwpy44AcpA7hjRBbf76RSA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
