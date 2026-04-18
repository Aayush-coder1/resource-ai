"use client"

import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Activity, Zap } from "lucide-react"
import type { NGORequest, Volunteer, AllocationResult } from "@/types/allocation"

interface AnalyticsPanelProps {
  requests: NGORequest[]
  volunteers: Volunteer[]
  allocations: AllocationResult[]
}

export function AnalyticsPanel({ requests, volunteers, allocations }: AnalyticsPanelProps) {
  const highUrgency = requests.filter((r) => r.urgency === "High").length
  const mediumUrgency = requests.filter((r) => r.urgency === "Medium").length
  const lowUrgency = requests.filter((r) => r.urgency === "Low").length
  const total = requests.length || 1

  const availableVols = volunteers.filter((v) => v.availability === "Available").length
  const busyVols = volunteers.filter((v) => v.availability === "Busy").length
  const offlineVols = volunteers.filter((v) => v.availability === "Offline").length
  const totalVols = volunteers.length || 1

  const avgMatchScore = allocations.length
    ? Math.round(allocations.reduce((acc, a) => acc + a.matchScore, 0) / allocations.length)
    : 0

  const coverageRate = requests.length
    ? Math.round((allocations.length / requests.length) * 100)
    : 0

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl shadow-black/20">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Real-time Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Match Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-secondary border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg Match Score</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">{avgMatchScore}</span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgMatchScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.65_0.18_220)]"
            />
          </div>
        </motion.div>

        {/* Coverage Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-secondary border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[oklch(0.68_0.18_145)]" />
            <span className="text-xs text-muted-foreground">Coverage Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[oklch(0.68_0.18_145)]">{coverageRate}</span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${coverageRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-[oklch(0.68_0.18_145)] to-[oklch(0.58_0.18_145)]"
            />
          </div>
        </motion.div>
      </div>

      {/* Request Distribution */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Request Urgency Distribution</span>
          <span className="text-xs text-muted-foreground">{requests.length} total</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-background">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(highUrgency / total) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-[oklch(0.62_0.22_25)]"
            title={`High: ${highUrgency}`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(mediumUrgency / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="h-full bg-[oklch(0.78_0.18_75)]"
            title={`Medium: ${mediumUrgency}`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(lowUrgency / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-[oklch(0.68_0.18_145)]"
            title={`Low: ${lowUrgency}`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.22_25)]" />
            <span className="text-muted-foreground">High ({highUrgency})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.78_0.18_75)]" />
            <span className="text-muted-foreground">Medium ({mediumUrgency})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.68_0.18_145)]" />
            <span className="text-muted-foreground">Low ({lowUrgency})</span>
          </div>
        </div>
      </div>

      {/* Volunteer Availability */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Volunteer Availability</span>
          <span className="text-xs text-muted-foreground">{volunteers.length} total</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-background">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(availableVols / totalVols) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-primary"
            title={`Available: ${availableVols}`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(busyVols / totalVols) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full bg-[oklch(0.78_0.18_75)]"
            title={`Busy: ${busyVols}`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(offlineVols / totalVols) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-full bg-muted-foreground/30"
            title={`Offline: ${offlineVols}`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Available ({availableVols})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.78_0.18_75)]" />
            <span className="text-muted-foreground">Busy ({busyVols})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="text-muted-foreground">Offline ({offlineVols})</span>
          </div>
        </div>
      </div>

      {/* Efficiency indicator */}
      {allocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 p-3 rounded-xl bg-primary/10 border border-primary/20"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              AI Efficiency: {allocations.length} successful allocations
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
