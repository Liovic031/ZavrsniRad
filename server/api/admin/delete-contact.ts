import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contactId } = body

  if (!contactId) {
    return createError({ statusCode: 400, statusMessage: 'Missing contact ID' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', contactId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
