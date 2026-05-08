"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"

const statusStyles: Record<string, string> = {
  Concluído:      "bg-primary/20 text-primary border-primary/30",
  "Em Produção":  "bg-accent/20 text-accent border-accent/30",
  Aguardando:     "bg-muted text-muted-foreground border-border",
}

export function RecentProduction() {
  const { activeSystemId } = useClient()
  const [orders, setOrders] = useState<ReturnType<typeof getIndustryData>["ordens"]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    // Show the 5 most recent orders
    setOrders(data.ordens.slice(0, 5))
  }, [activeSystemId])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-primary" />
          Ordens Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma ordem cadastrada nesta indústria.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Ordem</TableHead>
                <TableHead className="text-muted-foreground">Receita</TableHead>
                <TableHead className="text-muted-foreground">Quantidade</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={String(order.id)} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-mono text-sm">{order.code}</TableCell>
                  <TableCell className="font-medium">{order.recipe}</TableCell>
                  <TableCell>{order.quantity.toLocaleString("pt-BR")} kg</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{order.startDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
