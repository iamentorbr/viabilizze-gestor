'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Formulacao, Insumo } from '@/lib/types'

// ─── Hook: lista de formulações com insumos ───────────────────────────────
export function useFormulacoes(industriaId: string | null | undefined) {
  const [formulacoes, setFormulacoes] = useState<Formulacao[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!industriaId) {
      setFormulacoes([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: supaErr } = await supabase
        .from('formulacoes')
        .select(`
          *,
          insumos (*)
        `)
        .eq('industria_id', industriaId)
        .eq('ativo', true)
        .order('produto', { ascending: true })

      if (supaErr) throw supaErr

      const lista = (data ?? []) as (Formulacao & { insumos: Insumo[] })[]

      // ordenar insumos por campo `ordem`
      const listaNormalizada = lista.map(f => ({
        ...f,
        insumos: [...(f.insumos ?? [])].sort((a, b) => a.ordem - b.ordem),
      }))

      setFormulacoes(listaNormalizada)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar formulações'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [industriaId])

  useEffect(() => {
    carregar()
  }, [carregar])

  return { formulacoes, loading, error, recarregar: carregar }
}

// ─── Hook: formulação individual com insumos ──────────────────────────────
export function useFormulacao(formulacaoId: string | null | undefined) {
  const [formulacao, setFormulacao] = useState<Formulacao | null>(null)
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!formulacaoId) {
      setFormulacao(null)
      setInsumos([])
      return
    }

    setLoading(true)

    supabase
      .from('formulacoes')
      .select('*, insumos(*)')
      .eq('id', formulacaoId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setFormulacao(null)
          setInsumos([])
        } else {
          const f = data as Formulacao & { insumos: Insumo[] }
          setFormulacao(f)
          setInsumos([...(f.insumos ?? [])].sort((a, b) => a.ordem - b.ordem))
        }
        setLoading(false)
      })
  }, [formulacaoId])

  return { formulacao, insumos, loading }
}

// ─── Ações de formulação ──────────────────────────────────────────────────
export async function salvarFormulacao(
  formulacao: Omit<Formulacao, 'id' | 'criado_em' | 'atualizado_em' | 'insumos'>,
  insumos: Omit<Insumo, 'id' | 'formulacao_id' | 'criado_em' | 'atualizado_em'>[]
): Promise<{ formulacaoId: string | null; erro: string | null }> {
  try {
    const { data: fData, error: fErr } = await supabase
      .from('formulacoes')
      .insert(formulacao)
      .select()
      .single()

    if (fErr || !fData) throw fErr ?? new Error('Sem retorno da formulação')

    const formulacaoId = (fData as Formulacao).id

    if (insumos.length > 0) {
      const insumosComId = insumos.map(ins => ({
        ...ins,
        formulacao_id: formulacaoId,
      }))

      const { error: iErr } = await supabase
        .from('insumos')
        .insert(insumosComId)

      if (iErr) throw iErr
    }

    return { formulacaoId, erro: null }
  } catch (err: unknown) {
    return {
      formulacaoId: null,
      erro: err instanceof Error ? err.message : 'Erro ao salvar',
    }
  }
}

export async function excluirFormulacao(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('formulacoes')
    .update({ ativo: false })
    .eq('id', id)

  return !error
}

export async function duplicarFormulacao(
  formulacaoId: string,
  industriaId: string
): Promise<string | null> {
  // Buscar original com insumos
  const { data, error } = await supabase
    .from('formulacoes')
    .select('*, insumos(*)')
    .eq('id', formulacaoId)
    .single()

  if (error || !data) return null

  const original = data as Formulacao & { insumos: Insumo[] }

  const { formulacaoId: novoId } = await salvarFormulacao(
    {
      industria_id: industriaId,
      produto: `Cópia de ${original.produto}`,
      categoria: original.categoria,
      norma_referencia: original.norma_referencia,
      observacao: original.observacao,
      brix_min: original.brix_min,
      brix_ideal: original.brix_ideal,
      brix_max: original.brix_max,
      ph_min: original.ph_min,
      ph_ideal: original.ph_ideal,
      ph_max: original.ph_max,
      acidez_min: original.acidez_min,
      acidez_ideal: original.acidez_ideal,
      acidez_max: original.acidez_max,
      perc_suco_minimo_legal: original.perc_suco_minimo_legal,
      permite_acucar: original.permite_acucar,
      ativo: true,
    },
    original.insumos.map(ins => ({
      nome: ins.nome,
      tipo: ins.tipo,
      qtd_base_por_1000L: ins.qtd_base_por_1000L,
      unidade: ins.unidade,
      brix_insumo: ins.brix_insumo,
      fator_reconstituicao: ins.fator_reconstituicao,
      densidade_kg_L: ins.densidade_kg_L,
      acidez_natural: ins.acidez_natural,
      is_agua_qsp: ins.is_agua_qsp,
      preco_unitario_kg: ins.preco_unitario_kg,
      ordem: ins.ordem,
    }))
  )

  return novoId
}
