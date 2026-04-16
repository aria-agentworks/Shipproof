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
  Fingerprint,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Branding {
  brandName: string | null
  brandColor: string | null
  brandLogo: string | null
  customDomain: string | null
}

interface VerifyData {
  order_id: string
  verification_code: string
  status: string
  recorded_at: string
  buyer_confirmed: boolean
  buyer_confirmed_at: string | null
  package_condition: string | null
  video_hash: string | null
  has_video: boolean
  branding: Branding | null
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
  const [verifyData, setVerifyData] = useState<VerifyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)
  const { toast } = useToast()

  // Derived branding
  const brandName = verifyData?.branding?.brandName || 'ShipProof'
  const brandColor = verifyData?.branding?.brandColor || '#059669'
  const brandLogo = verifyData?.branding?.brandLogo || null

  useEffect(() => {
    async function fetchVerifyData() {
      try {
        const res = await fetch(`/api/v1/verify/${code}`)
        if (!res.ok) {
          setError('This verification link is invalid or has expired.')
          return
        }
        const json = await res.json()
        setVerifyData(json.data)
        if (json.data?.buyer_confirmed) {
          setConfirmed(true)
        }
      } catch {
        setError('Failed to load verification page. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchVerifyData()
  }, [code])

  const handleConfirm = async () => {
    if (!verifyData || !selectedCondition) return
    setConfirming(true)

    try {
      const res = await fetch(`/api/v1/verify/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_condition: selectedCondition,
          buyer_comment: comment.trim() || undefined,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setConfirmed(true)
        setVerifyData(prev => prev ? {
          ...prev,
          buyer_confirmed: true,
          buyer_confirmed_at: new Date().toISOString(),
          status: 'confirmed',
          package_condition: selectedCondition,
        } : prev)
        toast({
          title: 'Receipt confirmed!',
          description: 'Thank you for confirming. The seller has been notified.',
        })
      } else {
        toast({
          title: data.error || 'Already confirmed',
          description: 'This package has already been confirmed.',
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
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({ title: 'Link copied!', description: 'Verification link copied to clipboard.' })
    })
  }

  const getConditionDisplay = (condition: string) => {
    return CONDITION_OPTIONS.find(c => c.value === condition)
  }

  // Inline style helpers for dynamic brand color
  const headerBg = brandColor
  const headerBorder = brandColor
  const accentBg = brandColor
  const accentHover = brandColor

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: brandColor }} />
          <p className="text-gray-500">Loading verification...</p>
        </div>
      </div>
    )
  }

  if (error || !verifyData) {
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
              <Button style={{ backgroundColor: brandColor, color: '#fff' }}>
                Go to {brandName}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - uses seller brand color */}
      <header style={{ backgroundColor: headerBg }} className="border-b" >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {brandLogo ? (
              <img src={brandLogo} alt={brandName} className="h-7 w-auto rounded-md object-contain" />
            ) : (
              <Image src="/logo.jpeg" alt={brandName} width={28} height={49} className="h-7 w-auto rounded-md" />
            )}
            <span className="font-bold text-white text-sm">{brandName}</span>
          </div>
          <Badge className="text-xs bg-white/10 text-white/90 border-white/20 hover:bg-white/15">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        {/* Trust Banner */}
        <div style={{ backgroundColor: accentBg }} className="text-white rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Tamper-Proof Verification</p>
            <p className="text-white/80 text-xs mt-1">
              This video was recorded with embedded metadata. It cannot be edited, modified, or faked.
            </p>
          </div>
        </div>

        {/* Video Player */}
        {verifyData.has_video && (
          <Card className="overflow-hidden">
            <div className="bg-black">
              <video
                src={`/api/video-data/${code}`}
                controls
                className="w-full"
                playsInline
                preload="metadata"
              />
            </div>
          </Card>
        )}

        {/* Tamper Proof Badge */}
        {verifyData.video_hash && (
          <div className="flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border cursor-default"
                  style={{
                    backgroundColor: `${brandColor}10`,
                    borderColor: `${brandColor}30`,
                  }}
                >
                  <Lock className="w-4 h-4" style={{ color: brandColor }} />
                  <span className="text-xs font-semibold" style={{ color: brandColor }}>
                    SHA-256 Hash: {verifyData.video_hash.slice(0, 12)}...
                  </span>
                  <ShieldCheck className="w-3 h-3" style={{ color: brandColor, opacity: 0.7 }} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                This video's cryptographic hash proves it has not been modified.
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Metadata */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Order ID
                </span>
                <span className="font-mono font-semibold text-gray-900">{verifyData.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Recorded
                </span>
                <span className="text-gray-900">{formatDate(verifyData.recorded_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Proof Code
                </span>
                <span className="font-mono font-semibold" style={{ color: brandColor }}>{verifyData.verification_code}</span>
              </div>
              {verifyData.video_hash && (
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 flex items-center gap-2 text-xs">
                    <Fingerprint className="w-3 h-3" /> Video Hash
                  </span>
                  <code className="text-[10px] font-mono text-gray-400 bg-gray-50 p-2 rounded break-all leading-relaxed">
                    sha256:{verifyData.video_hash}
                  </code>
                </div>
              )}
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
                    {verifyData.buyer_confirmed_at && (
                      <p className="text-sm text-emerald-600">
                        Confirmed on {formatDate(verifyData.buyer_confirmed_at)}
                      </p>
                    )}
                  </div>
                </div>

                {verifyData.package_condition && (() => {
                  const cond = getConditionDisplay(verifyData.package_condition)
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Did you receive this package?</h3>
                  <p className="text-sm text-gray-600">
                    Select the condition and confirm to let the seller know.
                  </p>
                </div>

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
                      className="w-full h-20 text-sm p-3 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
                  </div>
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={confirming || !selectedCondition}
                  className="w-full text-white h-12 font-semibold"
                  style={{ backgroundColor: brandColor }}
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
          Verified by {brandName} — Video proof that this order was packed with care.
        </p>
      </main>
    </div>
  )
}
