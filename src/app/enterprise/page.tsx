'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/header'
import {
  ArrowRight,
  Shield,
  Globe,
  Server,
  Webhook,
  Layers,
  HeadphonesIcon,
  CheckCircle,
  Lock,
  Clock,
  FileCheck,
  Fingerprint,
} from 'lucide-react'

const trustMetrics = [
  { label: 'SOC 2 Type II Compliant' },
  { label: '99.99% Uptime SLA' },
  { label: 'SHA-256 Video Hashing' },
  { label: 'Sub-200ms API Response' },
  { label: 'GDPR Ready' },
  { label: '256-bit AES Encryption' },
]

const steps = [
  {
    num: '01',
    title: 'Your warehouse captures the packing video',
    description:
      'Camera systems, conveyor belt integrations, or manual uploads send video to our API. Any source, any format, any volume.',
  },
  {
    num: '02',
    title: 'ShipProof stamps and stores',
    description:
      'Every video is hashed with SHA-256, metadata is embedded, and stored in distributed storage. Tamper-proof by design.',
  },
  {
    num: '03',
    title: 'Buyer verifies via your domain',
    description:
      'We generate a white-label verification link on YOUR domain. No ShipProof branding. Your buyer, your experience.',
  },
]

const features = [
  {
    icon: Globe,
    title: 'White-Label',
    description:
      'Your domain, your branding, your buyer experience. ShipProof is invisible infrastructure.',
  },
  {
    icon: Fingerprint,
    title: 'Tamper-Proof Hashing',
    description:
      'SHA-256 hash of every video stored on-chain. If a single byte changes, verification fails.',
  },
  {
    icon: Server,
    title: 'Scale to Millions',
    description:
      'Built on distributed infrastructure. 100,000 videos/day is the starting point, not the ceiling.',
  },
  {
    icon: Webhook,
    title: 'Real-Time Webhooks',
    description:
      'Get notified the instant a buyer confirms or disputes. Integrate with your order management system.',
  },
  {
    icon: Layers,
    title: 'Multi-Platform',
    description:
      'One API, every platform. Works with Shopify, Amazon, Etsy, WooCommerce, or your custom stack.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Enterprise Support',
    description:
      'Dedicated account manager, 99.99% SLA, priority onboarding, and custom integrations.',
  },
]

const complianceItems = [
  {
    icon: FileCheck,
    title: 'SOC 2 Type II',
    description:
      'Annual audits by independent assessors. Your data handling meets the highest standards.',
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description:
      'Data processing agreements, right to erasure, and EU data residency available.',
  },
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description:
      'All videos encrypted at rest and in transit. Your content, protected.',
  },
  {
    icon: Clock,
    title: '99.99% Uptime SLA',
    description:
      'Backed by distributed infrastructure with automatic failover. We don\'t go down.',
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Header />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_50%)]" />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          <div className="relative px-4 py-20 sm:py-28 lg:py-36">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 px-4 py-1.5 text-sm font-medium mb-8">
                Enterprise API
              </Badge>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Video Proof Infrastructure
                <br />
                <span className="text-gray-400">for Platforms</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                ShipProof provides the API layer that handles packing video recording,
                tamper-proof hashing, buyer verification, and dispute resolution. Integrate
                in minutes, scale to millions.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-6 text-base rounded-lg transition-all"
                >
                  <Link href="/docs">
                    Read API Docs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white px-8 py-6 text-base rounded-lg transition-all"
                >
                  <a href="mailto:sales@shipproof.com">Contact Sales</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST METRICS BAR ===== */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {trustMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-2 text-gray-400 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
                How It Works
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Three steps to verified proof
              </h2>
            </div>

            <div className="flex flex-col gap-10 sm:gap-14">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-5 sm:gap-8">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold text-sm">{step.num}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-10 sm:h-14 bg-gradient-to-b from-white/10 to-transparent mt-3" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-gray-400 leading-relaxed text-sm sm:text-base max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== API OVERVIEW ===== */}
        <section className="py-20 sm:py-28 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
                API Overview
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Ship a video in one call
              </h2>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#111111] shadow-2xl">
              {/* Code window header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-gray-500 font-mono">POST /api/v1/video</span>
              </div>
              <div className="p-5 sm:p-6 overflow-x-auto">
                <pre className="text-[13px] sm:text-sm font-mono leading-relaxed text-gray-300">
                  <code>
{`POST /api/v1/video`}
<span className="text-gray-500">{`Authorization: Bearer sp_live_abc123`}</span>
{`
{`}
{`  "order_id": "ORD-2024-78901",`}
{`  "buyer_email": "customer@example.com",`}
{`  "video_data": "<base64-encoded-video>"`}
{`}

`}
<span className="text-gray-500">{`// Response:`}</span>
{`
{`}
{`  "success": true,`}
{`  "data": {`}
{`    "verification_url": "https://yourdomain.com/verify/ABC123",`}
{`    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb924...",`}
{`    "created_at": "2024-01-15T10:30:00Z"`}
{`  }`}
{`}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                asChild
                variant="outline"
                className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Link href="/docs">
                  View Full API Reference
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ===== WHY ENTERPRISE ===== */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
                Why Enterprise
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Built for scale. Designed for trust.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div
                    key={i}
                    className="group p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== COMPLIANCE ===== */}
        <section className="py-20 sm:py-28 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
                Security
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Enterprise-Grade Security & Compliance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {complianceItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-white/5 bg-white/[0.02]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/80 to-[#0a0a0a] p-10 sm:p-16 text-center">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Ready to Integrate?
                </h2>
                <p className="mt-4 text-gray-400 max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
                  Get your API key in 60 seconds. No contracts, no talks. Start with 1,000 free
                  videos.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-6 text-base rounded-lg transition-all"
                  >
                    <Link href="/docs">
                      Get API Key
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white px-8 py-6 text-base rounded-lg transition-all"
                  >
                    <a href="mailto:sales@shipproof.com">Talk to Sales</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-base font-bold text-white">ShipProof</span>
              <p className="mt-1 text-sm text-gray-500">
                Video proof infrastructure for modern commerce.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-6 text-sm">
              <Link
                href="/docs"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Docs
              </Link>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                Status
              </span>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                Terms
              </span>
              <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                Security
              </span>
            </div>
            <p className="text-xs text-gray-600">
              &copy; 2024 ShipProof Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
