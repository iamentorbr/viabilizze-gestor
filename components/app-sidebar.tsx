"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  LayoutDashboard,
  Beaker,
  Package,
  ChevronLeft,
  ChevronRight,
  Factory,
  ClipboardList,
  BarChart3,
  Users,
  Truck,
  ShoppingCart,
  History,
  FlaskConical,
  Tag,
  FileText,
  Scale,
  Home,
  Settings,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    title: "Principal",
    items: [
      { name: "Portal Viabilizze", href: "/", icon: Home },
      { name: "Gerenciador", href: "/gerenciador", icon: Factory },
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Calculadora", href: "/calculadora", icon: Calculator },
    ],
  },
  {
    title: "Produção",
    items: [
      { name: "Fórmulas", href: "/formulas", icon: FlaskConical },
      { name: "Ordens de Produção", href: "/ordens", icon: ClipboardList },
      { name: "Controle de Qualidade", href: "/qualidade", icon: Beaker },
    ],
  },
  {
    title: "Estoque",
    items: [
      { name: "Matérias-Primas", href: "/materias-primas", icon: Package },
      { name: "Produtos Acabados", href: "/produtos", icon: Truck },
    ],
  },
  {
    title: "Compras",
    items: [
      { name: "Gestão de Compras", href: "/compras", icon: ShoppingCart },
      { name: "Histórico", href: "/compras/historico", icon: History },
    ],
  },
  {
    title: "Rotulagem",
    items: [
      { name: "Rótulos", href: "/rotulagem", icon: Tag },
      { name: "Tabela Nutricional", href: "/rotulagem/nutricional", icon: FileText },
      { name: "Informações Legais", href: "/rotulagem/legal", icon: Scale },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { name: "Análises", href: "/relatorios", icon: BarChart3 },
    ],
  },
  {
    title: "Sistema",
    items: [
      { name: "Configuracoes", href: "/configuracoes", icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border bg-white px-3">
        {!collapsed && (
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-viabilizze.png"
              alt="Viabilizze"
              width={140}
              height={38}
              className="object-contain"
              priority
            />
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto flex items-center justify-center">
            <Image
              src="/logo-viabilizze.png"
              alt="Viabilizze"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent/20", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navigation.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <Users className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Operador</p>
              <p className="truncate text-xs text-sidebar-foreground/50">Produção</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
