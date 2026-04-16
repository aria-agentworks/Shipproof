'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Key,
  Upload,
  BarChart3,
  AlertTriangle,
  Copy,
  ChevronRight,
  ArrowRight,
  Terminal,
  Check,
  Menu,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'authentication', label: 'Authentication', icon: Key },
  { id: 'register-seller', label: 'Register Seller', icon: ArrowRight },
  { id: 'upload-video', label: 'Upload Video', icon: Upload },
  { id: 'video-status', label: 'Video Status', icon: BarChart3 },
  { id: 'usage-stats', label: 'Usage Stats', icon: BarChart3 },
  { id: 'error-codes', label: 'Error Codes', icon: AlertTriangle },
]

/* ------------------------------------------------------------------ */
/*  Helper: Code Block                                                 */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  language,
}: {
  code: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative group rounded-lg overflow-hidden border border-white/[0.08] bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          {language && (
            <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {/* Code */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] leading-relaxed text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: HTTP Method Badge                                          */
/* ------------------------------------------------------------------ */

function MethodBadge({ method }: { method: string }) {
  const map: Record<string, string> = {
    POST: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    GET: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    PUT: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    DELETE: 'bg-red-500/15 text-red-400 border border-red-500/25',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded tracking-wide ${
        map[method] ?? map.GET
      }`}
    >
      {method}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: Section Heading                                            */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 pb-12">
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {description && (
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">{description}</p>
      )}
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: Param Table                                                */
/* ------------------------------------------------------------------ */

interface Param {
  name: string
  type: string
  required: boolean
  description: string
}

function ParamTable({ params }: { params: Param[] }) {
  return (
    <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.04] border-b border-white/[0.08]">
            <th className="text-left font-semibold text-gray-300 px-4 py-3">
              Field
            </th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3">
              Type
            </th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3 w-20">
              Required
            </th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr
              key={p.name}
              className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-4 py-2.5">
                <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">
                  {p.name}
                </code>
              </td>
              <td className="px-4 py-2.5 text-gray-500 text-xs">{p.type}</td>
              <td className="px-4 py-2.5">
                {p.required ? (
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    required
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-gray-500">optional</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-gray-400 text-xs leading-relaxed">
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Helper: Sub-heading                                                */
/* ------------------------------------------------------------------ */

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* Track active section on scroll */
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    setActiveSection(id)
    setSidebarOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-white tracking-tight">
            ShipProof API
          </span>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-white/[0.06]">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Key className="w-4 h-4" />
          Get API Key
        </Link>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* ---- Mobile header bar ---- */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-gray-950/95 backdrop-blur border-b border-white/[0.06]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-white">ShipProof API Docs</span>
        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          v1.0.0
        </span>
      </div>

      {/* ---- Sidebar overlay (mobile) ---- */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-[250px] bg-gray-900 border-r border-white/[0.06] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ---- Layout ---- */}
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[250px] bg-gray-900 border-r border-white/[0.06] z-30">
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-[250px]">
          <div className="max-w-3xl mx-auto px-5 sm:px-10 py-10 lg:py-14">
            {/* =============================================== */}
            {/*  1. OVERVIEW                                     */}
            {/* =============================================== */}
            <Section
              id="overview"
              title="Overview"
              description="ShipProof provides a RESTful API for programmatic video proof creation, storage, and verification. Every video is hashed with SHA-256 for tamper-proof verification."
            >
              {/* Base URL callout */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-6">
                <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Base URL</p>
                  <code className="text-sm font-mono text-emerald-400">
                    https://shipproof.netlify.app/api/v1
                  </code>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                All API responses are returned as JSON. A successful request follows this format:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": { ... }
}`}
              />

              <p className="text-sm text-gray-400 leading-relaxed mt-4 mb-3">
                Errors use a similar structure:
              </p>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": "Human-readable error message"
}`}
              />

              <div className="mt-6 p-4 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04]">
                <p className="text-sm text-emerald-300 font-medium mb-1">Quick start</p>
                <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1">
                  <li>Register a seller account to receive your API key</li>
                  <li>Upload a video with an order ID and optional buyer email</li>
                  <li>Share the verification URL with the buyer</li>
                  <li>Check status or retrieve usage statistics at any time</li>
                </ol>
              </div>
            </Section>

            {/* =============================================== */}
            {/*  2. AUTHENTICATION                               */}
            {/* =============================================== */}
            <Section
              id="authentication"
              title="Authentication"
              description="All endpoints except /seller/register require a valid API key. Pass your key using one of the two methods below."
            >
              <SubHeading>Method 1: X-API-Key Header</SubHeading>
              <CodeBlock
                language="http"
                code={`X-API-Key: sp_live_abc123def456...`}
              />

              <SubHeading>Method 2: Authorization Bearer Header</SubHeading>
              <CodeBlock
                language="http"
                code={`Authorization: Bearer sp_live_abc123def456...`}
              />

              <SubHeading>Example Request</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl https://shipproof.netlify.app/api/v1/video/ABC12345 \\
  -H "Authorization: Bearer sp_live_abc123def456..."`}
              />

              <div className="mt-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Security warning:</strong> Never expose your API key in client-side
                  JavaScript or public repositories. Keys prefixed with{' '}
                  <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">
                    sp_live_
                  </code>{' '}
                  have full production access.
                </p>
              </div>
            </Section>

            {/* =============================================== */}
            {/*  3. REGISTER SELLER                              */}
            {/* =============================================== */}
            <Section id="register-seller" title="Register Seller">
              {/* Endpoint heading */}
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  /api/v1/seller/register
                </code>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Create a new seller account and receive your API key. If an account with the
                provided email already exists, the existing credentials are returned.
              </p>

              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  {
                    name: 'name',
                    type: 'string',
                    required: true,
                    description: 'Your company or personal name',
                  },
                  {
                    name: 'email',
                    type: 'string',
                    required: true,
                    description: 'Valid email address for the account',
                  },
                  {
                    name: 'webhook_url',
                    type: 'string',
                    required: false,
                    description: 'URL to receive event notifications (optional)',
                  },
                ]}
              />

              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/seller/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corp",
    "email": "ops@acme.com",
    "webhook_url": "https://acme.com/api/shipproof-webhook"
  }'`}
              />

              <SubHeading>Response (201 Created)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "clx_8f14e45f",
    "name": "Acme Corp",
    "email": "ops@acme.com",
    "api_key": "sp_live_a1b2c3d4e5f6g7h8i9j0",
    "plan": "free",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}
              />

              <div className="mt-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Note:</strong> Save your API key immediately after registration. It
                  cannot be retrieved again. If you lose it, contact support to request a new
                  key.
                </p>
              </div>
            </Section>

            {/* =============================================== */}
            {/*  4. UPLOAD VIDEO                                 */}
            {/* =============================================== */}
            <Section id="upload-video" title="Upload Video">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  /api/v1/video
                </code>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Upload a packing or fulfillment video associated with an order. The video is
                hashed with SHA-256 for tamper-proof verification. You can provide the video as
                a base64-encoded string or as an external URL (e.g. S3). Optionally, an
                email notification with a verification link is sent to the buyer.
              </p>

              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  {
                    name: 'order_id',
                    type: 'string',
                    required: true,
                    description: 'Your internal order identifier',
                  },
                  {
                    name: 'buyer_email',
                    type: 'string',
                    required: false,
                    description:
                      'Email address of the buyer; a verification link will be sent automatically',
                  },
                  {
                    name: 'video_url',
                    type: 'string',
                    required: false,
                    description:
                      'Public URL to the video file (e.g. S3, GCS). Alternative to video_data.',
                  },
                  {
                    name: 'video_data',
                    type: 'string',
                    required: false,
                    description:
                      'Base64-encoded video file content. Alternative to video_url.',
                  },
                  {
                    name: 'video_hash',
                    type: 'string',
                    required: false,
                    description:
                      'Pre-computed SHA-256 hash of the video. Auto-computed if omitted.',
                  },
                  {
                    name: 'send_email',
                    type: 'boolean',
                    required: false,
                    description:
                      'Whether to send a verification email to the buyer (default: true)',
                  },
                ]}
              />

              <p className="text-xs text-gray-500 mb-5">
                Provide either <code className="text-gray-400">video_data</code> (base64) or{' '}
                <code className="text-gray-400">video_url</code> (external link). If both are
                omitted the request will fail.
              </p>

              <SubHeading>cURL Example (S3 URL)</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "Authorization: Bearer sp_live_a1b2c3d4e5f6g7h8i9j0" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-2024-78901",
    "buyer_email": "customer@example.com",
    "video_url": "https://s3.amazonaws.com/my-bucket/packing-vid.mp4",
    "send_email": true
  }'`}
              />

              <SubHeading>Python Example</SubHeading>
              <CodeBlock
                language="python"
                code={`import requests

API_KEY = "sp_live_a1b2c3d4e5f6g7h8i9j0"
BASE_URL = "https://shipproof.netlify.app/api/v1"

response = requests.post(
    f"{BASE_URL}/video",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "order_id": "ORD-2024-78901",
        "buyer_email": "customer@example.com",
        "video_url": "https://s3.amazonaws.com/my-bucket/packing-vid.mp4",
        "send_email": True,
    },
)

print(response.status_code)
print(response.json())`}
              />

              <SubHeading>Response (201 Created)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "video_id": "clx_9e2b7f1c",
    "unique_code": "ABC12345",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "order_id": "ORD-2024-78901",
    "buyer_email": "customer@example.com",
    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "status": "recorded",
    "email_sent": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}
              />
            </Section>

            {/* =============================================== */}
            {/*  5. VIDEO STATUS                                 */}
            {/* =============================================== */}
            <Section id="video-status" title="Video Status">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  /api/v1/video/:code
                </code>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Retrieve the current status and verification details for a video by its unique
                code. Returns buyer confirmation state, package condition, timestamps, and the
                tamper-proof SHA-256 hash.
              </p>

              <SubHeading>Path Parameters</SubHeading>
              <ParamTable
                params={[
                  {
                    name: 'code',
                    type: 'string',
                    required: true,
                    description:
                      'The unique verification code returned when the video was uploaded (e.g. ABC12345)',
                  },
                ]}
              />

              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl https://shipproof.netlify.app/api/v1/video/ABC12345 \\
  -H "Authorization: Bearer sp_live_a1b2c3d4e5f6g7h8i9j0"`}
              />

              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "clx_9e2b7f1c",
    "order_id": "ORD-2024-78901",
    "buyer_email": "customer@example.com",
    "unique_code": "ABC12345",
    "status": "confirmed",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "buyer_confirmed": true,
    "buyer_confirmed_at": "2024-01-16T14:20:00Z",
    "package_condition": "perfect",
    "buyer_comment": "Arrived in great condition",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}
              />

              <div className="mt-6 p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Status values:</strong>{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">
                    recorded
                  </code>{' '}
                  &mdash; video uploaded &bull;{' '}
                  <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs">
                    sent
                  </code>{' '}
                  &mdash; email delivered &bull;{' '}
                  <code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">
                    viewed
                  </code>{' '}
                  &mdash; buyer opened link &bull;{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">
                    confirmed
                  </code>{' '}
                  &mdash; buyer confirmed receipt
                </p>
              </div>
            </Section>

            {/* =============================================== */}
            {/*  6. USAGE STATS                                  */}
            {/* =============================================== */}
            <Section id="usage-stats" title="Usage Stats">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">
                  /api/v1/seller/:id/usage
                </code>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Retrieve usage statistics for a seller account. Returns the number of videos
                uploaded this month, total uploads, confirmed videos, and current plan.
              </p>

              <SubHeading>Path Parameters</SubHeading>
              <ParamTable
                params={[
                  {
                    name: 'id',
                    type: 'string',
                    required: true,
                    description:
                      'The seller ID returned during registration (e.g. clx_8f14e45f)',
                  },
                ]}
              />

              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl https://shipproof.netlify.app/api/v1/seller/clx_8f14e45f/usage \\
  -H "Authorization: Bearer sp_live_a1b2c3d4e5f6g7h8i9j0"`}
              />

              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "seller_id": "clx_8f14e45f",
    "plan": "business",
    "videos_this_month": 142,
    "total_videos": 3847,
    "confirmed_videos": 3201,
    "disputed_videos": 23,
    "month": "2024-01"
  }
}`}
              />
            </Section>

            {/* =============================================== */}
            {/*  7. ERROR CODES                                  */}
            {/* =============================================== */}
            <Section
              id="error-codes"
              title="Error Codes"
              description="All errors return a consistent JSON structure. The HTTP status code indicates the category of the error."
            >
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3 w-28">
                        Status
                      </th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        code: 200,
                        label: 'Success',
                        desc: 'The request was completed successfully.',
                        color: 'text-emerald-400',
                      },
                      {
                        code: 400,
                        label: 'Bad Request',
                        desc: 'Missing or invalid request parameters.',
                        color: 'text-amber-400',
                      },
                      {
                        code: 401,
                        label: 'Unauthorized',
                        desc: 'Missing, invalid, or expired API key.',
                        color: 'text-red-400',
                      },
                      {
                        code: 403,
                        label: 'Forbidden',
                        desc: 'Authenticated but not authorized for the requested resource.',
                        color: 'text-orange-400',
                      },
                      {
                        code: 404,
                        label: 'Not Found',
                        desc: 'The requested endpoint or resource does not exist.',
                        color: 'text-blue-400',
                      },
                      {
                        code: 429,
                        label: 'Rate Limited',
                        desc: 'Too many requests. Slow down and retry after the indicated cooldown.',
                        color: 'text-purple-400',
                      },
                      {
                        code: 500,
                        label: 'Internal Server Error',
                        desc: 'An unexpected error occurred. Please retry or contact support.',
                        color: 'text-red-400',
                      },
                    ].map((row) => (
                      <tr
                        key={row.code}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold bg-white/[0.06] px-2 py-0.5 rounded ${row.color}`}
                            >
                              {row.code}
                            </span>
                            <span className="text-xs text-gray-400">{row.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs leading-relaxed">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SubHeading>Error Response Format</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": "order_id is required"
}`}
              />

              <div className="mt-4 p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Rate limiting:</strong> By default the API
                  allows 60 requests per minute per API key. The{' '}
                  <code className="text-gray-300 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">
                    X-RateLimit-Remaining
                  </code>{' '}
                  and{' '}
                  <code className="text-gray-300 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">
                    X-RateLimit-Reset
                  </code>{' '}
                  headers are included in every response.
                </p>
              </div>
            </Section>

            {/* ---- Bottom CTA ---- */}
            <div className="mt-12 pt-10 border-t border-white/[0.06]">
              <div className="text-center p-8 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-lg font-bold text-white mb-2">Ready to integrate?</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Get your API key and start creating tamper-proof video verifications in
                  minutes.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                >
                  Get API Key
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
