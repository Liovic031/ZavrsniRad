import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { hotelId, userId, rating, comment } = body

  if (!hotelId || !userId || !rating || !comment) {
    return createError({ statusCode: 400, statusMessage: 'Nedostaju podaci' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase.from('reviews').insert({
    hotel_id: hotelId,
    user_id: userId,
    rating,
    comment,
    created_at: new Date()
  })

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
