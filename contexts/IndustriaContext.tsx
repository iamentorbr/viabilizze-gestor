'use client'

import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react'
import { getSupabase } from '@/lib/supabase'

export interface Industria {
  id: string
  nome: string
  cnpj?: string | null
  responsavel?: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

interface IndustriaContextType {
  industrias: Industria[]
  industriaAtiva: Industria | null
  setIndustriaAtiva: (industria: Industria) => void
  criarIndustria: (dados: { nome: string; responsavel?: string }) => Promise<Industria | null>
  recarregar: () => Promise<void>
  loading: boolean
  error: string | null
}

const IndustriaContext = createContext<IndustriaContextType | undefined>(undefined)
const STORAGE_KEY = 'viabilizze_industria_id'

export function IndustriaProvider({ children }: { children: ReactNode }) {
  const [industrias, setIndustrias] = useState<Industria[]>([])
  const [industriaAtiva, setIndustriaAtivaState] = useState<Industria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarIndustrias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaErr } = await getSupabase()
        .from('industrias')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true })
      if (supaErr) throw supaErr
      const lista = (data ?? []) as Industria[]
      setIndustrias(lista)
      if (lista.length === 0) { setIndustriaAtivaState(null); return }
      const idSalvo = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      const encontrada = idSalvo ? lista.find(i => i.id === idSalvo) ?? null : null
      const ativa = encontrada ?? lista[0]
      setIndustriaAtivaState(ativa)
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, ativa.id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar indústrias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregarIndustrias() }, [carregarIndustrias])

  const setIndustriaAtiva = useCallback((industria: Industria) => {
    setIndustriaAtivaState(industria)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, industria.id)
  }, [])

  const criarIndustria = useCallback(async (dados: { nome: string; responsavel?: string }) => {
    try {
      const { data, error: supaErr } = await getSupabase()
        .from('industrias')
        .insert({ nome: dados.nome, responsavel: dados.responsavel ?? null, ativo: true })
        .select().single()
      if (supaErr) throw supaErr
      const nova = data as Industria
      setIndustrias(prev => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome)))
      return nova
    } catch (err) { console.error('[criarIndustria]', err); return null }
  }, [])

  return (
    <IndustriaContext.Provider value={{ industrias, industriaAtiva, setIndustriaAtiva, criarIndustria, recarregar: carregarIndustrias, loading, error }}>
      {children}
    </IndustriaContext.Provider>
  )
}

export function useIndustria() {
  const ctx = useContext(IndustriaContext)
  if (!ctx) throw new Error('useIndustria deve ser usado dentro de IndustriaProvider')
  return ctx
}
