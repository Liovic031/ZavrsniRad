import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const hotelId = body.hotelId

  if (!hotelId) {
    return createError({ statusCode: 400, statusMessage: 'Missing hotel ID' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase
    .from('reviews')
    .select('id, user_id, rating, comment, created_at, users(name)')
    .eq('hotel_id', hotelId)

  if (error) {
    return { success: false, error }
  }
  // @ts-ignore
  const reviews = data.map(r => ({
    ...r,
    user_name: r.users?.name || 'Nepoznat korisnik'
  }))

  return { success: true, reviews }
})
