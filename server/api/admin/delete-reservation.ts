import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reservationId } = body

  if (!reservationId) {
    return createError({ statusCode: 400, statusMessage: 'Missing reservation ID' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
