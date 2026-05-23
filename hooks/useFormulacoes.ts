'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

export interface Insumo {
  id: string
  formulacao_id: string
  nome: string
  fornecedor?: string | null
  tipo: string
  qtd_base_por_1000L: number
  unidade: string
  brix_insumo: number
  fator_reconstituicao: number
  densidade_kg_L: number
  acidez_natural: number
  is_agua_qsp: boolean
  preco_unitario_kg: number
  ordem: number
}

export interface Formulacao {
  id: string
  industria_id: string
  produto: string
  categoria: string
  norma_referencia?: string | null
  observacao?: string | null
  volume_embalagem_ml?: number | null
  unidades_por_caixa?: number | null
  perc_perda_embalagem?: number | null
  perc_perda_formulacao?: number | null
  brix_min?: number | null
  brix_ideal?: number | null
  brix_max?: number | null
  ph_min?: number | null
  ph_ideal?: number | null
  ph_max?: number | null
  acidez_min?: number | null
  acidez_ideal?: number | null
  acidez_max?: number | null
  perc_suco_minimo_legal?: number | null
  ativo: boolean
  insumos?: Insumo[]
}

export function useFormulacoes(industriaId: string | null | undefined) {
  const [formulacoes, setFormulacoes] = useState<Formulacao[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!industriaId) { setFormulacoes([]); return }
    setLoading(true)
    setError(null)
    try {
      const { data, error: supaErr } = await getSupabase()
        .from('formulacoes')
        .select('*, insumos(*)')
        .eq('industria_id', industriaId)
        .eq('ativo', true)
        .order('produto', { ascending: true })
      if (supaErr) throw supaErr
      const lista = (data ?? []) as Formulacao[]
      setFormulacoes(lista.map(f => ({
        ...f,
        insumos: [...(f.insumos ?? [])].sort((a, b) => a.ordem - b.ordem),
      })))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar formulações')
    } finally {
      setLoading(false)
    }
  }, [industriaId])

  useEffect(() => { carregar() }, [carregar])

  return { formulacoes, loading, error, recarregar: carregar }
}
