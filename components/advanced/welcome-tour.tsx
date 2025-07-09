"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
  action?: string
}

interface WelcomeTourProps {
  steps: TourStep[]
  onComplete: () => void
  onSkip: () => void
}

export function WelcomeTour({ steps, onComplete, onSkip }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const element = document.querySelector(steps[currentStep]?.target)
    setTargetElement(element as HTMLElement)
  }, [currentStep, steps])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getTooltipPosition = () => {
    if (!targetElement) return { top: 0, left: 0 }

    const rect = targetElement.getBoundingClientRect()
    const position = steps[currentStep].position

    switch (position) {
      case "top":
        return {
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
          transform: "translate(-50%, -100%)",
        }
      case "bottom":
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
          transform: "translate(-50%, 0)",
        }
      case "left":
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
          transform: "translate(-100%, -50%)",
        }
      case "right":
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
          transform: "translate(0, -50%)",
        }
      default:
        return { top: 0, left: 0 }
    }
  }

  if (!steps[currentStep]) return null

  const step = steps[currentStep]
  const tooltipStyle = getTooltipPosition()

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Spotlight */}
      {targetElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
          }}
        />
      )}

      {/* Tooltip */}
      <Card className="fixed z-50 w-80 shadow-xl" style={tooltipStyle}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-blue-100 text-blue-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Tour {currentStep + 1}/{steps.length}
            </Badge>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep ? "bg-blue-500" : "bg-gray-300",
                  )}
                />
              ))}
            </div>

            <Button size="sm" onClick={nextStep} className="bg-blue-500 hover:bg-blue-600">
              {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
