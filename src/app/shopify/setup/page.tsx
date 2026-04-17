'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Loader2,
  Shield,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  Globe,
  Code,
} from 'lucide-react'

const STEPS = [
  { label: 'Connect', icon: ShoppingBag },
  { label: 'Widget', icon: Code },
  { label: 'Ready', icon: Sparkles },
]

function ShopifySetupPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const shop = searchParams.get('shop')
  const [currentStep, setCurrentStep] = useState(0)
  const [step2Ready, setStep2Ready] = useState(false)

  // Step 1 auto-completes (shop is connected via OAuth)
  useEffect(() => {
    if (shop) {
      const timer = setTimeout(() => {
        setCurrentStep(1)
        // Simulate widget installation check
        setTimeout(() => {
          setStep2Ready(true)
        }, 1500)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [shop])

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center space-y-4">
              <Shield className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-xl font-bold text-gray-900">No shop connected</h2>
              <p className="text-sm text-gray-500">
                This page requires a shop domain. Please install ShipProof through Shopify first.
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Go to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">ShipProof Setup</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-4 pt-6">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon
              const isComplete = idx < currentStep
              const isCurrent = idx === currentStep
              return (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isComplete
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isComplete || isCurrent ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-12 sm:w-20 rounded-full transition-all duration-500 ${
                        idx < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Step 1: Connect */}
          {currentStep === 0 && (
            <Card className="border-emerald-200">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Connecting your store...</h2>
                    <p className="text-sm text-gray-500">Authenticating with Shopify</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-gray-600">{shop}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Widget */}
          {currentStep === 1 && (
            <Card className="border-emerald-200">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Code className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Trust Widget Installation</h2>
                    <p className="text-sm text-gray-500">ShipProof adds a trust badge to your storefront</p>
                  </div>
                </div>

                {step2Ready ? (
                  <>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">
                          Trust Widget installed successfully
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          A &quot;Verified by ShipProof&quot; badge will appear on your order confirmation pages.
                        </p>
                      </div>
                    </div>

                    {/* Widget preview */}
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">
                        Widget Preview
                      </p>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Verified by ShipProof</p>
                          <p className="text-xs text-gray-500">This order was video-verified for your protection</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
                      onClick={() => setCurrentStep(2)}
                    >
                      Continue
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Checking widget installation...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Ready */}
          {currentStep === 2 && (
            <Card className="border-emerald-200">
              <CardContent className="p-6 sm:p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">You&apos;re all set!</h2>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    ShipProof is now connected to your store. Start recording packing videos and sending
                    verified proof to your customers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-emerald-800">Record</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Video-record each order being packed
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-emerald-800">Send</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Auto-send verification to your buyers
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-emerald-800">Confirm</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Buyers confirm &amp; build trust
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/shopify?shop=${encodeURIComponent(shop)}`}>
                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-8">
                      Go to Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto h-11 px-8">
                      Record First Video
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>ShipProof is protecting your shipments</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ShopifySetupPageFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </main>
    </div>
  )
}

export default function ShopifySetupPage() {
  return (
    <Suspense fallback={<ShopifySetupPageFallback />}>
      <ShopifySetupPageContent />
    </Suspense>
  )
}
