import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token_hash, type, next = '/' } = req.query
  const redirectTo = next as string

  console.log('Received request with query:', req.query)

  const supabase = createPagesServerClient({ req, res })

  if (token_hash && type) {
    console.log('Attempting to verify OTP with token_hash:', token_hash, 'and type:', type)
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    })
    if (!error) {
      console.log('OTP verification successful, redirecting to:', redirectTo)
      return res.redirect(redirectTo)
    } else {
      console.error('OTP verification failed with error:', error)
    }
  } else {
    console.warn('Missing token_hash or type in query parameters')
  }

  // Redirect to an error page if token verification fails
  console.log('Redirecting to error page: /auth/auth-code-error')
  return res.redirect('/auth/auth-code-error')
}
