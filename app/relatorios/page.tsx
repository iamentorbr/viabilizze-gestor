"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Download, TrendingUp, Factory, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const productionData = [
  { month: "Jan", caju: 85000, manga: 62000, goiaba: 48000, maracuja: 35000 },
  { month: "Fev", caju: 92000, manga: 58000, goiaba: 55000, maracuja: 42000 },
  { month: "Mar", caju: 78000, manga: 71000, goiaba: 52000, maracuja: 38000 },
  { month: "Abr", caju: 95000, manga: 65000, goiaba: 60000, maracuja: 45000 },
]

const efficiencyData = [
  { week: "Sem 1", efficiency: 92, target: 95 },
  { week: "Sem 2", efficiency: 88, target: 95 },
  { week: "Sem 3", efficiency: 95, target: 95 },
  { week: "Sem 4", efficiency: 91, target: 95 },
]

const qualityData = [
  { name: "Aprovado", value: 94, color: "hsl(var(--primary))" },
  { name: "Ajuste", value: 4, color: "hsl(var(--accent))" },
  { name: "Reprovado", value: 2, color: "hsl(var(--destructive))" },
]

const reports = [
  { name: "Produção Mensal", description: "Relatório detalhado de produção por sabor", icon: Factory },
  { name: "Consumo de Matérias-Primas", description: "Análise de consumo e projeção", icon: Package },
  { name: "Indicadores de Qualidade", description: "Taxas de aprovação e rejeição", icon: TrendingUp },
  { name: "Histórico de Movimentações", description: "Entradas e saídas de estoque", icon: FileText },
]

export default function RelatoriosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <PageHeader 
          title="Relatórios e Análises" 
          description="Visualização de dados e indicadores"
        />
        <div className="p-6 space-y-6">
          {/* Quick Reports */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((report) => (
              <Card key={report.name} className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Production by Flavor */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Produção por Sabor (2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value.toLocaleString("pt-BR")} kg`, ""]}
                      />
                      <Bar dataKey="caju" name="Caju" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="manga" name="Manga" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="goiaba" name="Goiaba" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="maracuja" name="Maracujá" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Eficiência de Produção (%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        name="Eficiência"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Meta"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quality Distribution */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Distribuição de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {qualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {qualityData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Resumo do Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Produção Total</p>
                    <p className="text-2xl font-bold text-foreground">850.000 kg</p>
                    <p className="text-xs text-primary">+12% vs. período anterior</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Ordens Concluídas</p>
                    <p className="text-2xl font-bold text-foreground">142</p>
                    <p className="text-xs text-primary">98% no prazo</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Taxa de Qualidade</p>
                    <p className="text-2xl font-bold text-foreground">94%</p>
                    <p className="text-xs text-primary">Acima da meta</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Eficiência Média</p>
                    <p className="text-2xl font-bold text-foreground">91.5%</p>
                    <p className="text-xs text-accent">Meta: 95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
