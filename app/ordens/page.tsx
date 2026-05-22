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
  Loader2, AlertCircle, Calculator, Trash2, Pause
} from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { createClient } from "@/lib/supabase/client"
import { FormulacaoItem, FormulacaoCompleta, OrdemProducao, OrdemItem, OrdemCompleta } from "@/lib/types/calculadora"
import { toast } from "sonner"

type StatusOrdem = OrdemProducao['status']
type PrioridadeOrdem = OrdemProducao['prioridade']

export default function OrdensPage() {
  const { activeSupabaseId } = useClient()
  const [ordens, setOrdens] = useState<OrdemCompleta[]>([])
  const [formulacoes, setFormulacoes] = useState<FormulacaoCompleta[]>([])
  const [industriaId, setIndustriaId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  
  const [novaOrdemDialogOpen, setNovaOrdemDialogOpen] = useState(false)
  const [viewOrdemDialogOpen, setViewOrdemDialogOpen] = useState(false)
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemCompleta | null>(null)
  const [savingOrdem, setSavingOrdem] = useState(false)
  
  const [novaOrdem, setNovaOrdem] = useState({
    formulacao_id: "",
    volume_programado: 1000,
    percentual_producao: 100,
    prioridade: "normal" as PrioridadeOrdem,
    data_programada: "",
    operador: "",
    observacoes: ""
  })

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    if (!activeSupabaseId) {
      setLoading(false)
      setFormulacoes([])
      setOrdens([])
      return
    }
    
    setLoading(true)
    
    try {
      // Buscar a indústria pelo slug
      const { data: industria, error: indError } = await supabase
        .from("industrias")
        .select("id")
        .eq("slug", activeSupabaseId)
        .single()

      if (indError || !industria) {
        setFormulacoes([])
        setOrdens([])
        setLoading(false)
        return
      }

      setIndustriaId(industria.id)

      // Buscar formulações
      const { data: formulasData, error: formulasError } = await supabase
        .from("formulacoes")
        .select("*")
        .eq("industria_id", industria.id)
        .eq("ativo", true)
        .order("nome")

      if (formulasError) throw formulasError

      const formulaIds = formulasData?.map(f => f.id) || []
      
      let itens: FormulacaoItem[] = []
      if (formulaIds.length > 0) {
        const { data: itensData } = await supabase
          .from("formulacao_itens")
          .select("*")
          .in("formulacao_id", formulaIds)
          .order("ordem_adicao")
        itens = itensData || []
      }

      const formulacoesCompletas: FormulacaoCompleta[] = (formulasData || []).map(f => ({
        ...f,
        itens: itens.filter(i => i.formulacao_id === f.id)
      }))

      setFormulacoes(formulacoesCompletas)

      // Buscar ordens de produção
      const { data: ordensData, error: ordensError } = await supabase
        .from("ordens_producao")
        .select("*")
        .eq("industria_id", industria.id)
        .order("created_at", { ascending: false })

      if (ordensError) throw ordensError

      const ordemIds = ordensData?.map(o => o.id) || []
      
      let ordemItens: OrdemItem[] = []
      if (ordemIds.length > 0) {
        const { data: itensOrdemData } = await supabase
          .from("ordem_itens")
          .select("*")
          .in("ordem_id", ordemIds)
        ordemItens = itensOrdemData || []
      }

      const ordensCompletas: OrdemCompleta[] = (ordensData || []).map(o => ({
        ...o,
        itens: ordemItens.filter(i => i.ordem_id === o.id),
        formulacao: formulacoesCompletas.find(f => f.id === o.formulacao_id)
      }))

      setOrdens(ordensCompletas)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [activeSupabaseId, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const calcularItens = (formulacao: FormulacaoCompleta, volumeLitros: number, percentualProducao: number) => {
    const fator = (volumeLitros / 1000) * (percentualProducao / 100)
    
    return (formulacao.itens || []).map(item => ({
      nome_item: item.nome_item,
      tipo: item.tipo,
      quantidade_calculada: Number(((item.quantidade_por_1000l || 0) * fator).toFixed(3)),
      unidade: item.unidade,
      custo_unitario: null as number | null,
      custo_total: null as number | null
    }))
  }

  const gerarNumeroOrdem = () => {
    const data = new Date()
    const ano = data.getFullYear().toString().slice(-2)
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const seq = String(ordens.length + 1).padStart(3, '0')
    return `OP${ano}${mes}${dia}-${seq}`
  }

  const criarOrdem = async () => {
    if (!novaOrdem.formulacao_id || !industriaId) {
      toast.error("Selecione uma formulação")
      return
    }

    const formulacao = formulacoes.find(f => f.id === novaOrdem.formulacao_id)
    if (!formulacao) {
      toast.error("Formulação não encontrada")
      return
    }

    setSavingOrdem(true)

    try {
      const itensCalculados = calcularItens(
        formulacao, 
        novaOrdem.volume_programado, 
        novaOrdem.percentual_producao
      )

      const custoEstimado = itensCalculados.reduce(
        (acc, i) => acc + (i.custo_total || 0), 
        0
      )

      const { data: ordemData, error: ordemError } = await supabase
        .from("ordens_producao")
        .insert({
          industria_id: industriaId,
          numero_ordem: gerarNumeroOrdem(),
          formulacao_id: novaOrdem.formulacao_id,
          produto_nome: formulacao.nome,
          volume_programado: novaOrdem.volume_programado,
          percentual_producao: novaOrdem.percentual_producao,
          prioridade: novaOrdem.prioridade,
          data_programada: novaOrdem.data_programada || null,
          operador: novaOrdem.operador || null,
          observacoes: novaOrdem.observacoes || null,
          custo_estimado: custoEstimado > 0 ? custoEstimado : null,
          status: "pendente" as StatusOrdem
        })
        .select()
        .single()

      if (ordemError) throw ordemError

      if (itensCalculados.length > 0) {
        const { error: itensError } = await supabase
          .from("ordem_itens")
          .insert(
            itensCalculados.map(i => ({
              ordem_id: ordemData.id,
              nome_item: i.nome_item,
              tipo: i.tipo,
              quantidade_calculada: i.quantidade_calculada,
              unidade: i.unidade,
              custo_unitario: i.custo_unitario,
              custo_total: i.custo_total
            }))
          )

        if (itensError) throw itensError
      }

      toast.success("Ordem de produção criada com sucesso!")
      setNovaOrdemDialogOpen(false)
      setNovaOrdem({
        formulacao_id: "",
        volume_programado: 1000,
        percentual_producao: 100,
        prioridade: "normal",
        data_programada: "",
        operador: "",
        observacoes: ""
      })
      carregarDados()
    } catch (error) {
      console.error("Erro ao criar ordem:", error)
      toast.error("Erro ao criar ordem de produção")
    } finally {
      setSavingOrdem(false)
    }
  }

  const atualizarStatus = async (ordemId: string, novoStatus: StatusOrdem) => {
    const updates: Partial<OrdemProducao> = { status: novoStatus }
    
    if (novoStatus === "em_producao") {
      updates.data_inicio = new Date().toISOString()
    } else if (novoStatus === "concluida") {
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

    toast.success(`Status atualizado para: ${formatarStatus(novoStatus)}`)
    carregarDados()
  }

  const excluirOrdem = async (ordemId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ordem?")) return

    const { error } = await supabase.from("ordens_producao").delete().eq("id", ordemId)

    if (error) {
      toast.error("Erro ao excluir ordem")
      return
    }

    toast.success("Ordem excluída")
    carregarDados()
  }

  const itensPreview = useMemo(() => {
    if (!novaOrdem.formulacao_id) return []
    const formulacao = formulacoes.find(f => f.id === novaOrdem.formulacao_id)
    if (!formulacao) return []
    return calcularItens(formulacao, novaOrdem.volume_programado, novaOrdem.percentual_producao)
  }, [novaOrdem.formulacao_id, novaOrdem.volume_programado, novaOrdem.percentual_producao, formulacoes])

  const ordensFiltradas = ordens.filter(o => {
    const matchSearch = o.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.numero_ordem.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "todos" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    pendente: ordens.filter(o => o.status === "pendente").length,
    emProducao: ordens.filter(o => o.status === "em_producao").length,
    concluida: ordens.filter(o => o.status === "concluida").length
  }

  const formatarStatus = (status: StatusOrdem): string => {
    const labels: Record<StatusOrdem, string> = {
      pendente: "Pendente",
      em_producao: "Em Produção",
      pausada: "Pausada",
      concluida: "Concluída",
      cancelada: "Cancelada"
    }
    return labels[status] || status
  }

  const formatarPrioridade = (prioridade: PrioridadeOrdem): string => {
    const labels: Record<PrioridadeOrdem, string> = {
      baixa: "Baixa",
      normal: "Normal",
      alta: "Alta",
      urgente: "Urgente"
    }
    return labels[prioridade] || prioridade
  }

  const getStatusBadgeVariant = (status: StatusOrdem) => {
    switch (status) {
      case "pendente": return "secondary"
      case "em_producao": return "default"
      case "concluida": return "outline"
      case "pausada": return "secondary"
      case "cancelada": return "destructive"
      default: return "secondary"
    }
  }

  const getPrioridadeBadgeClass = (prioridade: PrioridadeOrdem) => {
    switch (prioridade) {
      case "urgente": return "bg-red-500/20 text-red-600 border-red-500/50"
      case "alta": return "bg-orange-500/20 text-orange-600 border-orange-500/50"
      case "normal": return "bg-blue-500/20 text-blue-600 border-blue-500/50"
      case "baixa": return "bg-gray-500/20 text-gray-600 border-gray-500/50"
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
                            <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={novaOrdem.prioridade}
                        onValueChange={(v) => setNovaOrdem(prev => ({ ...prev, prioridade: v as PrioridadeOrdem }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Volume (Litros) *</Label>
                      <Input
                        type="number"
                        value={novaOrdem.volume_programado}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, volume_programado: Number(e.target.value) }))}
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
                        value={novaOrdem.observacoes}
                        onChange={(e) => setNovaOrdem(prev => ({ ...prev, observacoes: e.target.value }))}
                        placeholder="Observações adicionais"
                        rows={2}
                      />
                    </div>
                  </div>

                  {itensPreview.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Insumos Calculados para {novaOrdem.volume_programado.toLocaleString()}L
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Insumo</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead className="text-right">Quantidade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {itensPreview.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{item.nome_item}</TableCell>
                                <TableCell className="capitalize">{item.tipo}</TableCell>
                                <TableCell className="text-right font-mono">
                                  {item.quantidade_calculada.toFixed(3)} {item.unidade}
                                </TableCell>
                              </TableRow>
                            ))}
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
                <CardDescription>Pendentes</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{stats.pendente}</CardTitle>
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
                <CardTitle className="text-2xl text-green-600">{stats.concluida}</CardTitle>
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
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_producao">Em Produção</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
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
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-mono font-medium">{ordem.numero_ordem}</TableCell>
                      <TableCell>{ordem.produto_nome}</TableCell>
                      <TableCell className="font-mono">{ordem.volume_programado.toLocaleString()}L</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ordem.status)}>
                          {formatarStatus(ordem.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPrioridadeBadgeClass(ordem.prioridade)}>
                          {formatarPrioridade(ordem.prioridade)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ordem.data_programada 
                          ? new Date(ordem.data_programada).toLocaleDateString("pt-BR")
                          : "-"
                        }
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
                          {ordem.status === "pendente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => atualizarStatus(ordem.id, "em_producao")}
                              title="Iniciar Produção"
                            >
                              <Play className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {ordem.status === "em_producao" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => atualizarStatus(ordem.id, "pausada")}
                                title="Pausar"
                              >
                                <Pause className="h-4 w-4 text-yellow-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => atualizarStatus(ordem.id, "concluida")}
                                title="Concluir"
                              >
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              </Button>
                            </>
                          )}
                          {ordem.status === "pausada" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => atualizarStatus(ordem.id, "em_producao")}
                              title="Retomar"
                            >
                              <Play className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {(ordem.status === "pendente" || ordem.status === "cancelada") && (
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
                Ordem {selectedOrdem?.numero_ordem}
              </DialogTitle>
              <DialogDescription>
                Detalhes da ordem de produção
              </DialogDescription>
            </DialogHeader>

            {selectedOrdem && (
              <Tabs defaultValue="itens" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="itens">Insumos</TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                </TabsList>

                <TabsContent value="itens" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Insumo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrdem.itens.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.nome_item}</TableCell>
                          <TableCell className="capitalize">{item.tipo || "-"}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.quantidade_calculada.toFixed(3)} {item.unidade}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="detalhes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Produto</Label>
                      <p className="font-medium">{selectedOrdem.produto_nome}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Volume</Label>
                      <p className="font-medium font-mono">{selectedOrdem.volume_programado.toLocaleString()}L</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p><Badge variant={getStatusBadgeVariant(selectedOrdem.status)}>{formatarStatus(selectedOrdem.status)}</Badge></p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Prioridade</Label>
                      <p><Badge variant="outline" className={getPrioridadeBadgeClass(selectedOrdem.prioridade)}>{formatarPrioridade(selectedOrdem.prioridade)}</Badge></p>
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
                  {selectedOrdem.observacoes && (
                    <div>
                      <Label className="text-muted-foreground">Observações</Label>
                      <p className="text-sm mt-1">{selectedOrdem.observacoes}</p>
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
