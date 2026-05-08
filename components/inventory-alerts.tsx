"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"

export function InventoryAlerts() {
  const { activeSystemId } = useClient()
  const [alerts, setAlerts] = useState<{ name: string; stock: number; minStock: number; unit: string; status: "critical" | "warning" }[]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    const lowStock = data.materiais
      .filter((m) => m.stock < m.minStock)
      .map((m) => ({
        name: m.name,
        stock: m.stock,
        minStock: m.minStock,
        unit: m.unit,
        status: m.stock < m.minStock * 0.8 ? ("critical" as const) : ("warning" as const),
      }))
      .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock))
      .slice(0, 5)
    setAlerts(lowStock)
  }, [activeSystemId])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-accent" />
          Alertas de Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum material abaixo do estoque mínimo.
          </p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    alert.status === "critical" ? "bg-destructive/20" : "bg-accent/20"
                  }`}>
                    <Package className={`h-4 w-4 ${
                      alert.status === "critical" ? "text-destructive" : "text-accent"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{alert.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Atual: {alert.stock} {alert.unit} | Mínimo: {alert.minStock} {alert.unit}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    alert.status === "critical"
                      ? "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-accent/50 bg-accent/10 text-accent"
                  }
                >
                  {alert.status === "critical" ? "Crítico" : "Baixo"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
