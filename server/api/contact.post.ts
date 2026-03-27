// server/api/contact.post.ts
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  // Validate that RESEND_API_KEY is set
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[Contact] RESEND_API_KEY is not set in environment variables')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error. Please try again later.',
    })
  }

  const resend = new Resend(apiKey)

  const body = await readBody(event)
  const { name, email, message } = body ?? {}

  // ─── Server-side validation ────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address.' })
  }
  if (message.trim().length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Message is too short.' })
  }

  // ─── Send email ───────────────────────────────────────────────────────────
  //
  //  ✏️  REQUIRED: fill in your values below before deploying
  //
  //  FROM:
  //    - Free Resend plan:  use "onboarding@resend.dev" (no domain needed)
  //    - Custom domain:     e.g. "Portfolio <noreply@yourdomain.com>"
  //                         (domain must be verified in Resend dashboard)
  //
  //  TO:
  //    - Free Resend plan:  must be the email address you signed up to Resend with
  //    - Custom domain:     any address you want
  //
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const TO_EMAIL   = process.env.RESEND_TO_EMAIL   ?? 'vickycotot977@gmail.com'   // ✏️ change this

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    replyTo: email,
    subject: `New portfoliomessage from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #fffffe; border: 1px solid #121629; border-radius: 10px;">
        <h2 style="margin: 0 0 24px; font-size: 24px; color: #232946;">
          New contact message<span style="color: #8ce2cb;">.</span>
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #232946; font-weight: 700; width: 80px;">Name</td>
            <td style="padding: 8px 0; color: #232946;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #232946; font-weight: 700;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: #232946;">${email}</a>
            </td>
          </tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #121629;" />
        <p style="margin: 0; color: #232946; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  })

  if (error) {
    console.error('[Resend error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email. Please try again.',
    })
  }

  return { success: true, id: data?.id }
})