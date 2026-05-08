"use client"

import { useClient } from "@/contexts/client-context"
import { Building2 } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const { activeClient, industriaSelecionada } = useClient()

  return (
    <header className="border-b border-border bg-card">
      {/* Company Banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-6 py-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{activeClient}</span>
          {industriaSelecionada && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">{industriaSelecionada.label}</span>
            </>
          )}
        </div>
      </div>
      {/* Page Title */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  )
}
