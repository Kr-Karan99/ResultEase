import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function DocumentationPage() {
  const quickStartSteps = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Click "Get Started Free" and sign in with your Google account. No credit card required.',
    },
    {
      step: '2',
      title: 'Complete Onboarding',
      description: 'Fill in your organization details. Choose between Independent Creator or Institute based on your needs.',
    },
    {
      step: '3',
      title: 'Upload Your First File',
      description: 'Go to the Upload page and select your Excel/CSV file containing student results.',
    },
    {
      step: '4',
      title: 'Map Columns',
      description: 'Review the detected columns and confirm the mapping. Our system auto-detects student names, roll numbers, and subjects.',
    },
    {
      step: '5',
      title: 'Analyze Results',
      description: 'Click "Start Analysis" and wait a few seconds for processing. View your comprehensive report!',
    },
  ]

  const fileFormatGuide = [
    {
      title: 'Supported Formats',
      content: [
        'Excel files (.xlsx, .xls)',
        'CSV files (.csv)',
        'Comma-separated values',
        'Tab-separated values',
      ],
    },
    {
      title: 'Required Columns',
      content: [
        'Student Name (or Name)',
        'Roll Number (or Roll No, Student ID)',
        'Subject columns with marks (e.g., Math, English, Science)',
      ],
    },
    {
      title: 'Best Practices',
      content: [
        'Ensure column headers are in the first row',
        'Use consistent naming for subjects',
        'Remove empty rows before uploading',
        'Keep marks as numbers (not text)',
      ],
    },
  ]

  const faqSections = [
    {
      title: 'Getting Started',
      questions: [
        {
          q: 'Do I need to install anything?',
          a: 'No! ResultEase is a web-based application. Just sign up and start using it in your browser.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes! We use Firebase Authentication and industry-standard encryption. Your files are processed securely and never stored permanently.',
        },
        {
          q: 'Can I use it on mobile?',
          a: 'Yes! ResultEase is fully responsive and works on tablets and smartphones, though desktop is recommended for large files.',
        },
      ],
    },
    {
      title: 'File Upload',
      questions: [
        {
          q: 'What file size limits are there?',
          a: 'Currently, we support files up to 10MB. For larger files, consider splitting them into multiple uploads.',
        },
        {
          q: 'What if my Excel format is different?',
          a: 'Our intelligent column mapper can detect various formats. You can also manually map columns during the preview step.',
        },
        {
          q: 'Can I upload multiple files at once?',
          a: 'Currently, you can upload one file at a time. We\'re working on batch upload for premium users.',
        },
      ],
    },
    {
      title: 'Analysis & Reports',
      questions: [
        {
          q: 'How is ranking calculated?',
          a: 'We use dense ranking based on total percentage. Students with the same percentage get the same rank.',
        },
        {
          q: 'Can I export reports?',
          a: 'Yes! You can export reports as PDF files. Premium plans will include Excel export and custom formats.',
        },
        {
          q: 'How long are reports stored?',
          a: 'Currently, reports are stored in your browser session. Premium plans will include cloud storage.',
        },
      ],
    },
    {
      title: 'Account & Team',
      questions: [
        {
          q: 'How do I add team members?',
          a: 'Go to Dashboard → Manage Members. Enter their email addresses and they\'ll receive access to your organization.',
        },
        {
          q: 'What\'s the difference between owner and member?',
          a: 'Owners can manage organization settings, add/remove members, and edit profile. Members can view and generate reports.',
        },
        {
          q: 'Can I change my account type?',
          a: 'Yes, you can update your account type and organization details from the Edit Profile page.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Documentation
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Started with ResultEase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know to start analyzing results like a pro.
          </p>
        </div>
      </section>

      {/* Setup Video */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl text-center">Setup & Getting Started Video</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Watch this tutorial to learn how to set up and use ResultEase
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="ResultEase Setup Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Start Guide
            </h2>
            <p className="text-xl text-gray-600">
              Get up and running in 5 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {quickStartSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* File Format Guide */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              File Format Guide
            </h2>
            <p className="text-xl text-gray-600">
              Prepare your Excel files for best results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {fileFormatGuide.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.content.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-4">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.questions.map((faq, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">
                Need More Help?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="secondary" size="lg" asChild>
                  <a href="/contact">Contact Support →</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <a href="/faq">View FAQ</a>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

