"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"
import { MiniChart } from "@/components/charts/mini-chart"

interface InsightCardProps {
  data: {
    type: string
    title: string
    insight: string
    chart?: any
    metrics?: any
  }
}

export function InsightCard({ data }: InsightCardProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "correlation":
        return <Activity className="h-4 w-4" />
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      case "comparison":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <PieChart className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "correlation":
        return "bg-purple-100 text-purple-700"
      case "trend":
        return "bg-green-100 text-green-700"
      case "comparison":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            {getInsightIcon(data.type)}
            <span>{data.title}</span>
          </CardTitle>
          <Badge className={getInsightColor(data.type)}>Insight IA</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{data.insight}</p>

        {data.chart && (
          <div className="bg-white rounded-lg p-3 mb-3">
            <MiniChart data={data.chart} />
          </div>
        )}

        {data.metrics && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.metrics).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-900">{value as string}</div>
                <div className="text-xs text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
