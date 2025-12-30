import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Your Profile | ResultEase',
  description: 'Complete your profile setup to start using ResultEase',
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

