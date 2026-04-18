"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Send, CheckCircle, Sparkles } from "lucide-react"
import type { NGORequest } from "@/types/allocation"
import { db } from "@/src/firebase";
import { collection, addDoc } from "firebase/firestore";

interface NGORequestPanelProps {
  onSubmit: (req: NGORequest) => void
}

const requestTypes = ["Food", "Medical", "Volunteers"] as const
const urgencyLevels = ["High", "Medium", "Low"] as const

export function NGORequestPanel({ onSubmit }: NGORequestPanelProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<string>("Food")
  const [location, setLocation] = useState("")
  const [urgency, setUrgency] = useState<string>("Medium")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const newRequest = {
    title,
    type,
    location,
    urgency,
    createdAt: new Date(),
  }

  try {
    // ✅ SAVE TO FIREBASE
    await addDoc(collection(db, "requests"), newRequest)
  } catch (err) {
    console.error("Firebase error:", err)
  }

  // ✅ KEEP EXISTING FLOW
onSubmit({
  id: crypto.randomUUID(),
  title,
  type: type as NGORequest["type"], 
  location,
  urgency: urgency as NGORequest["urgency"],
  createdAt: new Date(),
})

  setTitle("")
  setLocation("")
  setLoading(false)
  setSuccess(true)
  setTimeout(() => setSuccess(false), 2500)
}

  const urgencyStyles = {
    High: {
      active: "bg-[oklch(0.62_0.22_25)]/20 border-[oklch(0.62_0.22_25)]/50 text-[oklch(0.75_0.22_25)] shadow-lg shadow-[oklch(0.62_0.22_25)]/20",
      inactive: "bg-secondary border-border text-muted-foreground hover:border-[oklch(0.62_0.22_25)]/30",
    },
    Medium: {
      active: "bg-[oklch(0.78_0.18_75)]/20 border-[oklch(0.78_0.18_75)]/50 text-[oklch(0.85_0.18_75)] shadow-lg shadow-[oklch(0.78_0.18_75)]/20",
      inactive: "bg-secondary border-border text-muted-foreground hover:border-[oklch(0.78_0.18_75)]/30",
    },
    Low: {
      active: "bg-[oklch(0.68_0.18_145)]/20 border-[oklch(0.68_0.18_145)]/50 text-[oklch(0.75_0.18_145)] shadow-lg shadow-[oklch(0.68_0.18_145)]/20",
      inactive: "bg-secondary border-border text-muted-foreground hover:border-[oklch(0.68_0.18_145)]/30",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-xl shadow-black/20 hover:border-primary/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-[oklch(0.65_0.18_220)]/10 border border-primary/30"
          whileHover={{ rotate: 5 }}
        >
          <Building2 className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Create NGO Request</h2>
          <p className="text-xs text-muted-foreground">Submit resource needs for AI allocation</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Request Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Emergency food supply needed"
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-secondary transition-all text-sm"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Request Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {requestTypes.map((t) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => setType(t)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === t
                    ? "bg-primary/15 border-primary/50 text-primary shadow-lg shadow-primary/10"
                    : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {t === "Food" && "🥗 "}
                {t === "Medical" && "🏥 "}
                {t === "Volunteers" && "👥 "}
                {t}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., District 4, Mumbai"
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-secondary transition-all text-sm"
          />
        </div>

        {/* Urgency */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Urgency Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {urgencyLevels.map((u) => (
              <motion.button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  urgency === u ? urgencyStyles[u].active : urgencyStyles[u].inactive
                }`}
              >
                {u}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || success}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[oklch(0.65_0.18_220)] text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all relative overflow-hidden"
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
                Request Submitted!
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
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Submitting...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 relative z-10"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  )
}
