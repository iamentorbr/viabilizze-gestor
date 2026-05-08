"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ProductionCalculator } from "@/components/production-calculator"

export default function CalculadoraPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Calculadora de Produção</h1>
          <p className="text-sm text-muted-foreground">Cálculo de insumos para produção de néctares</p>
        </header>
        <div className="p-6">
          <ProductionCalculator />
        </div>
      </main>
    </div>
  )
}
