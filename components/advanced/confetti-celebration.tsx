"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [isActive, setIsActive] = useState(false)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
    }>
  >([])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      createParticles()

      const timer = setTimeout(() => {
        setIsActive(false)
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [trigger, isActive, onComplete])

  const createParticles = () => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
    const newParticles = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    setParticles(newParticles)
  }

  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // gravity
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter((particle) => particle.y < window.innerHeight + 50),
      )
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive || typeof window === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>,
    document.body,
  )
}
