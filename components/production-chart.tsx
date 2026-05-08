"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function ProductionChart() {
  const { activeSystemId } = useClient()
  const [chartData, setChartData] = useState<{ name: string; producao: number; meta: number }[]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    // Build a week map of total quantities from concluded orders
    const weekMap: Record<string, number> = {}
    DAYS.forEach((d) => { weekMap[d] = 0 })

    data.ordens.forEach((order) => {
      if (order.status === "Concluído") {
        // Parse startDate to weekday index — fallback to distributing evenly
        try {
          const date = new Date(order.startDate)
          if (!isNaN(date.getTime())) {
            const day = DAYS[date.getDay()]
            weekMap[day] = (weekMap[day] || 0) + order.quantity
          }
        } catch {
          // ignore unparseable dates
        }
      }
    })

    // Meta: average of non-zero days or 10% above max
    const values = Object.values(weekMap).filter((v) => v > 0)
    const avg    = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    const meta   = Math.round(avg * 1.1) || 1000

    const built = DAYS.map((name) => ({
      name,
      producao: weekMap[name] ?? 0,
      meta: name === "Dom" ? 0 : meta,
    }))

    setChartData(built)
  }, [activeSystemId])

  const hasData = chartData.some((d) => d.producao > 0)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Produção vs Meta (Semana)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Nenhuma ordem concluída para exibir.
          </p>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [`${value.toLocaleString("pt-BR")} kg`, ""]}
                />
                <Legend />
                <Bar dataKey="producao" name="Produção" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
