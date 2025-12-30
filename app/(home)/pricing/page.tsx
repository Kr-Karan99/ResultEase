'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { pricingService } from '@/lib/services/PricingService'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PlanPricing {
  monthly: number
  annual: number
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [accountType, setAccountType] = useState<'independent' | 'institute'>('independent')
  const [selectedPlan, setSelectedPlan] = useState<string>('Go')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pricing state - fetched from Firestore
  const [pricing, setPricing] = useState<{
    goIndependent: PlanPricing | null
    goInstitute: PlanPricing | null
    premiumIndependent: PlanPricing | null
    premiumInstitute: PlanPricing | null
  }>({
    goIndependent: null,
    goInstitute: null,
    premiumIndependent: null,
    premiumInstitute: null,
  })

  // Fetch pricing data on mount
  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [goIndependent, goInstitute, premiumIndependent, premiumInstitute] = await Promise.all([
          pricingService.getPlanPricing('go', 'independent'),
          pricingService.getPlanPricing('go', 'institute'),
          pricingService.getPlanPricing('premium', 'independent'),
          pricingService.getPlanPricing('premium', 'institute'),
        ])

        setPricing({
          goIndependent,
          goInstitute,
          premiumIndependent,
          premiumInstitute,
        })
      } catch (err) {
        console.error('Error fetching pricing:', err)
        setError('Failed to load pricing. Please refresh the page.')
        // Set fallback values (current hardcoded prices)
        setPricing({
          goIndependent: { monthly: 299, annual: 2990 },
          goInstitute: { monthly: 999, annual: 9990 },
          premiumIndependent: { monthly: 599, annual: 5990 },
          premiumInstitute: { monthly: 1999, annual: 19990 },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  // Get plan configurations (features, descriptions, etc.)
  // Prices are fetched from Firestore and injected dynamically
  const getPlanConfig = () => {
    const freePlan = {
      name: 'Free',
      description: accountType === 'independent' 
        ? 'Perfect for small tuitions and individual teachers'
        : 'Perfect for small schools getting started',
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
    }

    const goPlan = {
      name: 'Go',
      description: accountType === 'independent'
        ? 'Ideal for growing academies and small schools'
        : 'Ideal for medium-sized schools',
      monthlyPrice: accountType === 'independent'
        ? (pricing.goIndependent?.monthly ?? 299)
        : (pricing.goInstitute?.monthly ?? 999),
      annualPrice: accountType === 'independent'
        ? (pricing.goIndependent?.annual ?? 2990)
        : (pricing.goInstitute?.annual ?? 9990),
      features: accountType === 'independent'
        ? [
            'Up to 200 students per analysis',
            'Advanced analytics',
            'Subject-wise performance',
            'Grade distribution charts',
            'Unlimited reports',
            'Priority email support',
            'Team collaboration (up to 3 members)',
            'Custom report templates',
          ]
        : [
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
    }

    const premiumPlan = {
      name: 'Premium',
      description: accountType === 'independent'
        ? 'For established academies with high volume'
        : 'For large schools and educational groups',
      monthlyPrice: accountType === 'independent'
        ? (pricing.premiumIndependent?.monthly ?? 599)
        : (pricing.premiumInstitute?.monthly ?? 1999),
      annualPrice: accountType === 'independent'
        ? (pricing.premiumIndependent?.annual ?? 5990)
        : (pricing.premiumInstitute?.annual ?? 19990),
      features: accountType === 'independent'
        ? [
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
          ]
        : [
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
    }

    return [freePlan, goPlan, premiumPlan]
  }

  const plans = getPlanConfig()

  const calculateSavings = (monthly: number, annual: number) => {
    if (monthly === 0) return 0
    const monthlyTotal = monthly * 12
    return Math.round(((monthlyTotal - annual) / monthlyTotal) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Header />
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

      {/* Error Alert */}
      {error && (
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                ⚠️ {error}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading pricing...</p>
            </div>
          ) : (
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
          )}
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

