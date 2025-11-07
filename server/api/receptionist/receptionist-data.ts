import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = body.userId

  if (!userId) {
    return createError({ statusCode: 400, statusMessage: 'Missing user ID' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data: staffRow, error: staffError } = await supabase
    .from('hotel_staff')
    .select('hotel_id')
    .eq('user_id', userId)
    .single()

  if (staffError || !staffRow) {
    return { success: false, error: staffError || 'Hotel not found for this receptionist' }
  }

  const hotelId = staffRow.hotel_id

  const { data: allReservations, error: resError } = await supabase
    .from('reservations')
    .select('*, users(name), rooms(room_number)')
    .eq('hotel_id', hotelId)

  if (resError) {
    return { success: false, error: resError }
  }

  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('*, users(name)')
    .eq('hotel_id', hotelId)

  if (reviewError) {
    return { success: false, error: reviewError }
  }
  
  return {
    success: true,
    reservations: allReservations,
    reviews
  }
})
