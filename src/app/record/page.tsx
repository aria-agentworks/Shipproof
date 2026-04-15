'use client'

import React, { useState, useRef } from 'react'
import Header from '@/components/header'
import CameraRecorder from '@/components/camera-recorder'
import BarcodeScanner from '@/components/barcode-scanner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  ScanLine,
  Send,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Package,
} from 'lucide-react'
import Link from 'next/link'

export default function RecordPage() {
  const { toast } = useToast()
  const [orderId, setOrderId] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [uniqueCode, setUniqueCode] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const handleVideoRecorded = (blob: Blob, code: string) => {
    setVideoBlob(blob)
    setUniqueCode(code)
    const url = URL.createObjectURL(blob)
    setVideoUrl(url)
  }

  const handleScan = (code: string) => {
    setOrderId(code)
    setShowScanner(false)
    toast({
      title: 'Scanned!',
      description: `Order ID set to: ${code}`,
    })
  }

  const handleUploadAndSend = async () => {
    if (!videoBlob || !orderId || !buyerEmail) return

    setIsUploading(true)

    try {
      // Upload video
      const formData = new FormData()
      formData.append('video', videoBlob, `shipproof_${uniqueCode}.webm`)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      const uploadData = await uploadRes.json()

      // Save record to database
      const recordRes = await fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          buyerEmail,
          videoFilename: uploadData.filename,
        }),
      })

      if (!recordRes.ok) {
        throw new Error('Failed to save record')
      }

      const recordData = await recordRes.json()

      // Send email
      setIsUploading(false)
      setIsSending(true)

      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: recordData.video.id }),
      })

      if (!emailRes.ok) {
        throw new Error('Failed to send email')
      }

      setCompleted(true)

      toast({
        title: 'Video sent!',
        description: `Email sent to ${buyerEmail}`,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setIsSending(false)
    }
  }

  const handleReset = () => {
    setVideoBlob(null)
    setUniqueCode('')
    setCompleted(false)
    setVideoUrl('')
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sent!</h2>
              <p className="text-gray-600">
                Video proof sent to <span className="font-semibold">{buyerEmail}</span>
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-1">
                <p className="text-gray-500">Order: <span className="font-mono font-semibold text-gray-900">{orderId}</span></p>
                <p className="text-gray-500">Code: <span className="font-mono font-semibold text-emerald-700">{uniqueCode}</span></p>
                <p className="text-gray-500">
                  Link: <span className="font-mono text-xs text-emerald-700 break-all">/v/{uniqueCode}</span>
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/record">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleReset}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Record Another Order
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">Record Packing Video</h1>

          {/* Order ID + Barcode Scan */}
          <div ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  placeholder="e.g. 1042 or scan barcode"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1 h-12 text-base"
                  disabled={isRecording}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-4"
                  onClick={() => setShowScanner(true)}
                  disabled={isRecording}
                >
                  <ScanLine className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Tap the scan icon to auto-fill from a barcode
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Buyer&apos;s Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="buyer@email.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="h-12 text-base"
                disabled={isRecording}
              />
            </div>
          </div>

          {/* Camera */}
          <CameraRecorder
            orderId={orderId}
            onVideoRecorded={handleVideoRecorded}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />

          {/* Video Preview + Send */}
          {videoBlob && !isRecording && (
            <Card className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Video Preview</h3>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg bg-black"
                    playsInline
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-emerald-800">
                    Verification Code: <span className="font-mono text-lg">{uniqueCode}</span>
                  </p>
                  <p className="text-emerald-600 text-xs mt-1">
                    This code is burned into the video and cannot be edited
                  </p>
                </div>

                <Button
                  onClick={handleUploadAndSend}
                  disabled={isUploading || isSending || !orderId || !buyerEmail}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading video...
                    </>
                  ) : isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending email...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Upload & Send to Buyer
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  Discard & Record Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showScanner}
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  )
}
