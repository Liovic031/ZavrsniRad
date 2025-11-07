// server/api/hotel/fetch-hotel.ts
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
    .from('hotels')
    .select('*')
    .eq('id', hotelId)
    .single()

  if (error) {
    return { success: false, error }
  }

  return { success: true, hotel: data }
})
