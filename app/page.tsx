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
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
      }
    >
      <WaitingRoomContent />
    </Suspense>
  )
}
