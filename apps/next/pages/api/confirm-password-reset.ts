import { type EmailOtpType } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

import { supabaseAdmin } from '../../../../packages/api/src/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token_hash, type, next = '/' } = req.query
  const redirectTo = next as string

  if (token_hash && type) {
    const { error } = await supabaseAdmin.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    })
    if (!error) {
      return res.redirect(redirectTo)
    }
  }

  // Redirect to an error page if token verification fails
  return res.redirect('/auth/auth-code-error')
}
