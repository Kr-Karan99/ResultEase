import { Metadata } from 'next'
import { generateMetadata, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Analysis Reports',
  description: 'View detailed student performance reports with visual charts, rankings, and comprehensive academic analysis.',
  keywords: SEO_KEYWORDS.reports,
  path: '/reports'
})

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
