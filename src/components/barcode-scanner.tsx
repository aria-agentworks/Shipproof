'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScanLine, X, Loader2 } from 'lucide-react'

interface BarcodeScannerProps {
  onScan: (code: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function BarcodeScanner({ onScan, isOpen, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const html5QrcodeRef = useRef<any>(null)

  useEffect(() => {
    if (!isOpen) return

    let mounted = true

    const startScanning = async () => {
      try {
        setIsScanning(true)
        setError(null)

        // Dynamic import to avoid SSR issues
        const { Html5Qrcode } = await import('html5-qrcode')

        if (!mounted || !scannerRef.current) return

        const scanner = new Html5Qrcode('barcode-scanner-element')
        html5QrcodeRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.5,
          },
          (decodedText: string) => {
            // Successfully scanned
            onScan(decodedText)
            stopScanning()
          },
          () => {
            // Scan failure - ignore (continuous scanning)
          }
        )
      } catch (err) {
        console.error('Scanner error:', err)
        if (mounted) {
          setError('Could not start camera for scanning. Please check camera permissions.')
          setIsScanning(false)
        }
      }
    }

    startScanning()

    return () => {
      mounted = false
      stopScanning()
    }
  }, [isOpen, onScan, onClose])

  const stopScanning = async () => {
    try {
      if (html5QrcodeRef.current) {
        const state = html5QrcodeRef.current.getState()
        if (state === 2) { // SCANNING state
          await html5QrcodeRef.current.stop()
        }
        html5QrcodeRef.current.clear()
        html5QrcodeRef.current = null
      }
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
    setIsScanning(false)
  }

  const handleClose = async () => {
    await stopScanning()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 text-white">
        <h3 className="text-lg font-semibold">Scan Order Code</h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 h-10 w-10"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {error ? (
          <div className="text-center text-white p-6">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              variant="outline"
              className="text-white border-white/30"
              onClick={() => {
                setError(null)
                stopScanning().then(() => {
                  setTimeout(() => {
                    // Retry
                  }, 500)
                })
              }}
            >
              Try Again
            </Button>
          </div>
        ) : isScanning ? (
          <>
            <div
              id="barcode-scanner-element"
              ref={scannerRef}
              className="w-full max-w-md"
              style={{ minHeight: '300px' }}
            />
            <p className="text-white/70 text-sm mt-4 text-center">
              Point your camera at a barcode or QR code on the order label
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center text-white">
            <Loader2 className="w-12 h-12 animate-spin text-green-400 mb-4" />
            <p className="text-gray-300">Initializing camera...</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-4 bg-black/80 text-center">
        <p className="text-white/50 text-xs">
          Supports QR codes, barcodes, EAN, UPC, Code 128, and more
        </p>
      </div>
    </div>
  )
}
