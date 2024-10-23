import { createServerClient } from '@supabase/ssr'
import { type EmailOtpType } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'

// Followed these docs for server side: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs&queryGroups=environment&environment=server
export function createClient() {
  const cookieStore = cookies() // Fetch the cookies from Next.js's server-side headers

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll() // Retrieve all cookies
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => cookieStore.set(name, value, options) // Set cookies safely
            )
          } catch {
            // If this is called in a Server Component, ignore, middleware will handle it
          }
        },
      },
    }
  )
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Combine host and req.url to create a full URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.headers.host}`
  const { searchParams } = new URL(req.url!, baseUrl) // Full URL required here

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/reset-password' // Default to reset-password page

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      const redirectTo = new URL(next, baseUrl)
      return res.redirect(redirectTo.toString()) // Use res.redirect in API routes
    }
  }

  // Return to error page on failure
  const errorRedirect = new URL('/auth/auth-code-error', baseUrl)
  return res.redirect(errorRedirect.toString())
}
