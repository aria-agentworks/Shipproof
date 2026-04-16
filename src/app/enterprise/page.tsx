'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Server,
  Zap,
  Globe,
  Webhook,
  Users,
  ArrowRight,
  Code,
  Lock,
  CheckCircle,
  Terminal,
  Building2,
  Upload,
  Hash,
  Bell,
  Layers,
} from 'lucide-react'

const trustBadges = [
  { label: 'SOC2 Type II' },
  { label: '99.99% Uptime' },
  { label: 'GDPR Compliant' },
  { label: 'SHA-256 Hashing' },
  { label: 'End-to-End Encrypted' },
]

const features = [
  {
    icon: Code,
    title: 'API-First Architecture',
    description: 'RESTful API with programmatic video upload, verification, and webhook callbacks. Integrate in minutes, not months.',
  },
  {
    icon: Globe,
    title: 'White-Label Ready',
    description: 'Your buyers see your brand, not ours. Custom domains, custom email templates, zero ShipProof branding on verification pages.',
  },
  {
    icon: Server,
    title: 'Bulk Processing',
    description: 'Handle 100k+ videos per day. S3-compatible storage, async processing pipeline, and queue-based email delivery.',
  },
  {
    icon: Hash,
    title: 'Tamper-Proof Hashing',
    description: 'SHA-256 hash computed on every video on upload. Blockchain-ready audit trail. Cryptographic proof of authenticity.',
  },
  {
    icon: Bell,
    title: 'Webhook Notifications',
    description: 'Real-time callbacks for every event: video.created, email.sent, buyer.confirmed. Integrate with any system.',
  },
  {
    icon: Layers,
    title: 'Multi-Tenant',
    description: 'Manage thousands of sellers with per-API-key authentication, isolated data, and per-seller usage tracking.',
  },
]

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload',
    description: 'Your warehouse system or camera sends the video via our REST API. Supports S3 URLs, base64, and multipart uploads.',
  },
  {
    num: '02',
    icon: Lock,
    title: 'Stamp & Store',
    description: 'We compute the SHA-256 hash, store the video, and generate a unique verification URL. Tamper-proof by design.',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Verify',
    description: 'Buyer opens the link, watches the video, confirms receipt. You get a webhook with the confirmation data.',
  },
]

const enterpriseFeatures = [
  'Dedicated infrastructure',
  'Custom SLA (99.99% uptime)',
  'SSO / SAML authentication',
  'Priority email & Slack support',
  'Custom integrations',
  'Data residency options',
  'Audit log exports',
  'Onboarding & training',
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="ShipProof" width={28} height={50} className="h-8 w-auto rounded-md" />
            <span className="font-bold text-lg">ShipProof</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                API Docs
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                Pricing
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold ml-2">
                Get API Key
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Enterprise</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Video Proof Infrastructure
            <br />
            <span className="text-emerald-400">for Enterprise</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Programmatic packing verification at scale. 100,000+ shipments per day.
            API-first, white-label ready, tamper-proof by design.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/docs">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 h-12 text-base">
                Get Your API Key
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base">
                <Terminal className="w-4 h-4 mr-2" />
                Read the Docs
              </Button>
            </Link>
          </div>
          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-gray-300">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="border-y border-white/10 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Ship your first proof
                <br />
                <span className="text-emerald-400">in 30 seconds</span>
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                One API call. That&apos;s it. Send us a video URL, we return a tamper-proof verification link.
                No SDK required. No complex setup. Works with any language.
              </p>
              <div className="mt-8 space-y-3">
                {['Programmatic upload via REST API', 'SHA-256 hash computed automatically', 'Verification link returned instantly', 'Email sent to buyer (optional)'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {/* Request */}
              <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">POST</span>
                    <span className="text-xs text-gray-400 font-mono">/api/v1/video</span>
                  </div>
                  <span className="text-xs text-gray-500">bash</span>
                </div>
                <pre className="p-4 text-xs sm:text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "X-API-Key: sp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-12345",
    "buyer_email": "buyer@example.com",
    "video_url": "https://s3.amazonaws.com/bucket/video.webm"
  }'`}
                </pre>
              </div>
              {/* Response */}
              <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">Response</span>
                  <span className="text-xs text-gray-500">200 OK</span>
                </div>
                <pre className="p-4 text-xs sm:text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`{
  "success": true,
  "verification_url": "https://shipproof.netlify.app/v/ABC12345",
  "unique_code": "ABC12345",
  "timestamp": "2026-04-16T12:00:00Z",
  "hash": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "video_id": "clx..."
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Enterprise Features</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Built for Scale</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Every feature designed for platforms processing thousands of shipments daily.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-gray-900/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Simple Integration</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Three Steps to Ship Proof</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="text-center sm:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Step {step.num}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Pricing */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">Enterprise</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Custom pricing for high-volume operations</h2>
              <p className="mt-4 text-gray-400 max-w-lg">
                Dedicated infrastructure, custom SLAs, and white-glove onboarding. Built for platforms shipping 10k+ packages daily.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enterpriseFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feat}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 h-12">
                  Contact Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Or start free: 100 videos/month, no credit card. <Link href="/docs" className="text-emerald-400 hover:underline">Get API key</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="ShipProof" width={24} height={43} className="h-6 w-auto rounded" />
            <span className="text-sm font-semibold text-gray-300">ShipProof</span>
          </div>
          <p className="text-xs text-gray-500">The video proof infrastructure platform.</p>
          <div className="flex gap-5 text-xs text-gray-500">
            <Link href="/docs" className="hover:text-gray-300 transition-colors">API Docs</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Status</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-700 mt-6">
          &copy; {new Date().getFullYear()} ShipProof. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
