'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/Footer'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [accountType, setAccountType] = useState<'independent' | 'institute'>('independent')
  const [selectedPlan, setSelectedPlan] = useState<string>('Go')

  // Independent Creator Pricing
  const independentPlans = [
    {
      name: 'Free',
      description: 'Perfect for small tuitions and individual teachers',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 15 students per analysis',
        'Basic result analysis',
        'Student rankings',
        'PDF report export',
        'Up to 2 reports per month',
        'Email support',
      ],
      limitations: ['Limited to 15 students', '2 reports/month'],
      popular: false,
    },
    {
      name: 'Go',
      description: 'Ideal for growing academies and small schools',
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        'Up to 200 students per analysis',
        'Advanced analytics',
        'Subject-wise performance',
        'Grade distribution charts',
        'Unlimited reports',
        'Priority email support',
        'Team collaboration (up to 3 members)',
        'Custom report templates',
      ],
      limitations: [],
      popular: true,
    },
    {
      name: 'Premium',
      description: 'For established academies with high volume',
      monthlyPrice: 599,
      annualPrice: 5990,
      features: [
        'Unlimited students per analysis',
        'All Go features',
        'Historical data tracking',
        'Multi-year comparisons',
        'Advanced visualizations',
        'Priority support (24h response)',
        'Unlimited team members',
        'API access',
        'Custom branding',
        'Dedicated account manager',
      ],
      limitations: [],
      popular: false,
    },
  ]

  // Institute Pricing
  const institutePlans = [
    {
      name: 'Free',
      description: 'Perfect for small schools getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 15 students per analysis',
        'Basic result analysis',
        'Student rankings',
        'PDF report export',
        'Up to 2 reports per month',
        'Email support',
      ],
      limitations: ['Limited to 15 students', '2 reports/month'],
      popular: false,
    },
    {
      name: 'Go',
      description: 'Ideal for medium-sized schools',
      monthlyPrice: 999,
      annualPrice: 9990,
      features: [
        'Up to 500 students per analysis',
        'Advanced analytics',
        'Subject-wise performance',
        'Grade distribution charts',
        'Unlimited reports',
        'Priority email support',
        'Team collaboration (up to 10 members)',
        'Custom report templates',
        'Bulk upload support',
      ],
      limitations: [],
      popular: true,
    },
    {
      name: 'Premium',
      description: 'For large schools and educational groups',
      monthlyPrice: 1999,
      annualPrice: 19990,
      features: [
        'Unlimited students per analysis',
        'All Go features',
        'Historical data tracking',
        'Multi-year comparisons',
        'Advanced visualizations',
        'Priority support (24h response)',
        'Unlimited team members',
        'API access',
        'Custom branding',
        'Dedicated account manager',
        'SIS integration',
        'White-label options',
      ],
      limitations: [],
      popular: false,
    },
  ]

  const plans = accountType === 'independent' ? independentPlans : institutePlans

  const calculateSavings = (monthly: number, annual: number) => {
    if (monthly === 0) return 0
    const monthlyTotal = monthly * 12
    return Math.round(((monthlyTotal - annual) / monthlyTotal) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose the Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Flexible pricing for independent creators and institutes. Start free, upgrade anytime.
          </p>

          {/* Account Type Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setAccountType('independent')
                setSelectedPlan('Go')
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                accountType === 'independent'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Independent Creator
            </button>
            <button
              onClick={() => {
                setAccountType('institute')
                setSelectedPlan('Go')
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                accountType === 'institute'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Institutes
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-blue-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : ''
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice
              const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice)
              const displayPrice = price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`
              const period = price === 0 ? '' : billingCycle === 'monthly' ? '/month' : '/year'

              const isSelected = selectedPlan === plan.name
              
              return (
                <Card
                  key={index}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    isSelected ? 'border-2 border-blue-600 shadow-lg scale-105' : ''
                  }`}
                >
                  {plan.popular && !isSelected && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  {isSelected && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                      Selected
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base mb-4">{plan.description}</CardDescription>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{displayPrice}</span>
                      {period && <span className="text-gray-600 ml-2">{period}</span>}
                    </div>
                    {billingCycle === 'annual' && savings > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        Save {savings}% compared to monthly billing
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={plan.popular ? 'school' : 'outline'}
                      size="lg"
                      className="w-full mb-6"
                      asChild
                    >
                      <a href="/login">
                        {plan.name === 'Free' ? 'Get Started Free' : 'Choose Plan'}
                      </a>
                    </Button>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Limitations:</p>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="text-orange-500 mr-2">•</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate any charges.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, and net banking. All payments are 
                  processed securely through our payment partners.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">
                  Yes! The Free plan is available forever with no credit card required. You can upgrade 
                  to paid plans anytime to unlock more features.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Absolutely! You can cancel your subscription at any time. You'll continue to have access 
                  until the end of your billing period.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Our team is here to help you choose the right plan.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href="/contact">Contact Sales →</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

