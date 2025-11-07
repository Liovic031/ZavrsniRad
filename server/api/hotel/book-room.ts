import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { hotelId, userId, roomType, checkinDate, checkoutDate } = body

  if (!hotelId || !userId || !roomType || !checkinDate || !checkoutDate) {
    return createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const today = new Date().toISOString().split('T')[0]
  if (checkinDate < today) {
    return { success: false, message: 'Unesite ispravne datume' }
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select('room_id, status')
    .eq('hotel_id', hotelId)
    .or(`and(check_in_date.lte.${checkoutDate},check_out_date.gte.${checkinDate})`)

  if (resError) {
    return { success: false, error: resError }
  }

  const reservedIds = reservations.filter(r => r.status !== 'rejected').map(r => r.room_id)

  let roomQuery = supabase
    .from('rooms')
    .select('id, price_per_night, room_number')
    .eq('hotel_id', hotelId)
    .eq('room_type', roomType)

  reservedIds.forEach(id => roomQuery = roomQuery.neq('id', id))

  const { data: availableRooms, error: availError } = await roomQuery

  if (availError || !availableRooms || availableRooms.length === 0) {
    return { success: false, message: 'Sve sobe zauzete' }
  }

  const selectedRoom = availableRooms[0]
  const nights = Math.ceil((new Date(checkoutDate).getTime() - new Date(checkinDate).getTime()) / (1000 * 60 * 60 * 24))
  const totalPrice = nights * parseFloat(selectedRoom.price_per_night)

  const { error: insertError } = await supabase
    .from('reservations')
    .insert({
      hotel_id: hotelId,
      user_id: userId,
      room_id: selectedRoom.id,
      check_in_date: checkinDate,
      check_out_date: checkoutDate,
      total_price: totalPrice,
      created_at: new Date().toISOString()
    })

  if (insertError) {
    return { success: false, error: insertError }
  }

  return {
    success: true,
    message: `Rezervacija je poslana. Mogući broj sobe je ${selectedRoom.room_number},a cijena: ${totalPrice.toFixed(2)} €`
  }
})
