import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { EmailOtpType } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

import { Database } from '../../../../supabase/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  })

  if (req.method === 'GET') {
    const { token_hash, type } = req.query

    if (typeof token_hash !== 'string' || typeof type !== 'string') {
      return res.status(400).json({ error: 'Invalid token or type' })
    }

    try {
      const { error } = await supabaseServerClient.auth.verifyOtp({
        type: type as EmailOtpType, // Type narrowing for the type (EmailOtpType)
        token_hash,
      })

      if (error) {
        console.error('OTP verification error:', error)
        return res.status(400).json({ error: error.message })
      }

      // Redirect user or respond with success
      return res.status(200).json({ message: 'OTP verified successfully' })
    } catch (err) {
      console.error('Error during verification:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
