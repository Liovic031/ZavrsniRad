import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reservationId, newCheckIn, newCheckOut } = body

  if (!reservationId || !newCheckIn || !newCheckOut) {
    return { success: false, error: 'Nedostaju podaci.' }
  }

  const checkIn = new Date(newCheckIn)
  const checkOut = new Date(newCheckOut)

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { success: false, message: 'Neispravan format datuma.' }
  }

  if (checkIn >= checkOut) {
    return { success: false, message: 'Check-in mora biti prije check-outa.' }
  }

  const today = new Date().toISOString().split('T')[0]
  if (newCheckIn < today) {
    return { success: false, message: 'Check-in datum ne može biti u prošlosti.' }
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  // Dohvati trenutnu rezervaciju
  const { data: currentReservation, error: fetchError } = await supabase
    .from('reservations')
    .select('room_id')
    .eq('id', reservationId)
    .single()

  if (fetchError || !currentReservation) {
    return { success: false, error: 'Ne postoji rezervacija s tim ID-om.' }
  }

  const roomId = currentReservation.room_id

  // Provjera konflikata
  const { data: conflictingReservations, error: conflictError } = await supabase
    .from('reservations')
    .select('id')
    .eq('room_id', roomId)
    .neq('id', reservationId)
    .or(`and(check_in_date.lte.${newCheckOut},check_out_date.gte.${newCheckIn})`)
    .in('status', ['pending', 'accepted'])

  if (conflictError) {
    return { success: false, error: conflictError }
  }

  if (conflictingReservations.length > 0) {
    return { success: false, message: 'Soba je zauzeta u tom terminu.' }
  }

  // Dohvati cijenu sobe
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('price_per_night')
    .eq('id', roomId)
    .single()

  if (roomError || !room) {
    return { success: false, error: 'Ne mogu dohvatiti cijenu sobe.' }
  }

  // Izračun nove cijene
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  const newTotalPrice = nights * parseFloat(room.price_per_night)

  // Ažuriraj sve u bazi
  const { error: updateError } = await supabase
    .from('reservations')
    .update({
      check_in_date: newCheckIn,
      check_out_date: newCheckOut,
      total_price: newTotalPrice
    })
    .eq('id', reservationId)

  if (updateError) {
    return { success: false, error: updateError }
  }

  return { success: true, newTotalPrice }
})
