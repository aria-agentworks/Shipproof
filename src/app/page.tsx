'use client'

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  Package,
  Camera,
  Mail,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Package className="w-4 h-4" />
                Trusted by 500+ Etsy & Shopify sellers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                Video Proof Your
                <span className="text-emerald-600 block">Orders Were Packed</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Record yourself packing each order. Your buyer gets a tamper-proof video link 
                proving their item was genuinely packed — not dropshipped. 
                <span className="font-semibold text-gray-900"> Fewer disputes, more trust, more sales.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/record">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 text-base font-semibold shadow-lg shadow-emerald-600/25 w-full sm:w-auto"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Recording Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/v/DEMO01">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-base font-semibold border-2 w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    See Demo Link
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">60s</p>
                  <p className="text-sm text-gray-500">Per order</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">99%</p>
                  <p className="text-sm text-gray-500">Dispute reduction</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">$29</p>
                  <p className="text-sm text-gray-500">Per month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Four simple steps. Under 60 seconds per order. Your buyers will love it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  icon: <Camera className="w-7 h-7" />,
                  title: 'Scan & Record',
                  description: 'Scan the order barcode, point your camera, and hit record while you pack the item. The video gets your Order ID, timestamp, and unique code burned in.',
                  color: 'emerald',
                },
                {
                  step: '2',
                  icon: <Package className="w-7 h-7" />,
                  title: 'Auto-Upload',
                  description: 'Video uploads automatically to secure cloud storage. You get a unique shareable link instantly. No manual saving or uploading needed.',
                  color: 'blue',
                },
                {
                  step: '3',
                  icon: <Mail className="w-7 h-7" />,
                  title: 'Email Sent',
                  description: 'Your buyer receives a branded email: "Watch your order #1042 being packed." They click the link and see the proof video instantly.',
                  color: 'purple',
                },
                {
                  step: '4',
                  icon: <ShieldCheck className="w-7 h-7" />,
                  title: 'Buyer Confirms',
                  description: 'The buyer watches the video and confirms receipt. You see the confirmation in your dashboard. Zero ambiguity, zero disputes.',
                  color: 'orange',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Sellers Love ShipProof
              </h2>
              <p className="text-lg text-gray-600">
                Built for sellers who ship with pride.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: 'Tamper-Proof Videos',
                  desc: 'Order ID, timestamp, and unique code are burned into the video. Cannot be edited or faked.',
                },
                {
                  title: 'Barcode Scanner',
                  desc: 'Scan order barcodes with your phone camera. No typing, no mistakes. Just scan and record.',
                },
                {
                  title: 'Buyer Confirmation',
                  desc: 'Buyers confirm receipt directly on the video page. You see it in your dashboard instantly.',
                },
                {
                  title: 'Mobile-First Design',
                  desc: 'Built for your phone. Record, upload, and send — all from the device in your pocket.',
                },
                {
                  title: 'Branded Emails',
                  desc: 'Professional emails with your store name. Buyers trust you before the package arrives.',
                },
                {
                  title: 'Dispute Protection',
                  desc: '"Item not received?" Show them the packing video. Case closed.',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex gap-4 p-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center shadow-xl shadow-emerald-600/20">
              <div className="inline-flex items-center gap-1 bg-white/20 text-sm px-3 py-1 rounded-full mb-4">
                <Star className="w-4 h-4 fill-current" />
                Launch Price
              </div>
              <h2 className="text-3xl font-bold mb-2">$29/mo</h2>
              <p className="text-emerald-100 mb-6">Everything you need. No limits.</p>
              <ul className="text-left space-y-3 mb-8">
                {[
                  'Unlimited video recordings',
                  'Unlimited email sends',
                  'Barcode scanning',
                  'Buyer confirmation tracking',
                  'Seller dashboard',
                  'Cloud video storage',
                  'Tamper-proof verification links',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-200 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/record">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold h-14 w-full text-base shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-emerald-200 text-xs mt-3">No credit card required to start</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to prove every order?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join hundreds of sellers who ship with confidence. Start recording in under 60 seconds.
            </p>
            <Link href="/record">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 text-base font-semibold"
              >
                Start Recording Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">ShipProof</span>
          </div>
          <p className="text-xs text-gray-500">
            Video proof your orders were packed. Built for sellers who care.
          </p>
        </div>
      </footer>
    </div>
  )
}
