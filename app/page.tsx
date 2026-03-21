"use client"

import { useEffect, useState } from "react"
import { WaitingRoom } from "@/components/waiting-room"

export default function Page() {
  const [code, setCode] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)

    alert(url.href) // debug mobile

    setCode(url.searchParams.get("code") ?? undefined)
    setEmail(url.searchParams.get("email") ?? undefined)

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