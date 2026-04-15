'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/header'
import {
  Camera,
  Mail,
  CheckCircle,
  ScanLine,
  Shield,
  Zap,
  Smartphone,
  Package,
  TrendingDown,
  ArrowRight,
} from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: ScanLine,
    title: 'Scan & Record',
    description: 'Scan the product barcode with your phone camera, hit record while you pack. The video captures everything — your hands, the product, the packaging — with a tamper-proof overlay showing order ID, timestamp, and unique proof code.',
    color: 'emerald',
  },
  {
    num: '02',
    icon: Mail,
    title: 'Send Proof Instantly',
    description: 'Enter the buyer\'s email and we send them a secure verification link. The video is uploaded, the link is generated — all in seconds. No manual uploads, no complicated workflows.',
    color: 'blue',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Buyer Confirms',
    description: 'Your buyer opens the link, watches the packing video, and confirms the package condition. They can report if anything arrived damaged, had wrong items, or was missing parts. All tracked in your dashboard.',
    color: 'purple',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Tamper-Proof Videos',
    description: 'Order ID, timestamp, and unique code are burned into every frame. Videos cannot be edited or faked.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Built for sellers on the go. Scan barcodes, record videos, and send proof — all from your phone.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'From scan to send in under 30 seconds. No complex setup, no training needed.',
  },
  {
    icon: TrendingDown,
    title: 'Reduce Disputes',
    description: 'Video proof eliminates "item not received" and "wrong item sent" claims. Save time and money on chargebacks.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.15),transparent_50%)]" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative px-4 py-16 sm:py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              {/* Logo */}
              <div className="relative">
                <div className="absolute -inset-3 bg-white/10 rounded-2xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <Image
                    src="/logo.jpeg"
                    alt="ShipProof logo"
                    width={100}
                    height={177}
                    className="w-[80px] h-auto sm:w-[100px] rounded-lg"
                    priority
                  />
                </div>
              </div>

              {/* Badge */}
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                <span className="text-emerald-100 text-sm font-medium">Video Proof for Every Order</span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Ship with Confidence.
                <br />
                <span className="text-emerald-200">Prove Every Pack.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-emerald-100/80 max-w-lg leading-relaxed">
                Record packing videos with proof overlays. Send tamper-proof links to buyers. Get confirmed receipts. Disputes disappear.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-black/20 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/record">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Recording
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white font-semibold text-base px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all"
                >
                  <Link href="/dashboard">
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="mt-12 flex justify-center gap-8 sm:gap-12">
                {[
                  { value: '30s', label: 'Scan to Send' },
                  { value: '100%', label: 'Tamper-Proof' },
                  { value: '0', label: 'Disputes' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-emerald-200/70 text-xs sm:text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 60V20C360 60 720 0 1080 30C1260 45 1380 40 1440 35V60H0Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Simple Process</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                How ShipProof Works
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto">
                Three simple steps to protect every shipment you send out.
              </p>
            </div>

            <div className="flex flex-col gap-8 sm:gap-12">
              {steps.map((step, i) => {
                const Icon = step.icon
                const colorClasses = {
                  emerald: 'bg-emerald-100 text-emerald-600',
                  blue: 'bg-blue-100 text-blue-600',
                  purple: 'bg-purple-100 text-purple-600',
                }[step.color]

                return (
                  <div key={i} className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px h-8 sm:h-12 bg-gray-200" />
                      )}
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Step {step.num}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{step.title}</h3>
                      <p className="mt-2 text-gray-600 leading-relaxed text-sm sm:text-base">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== FEATURES GRID ===== */}
        <section className="py-16 sm:py-24 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Why ShipProof</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Built for Real Sellers
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto">
                Every feature is designed to make your life easier and protect your business.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 sm:p-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== SOCIAL PROOF ===== */}
        <section className="py-12 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">
              Works with your favorite platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
              {['Etsy', 'Shopify', 'WooCommerce', 'Amazon', 'eBay'].map((platform) => (
                <span key={platform} className="text-gray-300 font-bold text-lg sm:text-xl tracking-wide">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-center">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <Package className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Ready to Protect Your Orders?
                </h2>
                <p className="mt-3 text-emerald-100/80 max-w-md mx-auto">
                  Start recording proof videos today. No credit card required. Set up in under 60 seconds.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-10 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/record">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Free Now
                  </Link>
                </Button>
                <p className="mt-4 text-emerald-200/60 text-xs">
                  Free to use during beta. No credit card needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="ShipProof logo"
                width={28}
                height={50}
                className="h-7 w-auto rounded opacity-60"
              />
              <span className="text-sm font-semibold text-gray-300">ShipProof</span>
            </div>
            <p className="text-xs text-gray-500">
              Built for sellers who ship with care.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex gap-6 text-xs">
              <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">Support</span>
            </div>
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} ShipProof. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
