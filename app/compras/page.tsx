"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart, Plus, ArrowDown, ArrowUp, Package, AlertTriangle, TrendingDown } from "lucide-react"

// Simulated stock data
const stockItems = [
  { id: 1, name: "Suco Concentrado de Caju 28° Brix", code: "MP-001", stock: 150, minStock: 200, unit: "kg", price: 18.5 },
  { id: 2, name: "Polpa de Manga 14° Brix", code: "MP-002", stock: 320, minStock: 150, unit: "kg", price: 12.0 },
  { id: 3, name: "Polpa de Goiaba 8° Brix", code: "MP-003", stock: 280, minStock: 180, unit: "kg", price: 9.5 },
  { id: 4, name: "Açúcar Líquido 76° Brix", code: "MP-005", stock: 850, minStock: 500, unit: "kg", price: 4.2 },
  { id: 5, name: "Goma Xantana", code: "MP-006", stock: 25, minStock: 30, unit: "kg", price: 85.0 },
  { id: 6, name: "Ácido Ascórbico", code: "MP-007", stock: 40, minStock: 20, unit: "kg", price: 125.0 },
  { id: 7, name: "Aroma Natural de Manga", code: "MP-010", stock: 8, minStock: 10, unit: "kg", price: 295.0 },
]

// Scheduled productions (to calculate projected stock)
const scheduledProductions = [
  { id: "OP-2024-003", recipe: "Néctar de Goiaba", quantity: 30000, date: "21/01/2024", materials: [
    { code: "MP-003", quantity: 4200 },
    { code: "MP-005", quantity: 3900 },
    { code: "MP-006", quantity: 27 },
  ]},
  { id: "OP-2024-004", recipe: "Néctar de Maracujá", quantity: 20000, date: "21/01/2024", materials: [
    { code: "MP-005", quantity: 2800 },
    { code: "MP-006", quantity: 16 },
    { code: "MP-007", quantity: 4 },
  ]},
]

export default function ComprasPage() {
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [quantity, setQuantity] = useState("")
  const [exitReason, setExitReason] = useState("consumo")

  // Calculate projected stock after productions
  const projectedStock = stockItems.map(item => {
    let totalUsage = 0
    scheduledProductions.forEach(prod => {
      const materialUsage = prod.materials.find(m => m.code === item.code)
      if (materialUsage) {
        totalUsage += materialUsage.quantity
      }
    })
    const projected = item.stock - totalUsage
    const needToBuy = projected < item.minStock
    const suggestedPurchase = needToBuy ? Math.ceil((item.minStock - projected) * 1.2) : 0
    return {
      ...item,
      usage: totalUsage,
      projected,
      needToBuy,
      suggestedPurchase,
    }
  })

  const itemsNeedPurchase = projectedStock.filter(i => i.needToBuy).length
  const criticalItems = projectedStock.filter(i => i.projected < 0).length

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestão de Compras</h1>
              <p className="text-sm text-muted-foreground">Baixas, entradas e projeção de estoque</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowDown className="h-4 w-4 text-destructive" />
                    Registrar Baixa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Baixa de Estoque</DialogTitle>
                    <DialogDescription>
                      Registre saídas de materiais por consumo, perda, ajuste ou devolução.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o material" />
                        </SelectTrigger>
                        <SelectContent>
                          {stockItems.map(item => (
                            <SelectItem key={item.id} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantidade (kg)</Label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo</Label>
                      <Select value={exitReason} onValueChange={setExitReason}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumo">Consumo na Produção</SelectItem>
                          <SelectItem value="perda">Perda/Avaria</SelectItem>
                          <SelectItem value="ajuste">Ajuste de Inventário</SelectItem>
                          <SelectItem value="devolucao">Devolução ao Fornecedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setExitDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={() => setExitDialogOpen(false)}>Confirmar Baixa</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Registrar Entrada
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Entrada de Compra</DialogTitle>
                    <DialogDescription>
                      Registre a entrada de materiais recebidos de fornecedores.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o material" />
                        </SelectTrigger>
                        <SelectContent>
                          {stockItems.map(item => (
                            <SelectItem key={item.id} value={item.code}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantidade (kg)</Label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nota Fiscal</Label>
                      <Input placeholder="NF-e 12345" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fornecedor</Label>
                      <Input placeholder="Nome do fornecedor" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEntryDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={() => setEntryDialogOpen(false)}>Confirmar Entrada</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                    <p className="text-2xl font-bold">{stockItems.length}</p>
                    <p className="text-xs text-muted-foreground">Itens em Estoque</p>
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
                    <p className="text-2xl font-bold">{stockItems.filter(i => i.stock < i.minStock).length}</p>
                    <p className="text-xs text-muted-foreground">Estoque Crítico</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{criticalItems}</p>
                    <p className="text-xs text-muted-foreground">Faltará Material</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{itemsNeedPurchase}</p>
                    <p className="text-xs text-muted-foreground">Precisam Compra</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projected Stock Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                Projeção de Estoque (Após Produções Agendadas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Uso Previsto</TableHead>
                    <TableHead className="text-right">Estoque Projetado</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Sugestão de Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectedStock.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-secondary/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right font-mono">{item.stock} {item.unit}</TableCell>
                      <TableCell className="text-right font-mono text-destructive">
                        {item.usage > 0 ? `-${item.usage}` : "0"} {item.unit}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-semibold ${item.projected < item.minStock ? "text-destructive" : "text-primary"}`}>
                        {item.projected} {item.unit}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {item.minStock} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.projected < 0 ? (
                          <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">
                            Faltará
                          </Badge>
                        ) : item.needToBuy ? (
                          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                            Comprar
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                            OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.suggestedPurchase > 0 ? (
                          <span className="font-mono font-semibold text-primary">
                            {item.suggestedPurchase} {item.unit}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Scheduled Productions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Produções Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Ordem</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Materiais Necessários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledProductions.map((prod) => (
                    <TableRow key={prod.id} className="border-border hover:bg-secondary/30">
                      <TableCell className="font-mono font-medium">{prod.id}</TableCell>
                      <TableCell>{prod.recipe}</TableCell>
                      <TableCell className="text-right font-mono">{prod.quantity.toLocaleString("pt-BR")} kg</TableCell>
                      <TableCell className="text-muted-foreground">{prod.date}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {prod.materials.map((m, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {m.code}: {m.quantity}kg
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
