"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />
}
