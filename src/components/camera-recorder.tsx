'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generateUniqueCode } from '@/lib/utils-shipproof'
import { 
  Camera, 
  Square, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Video,
  Loader2
} from 'lucide-react'

interface CameraRecorderProps {
  orderId: string
  onVideoRecorded: (blob: Blob, uniqueCode: string) => void
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
}

export default function CameraRecorder({
  orderId,
  onVideoRecorded,
  isRecording,
  setIsRecording,
}: CameraRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animFrameRef = useRef<number>(0)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const uniqueCodeRef = useRef<string>(generateUniqueCode(6))

  const drawOverlay = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement, code: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawFrame = () => {
      if (!video.videoWidth) {
        animFrameRef.current = requestAnimationFrame(() => drawFrame(video, canvas, code))
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame
      ctx.drawImage(video, 0, 0)

      // Draw overlay background bar at bottom
      const barHeight = Math.max(80, canvas.height * 0.1)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight)

      // Draw border line
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, 3)

      // Text settings
      const fontSize = Math.max(16, Math.floor(barHeight * 0.35))
      ctx.font = `bold ${fontSize}px monospace`
      ctx.fillStyle = '#ffffff'

      const now = new Date()
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19)

      // Left: Order ID
      const orderText = orderId ? `Order: ${orderId}` : ''
      ctx.fillText(orderText, 12, canvas.height - barHeight / 2 + fontSize / 3)

      // Center: Timestamp
      const tsWidth = ctx.measureText(timestamp).width
      ctx.fillText(timestamp, (canvas.width - tsWidth) / 2, canvas.height - barHeight / 2 + fontSize / 3)

      // Right: Unique Code
      const codeText = code
      const codeWidth = ctx.measureText(codeText).width
      ctx.fillText(codeText, canvas.width - codeWidth - 12, canvas.height - barHeight / 2 + fontSize / 3)

      // Top-left recording indicator
      if (isRecording) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(20, 20, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${fontSize}px monospace`
        ctx.fillText('REC', 36, 26)
      }

      animFrameRef.current = requestAnimationFrame(() => drawFrame(video, canvas, code))
    }

    drawFrame()
  }, [orderId, isRecording])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraReady(true)
        
        // Start overlay drawing after video is ready
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            drawOverlay(videoRef.current, canvasRef.current, uniqueCodeRef.current)
          }
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError('Could not access camera. Please allow camera permissions and try again.')
      setCameraReady(false)
    }
  }, [facingMode, drawOverlay])

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraReady(false)
  }, [])

  const startRecording = useCallback(async () => {
    if (!canvasRef.current || !streamRef.current) return

    // Generate a new unique code for this recording
    uniqueCodeRef.current = generateUniqueCode(6)

    try {
      const canvasStream = canvasRef.current.captureStream(30)
      
      // Check supported mimeTypes
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ]
      
      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      if (!selectedMimeType) {
        setCameraError('Your browser does not support video recording. Please try Chrome or Firefox.')
        return
      }

      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType })
        onVideoRecorded(blob, uniqueCodeRef.current)
        setIsRecording(false)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setRecordingTime(0)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Recording error:', err)
      setCameraError('Failed to start recording. Please try again.')
    }
  }, [onVideoRecorded, setIsRecording])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }, [])

  const resetCamera = useCallback(() => {
    stopRecording()
    stopCamera()
    setTimeout(() => startCamera(), 300)
  }, [stopRecording, stopCamera, startCamera])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [facingMode])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="w-full space-y-4">
      {/* Camera View */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? '' : 'hidden'}`}
        />
        
        {/* Camera loading / error state */}
        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            {cameraError ? (
              <>
                <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
                <p className="text-center text-sm">{cameraError}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 text-white border-white/30 hover:bg-white/10"
                  onClick={startCamera}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-green-400 mb-3" />
                <p className="text-sm text-gray-300">Starting camera...</p>
              </>
            )}
          </div>
        )}

        {/* Recording timer overlay */}
        {isRecording && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-mono font-bold flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {formatTime(recordingTime)}
          </div>
        )}

        {/* Flip camera button */}
        {cameraReady && !isRecording && (
          <button
            onClick={flipCamera}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={!cameraReady || !orderId}
            className="bg-red-600 hover:bg-red-700 text-white h-14 w-14 rounded-full p-0 flex items-center justify-center shadow-lg disabled:opacity-40"
            size="icon"
          >
            <Video className="w-6 h-6" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white h-14 w-14 rounded-full p-0 flex items-center justify-center shadow-lg animate-pulse"
            size="icon"
          >
            <Square className="w-6 h-6" />
          </Button>
        )}
      </div>

      {!orderId && cameraReady && (
        <p className="text-center text-sm text-muted-foreground">
          Scan or enter an Order ID to start recording
        </p>
      )}
    </div>
  )
}
