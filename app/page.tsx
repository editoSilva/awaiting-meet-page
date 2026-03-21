"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { WaitingRoom } from "@/components/waiting-room"

function WaitingRoomContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code") ?? undefined
  const email = searchParams.get("email") ?? undefined

  return <WaitingRoom code={code} email={email} />
}

export default function Page() {
  return (
  
      <WaitingRoomContent />
  
  )
}
