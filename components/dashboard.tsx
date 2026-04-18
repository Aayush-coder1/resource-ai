"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { NGORequestPanel } from "@/components/ngo-request-panel"
import { VolunteerPanel } from "@/components/volunteer-panel"
import { AIDashboard } from "@/components/ai-dashboard"
import { StatsBar } from "@/components/stats-bar"
import { LiveMap } from "@/components/live-map"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { AnimatedBackground } from "@/components/animated-background"
import type { NGORequest, Volunteer, AllocationResult } from "@/types/allocation"

// Seed demo data so the app looks populated on first load
const DEMO_REQUESTS: NGORequest[] = [
  { id: "1", title: "Emergency food packs for flood victims", type: "Food", location: "Kurla, Mumbai", urgency: "High", createdAt: new Date() },
  { id: "2", title: "Medical supplies for relief camp", type: "Medical", location: "Andheri, Mumbai", urgency: "High", createdAt: new Date() },
  { id: "3", title: "Volunteers for debris clearance", type: "Volunteers", location: "Thane", urgency: "Medium", createdAt: new Date() },
  { id: "4", title: "Water purification tablets needed", type: "Medical", location: "Borivali, Mumbai", urgency: "Low", createdAt: new Date() },
]

const DEMO_VOLUNTEERS: Volunteer[] = [
  { id: "1", name: "Priya Sharma", skills: ["First Aid", "Medical"], location: "Andheri, Mumbai", availability: "Available", registeredAt: new Date() },
  { id: "2", name: "Rahul Mehta", skills: ["Cooking", "Food Distribution"], location: "Kurla, Mumbai", availability: "Available", registeredAt: new Date() },
  { id: "3", name: "Anita Rao", skills: ["Driving", "Logistics"], location: "Thane", availability: "Busy", registeredAt: new Date() },
  { id: "4", name: "Vikram Singh", skills: ["Construction", "Heavy Lifting"], location: "Powai, Mumbai", availability: "Available", registeredAt: new Date() },
  { id: "5", name: "Meera Patel", skills: ["Nursing", "Medical Care"], location: "Borivali, Mumbai", availability: "Available", registeredAt: new Date() },
]

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [requests, setRequests] = useState<NGORequest[]>(DEMO_REQUESTS)
  const [volunteers, setVolunteers] = useState<Volunteer[]>(DEMO_VOLUNTEERS)
  const [allocations, setAllocations] = useState<AllocationResult[]>([])
  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([])

  const addRequest = (req: NGORequest) => setRequests((prev) => [req, ...prev])
  const addVolunteer = (vol: Volunteer) => setVolunteers((prev) => [vol, ...prev])

  const handleAllocationComplete = (results: AllocationResult[]) => {
    setAllocations(results)
    // Create connections for the map visualization
    const newConnections: Array<{ from: string; to: string }> = []
    results.forEach((result) => {
      const req = requests.find((r) => r.title === result.request)
      const vol = volunteers.find((v) => v.name === result.volunteer)
      if (req && vol) {
        newConnections.push({ from: req.id, to: vol.id })
      }
    })
    setConnections(newConnections)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Animated particle background */}
      <AnimatedBackground />

      <Header onLogout={onLogout} />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 relative z-10">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatsBar requests={requests} volunteers={volunteers} />
        </motion.div>

        {/* Live Map & Analytics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-xl shadow-black/20">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Resource Map
            </h3>
            <LiveMap requests={requests} volunteers={volunteers} connections={connections} />
          </div>
          <AnalyticsPanel requests={requests} volunteers={volunteers} allocations={allocations} />
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: NGO Requests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <NGORequestPanel onSubmit={addRequest} />
          </motion.div>

          {/* Center: Volunteer Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <VolunteerPanel onSubmit={addVolunteer} />
          </motion.div>

          {/* Right: AI Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <AIDashboard
              requests={requests}
              volunteers={volunteers}
              onAllocationComplete={handleAllocationComplete}
            />
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border py-4 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              AI Resource Allocation System &mdash; Powered by AI for Smart NGO Coordination
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              System Online
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
