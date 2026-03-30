"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">JBNet43</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Nos Services
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            A Propos
          </Link>
          <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+33788429319" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>07 88 42 93 19</span>
          </a>
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/booking">
            <Button size="sm">
              Réserver
            </Button>
          </Link>
        </div>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link 
              href="#services" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Nos Services
            </Link>
            <Link 
              href="#about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              A Propos
            </Link>
            <Link 
              href="#contact" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
              <a href="tel:+33600000000" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>06 00 00 00 00</span>
              </a>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/booking">
                <Button className="w-full">
                  Réserver
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
