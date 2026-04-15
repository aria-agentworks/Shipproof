'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils-shipproof'
import {
  Video,
  Mail,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  Send,
  Package,
  Search,
  Loader2,
  ArrowLeft,
  AlertCircle,
  ThumbsUp,
  AlertTriangle,
  XCircle,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'

interface VideoData {
  id: string
  orderId: string
  buyerEmail: string
  videoFilename: string
  uniqueCode: string
  status: string
  buyerConfirmed: boolean
  buyerConfirmedAt: string | null
  packageCondition: string | null
  buyerComment: string | null
  recordedAt: string
}

const CONDITION_CONFIG: Record<string, { label: string; icon: typeof ThumbsUp; color: string; bg: string }> = {
  perfect: { label: 'Perfect', icon: ThumbsUp, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  damaged: { label: 'Damaged', icon: AlertTriangle, color: 'text-orange-700', bg: 'bg-orange-100' },
  wrong_item: { label: 'Wrong Item', icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
  missing_parts: { label: 'Missing Parts', icon: HelpCircle, color: 'text-yellow-700', bg: 'bg-yellow-100' },
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setVideos(data.videos || [])
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load videos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async (videoId: string) => {
    setSendingId(videoId)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })

      if (res.ok) {
        toast({
          title: 'Email resent!',
          description: 'Verification email sent successfully.',
        })
      } else {
        throw new Error('Failed to send')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to resend email',
        variant: 'destructive',
      })
    } finally {
      setSendingId(null)
    }
  }

  const handleCopyLink = (code: string) => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/v/${code}`
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: 'Link copied!',
        description: `Verification link: /v/${code}`,
      })
    })
  }

  const filteredVideos = videos.filter(v =>
    v.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmedCount = videos.filter(v => v.buyerConfirmed).length
  const sentCount = videos.filter(v => v.status === 'sent').length
  const issueCount = videos.filter(v =>
    v.buyerConfirmed && v.packageCondition && v.packageCondition !== 'perfect'
  ).length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">All your packing videos</p>
            </div>
            <Link href="/record">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-11">
                <Video className="w-4 h-4 mr-2" />
                Record New
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{videos.length}</p>
                <p className="text-xs text-gray-500">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{sentCount}</p>
                <p className="text-xs text-gray-500">Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{confirmedCount}</p>
                <p className="text-xs text-gray-500">Confirmed</p>
              </CardContent>
            </Card>
            {issueCount > 0 && (
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{issueCount}</p>
                  <p className="text-xs text-gray-500">Issues</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, email, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Video List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                {videos.length === 0 ? (
                  <>
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Record your first packing video to get started
                    </p>
                    <Link href="/record">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Video className="w-4 h-4 mr-2" />
                        Record First Video
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results</h3>
                    <p className="text-sm text-gray-500">
                      No videos match &quot;{searchQuery}&quot;
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredVideos.map((video) => {
                const isExpanded = expandedId === video.id
                const condConfig = video.packageCondition ? CONDITION_CONFIG[video.packageCondition] : null
                const hasFeedback = video.buyerConfirmed && (condConfig || video.buyerComment)
                const CondIcon = condConfig?.icon || CheckCircle

                return (
                  <Card key={video.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {/* Mobile Layout */}
                      <div className="space-y-3 sm:hidden">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono font-bold text-gray-900 text-lg">
                              #{video.orderId}
                            </p>
                            <p className="text-sm text-gray-500">{video.buyerEmail}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {condConfig && (
                              <Badge className={`${condConfig.bg} ${condConfig.color} hover:${condConfig.bg} text-xs gap-1 border-0`}>
                                <CondIcon className="w-3 h-3" />
                                {condConfig.label}
                              </Badge>
                            )}
                            <Badge
                              variant={video.buyerConfirmed ? 'default' : 'secondary'}
                              className={video.buyerConfirmed ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''}
                            >
                              {video.buyerConfirmed ? 'Confirmed' : video.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(video.recordedAt)}
                          <span className="mx-1">|</span>
                          <span className="font-mono">{video.uniqueCode}</span>
                        </div>

                        {hasFeedback && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : video.id)}
                            className="w-full flex items-center justify-between text-xs text-gray-500 py-1"
                          >
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {video.buyerComment ? 'View buyer feedback' : 'View details'}
                            </span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}

                        {isExpanded && hasFeedback && (
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {condConfig && (
                              <div className={`flex items-center gap-2 text-sm ${condConfig.color}`}>
                                <CondIcon className="w-4 h-4" />
                                <span className="font-medium">Package: {condConfig.label}</span>
                              </div>
                            )}
                            {video.buyerConfirmedAt && (
                              <p className="text-xs text-gray-500">
                                Confirmed: {formatDate(video.buyerConfirmedAt)}
                              </p>
                            )}
                            {video.buyerComment && (
                              <div className="bg-white rounded p-2 border">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Buyer said:</p>
                                <p className="text-sm text-gray-700">{video.buyerComment}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link href={`/v/${video.uniqueCode}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full h-10">
                              <ExternalLink className="w-3 h-3 mr-1.5" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10"
                            onClick={() => handleCopyLink(video.uniqueCode)}
                          >
                            <Copy className="w-3 h-3 mr-1.5" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10"
                            onClick={() => handleResendEmail(video.id)}
                            disabled={sendingId === video.id}
                          >
                            {sendingId === video.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3 mr-1.5" />
                            )}
                            Resend
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono font-bold text-gray-900">
                              #{video.orderId}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {video.buyerEmail}
                            </p>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
                          <span>{formatDate(video.recordedAt)}</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {video.uniqueCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {condConfig && (
                            <Badge className={`${condConfig.bg} ${condConfig.color} hover:${condConfig.bg} text-xs gap-1 border-0`}>
                              <CondIcon className="w-3 h-3" />
                              {condConfig.label}
                            </Badge>
                          )}
                          <Badge
                            variant={video.buyerConfirmed ? 'default' : 'secondary'}
                            className={video.buyerConfirmed ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : ''}
                          >
                            {video.buyerConfirmed && <CheckCircle className="w-3 h-3 mr-1" />}
                            {video.buyerConfirmed ? 'Confirmed' : video.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasFeedback && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : video.id)}
                              title="View buyer feedback"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          )}
                          <Link href={`/v/${video.uniqueCode}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(video.uniqueCode)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendEmail(video.id)}
                            disabled={sendingId === video.id}
                          >
                            {sendingId === video.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Desktop expanded feedback */}
                      {isExpanded && hasFeedback && (
                        <div className="hidden sm:block mt-3 pt-3 border-t">
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {condConfig && (
                              <div className={`flex items-center gap-2 text-sm ${condConfig.color}`}>
                                <CondIcon className="w-4 h-4" />
                                <span className="font-medium">Package condition: {condConfig.label}</span>
                              </div>
                            )}
                            {video.buyerConfirmedAt && (
                              <p className="text-xs text-gray-500">
                                Buyer confirmed on: {formatDate(video.buyerConfirmedAt)}
                              </p>
                            )}
                            {video.buyerComment && (
                              <div className="bg-white rounded p-2 border">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Buyer&apos;s comment:</p>
                                <p className="text-sm text-gray-700">{video.buyerComment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
