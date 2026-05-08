"use client"

import Link from "next/link"
import { 
  ShoppingBag, 
  ArrowLeft, 
  FileSpreadsheet, 
  Calculator,
  ClipboardList,
  Building2,
  Download,
  Star,
  Tag,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    title: "Calculadora de Producao",
    description: "Planilha completa para calculo de insumos e materias-primas para producao de nectares e sucos.",
    icon: Calculator,
    price: "R$ 97,00",
    category: "Planilha",
    featured: true,
  },
  {
    title: "Controle de Estoque",
    description: "Sistema em planilha para gestao de estoque de materias-primas e produtos acabados.",
    icon: ClipboardList,
    price: "R$ 147,00",
    category: "Planilha",
    featured: false,
  },
  {
    title: "Tabela Nutricional",
    description: "Modelo de tabela nutricional conforme RDC 429/2020. Inclui calculos automaticos.",
    icon: FileSpreadsheet,
    price: "R$ 67,00",
    category: "Planilha",
    featured: false,
  },
  {
    title: "Controle de Qualidade",
    description: "Planilha para registro e acompanhamento de analises de qualidade com graficos.",
    icon: ClipboardList,
    price: "R$ 127,00",
    category: "Planilha",
    featured: true,
  },
  {
    title: "Formulacao de Bebidas",
    description: "Banco de dados com formulas base para desenvolvimento de nectares e sucos.",
    icon: FileSpreadsheet,
    price: "R$ 197,00",
    category: "Banco de Dados",
    featured: false,
  },
  {
    title: "Kit Rotulagem Completo",
    description: "Pacote com modelos de rotulos, tabela nutricional e checklist de conformidade.",
    icon: Tag,
    price: "R$ 247,00",
    category: "Kit",
    featured: true,
  },
]

export default function ProdutosViabilizzePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/20">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Produtos Viabilizze
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tabelas e sistemas avulsos para gestao industrial
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Voltar ao Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Featured Banner */}
        <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <Badge className="bg-amber-500 text-white mb-2">Destaque</Badge>
              <h3 className="text-xl font-bold text-foreground">
                Pacote Completo de Gestao Industrial
              </h3>
              <p className="text-muted-foreground mt-1">
                Todos os produtos com 40% de desconto. Economize tempo e dinheiro.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground line-through">R$ 882,00</p>
              <p className="text-3xl font-bold text-amber-500">R$ 529,00</p>
              <Button className="mt-2 bg-amber-500 hover:bg-amber-600">
                Comprar Pacote
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Produtos Disponiveis</h2>
          <p className="text-muted-foreground">
            Planilhas e sistemas prontos para uso imediato
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card 
              key={product.title}
              className={`border-border/50 bg-card hover:border-amber-500/30 hover:shadow-lg transition-all ${product.featured ? 'ring-2 ring-amber-500/20' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <product.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {product.featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg mt-4">{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm min-h-[60px]">
                  {product.description}
                </CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-bold text-foreground">{product.price}</p>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <Download className="mr-2 h-4 w-4" />
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-12 border-border/50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <Download className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <h4 className="font-bold text-foreground">Download Imediato</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesso instantaneo apos a confirmacao do pagamento
                </p>
              </div>
              <div>
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    <FileSpreadsheet className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <h4 className="font-bold text-foreground">Formato Excel</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Compativel com Excel, Google Sheets e LibreOffice
                </p>
              </div>
              <div>
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                    <Star className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <h4 className="font-bold text-foreground">Suporte Incluso</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  30 dias de suporte por e-mail para duvidas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            VIABILIZZE - Produtos e Sistemas
          </p>
        </div>
      </footer>
    </div>
  )
}
