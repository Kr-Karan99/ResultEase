'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'features', name: 'Features', icon: '⚡' },
    { id: 'pricing', name: 'Pricing & Plans', icon: '💳' },
    { id: 'technical', name: 'Technical', icon: '🔧' },
    { id: 'account', name: 'Account & Privacy', icon: '🔒' },
  ]

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with ResultEase?',
      answer: 'Simply sign in with your Google account, complete the quick onboarding form with your organization details, and you\'re ready to upload your first Excel file. No credit card required for the free tier!',
    },
    {
      category: 'getting-started',
      question: 'What file formats do you support?',
      answer: 'We support Excel files (.xlsx, .xls) and CSV files (.csv). Your file should contain student information with columns for name/roll number and subject marks.',
    },
    {
      category: 'features',
      question: 'Can I preview my results before analyzing?',
      answer: 'Yes! After uploading, you\'ll see a preview of your data where you can verify the column mapping and detected subjects before running the analysis.',
    },
    {
      category: 'features',
      question: 'How is student ranking calculated?',
      answer: 'We use dense ranking based on total percentage. Students with the same percentage receive the same rank, and the next rank continues sequentially (e.g., if two students are #1, the next rank is #2, not #3).',
    },
    {
      category: 'features',
      question: 'Can I export the analysis reports?',
      answer: 'Yes! You can export your reports as PDF files. Simply click the "Export PDF" button on any report page, and it will generate a printable version.',
    },
    {
      category: 'features',
      question: 'What insights does the analysis provide?',
      answer: 'Our analysis includes student rankings, top performers, subject-wise performance, pass/fail rates, grade distributions, average scores, highest/lowest scores, and performance trends.',
    },
    {
      category: 'pricing',
      question: 'Is ResultEase really free?',
      answer: 'Yes! We offer a free tier that includes all core features. You can sign in with Google and start analyzing your results immediately. Premium features will be available in the future for advanced needs.',
    },
    {
      category: 'pricing',
      question: 'What are the limitations of the free plan?',
      answer: 'The free plan includes all essential features for result analysis. There are no artificial limitations on the number of students or reports you can generate.',
    },
    {
      category: 'pricing',
      question: 'Will there be premium plans in the future?',
      answer: 'Yes, we\'re working on premium plans that will include advanced features like historical data tracking, multi-year comparisons, custom branding, API access, and priority support.',
    },
    {
      category: 'technical',
      question: 'Do you store my student data?',
      answer: 'Currently, analysis results are stored temporarily in your browser session. We plan to add optional cloud storage for premium users. Your uploaded Excel files are never permanently stored on our servers.',
    },
    {
      category: 'technical',
      question: 'Is my data secure?',
      answer: 'Absolutely! We use Firebase Authentication for secure sign-in, and all data is processed with industry-standard security measures. We follow strict privacy policies and never share your data.',
    },
    {
      category: 'technical',
      question: 'What if my Excel file has a different format?',
      answer: 'Our intelligent column mapper can detect various formats. If your file has a unique structure, you can manually map columns during the preview step before analysis.',
    },
    {
      category: 'technical',
      question: 'Can I use ResultEase on mobile devices?',
      answer: 'Yes! ResultEase is fully responsive and works on tablets and smartphones. However, for the best experience with large Excel files, we recommend using a desktop or laptop.',
    },
    {
      category: 'account',
      question: 'Can I add team members to my account?',
      answer: 'Yes! Organization owners can add members by email in the "Manage Members" section of the dashboard. Members will have access to your organization\'s data and can generate reports.',
    },
    {
      category: 'account',
      question: 'How do I update my organization details?',
      answer: 'Go to your Dashboard and click "Edit Profile". You can update your organization name, contact information, address, and other details anytime.',
    },
    {
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can request account deletion by contacting our support team. All your data will be permanently removed from our systems within 30 days.',
    },
    {
      category: 'account',
      question: 'Who can see my reports?',
      answer: 'Only you and your organization members (if any) can access your reports. We maintain strict privacy controls and never share your data with third parties.',
    },
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about ResultEase
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-lg py-6 px-6 border-2 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filter
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg text-left">
                        {faq.question}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        {categories.find(c => c.id === faq.category)?.icon}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Still Have Questions */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

