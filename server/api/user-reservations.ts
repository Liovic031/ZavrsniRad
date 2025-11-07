// server/api/user-reservations.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = body.userId

  if (!userId) {
    return createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', userId)
    .single()

  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select(`
      id,
      room_id,
      hotel_id,
      check_in_date,
      check_out_date,
      total_price,
      status,
      rooms ( room_number ),
      hotels ( name )
    `)
    .eq('user_id', userId)

  if (userError || resError) {
    return { success: false, error: userError || resError }
  }

  return { success: true, user: userData, reservations }
})
