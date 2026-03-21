"use client"

import { useEffect, useState } from "react"
import { WaitingRoom } from "@/components/waiting-room"

export default function Page({
  searchParams,
}: {
  searchParams: { code?: string; email?: string }
}) {
  const [code, setCode] = useState<string | undefined>(searchParams.code)
  const [email, setEmail] = useState<string | undefined>(searchParams.email)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // 🔥 fallback REAL para mobile
    const url = new URL(window.location.href)

    const c = url.searchParams.get("code")
    const e = url.searchParams.get("email")

    if (c) setCode(c)
    if (e) setEmail(e)

    setLoaded(true)
  }, [])

  if (!loaded || !code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  return <WaitingRoom code={code} email={email} />
}