import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message } = body

  if (!name || !email || !message) {
    return createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase.from('contact_messages').insert({ name, email, message })

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
