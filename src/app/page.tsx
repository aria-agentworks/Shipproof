'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Code2,
  Shield,
  Zap,
  Globe,
  Webhook,
  Server,
  Lock,
  ArrowRight,
  Upload,
  Eye,
  CheckCircle,
  Menu,
  X,
  Key,
  Activity,
  FileText,
  BadgeCheck,
} from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'API Reference', href: '/docs#endpoints' },
  { label: 'Dashboard', href: '/dashboard' },
]

const trustBadges = [
  { label: '99.99% Uptime SLA', icon: Activity },
  { label: 'SHA-256 Hashing', icon: Shield },
  { label: 'SOC2 Compliant', icon: Lock },
  { label: '<100ms API Latency', icon: Zap },
]

const features = [
  {
    icon: Code2,
    title: 'API-First Architecture',
    description: 'RESTful endpoints, no SDK required. Integrate in 5 minutes with any language or framework.',
  },
  {
    icon: Shield,
    title: 'SHA-256 Video Hashing',
    description: 'Cryptographic proof that every video is authentic and untampered. Verifiable at any time.',
  },
  {
    icon: Globe,
    title: 'White-Label Ready',
    description: 'Your brand, your domain. Buyers never see ShipProof. Fully customizable experience.',
  },
  {
    icon: Webhook,
    title: 'Real-Time Webhooks',
    description: 'Get notified instantly for every video upload and buyer confirmation. Integrate with any system.',
  },
  {
    icon: Server,
    title: 'Bulk Processing',
    description: 'Built for scale. Accepts S3 URLs, base64, and camera streams. 100k+ videos/day.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC2 compliant infrastructure. Data encrypted at rest and in transit. Role-based access.',
  },
  {
    icon: FileText,
    title: 'Verification Certificate',
    description: 'Download a professional PDF certificate for every shipment. Include it in dispute responses, share with buyers, or keep for your records.',
  },
  {
    icon: BadgeCheck,
    title: 'Storefront Trust Badge',
    description: 'Embed a "Verified by ShipProof" badge on your Shopify, Etsy, or website. Boost buyer confidence and increase conversion rates.',
  },
]

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload',
    description: 'Your warehouse cameras or systems POST video to our API',
  },
  {
    num: '02',
    icon: Eye,
    title: 'Stamp',
    description: 'We hash the video (SHA-256), generate a verification code, store it',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Verify',
    description: 'Buyer opens the link, watches, confirms. You get a webhook.',
  },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.jpeg"
              alt="ShipProof"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="text-lg font-bold text-gray-900 tracking-tight">ShipProof</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm">
              <Link href="/docs">
                <Key className="w-3.5 h-3.5 mr-1.5" />
                Get API Key
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg">
                <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>
                  <Key className="w-3.5 h-3.5 mr-1.5" />
                  Get API Key
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-gray-950">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Radial emerald glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(5,150,105,0.15),transparent_70%)]" />

          <div className="relative px-4 py-20 sm:py-28 lg:py-36">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">Enterprise API Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Video Proof Infrastructure
                <br />
                <span className="text-emerald-400">for Enterprise</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                API-first platform to record, verify, and prove every shipment. SHA-256 hashing. White-label. 100k+ videos/day.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/docs">
                    <Key className="w-4 h-4 mr-2" />
                    Get API Key
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white font-semibold text-base px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all"
                >
                  <Link href="/docs">
                    Read Docs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ===== TRUST BAR ===== */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trustBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{badge.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== API EXAMPLE ===== */}
        <section className="py-12 sm:py-20 px-4 bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                Developer Experience
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ship with one API call</h2>
            </div>

            <div className="space-y-4">
              {/* Request */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-gray-900 text-left">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">Terminal</span>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] font-bold">POST</Badge>
                </div>
                <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] leading-relaxed">
                  <code>
                    <span className="text-gray-500">{'curl -X POST '}</span>
                    <span className="text-emerald-400">{'https://shipproof.netlify.app/api/v1/video'}</span>
                    {' \\\n'}
                    <span className="text-gray-500">{'  -H '}</span>
                    <span className="text-yellow-400">{'"X-API-Key: sp_live_..."'}</span>
                    {' \\\n'}
                    <span className="text-gray-500">{'  -H '}</span>
                    <span className="text-yellow-400">{'"Content-Type: application/json"'}</span>
                    {' \\\n'}
                    <span className="text-gray-500">{'  -d '}</span>
                    <span className="text-yellow-400">{'\''}</span>
                    <span className="text-gray-300">{'{'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'    '}</span>
                    <span className="text-emerald-400">{'"order_id"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-yellow-400">{'"ORD-12345"'}</span>
                    <span className="text-gray-300">{','}</span>
                    {'\n'}
                    <span className="text-gray-300">{'    '}</span>
                    <span className="text-emerald-400">{'"buyer_email"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-yellow-400">{'"buyer@email.com"'}</span>
                    <span className="text-gray-300">{','}</span>
                    {'\n'}
                    <span className="text-gray-300">{'    '}</span>
                    <span className="text-emerald-400">{'"video_data"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-yellow-400">{'"base64..."'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'}'}</span>
                    <span className="text-yellow-400">{'\''}</span>
                  </code>
                </pre>
              </div>

              {/* Response */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-gray-900 text-left">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">Response</span>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] font-bold">200 OK</Badge>
                </div>
                <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] leading-relaxed">
                  <code>
                    <span className="text-gray-300">{'{'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'  '}</span>
                    <span className="text-emerald-400">{'"success"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-purple-400">true</span>
                    <span className="text-gray-300">{','}</span>
                    {'\n'}
                    <span className="text-gray-300">{'  '}</span>
                    <span className="text-emerald-400">{'"data"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-gray-300">{'{'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'    '}</span>
                    <span className="text-emerald-400">{'"verification_url"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-yellow-400">{'"/v/ABC12345"'}</span>
                    <span className="text-gray-300">{','}</span>
                    {'\n'}
                    <span className="text-gray-300">{'    '}</span>
                    <span className="text-emerald-400">{'"video_hash"'}</span>
                    <span className="text-gray-300">{': '}</span>
                    <span className="text-yellow-400">{'"sha256:a1b2c3..."'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'  }'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'}'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES GRID ===== */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">
                Platform Features
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Built for Scale</h2>
              <p className="mt-3 text-gray-500 max-w-lg mx-auto">
                Every feature designed for enterprise workloads and developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.title}
                    className="border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
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

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-24 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">API Flow</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Three Steps. Zero Friction.</h2>
              <p className="mt-3 text-gray-500 max-w-lg mx-auto">
                Integrate once, automate forever. From upload to buyer confirmation in under a second.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <Card key={step.num} className="border-0 shadow-sm bg-white">
                    <CardContent className="p-6 sm:p-8">
                      <div className="text-xs font-bold text-emerald-600 mb-4">Step {step.num}</div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <Zap className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Ship with Proof?</h2>
                <p className="mt-3 text-emerald-100/80 max-w-md mx-auto">
                  Get your free API key in seconds. 50 free videos/month. No credit card required.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-10 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/docs">
                    Get Your Free API Key
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="ShipProof"
                width={28}
                height={28}
                className="rounded opacity-60"
              />
              <div>
                <span className="text-sm font-semibold text-gray-300">ShipProof</span>
                <p className="text-xs text-gray-500 mt-0.5">Video proof infrastructure for modern commerce.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
              <Link href="/docs#endpoints" className="hover:text-gray-300 transition-colors">API Reference</Link>
              <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
              <a href="#" className="hover:text-gray-300 transition-colors">Status</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            </div>
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} ShipProof. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
