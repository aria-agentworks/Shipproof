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

// State machine:
// idle → (scan/manual) → ready → (tap record) → recording → (tap stop) → preview → (enter email) → sending → done
type PageStep = 'idle' | 'scanning' | 'ready' | 'recording' | 'preview' | 'details' | 'sending' | 'done'

export default function RecordPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Core state
  const [step, setStep] = useState<PageStep>('idle')
  const [orderId, setOrderId] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [uniqueCode, setUniqueCode] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [verifyLink, setVerifyLink] = useState('')
  const [uploadProgress, setUploadProgress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animFrameRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const uniqueCodeRef = useRef<string>(generateUniqueCode(6))
  const cameraInitLock = useRef(false) // Prevents double-init

  // Camera state
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraErrorType, setCameraErrorType] = useState<'permission' | 'notfound' | 'https' | 'generic' | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [recordingTime, setRecordingTime] = useState(0)
  const [initializing, setInitializing] = useState(true)

  // Scanner state
  const [scannerError, setScannerError] = useState<string | null>(null)
  const html5QrcodeRef = useRef<any>(null)

  // ---- Camera error classification ----
  const classifyError = useCallback((err: any) => {
    const name = err?.name || ''
    const msg = (err?.message || '').toLowerCase()
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return { type: 'permission' as const, message: 'Camera access was denied. Tap the lock icon in your browser address bar, allow camera, then reload.' }
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return { type: 'notfound' as const, message: 'No camera found. Make sure it is not in use by another app.' }
    }
    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return { type: 'notfound' as const, message: 'Camera is busy. Close other apps using it and try again.' }
    }
    if (msg.includes('secure context') || msg.includes('https')) {
      return { type: 'https' as const, message: 'Camera requires HTTPS. Please use https:// to access this site.' }
    }
    return { type: 'generic' as const, message: 'Could not access camera. Check browser permissions and try again.' }
  }, [])

  // ---- Canvas overlay ----
  const drawOverlay = useCallback((vid: HTMLVideoElement, cvs: HTMLCanvasElement, code: string, oId: string, isRec: boolean) => {
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    const drawFrame = () => {
      if (!vid.videoWidth) {
        animFrameRef.current = requestAnimationFrame(() => drawFrame(vid, cvs, code, oId, isRec))
        return
      }
      cvs.width = vid.videoWidth
      cvs.height = vid.videoHeight
      ctx.drawImage(vid, 0, 0)

      // Top bar
      const topBarH = Math.max(40, cvs.height * 0.055)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, cvs.width, topBarH)
      const smallFs = Math.max(11, Math.floor(topBarH * 0.42))
      ctx.font = `${smallFs}px monospace`
      ctx.fillStyle = '#22c55e'
      ctx.fillText('SHIPPROOF', 10, topBarH / 2 + smallFs / 3)
      ctx.fillStyle = '#fff'
      const codeW = ctx.measureText(code).width
      ctx.fillText(code, cvs.width - codeW - 10, topBarH / 2 + smallFs / 3)

      // Bottom bar
      const barH = Math.max(64, cvs.height * 0.085)
      ctx.fillStyle = 'rgba(0,0,0,0.75)'
      ctx.fillRect(0, cvs.height - barH, cvs.width, barH)
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(0, cvs.height - barH, cvs.width, 3)

      const fs = Math.max(13, Math.floor(barH * 0.3))
      ctx.font = `bold ${fs}px monospace`
      ctx.fillStyle = '#fff'
      const ts = new Date().toISOString().replace('T', ' ').substring(0, 19)
      ctx.fillText(oId ? `#${oId}` : '', 12, cvs.height - barH / 2 + fs / 3)
      const tsW = ctx.measureText(ts).width
      ctx.fillText(ts, (cvs.width - tsW) / 2, cvs.height - barH / 2 + fs / 3)

      // REC indicator
      if (isRec) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(cvs.width - 20, topBarH + 16, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.font = `bold ${smallFs}px monospace`
        ctx.fillStyle = '#fff'
        ctx.fillText('REC', cvs.width - 38, topBarH + 20)
      }

      animFrameRef.current = requestAnimationFrame(() => drawFrame(vid, cvs, code, oId, isRec))
    }
    drawFrame()
  }, [])

  // ---- Camera init (with lock to prevent double-init) ----
  const initCamera = useCallback(async (facing: 'environment' | 'user') => {
    // Prevent double-init from competing calls
    if (cameraInitLock.current) return
    // If camera is already streaming, just mark ready
    if (streamRef.current && streamRef.current.active) {
      setCameraReady(true)
      setInitializing(false)
      return
    }

    cameraInitLock.current = true
    try {
      setCameraError(null)
      setCameraErrorType(null)
      setInitializing(true)

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => { try { t.stop() } catch (_) {} })
        streamRef.current = null
      }

      if (typeof window !== 'undefined' && window.isSecureContext === false) {
        setCameraError('Camera requires HTTPS.')
        setCameraErrorType('https')
        setInitializing(false)
        return
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Browser does not support camera access.')
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
    } finally {
      cameraInitLock.current = false
    }
  }, [classifyError])

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = 0 }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => { try { t.stop() } catch (_) {} })
      streamRef.current = null
    }
    setCameraReady(false)
  }, [])

  // ---- Camera lifecycle: init on mount ONLY ----
  useEffect(() => {
    initCamera(facingMode)
    return () => {
      stopCamera()
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Re-init camera ONLY when facingMode changes ----
  useEffect(() => {
    // Don't touch camera during scanning or recording
    if (step === 'scanning' || step === 'recording') return
    if (step === 'idle' || step === 'ready') {
      // Re-init with new facing mode
      stopCamera()
      cameraInitLock.current = false // Reset lock so init can proceed
      setTimeout(() => initCamera(facingMode), 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  // ---- Overlay: redraw when camera becomes ready during recording ----
  useEffect(() => {
    if (!cameraReady || step !== 'recording' || !videoRef.current || !canvasRef.current) return
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    drawOverlay(videoRef.current, canvasRef.current, uniqueCodeRef.current, orderId, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraReady, step])

  // ---- Start MediaRecorder (shared logic) ----
  const startMediaRecorder = useCallback(() => {
    if (!canvasRef.current) return

    try {
      const canvasStream = canvasRef.current.captureStream(30)
      const mts = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
      let mt = ''
      for (const m of mts) { if (MediaRecorder.isTypeSupported(m)) { mt = m; break } }
      if (!mt) {
        toast({ title: 'Error', description: 'Browser does not support video recording.', variant: 'destructive' })
        setStep('ready')
        return
      }

      const mr = new MediaRecorder(canvasStream, { mimeType: mt, videoBitsPerSecond: 2500000 })
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data?.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mt })
        setVideoBlob(blob)
        setUniqueCode(uniqueCodeRef.current)
        setVideoUrl(URL.createObjectURL(blob))
        stopCamera()
        setStep('preview')
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
        setRecordingTime(0)
      }
      mediaRecorderRef.current = mr
      mr.start(100)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000)

      // Start overlay with recording indicator
      if (videoRef.current && canvasRef.current) {
        drawOverlay(videoRef.current, canvasRef.current, uniqueCodeRef.current, orderId, true)
      }
    } catch (err) {
      console.error('Recording error:', err)
      toast({ title: 'Error', description: 'Failed to start recording.', variant: 'destructive' })
      setStep('ready')
    }
  }, [cameraReady, orderId, drawOverlay, stopCamera, toast])

  // ---- When step becomes 'recording' and camera is ready, auto-start capture ----
  useEffect(() => {
    if (step === 'recording' && cameraReady && !mediaRecorderRef.current) {
      const startCapture = async () => {
        // Brief delay for video to stabilize on screen
        await new Promise(r => setTimeout(r, 300))
        uniqueCodeRef.current = generateUniqueCode(6)
        startMediaRecorder()
      }
      startCapture()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, cameraReady])

  // ---- Begin recording (called when user taps record button) ----
  const beginRecording = useCallback(() => {
    uniqueCodeRef.current = generateUniqueCode(6)
    setStep('recording')

    if (cameraReady && canvasRef.current) {
      // Camera is already running — start recording immediately
      setTimeout(() => startMediaRecorder(), 100)
    }
    // If camera NOT ready yet, the useEffect above will catch it when cameraReady becomes true
  }, [cameraReady, startMediaRecorder])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
  }, [])

  // ---- Barcode scanner ----
  const startScanner = useCallback(async () => {
    setStep('scanning')
    setScannerError(null)
    stopCamera() // Release camera for scanner

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('barcode-scanner')
      html5QrcodeRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.5 },
        (decodedText: string) => {
          // Successfully scanned
          scanner.stop().then(() => {
            scanner.clear()
            html5QrcodeRef.current = null
            // KEY FIX: Pre-warm camera in background so it's ready when user taps record
            cameraInitLock.current = false
            setTimeout(() => initCamera(facingMode), 500)
          }).catch(() => {
            cameraInitLock.current = false
            setTimeout(() => initCamera(facingMode), 500)
          })
          setOrderId(decodedText)
          setStep('ready')
          toast({ title: 'Scanned!', description: `Order: ${decodedText}` })
        },
        () => {} // Ignore scan failures
      )
    } catch (err) {
      console.error('Scanner error:', err)
      setScannerError('Could not start scanner.')
      setStep('idle') // Camera will NOT auto-re-init (mount effect already ran)
      // Manually re-init camera
      cameraInitLock.current = false
      setTimeout(() => initCamera(facingMode), 500)
    }
  }, [facingMode, initCamera, stopCamera, toast])

  const stopScanner = useCallback(async () => {
    try {
      if (html5QrcodeRef.current) {
        const state = html5QrcodeRef.current.getState()
        if (state === 2) await html5QrcodeRef.current.stop()
        html5QrcodeRef.current.clear()
        html5QrcodeRef.current = null
      }
    } catch (e) {
      console.error('Error stopping scanner:', e)
    }
    setStep('idle')
    // Re-init camera after scanner releases it
    cameraInitLock.current = false
    setTimeout(() => initCamera(facingMode), 500)
  }, [facingMode, initCamera])

  // ---- Upload + Send (stores video as base64 in DB — works on serverless/Netlify) ----
  const handleSend = async () => {
    if (!videoBlob || !orderId || !buyerEmail) return
    setErrorMessage('')
    setStep('sending')
    setUploadProgress('Converting video...')

    try {
      // Convert video blob to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(videoBlob)
      })

      setUploadProgress('Saving to database...')

      const rr = await fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          buyerEmail,
          videoData: base64,
        }),
      })

      if (!rr.ok) {
        const errData = await rr.json().catch(() => ({}))
        throw new Error(errData.error || `Save failed (${rr.status})`)
      }

      const rd = await rr.json()

      setUploadProgress('Sending email...')
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: rd.video.id }),
      })

      const link = `${window.location.origin}/v/${uniqueCode}`
      setVerifyLink(link)
      setStep('done')
      toast({ title: 'Sent!', description: `Proof sent to ${buyerEmail}` })
    } catch (e: any) {
      console.error('Send error:', e)
      const msg = e?.message || 'Something went wrong'
      setErrorMessage(msg)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      setStep('details')
    }
  }

  const handleReset = () => {
    stopCamera()
    setVideoBlob(null)
    setUniqueCode('')
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl('')
    setOrderId('')
    setBuyerEmail('')
    setVerifyLink('')
    setErrorMessage('')
    setUploadProgress('')
    mediaRecorderRef.current = null
    chunksRef.current = []
    setStep('idle')
    // Re-init camera after reset
    cameraInitLock.current = false
    setTimeout(() => initCamera(facingMode), 100)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const flipCamera = () => {
    setFacingMode(p => p === 'environment' ? 'user' : 'environment')
  }

  const getErrorIcon = (type: string | null) => {
    switch (type) {
      case 'permission': return ShieldAlert
      case 'notfound': return Camera
      case 'https': return Wifi
      default: return AlertCircle
    }
  }

  // ==========================
  // ======== DONE ==========
  // ==========================
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Link</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(verifyLink).then(() => toast({ title: 'Copied!' }))}
                    className="font-mono text-xs text-emerald-700 max-w-[180px] truncate hover:underline"
                  >
                    {verifyLink}
                  </button>
                </div>
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

  // ==========================
  // ======== PREVIEW ========
  // ==========================
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
                <Button onClick={() => { setErrorMessage(''); setStep('details') }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold rounded-xl">
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

  // ==========================
  // ======== DETAILS / SENDING ========
  // ==========================
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
                  onChange={(e) => { setBuyerEmail(e.target.value); setErrorMessage('') }}
                  className="w-full h-12 px-4 text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <p className="font-medium">Failed to send</p>
                  <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
                </div>
              )}

              {step === 'sending' ? (
                <div className="space-y-3">
                  <Button disabled className="w-full bg-emerald-600 text-white h-12 rounded-xl">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadProgress || 'Processing...'}
                  </Button>
                  <p className="text-center text-xs text-gray-400">This may take a moment for longer videos...</p>
                </div>
              ) : (
                <Button
                  onClick={handleSend}
                  disabled={!buyerEmail || !buyerEmail.includes('@')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold rounded-xl"
                >
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

  // ==========================
  // ======== READY (scanned, waiting to record) ==========
  // ==========================
  if (step === 'ready') {
    return (
      <div className="h-[100dvh] flex flex-col bg-gray-950 overflow-hidden">
        <div className="p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex justify-between items-center">
            <button onClick={handleReset} className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 text-sm font-medium">Barcode Scanned</p>
              <p className="text-white text-2xl font-bold font-mono mt-2">#{orderId}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 max-w-xs w-full">
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>Tap <strong className="text-white">Start Recording</strong> to begin</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <span>Point camera at your packing process</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <span>Tap <strong className="text-white">Stop</strong> when done</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={beginRecording}
              className="w-full h-14 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <Camera className="w-5 h-5" />
              Start Recording
            </button>
            <div className="flex gap-2">
              <button
                onClick={startScanner}
                className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ScanLine className="w-4 h-4" />Re-scan
              </button>
              <button
                onClick={() => setOrderId('')}
                className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Keyboard className="w-4 h-4" />Change ID
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================
  // ======== SCANNING ==========
  // ==========================
  if (step === 'scanning') {
    return (
      <div className="h-[100dvh] flex flex-col bg-black overflow-hidden">
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
                Go Back
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
        <div className="p-4 bg-black/90 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or type order ID manually..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && orderId.trim()) {
                  stopScanner()
                  setStep('ready')
                  cameraInitLock.current = false
                  setTimeout(() => initCamera(facingMode), 500)
                  toast({ title: 'Order set', description: `#${orderId}` })
                }
              }}
              className="flex-1 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => {
                if (orderId.trim()) {
                  stopScanner()
                  setStep('ready')
                  cameraInitLock.current = false
                  setTimeout(() => initCamera(facingMode), 500)
                  toast({ title: 'Order set', description: `#${orderId}` })
                }
              }}
              disabled={!orderId.trim()}
              className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-gray-600 text-white text-sm font-semibold transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================
  // ======== RECORDING ==========
  // ==========================
  if (step === 'recording') {
    return (
      <div className="h-[100dvh] flex flex-col bg-black overflow-hidden">
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
            playsInline muted autoPlay
          />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
          />

          {!cameraReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-white p-6">
              <Loader2 className="w-14 h-14 animate-spin text-red-400 mb-4" />
              <p className="text-sm text-gray-300">Starting camera for recording...</p>
              <p className="text-xs text-gray-500 mt-2">Please wait...</p>
            </div>
          )}

          {cameraReady && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-mono font-bold flex items-center gap-2 shadow-lg z-20">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              {formatTime(recordingTime)}
            </div>
          )}

          {cameraReady && (
            <div className="absolute top-6 right-4 z-20">
              <button onClick={flipCamera} className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          {cameraReady && (
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-20">
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all active:scale-95 ring-4 ring-red-400/30"
                >
                  <Square className="w-8 h-8 text-white" />
                </button>
                <p className="text-white/60 text-xs">Tap to stop recording</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==========================
  // ======== IDLE (main camera view) ==========
  // ==========================
  return (
    <div className="h-[100dvh] flex flex-col bg-black overflow-hidden">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
          playsInline muted autoPlay
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
        />

        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-white p-6">
            {initializing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-14 h-14 animate-spin text-emerald-400" />
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
                  <button onClick={() => { cameraInitLock.current = false; initCamera(facingMode) }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                    <RotateCcw className="w-4 h-4" />Retry Camera
                  </button>
                  <button onClick={startScanner} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <ScanLine className="w-4 h-4" />Scan Instead
                  </button>
                  <button onClick={() => setStep('ready')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <Keyboard className="w-4 h-4" />Type Manually
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {cameraReady && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-20">
            <div className="flex justify-between items-center">
              <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
              <button onClick={flipCamera} className="h-10 w-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {cameraReady && (
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="p-6 pb-10 space-y-5">
              <div className="flex justify-center">
                <button
                  onClick={startScanner}
                  className="bg-white/90 hover:bg-white text-gray-900 h-12 px-6 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-colors active:scale-95"
                >
                  <ScanLine className="w-5 h-5 text-emerald-600" />
                  Scan Barcode
                </button>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type order ID..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && orderId.trim()) {
                        setStep('ready')
                        toast({ title: 'Order set', description: `#${orderId}` })
                      }
                    }}
                    className="bg-black/50 backdrop-blur-lg rounded-full px-5 py-3 text-white text-sm w-60 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/10 transition-all"
                  />
                  {orderId.trim() && (
                    <button
                      onClick={() => { setStep('ready'); toast({ title: 'Order set', description: `#${orderId}` }) }}
                      className="h-12 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                    >
                      Go
                    </button>
                  )}
                </div>
              </div>

              <p className="text-center text-white/50 text-xs">
                Scan a barcode or type an order ID to start
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
