import { WaitingRoom } from "@/components/waiting-room"

export default function Page({
  searchParams,
}: {
  searchParams: { code?: string; email?: string }
}) {
  return (
    <WaitingRoom
      code={searchParams.code}
      email={searchParams.email}
    />
  )
}