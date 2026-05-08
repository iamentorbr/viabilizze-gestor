"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Scale, Building2, AlertTriangle, FileCheck, Save, FileDown, ShieldCheck } from "lucide-react"
import { drawPdfHeader, drawPdfFooter } from "@/lib/pdf-logo"
import { useClient } from "@/contexts/client-context"

interface InfoLegal {
  id: number
  produto: string
  razaoSocial: string
  cnpj: string
  endereco: string
  sac: string
  registro: string
  ingredientes: string
  alergenos: string[]
  conservacao: string
  preparo: string
  advertencias: string[]
}

const infosLegais: InfoLegal[] = [
  {
    id: 1,
    produto: "Néctar de Caju",
    razaoSocial: "Indústria de Bebidas Integrada LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1000 - Distrito Industrial - Fortaleza/CE - CEP 60000-000",
    sac: "0800 123 4567",
    registro: "MS 3.4567.8901.234-5",
    ingredientes: "Água, polpa de caju, açúcar, ácido cítrico, aroma natural de caju e vitamina C.",
    alergenos: [],
    conservacao: "Após aberto, manter refrigerado e consumir em até 3 dias.",
    preparo: "Agite antes de beber. Sirva gelado.",
    advertencias: ["Contém açúcar"],
  },
  {
    id: 2,
    produto: "Néctar de Manga",
    razaoSocial: "Indústria de Bebidas Integrada LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1000 - Distrito Industrial - Fortaleza/CE - CEP 60000-000",
    sac: "0800 123 4567",
    registro: "MS 3.4567.8901.235-6",
    ingredientes: "Água, polpa de manga, açúcar, ácido cítrico, aroma natural de manga e vitamina A.",
    alergenos: [],
    conservacao: "Após aberto, manter refrigerado e consumir em até 3 dias.",
    preparo: "Agite antes de beber. Sirva gelado.",
    advertencias: ["Contém açúcar"],
  },
  {
    id: 3,
    produto: "Néctar de Goiaba",
    razaoSocial: "Indústria de Bebidas Integrada LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1000 - Distrito Industrial - Fortaleza/CE - CEP 60000-000",
    sac: "0800 123 4567",
    registro: "MS 3.4567.8901.236-7",
    ingredientes: "Água, polpa de goiaba, açúcar, ácido cítrico, aroma natural de goiaba e vitamina C.",
    alergenos: [],
    conservacao: "Após aberto, manter refrigerado e consumir em até 3 dias.",
    preparo: "Agite antes de beber. Sirva gelado.",
    advertencias: ["Contém açúcar"],
  },
  {
    id: 4,
    produto: "Néctar de Maracujá",
    razaoSocial: "Indústria de Bebidas Integrada LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Av. Industrial, 1000 - Distrito Industrial - Fortaleza/CE - CEP 60000-000",
    sac: "0800 123 4567",
    registro: "MS 3.4567.8901.237-8",
    ingredientes: "Água, polpa de maracujá, açúcar, ácido cítrico, aroma natural de maracujá e vitamina C.",
    alergenos: [],
    conservacao: "Após aberto, manter refrigerado e consumir em até 3 dias.",
    preparo: "Agite antes de beber. Sirva gelado.",
    advertencias: ["Contém açúcar"],
  },
]

const alergenosDisponiveis = [
  "Glúten",
  "Leite",
  "Ovos",
  "Amendoim",
  "Soja",
  "Nozes",
  "Castanhas",
  "Sulfitos",
  "Crustáceos",
  "Peixes",
]

export default function InformacoesLegaisPage() {
  const { activeClient } = useClient()
  const [produtoSelecionado, setProdutoSelecionado] = useState<InfoLegal>(infosLegais[0])
  const [infoEditavel, setInfoEditavel] = useState<InfoLegal>(infosLegais[0])

  const handleProdutoChange = (value: string) => {
    const produto = infosLegais.find((p) => p.id.toString() === value)
    if (produto) {
      setProdutoSelecionado(produto)
      setInfoEditavel({ ...produto })
    }
  }

  const handleAlergenoToggle = (alergeno: string) => {
    const newAlergenos = infoEditavel.alergenos.includes(alergeno)
      ? infoEditavel.alergenos.filter((a) => a !== alergeno)
      : [...infoEditavel.alergenos, alergeno]
    setInfoEditavel({ ...infoEditavel, alergenos: newAlergenos })
  }

  const exportarPDF = async () => {
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const now = new Date().toLocaleDateString("pt-BR")

    // Cabeçalho com logo
    let yL = await drawPdfHeader(doc, "Informações Legais do Rótulo — RDC 429/2020", now, activeClient)

    // Título
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(17)
    doc.setFont("helvetica", "bold")
    doc.text(infoEditavel.produto, 14, yL)
    yL += 7

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    doc.text(`Registro MS: ${infoEditavel.registro}`, 14, yL)
    yL += 4

    // Linha divisória laranja
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(14, yL, W - 14, yL)
    yL += 6

    // Dados da empresa
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Dados da Empresa", 14, yL)
    yL += 3

    autoTable(doc, {
      startY: yL,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
      head: [["Campo", "Informação"]],
      body: [
        ["Razão Social", infoEditavel.razaoSocial],
        ["CNPJ", infoEditavel.cnpj],
        ["Endereço", infoEditavel.endereco],
        ["SAC", infoEditavel.sac],
        ["Registro MS", infoEditavel.registro],
      ],
      margin: { left: 14, right: 14 },
    })

    // Composição
    const y1 = doc.lastAutoTable.finalY + 10
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Composição do Produto", 14, y1)

    autoTable(doc, {
      startY: y1 + 4,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
      head: [["Campo", "Informação"]],
      body: [
        ["INGREDIENTES", infoEditavel.ingredientes],
        [
          "ALÉRGENOS",
          infoEditavel.alergenos.length > 0
            ? `ALÉRGICOS: CONTÉM ${infoEditavel.alergenos.join(", ").toUpperCase()}`
            : "NÃO CONTÉM GLÚTEN",
        ],
        ["Conservação", infoEditavel.conservacao],
        ["Modo de Consumo", infoEditavel.preparo],
      ],
      margin: { left: 14, right: 14 },
    })

    // Advertências
    if (infoEditavel.advertencias.length > 0) {
      const y2 = doc.lastAutoTable.finalY + 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("Advertências Obrigatórias", 14, y2)

      autoTable(doc, {
        startY: y2 + 4,
        theme: "grid",
        headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        head: [["Advertência"]],
        body: infoEditavel.advertencias.map((adv) => [adv]),
        margin: { left: 14, right: 14 },
      })
    }

    // Preview do rótulo
    const y3 = doc.lastAutoTable.finalY + 10
    if (y3 < H - 60) {
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("Preview — Texto para o Rótulo", 14, y3)

      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.4)
      doc.rect(14, y3 + 4, W - 28, H - y3 - 24, "S")

      let yText = y3 + 12
      const leftM = 18

      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("INGREDIENTES:", leftM, yText)
      doc.setFont("helvetica", "normal")
      const ingLines = doc.splitTextToSize(infoEditavel.ingredientes, W - 40)
      doc.text(ingLines, leftM, yText + 5)
      yText += 5 + ingLines.length * 4.5

      if (infoEditavel.alergenos.length > 0) {
        yText += 4
        doc.setFont("helvetica", "bold")
        doc.setTextColor(180, 50, 0)
        doc.text(`ALÉRGICOS: CONTÉM ${infoEditavel.alergenos.join(", ").toUpperCase()}`, leftM, yText)
        doc.setTextColor(0, 0, 0)
        yText += 5
      } else {
        yText += 4
        doc.setFont("helvetica", "bold")
        doc.setTextColor(22, 100, 50)
        doc.text("NÃO CONTÉM GLÚTEN", leftM, yText)
        doc.setTextColor(0, 0, 0)
        yText += 5
      }

      yText += 2
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.text("Conservação: ", leftM, yText)
      doc.setFont("helvetica", "normal")
      doc.text(infoEditavel.conservacao, leftM + 24, yText)
      yText += 5
      doc.setFont("helvetica", "bold")
      doc.text("Preparo: ", leftM, yText)
      doc.setFont("helvetica", "normal")
      doc.text(infoEditavel.preparo, leftM + 16, yText)
      yText += 6

      doc.setFont("helvetica", "normal")
      doc.setFontSize(7.5)
      doc.setTextColor(80, 80, 80)
      doc.text(`${infoEditavel.razaoSocial} - CNPJ: ${infoEditavel.cnpj}`, leftM, yText)
      yText += 4
      doc.text(infoEditavel.endereco, leftM, yText, { maxWidth: W - 40 })
      yText += 4
      doc.text(`SAC: ${infoEditavel.sac}  |  Reg. MS: ${infoEditavel.registro}`, leftM, yText)
    }

    drawPdfFooter(doc)

    doc.save(`informacoes-legais-${infoEditavel.produto.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${now.replace(/\//g, "-")}.pdf`)
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader 
          title="Informações Legais" 
          description="Gerencie informações obrigatórias conforme legislação ANVISA"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={exportarPDF}>
                <FileDown className="h-4 w-4" />
                Salvar PDF
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          }
        />
        <div className="p-6 space-y-6">

          {/* Seleção de Produto */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Selecionar Produto</Label>
                  <Select
                    value={produtoSelecionado.id.toString()}
                    onValueChange={handleProdutoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {infosLegais.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.produto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 h-9 px-4">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Conforme RDC 429/2020
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Edição */}
            <div className="space-y-6">
              {/* Dados da Empresa */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Dados da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social</Label>
                    <Input
                      id="razaoSocial"
                      value={infoEditavel.razaoSocial}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, razaoSocial: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={infoEditavel.cnpj}
                        onChange={(e) => setInfoEditavel({ ...infoEditavel, cnpj: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sac">SAC</Label>
                      <Input
                        id="sac"
                        value={infoEditavel.sac}
                        onChange={(e) => setInfoEditavel({ ...infoEditavel, sac: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Textarea
                      id="endereco"
                      value={infoEditavel.endereco}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, endereco: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registro">Registro no MS</Label>
                    <Input
                      id="registro"
                      value={infoEditavel.registro}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, registro: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ingredientes e Alérgenos */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Composição do Produto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredientes">Lista de Ingredientes</Label>
                    <Textarea
                      id="ingredientes"
                      value={infoEditavel.ingredientes}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, ingredientes: e.target.value })
                      }
                      rows={3}
                      placeholder="Liste os ingredientes em ordem decrescente de quantidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alérgenos</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecione os alérgenos presentes no produto
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {alergenosDisponiveis.map((alergeno) => (
                        <div key={alergeno} className="flex items-center space-x-2">
                          <Checkbox
                            id={alergeno}
                            checked={infoEditavel.alergenos.includes(alergeno)}
                            onCheckedChange={() => handleAlergenoToggle(alergeno)}
                          />
                          <Label htmlFor={alergeno} className="text-sm font-normal cursor-pointer">
                            {alergeno}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instruções e Preview */}
            <div className="space-y-6">
              {/* Instruções */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Instruções e Conservação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conservacao">Modo de Conservação</Label>
                    <Textarea
                      id="conservacao"
                      value={infoEditavel.conservacao}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, conservacao: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preparo">Modo de Preparo/Consumo</Label>
                    <Textarea
                      id="preparo"
                      value={infoEditavel.preparo}
                      onChange={(e) =>
                        setInfoEditavel({ ...infoEditavel, preparo: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advertências */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    Advertências Obrigatórias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {infoEditavel.advertencias.map((adv, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 border border-accent/30"
                      >
                        <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm text-foreground">{adv}</span>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Adicionar Advertência
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview do Rótulo Legal */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Preview das Informações</CardTitle>
                  <CardDescription>
                    Visualização das informações legais do rótulo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-lg p-4 bg-background space-y-3 text-sm">
                    <div>
                      <p className="font-bold text-foreground">{infoEditavel.produto}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">INGREDIENTES:</p>
                      <p className="text-muted-foreground">{infoEditavel.ingredientes}</p>
                    </div>
                    {infoEditavel.alergenos.length > 0 && (
                      <div className="p-2 bg-accent/10 rounded border border-accent/30">
                        <p className="font-bold text-accent">
                          ALÉRGICOS: CONTÉM {infoEditavel.alergenos.join(", ").toUpperCase()}
                        </p>
                      </div>
                    )}
                    {infoEditavel.alergenos.length === 0 && (
                      <div className="p-2 bg-primary/10 rounded border border-primary/30">
                        <p className="font-semibold text-primary">NÃO CONTÉM GLÚTEN</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Conservação: </span>
                        {infoEditavel.conservacao}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Preparo: </span>
                        {infoEditavel.preparo}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {infoEditavel.razaoSocial} - CNPJ: {infoEditavel.cnpj}
                      </p>
                      <p className="text-xs text-muted-foreground">{infoEditavel.endereco}</p>
                      <p className="text-xs text-muted-foreground">
                        SAC: {infoEditavel.sac} | Reg. MS: {infoEditavel.registro}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
