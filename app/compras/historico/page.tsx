"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Search, ArrowUp, ArrowDown, Factory, Filter } from "lucide-react"

const movements = [
  {
    id: "MOV-001",
    type: "entrada",
    material: "Suco Concentrado de Caju 28° Brix",
    code: "MP-001",
    quantity: 500,
    unit: "kg",
    previousStock: 150,
    newStock: 650,
    reason: "Compra",
    document: "NF-e 45678",
    supplier: "Frutex Ltda",
    date: "20/01/2024 14:30",
    user: "João Silva",
  },
  {
    id: "MOV-002",
    type: "producao",
    material: "Suco Concentrado de Caju 28° Brix",
    code: "MP-001",
    quantity: 1965,
    unit: "kg",
    previousStock: 650,
    newStock: 150,
    reason: "Produção OP-2024-001",
    document: "OP-2024-001",
    date: "20/01/2024 12:00",
    user: "Maria Santos",
  },
  {
    id: "MOV-003",
    type: "entrada",
    material: "Polpa de Manga 14° Brix",
    code: "MP-002",
    quantity: 200,
    unit: "kg",
    previousStock: 120,
    newStock: 320,
    reason: "Compra",
    document: "NF-e 45679",
    supplier: "AgroNorte",
    date: "19/01/2024 10:00",
    user: "João Silva",
  },
  {
    id: "MOV-004",
    type: "saida",
    material: "Goma Xantana",
    code: "MP-006",
    quantity: 5,
    unit: "kg",
    previousStock: 30,
    newStock: 25,
    reason: "Perda - Validade",
    document: "AJ-001",
    date: "18/01/2024 16:00",
    user: "Carlos Mendes",
  },
  {
    id: "MOV-005",
    type: "producao",
    material: "Polpa de Manga 14° Brix",
    code: "MP-002",
    quantity: 1800,
    unit: "kg",
    previousStock: 320,
    newStock: 320,
    reason: "Produção OP-2024-002",
    document: "OP-2024-002",
    date: "20/01/2024 13:00",
    user: "Maria Santos",
  },
  {
    id: "MOV-006",
    type: "entrada",
    material: "Açúcar Líquido 76° Brix",
    code: "MP-005",
    quantity: 1000,
    unit: "kg",
    previousStock: 350,
    newStock: 1350,
    reason: "Compra",
    document: "NF-e 45680",
    supplier: "Açúcar União",
    date: "17/01/2024 09:00",
    user: "João Silva",
  },
  {
    id: "MOV-007",
    type: "saida",
    material: "Aroma Natural de Manga",
    code: "MP-010",
    quantity: 2,
    unit: "kg",
    previousStock: 10,
    newStock: 8,
    reason: "Ajuste de Inventário",
    document: "AJ-002",
    date: "16/01/2024 11:30",
    user: "Ana Costa",
  },
]

const typeStyles: Record<string, { bg: string; text: string; icon: typeof ArrowUp }> = {
  entrada: { bg: "bg-primary/20", text: "text-primary", icon: ArrowUp },
  saida: { bg: "bg-destructive/20", text: "text-destructive", icon: ArrowDown },
  producao: { bg: "bg-accent/20", text: "text-accent", icon: Factory },
}

const typeLabels: Record<string, string> = {
  entrada: "Entrada",
  saida: "Saída",
  producao: "Produção",
}

export default function HistoricoPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.material.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.reason.toLowerCase().includes(search.toLowerCase()) ||
      m.document.toLowerCase().includes(search.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    return matchesSearch && m.type === activeTab
  })

  const stats = {
    entradas: movements.filter(m => m.type === "entrada").length,
    saidas: movements.filter(m => m.type === "saida").length,
    producao: movements.filter(m => m.type === "producao").length,
    total: movements.length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader 
          title="Histórico de Movimentações" 
          description="Registro de entradas, saídas e produções"
        />
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <History className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total (30 dias)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <ArrowUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.entradas}</p>
                    <p className="text-xs text-muted-foreground">Entradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <Factory className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.producao}</p>
                    <p className="text-xs text-muted-foreground">Produção</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                    <ArrowDown className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.saidas}</p>
                    <p className="text-xs text-muted-foreground">Saídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Movimentações
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="entrada">Entradas</TabsTrigger>
                  <TabsTrigger value="producao">Produção</TabsTrigger>
                  <TabsTrigger value="saida">Saídas</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Anterior</TableHead>
                        <TableHead className="text-right">Posterior</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Usuário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovements.map((mov) => {
                        const style = typeStyles[mov.type]
                        const Icon = style.icon
                        return (
                          <TableRow key={mov.id} className="border-border hover:bg-secondary/30">
                            <TableCell className="font-mono">{mov.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${style.bg} ${style.text} border-transparent`}>
                                <Icon className="h-3 w-3 mr-1" />
                                {typeLabels[mov.type]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{mov.material}</p>
                                <p className="text-xs text-muted-foreground">{mov.code}</p>
                              </div>
                            </TableCell>
                            <TableCell className={`text-right font-mono font-semibold ${mov.type === "entrada" ? "text-primary" : mov.type === "saida" ? "text-destructive" : "text-accent"}`}>
                              {mov.type === "entrada" ? "+" : "-"}{mov.quantity} {mov.unit}
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {mov.previousStock} {mov.unit}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {mov.newStock} {mov.unit}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{mov.reason}</TableCell>
                            <TableCell className="font-mono text-sm">{mov.document}</TableCell>
                            <TableCell className="text-muted-foreground">{mov.date}</TableCell>
                            <TableCell className="text-muted-foreground">{mov.user}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
