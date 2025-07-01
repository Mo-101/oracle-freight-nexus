
import { createClient } from '@supabase/supabase-js'

// Neon PostgreSQL connection details
const neonUrl = 'postgresql://deppcalpot_owner:npg_4WSa3AOwBKef@ep-plain-waterfall-a9z01f8e-pooler.gwc.azure.neon.tech/deppcalpot?sslmode=require&channel_binding=require'

// For direct PostgreSQL connection, we'll create a custom client
// Note: This requires a PostgreSQL adapter since Supabase client expects Supabase endpoints
export const supabase = createClient(
  // Temporary fallback - we'll need to implement direct PostgreSQL connection
  'https://placeholder.supabase.co',
  'placeholder-key'
)

// Neon database configuration for direct connection
export const neonConfig = {
  connectionString: neonUrl,
  host: 'ep-plain-waterfall-a9z01f8e-pooler.gwc.azure.neon.tech',
  database: 'deppcalpot',
  username: 'deppcalpot_owner',
  password: 'npg_4WSa3AOwBKef',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
}
