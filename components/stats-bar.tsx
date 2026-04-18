"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Users, CheckCircle2, TrendingUp, Activity } from "lucide-react"
import type { NGORequest, Volunteer } from "@/types/allocation"

interface StatsBarProps {
  requests: NGORequest[]
  volunteers: Volunteer[]
}

export function StatsBar({ requests, volunteers }: StatsBarProps) {
  const highUrgency = requests.filter((r) => r.urgency === "High").length
  const availableVols = volunteers.filter((v) => v.availability === "Available").length
  const covered = Math.min(availableVols, requests.length)
  const coveragePercent = requests.length > 0 ? Math.round((covered / requests.length) * 100) : 0

  const stats = [
    {
      label: "Active Requests",
      value: requests.length,
      icon: AlertTriangle,
      color: "text-[oklch(0.78_0.18_75)]",
      bg: "bg-[oklch(0.78_0.18_75)]/10",
      border: "border-[oklch(0.78_0.18_75)]/20",
      glow: "shadow-[oklch(0.78_0.18_75)]/10",
    },
    {
      label: "High Urgency",
      value: highUrgency,
      icon: AlertTriangle,
      color: "text-[oklch(0.75_0.22_25)]",
      bg: "bg-[oklch(0.62_0.22_25)]/10",
      border: "border-[oklch(0.62_0.22_25)]/20",
      glow: "shadow-[oklch(0.62_0.22_25)]/10",
    },
    {
      label: "Volunteers",
      value: volunteers.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      glow: "shadow-primary/10",
    },
    {
      label: "Available Now",
      value: availableVols,
      icon: CheckCircle2,
      color: "text-[oklch(0.78_0.18_145)]",
      bg: "bg-[oklch(0.68_0.18_145)]/10",
      border: "border-[oklch(0.68_0.18_145)]/20",
      glow: "shadow-[oklch(0.68_0.18_145)]/10",
    },
    {
      label: "Coverage",
      value: `${coveragePercent}%`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      glow: "shadow-primary/10",
      isPercent: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`flex items-center gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border ${s.border} shadow-lg ${s.glow} hover:border-primary/30 transition-all cursor-default`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${s.bg}`}>
              <Icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <motion.div
                key={s.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-2xl font-bold leading-none ${s.color}`}
              >
                {s.value}
              </motion.div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-tight font-medium">{s.label}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
