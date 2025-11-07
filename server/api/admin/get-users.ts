import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, created_at, role')
    .eq('role', 'user') // ➤ samo obični korisnici

  if (error) return { success: false, error }

  return { success: true, users: data }
})
