'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BookOpen,
  Terminal,
  Key,
  Upload,
  CheckCircle,
  List,
  Info,
  AlertTriangle,
  Webhook,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react'

const navItems = [
  { id: 'getting-started', label: 'Getting Started', icon: Terminal },
  { id: 'authentication', label: 'Authentication', icon: Key },
  { id: 'upload-video', label: 'Upload Video', icon: Upload },
  { id: 'verify-video', label: 'Verify Video', icon: CheckCircle },
  { id: 'confirm-receipt', label: 'Confirm Receipt', icon: CheckCircle },
  { id: 'list-videos', label: 'List Videos', icon: List },
  { id: 'get-video', label: 'Get Video Details', icon: Info },
  { id: 'rate-limits', label: 'Rate Limits', icon: AlertTriangle },
  { id: 'error-codes', label: 'Error Codes', icon: AlertTriangle },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed text-gray-700">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function JsonBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed text-gray-700">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    POST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    GET: 'bg-blue-100 text-blue-700 border-blue-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded border ${colors[method] || colors.GET}`}>
      {method}
    </span>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    setMobileNavOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      {/* Docs Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6" />
            <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/20">
              API Reference
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">ShipProof API Documentation</h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base max-w-2xl">
            Integrate video proof infrastructure into your platform. Record, hash, verify, and resolve
            — all through a single REST API.
          </p>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-gray-50/50 flex-shrink-0">
          <nav className="sticky top-14 py-6 px-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
        </aside>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900">Navigation</span>
                <button onClick={() => setMobileNavOpen(false)} className="text-gray-400 hover:text-gray-600">
                  &times;
                </button>
              </div>
              <nav className="py-3 px-3">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden mb-6 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 w-full"
            >
              <ChevronRight className="w-4 h-4" />
              Jump to section
            </button>

            {/* 1. Getting Started */}
            <Section id="getting-started" title="Getting Started">
              <p className="text-gray-600 leading-relaxed mb-4">
                Get your API key by registering your seller account. You can do this through the API
                or via the dashboard.
              </p>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MethodBadge method="POST" />
                  <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/seller/register</code>
                </div>
              </div>

              <CodeBlock code={`curl -X POST https://shipproof.netlify.app/api/v1/seller/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Acme Corp", "email": "ops@acme.com"}'`} />

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Your API key will be returned in the response. Keep it secure. Do not
                  expose it in client-side code or public repositories.
                </p>
              </div>
            </Section>

            {/* 2. Authentication */}
            <Section id="authentication" title="Authentication">
              <p className="text-gray-600 leading-relaxed mb-4">
                All API requests require authentication via Bearer token or a custom header. Include your
                API key in every request.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Method 1: Authorization Header (Recommended)</h3>
              <CodeBlock code={`Authorization: Bearer sp_live_abc123`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Method 2: Custom Header</h3>
              <CodeBlock code={`x-api-key: sp_live_abc123`} />

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Security:</strong> API keys prefixed with <code className="bg-amber-100 px-1 rounded">sp_live_</code> are
                  production keys. Use <code className="bg-amber-100 px-1 rounded">sp_test_</code> keys for development and testing.
                </p>
              </div>
            </Section>

            {/* 3. Upload Video */}
            <Section id="upload-video" title="Upload Video">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/video</code>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                Upload a packing video associated with an order. Supports both JSON (base64-encoded) and
                multipart/form-data (file upload) methods.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Parameters</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Field</TableHead>
                      <TableHead className="font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700">Required</TableHead>
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">order_id</code></TableCell>
                      <TableCell className="text-gray-500">string</TableCell>
                      <TableCell><Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs">Yes</Badge></TableCell>
                      <TableCell className="text-gray-600">Your internal order ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">buyer_email</code></TableCell>
                      <TableCell className="text-gray-500">string</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell className="text-gray-600">Buyer&apos;s email for notification</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">video_data</code></TableCell>
                      <TableCell className="text-gray-500">string (base64)</TableCell>
                      <TableCell><Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs">Yes*</Badge></TableCell>
                      <TableCell className="text-gray-600">Base64-encoded video (JSON mode)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">video_file</code></TableCell>
                      <TableCell className="text-gray-500">File</TableCell>
                      <TableCell><Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs">Yes*</Badge></TableCell>
                      <TableCell className="text-gray-600">Video file (FormData mode)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">metadata</code></TableCell>
                      <TableCell className="text-gray-500">object</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell className="text-gray-600">Additional key-value metadata</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-gray-400 mb-4">* Provide either video_data (JSON) or video_file (FormData).</p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Example Request (JSON)</h3>
              <CodeBlock code={`curl -X POST https://shipproof.netlify.app/api/v1/video \\
  -H "Authorization: Bearer sp_live_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "ORD-2024-78901",
    "buyer_email": "customer@example.com",
    "video_data": "<base64-encoded-video>"
  }'`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Response</h3>
              <JsonBlock code={`{
  "success": true,
  "data": {
    "id": "vid_abc123",
    "order_id": "ORD-2024-78901",
    "verification_url": "https://yourdomain.com/verify/ABC123",
    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb924...",
    "status": "recorded",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`} />
            </Section>

            {/* 4. Verify Video */}
            <Section id="verify-video" title="Verify Video">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/verify/:code</code>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                Returns verification data for a video, including the video hash, status, and buyer
                confirmation details (if confirmed).
              </p>

              <CodeBlock code={`curl https://shipproof.netlify.app/api/v1/verify/ABC123 \\
  -H "Authorization: Bearer sp_live_abc123"`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Response</h3>
              <JsonBlock code={`{
  "success": true,
  "data": {
    "code": "ABC123",
    "order_id": "ORD-2024-78901",
    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb924...",
    "status": "recorded",
    "package_condition": null,
    "buyer_comment": null,
    "created_at": "2024-01-15T10:30:00Z",
    "confirmed_at": null
  }
}`} />
            </Section>

            {/* 5. Confirm Receipt */}
            <Section id="confirm-receipt" title="Confirm Receipt (Buyer)">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/verify/:code</code>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                Called by the buyer to confirm package condition upon delivery. This endpoint is
                typically accessed through the verification link.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Request Body</h3>
              <JsonBlock code={`{
  "package_condition": "perfect",
  "buyer_comment": "Great condition"
}`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Valid Conditions</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['perfect', 'damaged', 'wrong_item', 'missing_parts'].map((condition) => (
                  <code
                    key={condition}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                  >
                    {condition}
                  </code>
                ))}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Response</h3>
              <JsonBlock code={`{
  "success": true,
  "data": {
    "code": "ABC123",
    "status": "confirmed",
    "package_condition": "perfect",
    "buyer_comment": "Great condition",
    "confirmed_at": "2024-01-16T14:20:00Z"
  }
}`} />
            </Section>

            {/* 6. List Videos */}
            <Section id="list-videos" title="List Videos">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/videos</code>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                Returns a paginated list of videos for the authenticated seller. Supports filtering by
                status and order ID.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Query Parameters</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Parameter</TableHead>
                      <TableHead className="font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">page</code></TableCell>
                      <TableCell className="text-gray-500">integer</TableCell>
                      <TableCell className="text-gray-600">Page number (default: 1)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">limit</code></TableCell>
                      <TableCell className="text-gray-500">integer</TableCell>
                      <TableCell className="text-gray-600">Items per page (default: 20, max: 100)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">status</code></TableCell>
                      <TableCell className="text-gray-500">string</TableCell>
                      <TableCell className="text-gray-600">Filter by status: recorded, confirmed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">order_id</code></TableCell>
                      <TableCell className="text-gray-500">string</TableCell>
                      <TableCell className="text-gray-600">Filter by order ID</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <CodeBlock code={`curl "https://shipproof.netlify.app/api/v1/videos?page=1&limit=20&status=recorded" \\
  -H "Authorization: Bearer sp_live_abc123"`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Response</h3>
              <JsonBlock code={`{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "vid_abc123",
        "order_id": "ORD-2024-78901",
        "status": "recorded",
        "verification_code": "ABC123",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 47,
      "total_pages": 3
    }
  }
}`} />
            </Section>

            {/* 7. Get Video Details */}
            <Section id="get-video" title="Get Video Details">
              <div className="flex items-center gap-2 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">/api/v1/video/:id</code>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                Returns full details for a single video by its ID.
              </p>

              <CodeBlock code={`curl https://shipproof.netlify.app/api/v1/video/vid_abc123 \\
  -H "Authorization: Bearer sp_live_abc123"`} />

              <h3 className="text-base font-semibold text-gray-900 mt-6 mb-3">Response</h3>
              <JsonBlock code={`{
  "success": true,
  "data": {
    "id": "vid_abc123",
    "order_id": "ORD-2024-78901",
    "buyer_email": "customer@example.com",
    "verification_code": "ABC123",
    "verification_url": "https://yourdomain.com/verify/ABC123",
    "video_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb924...",
    "status": "confirmed",
    "package_condition": "perfect",
    "buyer_comment": "Great condition",
    "created_at": "2024-01-15T10:30:00Z",
    "confirmed_at": "2024-01-16T14:20:00Z"
  }
}`} />
            </Section>

            {/* 8. Rate Limits */}
            <Section id="rate-limits" title="Rate Limits">
              <p className="text-gray-600 leading-relaxed mb-4">
                Rate limits are enforced per API key. The limits depend on your plan. Exceeding limits
                returns a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-red-700">429</code> status code.
              </p>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Plan</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Videos/Month</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Videos/Day</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Videos/Hour</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Free</TableCell>
                      <TableCell className="text-right text-gray-500">5</TableCell>
                      <TableCell className="text-right text-gray-500">2</TableCell>
                      <TableCell className="text-right text-gray-500">1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pro</TableCell>
                      <TableCell className="text-right text-gray-500">200</TableCell>
                      <TableCell className="text-right text-gray-500">50</TableCell>
                      <TableCell className="text-right text-gray-500">10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Business</TableCell>
                      <TableCell className="text-right text-gray-500">5,000</TableCell>
                      <TableCell className="text-right text-gray-500">500</TableCell>
                      <TableCell className="text-right text-gray-500">100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Enterprise
                        <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">Custom</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-500">Unlimited</TableCell>
                      <TableCell className="text-right text-gray-500">Unlimited</TableCell>
                      <TableCell className="text-right text-gray-500">Unlimited</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Rate limit headers are included in every response: <code className="bg-gray-100 px-1 rounded">X-RateLimit-Limit</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">X-RateLimit-Remaining</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">X-RateLimit-Reset</code>.
              </p>
            </Section>

            {/* 9. Error Codes */}
            <Section id="error-codes" title="Error Codes">
              <p className="text-gray-600 leading-relaxed mb-4">
                Errors return a consistent JSON structure with a code and message.
              </p>

              <div className="rounded-lg border border-gray-200 overflow-hidden mb-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Code</TableHead>
                      <TableHead className="font-semibold text-gray-700">HTTP</TableHead>
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><code className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded text-xs font-semibold">UNAUTHORIZED</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">401</Badge></TableCell>
                      <TableCell className="text-gray-600">Missing or invalid API key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded text-xs font-semibold">INVALID_KEY</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">401</Badge></TableCell>
                      <TableCell className="text-gray-600">API key not found</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-semibold">VALIDATION_ERROR</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">400</Badge></TableCell>
                      <TableCell className="text-gray-600">Missing or invalid request fields</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded text-xs font-semibold">RATE_LIMITED</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">429</Badge></TableCell>
                      <TableCell className="text-gray-600">Plan limit exceeded</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-semibold">NOT_FOUND</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">404</Badge></TableCell>
                      <TableCell className="text-gray-600">Video or resource not found</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-xs font-semibold">INTERNAL_ERROR</code></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs border-gray-300">500</Badge></TableCell>
                      <TableCell className="text-gray-600">Server error</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Error Response Format</h3>
              <JsonBlock code={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "order_id is required"
  }
}`} />
            </Section>

            {/* 10. Webhooks */}
            <Section id="webhooks" title="Webhooks">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">Coming Soon</Badge>

              <p className="text-gray-600 leading-relaxed mb-4">
                Webhooks allow you to receive real-time notifications when events occur, such as buyer
                confirmations, disputes, or video processing completion. This feature is currently on
                the roadmap and will be available soon.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Expected Events</h3>
              <div className="space-y-2 mb-6">
                {[
                  { event: 'video.recorded', desc: 'A new video has been uploaded and hashed' },
                  { event: 'video.confirmed', desc: 'Buyer has confirmed package receipt' },
                  { event: 'video.disputed', desc: 'Buyer has reported a damaged or incorrect package' },
                  { event: 'video.expired', desc: 'Verification link has expired without confirmation' },
                ].map((item) => (
                  <div key={item.event} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <code className="text-sm font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex-shrink-0">
                      {item.event}
                    </code>
                    <span className="text-sm text-gray-600">{item.desc}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-3">Expected Payload Format</h3>
              <JsonBlock code={`{
  "event": "video.confirmed",
  "timestamp": "2024-01-16T14:20:00Z",
  "data": {
    "video_id": "vid_abc123",
    "order_id": "ORD-2024-78901",
    "verification_code": "ABC123",
    "package_condition": "perfect",
    "buyer_comment": "Great condition"
  }
}`} />

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Sign up for early access:</strong> Contact{' '}
                  <a href="mailto:sales@shipproof.com" className="underline font-medium">
                    sales@shipproof.com
                  </a>{' '}
                  to be notified when webhooks launch.
                </p>
              </div>
            </Section>

            {/* Bottom CTA */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900">Need help?</h3>
                <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
                  If you have questions about the API or need integration support, our team is ready to help.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    <a href="mailto:sales@shipproof.com">Contact Sales</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/enterprise">
                      View Enterprise Page
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
