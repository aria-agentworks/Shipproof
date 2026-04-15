'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { generateUniqueCode } from '@/lib/utils-shipproof'
import {
  Camera,
  Square,
  RotateCcw,
  Video,
  AlertCircle,
  Loader2,
  ScanLine,
  ArrowRight,
  CheckCircle,
  Send,
  Package,
  X,
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
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [recordingTime, setRecordingTime] = useState(0)

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const html5QrcodeRef = useRef<any>(null)

  // ---- Canvas overlay ----
  const drawOverlay = useCallback((vid: HTMLVideoElement, cvs: HTMLCanvasElement, code: string, oId: string, isRec: boolean) => {
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    const drawFrame = () => {
      if (!vid.videoWidth) { animFrameRef.current = requestAnimationFrame(() => drawFrame(vid, cvs, code, oId, isRec)); return }
      cvs.width = vid.videoWidth; cvs.height = vid.videoHeight
      ctx.drawImage(vid, 0, 0)
      const barH = Math.max(70, cvs.height * 0.09)
      ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, cvs.height - barH, cvs.width, barH)
      ctx.fillStyle = '#22c55e'; ctx.fillRect(0, cvs.height - barH, cvs.width, 2)
      const fs = Math.max(14, Math.floor(barH * 0.32))
      ctx.font = `bold ${fs}px monospace`; ctx.fillStyle = '#fff'
      const ts = new Date().toISOString().replace('T', ' ').substring(0, 19)
      ctx.fillText(oId ? `#${oId}` : 'Scanning...', 10, cvs.height - barH / 2 + fs / 3)
      const tsW = ctx.measureText(ts).width; ctx.fillText(ts, (cvs.width - tsW) / 2, cvs.height - barH / 2 + fs / 3)
      const cW = ctx.measureText(code).width; ctx.fillText(code, cvs.width - cW - 10, cvs.height - barH / 2 + fs / 3)
      if (isRec) {
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(18, 18, 7, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#fff'; ctx.fillText('REC', 32, 24)
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
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream; await videoRef.current.play(); setCameraReady(true)
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
            drawOverlay(videoRef.current, canvasRef.current, uniqueCodeRef.current, orderId, step === 'recording')
          }
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError('Could not access camera. Please allow permissions.')
      setCameraReady(false)
    }
  }, [drawOverlay, orderId, step])

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setCameraReady(false)
  }, [])

  // Init camera on mount — intentionally minimal deps
  useEffect(() => {
    initCamera(facingMode)
    return () => { stopCamera(); if (timerRef.current) clearInterval(timerRef.current) }
  // We only want this to run on mount
  }, [initCamera, facingMode, stopCamera])

  // Re-init when facingMode changes (not when scanner is active)
  useEffect(() => {
    if (scannerActive) return
    initCamera(facingMode)
    return () => stopCamera()
  }, [facingMode, initCamera, scannerActive, stopCamera])

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
    setScannerActive(true); setScannerError(null); stopCamera()
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('barcode-scanner')
      html5QrcodeRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.5 },
        (decodedText: string) => {
          setOrderId(decodedText); setScannerActive(false)
          toast({ title: 'Scanned!', description: `Order: ${decodedText}` })
        },
        () => {}
      )
    } catch (err) {
      console.error('Scanner error:', err); setScannerError('Could not start scanner.')
      setScannerActive(false); initCamera(facingMode)
    }
  }, [facingMode, initCamera, stopCamera, toast])

  const stopScanner = useCallback(async () => {
    try {
      if (html5QrcodeRef.current) {
        if (html5QrcodeRef.current.getState() === 2) await html5QrcodeRef.current.stop()
        html5QrcodeRef.current.clear(); html5QrcodeRef.current = null
      }
    } catch (e) { console.error(e) }
    setScannerActive(false); initCamera(facingMode)
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

  // ======== DONE ========
  if (step === 'done') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Video Sent</h2>
                <p className="text-gray-500 mt-1">Proof sent to <span className="font-medium text-gray-700">{buyerEmail}</span></p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-mono font-semibold">#{orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Code</span><span className="font-mono font-semibold text-emerald-700">{uniqueCode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Link</span><span className="font-mono text-xs text-emerald-700 max-w-[180px] truncate">{verifyLink}</span></div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleReset} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold"><Package className="w-4 h-4 mr-2" />Record Another</Button>
                <Button variant="outline" className="w-full h-11" onClick={() => router.push('/dashboard')}>View Dashboard</Button>
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="pt-6 pb-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Review Video</h2>
              <video src={videoUrl} controls className="w-full rounded-xl bg-black" playsInline />
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-emerald-800">Proof Code: <span className="font-mono text-lg">{uniqueCode}</span></p>
                <p className="text-emerald-600 text-xs mt-1">Burned into the video. Cannot be edited.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => setStep('details')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"><ArrowRight className="w-4 h-4 mr-2" />Enter Email & Send</Button>
                <Button variant="outline" className="w-full" onClick={handleReset}>Discard & Re-record</Button>
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="pt-6 pb-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Send to Buyer</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{orderId}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Buyer&apos;s Email</label>
                <Input type="email" placeholder="buyer@email.com" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="h-12 text-base" autoFocus />
              </div>
              {step === 'sending' ? (
                <Button disabled className="w-full bg-emerald-600 text-white h-12"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</Button>
              ) : (
                <Button onClick={handleSend} disabled={!buyerEmail || !buyerEmail.includes('@')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-semibold"><Send className="w-4 h-4 mr-2" />Upload & Send Email</Button>
              )}
              <Button variant="ghost" className="w-full" onClick={() => setStep('preview')}>Back to Preview</Button>
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
        {scannerActive ? (
          <div className="absolute inset-0 z-10 bg-black flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/80 text-white">
              <h3 className="text-lg font-semibold">Scan Barcode</h3>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10" onClick={stopScanner}><X className="w-6 h-6" /></Button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {scannerError ? (
                <div className="text-center text-white p-6">
                  <p className="text-red-400 mb-4">{scannerError}</p>
                  <Button variant="outline" className="text-white border-white/30" onClick={stopScanner}>Go Back</Button>
                </div>
              ) : (
                <>
                  <div id="barcode-scanner" className="w-full max-w-md" style={{ minHeight: '300px' }} />
                  <p className="text-white/60 text-sm mt-4 text-center">Point camera at barcode or QR code</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`} playsInline muted />
            <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`} />
            {!cameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                {cameraError ? (
                  <><AlertCircle className="w-12 h-12 text-red-400 mb-3" /><p className="text-center text-sm">{cameraError}</p><Button variant="outline" className="mt-4 text-white border-white/30 hover:bg-white/10" onClick={() => initCamera(facingMode)}><RotateCcw className="w-4 h-4 mr-2" />Retry</Button></>
                ) : (
                  <><Loader2 className="w-12 h-12 animate-spin text-emerald-400 mb-3" /><p className="text-sm text-gray-300">Starting camera...</p></>
                )}
              </div>
            )}
            {step === 'recording' && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-mono font-bold flex items-center gap-2 shadow-lg z-20">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />{formatTime(recordingTime)}
              </div>
            )}
            {cameraReady && step !== 'recording' && (
              <div className="absolute top-6 left-4 right-4 flex justify-between z-20">
                <Button onClick={() => router.push('/')} variant="ghost" size="icon" className="h-10 w-10 bg-black/40 text-white hover:bg-black/60 rounded-full"><X className="w-5 h-5" /></Button>
                <Button onClick={flipCamera} variant="ghost" size="icon" className="h-10 w-10 bg-black/40 text-white hover:bg-black/60 rounded-full"><RotateCcw className="w-5 h-5" /></Button>
              </div>
            )}
            {cameraReady && (
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 z-20 safe-area-bottom">
                {step === 'camera' && (
                  <div className="flex justify-center mb-5">
                    <Button onClick={startScanner} className="bg-white/90 hover:bg-white text-gray-900 h-12 px-6 rounded-full font-semibold shadow-lg"><ScanLine className="w-5 h-5 mr-2" />Scan Barcode</Button>
                  </div>
                )}
                <div className="flex justify-center mb-5">
                  {orderId ? (
                    <div className="bg-black/50 backdrop-blur rounded-full px-4 py-2 text-white text-sm font-medium flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />#{orderId}
                      <button onClick={() => setOrderId('')} className="ml-1 text-white/50 hover:text-white"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <input type="text" placeholder="Type order ID..." value={orderId} onChange={(e) => setOrderId(e.target.value)} className="bg-black/50 backdrop-blur rounded-full px-4 py-2.5 text-white text-sm w-56 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500" autoFocus />
                  )}
                </div>
                <div className="flex justify-center">
                  {step === 'camera' ? (
                    <button onClick={startRecording} disabled={!orderId} className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:opacity-50 flex items-center justify-center shadow-2xl transition-all active:scale-95"><div className="w-8 h-8 rounded-full bg-white" /></button>
                  ) : step === 'recording' ? (
                    <button onClick={stopRecording} className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all active:scale-95"><Square className="w-8 h-8 text-white" /></button>
                  ) : null}
                </div>
                {!orderId && <p className="text-center text-white/50 text-xs mt-4">Scan or type an order ID to start</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
