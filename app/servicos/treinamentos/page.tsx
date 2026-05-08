"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  GraduationCap, 
  Plus,
  Download,
  Trash2,
  Edit,
  Save,
  X,
  Award,
  Users,
  Calendar,
  Building2,
  FileText,
  Printer,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Participant {
  id: string
  matricula: string
  nome: string
  cpf: string
  empresa: string
  cargo: string
  email: string
}

interface Training {
  id: string
  titulo: string
  descricao: string
  cargaHoraria: string
  instrutor: string
  dataInicio: string
  dataFim: string
  local: string
  status: "Agendado" | "Em andamento" | "Concluido" | "Cancelado"
  participants: Participant[]
  createdAt: string
}

const initialTrainings: Training[] = [
  {
    id: "1",
    titulo: "Boas Praticas de Fabricacao (BPF)",
    descricao: "Capacitacao em boas praticas de fabricacao para industria de alimentos conforme RDC 275/2002",
    cargaHoraria: "16 horas",
    instrutor: "Dr. Carlos Silva",
    dataInicio: "2024-03-15",
    dataFim: "2024-03-16",
    local: "Sala de Treinamentos - Unidade Central",
    status: "Concluido",
    participants: [
      {
        id: "p1",
        matricula: "TRN-2024-001",
        nome: "Maria Oliveira Santos",
        cpf: "123.456.789-00",
        empresa: "Alimentos XYZ Ltda",
        cargo: "Supervisora de Producao",
        email: "maria@alimentosxyz.com.br"
      },
      {
        id: "p2",
        matricula: "TRN-2024-002",
        nome: "Jose Carlos Ferreira",
        cpf: "987.654.321-00",
        empresa: "Alimentos XYZ Ltda",
        cargo: "Operador de Linha",
        email: "jose@alimentosxyz.com.br"
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Controle de Qualidade em Bebidas",
    descricao: "Metodologias de controle de qualidade especificas para industria de bebidas",
    cargaHoraria: "8 horas",
    instrutor: "Dra. Ana Paula Costa",
    dataInicio: "2024-04-20",
    dataFim: "2024-04-20",
    local: "Online - Microsoft Teams",
    status: "Agendado",
    participants: [],
    createdAt: new Date().toISOString(),
  },
]

function generateMatricula(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `TRN-${year}-${random}`
}

function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}

export default function TreinamentosPage() {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null)
  const [viewCertificate, setViewCertificate] = useState<{training: Training, participant: Participant} | null>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  const [newTraining, setNewTraining] = useState<Partial<Training>>({
    titulo: "",
    descricao: "",
    cargaHoraria: "",
    instrutor: "",
    dataInicio: "",
    dataFim: "",
    local: "",
    status: "Agendado",
    participants: [],
  })

  const [newParticipant, setNewParticipant] = useState<Partial<Participant>>({
    nome: "",
    cpf: "",
    empresa: "",
    cargo: "",
    email: "",
  })

  const handleCreateTraining = () => {
    if (!newTraining.titulo || !newTraining.dataInicio) return

    const training: Training = {
      id: Date.now().toString(),
      titulo: newTraining.titulo || "",
      descricao: newTraining.descricao || "",
      cargaHoraria: newTraining.cargaHoraria || "",
      instrutor: newTraining.instrutor || "",
      dataInicio: newTraining.dataInicio || "",
      dataFim: newTraining.dataFim || "",
      local: newTraining.local || "",
      status: newTraining.status || "Agendado",
      participants: [],
      createdAt: new Date().toISOString(),
    }

    setTrainings([...trainings, training])
    setNewTraining({
      titulo: "",
      descricao: "",
      cargaHoraria: "",
      instrutor: "",
      dataInicio: "",
      dataFim: "",
      local: "",
      status: "Agendado",
      participants: [],
    })
    setIsCreateOpen(false)
  }

  const handleAddParticipant = () => {
    if (!selectedTraining || !newParticipant.nome || !newParticipant.cpf) return

    const participant: Participant = {
      id: Date.now().toString(),
      matricula: generateMatricula(),
      nome: newParticipant.nome || "",
      cpf: newParticipant.cpf || "",
      empresa: newParticipant.empresa || "",
      cargo: newParticipant.cargo || "",
      email: newParticipant.email || "",
    }

    setTrainings(trainings.map(t => {
      if (t.id === selectedTraining.id) {
        return { ...t, participants: [...t.participants, participant] }
      }
      return t
    }))

    setNewParticipant({
      nome: "",
      cpf: "",
      empresa: "",
      cargo: "",
      email: "",
    })
    setIsAddParticipantOpen(false)
  }

  const handleRemoveParticipant = (trainingId: string, participantId: string) => {
    setTrainings(trainings.map(t => {
      if (t.id === trainingId) {
        return { ...t, participants: t.participants.filter(p => p.id !== participantId) }
      }
      return t
    }))
  }

  const handleDeleteTraining = (id: string) => {
    setTrainings(trainings.filter(t => t.id !== id))
    if (selectedTraining?.id === id) {
      setSelectedTraining(null)
    }
  }

  const printCertificate = () => {
    const printContent = certificateRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificado</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Verdana', sans-serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluido": return "bg-emerald-500"
      case "Em andamento": return "bg-blue-500"
      case "Agendado": return "bg-amber-500"
      case "Cancelado": return "bg-red-500"
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
              <Link href="/servicos">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Treinamentos Industriais
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerenciamento de treinamentos e geracao de certificados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                {trainings.length} Treinamentos
              </Badge>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Treinamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Treinamento</DialogTitle>
                    <DialogDescription>
                      Preencha as informacoes do treinamento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Titulo do Treinamento</Label>
                      <Input
                        value={newTraining.titulo}
                        onChange={(e) => setNewTraining({...newTraining, titulo: e.target.value})}
                        placeholder="Ex: Boas Praticas de Fabricacao"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descricao</Label>
                      <Textarea
                        value={newTraining.descricao}
                        onChange={(e) => setNewTraining({...newTraining, descricao: e.target.value})}
                        placeholder="Descreva o conteudo do treinamento..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Carga Horaria</Label>
                        <Input
                          value={newTraining.cargaHoraria}
                          onChange={(e) => setNewTraining({...newTraining, cargaHoraria: e.target.value})}
                          placeholder="Ex: 16 horas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instrutor</Label>
                        <Input
                          value={newTraining.instrutor}
                          onChange={(e) => setNewTraining({...newTraining, instrutor: e.target.value})}
                          placeholder="Nome do instrutor"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data Inicio</Label>
                        <Input
                          type="date"
                          value={newTraining.dataInicio}
                          onChange={(e) => setNewTraining({...newTraining, dataInicio: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data Fim</Label>
                        <Input
                          type="date"
                          value={newTraining.dataFim}
                          onChange={(e) => setNewTraining({...newTraining, dataFim: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Local</Label>
                        <Input
                          value={newTraining.local}
                          onChange={(e) => setNewTraining({...newTraining, local: e.target.value})}
                          placeholder="Local do treinamento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newTraining.status}
                          onValueChange={(value: Training["status"]) => setNewTraining({...newTraining, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Agendado">Agendado</SelectItem>
                            <SelectItem value="Em andamento">Em andamento</SelectItem>
                            <SelectItem value="Concluido">Concluido</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateTraining} className="bg-amber-500 hover:bg-amber-600">
                      Criar Treinamento
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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Training List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Lista de Treinamentos</h2>
            {trainings.map((training) => (
              <Card 
                key={training.id}
                className={`cursor-pointer border-border/50 transition-all hover:shadow-md ${
                  selectedTraining?.id === training.id ? "border-amber-500 bg-amber-500/5" : "bg-card"
                }`}
                onClick={() => setSelectedTraining(training)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge className={`${getStatusColor(training.status)} text-white text-xs`}>
                      {training.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTraining(training.id) }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base mt-2">{training.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(training.dataInicio)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {training.participants.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Training Details */}
          <div className="lg:col-span-2">
            {selectedTraining ? (
              <Card className="border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedTraining.titulo}</CardTitle>
                      <CardDescription className="mt-2">{selectedTraining.descricao}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(selectedTraining.status)} text-white`}>
                      {selectedTraining.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Carga Horaria</p>
                      <p className="font-medium">{selectedTraining.cargaHoraria}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Instrutor</p>
                      <p className="font-medium">{selectedTraining.instrutor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Periodo</p>
                      <p className="font-medium">{formatDate(selectedTraining.dataInicio)} a {formatDate(selectedTraining.dataFim)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Local</p>
                      <p className="font-medium">{selectedTraining.local}</p>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Participantes</h3>
                      <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Participante
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar Participante</DialogTitle>
                            <DialogDescription>
                              Preencha os dados do participante
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Nome Completo</Label>
                              <Input
                                value={newParticipant.nome}
                                onChange={(e) => setNewParticipant({...newParticipant, nome: e.target.value})}
                                placeholder="Nome completo do participante"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>CPF</Label>
                                <Input
                                  value={newParticipant.cpf}
                                  onChange={(e) => setNewParticipant({...newParticipant, cpf: formatCPF(e.target.value)})}
                                  placeholder="000.000.000-00"
                                  maxLength={14}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={newParticipant.email}
                                  onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
                                  placeholder="email@empresa.com"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Empresa</Label>
                                <Input
                                  value={newParticipant.empresa}
                                  onChange={(e) => setNewParticipant({...newParticipant, empresa: e.target.value})}
                                  placeholder="Nome da empresa"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Cargo</Label>
                                <Input
                                  value={newParticipant.cargo}
                                  onChange={(e) => setNewParticipant({...newParticipant, cargo: e.target.value})}
                                  placeholder="Cargo do participante"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleAddParticipant} className="bg-amber-500 hover:bg-amber-600">
                              Adicionar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {selectedTraining.participants.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Matricula</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead className="text-right">Acoes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTraining.participants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell className="font-mono text-sm">{participant.matricula}</TableCell>
                              <TableCell>{participant.nome}</TableCell>
                              <TableCell>{participant.cpf}</TableCell>
                              <TableCell>{participant.empresa}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {selectedTraining.status === "Concluido" && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10"
                                      onClick={() => setViewCertificate({training: selectedTraining, participant})}
                                    >
                                      <Award className="mr-2 h-4 w-4" />
                                      Certificado
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    onClick={() => handleRemoveParticipant(selectedTraining.id, participant.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum participante cadastrado</p>
                        <p className="text-sm">Clique em &quot;Adicionar Participante&quot; para comecar</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 bg-card">
                <CardContent className="py-16 text-center text-muted-foreground">
                  <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Selecione um treinamento</p>
                  <p className="text-sm">Clique em um treinamento na lista para ver os detalhes e participantes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      <Dialog open={!!viewCertificate} onOpenChange={() => setViewCertificate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificado de Conclusao</DialogTitle>
            <DialogDescription>
              Visualize e imprima o certificado do participante
            </DialogDescription>
          </DialogHeader>
          
          {viewCertificate && (
            <>
              <div ref={certificateRef} className="bg-white p-8 border-8 border-double border-amber-500">
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div className="border-b-2 border-amber-500 pb-6">
                    <h1 className="text-3xl font-bold text-amber-600 tracking-wider">VIABILIZZE</h1>
                    <p className="text-sm text-gray-600 mt-1">Soluções em Gestão Industrial</p>
                  </div>

                  {/* Title */}
                  <div className="py-4">
                    <h2 className="text-4xl font-bold text-gray-800 tracking-wide">CERTIFICADO</h2>
                    <p className="text-lg text-gray-600 mt-2">de Conclusao de Treinamento</p>
                  </div>

                  {/* Content */}
                  <div className="py-6 space-y-4 text-gray-700">
                    <p className="text-lg">Certificamos que</p>
                    <p className="text-3xl font-bold text-gray-900">{viewCertificate.participant.nome}</p>
                    
                    <div className="grid grid-cols-3 gap-4 py-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-500">Matricula</p>
                        <p className="font-bold font-mono">{viewCertificate.participant.matricula}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-500">CPF</p>
                        <p className="font-bold">{viewCertificate.participant.cpf}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-500">Empresa</p>
                        <p className="font-bold">{viewCertificate.participant.empresa}</p>
                      </div>
                    </div>

                    <p className="text-lg">concluiu com exito o treinamento</p>
                    <p className="text-2xl font-bold text-amber-600">{viewCertificate.training.titulo}</p>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 text-sm max-w-md mx-auto">
                      <div className="text-left">
                        <p className="text-gray-500">Carga Horaria:</p>
                        <p className="font-bold">{viewCertificate.training.cargaHoraria}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-500">Instrutor:</p>
                        <p className="font-bold">{viewCertificate.training.instrutor}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-500">Periodo:</p>
                        <p className="font-bold">{formatDate(viewCertificate.training.dataInicio)} a {formatDate(viewCertificate.training.dataFim)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-500">Local:</p>
                        <p className="font-bold">{viewCertificate.training.local}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2 mx-8">
                          <p className="font-bold">{viewCertificate.training.instrutor}</p>
                          <p className="text-sm text-gray-500">Instrutor</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2 mx-8">
                          <p className="font-bold">VIABILIZZE</p>
                          <p className="text-sm text-gray-500">Coordenacao de Treinamentos</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-8">
                      Certificado emitido em {new Date().toLocaleDateString("pt-BR")} | Codigo de verificacao: {viewCertificate.participant.matricula}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewCertificate(null)}>
                  Fechar
                </Button>
                <Button onClick={printCertificate} className="bg-amber-500 hover:bg-amber-600">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir Certificado
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
