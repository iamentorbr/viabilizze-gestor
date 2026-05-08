"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProduction } from "@/components/recent-production"
import { ProductionChart } from "@/components/production-chart"
import { InventoryAlerts } from "@/components/inventory-alerts"
import { ExampleDataBanner } from "@/components/example-data-banner"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da produção</p>
        </header>
        <div className="p-6 space-y-6">
          <ExampleDataBanner />
          <DashboardStats />
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductionChart />
            <InventoryAlerts />
          </div>
          <RecentProduction />
        </div>
      </main>
    </div>
  )
}
