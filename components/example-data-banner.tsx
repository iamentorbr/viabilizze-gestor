"use client"

import { useState } from "react"
import { FlaskConical, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClient } from "@/contexts/client-context"

export function ExampleDataBanner() {
  const { hasExampleData, clearExampleData } = useClient()
  const [confirming, setConfirming] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (!hasExampleData || dismissed) return null

  const handleClear = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    clearExampleData()
    setConfirming(false)
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-accent/40 bg-accent/8 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/20">
        <FlaskConical className="h-4 w-4 text-accent" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">
          Esta indústria contém dados de exemplo
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Produto, fórmula, ordem de produção, análise de qualidade e insumo de demonstração foram criados automaticamente.
          Remova-os quando estiver pronto para inserir seus próprios dados.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {confirming ? (
          <>
            <span className="text-xs text-destructive font-medium">Confirmar remoção?</span>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 gap-1.5 text-xs"
              onClick={handleClear}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Apagar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setConfirming(false)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 text-xs border-accent/40 text-accent hover:bg-accent/10 hover:text-accent"
              onClick={handleClear}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Apagar dados de exemplo
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setDismissed(true)}
              aria-label="Fechar aviso"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
