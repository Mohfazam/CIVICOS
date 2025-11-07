"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { motion } from "framer-motion"
import { Eye, EyeOff, User, Mail, Lock, MapPin } from "lucide-react"
import { Navbar } from "@/app/_components/navbar"
import { Footer } from "@/app/_components/footer"

const TELANGANA_AREAS = [
  "Jubilee Hills",
  "Banjara Hills",
  "Hyderabad Central",
  "Secunderabad",
  "Kukatpally",
  "Manikonda",
  "Madhapur",
  "Gachibowli",
  "HITEC City",
  "Ameerpet",
  "Kondapur",
  "Begumpet",
  "Kachiguda",
  "Malakpet",
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    area: "",
    gender: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock signup - save to localStorage and redirect to dashboard
    localStorage.setItem("user", JSON.stringify(formData))
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-dark-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🇮🇳</span>
              </div>
              <h1 className="text-2xl font-bold">Join CIVICOS</h1>
              <p className="text-muted-foreground mt-2">Create your Indian Citizen account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-primary-dark-blue" size={20} />
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-dark-blue"
                    required
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-primary-dark-blue" size={20} />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-dark-blue"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-primary-dark-blue" size={20} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-dark-blue"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-primary-dark-blue" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-dark-blue"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-primary-dark-blue"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Area (Telangana Dropdown) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Area (Telangana)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-primary-dark-blue" size={20} />
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-dark-blue appearance-none"
                    required
                  >
                    <option value="">Select your area</option>
                    {TELANGANA_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Gender</label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={opt}
                        checked={formData.gender === opt}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-4 h-4 accent-primary-dark-blue"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-primary-dark-blue text-white font-semibold py-2 rounded-lg hover:bg-primary-dark-blue-light transition"
              >
                Create Account
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="w-full border border-border text-center py-2 rounded-lg font-medium hover:bg-muted transition"
            >
              Login
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-primary-dark-blue/10 rounded-lg text-center text-sm text-muted-foreground">
            <p>
              <strong>No Validation:</strong> Just for UI testing!
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
