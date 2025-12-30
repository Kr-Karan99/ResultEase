import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: '📋',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you sign up with Google, we collect your name, email address, and profile picture. For onboarding, we collect your organization details, contact information, and address.',
        },
        {
          subtitle: 'Result Data',
          text: 'We temporarily process the Excel/CSV files you upload containing student information and marks. This data is used solely for analysis and report generation.',
        },
        {
          subtitle: 'Usage Information',
          text: 'We collect information about how you use our platform, including analysis history, feature usage, and interaction patterns to improve our service.',
        },
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: '🎯',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to provide result analysis services, generate reports, and enable collaboration features within your organization.',
        },
        {
          subtitle: 'Account Management',
          text: 'Your account information is used to authenticate you, manage your profile, and facilitate member management if you\'re an organization owner.',
        },
        {
          subtitle: 'Communication',
          text: 'We may use your email to send important service updates, security alerts, and respond to your support requests.',
        },
        {
          subtitle: 'Platform Improvement',
          text: 'Aggregated, anonymized usage data helps us understand how to improve ResultEase and develop new features.',
        },
      ],
    },
    {
      title: 'Data Storage and Security',
      icon: '🔒',
      content: [
        {
          subtitle: 'Authentication',
          text: 'We use Firebase Authentication, a Google Cloud service, for secure user authentication. Your password is never stored by us—it\'s managed by Google.',
        },
        {
          subtitle: 'User Profiles',
          text: 'Your profile and organization data is stored in Google Cloud Firestore with industry-standard encryption at rest and in transit.',
        },
        {
          subtitle: 'Result Data',
          text: 'Currently, analysis results are stored temporarily in your browser session. Uploaded Excel files are processed in memory and never permanently stored on our servers.',
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict role-based access controls. Only you and authorized members of your organization can access your data.',
        },
      ],
    },
    {
      title: 'Data Sharing and Disclosure',
      icon: '🤝',
      content: [
        {
          subtitle: 'No Third-Party Selling',
          text: 'We never sell, rent, or trade your personal information or student data to third parties. Your data is yours.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We use trusted service providers like Firebase (Google Cloud) for infrastructure. They are contractually obligated to protect your data.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information if required by law, court order, or government regulation, or to protect our rights and users\' safety.',
        },
        {
          subtitle: 'Organization Members',
          text: 'If you\'re part of an organization, your owner and fellow members may access reports and data you generate within that organization.',
        },
      ],
    },
    {
      title: 'Your Rights and Choices',
      icon: '⚖️',
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You can access and update your profile information anytime from your dashboard. Owners can manage organization details.',
        },
        {
          subtitle: 'Data Export',
          text: 'You can export your analysis reports as PDF files. In the future, we\'ll provide data export for all your information.',
        },
        {
          subtitle: 'Account Deletion',
          text: 'You can request account deletion by contacting our support team. We\'ll delete your data within 30 days, except where legally required to retain it.',
        },
        {
          subtitle: 'Marketing Communications',
          text: 'You can opt out of promotional emails at any time using the unsubscribe link in our emails.',
        },
      ],
    },
    {
      title: 'Student Data Protection',
      icon: '👨‍🎓',
      content: [
        {
          subtitle: 'Minimal Collection',
          text: 'We only collect student data necessary for result analysis: names, roll numbers, and subject marks.',
        },
        {
          subtitle: 'Educational Purpose Only',
          text: 'Student data is used exclusively for generating performance reports and analytics. It\'s never used for advertising or profiling.',
        },
        {
          subtitle: 'Parental Rights',
          text: 'Schools and educators are responsible for obtaining necessary consent for student data processing as per local regulations.',
        },
        {
          subtitle: 'Data Retention',
          text: 'Student data in uploaded files is processed in memory and not permanently stored. Report data retention will be clearly communicated for premium features.',
        },
      ],
    },
    {
      title: 'Cookies and Tracking',
      icon: '🍪',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use cookies to maintain your login session and ensure the platform works correctly.',
        },
        {
          subtitle: 'Analytics',
          text: 'We may use analytics tools to understand how users interact with our platform, helping us improve the user experience.',
        },
        {
          subtitle: 'Your Control',
          text: 'You can control cookie preferences through your browser settings, though some features may not work without essential cookies.',
        },
      ],
    },
    {
      title: 'Children\'s Privacy',
      icon: '👶',
      content: [
        {
          subtitle: 'Not Directed at Children',
          text: 'ResultEase is designed for educators and school administrators, not for direct use by children under 13.',
        },
        {
          subtitle: 'Student Data via Schools',
          text: 'When schools upload student data, they are responsible for compliance with children\'s privacy laws like COPPA, FERPA, or local equivalents.',
        },
      ],
    },
    {
      title: 'International Data Transfers',
      icon: '🌍',
      content: [
        {
          subtitle: 'Global Infrastructure',
          text: 'We use Google Cloud (Firebase) which may store and process data in various regions. All transfers comply with applicable data protection laws.',
        },
        {
          subtitle: 'Data Protection Standards',
          text: 'We ensure appropriate safeguards are in place for international data transfers, including encryption and access controls.',
        },
      ],
    },
    {
      title: 'Changes to This Policy',
      icon: '📝',
      content: [
        {
          subtitle: 'Updates',
          text: 'We may update this privacy policy from time to time. We\'ll notify you of significant changes via email or a notice on our platform.',
        },
        {
          subtitle: 'Review Date',
          text: 'This policy was last updated on December 30, 2024. We encourage you to review it periodically.',
        },
        {
          subtitle: 'Continued Use',
          text: 'By continuing to use ResultEase after policy changes, you accept the updated terms.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Last Updated: December 30, 2024
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            At ResultEase, we take your privacy seriously. This policy explains how we collect, 
            use, and protect your information when you use our platform.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#section-${index}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    {section.icon} {section.title}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <Card key={index} id={`section-${index}`} className="scroll-mt-24">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Questions About Privacy?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to contact us.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">📧 Email: privacy@resultease.com</p>
                <p className="text-sm text-gray-600">
                  We'll respond to all privacy-related inquiries within 48 hours.
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Us →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

