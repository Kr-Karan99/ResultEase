import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/Footer'

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: '✅',
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing and using ResultEase ("Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.',
        },
        {
          subtitle: 'Updates to Terms',
          text: 'We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or a notice on our platform. Continued use of the Service after changes constitutes acceptance.',
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old or have parental consent to use ResultEase. By using the Service, you represent that you meet these requirements.',
        },
      ],
    },
    {
      title: 'Description of Service',
      icon: '📊',
      content: [
        {
          subtitle: 'What We Provide',
          text: 'ResultEase is an online platform that allows educators and educational institutions to upload Excel/CSV files containing student results and receive automated analysis, rankings, and visual reports.',
        },
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances.',
        },
        {
          subtitle: 'Service Modifications',
          text: 'We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We are not liable for any consequences of such changes.',
        },
      ],
    },
    {
      title: 'User Accounts and Registration',
      icon: '👤',
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To use ResultEase, you must create an account using Google Sign-In. You are responsible for maintaining the confidentiality of your account credentials.',
        },
        {
          subtitle: 'Account Information',
          text: 'You agree to provide accurate, current, and complete information during registration and onboarding. You must update your information promptly if it changes.',
        },
        {
          subtitle: 'Account Security',
          text: 'You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.',
        },
        {
          subtitle: 'Account Termination',
          text: 'We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.',
        },
      ],
    },
    {
      title: 'Acceptable Use',
      icon: '⚖️',
      content: [
        {
          subtitle: 'Permitted Use',
          text: 'You may use ResultEase solely for lawful educational purposes related to analyzing student academic results. Commercial use is permitted only within the scope of your subscription plan.',
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You agree not to: (a) upload malicious code or files; (b) attempt to gain unauthorized access to our systems; (c) use the Service to violate any laws; (d) interfere with or disrupt the Service; (e) resell or redistribute the Service without permission.',
        },
        {
          subtitle: 'Data Responsibility',
          text: 'You are responsible for ensuring you have proper authorization to upload and process student data. You must comply with applicable data protection laws (FERPA, COPPA, GDPR, etc.).',
        },
        {
          subtitle: 'Content Standards',
          text: 'Uploaded files must contain legitimate academic data. We reserve the right to reject or remove files that violate these standards.',
        },
      ],
    },
    {
      title: 'Subscription Plans and Billing',
      icon: '💳',
      content: [
        {
          subtitle: 'Free Plan',
          text: 'The Free plan is available indefinitely with limitations on students per analysis and reports per month. No credit card is required.',
        },
        {
          subtitle: 'Paid Plans',
          text: 'Paid subscription plans (Go, Premium) are billed monthly or annually. By subscribing, you agree to pay the fees specified at the time of purchase.',
        },
        {
          subtitle: 'Billing and Renewal',
          text: 'Subscriptions automatically renew unless cancelled before the renewal date. You authorize us to charge your payment method for renewal fees.',
        },
        {
          subtitle: 'Price Changes',
          text: 'We may change subscription prices with 30 days notice. Existing subscribers will be notified of price changes before renewal.',
        },
        {
          subtitle: 'Refunds',
          text: 'Refunds are provided at our discretion. Annual subscriptions cancelled within 30 days may be eligible for a prorated refund.',
        },
      ],
    },
    {
      title: 'Intellectual Property',
      icon: '©️',
      content: [
        {
          subtitle: 'Our Rights',
          text: 'ResultEase, including its software, design, logos, and content, is owned by us and protected by copyright, trademark, and other intellectual property laws.',
        },
        {
          subtitle: 'Your Data',
          text: 'You retain ownership of data you upload. By using the Service, you grant us a license to process your data solely for providing the Service.',
        },
        {
          subtitle: 'Reports and Outputs',
          text: 'Reports generated using ResultEase belong to you. You may use, share, and distribute these reports as needed for your educational purposes.',
        },
        {
          subtitle: 'Restrictions',
          text: 'You may not copy, modify, distribute, or create derivative works of the Service without our written permission.',
        },
      ],
    },
    {
      title: 'Privacy and Data Protection',
      icon: '🔒',
      content: [
        {
          subtitle: 'Privacy Policy',
          text: 'Your use of ResultEase is also governed by our Privacy Policy, which explains how we collect, use, and protect your information.',
        },
        {
          subtitle: 'Data Processing',
          text: 'We process your data in accordance with our Privacy Policy and applicable data protection laws. We implement industry-standard security measures.',
        },
        {
          subtitle: 'Student Data',
          text: 'When you upload student data, you represent that you have proper authorization and consent as required by applicable laws.',
        },
      ],
    },
    {
      title: 'Limitation of Liability',
      icon: '⚠️',
      content: [
        {
          subtitle: 'Service Disclaimer',
          text: 'ResultEase is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, or suitability of results for any purpose.',
        },
        {
          subtitle: 'Limitation of Damages',
          text: 'To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.',
        },
        {
          subtitle: 'Maximum Liability',
          text: 'Our total liability for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.',
        },
        {
          subtitle: 'No Guarantees',
          text: 'We do not guarantee that the Service will be error-free, secure, or continuously available. You use the Service at your own risk.',
        },
      ],
    },
    {
      title: 'Indemnification',
      icon: '🛡️',
      content: [
        {
          subtitle: 'Your Responsibility',
          text: 'You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; (d) unauthorized access to your account.',
        },
        {
          subtitle: 'Cooperation',
          text: 'You agree to cooperate with us in defending any claims. We reserve the right to assume exclusive defense and control of any matter subject to indemnification.',
        },
      ],
    },
    {
      title: 'Termination',
      icon: '🚪',
      content: [
        {
          subtitle: 'Termination by You',
          text: 'You may cancel your account at any time by contacting support or using account settings. Cancellation takes effect at the end of your billing period.',
        },
        {
          subtitle: 'Termination by Us',
          text: 'We may suspend or terminate your account immediately if you violate these Terms, engage in fraudulent activity, or fail to pay subscription fees.',
        },
        {
          subtitle: 'Effect of Termination',
          text: 'Upon termination, your right to use the Service ceases immediately. We may delete your account data after a reasonable retention period.',
        },
        {
          subtitle: 'Survival',
          text: 'Sections regarding intellectual property, limitation of liability, indemnification, and dispute resolution survive termination.',
        },
      ],
    },
    {
      title: 'Dispute Resolution',
      icon: '⚖️',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These Terms are governed by the laws of India, without regard to conflict of law principles.',
        },
        {
          subtitle: 'Dispute Process',
          text: 'Any disputes arising from these Terms or the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration.',
        },
        {
          subtitle: 'Jurisdiction',
          text: 'Any legal proceedings shall be conducted in courts located in Mumbai, Maharashtra, India.',
        },
      ],
    },
    {
      title: 'General Provisions',
      icon: '📝',
      content: [
        {
          subtitle: 'Entire Agreement',
          text: 'These Terms, together with our Privacy Policy, constitute the entire agreement between you and ResultEase regarding the Service.',
        },
        {
          subtitle: 'Severability',
          text: 'If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.',
        },
        {
          subtitle: 'Waiver',
          text: 'Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision.',
        },
        {
          subtitle: 'Assignment',
          text: 'You may not assign or transfer your account or these Terms without our written consent. We may assign these Terms without restriction.',
        },
        {
          subtitle: 'Contact Information',
          text: 'For questions about these Terms, contact us at legal@resultease.com or through our Contact page.',
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Please read these Terms of Service carefully before using ResultEase. 
            By using our Service, you agree to be bound by these Terms.
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

      {/* Terms Sections */}
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
                Questions About These Terms?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you have any questions about these Terms of Service, please don't hesitate to contact us.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">📧 Email: legal@resultease.com</p>
                <p className="text-sm text-gray-600">
                  We'll respond to all legal inquiries within 48 hours.
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

