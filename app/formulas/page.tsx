"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FlaskConical, Plus, Edit, Trash2, Eye, Upload, Search, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { createClient } from "@/lib/supabase/client"
import { Formulacao, Insumo, FormulacaoCompleta } from "@/lib/types/calculadora"
import { PlanilhaUpload } from "@/components/planilha-upload"
import { toast } from "sonner"

export default function FormulasPage() {
  const { activeSupabaseId } = useClient()
  const [formulacoes, setFormulacoes] = useState<FormulacaoCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFormulacao, setSelectedFormulacao] = useState<FormulacaoCompleta | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const carregarFormulacoes = useCallback(async () => {
    if (!activeSupabaseId) return
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      // Buscar formulações da empresa
      const { data: formulas, error: formulasError } = await supabase
        .from("formulacoes")
        .select("*")
        .eq("empresa_id", activeSupabaseId)
        .order("produto")

      if (formulasError) throw formulasError

      // Buscar insumos de todas as formulações
      const formulaIds = formulas?.map(f => f.id) || []
      
      let insumos: Insumo[] = []
      if (formulaIds.length > 0) {
        const { data: insumosData, error: insumosError } = await supabase
          .from("insumos")
          .select("*")
          .in("formulacao_id", formulaIds)
          .order("nome")

        if (insumosError) throw insumosError
        insumos = insumosData || []
      }

      // Combinar formulações com seus insumos
      const formulacoesCompletas: FormulacaoCompleta[] = (formulas || []).map(f => ({
        ...f,
        insumos: insumos.filter(i => i.formulacao_id === f.id)
      }))

      setFormulacoes(formulacoesCompletas)
    } catch (error) {
      console.error("Erro ao carregar formulações:", error)
      toast.error("Erro ao carregar formulações")
    } finally {
      setLoading(false)
    }
  }, [activeSupabaseId])

  useEffect(() => {
    carregarFormulacoes()
  }, [carregarFormulacoes])

  const excluirFormulacao = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta formulação? Esta ação não pode ser desfeita.")) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("formulacoes").delete().eq("id", id)

    if (error) {
      toast.error("Erro ao excluir formulação")
      return
    }

    toast.success("Formulação excluída com sucesso")
    carregarFormulacoes()
  }

  const formulacoesFiltradas = formulacoes.filter(f =>
    f.produto.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false)
    carregarFormulacoes()
    toast.success("Formulações importadas com sucesso!")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader
          title="Fórmulas e Receitas"
          description="Gerenciamento de formulações de produtos"
          actions={
            <div className="flex gap-2">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Planilha
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Importar Formulações</DialogTitle>
                    <DialogDescription>
                      Faça upload de uma planilha Excel ou CSV com suas formulações
                    </DialogDescription>
                  </DialogHeader>
                  <PlanilhaUpload onSuccess={handleUploadSuccess} />
                </DialogContent>
              </Dialog>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Fórmula
              </Button>
            </div>
          }
        />

        <div className="p-6 space-y-6">
          {/* Barra de busca */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar formulação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {formulacoes.length} formulações cadastradas
            </Badge>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : formulacoes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma formulação cadastrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Importe uma planilha com suas formulações ou crie uma nova manualmente.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Planilha
                  </Button>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Fórmula
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formulacoesFiltradas.map((formulacao) => (
                <Card key={formulacao.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{formulacao.produto}</CardTitle>
                          <p className="text-xs text-muted-foreground capitalize">
                            {formulacao.categoria || "Néctar"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                        Ativo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Insumos</p>
                          <p className="font-medium">{formulacao.insumos.length} itens</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Brix</p>
                          <p className="font-medium font-mono">
                            {formulacao.brix_ideal ? `${formulacao.brix_ideal}°` : "-"}
                          </p>
                        </div>
                      </div>
                      {formulacao.perc_suco_minimo_legal && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Suco Mínimo Legal</p>
                          <p className="font-medium">{formulacao.perc_suco_minimo_legal}%</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => {
                            setSelectedFormulacao(formulacao)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => excluirFormulacao(formulacao.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dialog de visualização */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                {selectedFormulacao?.produto}
              </DialogTitle>
              <DialogDescription>
                Detalhes da formulação e lista de insumos
              </DialogDescription>
            </DialogHeader>

            {selectedFormulacao && (
              <Tabs defaultValue="insumos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="insumos">Insumos</TabsTrigger>
                  <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
                </TabsList>

                <TabsContent value="insumos" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Insumo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Qtd/1000L</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead className="text-right">Brix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFormulacao.insumos.map((insumo) => (
                        <TableRow key={insumo.id}>
                          <TableCell className="font-medium">
                            {insumo.nome}
                            {insumo.is_agua_qsp && (
                              <Badge variant="outline" className="ml-2 text-xs">QSP</Badge>
                            )}
                          </TableCell>
                          <TableCell className="capitalize">{insumo.tipo}</TableCell>
                          <TableCell className="text-right font-mono">
                            {insumo.qtd_base_por_1000L.toFixed(3)}
                          </TableCell>
                          <TableCell>{insumo.unidade}</TableCell>
                          <TableCell className="text-right font-mono">
                            {insumo.brix_insumo > 0 ? `${insumo.brix_insumo}°` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="parametros" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Brix</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-muted-foreground text-xs">Min</p>
                            <p className="font-mono">{selectedFormulacao.brix_min || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Ideal</p>
                            <p className="font-mono font-medium">{selectedFormulacao.brix_ideal || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Max</p>
                            <p className="font-mono">{selectedFormulacao.brix_max || "-"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">pH</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-muted-foreground text-xs">Min</p>
                            <p className="font-mono">{selectedFormulacao.ph_min || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Ideal</p>
                            <p className="font-mono font-medium">{selectedFormulacao.ph_ideal || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Max</p>
                            <p className="font-mono">{selectedFormulacao.ph_max || "-"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Acidez</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-muted-foreground text-xs">Min</p>
                            <p className="font-mono">{selectedFormulacao.acidez_min || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Ideal</p>
                            <p className="font-mono font-medium">{selectedFormulacao.acidez_ideal || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Max</p>
                            <p className="font-mono">{selectedFormulacao.acidez_max || "-"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Suco Mínimo Legal</Label>
                      <p className="font-medium">{selectedFormulacao.perc_suco_minimo_legal}%</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Norma de Referência</Label>
                      <p className="font-medium">{selectedFormulacao.norma_referencia || "-"}</p>
                    </div>
                  </div>

                  {selectedFormulacao.observacao && (
                    <div>
                      <Label className="text-muted-foreground">Observações</Label>
                      <p className="text-sm">{selectedFormulacao.observacao}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
