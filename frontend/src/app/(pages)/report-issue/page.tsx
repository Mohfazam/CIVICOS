"use client"

import type React from "react"

import { useState } from "react"

import { motion } from "framer-motion"
import { Upload, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/app/_components/navbar"
import { Footer } from "@/app/_components/footer"

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    area: "",
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    "Road Damage",
    "Pothole",
    "Street Light",
    "Water Supply",
    "Drainage",
    "Garbage",
    "Traffic",
    "Other",
  ]

  const areas = [
    "Jubilee Hills",
    "Banjara Hills",
    "Hitech City",
    "Gachibowli",
    "Kukatpally",
    "Secunderabad",
    "Begumpet",
    "Somajiguda",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Issue submitted:", { ...formData, photo })
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ title: "", category: "", description: "", location: "", area: "" })
      setPhoto(null)
      setPhotoPreview("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
              <p className="text-muted-foreground">Help improve your city by reporting civic issues</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Issue Reported Successfully
                </h2>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Your report has been submitted. Authorities will review and take action soon.
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Redirecting...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
                {/* Issue Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Issue Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief title of the issue"
                    required
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Area *</label>
                    <select name="area" value={formData.area} onChange={handleInputChange} required className="w-full">
                      <option value="">Select area</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Location Details</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      //@ts-ignore
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Street name, landmark"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the issue"
                    rows={4}
                    required
                    className="w-full"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload Photo</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-input"
                    />
                    <label htmlFor="photo-input" className="cursor-pointer block">
                      {photoPreview ? (
                        <div className="space-y-2">
                          <img
                            src={photoPreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-32 h-32 object-cover mx-auto rounded"
                          />
                          <p className="text-sm text-muted-foreground">Click to change photo</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-dark-blue text-white py-3 rounded-lg font-semibold hover:bg-primary-dark-blue-light transition"
                  >
                    Submit Report
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 border border-border py-3 rounded-lg font-semibold text-center hover:bg-muted transition"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
