"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { initIndustryWithDemoData, clearExampleData as clearExampleStore, deleteIndustryData, getIndustryData } from "@/lib/industry-store"

export interface Industria {
  id: string
  label: string
  descricao: string
  categoria: string
}

export const INDUSTRIAS: Industria[] = [
  { id: "nectares",            label: "Néctares de Frutas",       descricao: "Néctares, refrescos e bebidas mistas de frutas",          categoria: "Bebidas Não-Alcoólicas" },
  { id: "sucos",               label: "Sucos de Frutas",           descricao: "Sucos integrais, concentrados e reconstituídos",          categoria: "Bebidas Não-Alcoólicas" },
  { id: "aguas",               label: "Águas e Água de Coco",      descricao: "Água mineral, gaseificada, água de coco e similares",     categoria: "Bebidas Não-Alcoólicas" },
  { id: "cha_cafe",            label: "Chá, Café e Infusões",      descricao: "Bebidas à base de chá, café, infusões e energéticos",     categoria: "Bebidas Não-Alcoólicas" },
  { id: "isotonicos",          label: "Isotônicos e Funcionais",   descricao: "Bebidas esportivas, funcionais e shots",                  categoria: "Bebidas Não-Alcoólicas" },
  { id: "refrigerantes",       label: "Refrigerantes",             descricao: "Refrigerantes e bebidas carbonatadas",                    categoria: "Bebidas Não-Alcoólicas" },
  { id: "cervejas",            label: "Cervejas e Chopes",         descricao: "Cerveja, chope, cerveja artesanal e similares",           categoria: "Bebidas Alcoólicas" },
  { id: "vinhos",              label: "Vinhos e Espumantes",       descricao: "Vinhos, espumantes, champanhe e vinhos de frutas",        categoria: "Bebidas Alcoólicas" },
  { id: "destilados",          label: "Destilados e Licores",      descricao: "Cachaça, vodka, gin, rum, licores e similares",           categoria: "Bebidas Alcoólicas" },
  { id: "fermentados",         label: "Fermentados Artesanais",    descricao: "Kombucha, kefir, sidra e outras bebidas fermentadas",     categoria: "Bebidas Alcoólicas" },
  { id: "polpas",              label: "Polpas e Concentrados",     descricao: "Polpas de frutas congeladas e concentrados industriais",  categoria: "Insumos e Matérias-Primas" },
  { id: "outros",              label: "Outro Segmento",            descricao: "Outro tipo de indústria ou produto",                     categoria: "Outros" },
]

export type FormulaBancada = "gramas-litro" | "gramas-100ml" | "percentual"
export type FormulaProducao = "arredondamento" | "exato" | "incremento-10" | "incremento-100"

export interface ClientSystem {
  id: string
  name: string
  createdAt: string
  industria?: Industria
  formulaBancada?: FormulaBancada
  formulaProducao?: FormulaProducao
}

interface ClientContextType {
  activeClient: string
  setActiveClient: (name: string) => void
  systems: ClientSystem[]
  addSystem: (name: string, industria?: Industria, formulaBancada?: FormulaBancada, formulaProducao?: FormulaProducao) => void
  switchSystem: (id: string) => void
  deleteSystem: (id: string) => void
  activeSystemId: string
  industriaSelecionada: Industria | null
  setIndustriaSelecionada: (industria: Industria | null) => void
  hasExampleData: boolean
  clearExampleData: () => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

const STORAGE_KEYS = {
  activeClient: "activeClient",
  activeSystemId: "activeSystemId",
  clientSystems: "clientSystems",
  // legacy key — kept for backward compat but no longer the primary store
  industriaSelecionada: "industriaSelecionada",
}

function loadSystems(): ClientSystem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.clientSystems)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveSystems(systems: ClientSystem[]) {
  localStorage.setItem(STORAGE_KEYS.clientSystems, JSON.stringify(systems))
}

export function ClientProvider({ children }: { children: ReactNode }) {
  const [activeClient, setActiveClientState] = useState("Empresa Demonstração")
  const [activeSystemId, setActiveSystemId] = useState("default")
  const [systems, setSystems] = useState<ClientSystem[]>([
    { id: "default", name: "Empresa Demonstração", createdAt: new Date().toISOString() },
  ])
  const [hasExampleData, setHasExampleData] = useState(false)

  // Derived: current system's industry
  const industriaSelecionada: Industria | null =
    systems.find((s) => s.id === activeSystemId)?.industria ?? null

  // Restore from localStorage on mount
  useEffect(() => {
    const savedClient   = localStorage.getItem(STORAGE_KEYS.activeClient)
    const savedSystemId = localStorage.getItem(STORAGE_KEYS.activeSystemId)
    const savedSystems  = loadSystems()

    // Migrate legacy single-industria key into the default system if needed
    const legacyIndustria = localStorage.getItem(STORAGE_KEYS.industriaSelecionada)

    let initialSystems: ClientSystem[] = savedSystems.length
      ? savedSystems
      : [{ id: "default", name: "Empresa Demonstração", createdAt: new Date().toISOString() }]

    if (legacyIndustria && initialSystems.length > 0) {
      try {
        const parsed = JSON.parse(legacyIndustria) as Industria
        // Only migrate if the default system doesn't already have an industry
        initialSystems = initialSystems.map((s) =>
          s.id === "default" && !s.industria ? { ...s, industria: parsed } : s
        )
        localStorage.removeItem(STORAGE_KEYS.industriaSelecionada)
        saveSystems(initialSystems)
      } catch { /* ignore */ }
    }

    setSystems(initialSystems)
    if (savedClient)   setActiveClientState(savedClient)

    const resolvedSystemId = savedSystemId ?? "default"
    if (savedSystemId) setActiveSystemId(savedSystemId)

    // Init store for default system if it has never been set up
    const existingData = getIndustryData(resolvedSystemId)
    if (!existingData.hasExampleData &&
        existingData.produtos.length === 0 &&
        resolvedSystemId === "default") {
      initIndustryWithDemoData(resolvedSystemId)
      setHasExampleData(true)
    } else {
      setHasExampleData(existingData.hasExampleData)
    }
  }, [])

  // setIndustriaSelecionada — writes into the active system
  const setIndustriaSelecionada = (industria: Industria | null) => {
    setSystems((prev) => {
      const updated = prev.map((s) =>
        s.id === activeSystemId ? { ...s, industria: industria ?? undefined } : s
      )
      saveSystems(updated)
      return updated
    })
  }

  const setActiveClient = (name: string) => {
    setActiveClientState(name)
    localStorage.setItem(STORAGE_KEYS.activeClient, name)
    setSystems((prev) => {
      const updated = prev.map((s) => (s.id === activeSystemId ? { ...s, name } : s))
      saveSystems(updated)
      return updated
    })
  }

  const addSystem = (name: string, industria?: Industria, formulaBancada?: FormulaBancada, formulaProducao?: FormulaProducao) => {
    const newSystem: ClientSystem = {
      id: `system-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      industria,
      formulaBancada,
      formulaProducao,
    }
    // Populate the new industry's store with demo data
    initIndustryWithDemoData(newSystem.id)
    setHasExampleData(true)

    setSystems((prev) => {
      const updated = [...prev, newSystem]
      saveSystems(updated)
      return updated
    })
    setActiveSystemId(newSystem.id)
    setActiveClientState(name)
    localStorage.setItem(STORAGE_KEYS.activeSystemId, newSystem.id)
    localStorage.setItem(STORAGE_KEYS.activeClient, name)
  }

  const switchSystem = (id: string) => {
    const system = systems.find((s) => s.id === id)
    if (!system) return
    setActiveSystemId(id)
    setActiveClientState(system.name)
    localStorage.setItem(STORAGE_KEYS.activeSystemId, id)
    localStorage.setItem(STORAGE_KEYS.activeClient, system.name)
    // Sync hasExampleData for the target system
    const data = getIndustryData(id)
    setHasExampleData(data.hasExampleData)
  }

  const deleteSystem = (id: string) => {
    if (id === "default") return // protect base system
    deleteIndustryData(id) // wipe the industry's store
    setSystems((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      saveSystems(updated)
      if (activeSystemId === id) {
        setActiveSystemId("default")
        const def = updated.find((s) => s.id === "default")
        if (def) {
          setActiveClientState(def.name)
          localStorage.setItem(STORAGE_KEYS.activeSystemId, "default")
          localStorage.setItem(STORAGE_KEYS.activeClient, def.name)
          const defData = getIndustryData("default")
          setHasExampleData(defData.hasExampleData)
        }
      }
      return updated
    })
  }

  const clearExampleData = () => {
    clearExampleStore(activeSystemId)
    setHasExampleData(false)
  }

  return (
    <ClientContext.Provider
      value={{
        activeClient,
        setActiveClient,
        systems,
        addSystem,
        switchSystem,
        deleteSystem,
        activeSystemId,
        industriaSelecionada,
        setIndustriaSelecionada,
        hasExampleData,
        clearExampleData,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider")
  }
  return context
}
