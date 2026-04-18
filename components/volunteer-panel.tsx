"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, CheckCircle, Heart } from "lucide-react"
import type { Volunteer } from "@/types/allocation"
import { db } from "@/src/firebase";
import { collection, addDoc } from "firebase/firestore";

interface VolunteerPanelProps {
  onSubmit: (volunteer: Volunteer) => void
}

export function VolunteerPanel({ onSubmit }: VolunteerPanelProps) {
  const [name, setName] = useState("")
  const [skills, setSkills] = useState("")
  const [location, setLocation] = useState("")
  const [availability, setAvailability] = useState<"Available" | "Busy" | "Offline">("Available")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const newVolunteer = {
    name,
    skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    location,
    availability,
    registeredAt: new Date(),
  }

  try {
    // ✅ SAVE TO FIREBASE
    await addDoc(collection(db, "volunteers"), newVolunteer)
  } catch (err) {
    console.error("Firebase error:", err)
  }

  // ✅ KEEP EXISTING FLOW
  onSubmit({
    id: crypto.randomUUID(),
    ...newVolunteer,
  })

  setName("")
  setSkills("")
  setLocation("")
  setLoading(false)
  setSuccess(true)
  setTimeout(() => setSuccess(false), 2500)
}

  const availabilityOptions: Array<"Available" | "Busy" | "Offline"> = [
    "Available",
    "Busy",
    "Offline",
  ]

  const availabilityStyles: Record<string, { active: string; inactive: string }> = {
    Available: {
      active: "bg-[oklch(0.68_0.18_145)]/20 border-[oklch(0.68_0.18_145)]/50 text-[oklch(0.75_0.18_145)] shadow-lg shadow-[oklch(0.68_0.18_145)]/20",
      inactive: "bg-secondary/50 border-border text-muted-foreground hover:border-[oklch(0.68_0.18_145)]/30",
    },
    Busy: {
      active: "bg-[oklch(0.78_0.18_75)]/20 border-[oklch(0.78_0.18_75)]/50 text-[oklch(0.85_0.18_75)] shadow-lg shadow-[oklch(0.78_0.18_75)]/20",
      inactive: "bg-secondary/50 border-border text-muted-foreground hover:border-[oklch(0.78_0.18_75)]/30",
    },
    Offline: {
      active: "bg-muted/50 border-border text-muted-foreground shadow-lg shadow-muted/20",
      inactive: "bg-secondary/50 border-border text-muted-foreground hover:border-border/80",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-xl shadow-black/20 hover:border-[oklch(0.68_0.18_145)]/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.68_0.18_145)]/20 to-[oklch(0.58_0.18_145)]/10 border border-[oklch(0.68_0.18_145)]/30"
          whileHover={{ rotate: -5 }}
        >
          <Users className="w-5 h-5 text-[oklch(0.68_0.18_145)]" />
        </motion.div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Register Volunteer</h2>
          <p className="text-xs text-muted-foreground">Join the volunteer network</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Priya Sharma"
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[oklch(0.68_0.18_145)]/50 focus:border-[oklch(0.68_0.18_145)] focus:bg-secondary transition-all text-sm"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Skills
            <span className="normal-case ml-1 text-muted-foreground/60">(comma separated)</span>
          </label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., First Aid, Cooking, Driving"
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[oklch(0.68_0.18_145)]/50 focus:border-[oklch(0.68_0.18_145)] focus:bg-secondary transition-all text-sm"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Bandra, Mumbai"
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[oklch(0.68_0.18_145)]/50 focus:border-[oklch(0.68_0.18_145)] focus:bg-secondary transition-all text-sm"
          />
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Current Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availabilityOptions.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => setAvailability(opt)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  availability === opt
                    ? availabilityStyles[opt].active
                    : availabilityStyles[opt].inactive
                }`}
              >
                {opt === "Available" && "✓ "}
                {opt === "Busy" && "⏳ "}
                {opt === "Offline" && "○ "}
                {opt}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || success}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[oklch(0.68_0.18_145)] to-[oklch(0.58_0.18_145)] text-white font-semibold text-sm shadow-lg shadow-[oklch(0.68_0.18_145)]/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all relative overflow-hidden"
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 relative z-10"
              >
                <CheckCircle className="w-4 h-4" />
                Volunteer Registered!
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 relative z-10"
              >
                <motion.span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Registering...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 relative z-10"
              >
                <UserPlus className="w-4 h-4" />
                Register Volunteer
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Motivational note */}
        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 text-[oklch(0.62_0.22_25)]" />
          <span>Every volunteer makes a difference</span>
        </div>
      </form>
    </motion.div>
  )
}
