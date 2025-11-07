"use client"

import Link from "next/link"

import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react"
import { Navbar } from "./_components/navbar"
import { Footer } from "./_components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="inline-block px-4 py-2 bg-primary-dark-blue/10 rounded-full">
                <span className="text-primary-dark-blue font-semibold text-sm">🇮🇳 Built for India</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-balance mb-6">
              Transform Urban <span className="text-primary-dark-blue">Governance</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              AI-powered platform bringing accountability and transparency to civic governance. Report issues, track
              resolutions, and empower communities.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/signup"
                className="px-8 py-3 bg-primary-dark-blue text-white rounded-lg font-semibold hover:bg-primary-dark-blue-light transition flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-card py-20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why CIVICOS</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Real-time issue tracking and resolution updates" },
                { icon: BarChart3, title: "Data Driven", desc: "AI-powered insights and predictive analytics" },
                { icon: Users, title: "Community Powered", desc: "Transparent governance and citizen engagement" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-background rounded-lg border border-border"
                >
                  <item.icon className="text-primary-dark-blue mb-4" size={32} />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
