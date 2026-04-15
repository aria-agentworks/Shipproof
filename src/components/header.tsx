'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpeg"
            alt="ShipProof"
            width={32}
            height={56}
            className="h-8 w-auto rounded"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link href="/record">
            <Button variant="ghost" size="sm" className="text-gray-600">Record</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600">Dashboard</Button>
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
            <Button variant="ghost" className="w-full justify-start text-gray-600">Record</Button>
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-gray-600">Dashboard</Button>
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
