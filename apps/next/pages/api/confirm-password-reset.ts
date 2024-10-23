import { createClient, type EmailOtpType } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

import { Database } from '../../../../supabase/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Combine host and req.url to create a full URL
    const baseUrl = `https://milemed.de`
    const { searchParams } = new URL(req.url!, baseUrl) // Full URL required here

    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/reset-password' // Default to reset-password page

    if (token_hash && type) {
      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE!
      )

      const { error } = await supabase.auth.verifyOtp({ type, token_hash })
      if (!error) {
        const redirectTo = new URL(next, baseUrl)
        return res.redirect(redirectTo.toString()) // Use res.redirect in API routes
      }
    }

    // Return to error page on failure
    const errorRedirect = new URL('/auth/auth-code-error', baseUrl)
    return res.redirect(errorRedirect.toString())
  } catch (error) {
    console.error('Error processing request:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
