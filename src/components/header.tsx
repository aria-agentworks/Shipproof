'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, Menu, X } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Ship<span className="text-emerald-600">Proof</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link href="/record">
            <Button variant="outline" size="sm">Record</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
          <Link href="/record">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Free
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="sm:hidden border-t bg-white px-4 py-3 space-y-2">
          <Link href="/record" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">Record</Button>
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">Dashboard</Button>
          </Link>
          <Link href="/record" onClick={() => setMenuOpen(false)}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Free
            </Button>
          </Link>
        </nav>
      )}
    </header>
  )
}
