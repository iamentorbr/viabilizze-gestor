"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, Edit, AlertTriangle } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"
import { EXAMPLE_MARKER } from "@/lib/demo-data"

function getStockStatus(stock: number, minStock: number) {
  const ratio = stock / minStock
  if (ratio < 0.8) return "critical"
  if (ratio < 1) return "warning"
  return "ok"
}

const statusStyles: Record<string, string> = {
  ok: "bg-primary/20 text-primary border-primary/30",
  warning: "bg-accent/20 text-accent border-accent/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
}

const statusLabels: Record<string, string> = {
  ok: "Normal",
  warning: "Baixo",
  critical: "Crítico",
}

export default function MateriasPrimasPage() {
  const { activeSystemId } = useClient()
  const [materials, setMaterials] = useState<ReturnType<typeof getIndustryData>["materiais"]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    setMaterials(data.materiais)
  }, [activeSystemId])

  const isExample = (id: string | number) => String(id).startsWith(EXAMPLE_MARKER)

  const filtered = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  )

  const criticalCount = materials.filter((m) => getStockStatus(m.stock, m.minStock) === "critical").length
  const warningCount  = materials.filter((m) => getStockStatus(m.stock, m.minStock) === "warning").length
  const normalCount   = materials.length - criticalCount - warningCount

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Matérias-Primas</h1>
              <p className="text-sm text-muted-foreground">Controle de estoque de insumos</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{materials.length}</p>
                    <p className="text-xs text-muted-foreground">Total de Itens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{normalCount}</p>
                    <p className="text-xs text-muted-foreground">Estoque Normal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{warningCount}</p>
                    <p className="text-xs text-muted-foreground">Estoque Baixo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{criticalCount}</p>
                    <p className="text-xs text-muted-foreground">Estoque Crítico</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventário</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar material..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum insumo cadastrado nesta indústria.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Código</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead className="text-right">Mínimo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Preço/kg</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((material) => {
                      const status = getStockStatus(material.stock, material.minStock)
                      return (
                        <TableRow
                          key={String(material.id)}
                          className={`border-border hover:bg-secondary/30 ${isExample(material.id) ? "opacity-60 italic" : ""}`}
                        >
                          <TableCell className="font-mono">{material.code}</TableCell>
                          <TableCell className="font-medium">
                            {material.name}
                            {isExample(material.id) && (
                              <span className="ml-2 text-[10px] font-normal not-italic text-muted-foreground">(exemplo)</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{material.category}</TableCell>
                          <TableCell className="text-right font-mono">
                            {material.stock} {material.unit}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {material.minStock} {material.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusStyles[status]}>
                              {statusLabels[status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            R$ {material.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{material.supplier}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
