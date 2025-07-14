"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Bienvenue sur le Dashboard</h1>
    </div>
  )
}
