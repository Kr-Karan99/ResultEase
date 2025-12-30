import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | ResultEase',
  description: 'Sign in to your ResultEase account to manage your result analysis',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

