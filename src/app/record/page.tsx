'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { generateUniqueCode } from '@/lib/utils-shipproof'
import {
  Camera,
  Square,
  RotateCcw,
  AlertCircle,
  Loader2,
  ScanLine,
  ArrowRight,
  CheckCircle,
  Send,
  Package,
  X,
  Keyboard,
  ShieldAlert,
  Wifi,
} from 'lucide-react'

type PageStep = 'camera' | 'recording' | 'preview' | 'details' | 'sending' | 'done'

export default function RecordPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Core state
  const [step, setStep] = useState<PageStep>('camera')
  const [orderId, setOrderId] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [uniqueCode, setUniqueCode] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [verifyLink, setVerifyLink] = useState('')

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animFrameRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const uniqueCodeRef = useRef<string>(generateUniqueCode(6))

  // Camera state
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraErrorType, setCameraErrorType] = useState<'permission' | 'notfound' | 'https' | 'generic' | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [recordingTime, setRecordingTime] = useState(0)
  const [initializing, setInitializing] = useState(true)

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const html5QrcodeRef = useRef<any>(null)

  // ---- Camera error classification ----
  const classifyError = useCallback((err: any): { message: string; type: 'permission' | 'notfound' | 'https' | 'generic' } => {
    const name = err?.name || ''
    const msg = (err?.message || '').toLowerCase()

    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        type: 'permission',
        message: 'Camera access was denied. Please tap the lock icon in your browser address bar and allow camera access, then reload the page.',
      }
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        type: 'notfound',
        message: 'No camera found on this device. Make sure a camera is connected and not in use by another app.',
      }
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return {
        type: 'notfound',
        message: 'Camera is already in use by another application. Please close other apps using the camera and try again.',
      }
    }
    if (msg.includes('secure context') || msg.includes('https') || msg.includes('ssl')) {
      return {
        type: 'https',
        message: 'Camera access requires a secure HTTPS connection. Please open this page using https:// instead of http://.',
      }
    }
    return {
      type: 'generic',
      message: 'Could not access camera. Please make sure camera permissions are enabled in your browser settings and try again.',
    }
  }, [])

  // ---- Canvas overlay ----
  const drawOverlay = useCallback((vid: HTMLVideoElement, cvs: HTMLCanvasElement, code: string, oId: string, isRec: boolean) => {
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    const drawFrame = () => {
      if (!vid.videoWidth) { animFrameRef.current = requestAnimationFrame(() => drawFrame(vid, cvs, code, oId, isRec)); return }
      cvs.width = vid.videoWidth; cvs.height = vid.videoHeight
      ctx.drawImage(vid, 0, 0)

      // Top-left watermark bar
      const topBarH = Math.max(40, cvs.height * 0.055)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, cvs.width, topBarH)

      const smallFs = Math.max(11, Math.floor(topBarH * 0.42))
      ctx.font = `${smallFs}px monospace`
      ctx.fillStyle = '#22c55e'
      ctx.fillText('SHIPPROOF', 10, topBarH / 2 + smallFs / 3)
      const codeText = code
      const codeW = ctx.measureText(codeText).width
      ctx.fillStyle = '#fff'
      ctx.fillText(codeText, cvs.width - codeW - 10, topBarH / 2 + smallFs / 3)

      // Bottom info bar
      const barH = Math.max(64, cvs.height * 0.085)
      ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, cvs.height - barH, cvs.width, barH)
      ctx.fillStyle = '#22c55e'; ctx.fillRect(0, cvs.height - barH, cvs.width, 3)

      const fs = Math.max(13, Math.floor(barH * 0.3))
      ctx.font = `bold ${fs}px monospace`; ctx.fillStyle = '#fff'
      const ts = new Date().toISOString().replace('T', ' ').substring(0, 19)
      ctx.fillText(oId ? `#${oId}` : 'Scanning...', 12, cvs.height - barH / 2 + fs / 3)
      const tsW = ctx.measureText(ts).width; ctx.fillText(ts, (cvs.width - tsW) / 2, cvs.height - barH / 2 + fs / 3)

      if (isRec) {
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cvs.width - 20, topBarH + 16, 8, 0, Math.PI * 2); ctx.fill()
        ctx.font = `bold ${smallFs}px monospace`; ctx.fillStyle = '#fff'; ctx.fillText('REC', cvs.width - 38, topBarH + 20)
      }

      animFrameRef.current = requestAnimationFrame(() => drawFrame(vid, cvs, code, oId, isRec))
    }
    drawFrame()
  }, [])

  // Redraw overlay when dependencies change
  useEffect(() => {
    if (!cameraReady || !videoRef.current || !canvasRef.current) return
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    drawOverlay(videoRef.current, canvasRef.current, uniqueCodeRef.current, orderId, step === 'recording')
  }, [orderId, step, cameraReady, drawOverlay])

  // ---- Camera init ----
  const initCamera = useCallback(async (facing: 'environment' | 'user') => {
    try {
      setCameraError(null)
      setCameraErrorType(null)
      setInitializing(true)

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => { try { t.stop() } catch (e) {} })
        streamRef.current = null
      }

      // Check for secure context
      if (typeof window !== 'undefined' && window.isSecureContext === false) {
        const err = { type: 'https' as const, message: 'Camera requires HTTPS. Please access this site via https://' }
        setCameraError(err.message)
        setCameraErrorType(err.type)
        setInitializing(false)
        return
      }

      // Check if mediaDevices is available
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Your browser does not support camera access. Please try Chrome, Safari, or Firefox.')
        setCameraErrorType('generic')
        setInitializing(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraReady(true)
        setInitializing(false)
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      const classified = classifyError(err)
      setCameraError(classified.message)
      setCameraErrorType(classified.type)
      setCameraReady(false)
      setInitializing(false)
    }
  }, [classifyError])

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = 0 }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => { try { t.stop() } catch (e) {} })
      streamRef.current = null
    }
    setCameraReady(false)
  }, [])

  // ---- SINGLE camera init effect (fixes the race condition from duplicate effects) ----
  useEffect(() => {
    // Only init camera when not in scanner mode
    if (!scannerActive && step === 'camera') {
      initCamera(facingMode)
    }
    return () => {
      stopCamera()
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, scannerActive])

  // Handle facingMode change with proper cleanup
  useEffect(() => {
    if (scannerActive || !cameraReady) return
    // When facingMode changes, stop old camera and init new one
    const handleFlip = async () => {
      stopCamera()
      await initCamera(facingMode)
    }
    handleFlip()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  // ---- Recording ----
  const startRecording = useCallback(async () => {
    if (!canvasRef.current || !streamRef.current) return
    uniqueCodeRef.current = generateUniqueCode(6)
    try {
      const canvasStream = canvasRef.current.captureStream(30)
      const mts = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
      let mt = ''
      for (const m of mts) { if (MediaRecorder.isTypeSupported(m)) { mt = m; break } }
      if (!mt) { setCameraError('Browser does not support recording.'); return }
      const mr = new MediaRecorder(canvasStream, { mimeType: mt, videoBitsPerSecond: 2500000 })
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data?.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mt })
        setVideoBlob(blob); setUniqueCode(uniqueCodeRef.current); setVideoUrl(URL.createObjectURL(blob))
        setStep('preview')
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
        setRecordingTime(0)
      }
      mediaRecorderRef.current = mr; mr.start(100); setStep('recording'); setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000)
    } catch (err) { console.error('Recording error:', err); setCameraError('Failed to start recording.') }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop()
  }, [])

  // ---- Barcode scanner ----
  const startScanner = useCallback(async () => {
    // Stop the camera first to release the stream
    stopCamera()
    setScannerActive(true)
    setScannerError(null)

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('barcode-scanner')
      html5QrcodeRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.5 },
        (decodedText: string) => {
          // Successfully scanned
          setOrderId(decodedText)
          setScannerActive(false)
          toast({ title: 'Scanned!', description: `Order: ${decodedText}` })
        },
        () => {} // Ignore scan failures (no QR found in frame)
      )
    } catch (err) {
      console.error('Scanner error:', err)
      setScannerError('Could not start scanner. Falling back to camera.')
      setScannerActive(false)
      // Re-init camera after scanner failure
      setTimeout(() => initCamera(facingMode), 300)
    }
  }, [facingMode, initCamera, stopCamera, toast])

  const stopScanner = useCallback(async () => {
    try {
      if (html5QrcodeRef.current) {
        const state = html5QrcodeRef.current.getState()
        if (state === 2) { // SCANNING
          await html5QrcodeRef.current.stop()
        }
        html5QrcodeRef.current.clear()
        html5QrcodeRef.current = null
      }
    } catch (e) {
      console.error('Error stopping scanner:', e)
    }
    setScannerActive(false)
    // Wait a bit for scanner to fully release camera before re-initing
    setTimeout(() => initCamera(facingMode), 300)
  }, [facingMode, initCamera])

  // ---- Upload + Send ----
  const handleSend = async () => {
    if (!videoBlob || !orderId || !buyerEmail) return
    setStep('sending')
    try {
      const fd = new FormData(); fd.append('video', videoBlob, `shipproof_${uniqueCode}.webm`)
      const ur = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!ur.ok) throw new Error('Upload failed')
      const ud = await ur.json()
      const rr = await fetch('/api/record', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, buyerEmail, videoFilename: ud.filename }),
      })
      if (!rr.ok) throw new Error('Save failed')
      const rd = await rr.json()
      await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId: rd.video.id }) })
      setVerifyLink(`${window.location.origin}/v/${uniqueCode}`)
      setStep('done'); toast({ title: 'Sent!', description: `Proof sent to ${buyerEmail}` })
    } catch (e) {
      console.error(e); toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' }); setStep('details')
    }
  }

  const handleReset = () => {
    setVideoBlob(null); setUniqueCode(''); if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(''); setOrderId(''); setBuyerEmail(''); setVerifyLink(''); setStep('camera')
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const flipCamera = () => setFacingMode(p => p === 'environment' ? 'user' : 'environment')

  // ---- Error icon helper ----
  const getErrorIcon = (type: string | null) => {
    switch (type) {
      case 'permission': return ShieldAlert
      case 'notfound': return Camera
      case 'https': return Wifi
      default: return AlertCircle
    }
  }

  // ======== DONE ========
  if (step === 'done') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Video Sent!</h2>
                <p className="text-gray-500 mt-2">Proof sent to <span className="font-medium text-gray-700">{buyerEmail}</span></p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-mono font-semibold">#{orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Code</span><span className="font-mono font-semibold text-emerald-700">{uniqueCode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Link</span><span className="font-mono text-xs text-emerald-700 max-w-[180px] truncate">{verifyLink}</span></div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleReset} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold rounded-xl">
                  <Package className="w-4 h-4 mr-2" />Record Another
                </Button>
                <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => router.push('/dashboard')}>View Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ======== PREVIEW ========
  if (step === 'preview') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="pt-6 pb-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Review Video</h2>
              <video src={videoUrl} controls className="w-full rounded-xl bg-black" playsInline />
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-emerald-800">Proof Code: <span className="font-mono text-lg">{uniqueCode}</span></p>
                <p className="text-emerald-600 text-xs mt-1">Burned into the video. Cannot be edited or faked.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => setStep('details')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold rounded-xl">
                  <ArrowRight className="w-4 h-4 mr-2" />Enter Email & Send
                </Button>
                <Button variant="outline" className="w-full rounded-xl" onClick={handleReset}>Discard & Re-record</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ======== DETAILS ========
  if (step === 'details' || step === 'sending') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="pt-6 pb-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Send to Buyer</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{orderId}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buyer&apos;s Email</label>
                <input
                  type="email"
                  placeholder="buyer@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full h-12 px-4 text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              {step === 'sending' ? (
                <Button disabled className="w-full bg-emerald-600 text-white h-12 rounded-xl">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading & Sending...
                </Button>
              ) : (
                <Button onClick={handleSend} disabled={!buyerEmail || !buyerEmail.includes('@')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold rounded-xl">
                  <Send className="w-4 h-4 mr-2" />Upload & Send Email
                </Button>
              )}
              <Button variant="ghost" className="w-full" onClick={() => setStep('preview')}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />Back to Preview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ======== CAMERA (main view) ========
  return (
    <div className="h-[100dvh] flex flex-col bg-black overflow-hidden">
      <div className="flex-1 relative">
        {/* ---- SCANNER VIEW ---- */}
        {scannerActive ? (
          <div className="absolute inset-0 z-10 bg-black flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/90 text-white">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-emerald-400" />
                Scan Barcode
              </h3>
              <button onClick={stopScanner} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {scannerError ? (
                <div className="text-center text-white p-6 space-y-4">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                  <p className="text-red-300 text-sm">{scannerError}</p>
                  <button onClick={stopScanner} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
                    Go Back to Camera
                  </button>
                </div>
              ) : (
                <>
                  <div id="barcode-scanner" className="w-full max-w-md" style={{ minHeight: '300px' }} />
                  <div className="mt-6 space-y-2 text-center">
                    <p className="text-white/70 text-sm">Point camera at a barcode or QR code</p>
                    <p className="text-white/40 text-xs">Supports UPC, EAN, Code128, QR, and more</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* ---- CAMERA VIEW ---- */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
              playsInline
              muted
              autoPlay
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
            />

            {/* Camera loading / error state */}
            {!cameraReady && !scannerActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-white p-6">
                {initializing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Loader2 className="w-14 h-14 animate-spin text-emerald-400" />
                    </div>
                    <p className="text-sm text-gray-300">Starting camera...</p>
                    <p className="text-xs text-gray-500 mt-2">Please allow camera access when prompted</p>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center gap-4 max-w-xs text-center">
                    {(() => {
                      const ErrorIcon = getErrorIcon(cameraErrorType)
                      return <ErrorIcon className={`w-14 h-14 ${cameraErrorType === 'permission' ? 'text-red-400' : cameraErrorType === 'https' ? 'text-blue-400' : 'text-orange-400'}`} />
                    })()}
                    <p className="text-sm text-gray-200 leading-relaxed">{cameraError}</p>
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      <button
                        onClick={() => initCamera(facingMode)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />Retry Camera
                      </button>
                      <button
                        onClick={() => setScannerActive(true)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <ScanLine className="w-4 h-4" />Try Scanner Instead
                      </button>
                      <button
                        onClick={() => { setCameraError(null) }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Keyboard className="w-4 h-4" />Type Order ID Manually
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Camera has error but allow manual entry */}
            {cameraError && !initializing && !scannerActive && cameraReady === false && (
              <div className="absolute bottom-0 left-0 right-0 p-4 pb-12 z-20">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter order ID manually..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                  {orderId && (
                    <button
                      onClick={() => {
                        // Skip to details since we can't record without camera
                        toast({ title: 'Camera needed', description: 'Please fix camera access to record video.', variant: 'destructive' })
                      }}
                      className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />Camera Required for Recording
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Recording timer */}
            {step === 'recording' && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-mono font-bold flex items-center gap-2 shadow-lg z-20">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                {formatTime(recordingTime)}
              </div>
            )}

            {/* Top controls */}
            {cameraReady && step !== 'recording' && (
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-20">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => router.push('/')}
                    className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={flipCamera}
                    className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom controls */}
            {cameraReady && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="p-6 pb-10 space-y-5">
                  {/* Scan barcode button */}
                  {step === 'camera' && (
                    <div className="flex justify-center">
                      <button
                        onClick={startScanner}
                        className="bg-white/90 hover:bg-white text-gray-900 h-12 px-6 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-colors active:scale-95"
                      >
                        <ScanLine className="w-5 h-5 text-emerald-600" />
                        Scan Barcode
                      </button>
                    </div>
                  )}

                  {/* Order ID display / input */}
                  <div className="flex justify-center">
                    {orderId ? (
                      <div className="bg-black/50 backdrop-blur-lg rounded-full px-5 py-3 text-white text-sm font-medium flex items-center gap-3 border border-white/10">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono">#{orderId}</span>
                        <button onClick={() => setOrderId('')} className="ml-1 text-white/50 hover:text-white transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type order ID..."
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="bg-black/50 backdrop-blur-lg rounded-full px-5 py-3 text-white text-sm w-60 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/10 transition-all"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            // Generate a random order ID for testing
                            const autoId = `ORD-${Date.now().toString(36).toUpperCase()}`
                            setOrderId(autoId)
                            toast({ title: 'Auto-generated', description: `Order: ${autoId}` })
                          }}
                          className="h-11 w-11 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                          title="Auto-generate order ID"
                        >
                          <Package className="w-4 h-4 text-white/70" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Record button */}
                  <div className="flex justify-center">
                    {step === 'camera' ? (
                      <button
                        onClick={startRecording}
                        disabled={!orderId}
                        className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:opacity-50 flex items-center justify-center shadow-2xl transition-all active:scale-95 ring-4 ring-white/20"
                      >
                        <div className="w-8 h-8 rounded-full bg-white" />
                      </button>
                    ) : step === 'recording' ? (
                      <button
                        onClick={stopRecording}
                        className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all active:scale-95 ring-4 ring-red-400/30 animate-pulse"
                      >
                        <Square className="w-8 h-8 text-white" />
                      </button>
                    ) : null}
                  </div>

                  {/* Hint text */}
                  {!orderId && step === 'camera' && (
                    <p className="text-center text-white/50 text-xs">
                      Scan a barcode or type an order ID to start recording
                    </p>
                  )}
                  {orderId && step === 'camera' && (
                    <p className="text-center text-white/50 text-xs">
                      Tap the red button to start recording
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
