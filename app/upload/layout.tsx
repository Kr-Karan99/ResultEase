import { Metadata } from 'next'
import { generateMetadata, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Upload Excel Results',
  description: 'Upload your Excel or CSV result files for instant analysis. Supports all common formats and provides comprehensive student performance insights.',
  keywords: SEO_KEYWORDS.upload,
  path: '/upload'
})

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
