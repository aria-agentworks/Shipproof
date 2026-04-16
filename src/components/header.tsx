'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X, Camera, CreditCard, Building2, BookOpen } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-emerald-700/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-700/80">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpeg"
            alt="ShipProof"
            width={28}
            height={50}
            className="h-8 w-auto rounded-md"
          />
          <span className="font-bold text-white text-lg hidden sm:inline">ShipProof</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/record">
            <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10">
              <Camera className="w-4 h-4 mr-1.5" />
              Record
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link href="/enterprise">
            <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10">
              <Building2 className="w-4 h-4 mr-1.5" />
              Enterprise
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Docs
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="text-emerald-100 hover:text-white hover:bg-white/10">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Pricing
            </Button>
          </Link>
          <Link href="/record" className="ml-2">
            <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-sm">
              Start Free
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden text-white hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-white/10 bg-emerald-800/95 backdrop-blur px-4 py-3 space-y-1">
          <Link href="/record" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Camera className="w-4 h-4 mr-2" />
              Record
            </Button>
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link href="/enterprise" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <Building2 className="w-4 h-4 mr-2" />
              Enterprise
            </Button>
          </Link>
          <Link href="/docs" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <BookOpen className="w-4 h-4 mr-2" />
              Docs
            </Button>
          </Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <CreditCard className="w-4 h-4 mr-2" />
              Pricing
            </Button>
          </Link>
          <Link href="/record" onClick={() => setMenuOpen(false)} className="pt-2">
            <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold">
              Start Free
            </Button>
          </Link>
        </nav>
      )}
    </header>
  )
}
