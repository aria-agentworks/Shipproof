'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calculator,
  ArrowLeft,
  DollarSign,
  TrendingDown,
  Shield,
  Upload,
  Share2,
  FileCheck,
  ArrowRight,
} from 'lucide-react'

export default function CalculatorPage() {
  const [monthlyOrders, setMonthlyOrders] = useState(500)
  const [disputeRate, setDisputeRate] = useState(2)
  const [avgClaimValue, setAvgClaimValue] = useState(50)

  const monthlyDisputes = (monthlyOrders * disputeRate) / 100
  const monthlyLoss = monthlyDisputes * avgClaimValue
  const annualLoss = monthlyLoss * 12
  const shipProofCost = 9.99
  const disputesToBreakEven = Math.max(1, Math.ceil(shipProofCost / avgClaimValue))

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-emerald-700/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-700/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-emerald-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="ShipProof"
                width={28}
                height={50}
                className="h-8 w-auto rounded-md"
              />
              <span className="font-bold text-white text-lg">ShipProof</span>
            </Link>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gray-950 py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Dispute Cost Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              How Much Are Chargebacks
              <br />
              <span className="text-emerald-400">Costing You?</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
              Most sellers underestimate dispute losses. Enter your numbers below and see the real impact on your business.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-emerald-600" />
                      Your Numbers
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Adjust the values to match your business.</p>
                  </div>

                  {/* Monthly Orders */}
                  <div className="space-y-2">
                    <label htmlFor="orders" className="text-sm font-semibold text-gray-700">
                      Monthly Orders
                    </label>
                    <input
                      id="orders"
                      type="number"
                      min={1}
                      value={monthlyOrders}
                      onChange={(e) => setMonthlyOrders(Math.max(1, Number(e.target.value)))}
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Dispute Rate */}
                  <div className="space-y-2">
                    <label htmlFor="rate" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>Dispute Rate</span>
                      <span className="text-emerald-600 font-bold">{disputeRate.toFixed(1)}%</span>
                    </label>
                    <input
                      id="rate"
                      type="range"
                      min={0.5}
                      max={5}
                      step={0.1}
                      value={disputeRate}
                      onChange={(e) => setDisputeRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.5%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  {/* Average Claim Value */}
                  <div className="space-y-2">
                    <label htmlFor="claim" className="text-sm font-semibold text-gray-700">
                      Average Claim Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        id="claim"
                        type="number"
                        min={1}
                        value={avgClaimValue}
                        onChange={(e) => setAvgClaimValue(Math.max(1, Number(e.target.value)))}
                        className="w-full h-11 pl-8 pr-4 rounded-lg border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      Your Losses
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time calculation based on your inputs.</p>
                  </div>

                  {/* Monthly Disputes */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Monthly Disputes</span>
                    <span className="font-bold text-gray-900 text-lg">{monthlyDisputes.toFixed(1)}</span>
                  </div>

                  {/* Monthly Loss */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Monthly Loss</span>
                    <span className="font-bold text-red-600 text-xl">
                      ${monthlyLoss.toFixed(2)}
                    </span>
                  </div>

                  {/* Annual Loss */}
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-600 font-medium">Annual Loss</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-red-600 mt-1">
                      ${annualLoss.toFixed(0)}
                    </p>
                    <p className="text-xs text-red-400 mt-1">per year from chargebacks</p>
                  </div>

                  {/* ShipProof Cost */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">ShipProof Cost</span>
                    <span className="font-bold text-emerald-600 text-lg">$9.99/mo</span>
                  </div>

                  {/* ROI */}
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-emerald-700 font-medium">Return on Investment</p>
                    <p className="text-lg font-bold text-emerald-700 mt-1">
                      ShipProof pays for itself in{' '}
                      <span className="text-emerald-600 text-2xl font-extrabold">
                        {disputesToBreakEven} dispute{disputesToBreakEven > 1 ? 's' : ''}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-500 mt-1">
                      Just {((shipProofCost / annualLoss) * 100).toFixed(4)}% of your annual dispute losses
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 sm:p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <Shield className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Stop Losing Money. Start Protecting Shipments.
                </h2>
                <p className="mt-3 text-emerald-100/80 max-w-md mx-auto">
                  Video proof of every shipment. Instantly resolve disputes. Start for free.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-10 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <Link href="/docs">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">
                How It Works
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Three Steps to Dispute Protection
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Record</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Upload a packing video via our API. It gets hashed with SHA-256 and stored immutably.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Share</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We generate a unique verification link for your buyer. They can watch the video and confirm receipt.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Dispute Proof</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    When a dispute arises, share the video and hash proof. Resolve chargebacks with hard evidence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.jpeg"
                alt="ShipProof"
                width={28}
                height={28}
                className="rounded opacity-60"
              />
              <div>
                <span className="text-sm font-semibold text-gray-300">ShipProof</span>
                <p className="text-xs text-gray-500 mt-0.5">Video proof for every shipment.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
              <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
              <Link href="/calculator" className="hover:text-gray-300 transition-colors">Calculator</Link>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            </div>
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} ShipProof. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
