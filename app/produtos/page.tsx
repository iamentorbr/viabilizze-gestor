"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Package, TrendingUp, TrendingDown } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData, updateModule } from "@/lib/industry-store"
import { EXAMPLE_MARKER } from "@/lib/demo-data"

const statusStyles: Record<string, string> = {
  Disponível: "bg-primary/20 text-primary border-primary/30",
  "Baixo Estoque": "bg-accent/20 text-accent border-accent/30",
  Indisponível: "bg-destructive/20 text-destructive border-destructive/30",
}

export default function ProdutosPage() {
  const { activeSystemId } = useClient()
  const [products, setProducts] = useState<ReturnType<typeof getIndustryData>["produtos"]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    setProducts(data.produtos)
  }, [activeSystemId])

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStock   = products.filter((p) => p.status === "Baixo Estoque").length
  const isExample  = (id: string | number) => String(id).startsWith(EXAMPLE_MARKER)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Produtos Acabados</h1>
            <p className="text-sm text-muted-foreground">Estoque de produtos finalizados</p>
          </div>
        </header>
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-xs text-muted-foreground">Produtos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalStock.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">Total em Estoque</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+12%</p>
                    <p className="text-xs text-muted-foreground">vs. Semana Anterior</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <TrendingDown className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{lowStock}</p>
                    <p className="text-xs text-muted-foreground">Baixo Estoque</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Inventário de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum produto cadastrado nesta indústria.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead>Produção</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={String(product.id)}
                        className={`border-border hover:bg-secondary/30 ${isExample(product.id) ? "opacity-60 italic" : ""}`}
                      >
                        <TableCell className="font-mono">{product.code}</TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                          {isExample(product.id) && (
                            <span className="ml-2 text-[10px] font-normal not-italic text-muted-foreground">(exemplo)</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">{product.batch}</TableCell>
                        <TableCell className="text-right font-mono">
                          {product.stock.toLocaleString("pt-BR")} {product.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.production}</TableCell>
                        <TableCell className="text-muted-foreground">{product.validity}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[product.status]}>
                            {product.status}
                          </Badge>
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
