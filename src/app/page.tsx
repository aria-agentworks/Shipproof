'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/header'
import {
  Shield,
  Zap,
  Globe,
  Webhook,
  Server,
  Lock,
  ArrowRight,
  Code2,
  CheckCircle,
  Upload,
  Eye,
} from 'lucide-react'

const stats = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '<100ms', label: 'API Latency' },
  { value: 'SHA-256', label: 'Video Hashing' },
  { value: 'SOC 2', label: 'Compliant' },
]

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload via API',
    description: 'Send a POST request with order ID and video data (base64 or S3 URL). Our API returns a unique verification code instantly.',
  },
  {
    num: '02',
    icon: Eye,
    title: 'Share Verification URL',
    description: 'Get a branded verification link for each order. Send it to your buyer automatically via email or embed it in your tracking page.',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Buyer Confirms',
    description: 'The buyer watches the packing video and confirms receipt. You get real-time webhook notifications and a complete audit trail.',
  },
]

const features = [
  {
    icon: Code2,
    title: 'API-First Architecture',
    description: 'RESTful API with clean JSON responses. No SDK required — integrate in minutes with any language.',
  },
  {
    icon: Shield,
    title: 'SHA-256 Video Hashing',
    description: 'Every video is cryptographically hashed. Buyers and sellers can verify integrity at any time.',
  },
  {
    icon: Globe,
    title: 'White-Label',
    description: 'Your brand, your domain, your colors. Invisible infrastructure — your customers never see ShipProof.',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Real-time event notifications for video.created and buyer.confirmed. Integrate with any system.',
  },
  {
    icon: Server,
    title: 'Bulk Processing',
    description: '100k+ videos per day via S3/R2 integration. Built for high-throughput warehouse operations.',
  },
  {
    icon: Lock,
    title: 'SOC 2 Compliant',
    description: 'Enterprise-grade security with encrypted storage, access controls, and audit logging.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-gray-950">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }} />
          {/* Radial glow */}
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
                API-first platform for packing verification. Upload videos programmatically, 
                generate tamper-proof verification URLs, and get cryptographic proof of every shipment.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/docs">
                    <Code2 className="w-4 h-4 mr-2" />
                    Get Your API Key
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white font-semibold text-base px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all"
                >
                  <Link href="/docs#endpoints">
                    View API Reference
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Code preview */}
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-gray-900/80 backdrop-blur-sm text-left">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">Terminal</span>
                  </div>
                  <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] leading-relaxed text-gray-300">
                    <code>{`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "X-API-Key: sp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-12345",
    "buyer_email": "buyer@email.com",
    "video_data": "base64..."
  }'`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ===== API STATS ===== */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-24 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">API Flow</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Three Steps. Zero Friction.
              </h2>
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

        {/* ===== FEATURES GRID ===== */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Platform Features</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                Built for Scale
              </h2>
              <p className="mt-3 text-gray-500 max-w-lg mx-auto">
                Every feature designed for enterprise workloads and developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
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

        {/* ===== API CODE EXAMPLE ===== */}
        <section className="py-16 sm:py-24 px-4 bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Developer Experience</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                Clean API. Any Language.
              </h2>
              <p className="mt-3 text-gray-400 max-w-lg mx-auto">
                RESTful endpoints with consistent JSON responses. Works with curl, Python, Node.js, Go, or any HTTP client.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-gray-900 text-left">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">JavaScript</span>
                </div>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto text-[13px] leading-relaxed text-gray-300">
                <code>{`const response = await fetch('/api/v1/video', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.SHIPPROOF_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    order_id: 'ORD-12345',
    buyer_email: 'buyer@email.com',
    video_data: base64VideoString,
  }),
});

const { data } = await response.json();
console.log(data.verification_url);
// → https://shipproof.netlify.app/v/ABC12345`}</code>
              </pre>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Start Building Today
                </h2>
                <p className="mt-3 text-emerald-100/80 max-w-md mx-auto">
                  Get your API key in seconds. 50 free videos per month. No credit card required.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-10 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/docs">
                    Get Your API Key
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
        <div className="max-w-4xl mx-auto px-4 py-10">
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
              Video proof infrastructure for enterprise.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex gap-6 text-xs">
              <Link href="/docs" className="hover:text-gray-300 cursor-pointer transition-colors">Docs</Link>
              <Link href="/docs#endpoints" className="hover:text-gray-300 cursor-pointer transition-colors">API Reference</Link>
              <a href="#" className="hover:text-gray-300 cursor-pointer transition-colors">Status</a>
              <a href="#" className="hover:text-gray-300 cursor-pointer transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 cursor-pointer transition-colors">Terms</a>
              <Link href="/pricing" className="hover:text-gray-300 cursor-pointer transition-colors">Pricing</Link>
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
