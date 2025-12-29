/**
 * PDF Exporter
 * Handles exporting result analysis to PDF format using browser print API
 * This approach doesn't require additional dependencies and provides native OS print dialog
 */

export interface PdfExportOptions {
  filename?: string
  orientation?: 'portrait' | 'landscape'
  includeCharts?: boolean
}

export class PdfExporter {
  /**
   * Export current page as PDF using browser print dialog
   * This leverages the native browser print-to-PDF functionality
   */
  static async exportToPdf(options: PdfExportOptions = {}): Promise<void> {
    const {
      filename = 'report.pdf',
      orientation = 'portrait'
    } = options

    // Store original title
    const originalTitle = document.title
    
    try {
      // Set document title (will be used as default filename in print dialog)
      document.title = filename.replace('.pdf', '')

      // Add print styles if not already present
      this.addPrintStyles(orientation)

      // Trigger print dialog
      window.print()

      // Note: The actual PDF generation happens in the print dialog
      // Users can choose "Save as PDF" from their printer options
      
    } finally {
      // Restore original title
      setTimeout(() => {
        document.title = originalTitle
      }, 100)
    }
  }

  /**
   * Add print-specific styles to the page
   */
  private static addPrintStyles(orientation: 'portrait' | 'landscape'): void {
    const existingStyle = document.getElementById('pdf-export-styles')
    if (existingStyle) return

    const style = document.createElement('style')
    style.id = 'pdf-export-styles'
    style.textContent = `
      @media print {
        @page {
          size: ${orientation};
          margin: 1cm;
        }

        /* Hide non-essential elements */
        header,
        footer,
        .no-print,
        button,
        nav {
          display: none !important;
        }

        /* Optimize content for printing */
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        /* Ensure proper page breaks */
        .page-break-before {
          page-break-before: always;
        }

        .page-break-after {
          page-break-after: always;
        }

        .page-break-avoid {
          page-break-inside: avoid;
        }

        /* Card styles for print */
        .card, [class*="card"] {
          page-break-inside: avoid;
          border: 1px solid #ddd !important;
          box-shadow: none !important;
        }

        /* Ensure charts are visible */
        canvas, svg {
          max-width: 100% !important;
          height: auto !important;
        }

        /* Table styles */
        table {
          page-break-inside: avoid;
        }

        /* Optimize colors for black and white printing */
        .text-blue-600 { color: #2563eb !important; }
        .text-green-600 { color: #16a34a !important; }
        .text-orange-600 { color: #ea580c !important; }
        .text-red-600 { color: #dc2626 !important; }

        /* Ensure background colors print */
        .bg-blue-50, .bg-green-50, .bg-orange-50 {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    `

    document.head.appendChild(style)
  }

  /**
   * Prepare a specific element for PDF export
   * Useful for exporting only part of the page
   */
  static async exportElementToPdf(
    elementId: string,
    options: PdfExportOptions = {}
  ): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`Element with id "${elementId}" not found`)
      return
    }

    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement
    
    // Create a temporary container
    const printContainer = document.createElement('div')
    printContainer.style.display = 'none'
    printContainer.className = 'print-only'
    printContainer.appendChild(clone)
    
    document.body.appendChild(printContainer)

    // Add style to show only this element when printing
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        body > *:not(.print-only) {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
      }
    `
    document.head.appendChild(style)

    try {
      await this.exportToPdf(options)
    } finally {
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(printContainer)
        document.head.removeChild(style)
      }, 100)
    }
  }

  /**
   * Download helper for future PDF library integration
   * Reserved for when we add jspdf or similar library
   */
  static downloadPdf(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }
}

