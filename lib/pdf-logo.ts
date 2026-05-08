/**
 * Loads the Viabilizze logo as a base64 data URL for embedding in jsPDF documents.
 */
export async function getLogoBase64(): Promise<string> {
  const response = await fetch("/logo-viabilizze.png")
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Draws the Viabilizze logo + subtitle header into a jsPDF document.
 * Returns the Y position after the header so content can start below it.
 * @param companyName - Optional company name to display on the report header
 */
export async function drawPdfHeader(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  subtitle: string,
  date: string,
  companyName?: string
): Promise<number> {
  const W = doc.internal.pageSize.getWidth()
  const hasCompany = companyName && companyName.trim().length > 0
  const headerHeight = hasCompany ? 34 : 26

  // White header bar
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, W, headerHeight, "F")

  // Orange accent strip at bottom of header
  doc.setFillColor(234, 88, 12)
  doc.rect(0, headerHeight - 2, W, 2, "F")

  // Light separator line above the strip
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.3)
  doc.line(0, headerHeight - 2, W, headerHeight - 2)

  // Logo image
  try {
    const logoB64 = await getLogoBase64()
    // Draw logo: height 14mm, width proportional (~3.5:1 ratio)
    doc.addImage(logoB64, "PNG", 12, 5, 49, 14)
  } catch {
    // Fallback text if image fails
    doc.setTextColor(26, 26, 26)
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.text("VIABILIZZE", 12, 16)
  }

  // Company name below logo (if provided)
  if (hasCompany) {
    doc.setTextColor(22, 163, 74) // Primary green color
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(companyName, 12, 26)
  }

  // Subtitle and date on the right — dark text on white background
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(subtitle, W - 12, 11, { align: "right" })
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Emitido em ${date}`, W - 12, 17, { align: "right" })

  return headerHeight + 6 // Y start for content
}

/**
 * Draws the Viabilizze footer on each page.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function drawPdfFooter(doc: any) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

  doc.setFillColor(240, 240, 240)
  doc.rect(0, H - 10, W, 10, "F")
  doc.setDrawColor(234, 88, 12)
  doc.setLineWidth(0.4)
  doc.line(0, H - 10, W, H - 10)
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("VIABILIZZE — Soluções em Gestão Industrial  |  Documento gerado automaticamente para uso interno.", 14, H - 4)
  doc.text(`Pág. ${doc.internal.getCurrentPageInfo().pageNumber}`, W - 14, H - 4, { align: "right" })
}
