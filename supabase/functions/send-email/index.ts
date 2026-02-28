import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Build HTML email with monastery branding
    const htmlBody = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #7B1A2C;">
          <h2 style="color: #7B1A2C; margin: 0;">Gaden Shartse Gungru Khangtsen</h2>
          <p style="color: #666; font-size: 14px; margin: 4px 0 0;">Monastery</p>
        </div>
        <div style="padding: 24px 0; font-size: 16px; line-height: 1.6; color: #333;">
          ${body.replace(/\n/g, '<br>')}
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
        subject: subject,
        html: htmlBody,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to send email' }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
