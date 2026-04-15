'use client'

import React, { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils-shipproof'
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Package,
  AlertTriangle,
  Loader2,
  Copy,
  ThumbsUp,
  AlertCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  Send,
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

const CONDITION_OPTIONS = [
  {
    value: 'perfect',
    label: 'Arrived Perfect',
    description: 'Package and item in perfect condition',
    icon: ThumbsUp,
    color: 'emerald',
  },
  {
    value: 'damaged',
    label: 'Damaged',
    description: 'Package or item arrived damaged',
    icon: AlertCircle,
    color: 'orange',
  },
  {
    value: 'wrong_item',
    label: 'Wrong Item',
    description: 'Received a different item than ordered',
    icon: XCircle,
    color: 'red',
  },
  {
    value: 'missing_parts',
    label: 'Missing Parts',
    description: 'Some parts or accessories are missing',
    icon: HelpCircle,
    color: 'yellow',
  },
] as const

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [video, setVideo] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/verify/${code}`)
        if (!res.ok) {
          setError('This verification link is invalid or has expired.')
          return
        }
        const data = await res.json()
        setVideo(data.video)
        if (data.video.buyerConfirmed) {
          setConfirmed(true)
        }
      } catch {
        setError('Failed to load verification page. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [code])

  const handleConfirm = async () => {
    if (!video || !selectedCondition) return
    setConfirming(true)

    try {
      const res = await fetch(`/api/confirm/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageCondition: selectedCondition,
          buyerComment: comment.trim() || undefined,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setConfirmed(true)
        setVideo(prev => prev ? {
          ...prev,
          buyerConfirmed: true,
          buyerConfirmedAt: new Date().toISOString(),
          status: 'confirmed',
          packageCondition: selectedCondition,
          buyerComment: comment.trim() || null,
        } : prev)
        toast({
          title: 'Receipt confirmed!',
          description: 'Thank you for confirming. The seller has been notified.',
        })
      } else {
        toast({
          title: 'Already confirmed',
          description: data.error || 'This package has already been confirmed.',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to confirm. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setConfirming(false)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link copied!',
        description: 'Verification link copied to clipboard.',
      })
    })
  }

  const getConditionDisplay = (condition: string) => {
    return CONDITION_OPTIONS.find(c => c.value === condition)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-gray-500">Loading verification...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Link Not Found</h2>
            <p className="text-gray-600">{error}</p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Go to ShipProof
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              Ship<span className="text-emerald-600">Proof</span>
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Verification
          </Badge>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        {/* Trust Banner */}
        <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Tamper-Proof Verification</p>
            <p className="text-emerald-100 text-xs mt-1">
              This video was recorded with embedded metadata. It cannot be edited, modified, or faked.
            </p>
          </div>
        </div>

        {/* Video Player */}
        <Card className="overflow-hidden">
          <div className="bg-black">
            <video
              src={`/api/video/${video.videoFilename}`}
              controls
              className="w-full"
              playsInline
              preload="metadata"
            />
          </div>
        </Card>

        {/* Metadata */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Order ID
                </span>
                <span className="font-mono font-semibold text-gray-900">{video.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Recorded
                </span>
                <span className="text-gray-900">{formatDate(video.recordedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Proof Code
                </span>
                <span className="font-mono font-semibold text-emerald-700">{video.uniqueCode}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Section */}
        <Card className={confirmed ? 'border-emerald-200 bg-emerald-50' : ''}>
          <CardContent className="p-4">
            {confirmed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Receipt Confirmed</p>
                    {video.buyerConfirmedAt && (
                      <p className="text-sm text-emerald-600">
                        Confirmed on {formatDate(video.buyerConfirmedAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Show condition if confirmed with one */}
                {video.packageCondition && (() => {
                  const cond = getConditionDisplay(video.packageCondition)
                  if (!cond) return null
                  const CondIcon = cond.icon
                  const colorMap: Record<string, string> = {
                    emerald: 'bg-emerald-100 text-emerald-700',
                    orange: 'bg-orange-100 text-orange-700',
                    red: 'bg-red-100 text-red-700',
                    yellow: 'bg-yellow-100 text-yellow-700',
                  }
                  return (
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${colorMap[cond.color] || 'bg-gray-100'}`}>
                      <CondIcon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">{cond.label}</p>
                        <p className="text-xs opacity-80">{cond.description}</p>
                      </div>
                    </div>
                  )
                })()}

                {/* Show buyer comment if exists */}
                {video.buyerComment && (
                  <div className="bg-white rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Buyer&apos;s Comment
                    </p>
                    <p className="text-sm text-gray-700">{video.buyerComment}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Did you receive this package?</h3>
                  <p className="text-sm text-gray-600">
                    Select the condition and confirm to let the seller know.
                  </p>
                </div>

                {/* Condition Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {CONDITION_OPTIONS.map((option) => {
                    const OptionIcon = option.icon
                    const isSelected = selectedCondition === option.value
                    const colorMap: Record<string, { selected: string; unselected: string }> = {
                      emerald: {
                        selected: 'border-emerald-500 bg-emerald-50 text-emerald-800',
                        unselected: 'border-gray-200 hover:border-emerald-200',
                      },
                      orange: {
                        selected: 'border-orange-500 bg-orange-50 text-orange-800',
                        unselected: 'border-gray-200 hover:border-orange-200',
                      },
                      red: {
                        selected: 'border-red-500 bg-red-50 text-red-800',
                        unselected: 'border-gray-200 hover:border-red-200',
                      },
                      yellow: {
                        selected: 'border-yellow-500 bg-yellow-50 text-yellow-800',
                        unselected: 'border-gray-200 hover:border-yellow-200',
                      },
                    }
                    const colors = colorMap[option.color] || colorMap.emerald

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedCondition(option.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${isSelected ? colors.selected : colors.unselected}`}
                      >
                        <OptionIcon className={`w-5 h-5 ${isSelected ? '' : 'text-gray-400'}`} />
                        <span className="text-xs font-semibold">{option.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Optional Comment */}
                {!showComment ? (
                  <button
                    type="button"
                    onClick={() => setShowComment(true)}
                    className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Add a comment (optional)
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the condition of your package..."
                      className="w-full h-20 text-sm p-3 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirm}
                  disabled={confirming || !selectedCondition}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Confirm Receipt
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-11"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>

        {/* Footer branding */}
        <p className="text-center text-xs text-gray-400 pt-4">
          Verified by ShipProof — Video proof that this order was packed with care.
        </p>
      </main>
    </div>
  )
}
