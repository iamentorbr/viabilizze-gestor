"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Calculator, Save, FileDown } from "lucide-react"
import { drawPdfHeader, drawPdfFooter } from "@/lib/pdf-logo"

interface InfoNutricional {
  nutriente: string
  quantidade: number
  unidade: string
  vd: number
}

interface ProdutoNutricional {
  id: number
  nome: string
  porcao: string
  infos: InfoNutricional[]
}

const produtosNutricionais: ProdutoNutricional[] = [
  {
    id: 1,
    nome: "Néctar de Caju",
    porcao: "200ml (1 copo)",
    infos: [
      { nutriente: "Valor Energético", quantidade: 84, unidade: "kcal", vd: 4 },
      { nutriente: "Carboidratos", quantidade: 21, unidade: "g", vd: 7 },
      { nutriente: "Açúcares Totais", quantidade: 19, unidade: "g", vd: 0 },
      { nutriente: "Açúcares Adicionados", quantidade: 10, unidade: "g", vd: 20 },
      { nutriente: "Proteínas", quantidade: 0.2, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Totais", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Saturadas", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Trans", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Fibra Alimentar", quantidade: 0.4, unidade: "g", vd: 2 },
      { nutriente: "Sódio", quantidade: 5, unidade: "mg", vd: 0 },
      { nutriente: "Vitamina C", quantidade: 30, unidade: "mg", vd: 67 },
    ],
  },
  {
    id: 2,
    nome: "Néctar de Manga",
    porcao: "200ml (1 copo)",
    infos: [
      { nutriente: "Valor Energético", quantidade: 92, unidade: "kcal", vd: 5 },
      { nutriente: "Carboidratos", quantidade: 23, unidade: "g", vd: 8 },
      { nutriente: "Açúcares Totais", quantidade: 21, unidade: "g", vd: 0 },
      { nutriente: "Açúcares Adicionados", quantidade: 12, unidade: "g", vd: 24 },
      { nutriente: "Proteínas", quantidade: 0.3, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Totais", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Saturadas", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Trans", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Fibra Alimentar", quantidade: 0.6, unidade: "g", vd: 2 },
      { nutriente: "Sódio", quantidade: 4, unidade: "mg", vd: 0 },
      { nutriente: "Vitamina A", quantidade: 120, unidade: "mcg", vd: 20 },
    ],
  },
  {
    id: 3,
    nome: "Néctar de Goiaba",
    porcao: "200ml (1 copo)",
    infos: [
      { nutriente: "Valor Energético", quantidade: 78, unidade: "kcal", vd: 4 },
      { nutriente: "Carboidratos", quantidade: 19, unidade: "g", vd: 6 },
      { nutriente: "Açúcares Totais", quantidade: 17, unidade: "g", vd: 0 },
      { nutriente: "Açúcares Adicionados", quantidade: 9, unidade: "g", vd: 18 },
      { nutriente: "Proteínas", quantidade: 0.4, unidade: "g", vd: 1 },
      { nutriente: "Gorduras Totais", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Saturadas", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Trans", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Fibra Alimentar", quantidade: 1.2, unidade: "g", vd: 5 },
      { nutriente: "Sódio", quantidade: 3, unidade: "mg", vd: 0 },
      { nutriente: "Vitamina C", quantidade: 45, unidade: "mg", vd: 100 },
    ],
  },
  {
    id: 4,
    nome: "Néctar de Maracujá",
    porcao: "200ml (1 copo)",
    infos: [
      { nutriente: "Valor Energético", quantidade: 88, unidade: "kcal", vd: 4 },
      { nutriente: "Carboidratos", quantidade: 22, unidade: "g", vd: 7 },
      { nutriente: "Açúcares Totais", quantidade: 20, unidade: "g", vd: 0 },
      { nutriente: "Açúcares Adicionados", quantidade: 11, unidade: "g", vd: 22 },
      { nutriente: "Proteínas", quantidade: 0.3, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Totais", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Saturadas", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Gorduras Trans", quantidade: 0, unidade: "g", vd: 0 },
      { nutriente: "Fibra Alimentar", quantidade: 0.8, unidade: "g", vd: 3 },
      { nutriente: "Sódio", quantidade: 6, unidade: "mg", vd: 0 },
      { nutriente: "Vitamina C", quantidade: 20, unidade: "mg", vd: 44 },
    ],
  },
]

export default function TabelaNutricionalPage() {
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoNutricional>(produtosNutricionais[0])
  const [infosEditaveis, setInfosEditaveis] = useState<InfoNutricional[]>(produtosNutricionais[0].infos)

  const handleProdutoChange = (value: string) => {
    const produto = produtosNutricionais.find((p) => p.id.toString() === value)
    if (produto) {
      setProdutoSelecionado(produto)
      setInfosEditaveis([...produto.infos])
    }
  }

  const handleInfoChange = (index: number, field: keyof InfoNutricional, value: string | number) => {
    const newInfos = [...infosEditaveis]
    newInfos[index] = { ...newInfos[index], [field]: value }
    setInfosEditaveis(newInfos)
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
    let yN = await drawPdfHeader(doc, "Tabela Nutricional — RDC 429/2020 ANVISA", now)

    // Título do produto
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(17)
    doc.setFont("helvetica", "bold")
    doc.text(produtoSelecionado.nome, 14, yN)
    yN += 7
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    doc.text(`Porção: ${produtoSelecionado.porcao}`, 14, yN)
    yN += 4

    // Linha divisória
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(14, yN, W - 14, yN)
    yN += 6

    // Tabela nutricional principal
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("INFORMAÇÃO NUTRICIONAL", 14, yN)
    yN += 3

    autoTable(doc, {
      startY: yN,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: "right" },
        2: { cellWidth: 30, halign: "right" },
      },
      head: [["Nutriente", `Quantidade (${produtoSelecionado.porcao})`, "%VD*"]],
      body: infosEditaveis.map((info) => [
        info.nutriente,
        `${info.quantidade} ${info.unidade}`,
        info.vd > 0 ? `${info.vd}%` : "-",
      ]),
      margin: { left: 14, right: 14 },
    })

    const afterMain = doc.lastAutoTable.finalY + 6
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(100, 100, 100)
    doc.text("*Percentual de Valores Diários fornecidos pela porção, com base em uma dieta de 2.000 kcal ou 8.400 kJ. Seus valores diários podem ser maiores ou menores dependendo de suas necessidades energéticas.", 14, afterMain, { maxWidth: W - 28 })

    // Comparativo
    if (afterMain + 50 < H - 20) {
      const yComp = afterMain + 14
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("Comparativo entre Néctares (por porção de 200 ml)", 14, yComp)

      autoTable(doc, {
        startY: yComp + 4,
        theme: "striped",
        headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        head: [
          [
            "Nutriente",
            ...produtosNutricionais.map((p) => p.nome.replace("Néctar de ", "")),
          ],
        ],
        body: produtosNutricionais[0].infos.map((info) => [
          info.nutriente,
          ...produtosNutricionais.map((p) => {
            const v = p.infos.find((i) => i.nutriente === info.nutriente)
            return v ? `${v.quantidade} ${v.unidade}` : "-"
          }),
        ]),
        margin: { left: 14, right: 14 },
      })
    }

    drawPdfFooter(doc)

    doc.save(`tabela-nutricional-${produtoSelecionado.nome.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${now.replace(/\//g, "-")}.pdf`)
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tabela Nutricional</h1>
              <p className="text-muted-foreground">Gerencie as informações nutricionais dos produtos</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={exportarPDF}>
                <FileDown className="h-4 w-4" />
                Salvar PDF
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>

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
                      {produtosNutricionais.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Porção</Label>
                  <Input value={produtoSelecionado.porcao} className="w-48" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor de Tabela */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Editor de Valores
                </CardTitle>
                <CardDescription>Edite os valores nutricionais do produto</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Nutriente</TableHead>
                      <TableHead className="text-muted-foreground text-right">Quantidade</TableHead>
                      <TableHead className="text-muted-foreground text-right">%VD*</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infosEditaveis.map((info, index) => (
                      <TableRow key={info.nutriente} className="border-border">
                        <TableCell className="text-foreground font-medium">{info.nutriente}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Input
                              type="number"
                              value={info.quantidade}
                              onChange={(e) =>
                                handleInfoChange(index, "quantidade", parseFloat(e.target.value) || 0)
                              }
                              className="w-20 text-right h-8"
                            />
                            <span className="text-muted-foreground text-sm w-8">{info.unidade}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={info.vd}
                            onChange={(e) =>
                              handleInfoChange(index, "vd", parseInt(e.target.value) || 0)
                            }
                            className="w-16 text-right h-8"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Preview da Tabela Nutricional */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Preview do Rótulo
                </CardTitle>
                <CardDescription>Visualização conforme RDC 429/2020 da ANVISA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-foreground rounded-lg p-4 bg-background max-w-sm mx-auto">
                  <div className="text-center border-b-2 border-foreground pb-2 mb-2">
                    <h3 className="font-bold text-lg text-foreground">INFORMAÇÃO NUTRICIONAL</h3>
                    <p className="text-sm text-foreground">Porção de {produtoSelecionado.porcao}</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground">
                        <th className="text-left py-1 text-foreground"></th>
                        <th className="text-right py-1 text-foreground">100ml</th>
                        <th className="text-right py-1 text-foreground">%VD*</th>
                      </tr>
                    </thead>
                    <tbody>
                      {infosEditaveis.map((info) => (
                        <tr key={info.nutriente} className="border-b border-border">
                          <td className="py-1 text-foreground">{info.nutriente}</td>
                          <td className="text-right py-1 text-foreground">
                            {info.quantidade}
                            {info.unidade}
                          </td>
                          <td className="text-right py-1 text-foreground">
                            {info.vd > 0 ? `${info.vd}%` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Percentual de valores diários fornecidos pela porção.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparativo entre produtos */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Comparativo entre Produtos</CardTitle>
              <CardDescription>Compare os valores nutricionais entre todos os néctares</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Nutriente</TableHead>
                    {produtosNutricionais.map((p) => (
                      <TableHead key={p.id} className="text-muted-foreground text-center">
                        {p.nome.replace("Néctar de ", "")}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosNutricionais[0].infos.map((info) => (
                    <TableRow key={info.nutriente} className="border-border">
                      <TableCell className="text-foreground font-medium">{info.nutriente}</TableCell>
                      {produtosNutricionais.map((p) => {
                        const valor = p.infos.find((i) => i.nutriente === info.nutriente)
                        return (
                          <TableCell key={p.id} className="text-center text-foreground">
                            {valor?.quantidade}
                            {valor?.unidade}
                          </TableCell>
                        )
                      })}
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
