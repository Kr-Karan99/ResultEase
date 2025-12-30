import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/Footer'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: '📊',
      title: 'Excel Upload & Processing',
      description: 'Support for .xlsx, .xls, and .csv files with intelligent column detection. Our system automatically identifies student names, roll numbers, and subject marks.',
      highlights: ['Multiple format support', 'Auto column detection', 'Data validation', 'Error handling'],
    },
    {
      icon: '⚡',
      title: 'Instant Analysis',
      description: 'Get comprehensive insights in seconds. Calculate rankings, averages, pass rates, grade distributions, and performance trends automatically.',
      highlights: ['Dense ranking algorithm', 'Real-time calculations', 'Performance metrics', 'Trend analysis'],
    },
    {
      icon: '📈',
      title: 'Visual Reports',
      description: 'Generate professional reports with interactive charts, tables, and visualizations. Perfect for presentations and administrative reviews.',
      highlights: ['Bar charts', 'Line charts', 'Pie charts', 'PDF export'],
    },
    {
      icon: '🏆',
      title: 'Student Rankings',
      description: 'Automatic ranking with intelligent tie-breaking. Students with the same percentage receive the same rank, ensuring fair and accurate results.',
      highlights: ['Dense ranking', 'Top performers', 'Subject-wise rankings', 'Grade-based sorting'],
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Add team members to your organization. Owners can manage members, and everyone can collaborate on result analysis.',
      highlights: ['Member management', 'Role-based access', 'Shared reports', 'Organization settings'],
    },
    {
      icon: '🔒',
      title: 'Privacy & Security',
      description: 'Your data is processed securely. We use Firebase Authentication and industry-standard encryption to protect your information.',
      highlights: ['Secure authentication', 'Data encryption', 'Privacy controls', 'GDPR compliant'],
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Access ResultEase from any device. Our platform works seamlessly on desktop, tablet, and mobile devices.',
      highlights: ['Mobile-friendly', 'Tablet optimized', 'Desktop experience', 'Cross-platform'],
    },
    {
      icon: '🎯',
      title: 'Easy to Use',
      description: 'No technical skills required. Designed for educators, by educators. Simple interface that anyone can use.',
      highlights: ['Intuitive UI', 'Step-by-step guidance', 'Helpful tooltips', 'Quick onboarding'],
    },
    {
      icon: '📋',
      title: 'Performance Insights',
      description: 'Get detailed insights into student performance including pass/fail rates, grade distributions, subject-wise analysis, and more.',
      highlights: ['Pass/fail analysis', 'Grade distribution', 'Subject performance', 'Comparative analysis'],
    },
    {
      icon: '💾',
      title: 'Export & Share',
      description: 'Export your reports as PDF files. Share insights with administrators, parents, or save for records.',
      highlights: ['PDF export', 'Print-ready format', 'Shareable reports', 'Archive support'],
    },
    {
      icon: '🔄',
      title: 'Data Mapping',
      description: 'Intelligent column mapping with manual override options. Preview your data before analysis to ensure accuracy.',
      highlights: ['Auto-detection', 'Manual mapping', 'Data preview', 'Validation'],
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics including average scores, highest/lowest marks, performance trends, and statistical insights.',
      highlights: ['Average calculations', 'Min/max analysis', 'Trend visualization', 'Statistical reports'],
    },
  ]

  const benefits = [
    {
      title: 'Save Time',
      description: 'Reduce hours of manual calculation to seconds of automated analysis.',
      icon: '⏱️',
    },
    {
      title: 'Reduce Errors',
      description: 'Eliminate human errors in calculations and rankings with automated processing.',
      icon: '✅',
    },
    {
      title: 'Professional Output',
      description: 'Generate presentation-ready reports with professional charts and visualizations.',
      icon: '🎨',
    },
    {
      title: 'Better Insights',
      description: 'Discover patterns and trends in student performance with comprehensive analytics.',
      icon: '🔍',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Powerful Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Analyze Results
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ResultEase provides all the tools you need to transform raw Excel data into 
            actionable insights and professional reports.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="text-blue-600 mr-2">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ResultEase?
            </h2>
            <p className="text-xl text-gray-600">
              Benefits that make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Experience all these features and more. Sign up free today—no credit card required.
              </CardDescription>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="secondary" size="lg" asChild>
                  <a href="/login">Get Started Free →</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <a href="/demo">Watch Demo</a>
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

