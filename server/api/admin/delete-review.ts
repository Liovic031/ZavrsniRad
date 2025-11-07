import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reviewId } = body

  if (!reviewId) {
    return createError({ statusCode: 400, statusMessage: 'Missing review ID' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    return { success: false, error }
  }

  return { success: true }
})
