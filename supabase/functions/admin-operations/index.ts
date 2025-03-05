
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const { action, data } = await req.json()

    // Get the user making the request from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !caller) {
      throw new Error('Invalid authorization')
    }

    // Check if the caller is an admin
    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()
    
    if (profileError || callerProfile.role !== 'admin') {
      throw new Error('Only admins can perform this operation')
    }

    // Handle different admin operations
    switch (action) {
      case 'getUserById':
        const { userId } = data
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
        
        if (userError) throw userError
        return new Response(JSON.stringify({ data: userData }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })

      case 'deleteUser':
        const { userId: deleteUserId } = data
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(deleteUserId)
        
        if (deleteError) throw deleteError
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })

      case 'updateUserRole':
        const { userId: updateUserId, role } = data
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ role })
          .eq('id', updateUserId)
        
        if (updateError) throw updateError
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })

      case 'createUser':
        const { email, password, name, role: newUserRole, avatar } = data
        
        // Create user with Supabase Auth
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm the email
        })
        
        if (createError) throw createError
        
        // Update the user's profile in profiles
        if (newUser?.user) {
          await supabaseAdmin
            .from('profiles')
            .update({ 
              name: email, // Update to use email as name
              role: newUserRole,
              avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random&color=fff`
            })
            .eq('id', newUser.user.id)
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })

      case 'inviteUser':
        const { email, role: inviteRole } = data
        // Generate a secure random password
        const password = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2)
        
        // Create user with Supabase Auth
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm the email
        })
        
        if (inviteError) throw inviteError
        
        // Update the user's role in profiles
        if (newUser?.user) {
          await supabaseAdmin
            .from('profiles')
            .update({ 
              name: email, // Update to use email as name
              role: inviteRole 
            })
            .eq('id', newUser.user.id)
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        })

      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    })
  }
})
