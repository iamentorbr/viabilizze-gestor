"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Beaker, Droplets, FlaskConical, Scale, FileText, Info, FileDown } from "lucide-react"
import { formulas, proporcoes, ingredientesRegistro } from "@/lib/formulation-data"
import { drawPdfHeader, drawPdfFooter } from "@/lib/pdf-logo"
import { useClient } from "@/contexts/client-context"

export function ProductionCalculator() {
  const { activeClient } = useClient()
  const [selectedFruta, setSelectedFruta] = useState<string>(formulas[11].fruta) // Caju
  const [quantity, setQuantity] = useState<number>(25000)
  const [productionPercentage, setProductionPercentage] = useState<number>(80)
  const [brixConcentradoInput, setBrixConcentradoInput] = useState<number>(0)
  const [volumeFinal, setVolumeFinal] = useState<number>(1000)

  const currentFormula = useMemo(
    () => formulas.find((f) => f.fruta === selectedFruta) || formulas[0],
    [selectedFruta]
  )

  const currentProporcao = useMemo(
    () => proporcoes.find((p) => p.fruta === selectedFruta),
    [selectedFruta]
  )

  // ── Cálculo principal de insumos ─────────────────────────────
  const calculations = useMemo(() => {
    const factor = quantity / 1000
    const adjustedFactor = (factor * productionPercentage) / 100
    return currentFormula.ingredients.map((ing) => ({
      ...ing,
      totalFull: ing.isQSP ? null : +(ing.per1000L * factor).toFixed(3),
      totalAdjusted: ing.isQSP ? null : +(ing.per1000L * adjustedFactor).toFixed(3),
    }))
  }, [currentFormula, quantity, productionPercentage])

  // ── Cálculo de proporção / diluição ─────────────────────────
  const propCalc = useMemo(() => {
    const brixC = brixConcentradoInput > 0 ? brixConcentradoInput : (currentProporcao?.brixConcentrado ?? 0)
    const brixAlvo = currentProporcao?.brixFinalNectar ?? 11.0
    if (!brixC || brixC <= brixAlvo) return null
    // Regra de mistura simples: Cc * Vc = Cf * Vf
    // Vc / Vf = Cf / Cc  => proporção de concentrado no total
    const fracConcentrado = brixAlvo / brixC
    const fracAgua = 1 - fracConcentrado
    const concVol = +(fracConcentrado * volumeFinal).toFixed(2)
    const aguaVol = +(fracAgua * volumeFinal).toFixed(2)
    const fatorDiluicao = +(fracAgua / fracConcentrado).toFixed(2)
    const percPolpa = +(fracConcentrado * 100).toFixed(1)
    const percLegal = currentProporcao?.percPolpaLegal ?? 0
    const atendeLegisl = percPolpa >= percLegal
    return { brixC, brixAlvo, fracConcentrado, fracAgua, concVol, aguaVol, fatorDiluicao, percPolpa, percLegal, atendeLegisl }
  }, [brixConcentradoInput, currentProporcao, volumeFinal])

  const idealSpecs = useMemo(() => ({
    brix: (((currentFormula.specifications.brixMin + currentFormula.specifications.brixMax) / 2)).toFixed(2),
    acidez: (((currentFormula.specifications.acidezMin + currentFormula.specifications.acidezMax) / 2)).toFixed(3),
    ph: (((currentFormula.specifications.phMin + currentFormula.specifications.phMax) / 2)).toFixed(2),
  }), [currentFormula])

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })

  const exportarPDF = async () => {
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const now = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

    // ── Cabeçalho com logo ───────────────────────────────────────
    let yPos = await drawPdfHeader(doc, "Calculadora de Formulação", now, activeClient)

    // ── Título do produto ────────────────────────────────────────
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`Néctar de ${currentFormula.fruta} — ${currentFormula.tipoProduto}`, 14, yPos)
    yPos += 7

    if (currentFormula.specifications.legislacao) {
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(100, 100, 100)
      doc.text(currentFormula.specifications.legislacao, 14, yPos, { maxWidth: pageWidth - 28 })
      yPos += 8
    }

    // ── Parâmetros de produção ───────────────────────────────────
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Parâmetros de Produção", 14, yPos)
    yPos += 3

    autoTable(doc, {
      startY: yPos,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: "bold" } },
      head: [["Parâmetro", "Valor"]],
      body: [
        ["Volume total a produzir", `${quantity.toLocaleString("pt-BR")} L`],
        ["Percentual de produção", `${productionPercentage}%`],
        ["Volume ajustado (p/ produção)", `${(quantity * productionPercentage / 100).toLocaleString("pt-BR")} L`],
      ],
      margin: { left: 14, right: 14 },
    })

    // ── Tabela de formulação ─────────────────────────────────────
    const afterParams = (doc as any).lastAutoTable.finalY + 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Formulação — Insumos por Lote", 14, afterParams)

    const tableBody = calculations.map((item) => [
      item.name + (item.obs ? ` (${item.obs})` : ""),
      item.unit,
      item.isQSP ? "QSP" : item.per1000L.toFixed(3),
      item.isQSP ? "QSP" : fmt(item.totalFull!),
      item.isQSP ? "QSP" : fmt(item.totalAdjusted!),
    ])

    autoTable(doc, {
      startY: afterParams + 3,
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
      },
      head: [["Insumo", "Unid.", `Por 1.000 L`, `Total (${quantity.toLocaleString("pt-BR")} L)`, `${productionPercentage}% (ajustado)`]],
      body: tableBody,
      margin: { left: 14, right: 14 },
    })

    // ── Especificações físico-químicas ───────────────────────────
    const afterTable = (doc as any).lastAutoTable.finalY + 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Especificações Físico-Químicas do Produto", 14, afterTable)

    const specsBody = [
      ["Brix (°Bx)", String(currentFormula.specifications.brixMin), idealSpecs.brix, String(currentFormula.specifications.brixMax)],
      ["Acidez (g/100 mL)", String(currentFormula.specifications.acidezMin), idealSpecs.acidez, String(currentFormula.specifications.acidezMax)],
      ["pH", String(currentFormula.specifications.phMin), idealSpecs.ph, String(currentFormula.specifications.phMax)],
    ]
    if (currentFormula.specifications.polpaMin !== undefined) {
      specsBody.push(["% Mín. Legal de Polpa", `${currentFormula.specifications.polpaMin}%`, "—", "—"])
    }

    autoTable(doc, {
      startY: afterTable + 3,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center", fillColor: [220, 252, 231] },
        3: { halign: "center" },
      },
      head: [["Parâmetro", "Mínimo", "Ideal", "Máximo"]],
      body: specsBody,
      margin: { left: 14, right: 14 },
    })

    // ── Declaração de ingredientes para rótulo ───────────────────
    const afterSpecs = (doc as any).lastAutoTable.finalY + 8
    const sorted = [...currentFormula.ingredients].sort((a, b) => {
      if (a.isQSP) return 1
      if (b.isQSP) return -1
      return b.per1000L - a.per1000L
    })
    const declaracao = sorted
      .map((ing) => {
        const reg = ingredientesRegistro.find((r) =>
          r.nome.toLowerCase().includes(ing.name.split(" ")[0].toLowerCase()) ||
          ing.name.toLowerCase().includes(r.nome.split(" ")[0].toLowerCase())
        )
        const isAdditivo = reg && !reg.funcao.includes("Principal") && !reg.funcao.includes("Veículo") && !reg.funcao.includes("Ingrediente")
        if (isAdditivo) return `${reg!.funcao}: ${ing.name.split(" (")[0]}${reg?.ins ? ` (${reg.ins})` : ""}`
        if (ing.isQSP) return "Água"
        return ing.name.split(" (")[0]
      })
      .join(", ")

    if (afterSpecs < 260) {
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text("Declaração de Ingredientes (Rótulo)", 14, afterSpecs)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(60, 60, 60)
      doc.text(`INGREDIENTES: ${declaracao}.`, 14, afterSpecs + 6, { maxWidth: pageWidth - 28 })
    }

    // ── Observações ──────────────────────────────────────────────
    if (currentFormula.observacoes) {
      const yObs = (doc as any).lastAutoTable?.finalY
        ? (doc as any).lastAutoTable.finalY + 14
        : afterSpecs + 20
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(120, 120, 120)
      doc.text(`Obs.: ${currentFormula.observacoes}`, 14, yObs, { maxWidth: pageWidth - 28 })
    }

    // ── Rodapé ───────────────────────────────────────────────────
    drawPdfFooter(doc)

    doc.save(`formulacao-nectar-${currentFormula.fruta.toLowerCase().replace(/\s+/g, "-")}-${now.replace(/\//g, "-")}.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Controles superiores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FlaskConical className="h-4 w-4" /> Fruta / Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFruta} onValueChange={setSelectedFruta}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formulas.map((f) => (
                  <SelectItem key={f.fruta} value={f.fruta}>
                    {f.fruta} — {f.tipoProduto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Droplets className="h-4 w-4" /> Quantidade a Produzir (L)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-secondary border-border text-foreground font-mono text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calculator className="h-4 w-4" /> Percentual de Produção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={productionPercentage}
                onChange={(e) => setProductionPercentage(Number(e.target.value))}
                className="bg-secondary border-border text-foreground font-mono text-lg"
                min={1} max={100}
              />
              <span className="text-muted-foreground font-semibold">%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Abas principais */}
      <Tabs defaultValue="formulacao">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="formulacao" className="gap-2">
            <Beaker className="h-4 w-4" /> Formulação
          </TabsTrigger>
          <TabsTrigger value="proporcao" className="gap-2">
            <Scale className="h-4 w-4" /> Cálculo de Proporção
          </TabsTrigger>
          <TabsTrigger value="registro" className="gap-2">
            <FileText className="h-4 w-4" /> Formulação p/ Registro
          </TabsTrigger>
        </TabsList>

        {/* ── ABA: FORMULAÇÃO ─────────────────────────────────────── */}
        <TabsContent value="formulacao">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-primary" />
                      Formulação — Néctar de {currentFormula.fruta}
                    </CardTitle>
                    {currentFormula.specifications.legislacao && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        {currentFormula.specifications.legislacao}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={exportarPDF}
                    className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                    Salvar PDF
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                        <TableHead className="font-semibold">Insumo</TableHead>
                        <TableHead className="text-center font-semibold">Por 1.000 L (kg)</TableHead>
                        <TableHead className="text-center font-semibold">
                          Total ({quantity.toLocaleString("pt-BR")} L)
                        </TableHead>
                        <TableHead className="text-center font-semibold">
                          {productionPercentage}% (kg)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculations.map((item, i) => (
                        <TableRow key={i} className="hover:bg-secondary/30">
                          <TableCell className="font-medium">
                            {item.name}
                            {item.obs && (
                              <span className="ml-1 text-xs text-muted-foreground">({item.obs})</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {item.isQSP ? (
                              <Badge variant="outline" className="border-primary text-primary">QSP</Badge>
                            ) : item.per1000L.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {item.isQSP ? (
                              <Badge variant="outline" className="border-primary text-primary">QSP</Badge>
                            ) : (
                              <span className="text-primary font-semibold">{fmt(item.totalFull!)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {item.isQSP ? (
                              <Badge variant="outline" className="border-primary text-primary">QSP</Badge>
                            ) : (
                              <span className="text-accent font-semibold">{fmt(item.totalAdjusted!)}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {currentFormula.observacoes && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground flex gap-2">
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {currentFormula.observacoes}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Painel de especificações */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Especificações do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Brix (°Bx)",
                    min: currentFormula.specifications.brixMin,
                    max: currentFormula.specifications.brixMax,
                    ideal: idealSpecs.brix,
                  },
                  {
                    label: "Acidez (g/100 mL)",
                    min: currentFormula.specifications.acidezMin,
                    max: currentFormula.specifications.acidezMax,
                    ideal: idealSpecs.acidez,
                  },
                  {
                    label: "pH",
                    min: currentFormula.specifications.phMin,
                    max: currentFormula.specifications.phMax,
                    ideal: idealSpecs.ph,
                  },
                ].map((spec) => (
                  <div key={spec.label} className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">{spec.label}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Mínimo</p>
                        <p className="font-mono text-base font-semibold">{spec.min}</p>
                      </div>
                      <div className="bg-primary/20 rounded-lg p-3 text-center border border-primary/30">
                        <p className="text-xs text-primary mb-1">Ideal</p>
                        <p className="font-mono text-base font-semibold text-primary">{spec.ideal}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Máximo</p>
                        <p className="font-mono text-base font-semibold">{spec.max}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {currentFormula.specifications.polpaMin !== undefined && (
                  <div className="pt-3 border-t border-border">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                      Mín. Legal de Polpa/Suco
                    </Label>
                    <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                      <p className="font-mono text-2xl font-bold text-amber-600">
                        {currentFormula.specifications.polpaMin}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">conforme legislação MAPA</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded bg-primary/30 border border-primary" />
                    <span>QSP = Quantidade Suficiente Para completar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── ABA: CÁLCULO DE PROPORÇÃO ───────────────────────────── */}
        <TabsContent value="proporcao">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Cálculo de Diluição — {selectedFruta}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brixC">Brix do Concentrado / Polpa</Label>
                    <Input
                      id="brixC"
                      type="number"
                      step="0.1"
                      placeholder={String(currentProporcao?.brixConcentrado ?? "")}
                      value={brixConcentradoInput || ""}
                      onChange={(e) => setBrixConcentradoInput(Number(e.target.value))}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Padrão da receita: {currentProporcao?.brixConcentrado ?? "—"}° Brix
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volFinal">Volume Final desejado (L)</Label>
                    <Input
                      id="volFinal"
                      type="number"
                      value={volumeFinal}
                      onChange={(e) => setVolumeFinal(Number(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                </div>

                {propCalc ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-secondary border border-border space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Brix alvo do néctar</span>
                        <span className="font-mono font-semibold">{propCalc.brixAlvo}° Bx</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fator de diluição</span>
                        <span className="font-mono font-semibold">1 : {propCalc.fatorDiluicao}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volume de concentrado</span>
                        <span className="font-mono font-bold text-primary">{propCalc.concVol.toLocaleString("pt-BR")} L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volume de água</span>
                        <span className="font-mono font-bold text-primary">{propCalc.aguaVol.toLocaleString("pt-BR")} L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">% de concentrado no produto</span>
                        <span className="font-mono font-bold">{propCalc.percPolpa}%</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${
                      propCalc.atendeLegisl
                        ? "bg-green-500/10 border-green-500/30 text-green-700"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}>
                      <Info className="h-4 w-4 shrink-0" />
                      {propCalc.atendeLegisl
                        ? `Atende ao mínimo legal de ${propCalc.percLegal}% exigido pela legislação MAPA.`
                        : `NÃO atende ao mínimo legal de ${propCalc.percLegal}%. A proporção calculada (${propCalc.percPolpa}%) está abaixo do exigido.`}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
                    Informe o Brix do concentrado acima para calcular a proporção de diluição.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabela de referência para todas as frutas */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Referência — Todas as Frutas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                        <TableHead className="font-semibold">Fruta</TableHead>
                        <TableHead className="text-center font-semibold">Brix Conc.</TableHead>
                        <TableHead className="text-center font-semibold">Brix Alvo</TableHead>
                        <TableHead className="text-center font-semibold">Mín. Legal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proporcoes.map((p) => (
                        <TableRow
                          key={p.fruta}
                          className={`hover:bg-secondary/30 cursor-pointer ${p.fruta === selectedFruta ? "bg-primary/10" : ""}`}
                          onClick={() => setSelectedFruta(p.fruta)}
                        >
                          <TableCell className="font-medium">{p.fruta}</TableCell>
                          <TableCell className="text-center font-mono">{p.brixConcentrado}°</TableCell>
                          <TableCell className="text-center font-mono">{p.brixFinalNectar}°</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="border-amber-500/50 text-amber-700 font-mono">
                              {p.percPolpaLegal}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── ABA: FORMULAÇÃO PARA REGISTRO ──────────────────────── */}
        <TabsContent value="registro">
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Aditivos e Ingredientes Permitidos — Néctares (Registro MAPA)
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Base: Decreto 6.871/2009 (Bebidas), RDC ANVISA 2/2007 (Aditivos) e IN MAPA 14/2018 (PIQ Néctares).
                  A lista de ingredientes do rótulo deve seguir ordem decrescente de quantidade (m/m).
                </p>
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
                        <TableRow key={i} className="hover:bg-secondary/30 align-top">
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
                          <TableCell className="text-center font-mono text-sm">
                            {ing.ins ?? "—"}
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {ing.limiteMaximo ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {ing.legislacaoPermissao ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-1">
                    <p className="text-sm font-semibold">Declaração de Ingredientes no Rótulo</p>
                    <p className="text-xs text-muted-foreground">
                      A ordem deve ser decrescente por quantidade. Aditivos são declarados pela função tecnológica seguida do nome ou número INS: ex. <em>Acidulante: Ácido Cítrico (INS 330)</em>.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-1">
                    <p className="text-sm font-semibold">BPF — Boas Práticas de Fabricação</p>
                    <p className="text-xs text-muted-foreground">
                      Aditivos com limite "BPF" devem ser usados na quantidade mínima necessária para atingir o efeito tecnológico desejado, sem superar o nível que confira efeito adverso.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
