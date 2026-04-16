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
  ArrowRight,
  Terminal,
  Check,
  Menu,
  X,
  Webhook,
  Zap,
  Loader2,
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
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'authentication', label: 'Authentication', icon: Key },
  { id: 'endpoints', label: 'Endpoints', icon: Terminal },
  { id: 'upload-video', label: 'Upload Video', icon: Upload },
  { id: 'list-videos', label: 'List Videos', icon: BarChart3 },
  { id: 'get-video', label: 'Get Video', icon: BarChart3 },
  { id: 'verify-code', label: 'Verify Code', icon: Check },
  { id: 'confirm-receipt', label: 'Confirm Receipt', icon: Check },
  { id: 'seller-profile', label: 'Seller Profile', icon: BookOpen },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'rate-limits', label: 'Rate Limits', icon: Zap },
  { id: 'error-codes', label: 'Error Codes', icon: AlertTriangle },
  { id: 'code-examples', label: 'Code Examples', icon: Terminal },
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
    PATCH: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
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
            <th className="text-left font-semibold text-gray-300 px-4 py-3">Field</th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3">Type</th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3 w-20">Required</th>
            <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
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
              <td className="px-4 py-2.5 text-gray-400 text-xs leading-relaxed">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  )
}

/* ------------------------------------------------------------------ */
/*  API Key Generator Widget                                           */
/* ------------------------------------------------------------------ */

function ApiKeyGenerator() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ api_key: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!name || !email) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/v1/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company_name: name }),
      })
      const data = await res.json()

      if (res.ok && data.data?.api_key) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to generate API key')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = () => {
    if (result?.api_key) {
      navigator.clipboard.writeText(result.api_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 sm:p-6">
      <h3 className="text-base font-bold text-white mb-1">Get Your API Key Instantly</h3>
      <p className="text-sm text-gray-400 mb-5">Enter your name and email to receive a free API key (50 videos/month).</p>

      {result ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 font-semibold mb-2">Your API Key</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-emerald-300 font-mono break-all">{result.api_key}</code>
              <button
                onClick={handleCopyKey}
                className="flex-shrink-0 p-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                aria-label="Copy API key"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Save this key now. It cannot be retrieved again. Use it with the <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">X-API-Key</code> header.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your name or company"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-colors"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-colors"
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading || !name || !email}
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Generate API Key
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-white tracking-tight">ShipProof API</span>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            v1.0.0
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Navigation</p>
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

      <div className="p-4 border-t border-white/[0.06]">
        <Link
          href="/"
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
      {/* Mobile header */}
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

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-[250px] bg-gray-900 border-r border-white/[0.06] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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

      {/* Layout */}
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[250px] bg-gray-900 border-r border-white/[0.06] z-30">
          {sidebarContent}
        </aside>

        <main className="flex-1 lg:ml-[250px]">
          <div className="max-w-3xl mx-auto px-5 sm:px-10 py-10 lg:py-14">
            {/* ===== GETTING STARTED ===== */}
            <Section
              id="getting-started"
              title="Getting Started"
              description="ShipProof provides a RESTful API for programmatic video proof creation, storage, and verification. Get your API key and start integrating in minutes."
            >
              <ApiKeyGenerator />

              <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Base URL</p>
                  <code className="text-sm font-mono text-emerald-400">https://shipproof.netlify.app/api/v1</code>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mt-4 mb-3">All API responses follow this format:</p>
              <CodeBlock language="json" code={`{
  "success": true,
  "data": { ... }
}`} />

              <p className="text-sm text-gray-400 leading-relaxed mt-4 mb-3">Errors use a similar structure:</p>
              <CodeBlock language="json" code={`{
  "success": false,
  "error": "Human-readable error message"
}`} />
            </Section>

            {/* ===== AUTHENTICATION ===== */}
            <Section
              id="authentication"
              title="Authentication"
              description="All endpoints except /seller/register require a valid API key."
            >
              <SubHeading>Method 1: X-API-Key Header</SubHeading>
              <CodeBlock language="http" code={`X-API-Key: sp_live_abc123def456...`} />

              <SubHeading>Method 2: Authorization Bearer Header</SubHeading>
              <CodeBlock language="http" code={`Authorization: Bearer sp_live_abc123def456...`} />

              <div className="mt-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Security warning:</strong> Never expose your API key in client-side JavaScript or public repositories.
                </p>
              </div>
            </Section>

            {/* ===== ENDPOINTS OVERVIEW ===== */}
            <Section id="endpoints" title="Endpoints" description="Complete list of available API endpoints.">
              <div className="rounded-lg border border-white/[0.08] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Method</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Endpoint</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { method: 'POST', endpoint: '/api/v1/seller/register', desc: 'Register a new seller account', auth: false },
                      { method: 'POST', endpoint: '/api/v1/video', desc: 'Upload a new video', auth: true },
                      { method: 'GET', endpoint: '/api/v1/video', desc: 'List videos for seller', auth: true },
                      { method: 'GET', endpoint: '/api/v1/video/:id', desc: 'Get video details', auth: true },
                      { method: 'GET', endpoint: '/api/v1/verify/:code', desc: 'Verify a video (public)', auth: false },
                      { method: 'POST', endpoint: '/api/v1/verify/:code', desc: 'Confirm receipt (public)', auth: false },
                      { method: 'GET', endpoint: '/api/v1/seller', desc: 'Get seller profile', auth: true },
                      { method: 'PATCH', endpoint: '/api/v1/seller', desc: 'Update seller settings', auth: true },
                      { method: 'POST', endpoint: '/api/v1/seller', desc: 'Regenerate API key', auth: true },
                    ].map((row) => (
                      <tr key={row.endpoint + row.method} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5">
                          <MethodBadge method={row.method} />
                        </td>
                        <td className="px-4 py-2.5">
                          <code className="text-xs text-gray-300 font-mono">{row.endpoint}</code>
                          {row.auth && (
                            <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">auth</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ===== UPLOAD VIDEO ===== */}
            <Section id="upload-video" title="Upload Video">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/video</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Upload a packing or fulfillment video associated with an order. The video is hashed with SHA-256 for tamper-proof verification.
              </p>
              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  { name: 'order_id', type: 'string', required: true, description: 'Your internal order identifier' },
                  { name: 'buyer_email', type: 'string', required: false, description: 'Buyer email; verification link sent automatically if video_data provided' },
                  { name: 'video_data', type: 'string', required: false, description: 'Base64-encoded video file content' },
                  { name: 'video_url', type: 'string', required: false, description: 'Public URL to the video file (e.g., S3). Alternative to video_data.' },
                  { name: 'metadata', type: 'object', required: false, description: 'Optional metadata: { duration, file_size, warehouse_id, packer_id }' },
                ]}
              />
              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "X-API-Key: sp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-12345",
    "buyer_email": "buyer@email.com",
    "video_data": "base64..."
  }'`}
              />
              <SubHeading>Response (201 Created)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "clx_9e2b7f1c",
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "video_hash": "sha256:e3b0c44...",
    "storage_provider": "base64",
    "email_sent": true,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
              />
            </Section>

            {/* ===== LIST VIDEOS ===== */}
            <Section id="list-videos" title="List Videos">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/video</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                List all videos for the authenticated seller. Supports pagination and status filtering.
              </p>
              <SubHeading>Query Parameters</SubHeading>
              <ParamTable
                params={[
                  { name: 'limit', type: 'integer', required: false, description: 'Max results per page (default: 50, max: 100)' },
                  { name: 'offset', type: 'integer', required: false, description: 'Offset for pagination (default: 0)' },
                  { name: 'status', type: 'string', required: false, description: 'Filter by status: recorded, sent, confirmed' },
                ]}
              />
              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "clx_9e2b7f1c",
        "order_id": "ORD-12345",
        "verification_code": "ABC12345",
        "status": "confirmed",
        "buyer_confirmed": true,
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": { "total": 142, "limit": 50, "offset": 0 }
  }
}`}
              />
            </Section>

            {/* ===== GET VIDEO ===== */}
            <Section id="get-video" title="Get Video Details">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/video/:id</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Get detailed information about a specific video including confirmation status and video hash.
              </p>
              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl https://shipproof.netlify.app/api/v1/video/clx_9e2b7f1c \\
  -H "X-API-Key: sp_live_..."`}
              />
              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "clx_9e2b7f1c",
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "status": "confirmed",
    "buyer_confirmed": true,
    "package_condition": "perfect",
    "video_hash": "sha256:e3b0c44...",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345"
  }
}`}
              />
            </Section>

            {/* ===== VERIFY CODE ===== */}
            <Section id="verify-code" title="Verify Code">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/verify/:code</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Public endpoint to verify a video by its unique code. Returns video status, hash, and seller branding. No authentication required.
              </p>
              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "valid": true,
  "data": {
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "status": "recorded",
    "video_hash": "sha256:e3b0c44...",
    "has_video": true,
    "buyer_confirmed": false,
    "branding": {
      "brandName": "Acme Corp",
      "brandColor": "#059669",
      "brandLogo": "https://...",
      "customDomain": "verify.acme.com"
    }
  }
}`}
              />
            </Section>

            {/* ===== CONFIRM RECEIPT ===== */}
            <Section id="confirm-receipt" title="Confirm Receipt">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/verify/:code</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Buyer-facing endpoint to confirm package receipt. Fires webhooks and sends seller notification.
              </p>
              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  { name: 'package_condition', type: 'string', required: false, description: 'One of: perfect, damaged, wrong_item, missing_parts' },
                  { name: 'buyer_comment', type: 'string', required: false, description: 'Optional comment (max 500 chars)' },
                ]}
              />
              <SubHeading>Example</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/verify/ABC12345 \\
  -H "Content-Type: application/json" \\
  -d '{
    "package_condition": "perfect",
    "buyer_comment": "Great packaging!"
  }'`}
              />
              <SubHeading>Response (200 OK)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "confirmed": true,
    "confirmation_id": "clx_9e2b7f1c",
    "confirmed_at": "2024-01-16T14:20:00.000Z"
  }
}`}
              />
            </Section>

            {/* ===== SELLER PROFILE ===== */}
            <Section id="seller-profile" title="Seller Profile">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-300 bg-white/[0.04] px-2.5 py-1 rounded-md">/api/v1/seller</code>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Get the authenticated seller's profile including brand settings, quota, and usage.
              </p>

              <SubHeading>Update Settings (PATCH)</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X PATCH https://shipproof.netlify.app/api/v1/seller \\
  -H "X-API-Key: sp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "brand_name": "Acme Corp",
    "brand_color": "#2563eb",
    "webhook_url": "https://acme.com/webhook"
  }'`}
              />

              <SubHeading>Regenerate API Key (POST)</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/seller \\
  -H "X-API-Key: sp_live_..."`}
              />
              <div className="mt-4 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Warning:</strong> Regenerating your API key invalidates the old one immediately.
                </p>
              </div>
            </Section>

            {/* ===== WEBHOOKS ===== */}
            <Section id="webhooks" title="Webhooks">
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Configure a webhook URL in your seller profile to receive real-time event notifications.
              </p>
              <SubHeading>Event: video.created</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "event": "video.created",
  "data": {
    "video_id": "clx_9e2b7f1c",
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "video_hash": "sha256:e3b0c44...",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
              />
              <SubHeading>Event: buyer.confirmed</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "event": "buyer.confirmed",
  "data": {
    "video_id": "clx_9e2b7f1c",
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "condition": "perfect",
    "comment": "Great packaging!",
    "confirmed_at": "2024-01-16T14:20:00.000Z"
  }
}`}
              />
            </Section>

            {/* ===== RATE LIMITS ===== */}
            <Section id="rate-limits" title="Rate Limits & Plans">
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Plan</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Videos/Month</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Rate Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { plan: 'Free', videos: '50', rate: '60 req/min' },
                      { plan: 'Pro', videos: '1,000', rate: '120 req/min' },
                      { plan: 'Business', videos: '10,000', rate: '300 req/min' },
                      { plan: 'Enterprise', videos: 'Unlimited', rate: 'Unlimited' },
                    ].map((row) => (
                      <tr key={row.plan} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-gray-300 font-medium">{row.plan}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">{row.videos}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ===== ERROR CODES ===== */}
            <Section id="error-codes" title="Error Codes" description="HTTP status codes and error response format.">
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3 w-28">Status</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 200, label: 'Success', desc: 'Request completed successfully.', color: 'text-emerald-400' },
                      { code: 201, label: 'Created', desc: 'Resource created successfully.', color: 'text-emerald-400' },
                      { code: 400, label: 'Bad Request', desc: 'Missing or invalid parameters.', color: 'text-amber-400' },
                      { code: 401, label: 'Unauthorized', desc: 'Missing or invalid API key.', color: 'text-red-400' },
                      { code: 404, label: 'Not Found', desc: 'Resource does not exist.', color: 'text-blue-400' },
                      { code: 409, label: 'Conflict', desc: 'Resource already exists.', color: 'text-orange-400' },
                      { code: 429, label: 'Rate Limited', desc: 'Quota exceeded. Upgrade plan.', color: 'text-purple-400' },
                      { code: 500, label: 'Server Error', desc: 'Unexpected error. Retry or contact support.', color: 'text-red-400' },
                    ].map((row) => (
                      <tr key={row.code} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold bg-white/[0.06] px-2 py-0.5 rounded ${row.color}`}>{row.code}</span>
                          <span className="text-xs text-gray-400 ml-1">{row.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ===== CODE EXAMPLES ===== */}
            <Section id="code-examples" title="Code Examples">
              <SubHeading>cURL</SubHeading>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "X-API-Key: sp_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-12345",
    "buyer_email": "buyer@email.com",
    "video_data": "'$(base64 -w0 video.mp4)'"
  }'`}
              />

              <SubHeading>JavaScript / Node.js</SubHeading>
              <CodeBlock
                language="javascript"
                code={`const response = await fetch('/api/v1/video', {
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
console.log(data.verification_url);`}
              />

              <SubHeading>Python</SubHeading>
              <CodeBlock
                language="python"
                code={`import requests

API_KEY = "sp_live_your_key_here"
BASE_URL = "https://shipproof.netlify.app/api/v1"

response = requests.post(
    f"{BASE_URL}/video",
    headers={
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "order_id": "ORD-12345",
        "buyer_email": "buyer@email.com",
        "video_url": "https://s3.amazonaws.com/bucket/video.mp4",
    },
)

print(response.json())`}
              />
            </Section>

            {/* Bottom CTA */}
            <div className="mt-12 pt-10 border-t border-white/[0.06]">
              <div className="text-center p-8 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-lg font-bold text-white mb-2">Ready to integrate?</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Get your API key and start creating tamper-proof video verifications in minutes.
                </p>
                <Link
                  href="/"
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
