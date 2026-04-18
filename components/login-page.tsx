"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap, Globe2 } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

const features = [
  { icon: Sparkles, text: "AI-Powered Matching", color: "text-primary" },
  { icon: Shield, text: "Secure Coordination", color: "text-[oklch(0.68_0.18_145)]" },
  { icon: Zap, text: "Real-time Allocation", color: "text-[oklch(0.78_0.18_75)]" },
  { icon: Globe2, text: "Multi-Region Support", color: "text-[oklch(0.65_0.15_285)]" },
]

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    onLogin()
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.72 0.155 195) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.72 0.155 195) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] pointer-events-none bg-primary"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "20%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] pointer-events-none bg-[oklch(0.65_0.15_285)]"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "20%", right: "15%" }}
      />

      {/* Left side - Hero */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Cpu className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ARAS</h1>
              <p className="text-xs text-muted-foreground">AI Resource Allocation System</p>
            </div>
          </div>

          {/* Hero text */}
          <h2 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6 text-balance">
            Smart Resource
            <br />
            <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.18_220)] to-[oklch(0.65_0.15_285)] bg-clip-text text-transparent">
              Allocation for NGOs
            </span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Connect volunteers with community needs using AI-powered matching. 
            Reduce response time, maximize impact, and coordinate resources intelligently.
          </p>

          {/* Animated features */}
          <div className="flex flex-col gap-3 mb-10">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const isActive = i === activeFeature
              return (
                <motion.div
                  key={feature.text}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-secondary/80 border border-border"
                      : "opacity-50"
                  }`}
                  animate={{ x: isActive ? 10 : 0 }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isActive ? "bg-primary/10" : "bg-transparent"
                  }`}>
                    <Icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {feature.text}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold text-foreground">2.4M+</div>
              <div className="text-xs text-muted-foreground">Volunteers Matched</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">98%</div>
              <div className="text-xs text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-3xl font-bold text-primary">3x</div>
              <div className="text-xs text-muted-foreground">Faster Response</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] shadow-lg shadow-primary/25 mb-4">
              <Cpu className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground text-center text-balance">
              AI Resource Allocation
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Powered by AI for Smart NGO Coordination
            </p>
          </div>

          {/* Card */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-medium text-primary">Secure</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-secondary transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-secondary transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[oklch(0.65_0.18_220)] text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Authenticating...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">
                Demo mode: use any email & password to continue
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Protected by enterprise-grade security
          </p>
        </motion.div>
      </div>
    </div>
  )
}
