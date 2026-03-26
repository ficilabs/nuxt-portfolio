// server/api/contact.post.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, email, message } = body

  // Basic server-side validation
  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address.' })
  }
  if (message.trim().length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Message is too short.' })
  }

  const { data, error } = await resend.emails.send({
    // ✏️  Replace with your verified Resend sender domain
    from: 'Portfolio Contact <noreply@yourdomain.com>',
    // ✏️  Replace with the address you want to receive messages at
    to: ['you@yourdomain.com'],
    replyTo: email,
    subject: `New message from ${name}`,
    html: `
      <div style="font-family: 'Jost', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #fffffe; border: 1px solid #121629; border-radius: 10px;">
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
    throw createError({ statusCode: 500, message: 'Failed to send email. Please try again.' })
  }

  return { success: true, id: data?.id }
})