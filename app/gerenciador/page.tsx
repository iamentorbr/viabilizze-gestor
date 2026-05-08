"use client"

import Link from "next/link"
import {
  Calculator,
  LayoutDashboard,
  Package,
  Factory,
  ClipboardList,
  BarChart3,
  Truck,
  ShoppingCart,
  History,
  FlaskConical,
  Tag,
  FileText,
  Scale,
  Beaker,
  ArrowRight,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useClient } from "@/contexts/client-context"

const modules = [
  {
    title: "Principal",
    description: "Acesso rápido às funções principais",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-500",
    items: [
      { 
        name: "Dashboard", 
        href: "/dashboard", 
        icon: LayoutDashboard,
        description: "Visão geral da produção e indicadores"
      },
      { 
        name: "Calculadora de Produção", 
        href: "/calculadora", 
        icon: Calculator,
        description: "Cálculo de insumos para produção"
      },
    ],
  },
  {
    title: "Produção",
    description: "Controle do processo produtivo",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-500",
    items: [
      { 
        name: "Fórmulas e Receitas", 
        href: "/formulas", 
        icon: FlaskConical,
        description: "Gerenciamento de formulações"
      },
      { 
        name: "Ordens de Produção", 
        href: "/ordens", 
        icon: ClipboardList,
        description: "Acompanhamento de ordens"
      },
      { 
        name: "Controle de Qualidade", 
        href: "/qualidade", 
        icon: Beaker,
        description: "Análises e aprovações"
      },
    ],
  },
  {
    title: "Estoque",
    description: "Gestão de materiais e produtos",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-500",
    items: [
      { 
        name: "Matérias-Primas", 
        href: "/materias-primas", 
        icon: Package,
        description: "Inventário de insumos"
      },
      { 
        name: "Produtos Acabados", 
        href: "/produtos", 
        icon: Truck,
        description: "Estoque de produtos finais"
      },
    ],
  },
  {
    title: "Compras",
    description: "Gestão de aquisições e movimentações",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-500",
    items: [
      { 
        name: "Gestão de Compras", 
        href: "/compras", 
        icon: ShoppingCart,
        description: "Baixas e entradas de estoque"
      },
      { 
        name: "Histórico", 
        href: "/compras/historico", 
        icon: History,
        description: "Registro de movimentações"
      },
    ],
  },
  {
    title: "Rotulagem",
    description: "Informações para rotulagem de produtos",
    color: "from-rose-500/20 to-rose-600/10",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-500",
    items: [
      { 
        name: "Rótulos", 
        href: "/rotulagem", 
        icon: Tag,
        description: "Gerenciamento de rótulos"
      },
      { 
        name: "Tabela Nutricional", 
        href: "/rotulagem/nutricional", 
        icon: FileText,
        description: "Informações nutricionais"
      },
      { 
        name: "Informações Legais", 
        href: "/rotulagem/legal", 
        icon: Scale,
        description: "Dados legais e advertências"
      },
    ],
  },
  {
    title: "Relatórios",
    description: "Análises e indicadores",
    color: "from-cyan-500/20 to-cyan-600/10",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-500",
    items: [
      { 
        name: "Análises e Gráficos", 
        href: "/relatorios", 
        icon: BarChart3,
        description: "Relatórios de desempenho"
      },
    ],
  },
]

export default function HomePage() {
  const { activeClient } = useClient()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Factory className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Gerenciamento Integrado
                </h1>
                <p className="text-muted-foreground">
                  Sistema de Gestão para Indústria de Bebidas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Sistema Ativo:</p>
                <p className="text-lg font-bold text-primary">{activeClient}</p>
              </div>
              <Link href="/configuracoes">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Ordens Ativas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-xs text-muted-foreground">Itens em Estoque</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Fórmulas Cadastradas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <Beaker className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-xs text-muted-foreground">Taxa de Aprovação</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          {modules.map((module) => (
            <Card 
              key={module.title} 
              className={`border ${module.borderColor} bg-gradient-to-br ${module.color} backdrop-blur-sm`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {module.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card/80 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background/80 ${module.iconColor}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Gerenciamento Integrado - Sistema de Gestão Industrial
          </p>
        </div>
      </footer>
    </div>
  )
}
