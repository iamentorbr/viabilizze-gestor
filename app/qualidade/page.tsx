"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Beaker, Plus, CheckCircle, XCircle, AlertCircle, Eye, Loader2, Clock, FileText } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { createClient } from "@/lib/supabase/client"
import type { AnaliseQualidade, AnaliseQualidadeInsert, OrdemProducao } from "@/lib/types/calculadora"
import { toast } from "sonner"

export default function QualidadePage() {
  const { activeClient, activeSupabaseId } = useClient()
  const [analises, setAnalises] = useState<AnaliseQualidade[]>([])
  const [ordensDisponiveis, setOrdensDisponiveis] = useState<OrdemProducao[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedAnalise, setSelectedAnalise] = useState<AnaliseQualidade | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [ordemSelecionada, setOrdemSelecionada] = useState<string>("")
  const [brixMedido, setBrixMedido] = useState<string>("")
  const [phMedido, setPhMedido] = useState<string>("")
  const [acidezMedida, setAcidezMedida] = useState<string>("")
  const [analista, setAnalista] = useState<string>("")
  const [observacao, setObservacao] = useState<string>("")

  const supabase = createClient()

  // Carregar análises da empresa
  useEffect(() => {
    async function loadData() {
      if (!activeSupabaseId) return
      setLoading(true)

      const { data: analisesData } = await supabase
        .from("analises_qualidade")
        .select("*")
        .eq("empresa_id", activeSupabaseId)
        .order("created_at", { ascending: false })

      if (analisesData) {
        setAnalises(analisesData)
      }

      const { data: ordensData } = await supabase
        .from("ordens_producao")
        .select("*")
        .eq("empresa_id", activeSupabaseId)
        .eq("status", "Concluído")
        .order("created_at", { ascending: false })

      if (ordensData) {
        setOrdensDisponiveis(ordensData)
      }

      setLoading(false)
    }

    loadData()
  }, [activeSupabaseId])

  function calcularResultado(
    brix: number | undefined, brixMin: number | undefined, brixMax: number | undefined,
    ph: number | undefined, phMin: number | undefined, phMax: number | undefined,
    acidez: number | undefined, acidezMin: number | undefined, acidezMax: number | undefined
  ): 'Aprovado' | 'Ajuste' | 'Reprovado' | 'Aguardando' {
    if (brix === undefined && ph === undefined && acidez === undefined) return 'Aguardando'

    let aprovado = true
    let ajuste = false

    if (brix !== undefined && brixMin !== undefined && brixMax !== undefined) {
      if (brix < brixMin || brix > brixMax) {
        const desvio = brix < brixMin ? brixMin - brix : brix - brixMax
        if (desvio > 1) aprovado = false
        else ajuste = true
      }
    }

    if (ph !== undefined && phMin !== undefined && phMax !== undefined) {
      if (ph < phMin || ph > phMax) {
        const desvio = ph < phMin ? phMin - ph : ph - phMax
        if (desvio > 0.3) aprovado = false
        else ajuste = true
      }
    }

    if (acidez !== undefined && acidezMin !== undefined && acidezMax !== undefined) {
      if (acidez < acidezMin || acidez > acidezMax) aprovado = false
    }

    if (!aprovado) return 'Reprovado'
    if (ajuste) return 'Ajuste'
    return 'Aprovado'
  }

  async function handleCreateAnalise() {
    if (!activeSupabaseId || !ordemSelecionada) {
      toast.error("Selecione uma ordem de produção")
      return
    }

    const ordem = ordensDisponiveis.find(o => o.id === ordemSelecionada)
    if (!ordem) return

    setSaving(true)

    let brixMin, brixMax, phMin, phMax, acidezMin, acidezMax
    if (ordem.formulacao_id) {
      const { data: formulacao } = await supabase
        .from("formulacoes")
        .select("*")
        .eq("id", ordem.formulacao_id)
        .single()

      if (formulacao) {
        brixMin = formulacao.brix_min
        brixMax = formulacao.brix_max
        phMin = formulacao.ph_min
        phMax = formulacao.ph_max
        acidezMin = formulacao.acidez_min
        acidezMax = formulacao.acidez_max
      }
    }

    const brix = brixMedido ? parseFloat(brixMedido) : undefined
    const ph = phMedido ? parseFloat(phMedido) : undefined
    const acidez = acidezMedida ? parseFloat(acidezMedida) : undefined

    const resultado = calcularResultado(brix, brixMin, brixMax, ph, phMin, phMax, acidez, acidezMin, acidezMax)
    const codigo = `AQ-${Date.now().toString(36).toUpperCase()}`

    const novaAnalise: AnaliseQualidadeInsert = {
      empresa_id: activeSupabaseId,
      codigo,
      ordem_id: ordem.id,
      ordem_codigo: ordem.codigo,
      produto: ordem.produto,
      brix_medido: brix,
      brix_min: brixMin,
      brix_max: brixMax,
      ph_medido: ph,
      ph_min: phMin,
      ph_max: phMax,
      acidez_medida: acidez,
      acidez_min: acidezMin,
      acidez_max: acidezMax,
      resultado,
      analista: analista || undefined,
      observacao: observacao || undefined,
      data_analise: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("analises_qualidade")
      .insert(novaAnalise)
      .select()
      .single()

    if (error) {
      toast.error("Erro ao criar análise: " + error.message)
    } else {
      setAnalises([data, ...analises])
      toast.success("Análise registrada com sucesso!")
      resetForm()
      setDialogOpen(false)
    }

    setSaving(false)
  }

  function resetForm() {
    setOrdemSelecionada("")
    setBrixMedido("")
    setPhMedido("")
    setAcidezMedida("")
    setAnalista("")
    setObservacao("")
  }

  function getStatusBadge(resultado: string) {
    switch (resultado) {
      case "Aprovado":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>
      case "Ajuste":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><AlertCircle className="h-3 w-3 mr-1" />Ajuste</Badge>
      case "Reprovado":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Reprovado</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><Clock className="h-3 w-3 mr-1" />Aguardando</Badge>
    }
  }

  function getValorComStatus(valor: number | undefined, min: number | undefined, max: number | undefined) {
    if (valor === undefined) return <span className="text-muted-foreground">-</span>
    const dentroDosLimites = min !== undefined && max !== undefined ? valor >= min && valor <= max : true

    return (
      <span className={dentroDosLimites ? "text-green-400" : "text-red-400"}>
        {valor.toFixed(2)}
        {min !== undefined && max !== undefined && (
          <span className="text-xs text-muted-foreground ml-1">({min}-{max})</span>
        )}
      </span>
    )
  }

  const totalAnalises = analises.length
  const aprovadas = analises.filter(a => a.resultado === 'Aprovado').length
  const ajustes = analises.filter(a => a.resultado === 'Ajuste').length
  const reprovadas = analises.filter(a => a.resultado === 'Reprovado').length
  const taxaAprovacao = totalAnalises > 0 ? ((aprovadas / totalAnalises) * 100).toFixed(1) : "0"

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader 
          title="Controle de Qualidade" 
          description="Análises e verificações de produção"
          actions={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Análise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Registrar Análise de Qualidade</DialogTitle>
                  <DialogDescription>Registre os valores medidos para verificação de conformidade</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Ordem de Produção *</Label>
                    <Select value={ordemSelecionada} onValueChange={setOrdemSelecionada}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ordem concluída" />
                      </SelectTrigger>
                      <SelectContent>
                        {ordensDisponiveis.length === 0 ? (
                          <SelectItem value="none" disabled>Nenhuma ordem concluída disponível</SelectItem>
                        ) : (
                          ordensDisponiveis.map((ordem) => (
                            <SelectItem key={ordem.id} value={ordem.id}>
                              {ordem.codigo} - {ordem.produto}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Brix Medido</Label>
                      <Input type="number" step="0.01" placeholder="Ex: 12.5" value={brixMedido} onChange={(e) => setBrixMedido(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>pH Medido</Label>
                      <Input type="number" step="0.01" placeholder="Ex: 3.8" value={phMedido} onChange={(e) => setPhMedido(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Acidez Medida</Label>
                      <Input type="number" step="0.001" placeholder="Ex: 0.45" value={acidezMedida} onChange={(e) => setAcidezMedida(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Analista</Label>
                    <Input placeholder="Nome do analista" value={analista} onChange={(e) => setAnalista(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea placeholder="Observações adicionais..." value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateAnalise} disabled={saving || !ordemSelecionada}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Registrar Análise
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Análises</CardTitle>
                <Beaker className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAnalises}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aprovadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{aprovadas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ajustes</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{ajustes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reprovadas</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{reprovadas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Aprovação</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taxaAprovacao}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Análises Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : analises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma análise registrada para {activeClient}</p>
                  <p className="text-sm">Clique em &quot;Nova Análise&quot; para registrar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Brix</TableHead>
                      <TableHead>pH</TableHead>
                      <TableHead>Acidez</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analises.map((analise) => (
                      <TableRow key={analise.id}>
                        <TableCell className="font-mono text-sm">{analise.codigo}</TableCell>
                        <TableCell className="font-mono text-sm">{analise.ordem_codigo || "-"}</TableCell>
                        <TableCell className="font-medium">{analise.produto}</TableCell>
                        <TableCell>{getValorComStatus(analise.brix_medido, analise.brix_min, analise.brix_max)}</TableCell>
                        <TableCell>{getValorComStatus(analise.ph_medido, analise.ph_min, analise.ph_max)}</TableCell>
                        <TableCell>{getValorComStatus(analise.acidez_medida, analise.acidez_min, analise.acidez_max)}</TableCell>
                        <TableCell>{getStatusBadge(analise.resultado)}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(analise.data_analise).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedAnalise(analise); setDetailsOpen(true) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Análise</DialogTitle>
              <DialogDescription>{selectedAnalise?.codigo} - {selectedAnalise?.produto}</DialogDescription>
            </DialogHeader>

            {selectedAnalise && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Ordem de Produção</Label>
                    <p className="font-mono">{selectedAnalise.ordem_codigo || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data da Análise</Label>
                    <p>{new Date(selectedAnalise.data_analise).toLocaleString("pt-BR")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">Brix</p>
                    <p className="text-lg font-semibold">{getValorComStatus(selectedAnalise.brix_medido, selectedAnalise.brix_min, selectedAnalise.brix_max)}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">pH</p>
                    <p className="text-lg font-semibold">{getValorComStatus(selectedAnalise.ph_medido, selectedAnalise.ph_min, selectedAnalise.ph_max)}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">Acidez</p>
                    <p className="text-lg font-semibold">{getValorComStatus(selectedAnalise.acidez_medida, selectedAnalise.acidez_min, selectedAnalise.acidez_max)}</p>
                  </Card>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Resultado Final</span>
                  {getStatusBadge(selectedAnalise.resultado)}
                </div>

                {selectedAnalise.analista && (
                  <div>
                    <Label className="text-muted-foreground">Analista</Label>
                    <p>{selectedAnalise.analista}</p>
                  </div>
                )}

                {selectedAnalise.observacao && (
                  <div>
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="text-sm">{selectedAnalise.observacao}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
