"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ClipboardList, Plus, Play, CheckCircle, Eye, Search, 
  Loader2, AlertCircle, Calculator, Trash2
} from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { createClient } from "@/lib/supabase/client"
import { Insumo, FormulacaoCompleta, OrdemProducao, OrdemInsumo, OrdemCompleta } from "@/lib/types/calculadora"
import { toast } from "sonner"

export default function OrdensPage() {
  const { activeClient } = useClient()
  const [ordens, setOrdens] = useState<OrdemCompleta[]>([])
  const [formulacoes, setFormulacoes] = useState<FormulacaoCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  
  const [novaOrdemDialogOpen, setNovaOrdemDialogOpen] = useState(false)
  const [viewOrdemDialogOpen, setViewOrdemDialogOpen] = useState(false)
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemCompleta | null>(null)
  const [savingOrdem, setSavingOrdem] = useState(false)
  
  const [novaOrdem, setNovaOrdem] = useState({
    formulacao_id: "",
    volume_litros: 1000,
    percentual_producao: 100,
    prioridade: "Normal" as const,
    data_programada: "",
    operador: "",
    observacao: ""
  })

  const carregarDados = useCallback(async () => {
    if (!activeClient) return
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { data: formulasData, error: formulasError } = await supabase
        .from("formulacoes")
        .select("*")
        .eq("empresa_id", activeClient)
        .order("produto")

      if (formulasError) throw formulasError

      const formulaIds = formulasData?.map(f => f.id) || []
      
      let insumos: Insumo[] = []
      if (formulaIds.length > 0) {
        const { data: insumosData } = await supabase
          .from("insumos")
          .select("*")
          .in("formulacao_id", formulaIds)
        insumos = insumosData || []
      }

      const formulacoesCompletas: FormulacaoCompleta[] = (formulasData || []).map(f => ({
        ...f,
        insumos: insumos.filter(i => i.formulacao_id === f.id)
      }))

      setFormulacoes(formulacoesCompletas)

      const { data: ordensData, error: ordensError } = await supabase
        .from("ordens_producao")
        .select("*")
        .eq("empresa_id", activeClient)
        .order("created_at", { ascending: false })

      if (ordensError) throw ordensError

      const ordemIds = ordensData?.map(o => o.id) || []
      
      let ordemInsumos: OrdemInsumo[] = []
      if (ordemIds.length > 0) {
        const { data: insumosOrdemData } = await supabase
          .from("ordem_insumos")
          .select("*")
          .in("ordem_id", ordemIds)
        ordemInsumos = insumosOrdemData || []
      }

      const ordensCompletas: OrdemCompleta[] = (ordensData || []).map(o => ({
        ...o,
        insumos: ordemInsumos.filter(i => i.ordem_id === o.id),
        formulacao: formulacoesCompletas.find(f => f.id === o.formulacao_id)
      }))

      setOrdens(ordensCompletas)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [activeClient])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const calcularInsumos = (formulacao: FormulacaoCompleta, volumeLitros: number, percentualProducao: number) => {
    const fator = (volumeLitros / 1000) * (percentualProducao / 100)
    
    return formulacao.insumos.map(insumo => ({
      nome: insumo.nome,
      tipo: insumo.tipo,
      quantidade: Number((insumo.qtd_base_por_1000L * fator).toFixed(3)),
      unidade: insumo.unidade,
      custo_unitario: insumo.preco_unitario_kg || null,
      custo_total: insumo.preco_unitario_kg 
        ? Number((insumo.preco_unitario_kg * insumo.qtd_base_por_1000L * fator).toFixed(2))
        : null
    }))
  }

  const gerarCodigoOrdem = () => {
    const data = new Date()
    const ano = data.getFullYear().toString().slice(-2)
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const seq = String(ordens.length + 1).padStart(3, '0')
    return `OP${ano}${mes}${dia}-${seq}`
  }

  const criarOrdem = async () => {
    if (!novaOrdem.formulacao_id) {
      toast.error("Selecione uma formulação")
      return
    }

    const formulacao = formulacoes.find(f => f.id === novaOrdem.formulacao_id)
    if (!formulacao) {
      toast.error("Formulação não encontrada")
      return
    }

    setSavingOrdem(true)
    const supabase = createClient()

    try {
      const insumosCalculados = calcularInsumos(
        formulacao, 
        novaOrdem.volume_litros, 
        novaOrdem.percentual_producao
      )

      const custoEstimado = insumosCalculados.reduce(
        (acc, i) => acc + (i.custo_total || 0), 
        0
      )

      const { data: ordemData, error: ordemError } = await supabase
        .from("ordens_producao")
        .insert({
          empresa_id: activeClient,
          codigo: gerarCodigoOrdem(),
          formulacao_id: novaOrdem.formulacao_id,
          produto: formulacao.produto,
          volume_litros: novaOrdem.volume_litros,
          percentual_producao: novaOrdem.percentual_producao,
          prioridade: novaOrdem.prioridade,
          data_programada: novaOrdem.data_programada || null,
          operador: novaOrdem.operador || null,
          observacao: novaOrdem.observacao || null,
          custo_estimado: custoEstimado > 0 ? custoEstimado : null,
          status: "Aguardando"
        })
        .select()
        .single()

      if (ordemError) throw ordemError

      if (insumosCalculados.length > 0) {
        const { error: insumosError } = await supabase
          .from("ordem_insumos")
          .insert(
            insumosCalculados.map(i => ({
              ordem_id: ordemData.id,
              ...i
            }))
          )

        if (insumosError) throw insumosError
      }

      toast.success("Ordem de produção criada com sucesso!")
      setNovaOrdemDialogOpen(false)
      setNovaOrdem({
        formulacao_id: "",
        volume_litros: 1000,
        percentual_producao: 100,
        prioridade: "Normal",
        data_programada: "",
        operador: "",
        observacao: ""
      })
      carregarDados()
    } catch (error) {
      console.error("Erro ao criar ordem:", error)
      toast.error("Erro ao criar ordem de produção")
    } finally {
      setSavingOrdem(false)
    }
  }

  const atualizarStatus = async (ordemId: string, novoStatus: OrdemProducao["status"]) => {
    const supabase = createClient()
    
    const updates: Partial<OrdemProducao> = { status: novoStatus }
    
    if (novoStatus === "Em Produção") {
      updates.data_inicio = new Date().toISOString()
    } else if (novoStatus === "Concluído") {
      updates.data_conclusao = new Date().toISOString()
    }

    const { error } = await supabase
      .from("ordens_producao")
      .update(updates)
      .eq("id", ordemId)

    if (error) {
      toast.error("Erro ao atualizar status")
      return
    }

    toast.success(`Status atualizado para: ${novoStatus}`)
    carregarDados()
  }

  const excluirOrdem = async (ordemId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ordem?")) return

    const supabase = createClient()
    const { error } = await supabase.from("ordens_producao").delete().eq("id", ordemId)

    if (error) {
      toast.error("Erro ao excluir ordem")
      return
    }

    toast.success("Ordem excluída")
    carregarDados()
  }

  const insumosPreview = useMemo(() => {
    if (!novaOrdem.formulacao_id) return []
    const formulacao = formulacoes.find(f => f.id === novaOrdem.formulacao_id)
    if (!formulacao) return []
    return calcularInsumos(formulacao, novaOrdem.volume_litros, novaOrdem.percentual_producao)
  }, [novaOrdem.formulacao_id, novaOrdem.volume_litros, novaOrdem.percentual_producao, formulacoes])

  const ordensFiltradas = ordens.filter(o => {
    const matchSearch = o.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "todos" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    aguardando: ordens.filter(o => o.status === "Aguardando").length,
    emProducao: ordens.filter(o => o.status === "Em Produção").length,
    concluido: ordens.filter(o => o.status === "Concluído").length
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aguardando": return "secondary"
      case "Em Produção": return "default"
      case "Concluído": return "outline"
      case "Cancelado": return "destructive"
      default: return "secondary"
    }
  }

  const getPrioridadeBadgeClass = (prioridade: string) => {
    switch (prioridade) {
      case "Urgente": return "bg-red-500/20 text-red-600 border-red-500/50"
      case "Alta": return "bg-orange-500/20 text-orange-600 border-orange-500/50"
      case "Normal": return "bg-blue-500/20 text-blue-600 border-blue-500/50"
      case "Baixa": return "bg-gray-500/20 text-gray-600 border-gray-500/50"
      default: return ""
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader
          title="Ordens de Produção"
          description="Gerenciamento e acompanhamento de ordens"
          actions={
            <Dialog open={novaOrdemDialogOpen} onOpenChange={setNovaOrdemDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" disabled={formulacoes.length === 0}>
                  <Plus className="h-4 w-4" />
                  Nova Ordem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Ordem de Produção</DialogTitle>
                  <DialogDescription>
                    Selecione uma formulação e defina o volume para calcular os insumos
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Formulação *</Label>
                      <Select
                        value={novaOrdem.formulacao_id}
                        onValueChange={(v) => setNovaOrdem(prev => ({ ...prev, formulacao_id: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a formulação" />
                        </SelectTrigger>
                        <SelectContent>
                          {formulacoes.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.produto}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={novaOrdem.prioridade}
                        onValueChange={(v) => setNovaOrdem(prev => ({ ...prev, prioridade: v as "Baixa" | "Normal" | "Alta" | "Urgente" }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Volume (Litros) *</Label>
                      <Input
                        type="number"
                        value={novaOrdem.volume_litros}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, volume_litros: Number(e.target.value) }))}
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>% Produção</Label>
                      <Input
                        type="number"
                        value={novaOrdem.percentual_producao}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, percentual_producao: Number(e.target.value) }))}
                        min={1}
                        max={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data Programada</Label>
                      <Input
                        type="date"
                        value={novaOrdem.data_programada}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, data_programada: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Operador</Label>
                      <Input
                        value={novaOrdem.operador}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, operador: e.target.value }))}
                        placeholder="Nome do operador"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={novaOrdem.observacao}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, observacao: e.target.value }))}
                        placeholder="Observações adicionais"
                        rows={2}
                      />
                    </div>
                  </div>

                  {insumosPreview.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Insumos Calculados para {novaOrdem.volume_litros}L
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Insumo</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead className="text-right">Quantidade</TableHead>
                              <TableHead className="text-right">Custo Est.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {insumosPreview.map((insumo, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{insumo.nome}</TableCell>
                                <TableCell className="capitalize">{insumo.tipo}</TableCell>
                                <TableCell className="text-right font-mono">
                                  {insumo.quantidade.toFixed(3)} {insumo.unidade}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {insumo.custo_total ? `R$ ${insumo.custo_total.toFixed(2)}` : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={3} className="font-medium">Total Estimado</TableCell>
                              <TableCell className="text-right font-mono font-medium">
                                R$ {insumosPreview.reduce((acc, i) => acc + (i.custo_total || 0), 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setNovaOrdemDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={criarOrdem} disabled={savingOrdem || !novaOrdem.formulacao_id}>
                    {savingOrdem && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Ordem
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de Ordens</CardDescription>
                <CardTitle className="text-2xl">{ordens.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Aguardando</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{stats.aguardando}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Em Produção</CardDescription>
                <CardTitle className="text-2xl text-blue-600">{stats.emProducao}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Concluídas</CardDescription>
                <CardTitle className="text-2xl text-green-600">{stats.concluido}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Em Produção">Em Produção</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : formulacoes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma formulação cadastrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para criar ordens de produção, primeiro cadastre suas formulações na página de Fórmulas.
                </p>
                <Button variant="outline" asChild>
                  <a href="/formulas">Ir para Fórmulas</a>
                </Button>
              </CardContent>
            </Card>
          ) : ordens.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma ordem de produção</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie sua primeira ordem de produção selecionando uma formulação.
                </p>
                <Button onClick={() => setNovaOrdemDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Ordem
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data Prog.</TableHead>
                    <TableHead>Custo Est.</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-mono font-medium">{ordem.codigo}</TableCell>
                      <TableCell>{ordem.produto}</TableCell>
                      <TableCell className="font-mono">{ordem.volume_litros.toLocaleString()}L</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ordem.status)}>
                          {ordem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPrioridadeBadgeClass(ordem.prioridade)}>
                          {ordem.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ordem.data_programada 
                          ? new Date(ordem.data_programada).toLocaleDateString("pt-BR")
                          : "-"
                        }
                      </TableCell>
                      <TableCell className="font-mono">
                        {ordem.custo_estimado ? `R$ ${ordem.custo_estimado.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOrdem(ordem)
                              setViewOrdemDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {ordem.status === "Aguardando" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => atualizarStatus(ordem.id, "Em Produção")}
                              title="Iniciar Produção"
                            >
                              <Play className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {ordem.status === "Em Produção" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => atualizarStatus(ordem.id, "Concluído")}
                              title="Concluir"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {ordem.status === "Aguardando" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => excluirOrdem(ordem.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        <Dialog open={viewOrdemDialogOpen} onOpenChange={setViewOrdemDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Ordem {selectedOrdem?.codigo}
              </DialogTitle>
              <DialogDescription>
                Detalhes da ordem de produção
              </DialogDescription>
            </DialogHeader>

            {selectedOrdem && (
              <Tabs defaultValue="insumos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="insumos">Insumos</TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                </TabsList>

                <TabsContent value="insumos" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Insumo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Custo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrdem.insumos.map((insumo) => (
                        <TableRow key={insumo.id}>
                          <TableCell className="font-medium">{insumo.nome}</TableCell>
                          <TableCell className="capitalize">{insumo.tipo}</TableCell>
                          <TableCell className="text-right font-mono">
                            {insumo.quantidade.toFixed(3)} {insumo.unidade}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {insumo.custo_total ? `R$ ${insumo.custo_total.toFixed(2)}` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3} className="font-medium">Total</TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {selectedOrdem.custo_estimado 
                            ? `R$ ${selectedOrdem.custo_estimado.toFixed(2)}`
                            : "-"
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="detalhes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Produto</Label>
                      <p className="font-medium">{selectedOrdem.produto}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Volume</Label>
                      <p className="font-medium font-mono">{selectedOrdem.volume_litros.toLocaleString()}L</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p><Badge variant={getStatusBadgeVariant(selectedOrdem.status)}>{selectedOrdem.status}</Badge></p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Prioridade</Label>
                      <p><Badge variant="outline" className={getPrioridadeBadgeClass(selectedOrdem.prioridade)}>{selectedOrdem.prioridade}</Badge></p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Operador</Label>
                      <p className="font-medium">{selectedOrdem.operador || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Data Programada</Label>
                      <p className="font-medium">
                        {selectedOrdem.data_programada 
                          ? new Date(selectedOrdem.data_programada).toLocaleDateString("pt-BR")
                          : "-"
                        }
                      </p>
                    </div>
                    {selectedOrdem.data_inicio && (
                      <div>
                        <Label className="text-muted-foreground">Início</Label>
                        <p className="font-medium">
                          {new Date(selectedOrdem.data_inicio).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    )}
                    {selectedOrdem.data_conclusao && (
                      <div>
                        <Label className="text-muted-foreground">Conclusão</Label>
                        <p className="font-medium">
                          {new Date(selectedOrdem.data_conclusao).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedOrdem.observacao && (
                    <div>
                      <Label className="text-muted-foreground">Observações</Label>
                      <p className="text-sm mt-1">{selectedOrdem.observacao}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewOrdemDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
