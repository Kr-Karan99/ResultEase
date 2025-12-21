import { Metadata } from 'next'
import { generateMetadata, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard',
  description: 'View your result analysis dashboard with comprehensive insights, reports, and performance metrics for student assessment.',
  keywords: SEO_KEYWORDS.dashboard,
  path: '/dashboard'
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
