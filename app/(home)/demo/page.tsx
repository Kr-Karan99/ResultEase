import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function DemoPage() {
  const demoSteps = [
    {
      step: '1',
      title: 'Upload Your Excel File',
      description: 'Simply drag and drop or select your Excel/CSV file containing student results.',
      icon: '📤',
    },
    {
      step: '2',
      title: 'Preview & Map Columns',
      description: 'Review your data and confirm column mapping. Our system auto-detects student names, roll numbers, and subjects.',
      icon: '👀',
    },
    {
      step: '3',
      title: 'Run Analysis',
      description: 'Click "Start Analysis" and watch as we process your data in seconds.',
      icon: '⚡',
    },
    {
      step: '4',
      title: 'View Results',
      description: 'Get comprehensive insights including rankings, charts, performance metrics, and more.',
      icon: '📊',
    },
    {
      step: '5',
      title: 'Export & Share',
      description: 'Export your report as PDF or share it with your team members.',
      icon: '💾',
    },
  ]

  const keyFeatures = [
    {
      title: 'Fast Processing',
      description: 'Analyze hundreds of students in seconds',
      icon: '⚡',
    },
    {
      title: 'Accurate Rankings',
      description: 'Dense ranking algorithm ensures fair results',
      icon: '🏆',
    },
    {
      title: 'Visual Reports',
      description: 'Beautiful charts and graphs for presentations',
      icon: '📈',
    },
    {
      title: 'Easy to Use',
      description: 'No technical skills required',
      icon: '🎯',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Product Demo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See ResultEase in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch how ResultEase transforms your Excel files into professional result analysis reports 
            in just a few clicks.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl text-center">ResultEase Feature Demo</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Watch how to upload, analyze, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="ResultEase Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your results analyzed
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {demoSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features Highlighted
            </h2>
            <p className="text-xl text-gray-600">
              What you'll see in the demo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Screenshots
            </h2>
            <p className="text-xl text-gray-600">
              A glimpse of what you'll experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Upload Interface', description: 'Simple drag-and-drop file upload' },
              { title: 'Data Preview', description: 'Review and map your columns' },
              { title: 'Analysis Dashboard', description: 'Comprehensive insights and charts' },
            ].map((screenshot, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm text-gray-600">Screenshot Preview</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{screenshot.title}</CardTitle>
                  <CardDescription>{screenshot.description}</CardDescription>
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
                Ready to Try It Yourself?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mb-6">
                Sign up free and start analyzing your results in minutes. No credit card required.
              </CardDescription>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="secondary" size="lg" asChild>
                  <a href="/login">Get Started Free →</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <a href="/features">View All Features</a>
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

