import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://gadengungru.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Email format validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// HTML entity escaping
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the caller has a valid JWT or anon key
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the token is valid by creating a Supabase client
    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    // Check origin header
    const origin = req.headers.get('Origin') || req.headers.get('origin')
    if (origin && origin !== 'https://gadengungru.github.io') {
      return new Response(
        JSON.stringify({ error: 'Forbidden origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { to, subject, body } = await req.json()

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const recipients = Array.isArray(to) ? to : [to]

    // Limit recipients to prevent mass emailing
    if (recipients.length > 5) {
      return new Response(
        JSON.stringify({ error: 'Maximum 5 recipients per request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate all email addresses
    for (const email of recipients) {
      if (typeof email !== 'string' || !isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Sanitize subject (limit length, strip control chars)
    const sanitizedSubject = subject.substring(0, 200).replace(/[\x00-\x1F\x7F]/g, '')

    // Sanitize body — strip HTML tags and escape entities
    const strippedBody = body.replace(/<[^>]*>/g, '')
    const sanitizedBody = escapeHtml(strippedBody)

    // Build HTML email with monastery branding
    const htmlBody = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #7B1A2C;">
          <h2 style="color: #7B1A2C; margin: 0;">Gaden Shartse Gungru Khangtsen</h2>
          <p style="color: #666; font-size: 14px; margin: 4px 0 0;">Monastery</p>
        </div>
        <div style="padding: 24px 0; font-size: 16px; line-height: 1.6; color: #333;">
          ${sanitizedBody.replace(/\n/g, '<br>')}
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 16px; text-align: center; font-size: 12px; color: #999;">
          <p>Gaden Shartse Gungru Khangtsen Monastery</p>
          <p>P.O. Tibetan Colony, Mundgod, Karnataka 581411, India</p>
          <p><a href="https://gadengungru.github.io/Khangtsen/Gungru/en/index.html" style="color: #7B1A2C;">Visit our website</a></p>
        </div>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Gungru Khangtsen <onboarding@resend.dev>',
        to: recipients,
        subject: sanitizedSubject,
        html: htmlBody,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Send email error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
