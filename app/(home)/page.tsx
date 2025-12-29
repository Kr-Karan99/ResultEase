import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { generateMetadata as genMeta, generateStructuredData, SEO_KEYWORDS, getDefaultFAQs } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'School Result Analysis Made Simple',
  description: 'Transform your Excel result files into professional insights and visual reports instantly. Free online tool for teachers and schools to analyze student performance.',
  keywords: SEO_KEYWORDS.home,
  path: '/'
})

export default function HomePage() {
  // Generate structured data for SEO
  const organizationSchema = generateStructuredData('Organization')
  const webAppSchema = generateStructuredData('SoftwareApplication')
  const faqSchema = generateStructuredData('FAQPage', getDefaultFAQs())
  const features = [
    {
      title: 'Excel Upload & Processing',
      description: 'Simply upload your Excel or CSV files. Our system handles different formats and column structures automatically.',
      icon: '📊',
    },
    {
      title: 'Instant Analysis',
      description: 'Get comprehensive insights including rankings, averages, pass rates, and performance trends in seconds.',
      icon: '⚡',
    },
    {
      title: 'Professional Reports',
      description: 'Generate clean, visual reports with charts, tables, and insights that are perfect for sharing with administration.',
      icon: '📈',
    },
    {
      title: 'No Technical Skills Required',
      description: 'Designed for teachers and educators. No complex setup, no technical knowledge needed. Just upload and analyze.',
      icon: '🎯',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Upload',
      description: 'Upload your Excel result file with student names, roll numbers, and subject marks.',
    },
    {
      number: '2',
      title: 'Analyze',
      description: 'Our system automatically processes your data and generates comprehensive insights.',
    },
    {
      number: '3',
      title: 'Review',
      description: 'View interactive charts, rankings, and detailed analysis of student performance.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="school-container py-20">
          <div className="text-center">
            <Badge variant="info" className="mb-4">
              ✨ Trusted by 100+ schools
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              School Result Analysis
              <span className="block text-school-blue">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your Excel result files into professional insights and visual reports instantly. 
              Save hours of manual work and reduce calculation errors with our automated analysis tool.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <GoogleAuthButton variant="school" size="lg" />
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  View Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              No signup required • Works with any Excel format • Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="school-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for result analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for educators and school administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="school-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get professional result analysis in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-school-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform -translate-y-0.5" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/upload">
              <Button size="lg" variant="school">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="school-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why teachers love ResultEase
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-school-green text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save hours of manual work</h3>
                    <p className="text-gray-600">Automated calculations and analysis eliminate tedious manual work</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-school-green text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reduce calculation errors</h3>
                    <p className="text-gray-600">Accurate, consistent results every time with automated processing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-school-green text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Professional presentations</h3>
                    <p className="text-gray-600">Generate impressive reports for parents, staff, and administration</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-school-green text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Works with any format</h3>
                    <p className="text-gray-600">Upload any Excel or CSV file structure - we handle the rest</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Try it now - it's free!
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first result file and see the magic happen in seconds.
              </p>
              <Link href="/upload">
                <Button size="lg" variant="school" className="w-full">
                  Analyze Results Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, webAppSchema, faqSchema])
        }}
      />
    </div>
  )
}
