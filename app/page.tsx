"use client"

import { useEffect, useState } from "react"
import { WaitingRoom } from "@/components/waiting-room"

export default function Page() {
  const [code, setCode] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)

    // 🔥 agora vai aparecer no mobile
    alert("URL: " + url.href)

    setCode(url.searchParams.get("code") ?? undefined)
    setEmail(url.searchParams.get("email") ?? undefined)

    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Código não encontrado
      </div>
    )
  }

  return <WaitingRoom code={code} email={email} />
}