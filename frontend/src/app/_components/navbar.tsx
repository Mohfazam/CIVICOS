"use client"

import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/report-issue", label: "Report Issue" },
    { href: "/admin", label: "Admin" },
    { href: "/map", label: "Map" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/mla-report", label: "MLA Report" },
  ]

  return (
    <nav className="fixed top-0 w-full bg-card/95 border-b border-border backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">CIVICOS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden pb-4 space-y-2 border-t border-border pt-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded hover:bg-muted transition text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
