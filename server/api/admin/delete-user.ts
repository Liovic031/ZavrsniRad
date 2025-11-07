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

  // 1. Brišemo rezervacije
  const { error: deleteReservationsError } = await supabase
    .from('reservations')
    .delete()
    .eq('user_id', userId)

  if (deleteReservationsError) {
    return { success: false, error: deleteReservationsError }
  }

  // 2. Brišemo iz tablice users
  const { error: deleteUserRowError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (deleteUserRowError) {
    return { success: false, error: deleteUserRowError }
  }

  // 3. Brišemo iz Auth
  const adminClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // bitno!
  )

  const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId)

  if (authDeleteError) {
    return { success: false, error: authDeleteError }
  }

  return { success: true }
})
