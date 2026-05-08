"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Eye, Edit2, Trash2, Tag, Search, FlaskConical, Info, FileText, FileDown } from "lucide-react"
import { formulas, ingredientesRegistro } from "@/lib/formulation-data"
import { drawPdfHeader, drawPdfFooter } from "@/lib/pdf-logo"
import { useClient } from "@/contexts/client-context"

interface Rotulo {
  id: number
  produto: string
  sabor: string
  volume: string
  lote: string
  dataFabricacao: string
  dataValidade: string
  status: "ativo" | "revisao" | "inativo"
  versao: string
}

const rotulosIniciais: Rotulo[] = [
  {
    id: 1,
    produto: "Néctar de Caju",
    sabor: "Caju",
    volume: "1L",
    lote: "LC-2024-001",
    dataFabricacao: "2024-03-15",
    dataValidade: "2024-09-15",
    status: "ativo",
    versao: "1.2",
  },
  {
    id: 2,
    produto: "Néctar de Manga",
    sabor: "Manga",
    volume: "1L",
    lote: "LM-2024-002",
    dataFabricacao: "2024-03-18",
    dataValidade: "2024-09-18",
    status: "ativo",
    versao: "1.1",
  },
  {
    id: 3,
    produto: "Néctar de Goiaba",
    sabor: "Goiaba",
    volume: "500ml",
    lote: "LG-2024-003",
    dataFabricacao: "2024-03-20",
    dataValidade: "2024-09-20",
    status: "revisao",
    versao: "2.0",
  },
  {
    id: 4,
    produto: "Néctar de Maracujá",
    sabor: "Maracujá",
    volume: "1L",
    lote: "LMR-2024-004",
    dataFabricacao: "2024-03-22",
    dataValidade: "2024-09-22",
    status: "ativo",
    versao: "1.0",
  },
]

export default function RotulagemPage() {
  const { activeClient } = useClient()
  const [rotulos, setRotulos] = useState<Rotulo[]>(rotulosIniciais)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [frutaSelecionada, setFrutaSelecionada] = useState<string>(formulas[11].fruta) // Caju
  const [novoRotulo, setNovoRotulo] = useState({
    produto: "",
    sabor: "",
    volume: "",
    lote: "",
    dataFabricacao: "",
    dataValidade: "",
  })

  const now = new Date().toLocaleDateString("pt-BR")

  const exportarRotuloPDF = async (rotulo: Rotulo) => {
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const now = new Date().toLocaleDateString("pt-BR")

    // Cabeçalho com logo
    let yPos = await drawPdfHeader(doc, "Ficha de Rótulo", now, activeClient)

    // Título produto
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(rotulo.produto, 14, yPos)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    doc.text(`Sabor: ${rotulo.sabor}  |  Volume: ${rotulo.volume}  |  Versão: v${rotulo.versao}`, 14, yPos + 7)

    // Dados do rótulo
    const statusLabel = rotulo.status === "ativo" ? "Ativo" : rotulo.status === "revisao" ? "Em Revisão" : "Inativo"
    autoTable(doc, {
      startY: yPos + 13,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 } },
      head: [["Campo", "Informação"]],
      body: [
        ["Produto", rotulo.produto],
        ["Sabor", rotulo.sabor],
        ["Volume", rotulo.volume],
        ["Lote", rotulo.lote],
        ["Data de Fabricação", new Date(rotulo.dataFabricacao).toLocaleDateString("pt-BR")],
        ["Data de Validade", new Date(rotulo.dataValidade).toLocaleDateString("pt-BR")],
        ["Versão", `v${rotulo.versao}`],
        ["Status", statusLabel],
      ],
      margin: { left: 14, right: 14 },
    })

    // Declaração de ingredientes se a fruta existir
    const formula = formulas.find((f) => f.fruta.toLowerCase() === rotulo.sabor.toLowerCase())
    if (formula) {
      const afterTable = doc.lastAutoTable.finalY + 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("Declaração de Ingredientes (conforme rótulo)", 14, afterTable)

      const sorted = [...formula.ingredients].sort((a, b) => {
        if (a.isQSP) return 1
        if (b.isQSP) return -1
        return b.per1000L - a.per1000L
      })
      const declaracao = sorted
        .map((ing) => {
          const reg = ingredientesRegistro.find(
            (r) =>
              r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
              ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
          )
          const isAdditivo =
            reg &&
            !reg.funcao.includes("Principal") &&
            !reg.funcao.includes("Veículo") &&
            !reg.funcao.includes("Ingrediente")
          if (isAdditivo) return `${reg!.funcao}: ${ing.name.split(" (")[0]}${reg?.ins ? ` (${reg.ins})` : ""}`
          if (ing.isQSP) return "Água"
          return ing.name.split(" (")[0]
        })
        .join(", ")

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(40, 40, 40)
      doc.text(`INGREDIENTES: ${declaracao}.`, 14, afterTable + 7, { maxWidth: W - 28 })

      if (formula.specifications.legislacao) {
        const yLeg = afterTable + 20
        doc.setFontSize(8)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(120, 120, 120)
        doc.text(`Ref. legal: ${formula.specifications.legislacao}`, 14, yLeg, { maxWidth: W - 28 })
      }
    }

    drawPdfFooter(doc)
    doc.save(`rotulo-${rotulo.produto.toLowerCase().replace(/\s+/g, "-")}-lote-${rotulo.lote}.pdf`)
  }

  const exportarFormulacaoPDF = async () => {
    const formula = formulas.find((f) => f.fruta === frutaSelecionada)
    if (!formula) return
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()

    // Cabeçalho com logo
    let yFPos = await drawPdfHeader(doc, "Declaração de Ingredientes para Rótulo", now, activeClient)

    // Produto
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`Néctar de ${formula.fruta} — ${formula.tipoProduto}`, 14, yFPos)
    yFPos += 7

    if (formula.specifications.legislacao) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(100, 100, 100)
      doc.text(formula.specifications.legislacao, 14, yFPos, { maxWidth: W - 28 })
      yFPos += 8
    }

    // Tabela de ingredientes ordenados
    const sorted = [...formula.ingredients].sort((a, b) => {
      if (a.isQSP) return 1
      if (b.isQSP) return -1
      return b.per1000L - a.per1000L
    })

    autoTable(doc, {
      startY: yFPos,
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 75 },
        2: { cellWidth: 28, halign: "center" },
        3: { cellWidth: 55 },
      },
      head: [["#", "Ingrediente", "Qtd / 1.000 L", "Função no Rótulo"]],
      body: sorted.map((ing, i) => {
        const reg = ingredientesRegistro.find(
          (r) =>
            r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
            ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
        )
        const funcao = reg
          ? `${reg.funcao}${reg.ins ? ` (${reg.ins})` : ""}`
          : ing.isQSP
          ? "Veículo"
          : "Ingrediente"
        return [
          String(i + 1),
          ing.name + (ing.obs ? ` (${ing.obs})` : ""),
          ing.isQSP ? "QSP" : `${ing.per1000L} ${ing.unit}`,
          funcao,
        ]
      }),
      margin: { left: 14, right: 14 },
    })

    // Declaração sugerida
    const afterTable = doc.lastAutoTable.finalY + 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Declaração sugerida para o rótulo:", 14, afterTable)

    const declaracao = sorted
      .map((ing) => {
        const reg = ingredientesRegistro.find(
          (r) =>
            r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
            ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
        )
        const isAdditivo =
          reg &&
          !reg.funcao.includes("Principal") &&
          !reg.funcao.includes("Veículo") &&
          !reg.funcao.includes("Ingrediente")
        if (isAdditivo) return `${reg!.funcao}: ${ing.name.split(" (")[0]}${reg?.ins ? ` (${reg.ins})` : ""}`
        if (ing.isQSP) return "Água"
        return ing.name.split(" (")[0]
      })
      .join(", ")

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(40, 40, 40)
    doc.text(`INGREDIENTES: ${declaracao}.`, 14, afterTable + 7, { maxWidth: W - 28 })

    drawPdfFooter(doc)
    doc.save(`declaracao-ingredientes-${formula.fruta.toLowerCase().replace(/\s+/g, "-")}-${now.replace(/\//g, "-")}.pdf`)
  }

  const exportarAditivosPDF = async () => {
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()

    // Cabeçalho com logo
    const yAPos = await drawPdfHeader(doc, "Aditivos e Ingredientes Permitidos em Néctares", now, activeClient)

    autoTable(doc, {
      startY: yAPos,
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 45 },
        2: { cellWidth: 22, halign: "center" },
        3: { cellWidth: 32, halign: "center" },
        4: { cellWidth: 80 },
      },
      head: [["Ingrediente / Aditivo", "Função Tecnológica", "INS", "Limite Máximo", "Legislação"]],
      body: ingredientesRegistro.map((ing) => [
        ing.nome,
        ing.funcao,
        ing.ins ?? "—",
        ing.limiteMaximo ?? "—",
        ing.legislacaoPermissao ?? "—",
      ]),
      margin: { left: 14, right: 14 },
    })

    drawPdfFooter(doc)
    doc.save(`aditivos-permitidos-nectares-${now.replace(/\//g, "-")}.pdf`)
  }

  const handleAddRotulo = () => {
    const rotulo: Rotulo = {
      id: rotulos.length + 1,
      ...novoRotulo,
      status: "ativo",
      versao: "1.0",
    }
    setRotulos([...rotulos, rotulo])
    setNovoRotulo({
      produto: "",
      sabor: "",
      volume: "",
      lote: "",
      dataFabricacao: "",
      dataValidade: "",
    })
    setDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Ativo</Badge>
      case "revisao":
        return <Badge className="bg-accent/20 text-accent border-accent/30">Em Revisão</Badge>
      case "inativo":
        return <Badge className="bg-muted text-muted-foreground">Inativo</Badge>
      default:
        return null
    }
  }

  const rotulosFiltrados = rotulos.filter((rotulo) => {
    const matchSearch =
      rotulo.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rotulo.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rotulo.sabor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filtroStatus === "todos" || rotulo.status === filtroStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader 
          title="Rotulagem" 
          description="Gerenciamento de rótulos e etiquetas de produtos"
          actions={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Rótulo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Rótulo</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo rótulo de produto
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="produto">Nome do Produto</Label>
                      <Input
                        id="produto"
                        value={novoRotulo.produto}
                        onChange={(e) => setNovoRotulo({ ...novoRotulo, produto: e.target.value })}
                        placeholder="Ex: Néctar de Caju"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sabor">Sabor</Label>
                      <Select
                        value={novoRotulo.sabor}
                        onValueChange={(value) => setNovoRotulo({ ...novoRotulo, sabor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Caju">Caju</SelectItem>
                          <SelectItem value="Manga">Manga</SelectItem>
                          <SelectItem value="Goiaba">Goiaba</SelectItem>
                          <SelectItem value="Maracujá">Maracujá</SelectItem>
                          <SelectItem value="Acerola">Acerola</SelectItem>
                          <SelectItem value="Uva">Uva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume</Label>
                      <Select
                        value={novoRotulo.volume}
                        onValueChange={(value) => setNovoRotulo({ ...novoRotulo, volume: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200ml">200ml</SelectItem>
                          <SelectItem value="300ml">300ml</SelectItem>
                          <SelectItem value="500ml">500ml</SelectItem>
                          <SelectItem value="1L">1L</SelectItem>
                          <SelectItem value="2L">2L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lote">Lote</Label>
                      <Input
                        id="lote"
                        value={novoRotulo.lote}
                        onChange={(e) => setNovoRotulo({ ...novoRotulo, lote: e.target.value })}
                        placeholder="Ex: LC-2024-001"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                      <Input
                        id="dataFabricacao"
                        type="date"
                        value={novoRotulo.dataFabricacao}
                        onChange={(e) => setNovoRotulo({ ...novoRotulo, dataFabricacao: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataValidade">Data de Validade</Label>
                      <Input
                        id="dataValidade"
                        type="date"
                        value={novoRotulo.dataValidade}
                        onChange={(e) => setNovoRotulo({ ...novoRotulo, dataValidade: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddRotulo}>Criar Rótulo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
        <div className="p-6 space-y-6">
          {/* Abas principais */}
          <Tabs defaultValue="rotulos">
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger value="rotulos" className="gap-2">
                <Tag className="h-4 w-4" /> Rótulos Cadastrados
              </TabsTrigger>
              <TabsTrigger value="formulacao" className="gap-2">
                <FlaskConical className="h-4 w-4" /> Formulação p/ Rótulo
              </TabsTrigger>
              <TabsTrigger value="ingredientes" className="gap-2">
                <FileText className="h-4 w-4" /> Aditivos Permitidos
              </TabsTrigger>
            </TabsList>

            {/* ── ABA: RÓTULOS CADASTRADOS ─── */}
            <TabsContent value="rotulos" className="space-y-6 mt-4">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{rotulos.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Rótulos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {rotulos.filter((r) => r.status === "ativo").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Rótulos Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <Tag className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {rotulos.filter((r) => r.status === "revisao").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Em Revisão</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(rotulos.map((r) => r.sabor)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">Sabores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por produto, lote ou sabor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="revisao">Em Revisão</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Rótulos */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Lista de Rótulos</CardTitle>
              <CardDescription>Gerencie todos os rótulos cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Produto</TableHead>
                    <TableHead className="text-muted-foreground">Sabor</TableHead>
                    <TableHead className="text-muted-foreground">Volume</TableHead>
                    <TableHead className="text-muted-foreground">Lote</TableHead>
                    <TableHead className="text-muted-foreground">Fabricação</TableHead>
                    <TableHead className="text-muted-foreground">Validade</TableHead>
                    <TableHead className="text-muted-foreground">Versão</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotulosFiltrados.map((rotulo) => (
                    <TableRow key={rotulo.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{rotulo.produto}</TableCell>
                      <TableCell className="text-foreground">{rotulo.sabor}</TableCell>
                      <TableCell className="text-foreground">{rotulo.volume}</TableCell>
                      <TableCell className="text-foreground font-mono text-sm">{rotulo.lote}</TableCell>
                      <TableCell className="text-foreground">
                        {new Date(rotulo.dataFabricacao).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(rotulo.dataValidade).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-foreground">v{rotulo.versao}</TableCell>
                      <TableCell>{getStatusBadge(rotulo.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Salvar PDF"
                            onClick={() => exportarRotuloPDF(rotulo)}
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
            </TabsContent>

            {/* ── ABA: FORMULAÇÃO P/ RÓTULO ─── */}
            <TabsContent value="formulacao" className="space-y-6 mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-primary" />
                        Declaração de Ingredientes por Fruta
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Selecione a fruta para ver a lista de ingredientes na ordem correta para declaração no rótulo (ordem decrescente de quantidade).
                      </CardDescription>
                    </div>
                    <Button
                      onClick={exportarFormulacaoPDF}
                      className="shrink-0 gap-2"
                      size="sm"
                    >
                      <FileDown className="h-4 w-4" />
                      Salvar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-xs">
                    <Label htmlFor="frutaRotulo">Fruta / Sabor</Label>
                    <Select value={frutaSelecionada} onValueChange={setFrutaSelecionada}>
                      <SelectTrigger id="frutaRotulo" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formulas.map((f) => (
                          <SelectItem key={f.fruta} value={f.fruta}>
                            {f.fruta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(() => {
                    const formula = formulas.find((f) => f.fruta === frutaSelecionada)
                    if (!formula) return null
                    // Sort: QSP (água) last, rest by per1000L descending
                    const sorted = [...formula.ingredients].sort((a, b) => {
                      if (a.isQSP) return 1
                      if (b.isQSP) return -1
                      return b.per1000L - a.per1000L
                    })
                    return (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                                <TableHead className="w-8 font-semibold">#</TableHead>
                                <TableHead className="font-semibold">Ingrediente</TableHead>
                                <TableHead className="text-center font-semibold">Qtd / 1.000 L</TableHead>
                                <TableHead className="font-semibold">Função no Rótulo</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sorted.map((ing, i) => {
                                const reg = ingredientesRegistro.find((r) =>
                                  r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
                                  ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
                                )
                                return (
                                  <TableRow key={i} className="hover:bg-secondary/30">
                                    <TableCell className="text-muted-foreground font-mono text-sm">{i + 1}</TableCell>
                                    <TableCell className="font-medium">
                                      {ing.name}
                                      {ing.obs && (
                                        <span className="ml-1 text-xs text-muted-foreground">({ing.obs})</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center font-mono">
                                      {ing.isQSP ? (
                                        <Badge variant="outline" className="border-primary text-primary">QSP</Badge>
                                      ) : `${ing.per1000L} ${ing.unit}`}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {reg ? (
                                        <span>
                                          {reg.funcao}
                                          {reg.ins ? ` (${reg.ins})` : ""}
                                        </span>
                                      ) : ing.isQSP ? "Veículo" : "Ingrediente"}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Declaração sugerida */}
                        <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                          <p className="text-sm font-semibold">Declaração sugerida para o rótulo:</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            <strong>INGREDIENTES:</strong>{" "}
                            {sorted.map((ing, i) => {
                              const reg = ingredientesRegistro.find((r) =>
                                r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
                                ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
                              )
                              const isAdditivo = reg && !reg.funcao.includes("Principal") && !reg.funcao.includes("Veículo") && !reg.funcao.includes("Ingrediente")
                              return (
                                <span key={i}>
                                  {i > 0 && ", "}
                                  {isAdditivo
                                    ? `${reg!.funcao}: ${ing.name.split(" (")[0]}${reg?.ins ? ` (${reg.ins})` : ""}`
                                    : ing.isQSP
                                    ? "Água"
                                    : ing.name.split(" (")[0]}
                                </span>
                              )
                            })}
                            {"."}
                          </p>
                        </div>

                        {formula.specifications.legislacao && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <Info className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
                            <span><strong className="text-amber-700">Referência legal:</strong> {formula.specifications.legislacao}</span>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── ABA: ADITIVOS PERMITIDOS ─── */}
            <TabsContent value="ingredientes" className="space-y-6 mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Aditivos e Ingredientes Permitidos — Néctares
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Base: Decreto 6.871/2009, RDC ANVISA 2/2007 e IN MAPA 14/2018. Para uso em formulações registradas junto ao MAPA.
                      </CardDescription>
                    </div>
                    <Button
                      onClick={exportarAditivosPDF}
                      className="shrink-0 gap-2"
                      size="sm"
                    >
                      <FileDown className="h-4 w-4" />
                      Salvar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                          <TableHead className="font-semibold">Ingrediente / Aditivo</TableHead>
                          <TableHead className="font-semibold">Função Tecnológica</TableHead>
                          <TableHead className="text-center font-semibold">INS</TableHead>
                          <TableHead className="text-center font-semibold">Limite Máximo</TableHead>
                          <TableHead className="font-semibold">Legislação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingredientesRegistro.map((ing, i) => (
                          <TableRow key={i} className="hover:bg-secondary/30">
                            <TableCell className="font-medium">{ing.nome}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  ing.funcao.includes("Principal")
                                    ? "border-primary/50 text-primary"
                                    : ing.funcao.includes("Conservador")
                                    ? "border-destructive/50 text-destructive"
                                    : ing.funcao.includes("Edulcorante")
                                    ? "border-amber-500/50 text-amber-700"
                                    : "border-border text-foreground"
                                }
                              >
                                {ing.funcao}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">{ing.ins ?? "—"}</TableCell>
                            <TableCell className="text-center text-sm">{ing.limiteMaximo ?? "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{ing.legislacaoPermissao ?? "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  )
}
