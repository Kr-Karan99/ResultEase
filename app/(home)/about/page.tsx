import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  const stats = [
    { value: '10,000+', label: 'Results Analyzed', icon: '📊' },
    { value: '500+', label: 'Schools & Academies', icon: '🏫' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' },
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Education First',
      description: 'We believe in empowering educators with tools that make their work easier and more impactful.',
    },
    {
      icon: '🔒',
      title: 'Privacy & Security',
      description: 'Your data is sacred. We implement industry-leading security measures to protect student information.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We continuously improve our platform based on feedback from teachers and administrators.',
    },
    {
      icon: '🤝',
      title: 'Community Driven',
      description: 'Built by educators, for educators. We listen to our community and evolve together.',
    },
  ]

  const team = [
    {
      name: 'Product Development',
      description: 'Building intuitive tools for educators',
      icon: '💻',
    },
    {
      name: 'Customer Success',
      description: 'Ensuring you get the most out of ResultEase',
      icon: '🎓',
    },
    {
      name: 'Security & Compliance',
      description: 'Protecting your data 24/7',
      icon: '🛡️',
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: 'ResultEase Launch',
      description: 'Launched our platform to help schools analyze results efficiently',
    },
    {
      year: '2024',
      title: 'Advanced Features',
      description: 'Introduced member management, role-based access, and enhanced analytics',
    },
    {
      year: 'Coming Soon',
      title: 'AI-Powered Insights',
      description: 'Working on predictive analytics and personalized recommendations',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            About ResultEase
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Making Result Analysis Simple for Every School
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ResultEase was born from a simple idea: educators should spend less time on data entry 
            and more time understanding student performance. We're on a mission to transform how 
            schools analyze and visualize academic results.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <CardTitle className="text-3xl font-bold text-blue-600">
                    {stat.value}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                Our Mission
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg max-w-3xl mx-auto">
                To empower every educator with intelligent tools that transform raw data into 
                actionable insights, enabling better decision-making and improved student outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-100 text-lg max-w-3xl mx-auto">
                We believe that when teachers have the right tools, they can focus on what truly 
                matters—helping students succeed. ResultEase is our contribution to making 
                education better, one analysis at a time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{value.icon}</div>
                    <div>
                      <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Building the future of result analysis
            </p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                        {milestone.year}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{milestone.title}</CardTitle>
                      <CardDescription className="text-base">
                        {milestone.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate professionals dedicated to education technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-5xl mb-4">{member.icon}</div>
                  <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                  <CardDescription className="text-base">
                    {member.description}
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
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Join Thousands of Educators
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mb-6">
                Start analyzing your results with ResultEase today. Free to get started, 
                no credit card required.
              </CardDescription>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="school" size="lg" asChild>
                  <a href="/login">Get Started Free →</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/contact">Contact Us</a>
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

