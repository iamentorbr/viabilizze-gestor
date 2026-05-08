"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Briefcase, 
  ArrowLeft, 
  FileCheck, 
  GraduationCap, 
  Clipboard,
  Building2,
  ShieldCheck,
  FlaskConical,
  Scale,
  Beaker,
  Plus,
  FileText,
  Download,
  Copy,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const iconOptions = [
  { name: "FileCheck", icon: FileCheck },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "Beaker", icon: Beaker },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Clipboard", icon: Clipboard },
  { name: "Scale", icon: Scale },
  { name: "FileText", icon: FileText },
  { name: "Briefcase", icon: Briefcase },
]

const categoryOptions = [
  "Consultoria",
  "Treinamento",
  "Desenvolvimento",
  "Regularizacao",
  "Auditoria",
  "Assessoria",
]

interface ServiceModel {
  id: string
  title: string
  description: string
  category: string
  icon: string
  status: "Disponivel" | "Em breve" | "Inativo"
  price: string
  duration: string
  deliverables: string[]
  requirements: string[]
  createdAt: string
}

const initialServices: ServiceModel[] = [
  {
    id: "1",
    title: "Consultoria em Rotulagem",
    description: "Adequacao de rotulos conforme legislacao vigente da ANVISA. Analise e revisao de informacoes nutricionais e legais.",
    category: "Consultoria",
    icon: "FileCheck",
    status: "Disponivel",
    price: "A partir de R$ 1.500,00",
    duration: "5 a 10 dias uteis",
    deliverables: ["Relatorio de conformidade", "Modelo de rotulo aprovado", "Checklist de adequacao"],
    requirements: ["Ficha tecnica do produto", "Rotulo atual (se houver)", "Composicao nutricional"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Treinamentos Industriais",
    description: "Capacitacao de equipes em boas praticas de fabricacao, controle de qualidade e seguranca alimentar.",
    category: "Treinamento",
    icon: "GraduationCap",
    status: "Disponivel",
    price: "A partir de R$ 2.000,00",
    duration: "8 a 16 horas",
    deliverables: ["Material didatico", "Certificado de conclusao", "Avaliacao de aprendizado"],
    requirements: ["Lista de participantes", "Local para treinamento", "Equipamentos de projecao"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Desenvolvimento de Produto",
    description: "Criacao e desenvolvimento completo de novos produtos alimenticios, desde a concepcao ate a formulacao final aprovada.",
    category: "Desenvolvimento",
    icon: "Beaker",
    status: "Disponivel",
    price: "A partir de R$ 5.000,00",
    duration: "30 a 60 dias",
    deliverables: ["Formulacao tecnica", "Ficha tecnica completa", "Laudo de analise", "Manual de producao"],
    requirements: ["Briefing do produto", "Publico-alvo definido", "Orcamento disponivel"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Regularizacao Sanitaria",
    description: "Auxilio na obtencao de licencas, alvaras e registros junto aos orgaos reguladores.",
    category: "Regularizacao",
    icon: "ShieldCheck",
    status: "Disponivel",
    price: "A partir de R$ 3.000,00",
    duration: "30 a 90 dias",
    deliverables: ["Documentacao completa", "Protocolo de registro", "Acompanhamento do processo"],
    requirements: ["CNPJ ativo", "Alvara de funcionamento", "Responsavel tecnico"],
    createdAt: new Date().toISOString(),
  },
]

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceModel[]>(initialServices)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceModel | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [newService, setNewService] = useState<Partial<ServiceModel>>({
    title: "",
    description: "",
    category: "",
    icon: "FileCheck",
    status: "Disponivel",
    price: "",
    duration: "",
    deliverables: [],
    requirements: [],
  })
  const [newDeliverable, setNewDeliverable] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const getIcon = (iconName: string) => {
    const found = iconOptions.find(i => i.name === iconName)
    return found ? found.icon : FileCheck
  }

  const handleCreateService = () => {
    if (!newService.title || !newService.description || !newService.category) return

    const service: ServiceModel = {
      id: Date.now().toString(),
      title: newService.title || "",
      description: newService.description || "",
      category: newService.category || "",
      icon: newService.icon || "FileCheck",
      status: newService.status || "Disponivel",
      price: newService.price || "",
      duration: newService.duration || "",
      deliverables: newService.deliverables || [],
      requirements: newService.requirements || [],
      createdAt: new Date().toISOString(),
    }

    setServices([...services, service])
    setNewService({
      title: "",
      description: "",
      category: "",
      icon: "FileCheck",
      status: "Disponivel",
      price: "",
      duration: "",
      deliverables: [],
      requirements: [],
    })
    setIsCreateOpen(false)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id))
  }

  const handleDuplicateService = (service: ServiceModel) => {
    const duplicate: ServiceModel = {
      ...service,
      id: Date.now().toString(),
      title: `${service.title} (Copia)`,
      createdAt: new Date().toISOString(),
    }
    setServices([...services, duplicate])
    setCopiedId(service.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSaveEdit = () => {
    if (!editingService) return
    setServices(services.map(s => s.id === editingService.id ? editingService : s))
    setEditingService(null)
  }

  const generateJSON = (service: ServiceModel) => {
    const json = JSON.stringify(service, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `modelo-${service.title.toLowerCase().replace(/\s+/g, "-")}.json`
    a.click()
  }

  const addDeliverable = () => {
    if (!newDeliverable.trim()) return
    setNewService({
      ...newService,
      deliverables: [...(newService.deliverables || []), newDeliverable.trim()]
    })
    setNewDeliverable("")
  }

  const addRequirement = () => {
    if (!newRequirement.trim()) return
    setNewService({
      ...newService,
      requirements: [...(newService.requirements || []), newRequirement.trim()]
    })
    setNewRequirement("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponivel": return "bg-emerald-500"
      case "Em breve": return "bg-amber-500"
      case "Inativo": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Gerador de Modelos de Servicos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Uso exclusivo VIABILIZZE - Crie e gerencie modelos de servicos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                {services.length} Modelos
              </Badge>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Modelo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Modelo de Servico</DialogTitle>
                    <DialogDescription>
                      Preencha as informacoes para criar um novo modelo de servico
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Titulo do Servico</Label>
                        <Input
                          value={newService.title}
                          onChange={(e) => setNewService({...newService, title: e.target.value})}
                          placeholder="Ex: Consultoria em Rotulagem"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                          value={newService.category}
                          onValueChange={(value) => setNewService({...newService, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descricao</Label>
                      <Textarea
                        value={newService.description}
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                        placeholder="Descreva o servico em detalhes..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Icone</Label>
                        <Select
                          value={newService.icon}
                          onValueChange={(value) => setNewService({...newService, icon: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((opt) => (
                              <SelectItem key={opt.name} value={opt.name}>
                                <div className="flex items-center gap-2">
                                  <opt.icon className="h-4 w-4" />
                                  {opt.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newService.status}
                          onValueChange={(value: "Disponivel" | "Em breve" | "Inativo") => setNewService({...newService, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Disponivel">Disponivel</SelectItem>
                            <SelectItem value="Em breve">Em breve</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Preco</Label>
                        <Input
                          value={newService.price}
                          onChange={(e) => setNewService({...newService, price: e.target.value})}
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Prazo de Entrega</Label>
                      <Input
                        value={newService.duration}
                        onChange={(e) => setNewService({...newService, duration: e.target.value})}
                        placeholder="Ex: 5 a 10 dias uteis"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Entregaveis</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newDeliverable}
                          onChange={(e) => setNewDeliverable(e.target.value)}
                          placeholder="Adicionar entregavel"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
                        />
                        <Button type="button" variant="outline" onClick={addDeliverable}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newService.deliverables?.map((d, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {d}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setNewService({
                                ...newService,
                                deliverables: newService.deliverables?.filter((_, idx) => idx !== i)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Requisitos</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="Adicionar requisito"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                        />
                        <Button type="button" variant="outline" onClick={addRequirement}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newService.requirements?.map((r, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {r}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => setNewService({
                                ...newService,
                                requirements: newService.requirements?.filter((_, idx) => idx !== i)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateService} className="bg-blue-500 hover:bg-blue-600">
                      Criar Modelo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="todos">Todos ({services.length})</TabsTrigger>
            {categoryOptions.map((cat) => {
              const count = services.filter(s => s.category === cat).length
              if (count === 0) return null
              return (
                <TabsTrigger key={cat} value={cat}>
                  {cat} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="todos">
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service) => {
                const IconComponent = getIcon(service.icon)
                return (
                  <Card 
                    key={service.id}
                    className="border-border/50 bg-card hover:border-blue-500/30 hover:shadow-lg transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(service.status)} text-white text-xs`}>
                            {service.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Preco:</span>
                          <span className="font-medium text-foreground">{service.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Prazo:</span>
                          <span className="font-medium text-foreground">{service.duration}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Entregaveis:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {service.deliverables.map((d, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-border">
                        {service.category === "Treinamento" && (
                          <Link href="/servicos/treinamentos" className="flex-1">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full bg-amber-500 hover:bg-amber-600"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Gerenciar
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={service.category === "Treinamento" ? "" : "flex-1"}
                          onClick={() => setEditingService(service)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDuplicateService(service)}
                        >
                          {copiedId === service.id ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateJSON(service)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {categoryOptions.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid gap-6 md:grid-cols-2">
                {services.filter(s => s.category === cat).map((service) => {
                  const IconComponent = getIcon(service.icon)
                  return (
                    <Card 
                      key={service.id}
                      className="border-border/50 bg-card hover:border-blue-500/30 hover:shadow-lg transition-all"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(service.status)} text-white text-xs`}>
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-4">{service.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Preco:</span>
                            <span className="font-medium text-foreground">{service.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Prazo:</span>
                            <span className="font-medium text-foreground">{service.duration}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDuplicateService(service)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateJSON(service)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Modal */}
        <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Modelo de Servico</DialogTitle>
              <DialogDescription>
                Altere as informacoes do modelo de servico
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titulo do Servico</Label>
                    <Input
                      value={editingService.title}
                      onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={editingService.category}
                      onValueChange={(value) => setEditingService({...editingService, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descricao</Label>
                  <Textarea
                    value={editingService.description}
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingService.status}
                      onValueChange={(value: "Disponivel" | "Em breve" | "Inativo") => setEditingService({...editingService, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disponivel">Disponivel</SelectItem>
                        <SelectItem value="Em breve">Em breve</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preco</Label>
                    <Input
                      value={editingService.price}
                      onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo</Label>
                    <Input
                      value={editingService.duration}
                      onChange={(e) => setEditingService({...editingService, duration: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alteracoes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            VIABILIZZE - Gerador de Modelos de Servicos (Uso Exclusivo)
          </p>
        </div>
      </footer>
    </div>
  )
}
