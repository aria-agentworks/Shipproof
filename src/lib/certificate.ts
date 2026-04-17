import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shipproof.netlify.app'
const EMERALD = '#059669'
const LIGHT_EMERALD = '#059669'
const DARK_GRAY = '#1f2937'
const MEDIUM_GRAY = '#4b5563'
const LIGHT_GRAY = '#9ca3af'
const BORDER_GRAY = '#d1d5db'
const BG_LIGHT = '#f9fafb'
const CONFIRMED_GREEN = '#16a34a'
const PENDING_AMBER = '#d97706'

interface CertificateVideoData {
  orderId: string
  uniqueCode: string
  status: string
  buyerConfirmed: boolean
  buyerConfirmedAt: string | null
  packageCondition: string | null
  buyerComment: string | null
  recordedAt: string
  videoHash: string | null
  sellerName?: string
  buyerEmail?: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getConditionLabel(condition: string): string {
  const map: Record<string, string> = {
    perfect: 'Perfect Condition',
    damaged: 'Damaged',
    wrong_item: 'Wrong Item',
    missing_parts: 'Missing Parts',
  }
  return map[condition] || condition
}

export async function generateCertificatePDF(video: CertificateVideoData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // ─── Watermark ───
  doc.saveGraphicsState()
  doc.setGState(new (doc as unknown as Record<string, unknown>).GState({ opacity: 0.04 }))
  doc.setFontSize(72)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 100, 100)
  // Rotate and center the watermark
  const cx = pageWidth / 2
  const cy = pageHeight / 2
  // jsPDF doesn't have easy rotation for text, so we use the setCharSpace approach
  // We'll draw the watermark at an angle using the transformation
  // Actually, let's just place it diagonally using multiple approaches
  doc.text('ShipProof', cx, cy - 20, { angle: 35 })
  doc.text('ShipProof', cx - 40, cy + 40, { angle: 35 })
  doc.restoreGraphicsState()

  // ─── Header bar ───
  // Emerald header strip
  doc.setFillColor(5, 150, 105) // #059669
  doc.rect(0, 0, pageWidth, 32, 'F')

  // Logo text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('ShipProof', margin, 21)

  // Subtitle in header
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 255, 230)
  doc.text('Shipment Verification System', margin, 27)

  // ─── Title ───
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(5, 150, 105) // emerald
  doc.text('SHIPMENT VERIFICATION CERTIFICATE', pageWidth / 2, 46, { align: 'center' })

  // Thin emerald line under title
  doc.setDrawColor(5, 150, 105)
  doc.setLineWidth(0.5)
  doc.line(margin + 30, 50, pageWidth - margin - 30, 50)

  // ─── Certificate border/frame ───
  const frameY = 56
  const framePadding = 3
  doc.setDrawColor(BORDER_GRAY)
  doc.setLineWidth(0.3)
  // Outer frame
  doc.roundedRect(margin - 1, frameY, contentWidth + 2, pageHeight - frameY - 30 - 10, 2, 2, 'S')

  // Inner content starts
  let y = frameY + 12

  // ─── Seller Info (if available) ───
  if (video.sellerName) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(LIGHT_GRAY)
    doc.text('Issued by', margin + 5, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(DARK_GRAY)
    doc.text(video.sellerName, margin + 5, y)
    y += 10
  }

  // ─── Order Details Section ───
  // Section header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(EMERALD)
  doc.text('ORDER DETAILS', margin + 5, y)
  y += 2

  // Line under section header
  doc.setDrawColor(5, 150, 105)
  doc.setLineWidth(0.3)
  doc.line(margin + 5, y, margin + contentWidth - 5, y)
  y += 7

  // Order ID
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('Order ID', margin + 5, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(DARK_GRAY)
  doc.text(`#${video.orderId}`, margin + 40, y)
  y += 8

  // Buyer Email
  if (video.buyerEmail) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(LIGHT_GRAY)
    doc.text('Buyer', margin + 5, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(MEDIUM_GRAY)
    doc.text(video.buyerEmail, margin + 40, y)
    y += 8
  }

  // Date Recorded
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('Date Recorded', margin + 5, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(MEDIUM_GRAY)
  doc.text(formatDate(video.recordedAt), margin + 40, y)
  y += 12

  // ─── Verification Code (large, prominent) ───
  // Background highlight box
  const codeBoxX = margin + 5
  const codeBoxWidth = contentWidth - 10
  const codeBoxHeight = 20
  doc.setFillColor(249, 250, 251) // bg-light
  doc.roundedRect(codeBoxX, y, codeBoxWidth, codeBoxHeight, 2, 2, 'F')
  doc.setDrawColor(BORDER_GRAY)
  doc.setLineWidth(0.2)
  doc.roundedRect(codeBoxX, y, codeBoxWidth, codeBoxHeight, 2, 2, 'S')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('VERIFICATION CODE', codeBoxX + 5, y + 7)
  doc.setFont('courier', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(DARK_GRAY)
  doc.text(video.uniqueCode, codeBoxX + 5, y + 15)

  y += codeBoxHeight + 12

  // ─── Verification Status ───
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(EMERALD)
  doc.text('VERIFICATION STATUS', margin + 5, y)
  y += 2
  doc.setDrawColor(5, 150, 105)
  doc.setLineWidth(0.3)
  doc.line(margin + 5, y, margin + contentWidth - 5, y)
  y += 7

  if (video.buyerConfirmed) {
    // Green confirmed badge
    const badgeWidth = 45
    const badgeHeight = 8
    doc.setFillColor(220, 252, 231) // light green bg
    doc.roundedRect(margin + 5, y - 5.5, badgeWidth, badgeHeight, 1.5, 1.5, 'F')
    doc.setDrawColor(22, 163, 74)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin + 5, y - 5.5, badgeWidth, badgeHeight, 1.5, 1.5, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(CONFIRMED_GREEN)
    // Checkmark
    doc.text('\u2713  CONFIRMED', margin + 8, y)

    y += 5

    if (video.buyerConfirmedAt) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(MEDIUM_GRAY)
      doc.text(`Confirmed on ${formatDate(video.buyerConfirmedAt)}`, margin + 5, y)
      y += 6
    }

    if (video.packageCondition) {
      const condLabel = getConditionLabel(video.packageCondition)
      let condColor: [number, number, number] = [22, 163, 74] // green for perfect
      if (video.packageCondition === 'damaged') condColor = [234, 88, 12]
      else if (video.packageCondition === 'wrong_item') condColor = [220, 38, 38]
      else if (video.packageCondition === 'missing_parts') condColor = [202, 138, 4]

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...condColor)
      doc.text(`Package Condition: ${condLabel}`, margin + 5, y)
      y += 6
    }
  } else {
    // Amber pending badge
    const badgeWidth = 95
    const badgeHeight = 8
    doc.setFillColor(254, 243, 199) // light amber bg
    doc.roundedRect(margin + 5, y - 5.5, badgeWidth, badgeHeight, 1.5, 1.5, 'F')
    doc.setDrawColor(217, 119, 6)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin + 5, y - 5.5, badgeWidth, badgeHeight, 1.5, 1.5, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(PENDING_AMBER)
    doc.text('\u23F3  PENDING BUYER CONFIRMATION', margin + 8, y)

    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(MEDIUM_GRAY)
    doc.text('The buyer has not yet confirmed receipt of this shipment.', margin + 5, y)
    y += 6
  }

  y += 6

  // ─── Buyer Comment ───
  if (video.buyerComment) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(EMERALD)
    doc.text('BUYER COMMENT', margin + 5, y)
    y += 2
    doc.setDrawColor(5, 150, 105)
    doc.setLineWidth(0.3)
    doc.line(margin + 5, y, margin + contentWidth - 5, y)
    y += 7

    // Quote box
    doc.setFillColor(249, 250, 251)
    const commentLines = doc.splitTextToSize(`"${video.buyerComment}"`, contentWidth - 20)
    const commentBoxHeight = commentLines.length * 5.5 + 8
    doc.roundedRect(margin + 5, y - 3, contentWidth - 10, commentBoxHeight, 2, 2, 'F')
    doc.setDrawColor(BORDER_GRAY)
    doc.setLineWidth(0.2)
    doc.roundedRect(margin + 5, y - 3, contentWidth - 10, commentBoxHeight, 2, 2, 'S')

    // Left accent bar for quote
    doc.setFillColor(5, 150, 105)
    doc.rect(margin + 5, y - 3, 1.5, commentBoxHeight, 'F')

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(MEDIUM_GRAY)
    doc.text(commentLines, margin + 12, y + 2)
    y += commentBoxHeight + 8
  }

  // ─── SHA-256 Hash ───
  if (video.videoHash) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(EMERALD)
    doc.text('INTEGRITY HASH', margin + 5, y)
    y += 2
    doc.setDrawColor(5, 150, 105)
    doc.setLineWidth(0.3)
    doc.line(margin + 5, y, margin + contentWidth - 5, y)
    y += 7

    doc.setFillColor(249, 250, 251)
    const hashText = `SHA-256: ${video.videoHash}`
    const hashLines = doc.splitTextToSize(hashText, contentWidth - 20)
    const hashBoxHeight = hashLines.length * 4.5 + 8
    doc.roundedRect(margin + 5, y - 3, contentWidth - 10, hashBoxHeight, 2, 2, 'F')
    doc.setDrawColor(BORDER_GRAY)
    doc.setLineWidth(0.2)
    doc.roundedRect(margin + 5, y - 3, contentWidth - 10, hashBoxHeight, 2, 2, 'S')

    doc.setFont('courier', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(LIGHT_GRAY)
    doc.text(hashLines, margin + 12, y + 2)
    y += hashBoxHeight + 8
  }

  // ─── QR Code ───
  const verificationUrl = `${BASE_URL}/v/${video.uniqueCode}`
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#059669',
      light: '#ffffff',
    },
  })

  // Place QR code in bottom-right area of the certificate
  const qrSize = 28
  const qrX = pageWidth - margin - qrSize - 5
  const qrY = pageHeight - 30 - qrSize - 8

  // QR background
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F')
  doc.setDrawColor(BORDER_GRAY)
  doc.setLineWidth(0.2)
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'S')

  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

  // QR label
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('Scan to verify', qrX + qrSize / 2, qrY + qrSize + 5, { align: 'center' })

  // ─── Footer ───
  const footerY = pageHeight - 22

  // Footer separator
  doc.setDrawColor(BORDER_GRAY)
  doc.setLineWidth(0.2)
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('This certificate was issued by ShipProof.', margin, footerY)

  const verifyText = `Verify at ${BASE_URL}/v/${video.uniqueCode}`
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(EMERALD)
  doc.text(verifyText, margin, footerY + 5)

  // Issued timestamp on the right
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(LIGHT_GRAY)
  const issuedAt = new Date().toISOString()
  doc.text(`Issued: ${formatDate(issuedAt)}`, pageWidth - margin, footerY + 5, { align: 'right' })

  // Bottom branding
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(LIGHT_GRAY)
  doc.text('ShipProof \u2014 Trust in Every Shipment', pageWidth / 2, pageHeight - 8, { align: 'center' })

  // Generate buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return pdfBuffer
}
