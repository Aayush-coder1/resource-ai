"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MapPin, AlertTriangle, User } from "lucide-react"
import type { NGORequest, Volunteer } from "@/types/allocation"

interface LiveMapProps {
  requests: NGORequest[]
  volunteers: Volunteer[]
  connections?: Array<{ from: string; to: string }>
}

// Location to coordinates mapping for Mumbai region
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  "kurla": { lat: 19.0759, lng: 72.8194 },
  "andheri": { lat: 19.1136, lng: 72.8697 },
  "thane": { lat: 19.2183, lng: 72.9781 },
  "bandra": { lat: 19.0596, lng: 72.8295 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "dadar": { lat: 19.0176, lng: 72.8298 },
  "borivali": { lat: 19.2298, lng: 72.8414 },
  "powai": { lat: 19.1136, lng: 72.9044 },
}

function getCoordinates(location: string) {
  const lower = location.toLowerCase()
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (lower.includes(key)) return coords
  }
  return { lat: 19.0760, lng: 72.8777 } // Default: Mumbai center
}

function generateMapUrl() {
  // Generate map with request and volunteer markers
  const baseUrl = "https://www.google.com/maps/embed?pb="
  // Embedded map centered on Mumbai
  const params = "!1m14!1m12!1m3!1d60443.78667671225!2d72.8194!3d19.0759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1234567890"
  return baseUrl + encodeURIComponent(params)
}

export function LiveMap({ requests, volunteers, connections = [] }: LiveMapProps) {
  const mapUrl = generateMapUrl()

  return (
    <div className="relative w-full rounded-2xl bg-secondary/50 border border-border overflow-hidden">
      {/* Google Maps Iframe */}
      <div className="w-full h-64">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, borderRadius: "1rem" }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60443.78667671225!2d72.81940!3d19.07590!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sen!2sin!4v1713873445783"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="NGO Resource Allocation Map"
        />
      </div>

      {/* Overlay: Legend and Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f87171] border border-white/30" />
              <span className="text-white/80">Requests ({requests.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary border border-white/30" />
              <span className="text-white/80">Volunteers ({volunteers.length})</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/20 border border-primary/30">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-white/80 font-medium">Mumbai Metropolitan Region</span>
          </div>
        </div>
      </div>

      {/* Allocation Summary Panel */}
      {requests.length > 0 && volunteers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-3 px-3 py-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border text-xs"
        >
          <div className="font-semibold text-foreground mb-1">Coverage Status</div>
          <div className="text-muted-foreground">
            <div>{requests.length} active request{requests.length !== 1 ? "s" : ""}</div>
            <div>{volunteers.filter(v => v.availability === "Available").length} available volunteer{volunteers.filter(v => v.availability === "Available").length !== 1 ? "s" : ""}</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
