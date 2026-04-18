"use client"

import { motion } from "framer-motion"
import { Cpu, LogOut, Bell, Sparkles } from "lucide-react"

interface HeaderProps {
  onLogout: () => void
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] shadow-lg shadow-primary/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Cpu className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground tracking-tight">
              AI Resource Allocation
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              Smart NGO Coordination Platform
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-[oklch(0.65_0.18_220)]/10 border border-primary/25"
          >
            <motion.div
              className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-primary" />
            </motion.div>
            <span className="text-xs font-medium text-primary">AI Engine Active</span>
          </motion.div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <motion.span
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>

          {/* Sign out */}
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary border border-border hover:border-border/80 transition-all text-sm"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Sign out</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
