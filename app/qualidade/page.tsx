"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Beaker, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"
import { EXAMPLE_MARKER } from "@/lib/demo-data"

function checkValue(value: number, spec: { min: number; max: number }) {
  if (value >= spec.min && value <= spec.max) return "ok"
  if (value < spec.min * 0.95 || value > spec.max * 1.05) return "critical"
  return "warning"
}

const resultStyles: Record<string, string> = {
  Aprovado: "bg-primary/20 text-primary border-primary/30",
  Reprovado: "bg-destructive/20 text-destructive border-destructive/30",
  Ajuste: "bg-accent/20 text-accent border-accent/30",
}

const valueStyles: Record<string, string> = {
  ok: "text-primary",
  warning: "text-accent",
  critical: "text-destructive",
}

export default function QualidadePage() {
  const { activeSystemId } = useClient()
  const [analyses, setAnalyses] = useState<ReturnType<typeof getIndustryData>["analises"]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    setAnalyses(data.analises)
  }, [activeSystemId])

  const isExample = (id: string | number) => String(id).startsWith(EXAMPLE_MARKER)

  const aprovados  = analyses.filter((a) => a.result === "Aprovado").length
  const ajustes    = analyses.filter((a) => a.result === "Ajuste").length
  const reprovados = analyses.filter((a) => a.result === "Reprovado").length

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Controle de Qualidade</h1>
              <p className="text-sm text-muted-foreground">Análises e verificações de produção</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Análise
            </Button>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{aprovados}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <AlertCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ajustes}</p>
                    <p className="text-xs text-muted-foreground">Ajustes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{reprovados}</p>
                    <p className="text-xs text-muted-foreground">Reprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Histórico de Análises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyses.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma análise cadastrada nesta indústria.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Análise</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead className="text-center">Brix</TableHead>
                      <TableHead className="text-center">Acidez</TableHead>
                      <TableHead className="text-center">pH</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Analista</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow
                        key={String(analysis.id)}
                        className={`border-border hover:bg-secondary/30 ${isExample(analysis.id) ? "opacity-60 italic" : ""}`}
                      >
                        <TableCell className="font-mono font-medium">
                          {isExample(analysis.id) ? "AN-EXEMPLO-001" : String(analysis.id)}
                          {isExample(analysis.id) && (
                            <span className="ml-1 text-[10px] font-normal not-italic text-muted-foreground">(exemplo)</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">{analysis.order}</TableCell>
                        <TableCell>{analysis.recipe}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono font-medium ${valueStyles[checkValue(analysis.brix, analysis.brixSpec)]}`}>
                            {analysis.brix.toFixed(2)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {analysis.brixSpec.min} - {analysis.brixSpec.max}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono font-medium ${valueStyles[checkValue(analysis.acidez, analysis.acidezSpec)]}`}>
                            {analysis.acidez.toFixed(2)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {analysis.acidezSpec.min} - {analysis.acidezSpec.max}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono font-medium ${valueStyles[checkValue(analysis.ph, analysis.phSpec)]}`}>
                            {analysis.ph.toFixed(2)}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {analysis.phSpec.min} - {analysis.phSpec.max}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={resultStyles[analysis.result]}>
                            {analysis.result}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{analysis.date}</TableCell>
                        <TableCell className="text-muted-foreground">{analysis.analyst}</TableCell>
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
