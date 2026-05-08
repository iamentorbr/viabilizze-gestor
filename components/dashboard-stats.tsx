"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Factory, TrendingUp, Package, AlertTriangle } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"

export function DashboardStats() {
  const { activeSystemId } = useClient()
  const [stats, setStats] = useState({
    totalOrdens: 0,
    emProducao: 0,
    totalMateriais: 0,
    estoqueBaixo: 0,
    ordensUrgentes: 0,
    totalProdutos: 0,
  })

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    const totalOrdens    = data.ordens.length
    const emProducao     = data.ordens.filter((o) => o.status === "Em Produção").length
    const ordensUrgentes = data.ordens.filter((o) => o.priority === "Urgente").length
    const totalMateriais = data.materiais.length
    const estoqueBaixo   = data.materiais.filter((m) => m.stock < m.minStock).length
    const totalProdutos  = data.produtos.length
    setStats({ totalOrdens, emProducao, totalMateriais, estoqueBaixo, ordensUrgentes, totalProdutos })
  }, [activeSystemId])

  const cards = [
    {
      title: "Ordens de Produção",
      value: String(stats.totalOrdens),
      unit: "ordens",
      change: stats.emProducao > 0 ? `${stats.emProducao} em produção` : "nenhuma em produção",
      trend: stats.emProducao > 0 ? "up" : "neutral",
      icon: Factory,
    },
    {
      title: "Produtos Acabados",
      value: String(stats.totalProdutos),
      unit: "tipos",
      change: "no estoque",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Matérias-Primas",
      value: String(stats.totalMateriais),
      unit: "itens",
      change: stats.estoqueBaixo > 0 ? `${stats.estoqueBaixo} abaixo do mínimo` : "todos em nível normal",
      trend: stats.estoqueBaixo > 0 ? "warning" : "up",
      icon: Package,
    },
    {
      title: "Ordens Urgentes",
      value: String(stats.ordensUrgentes),
      unit: "urgentes",
      change: stats.ordensUrgentes > 0 ? "requerem atenção" : "nenhuma urgência",
      trend: stats.ordensUrgentes > 0 ? "warning" : "up",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.title} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.unit}</span>
                </div>
                <p className={
                  stat.trend === "up"      ? "text-xs text-primary" :
                  stat.trend === "warning" ? "text-xs text-accent"  :
                  "text-xs text-muted-foreground"
                }>
                  {stat.change}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                stat.trend === "warning" ? "bg-accent/20" : "bg-primary/20"
              }`}>
                <stat.icon className={`h-5 w-5 ${stat.trend === "warning" ? "text-accent" : "text-primary"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
