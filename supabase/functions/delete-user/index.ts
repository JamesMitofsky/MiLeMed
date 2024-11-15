// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // Decode the token to get the user
  const { data: userData, error: userError } = await supabaseClient.auth.getUser()

  if (userError || !userData) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Parse the request body
  const { userId } = await req.json()

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  // Delete the user profile
  const { error: deleteError } = await supabaseClient.from('profiles').delete().eq('id', userId)

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  return new Response(JSON.stringify({ message: 'User profile deleted successfully' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
