"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList, Plus, Play, Pause, CheckCircle, Eye } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"
import { EXAMPLE_MARKER } from "@/lib/demo-data"

const statusStyles: Record<string, string> = {
  Concluído: "bg-primary/20 text-primary border-primary/30",
  "Em Produção": "bg-accent/20 text-accent border-accent/30",
  Aguardando: "bg-muted text-muted-foreground border-border",
}

const priorityStyles: Record<string, string> = {
  Urgente: "bg-destructive/20 text-destructive border-destructive/30",
  Alta: "bg-accent/20 text-accent border-accent/30",
  Normal: "bg-muted text-muted-foreground border-border",
  Baixa: "bg-secondary text-secondary-foreground border-border",
}

export default function OrdensPage() {
  const { activeSystemId } = useClient()
  const [orders, setOrders] = useState<ReturnType<typeof getIndustryData>["ordens"]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    setOrders(data.ordens)
  }, [activeSystemId])

  const isExample = (id: string | number) => String(id).startsWith(EXAMPLE_MARKER)

  const aguardando   = orders.filter((o) => o.status === "Aguardando").length
  const emProducao   = orders.filter((o) => o.status === "Em Produção").length
  const concluidos   = orders.filter((o) => o.status === "Concluído").length
  const urgentes     = orders.filter((o) => o.priority === "Urgente").length

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ordens de Produção</h1>
              <p className="text-sm text-muted-foreground">Gerenciamento e acompanhamento de ordens</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Ordem
            </Button>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{aguardando}</p>
                    <p className="text-xs text-muted-foreground">Aguardando</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <Play className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{emProducao}</p>
                    <p className="text-xs text-muted-foreground">Em Produção</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{concluidos}</p>
                    <p className="text-xs text-muted-foreground">Concluídos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                    <ClipboardList className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{urgentes}</p>
                    <p className="text-xs text-muted-foreground">Urgente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Todas as Ordens</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma ordem cadastrada nesta indústria.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Ordem</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={String(order.id)}
                        className={`border-border hover:bg-secondary/30 ${isExample(order.id) ? "opacity-60 italic" : ""}`}
                      >
                        <TableCell className="font-mono font-medium">
                          {order.code}
                          {isExample(order.id) && (
                            <span className="ml-1 text-[10px] font-normal not-italic text-muted-foreground">(exemplo)</span>
                          )}
                        </TableCell>
                        <TableCell>{order.recipe}</TableCell>
                        <TableCell className="text-right font-mono">
                          {order.quantity.toLocaleString("pt-BR")} kg
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={priorityStyles[order.priority]}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.startDate}</TableCell>
                        <TableCell className="text-muted-foreground">{order.operator}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === "Aguardando" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {order.status === "Em Produção" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-accent">
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
