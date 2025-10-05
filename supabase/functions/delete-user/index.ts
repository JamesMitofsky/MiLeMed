import { serve } from 'https://deno.land/std@0.182.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // 👈 added
}

console.log('Function "delete-user" up and running!')

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    /* 1.  Validate caller & get user */
    const jwt = req.headers.get('authorization')?.replace('Bearer ', '') ?? ''
    const supabase = createClient(supabaseUrl, anonKey)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(jwt)
    if (userErr) throw userErr
    if (!user) throw new Error('User not found')

    /* 2.  Delete with service-role */
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { error: delErr } = await admin.auth.admin.deleteUser(user.id /*, { hardDelete:true } */)
    if (delErr) throw delErr

    return new Response(JSON.stringify({ success: true, message: 'User deleted' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('[delete-user] ', err)
    return new Response(JSON.stringify({ success: false, message: err.message ?? err }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
