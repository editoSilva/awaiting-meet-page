"use client"

import { useEffect, useState } from "react"
import { Stethoscope, Wifi, Clock, CheckCircle2 } from "lucide-react"

interface WaitingRoomProps {
  code?: string
  email?: string
}

export function WaitingRoom({ code, email }: WaitingRoomProps) {
  const [status, setStatus] = useState<"waiting" | "connecting" | "connected">("waiting")
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!code || !email) return
  
    let isConnected = false
  
    //WEBSOCKET
    const ws = new WebSocket(`wss://SEU_DOMINIO/ws/${code}`)
  
    ws.onopen = () => {
      console.log("WS conectado")
      isConnected = true
    }
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
  
      if (data.event === "MODERATOR_JOINED") {
        handleRedirect()
      }
    }
  
    ws.onerror = () => {
      console.log("Erro WS → fallback para polling")
      isConnected = false
    }
  
    ws.onclose = () => {
      isConnected = false
    }
  
    //FUNÇÃO DE REDIRECT
    const handleRedirect = () => {
      setStatus("connecting")
  
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
      audio.play().catch(() => {})
  
      setTimeout(() => {
        setStatus("connected")
  
        setTimeout(() => {
           `https://apimeet.imnd.com.br/j/${code}?email=${email}`
        }, 1000)
      }, 1500)
    }
  
    // POLLING (FALLBACK)
    const interval = setInterval(async () => {
      if (isConnected) return // se WS ativo, não precisa
  
      try {
        const res = await fetch(`https://apimeet.imnd.com.br/meeting/status/${code}`)
        const data = await res.json()
  
        if (data.moderatorJoined) {
          handleRedirect()
        }
      } catch (err) {
        console.log("Erro polling", err)
      }
    }, 3000)
  
    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [code, email])

  const statusMessages = {
    waiting: "Aguardando o médico",
    connecting: "Médico entrou! Conectando",
    connected: "Conectado!",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary/5">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Consultório Online
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Telemedicina</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              {statusMessages[status]}
              {status !== "connected" && <span className="inline-block w-8 text-left">{dots}</span>}
            </h2>
          </div>

          {/* Loader Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer pulse rings */}
              {status === "waiting" && (
                <>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    style={{ animation: "pulse-ring 2s ease-out infinite" }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    style={{ animation: "pulse-ring 2s ease-out infinite 0.5s" }}
                  />
                </>
              )}

              {/* Main spinner container */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                  status === "connected"
                    ? "bg-emerald-500/20"
                    : "bg-primary/10"
                }`}
              >
                {status === "connected" ? (
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                ) : (
                  <>
                    {/* Spinning border */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    {/* Icon */}
                    <div style={{ animation: "float 3s ease-in-out infinite" }}>
                      {status === "waiting" ? (
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      ) : (
                        <Wifi className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-6">
            {status === "waiting"
              ? "Você será conectado automaticamente quando o médico iniciar a consulta"
              : status === "connecting"
              ? "Preparando sua conexão segura..."
              : "Redirecionando para a consulta..."}
          </p>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexão segura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Áudio ativo</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          Sua consulta é protegida por criptografia de ponta a ponta
        </p>
      </div>
    </div>
  )
}
