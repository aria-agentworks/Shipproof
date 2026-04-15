import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils-shipproof'

// Build transporter from env vars (works with any SMTP: Gmail, Zoho, SendGrid, etc.)
function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM || user

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ''
}

// Send proof email to buyer
export async function sendProofEmail(videoId: string) {
  const video = await db.video.findUnique({ where: { id: videoId } })
  if (!video) throw new Error('Video not found')

  // Update status
  await db.video.update({
    where: { id: videoId },
    data: { status: 'sent' },
  })

  const baseUrl = getBaseUrl()
  const verifyLink = `${baseUrl}/v/${video.uniqueCode}`

  const transporter = getTransporter()
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER

  // If no SMTP configured, log and return success (dev mode)
  if (!transporter || !fromEmail) {
    console.log('=== EMAIL NOT CONFIGURED — would have sent ===')
    console.log(`From: ${fromEmail || 'noreply@shipproof.com'}`)
    console.log(`To: ${video.buyerEmail}`)
    console.log(`Subject: Your order #${video.orderId} has been packed with proof`)
    console.log(`Link: ${verifyLink}`)
    console.log('==============================================')
    return { sent: false, reason: 'SMTP not configured', verifyLink }
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#0d9488);padding:28px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">ShipProof</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Video Proof of Your Order</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.5;">
                Your order has been carefully packed and recorded on video. You can watch the packing proof and confirm your delivery below.
              </p>

              <!-- Order Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:16px 0;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#059669;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order Details</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1f2937;">${video.orderId}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Proof Code: <strong style="color:#059669;font-family:monospace;">${video.uniqueCode}</strong></p>
                    ${video.recordedAt ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Recorded: ${formatDate(video.recordedAt)}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyLink}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">
                      Watch Proof & Confirm Receipt
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;text-align:center;">
                This video was recorded with a tamper-proof overlay showing your order ID, timestamp, and unique proof code. It cannot be edited or faked.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">Built for sellers who ship with care.</p>
              <p style="margin:4px 0 0;font-size:11px;color:#d1d5db;">ShipProof &copy; ${new Date().getFullYear()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Your order #${video.orderId} has been packed and recorded on video.

Watch the proof and confirm your receipt:
${verifyLink}

Proof Code: ${video.uniqueCode}

This video was recorded with a tamper-proof overlay. It cannot be edited or faked.

- ShipProof`

  await transporter.sendMail({
    from: `"ShipProof" <${fromEmail}>`,
    to: video.buyerEmail,
    replyTo: fromEmail,
    subject: `Your order #${video.orderId} has been packed with proof`,
    html,
    text,
  })

  return { sent: true, verifyLink, emailTo: video.buyerEmail }
}

// Send notification to seller when buyer confirms
export async function sendSellerNotification(videoId: string, condition: string | null, comment: string | null) {
  const video = await db.video.findUnique({ where: { id: videoId } })
  if (!video) return

  const transporter = getTransporter()
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
  const sellerEmail = process.env.SELLER_EMAIL || process.env.SMTP_USER

  if (!transporter || !fromEmail || !sellerEmail) {
    console.log(`SELLER NOTIFICATION (not configured): Order #${video.orderId} confirmed. Condition: ${condition || 'N/A'}`)
    return
  }

  const conditionLabels: Record<string, string> = {
    perfect: 'Arrived Perfect',
    damaged: 'Damaged',
    wrong_item: 'Wrong Item',
    missing_parts: 'Missing Parts',
  }
  const conditionLabel = condition ? conditionLabels[condition] || condition : 'No condition reported'
  const baseUrl = getBaseUrl()

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px;">
    <table width="100%" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <tr><td style="background:linear-gradient(135deg,#059669,#0d9488);padding:20px;text-align:center;">
        <h2 style="margin:0;color:#fff;font-size:18px;">Buyer Confirmed Receipt</h2>
      </td></tr>
      <tr><td style="padding:20px;">
        <p style="color:#1f2937;">Your buyer has confirmed receiving order <strong>#${video.orderId}</strong>.</p>
        <p style="margin:12px 0;color:#1f2937;">Package Condition: <strong>${conditionLabel}</strong></p>
        ${comment ? `<p style="color:#6b7280;font-style:italic;">"${comment}"</p>` : ''}
        <p style="margin-top:16px;"><a href="${baseUrl}/dashboard" style="background:#059669;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">View Dashboard</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`

  await transporter.sendMail({
    from: `"ShipProof" <${fromEmail}>`,
    to: sellerEmail,
    subject: `Order #${video.orderId} confirmed by buyer — ${conditionLabel}`,
    html,
  })
}
