// server/api/admin/update-status.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reservationId, status } = body

  if (!reservationId || !status) {
    return createError({ statusCode: 400, statusMessage: 'Missing reservationId or status' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', reservationId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
