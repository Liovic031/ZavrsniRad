// server/api/hotel/get-room-prices.ts
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
    .from('rooms')
    .select('room_type, price_per_night')
    .eq('hotel_id', hotelId)

  if (error) {
    return { success: false, error }
  }

  const grouped: Record<string, number> = {}
  data.forEach(room => {
    if (!grouped[room.room_type]) {
      grouped[room.room_type] = room.price_per_night
    }
  })

  return { success: true, roomPrices: grouped }
})
