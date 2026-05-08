"use client"

import { useState } from "react"
import Link from "next/link"
import { useClient } from "@/contexts/client-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Settings,
  Building2,
  Check,
  ChevronLeft,
  Trash2,
} from "lucide-react"

export default function ConfiguracoesPage() {
  const { activeClient, setActiveClient, systems, switchSystem, activeSystemId } = useClient()
  const [clientName, setClientName] = useState(activeClient)
  const [saved, setSaved] = useState(false)

  const handleSaveClient = () => {
    setActiveClient(clientName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background">
          {/* Header */}
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Configuracoes</h1>
                  <p className="text-sm text-muted-foreground">Configuracoes do sistema</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-4xl space-y-6">
              {/* Sistema Ativo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Sistema Ativo
                  </CardTitle>
                  <CardDescription>
                    Configure o nome do cliente ativo neste sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Sistema Ativo:</p>
                    <p className="text-2xl font-bold text-primary">{activeClient}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente</Label>
                    <div className="flex gap-2">
                      <Input
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Digite o nome do cliente..."
                        className="flex-1"
                      />
                      <Button onClick={handleSaveClient} disabled={!clientName.trim()}>
                        {saved ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Salvo
                          </>
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Lista de Sistemas */}
              <Card>
                <CardHeader>
                  <CardTitle>Sistemas Cadastrados</CardTitle>
                  <CardDescription>
                    Todos os sistemas de clientes cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {systems.map((system) => (
                      <div
                        key={system.id}
                        className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                          system.id === activeSystemId
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            system.id === activeSystemId
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}>
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{system.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Criado em {new Date(system.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {system.id === activeSystemId ? (
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                              Ativo
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                switchSystem(system.id)
                                setClientName(system.name)
                              }}
                            >
                              Ativar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
