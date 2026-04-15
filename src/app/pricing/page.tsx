'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle,
  Zap,
  Building2,
  ArrowLeft,
  Crown,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PLANS,
  type PlanKey,
  type Currency,
  detectCurrency,
  getCurrencySymbol,
  formatPrice,
} from '@/lib/payment'

const planIcons: Record<PlanKey, typeof Zap> = {
  free: Zap,
  pro: Crown,
  business: Building2,
}

const planColors: Record<PlanKey, { border: string; badge: string; icon: string; cta: string }> = {
  free: {
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-700',
    icon: 'bg-gray-100 text-gray-600',
    cta: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  pro: {
    border: 'border-emerald-400 ring-2 ring-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'bg-emerald-100 text-emerald-600',
    cta: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  business: {
    border: 'border-purple-300 ring-2 ring-purple-50',
    badge: 'bg-purple-100 text-purple-700',
    icon: 'bg-purple-100 text-purple-600',
    cta: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [loading, setLoading] = useState<PlanKey | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setCurrency(detectCurrency())
  }, [])

  const handleSelectPlan = async (planKey: PlanKey) => {
    if (planKey === 'free') {
      router.push('/record')
      return
    }

    setLoading(planKey)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, currency }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'ShipProof',
        description: `${PLANS[planKey].name} Plan - ${data.order.currency}`,
        order_id: data.order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey,
            }),
          })

          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            toast({
              title: 'Payment successful!',
              description: `You're now on the ${PLANS[planKey].name} plan.`,
            })
            router.push('/record')
          } else {
            toast({
              title: 'Verification failed',
              description: 'Payment received but verification failed. Contact support.',
              variant: 'destructive',
            })
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#059669',
        },
        modal: {
          ondismiss: () => {
            setLoading(null)
          },
        },
      }

      const rzp = new (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: 'Payment error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  const currencies: Currency[] = ['INR', 'USD', 'EUR']

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-emerald-700 border-b border-emerald-600">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-emerald-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-white font-bold text-sm">Pricing</span>
          <div className="w-5" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>

          {/* Currency Switcher */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currency === c
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {(Object.keys(PLANS) as PlanKey[]).map((planKey) => {
            const plan = PLANS[planKey]
            const PlanIcon = planIcons[planKey]
            const colors = planColors[planKey]
            const isPopular = planKey === 'pro'

            return (
              <Card
                key={planKey}
                className={`relative flex flex-col ${colors.border} ${isPopular ? 'scale-[1.02]' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={`${colors.badge} text-xs font-semibold px-3 py-1`}>
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 flex flex-col flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon}`}>
                    <PlanIcon className="w-5 h-5" />
                  </div>

                  <h3 className="mt-3 text-lg font-bold">{plan.name}</h3>

                  <div className="mt-2">
                    {plan.price[currency] === 0 ? (
                      <span className="text-3xl font-extrabold">Free</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">
                          {formatPrice(plan.price[currency], currency)}
                        </span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {plan.limit === -1 ? 'Unlimited videos' : `${plan.limit} videos/month`}
                    {' · '}
                    {plan.emailsPerDay === -1 ? 'unlimited emails' : `${plan.emailsPerDay} emails/day`}
                  </p>

                  <ul className="mt-5 space-y-2.5 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(planKey)}
                    disabled={loading === planKey}
                    className={`mt-6 w-full h-11 font-semibold ${colors.cta}`}
                  >
                    {loading === planKey ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : planKey === 'free' ? (
                      'Start Free'
                    ) : (
                      `Choose ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'The Free plan is available forever with basic features. No credit card required.',
              },
              {
                q: 'What happens if I exceed my limit?',
                a: 'You will be prompted to upgrade. Your existing videos and data are never deleted.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-gray-900">{faq.q}</h3>
                <p className="mt-1 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
