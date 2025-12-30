import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/Footer'

export default function CookiePolicyPage() {
  const sections = [
    {
      title: 'What Are Cookies?',
      icon: '🍪',
      content: [
        {
          subtitle: 'Definition',
          text: 'Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.',
        },
        {
          subtitle: 'How We Use Cookies',
          text: 'ResultEase uses cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. By continuing to use our Service, you consent to our use of cookies as described in this policy.',
        },
        {
          subtitle: 'Cookie Consent',
          text: 'When you first visit ResultEase, you may see a cookie consent notice. Your continued use of the Service indicates your acceptance of our cookie practices.',
        },
      ],
    },
    {
      title: 'Types of Cookies We Use',
      icon: '📋',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'These cookies are necessary for the Service to function properly. They enable core functionality such as user authentication, security, and session management. Without these cookies, you cannot use ResultEase.',
        },
        {
          subtitle: 'Functional Cookies',
          text: 'These cookies allow the Service to remember choices you make (such as your preferred language or region) and provide enhanced, personalized features. They may also be used to provide services you have requested.',
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics cookies to understand how visitors interact with our Service. These cookies help us improve our platform by collecting information about page views, user flows, and feature usage.',
        },
        {
          subtitle: 'Performance Cookies',
          text: 'These cookies collect information about how you use our Service, such as which pages you visit most often. This data helps us optimize the Service\'s performance and user experience.',
        },
      ],
    },
    {
      title: 'Third-Party Cookies',
      icon: '🔗',
      content: [
        {
          subtitle: 'Google Analytics',
          text: 'We use Google Analytics to analyze website traffic and user behavior. Google Analytics uses cookies to collect information about your use of ResultEase. This data is processed according to Google\'s Privacy Policy.',
        },
        {
          subtitle: 'Firebase Authentication',
          text: 'We use Firebase (Google Cloud) for user authentication. Firebase may set cookies to maintain your login session and ensure secure authentication.',
        },
        {
          subtitle: 'Other Services',
          text: 'We may use other third-party services that set cookies. These services help us provide features like payment processing, customer support, and marketing analytics.',
        },
        {
          subtitle: 'Third-Party Policies',
          text: 'Third-party cookies are subject to the privacy policies of those third parties. We encourage you to review their policies to understand how they use cookies.',
        },
      ],
    },
    {
      title: 'Cookie Categories',
      icon: '📊',
      content: [
        {
          subtitle: 'Session Cookies',
          text: 'These temporary cookies are deleted when you close your browser. They are essential for maintaining your login session and ensuring security while using ResultEase.',
        },
        {
          subtitle: 'Persistent Cookies',
          text: 'These cookies remain on your device for a set period or until you delete them. They help us remember your preferences and improve your experience across multiple visits.',
        },
        {
          subtitle: 'First-Party Cookies',
          text: 'These cookies are set directly by ResultEase and are used to provide core functionality and improve our Service.',
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'These cookies are set by third-party services we use (like Google Analytics, Firebase). They help us provide additional features and analyze usage patterns.',
        },
      ],
    },
    {
      title: 'How We Use Cookie Information',
      icon: '🎯',
      content: [
        {
          subtitle: 'Service Functionality',
          text: 'We use cookies to maintain your login session, remember your preferences, and ensure the Service works correctly.',
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'Cookie data helps us understand how users interact with ResultEase, which features are most popular, and where we can make improvements.',
        },
        {
          subtitle: 'Security',
          text: 'Cookies help us detect and prevent security threats, unauthorized access, and fraudulent activity.',
        },
        {
          subtitle: 'Personalization',
          text: 'We use cookies to personalize your experience, such as remembering your dashboard preferences and recently viewed reports.',
        },
      ],
    },
    {
      title: 'Managing Your Cookie Preferences',
      icon: '⚙️',
      content: [
        {
          subtitle: 'Browser Settings',
          text: 'Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, disabling cookies may limit your ability to use ResultEase.',
        },
        {
          subtitle: 'Essential Cookies',
          text: 'Please note that disabling essential cookies will prevent you from using core features of ResultEase, including logging in and accessing your account.',
        },
        {
          subtitle: 'Opt-Out Options',
          text: 'You can opt out of certain third-party cookies, such as Google Analytics, by visiting the respective third-party opt-out pages or adjusting your browser settings.',
        },
        {
          subtitle: 'Cookie Consent Withdrawal',
          text: 'You can withdraw your consent to non-essential cookies at any time by adjusting your browser settings or clearing your cookies. Note that this may affect Service functionality.',
        },
      ],
    },
    {
      title: 'Browser-Specific Instructions',
      icon: '🌐',
      content: [
        {
          subtitle: 'Google Chrome',
          text: 'Settings → Privacy and Security → Cookies and other site data → Manage cookies and site data',
        },
        {
          subtitle: 'Mozilla Firefox',
          text: 'Options → Privacy & Security → Cookies and Site Data → Manage Data',
        },
        {
          subtitle: 'Safari',
          text: 'Preferences → Privacy → Manage Website Data',
        },
        {
          subtitle: 'Microsoft Edge',
          text: 'Settings → Cookies and site permissions → Cookies and site data → Manage and delete cookies',
        },
      ],
    },
    {
      title: 'Do Not Track Signals',
      icon: '🚫',
      content: [
        {
          subtitle: 'DNT Support',
          text: 'Some browsers offer a "Do Not Track" (DNT) feature. Currently, ResultEase does not respond to DNT signals, as there is no industry standard for how to interpret them.',
        },
        {
          subtitle: 'Future Implementation',
          text: 'We may implement DNT support in the future as standards evolve. In the meantime, you can manage cookies through your browser settings.',
        },
      ],
    },
    {
      title: 'Cookie Retention',
      icon: '⏱️',
      content: [
        {
          subtitle: 'Session Cookies',
          text: 'Session cookies are deleted when you close your browser. They typically last for the duration of your browsing session.',
        },
        {
          subtitle: 'Persistent Cookies',
          text: 'Persistent cookies remain on your device for varying periods, typically ranging from a few days to two years, depending on their purpose.',
        },
        {
          subtitle: 'Authentication Cookies',
          text: 'Authentication cookies may persist for up to 30 days to maintain your login session, unless you log out or clear your cookies.',
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'Analytics cookies typically persist for up to 2 years to help us track user behavior over time.',
        },
      ],
    },
    {
      title: 'Updates to This Policy',
      icon: '📝',
      content: [
        {
          subtitle: 'Policy Changes',
          text: 'We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.',
        },
        {
          subtitle: 'Notification',
          text: 'We will notify you of significant changes to this policy by posting a notice on our website or sending an email notification.',
        },
        {
          subtitle: 'Review Date',
          text: 'This Cookie Policy was last updated on December 30, 2024. We encourage you to review this policy periodically.',
        },
        {
          subtitle: 'Continued Use',
          text: 'Your continued use of ResultEase after changes to this policy constitutes acceptance of the updated policy.',
        },
      ],
    },
    {
      title: 'Contact Us',
      icon: '📧',
      content: [
        {
          subtitle: 'Questions About Cookies',
          text: 'If you have questions about our use of cookies or this Cookie Policy, please contact us.',
        },
        {
          subtitle: 'Email',
          text: 'privacy@resultease.com',
        },
        {
          subtitle: 'Response Time',
          text: 'We aim to respond to cookie-related inquiries within 48 hours.',
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
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            This Cookie Policy explains how ResultEase uses cookies and similar technologies 
            to provide, improve, and protect our Service.
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

      {/* Cookie Policy Sections */}
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

          {/* Related Policies */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Related Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                For more information about how we handle your data, please review our other policies.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Privacy Policy →
                </a>
                <a
                  href="/terms"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Terms of Service →
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

