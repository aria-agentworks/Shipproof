'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Camera, Mail, CheckCircle } from 'lucide-react'
import Header from '@/components/header'

const steps = [
  {
    icon: Camera,
    title: 'Scan & Record',
    description: 'Point your camera at the order barcode, hit record while packing. That\'s it.',
  },
  {
    icon: Mail,
    title: 'Buyer Gets Proof',
    description: 'We email them a link to watch their order being packed.',
  },
  {
    icon: CheckCircle,
    title: 'They Confirm',
    description: 'Buyer confirms receipt right on the video page. Done.',
  },
]

const features = [
  'Unlimited video recordings',
  'Tamper-proof delivery links',
  'Automatic buyer notifications',
  'Dispute resolution dashboard',
  'Integrates with Etsy, Shopify, WooCommerce',
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <Image
              src="/logo.jpeg"
              alt="ShipProof logo"
              width={120}
              height={212}
              className="w-[120px] h-auto sm:w-[160px]"
            />
            <h1 className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Video Proof Every Order You Ship
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-md leading-relaxed">
              Record yourself packing. Send a tamper-proof video to your buyer. They confirm delivery. Disputes disappear.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-8 py-3 rounded-full"
            >
              <Link href="/record">Start Recording</Link>
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="flex flex-col gap-10">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-1 text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
              Trusted by sellers on Etsy, Shopify, and WooCommerce
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Simple Pricing</h2>
            <Card className="w-full max-w-sm border-gray-200 shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl font-bold">$29<span className="text-lg font-normal text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-2 pt-4">
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full"
                >
                  <Link href="/record">Start Free</Link>
                </Button>
                <p className="text-xs text-gray-500">No credit card required</p>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-100 mt-auto">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="ShipProof logo"
            width={48}
            height={85}
            className="w-10 h-auto opacity-60"
          />
          <p className="text-sm text-gray-500">
            Built for sellers who ship with care.
          </p>
        </div>
      </footer>
    </div>
  )
}
