"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlaskConical, Plus, Edit, Copy, Trash2 } from "lucide-react"
import { useClient } from "@/contexts/client-context"
import { getIndustryData } from "@/lib/industry-store"
import { EXAMPLE_MARKER } from "@/lib/demo-data"

export default function FormulasPage() {
  const { activeSystemId } = useClient()
  const [formulas, setFormulas] = useState<ReturnType<typeof getIndustryData>["formulas"]>([])

  useEffect(() => {
    const data = getIndustryData(activeSystemId)
    setFormulas(data.formulas)
  }, [activeSystemId])

  const isExample = (id: string | number) => String(id).startsWith(EXAMPLE_MARKER)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Fórmulas e Receitas</h1>
              <p className="text-sm text-muted-foreground">Gerenciamento de formulações de produtos</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Fórmula
            </Button>
          </div>
        </header>
        <div className="p-6">
          {formulas.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Nenhuma fórmula cadastrada nesta indústria.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formulas.map((formula) => (
                <Card
                  key={String(formula.id)}
                  className={`border-border bg-card transition-colors hover:border-primary/50 ${isExample(formula.id) ? "opacity-70" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {formula.name}
                            {isExample(formula.id) && (
                              <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(exemplo)</span>
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">Versão {formula.version}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          formula.status === "Ativo"
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-accent/50 bg-accent/10 text-accent"
                        }
                      >
                        {formula.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Ingredientes</p>
                          <p className="font-medium">{formula.ingredients} itens</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Brix</p>
                          <p className="font-medium font-mono">{formula.brix}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Atualizado em {formula.lastUpdate}</p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
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
      </main>
    </div>
  )
}
