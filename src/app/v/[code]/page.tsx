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
  ExternalLink,
  Mail,
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
  recordedAt: string
}

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [video, setVideo] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
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
    if (!video) return
    setConfirming(true)

    try {
      const res = await fetch(`/api/confirm/${code}`, { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setConfirmed(true)
        setVideo(prev => prev ? { ...prev, buyerConfirmed: true, buyerConfirmedAt: new Date().toISOString(), status: 'confirmed' } : prev)
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

        {/* Confirmation Status */}
        <Card className={confirmed ? 'border-emerald-200 bg-emerald-50' : ''}>
          <CardContent className="p-4">
            {confirmed ? (
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
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Did you receive this package?</h3>
                  <p className="text-sm text-gray-600">
                    Confirm below to let the seller know your order arrived safely.
                  </p>
                </div>
                <Button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Yes, I Received My Package
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
