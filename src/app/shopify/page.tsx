'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils-shipproof'
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Video,
  ShoppingCart,
  Shield,
  Clock,
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

function getApiKey(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)sp_api_key=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

interface ShopifyOrder {
  id: string
  order_number: number
  email: string
  buyer_email: string
  item_count: number
  line_items: { title: string; quantity: number; sku: string; price: string }[]
  financial_status: string
  fulfillment_status: string | null
  total_price: string
  currency: string
  created_at: string
  order_id: string
}

interface VideoData {
  id: string
  order_id: string
  verification_code: string
  status: string
  buyer_email: string
  buyer_confirmed: boolean
  created_at: string
}

const FINANCIAL_STATUS_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-yellow-100 text-yellow-800',
  partially_paid: 'bg-orange-100 text-orange-800',
  refunded: 'bg-red-100 text-red-800',
  voided: 'bg-gray-100 text-gray-800',
  partially_refunded: 'bg-orange-100 text-orange-800',
  authorized: 'bg-blue-100 text-blue-800',
}

function ShopifyPageContent() {
  const searchParams = useSearchParams()
  const shop = searchParams.get('shop')
  const installed = searchParams.get('installed') === 'true'
  const { toast } = useToast()

  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [videos, setVideos] = useState<VideoData[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)
  const [creatingVerification, setCreatingVerification] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/shopify/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.data?.orders || [])
      } else {
        const data = await res.json()
        toast({
          title: 'Error fetching orders',
          description: data.error || 'Failed to load Shopify orders',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to connect to Shopify',
        variant: 'destructive',
      })
    } finally {
      setOrdersLoading(false)
    }
  }, [toast])

  const fetchVideos = useCallback(async () => {
    setVideosLoading(true)
    try {
      const res = await fetch('/api/v1/video')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.data?.videos || [])
      }
    } catch {
      // Silent fail for videos
    } finally {
      setVideosLoading(false)
    }
  }, [])

  useEffect(() => {
    if (getApiKey()) {
      fetchOrders()
      fetchVideos()
    }
  }, [fetchOrders, fetchVideos])

  const handleCreateVerification = async (order: ShopifyOrder) => {
    setCreatingVerification(String(order.order_number))
    try {
      const res = await fetch('/api/v1/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: String(order.order_number),
          buyer_email: order.buyer_email || undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast({
          title: 'Verification created!',
          description: `Order #${order.order_number} — Code: ${data.data.verification_code}`,
        })
        fetchVideos()
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to create verification',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create verification',
        variant: 'destructive',
      })
    } finally {
      setCreatingVerification(null)
    }
  }

  const verifiedCount = videos.filter((v) => v.buyer_confirmed).length
  const sentCount = videos.filter((v) => v.status === 'sent').length

  // Check if an order already has a verification
  const hasVerification = (orderNumber: number) => {
    return videos.some((v) => v.order_id === String(orderNumber))
  }

  // No shop param — show error
  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-gray-900">Shop parameter required</h2>
              <p className="text-sm text-gray-500">
                This page requires a shop domain to function. Please access it through the Shopify app installation flow.
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Go to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">ShipProof for Shopify</span>
          </div>
          <Link href={`/shopify/setup?shop=${encodeURIComponent(shop)}`}>
            <Button variant="ghost" size="sm" className="text-gray-500">
              Setup
            </Button>
          </Link>
        </div>
      </header>

      {/* Success banner */}
      {installed && (
        <div className="bg-emerald-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">ShipProof has been installed!</p>
              <p className="text-xs text-emerald-100">The Trust Widget is now live on your store.</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Shop info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopify Dashboard</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                {shop}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchOrders()
                  fetchVideos()
                }}
                disabled={ordersLoading}
              >
                {ordersLoading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                )}
                Refresh
              </Button>
              <Link href="/dashboard">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Video className="w-3.5 h-3.5 mr-1.5" />
                  Record Video
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
                    <p className="text-xs text-gray-500">Videos This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-gray-500">Orders Fetched</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sentCount}</p>
                    <p className="text-xs text-gray-500">Sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopify Orders table */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Shopify Orders</h2>
                <Badge variant="secondary" className="text-xs">
                  {orders.length} orders
                </Badge>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <span className="ml-3 text-sm text-gray-500">Loading orders from Shopify...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
                  <p className="text-sm text-gray-500">
                    No Shopify orders were returned. Make sure orders exist on your store.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-semibold text-gray-600">Order</th>
                          <th className="pb-3 font-semibold text-gray-600">Buyer Email</th>
                          <th className="pb-3 font-semibold text-gray-600 text-center">Items</th>
                          <th className="pb-3 font-semibold text-gray-600">Status</th>
                          <th className="pb-3 font-semibold text-gray-600">Date</th>
                          <th className="pb-3 font-semibold text-gray-600 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const hasV = hasVerification(order.order_number)
                          return (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="py-3">
                                <span className="font-mono font-semibold text-gray-900">
                                  #{order.order_number}
                                </span>
                              </td>
                              <td className="py-3 text-gray-600 truncate max-w-[200px]">
                                {order.buyer_email || '—'}
                              </td>
                              <td className="py-3 text-center">
                                <Badge variant="secondary" className="text-xs">
                                  {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <Badge
                                  className={`text-xs border-0 ${
                                    FINANCIAL_STATUS_COLORS[order.financial_status] || 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {order.financial_status}
                                </Badge>
                              </td>
                              <td className="py-3 text-gray-500 text-xs">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(order.created_at)}
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                {hasV ? (
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs border-0 gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                                    onClick={() => handleCreateVerification(order)}
                                    disabled={creatingVerification === String(order.order_number)}
                                  >
                                    {creatingVerification === String(order.order_number) ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Video className="w-3 h-3 mr-1" />
                                    )}
                                    Create Verification
                                  </Button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-3">
                    {orders.map((order) => {
                      const hasV = hasVerification(order.order_number)
                      return (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-mono font-bold text-gray-900">
                                #{order.order_number}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {order.buyer_email || 'No email'}
                              </p>
                            </div>
                            <Badge
                              className={`text-xs border-0 ${
                                FINANCIAL_STATUS_COLORS[order.financial_status] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.financial_status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(order.created_at)}
                            </span>
                          </div>

                          {/* Line items preview */}
                          {order.line_items && order.line_items.length > 0 && (
                            <div className="space-y-1">
                              {order.line_items.slice(0, 3).map((item, idx) => (
                                <p key={idx} className="text-xs text-gray-600 truncate">
                                  ×{item.quantity} {item.title}
                                </p>
                              ))}
                              {order.line_items.length > 3 && (
                                <p className="text-xs text-gray-400">
                                  +{order.line_items.length - 3} more
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex justify-end">
                            {hasV ? (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs border-0 gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs"
                                onClick={() => handleCreateVerification(order)}
                                disabled={creatingVerification === String(order.order_number)}
                              >
                                {creatingVerification === String(order.order_number) ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Video className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                Create Verification
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>ShipProof is protecting your shipments</span>
          </div>
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            shipproof.netlify.app
          </Link>
        </div>
      </footer>
    </div>
  )
}

function ShopifyPageFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </main>
    </div>
  )
}

export default function ShopifyPage() {
  return (
    <Suspense fallback={<ShopifyPageFallback />}>
      <ShopifyPageContent />
    </Suspense>
  )
}
