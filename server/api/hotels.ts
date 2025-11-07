import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase.from('hotels').select('id, name')

  if (error) {
    return { success: false, error }
  }

  return { success: true, hotels: data }
})
