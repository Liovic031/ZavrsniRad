import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const [reservationsRes, contactsRes, reviewsRes] = await Promise.all([
    supabase.from('reservations').select(`id, hotel_id, user_id, room_id, check_in_date, check_out_date, total_price, status, created_at, users(name), rooms(room_number), hotels(name)`),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    supabase.from('reviews').select('*, users(name), hotels(name)').order('created_at', { ascending: false })
  ])

  if (reservationsRes.error || contactsRes.error || reviewsRes.error) {
    return {
      success: false,
      error: reservationsRes.error || contactsRes.error || reviewsRes.error
    }
  }

  return {
    success: true,
    reservations: reservationsRes.data,
    contacts: contactsRes.data,
    reviews: reviewsRes.data
  }
})