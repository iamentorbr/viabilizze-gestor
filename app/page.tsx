"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Factory, ArrowRight, ChevronRight, RotateCcw, Plus, Building2, Trash2, Check, FlaskConical, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useClient, INDUSTRIAS, type Industria, type FormulaBancada, type FormulaProducao } from "@/contexts/client-context"
import { cn } from "@/lib/utils"

const mainOptions = [
  {
    title: "Gerenciador Integrado",
    description: "Sistema completo de gestão para indústria de bebidas. Controle de produção, estoque, qualidade, compras e rotulagem.",
    href: "/gerenciador",
    icon: Factory,
    hoverColor: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
]

const FORMULA_BANCADA_OPTIONS: { value: FormulaBancada; label: string; desc: string }[] = [
  { value: "gramas-litro",  label: "g / L",    desc: "Gramas por litro" },
  { value: "gramas-100ml",  label: "g / 100 mL", desc: "Gramas por 100 mL" },
  { value: "percentual",    label: "% (m/v)",  desc: "Percentual massa/volume" },
]

const FORMULA_PRODUCAO_OPTIONS: { value: FormulaProducao; label: string; desc: string }[] = [
  { value: "arredondamento",  label: "Arredondamento",   desc: "Arredonda para número inteiro" },
  { value: "exato",           label: "Exato",            desc: "Mantém casas decimais" },
  { value: "incremento-10",   label: "Múltiplo de 10",   desc: "Arredonda ao múltiplo de 10" },
  { value: "incremento-100",  label: "Múltiplo de 100",  desc: "Arredonda ao múltiplo de 100" },
]

const categoriaColors: Record<string, { border: string; activeBorder: string; badge: string; dot: string }> = {
  "Bebidas Não-Alcoólicas":    { border: "border-emerald-500/40 hover:border-emerald-500", activeBorder: "border-emerald-500 bg-emerald-500/8", badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", dot: "bg-emerald-500" },
  "Bebidas Alcoólicas":         { border: "border-amber-500/40 hover:border-amber-500",    activeBorder: "border-amber-500 bg-amber-500/8",     badge: "bg-amber-500/10 text-amber-700 border-amber-500/30",     dot: "bg-amber-500"   },
  "Insumos e Matérias-Primas":  { border: "border-blue-500/40 hover:border-blue-500",      activeBorder: "border-blue-500 bg-blue-500/8",       badge: "bg-blue-500/10 text-blue-700 border-blue-500/30",         dot: "bg-blue-500"    },
  "Outros":                     { border: "border-slate-400/40 hover:border-slate-400",    activeBorder: "border-slate-400 bg-slate-100",       badge: "bg-slate-100 text-slate-700 border-slate-300",            dot: "bg-slate-400"   },
}

export default function LandingPage() {
  const { systems, activeSystemId, switchSystem, addSystem, deleteSystem, industriaSelecionada, setIndustriaSelecionada, hasExampleData, clearExampleData } = useClient()

  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName]         = useState("")
  const [newIndustria, setNewIndustria] = useState<Industria | null>(null)
  const [newFormulaBancada, setNewFormulaBancada] = useState<FormulaBancada | null>(null)
  const [newFormulaProducao, setNewFormulaProducao] = useState<FormulaProducao | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const categorias = INDUSTRIAS.reduce<Record<string, Industria[]>>((acc, ind) => {
    if (!acc[ind.categoria]) acc[ind.categoria] = []
    acc[ind.categoria].push(ind)
    return acc
  }, {})

  const resetNewForm = () => {
    setShowNewForm(false)
    setNewName("")
    setNewIndustria(null)
    setNewFormulaBancada(null)
    setNewFormulaProducao(null)
  }

  const handleCreateSystem = () => {
    if (!newName.trim()) return
    addSystem(
      newName.trim(),
      newIndustria ?? undefined,
      newFormulaBancada ?? undefined,
      newFormulaProducao ?? undefined,
    )
    resetNewForm()
  }

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteSystem(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      // Auto-cancel confirmation after 3 s
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const activeSystem = systems.find((s) => s.id === activeSystemId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <Image src="/logo-viabilizze.png" alt="Viabilizze" width={280} height={76} className="object-contain" priority />
            <p className="text-sm text-muted-foreground tracking-wide">Soluções em Gestão Industrial</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="w-full max-w-5xl mx-auto space-y-14">

          {/* ═══════════════════════════════════════════════════════
              SEÇÃO 0 — SELEÇÃO DE INDÚSTRIA
          ═══════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Suas Indústrias</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Selecione uma indústria para visualizar apenas o sistema daquela empresa
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setShowNewForm(true); setConfirmDelete(null) }}>
                <Plus className="h-3.5 w-3.5" />
                Nova Indústria
              </Button>
            </div>

            {/* Cards das indústrias existentes */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {systems.map((sys) => {
                const isActive = sys.id === activeSystemId
                const colors = sys.industria ? (categoriaColors[sys.industria.categoria] ?? categoriaColors["Outros"]) : null

                return (
                  <div
                    key={sys.id}
                    className={cn(
                      "relative group rounded-xl border-2 bg-card p-4 transition-all duration-150 cursor-pointer hover:shadow-md",
                      isActive
                        ? "border-primary shadow-sm shadow-primary/10"
                        : "border-border hover:border-primary/40"
                    )}
                    onClick={() => switchSystem(sys.id)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </span>
                    )}

                    <div className="flex items-start gap-3 pr-6">
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        isActive ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Building2 className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-semibold text-sm leading-snug truncate", isActive ? "text-primary" : "text-foreground")}>
                          {sys.name}
                        </p>
                        {sys.industria ? (
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-1">
                            {sys.industria.label}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground/60 mt-0.5 italic">Segmento não definido</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          Criado em {new Date(sys.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {/* Badges: industry + formula types */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {sys.industria && colors && (
                        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", colors.badge)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
                          {sys.industria.categoria}
                        </span>
                      )}
                      {sys.formulaBancada && (
                        <span className="inline-flex items-center rounded-full border border-blue-300/60 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          Bancada: {FORMULA_BANCADA_OPTIONS.find((o) => o.value === sys.formulaBancada)?.label}
                        </span>
                      )}
                      {sys.formulaProducao && (
                        <span className="inline-flex items-center rounded-full border border-orange-300/60 bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                          Prod.: {FORMULA_PRODUCAO_OPTIONS.find((o) => o.value === sys.formulaProducao)?.label}
                        </span>
                      )}
                    </div>

                    {/* Delete — only non-default systems */}
                    {sys.id !== "default" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(sys.id) }}
                        className={cn(
                          "absolute bottom-3 right-3 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-all",
                          confirmDelete === sys.id
                            ? "bg-destructive text-destructive-foreground opacity-100"
                            : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        )}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                        {confirmDelete === sys.id ? "Confirmar" : "Excluir"}
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Novo sistema — inline form card */}
              {showNewForm && (
                <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/3 p-4 space-y-3 col-span-full sm:col-span-1">
                  <p className="text-sm font-semibold text-foreground">Nova Indústria</p>
                  <div className="space-y-1.5">
                    <Label htmlFor="newName" className="text-xs">Nome da empresa</Label>
                    <Input
                      id="newName"
                      placeholder="Ex: Citro Life LTDA"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateSystem()}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Segmento (opcional)</Label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {INDUSTRIAS.map((ind) => (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => setNewIndustria(newIndustria?.id === ind.id ? null : ind)}
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                            newIndustria?.id === ind.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fórmula de Bancada */}
                  <div className="space-y-1.5 border-t border-border/60 pt-3">
                    <Label className="text-xs font-semibold text-foreground">
                      Fórmula de Bancada
                      <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      Unidade de medida usada nas formulações de laboratório
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {FORMULA_BANCADA_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          title={opt.desc}
                          onClick={() => setNewFormulaBancada(newFormulaBancada === opt.value ? null : opt.value)}
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                            newFormulaBancada === opt.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fórmula de Produção */}
                  <div className="space-y-1.5 border-t border-border/60 pt-3">
                    <Label className="text-xs font-semibold text-foreground">
                      Fórmula de Produção
                      <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      Critério de arredondamento aplicado às quantidades industriais
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {FORMULA_PRODUCAO_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          title={opt.desc}
                          onClick={() => setNewFormulaProducao(newFormulaProducao === opt.value ? null : opt.value)}
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                            newFormulaProducao === opt.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleCreateSystem} disabled={!newName.trim()}>
                      Criar
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={resetNewForm}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Banner: apagar dados de exemplo */}
            {hasExampleData && !bannerDismissed && (
              <div className="mt-4 flex items-center gap-4 rounded-lg border border-accent/40 bg-accent/8 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/20">
                  <FlaskConical className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    Esta indústria contém dados de exemplo
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Produto, fórmula, ordem, análise e insumo de demonstração foram criados automaticamente.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {confirmClear ? (
                    <>
                      <span className="text-xs text-destructive font-medium">Confirmar?</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => { clearExampleData(); setConfirmClear(false) }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Apagar
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setConfirmClear(false)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs border-accent/40 text-accent hover:bg-accent/10 hover:text-accent"
                        onClick={() => setConfirmClear(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Apagar dados de exemplo
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setBannerDismissed(true)}
                        aria-label="Fechar aviso"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════
              PASSO 1 — SEGMENTO INDUSTRIAL (do sistema ativo)
          ═══════════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">1</span>
                  <h2 className="text-lg font-bold text-foreground">Segmento Industrial</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {activeSystem ? (
                    <>Definindo para <strong>{activeSystem.name}</strong></>
                  ) : "Selecione ou crie uma indústria acima"}
                </p>
              </div>
              {industriaSelecionada && (
                <button
                  onClick={() => setIndustriaSelecionada(null)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Alterar
                </button>
              )}
            </div>

            {industriaSelecionada ? (
              <div className="flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{industriaSelecionada.label}</p>
                  <p className="text-xs text-muted-foreground">{industriaSelecionada.descricao}</p>
                </div>
                <Badge variant="outline" className="shrink-0 border-primary/30 text-primary text-xs">
                  {industriaSelecionada.categoria}
                </Badge>
                <ChevronRight className="h-4 w-4 text-primary shrink-0" />
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(categorias).map(([cat, items]) => {
                  const colors = categoriaColors[cat] ?? categoriaColors["Outros"]
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn("h-2 w-2 rounded-full", colors.dot)} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((ind) => (
                          <button
                            key={ind.id}
                            onClick={() => setIndustriaSelecionada(ind)}
                            className={cn(
                              "group text-left rounded-lg border-2 bg-card px-4 py-3 transition-all duration-150 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
                              colors.border
                            )}
                          >
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                              {ind.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{ind.descricao}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════════════════
              PASSO 2 — NAVEGAÇÃO PRINCIPAL
          ═══════════════════════════════════════════════════════ */}
          <section className={cn(industriaSelecionada ? "" : "opacity-40 pointer-events-none select-none")}>
            <div className="flex items-center gap-2 mb-6">
              <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                industriaSelecionada ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>2</span>
              <h2 className="text-lg font-bold text-foreground">Selecione uma opção</h2>
              {!industriaSelecionada && (
                <span className="text-xs text-muted-foreground">(selecione o segmento primeiro)</span>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {mainOptions.map((option) => (
                <Link key={option.title} href={option.href} className="group block">
                  <Card className={cn("h-full border-2 border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1", option.hoverColor)}>
                    <CardContent className="p-8 flex flex-col items-center text-center h-full">
                      <div className={cn("flex h-20 w-20 items-center justify-center rounded-2xl mb-6 transition-transform group-hover:scale-110", option.iconBg)}>
                        <option.icon className={cn("h-10 w-10", option.iconColor)} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-1">{option.description}</p>
                      <div className={cn("flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all", option.iconColor)}>
                        <span>Acessar</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            VIABILIZZE — Soluções em Gestão Industrial
          </p>
        </div>
      </footer>
    </div>
  )
}
