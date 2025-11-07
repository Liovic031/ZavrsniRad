// server/api/auth/register.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, confirmPassword } = body

  if (!name || !email || !password || !confirmPassword) {
    return createError({ statusCode: 400, statusMessage: 'Sva polja su obavezna' })
  }

  if (password !== confirmPassword) {
    return createError({ statusCode: 400, statusMessage: 'Lozinke se ne podudaraju' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (error) return { success: false, error }

  const user = data.user
  if (!user) return createError({ statusCode: 500, statusMessage: 'Greška pri stvaranju korisnika' })

  const { error: insertError } = await supabase.from('users').insert({
    id: user.id,
    email: user.email,
    password,
    name,
    role: 'user',
    created_at: new Date().toISOString()
  })

  if (insertError) return { success: false, error: insertError }

  return { success: true }
})
