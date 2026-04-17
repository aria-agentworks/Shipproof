'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Key,
  Upload,
  List,
  FileText,
  ShieldCheck,
  Webhook,
  AlertTriangle,
  Gauge,
  Menu,
  X,
  Copy,
  Check,
  Zap,
  Loader2,
  ArrowRight,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  children?: { id: string; label: string }[]
}

/* ------------------------------------------------------------------ */
/*  Sidebar Navigation                                                 */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'authentication', label: 'Authentication', icon: Key },
  {
    id: 'endpoints',
    label: 'Endpoints',
    icon: ArrowRight,
    children: [
      { id: 'upload-video', label: 'Upload Video' },
      { id: 'list-videos', label: 'List Videos' },
      { id: 'get-video', label: 'Get Video' },
      { id: 'verify-code', label: 'Verify' },
      { id: 'confirm-receipt', label: 'Confirm' },
    ],
  },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'error-codes', label: 'Error Codes', icon: AlertTriangle },
  { id: 'rate-limits', label: 'Rate Limits', icon: Gauge },
]

/* ------------------------------------------------------------------ */
/*  Code Block                                                         */
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
/*  Method Badge                                                       */
/* ------------------------------------------------------------------ */

function MethodBadge({ method }: { method: string }) {
  const styles: Record<string, string> = {
    POST: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    GET: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    PATCH: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    DELETE: 'bg-red-500/15 text-red-400 border border-red-500/25',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded tracking-wide ${
        styles[method] ?? styles.GET
      }`}
    >
      {method}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  )
}

/* ------------------------------------------------------------------ */
/*  Param Table                                                        */
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
        // Store API key in cookie for dashboard/record page auth
        document.cookie = `sp_api_key=${encodeURIComponent(data.data.api_key)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Strict`
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
            Save this key now. It cannot be retrieved again. Use it with the{' '}
            <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">X-API-Key</code> header.
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
                Get API Key
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
    const allIds = NAV_ITEMS.flatMap((item) =>
      item.children
        ? [item.id, ...item.children.map((c) => c.id)]
        : [item.id]
    )
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
    for (const id of allIds) {
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
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="ShipProof" width={20} height={20} className="rounded" />
            <span className="text-base font-bold text-white tracking-tight">ShipProof API</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            v1.0.0
          </span>
        </div>
      </div>

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
                {item.children && (
                  <ul className="ml-7 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const isChildActive = activeSection === child.id
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => scrollTo(child.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-[12px] transition-colors ${
                              isChildActive
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
                            }`}
                          >
                            {child.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
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
        <div className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="ShipProof" width={18} height={18} className="rounded" />
          <span className="text-sm font-semibold text-white">ShipProof API Docs</span>
        </div>
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
            className="absolute left-0 top-0 bottom-0 w-[260px] bg-gray-900 border-r border-white/[0.06] flex flex-col shadow-2xl"
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
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-gray-900 border-r border-white/[0.06] z-30">
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-[260px]">
          <div className="max-w-3xl mx-auto px-5 sm:px-10 py-10 lg:py-14">
            {/* ===== GETTING STARTED ===== */}
            <Section
              id="getting-started"
              title="Getting Started"
              description="ShipProof provides a RESTful API for programmatic video proof creation, storage, and verification. Get your API key and start integrating in minutes."
            >
              <ApiKeyGenerator />

              <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Base URL</p>
                  <code className="text-sm font-mono text-emerald-400">
                    https://shipproof.netlify.app/api/v1
                  </code>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mt-4 mb-3">Quick start:</p>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://shipproof.netlify.app/api/v1/seller/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corp",
    "email": "dev@acme.com"
  }'

# Then upload a video:
curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-001",
    "buyer_email": "buyer@email.com",
    "video_data": "base64..."
  }'`}
              />
            </Section>

            {/* ===== AUTHENTICATION ===== */}
            <Section
              id="authentication"
              title="Authentication"
              description="All endpoints except /seller/register and public verify endpoints require a valid API key passed via header."
            >
              <SubHeading>Method 1: X-API-Key Header (Recommended)</SubHeading>
              <CodeBlock
                language="http"
                code={`curl -H "X-API-Key: sp_live_abc123def456..." https://shipproof.netlify.app/api/v1/video`}
              />

              <SubHeading>Method 2: Authorization Bearer Token</SubHeading>
              <CodeBlock
                language="http"
                code={`curl -H "Authorization: Bearer sp_live_abc123def456..." https://shipproof.netlify.app/api/v1/video`}
              />

              <div className="mt-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Security warning:</strong> Never expose your API key in client-side JavaScript or public repositories.
                  Always use environment variables on your server.
                </p>
              </div>
            </Section>

            {/* ===== ENDPOINTS OVERVIEW ===== */}
            <Section
              id="endpoints"
              title="Endpoints"
              description="Complete list of available API endpoints with detailed request and response documentation."
            >
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
                      { method: 'GET', endpoint: '/api/v1/video/:id', desc: 'Get single video details', auth: true },
                      { method: 'GET', endpoint: '/api/v1/verify/:code', desc: 'Verify video (public)', auth: false },
                      { method: 'POST', endpoint: '/api/v1/verify/:code', desc: 'Confirm receipt (public)', auth: false },
                    ].map((row) => (
                      <tr
                        key={row.endpoint + row.method}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <MethodBadge method={row.method} />
                        </td>
                        <td className="px-4 py-2.5">
                          <code className="text-xs text-gray-300 font-mono">{row.endpoint}</code>
                          {row.auth && (
                            <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              auth
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ===== ENDPOINT: REGISTER ===== */}
            <section id="upload-video" className="scroll-mt-24 pb-12">
              <h2 className="text-xl font-bold text-white mb-1">POST /api/v1/seller/register</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Register a new seller account and receive an API key. This is the only endpoint that does not require authentication.
              </p>

              <SubHeading>Request Headers</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Header</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5">
                        <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">Content-Type</code>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">application/json</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  { name: 'name', type: 'string', required: true, description: 'Your name or company name' },
                  { name: 'email', type: 'string', required: true, description: 'Valid email address for the account' },
                  { name: 'company_name', type: 'string', required: false, description: 'Company name (defaults to name)' },
                ]}
              />

              <SubHeading>Response (201 Created)</SubHeading>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "data": {
    "api_key": "sp_live_abc123def456...",
    "seller_id": "clx_9e2b7f1c",
    "plan": "free"
  }
}`}
              />

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">201</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Seller created successfully</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-amber-400">400</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Missing or invalid parameters</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-red-400">409</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Email already registered</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== ENDPOINT: UPLOAD VIDEO ===== */}
            <section id="list-videos" className="scroll-mt-24 pb-12">
              <h2 className="text-xl font-bold text-white mb-1">POST /api/v1/video</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Upload a packing or fulfillment video associated with an order. The video is hashed with SHA-256 for tamper-proof verification.
              </p>

              <SubHeading>Request Headers</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Header</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5">
                        <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">X-API-Key</code>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Your API key</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5">
                        <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">Content-Type</code>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">application/json</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  { name: 'order_id', type: 'string', required: true, description: 'Your internal order identifier' },
                  { name: 'buyer_email', type: 'string', required: false, description: 'Buyer email; verification link sent automatically if video_data is provided' },
                  { name: 'video_data', type: 'string', required: false, description: 'Base64-encoded video file content' },
                  { name: 'video_url', type: 'string', required: false, description: 'Public URL to the video file (e.g., S3). Alternative to video_data.' },
                  { name: 'metadata', type: 'object', required: false, description: 'Optional metadata: { duration, file_size, warehouse_id, packer_id }' },
                ]}
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
    "video_hash": "sha256:e3b0c44298fc...",
    "storage_provider": "base64",
    "email_sent": true,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
              />

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">201</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Video uploaded and hashed successfully</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-red-400">401</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Invalid or missing API key</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-amber-400">429</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Rate limit exceeded. Upgrade your plan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== ENDPOINT: LIST VIDEOS ===== */}
            <section id="get-video" className="scroll-mt-24 pb-12">
              <h2 className="text-xl font-bold text-white mb-1">GET /api/v1/video</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
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
    "pagination": {
      "total": 142,
      "limit": 50,
      "offset": 0
    }
  }
}`}
              />

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">200</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">List returned successfully</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-red-400">401</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Invalid or missing API key</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== ENDPOINT: GET VIDEO ===== */}
            <section id="verify-code" className="scroll-mt-24 pb-12">
              <h2 className="text-xl font-bold text-white mb-1">GET /api/v1/video/:id</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Get detailed information about a specific video including confirmation status, video hash, and verification URL.
              </p>

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
    "video_hash": "sha256:e3b0c44298fc...",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
              />

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">200</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Video details returned</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-blue-400">404</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Video not found</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-red-400">401</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Invalid or missing API key</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== ENDPOINT: VERIFY (PUBLIC) ===== */}
            <section id="confirm-receipt" className="scroll-mt-24 pb-12">
              <h2 className="text-xl font-bold text-white mb-1">GET /api/v1/verify/:code</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Public endpoint to verify a video by its unique verification code. Returns video status, hash, and seller branding. No authentication required.
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
    "video_hash": "sha256:e3b0c44298fc...",
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

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">200</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Verification successful</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-blue-400">404</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Invalid verification code</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== ENDPOINT: CONFIRM (PUBLIC) ===== */}
            <section className="scroll-mt-24 pb-12" id="webhooks-section-divider">
              <h2 className="text-xl font-bold text-white mb-1">POST /api/v1/verify/:code</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Buyer-facing endpoint to confirm package receipt after watching the packing video. Fires webhooks and sends seller notification.
              </p>

              <SubHeading>Request Body</SubHeading>
              <ParamTable
                params={[
                  { name: 'package_condition', type: 'string', required: false, description: 'One of: perfect, damaged, wrong_item, missing_parts' },
                  { name: 'buyer_comment', type: 'string', required: false, description: 'Optional comment from the buyer (max 500 chars)' },
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

              <SubHeading>Status Codes</SubHeading>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Code</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-emerald-400">200</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Confirmation recorded</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-blue-400">404</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Invalid verification code</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5"><span className="text-xs font-bold text-orange-400">409</span></td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">Already confirmed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===== WEBHOOKS ===== */}
            <Section
              id="webhooks"
              title="Webhooks"
              description="Configure a webhook URL in your seller profile to receive real-time event notifications for every video upload and buyer confirmation."
            >
              <SubHeading>Setup</SubHeading>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Set your <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">webhook_url</code> in your seller profile via the PATCH /api/v1/seller endpoint. All webhook payloads are sent as POST requests with JSON body.
              </p>

              <SubHeading>Event: video.created</SubHeading>
              <p className="text-sm text-gray-500 mb-3">Fired when a new video is uploaded and hashed.</p>
              <CodeBlock
                language="json"
                code={`{
  "event": "video.created",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "video_id": "clx_9e2b7f1c",
    "order_id": "ORD-12345",
    "verification_code": "ABC12345",
    "verification_url": "https://shipproof.netlify.app/v/ABC12345",
    "video_hash": "sha256:e3b0c44298fc...",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
              />

              <SubHeading>Event: buyer.confirmed</SubHeading>
              <p className="text-sm text-gray-500 mb-3">Fired when the buyer watches the video and confirms receipt.</p>
              <CodeBlock
                language="json"
                code={`{
  "event": "buyer.confirmed",
  "timestamp": "2024-01-16T14:20:00.000Z",
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

              <div className="mt-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04]">
                <p className="text-sm text-amber-300">
                  <strong>Retry policy:</strong> Failed webhook deliveries are retried up to 5 times with exponential backoff (1s, 5s, 30s, 5min, 30min).
                  Your endpoint must return a 2xx status code within 10 seconds.
                </p>
              </div>
            </Section>

            {/* ===== ERROR CODES ===== */}
            <Section
              id="error-codes"
              title="Error Codes"
              description="All errors return a consistent JSON format with a human-readable message."
            >
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": "Human-readable error message"
}`}
              />

              <div className="mt-6 rounded-lg border border-white/[0.08] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3 w-28">Status</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Error</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 200, error: 'Success', desc: 'Request completed successfully.', color: 'text-emerald-400' },
                      { code: 201, error: 'Created', desc: 'Resource created successfully.', color: 'text-emerald-400' },
                      { code: 400, error: 'Bad Request', desc: 'Missing or invalid parameters.', color: 'text-amber-400' },
                      { code: 401, error: 'Unauthorized', desc: 'Missing or invalid API key.', color: 'text-red-400' },
                      { code: 404, error: 'Not Found', desc: 'Resource does not exist.', color: 'text-blue-400' },
                      { code: 409, error: 'Conflict', desc: 'Resource already exists (e.g., duplicate email or already confirmed).', color: 'text-orange-400' },
                      { code: 429, error: 'Rate Limited', desc: 'Too many requests. Retry after the rate limit window.', color: 'text-purple-400' },
                      { code: 500, error: 'Server Error', desc: 'Unexpected error. Please retry or contact support.', color: 'text-red-400' },
                    ].map((row) => (
                      <tr key={row.code} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold bg-white/[0.06] px-2 py-0.5 rounded ${row.color}`}>
                            {row.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs font-medium">{row.error}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ===== RATE LIMITS ===== */}
            <Section
              id="rate-limits"
              title="Rate Limits"
              description="Rate limits are applied per API key. Upgrade your plan to increase throughput."
            >
              <div className="rounded-lg border border-white/[0.08] overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Plan</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Videos / Month</th>
                      <th className="text-left font-semibold text-gray-300 px-4 py-3">Requests / Min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { plan: 'Free', videos: '50', rate: '60', highlight: false },
                      { plan: 'Pro', videos: '1,000', rate: '120', highlight: false },
                      { plan: 'Business', videos: '10,000', rate: '300', highlight: false },
                      { plan: 'Enterprise', videos: 'Unlimited', rate: 'Unlimited', highlight: true },
                    ].map((row) => (
                      <tr
                        key={row.plan}
                        className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${
                          row.highlight ? 'bg-emerald-500/[0.04]' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-300 font-medium text-sm">
                          {row.plan}
                          {row.highlight && (
                            <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">{row.videos}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Rate limit headers:</strong> Every response includes{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">X-RateLimit-Limit</code>,{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">X-RateLimit-Remaining</code>, and{' '}
                  <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">X-RateLimit-Reset</code> headers.
                </p>
              </div>
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
