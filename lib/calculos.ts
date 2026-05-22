'use client'

import type {
  Formulacao,
  Insumo,
  InsumoCalculado,
  ResultadoCalculo,
} from './types'
import { buscarLimiteLegal } from './types'

// ─── Motor de Cálculo Principal ───────────────────────────────────────────
export function calcularFormulacao(
  formulacao: Formulacao,
  insumos: Insumo[],
  volumeL: number,
  percProducao: number
): ResultadoCalculo {
  if (!insumos.length || volumeL <= 0) {
    return gerarResultadoVazio()
  }

  const insumosOrdenados = [...insumos].sort((a, b) => a.ordem - b.ordem)
  const insumosNaoAgua = insumosOrdenados.filter(i => !i.is_agua_qsp)
  const insumoAgua = insumosOrdenados.find(i => i.is_agua_qsp)

  // ── CÁLCULO 1: Escalonamento proporcional ──────────────────────────────
  const insumosCalculados: InsumoCalculado[] = insumosNaoAgua.map(insumo => {
    const qtd_total = (insumo.qtd_base_por_1000L / 1000) * volumeL
    const qtd_ajustada = qtd_total * (percProducao / 100)
    return { ...insumo, qtd_total, qtd_ajustada }
  })

  // ── CÁLCULO 2: Água QSP ────────────────────────────────────────────────
  // volume ocupado pelos outros insumos (kg → L via densidade)
  const volumeOutrosL = insumosCalculados.reduce((acc, ins) => {
    const densidadeUsar = ins.densidade_kg_L > 0 ? ins.densidade_kg_L : 1.0
    return acc + ins.qtd_total / densidadeUsar
  }, 0)

  const agua_qsp_L = volumeL - volumeOutrosL
  const agua_qsp_ajustada_L = agua_qsp_L * (percProducao / 100)
  const qsp_negativo = agua_qsp_L < 0

  // Adicionar insumo de água calculado à lista
  if (insumoAgua) {
    insumosCalculados.push({
      ...insumoAgua,
      qtd_total: agua_qsp_L,
      qtd_ajustada: agua_qsp_ajustada_L,
    })
  }

  // ── CÁLCULO 3: Brix do produto final ──────────────────────────────────
  const somaBrixKg = insumosCalculados.reduce((acc, ins) => {
    return acc + ins.qtd_total * ins.brix_insumo
  }, 0)
  const brix_final = volumeL > 0 ? somaBrixKg / volumeL / 10 : 0

  // ── CÁLCULO 4: % de suco ───────────────────────────────────────────────
  const sucoEquivalenteL = insumosCalculados
    .filter(i => i.tipo === 'concentrado')
    .reduce((acc, ins) => {
      const dens = ins.densidade_kg_L > 0 ? ins.densidade_kg_L : 1.0
      return acc + (ins.qtd_total / dens) * ins.fator_reconstituicao
    }, 0)
  const perc_suco = volumeL > 0 ? (sucoEquivalenteL / volumeL) * 100 : 0

  // ── CÁLCULO 5: Acidez titulável estimada ──────────────────────────────
  const acidezTotalG = insumosCalculados.reduce((acc, ins) => {
    if (ins.acidez_natural <= 0) return acc
    return acc + ins.qtd_total * 1000 * (ins.acidez_natural / 100)
  }, 0)
  const acidez_estimada_g100mL =
    volumeL > 0 ? acidezTotalG / (volumeL * 1000) * 100 : 0

  // ── CÁLCULO 6: Custo do lote ──────────────────────────────────────────
  const custo_total_mp = insumosCalculados.reduce((acc, ins) => {
    if (ins.preco_unitario_kg <= 0 || ins.is_agua_qsp) return acc
    return acc + ins.qtd_total * ins.preco_unitario_kg
  }, 0)
  const custo_por_litro = volumeL > 0 ? custo_total_mp / volumeL : 0

  // ── CÁLCULO 7: Conformidade legal ─────────────────────────────────────
  const limite = buscarLimiteLegal(formulacao.produto)

  const conforme_perc_suco = limite
    ? perc_suco >= limite.minSuco
    : true
  const conforme_brix = limite?.minBrix
    ? brix_final >= limite.minBrix
    : true
  const conforme_geral = conforme_perc_suco && conforme_brix

  // nível de alerta
  let alerta_nivel: 'ok' | 'atencao' | 'reprovado' = 'ok'
  if (!conforme_geral) {
    alerta_nivel = 'reprovado'
  } else if (limite) {
    const dentroMargem =
      (limite.minSuco > 0 && perc_suco < limite.minSuco * 1.05) ||
      (limite.minBrix && brix_final < limite.minBrix * 1.05)
    if (dentroMargem) alerta_nivel = 'atencao'
  }

  // alerta açúcar em suco integral
  const acucar_em_suco_integral =
    formulacao.categoria === 'suco' &&
    insumosCalculados.some(
      i => i.tipo === 'acucar' && i.qtd_total > 0
    )

  return {
    insumos: insumosCalculados,
    agua_qsp_L,
    agua_qsp_ajustada_L,
    brix_final,
    perc_suco,
    acidez_estimada_g100mL,
    custo_total_mp,
    custo_por_litro,
    conforme_brix,
    conforme_perc_suco,
    conforme_geral,
    alerta_nivel,
    qsp_negativo,
    acucar_em_suco_integral,
  }
}

function gerarResultadoVazio(): ResultadoCalculo {
  return {
    insumos: [],
    agua_qsp_L: 0,
    agua_qsp_ajustada_L: 0,
    brix_final: 0,
    perc_suco: 0,
    acidez_estimada_g100mL: 0,
    custo_total_mp: 0,
    custo_por_litro: 0,
    conforme_brix: true,
    conforme_perc_suco: true,
    conforme_geral: true,
    alerta_nivel: 'ok',
    qsp_negativo: false,
    acucar_em_suco_integral: false,
  }
}

// ─── Verificação de faixa de parâmetro ────────────────────────────────────
export type StatusFaixa = 'ok' | 'atencao' | 'fora'

export function verificarFaixa(
  valor: number,
  min: number | null | undefined,
  max: number | null | undefined
): StatusFaixa {
  if (min == null || max == null) return 'ok'
  if (valor < min || valor > max) return 'fora'
  return 'ok'
}

export function verificarFaixaComIdeal(
  valor: number,
  min: number | null | undefined,
  ideal: number | null | undefined,
  max: number | null | undefined
): StatusFaixa {
  if (min == null || max == null) return 'ok'
  if (valor < min || valor > max) return 'fora'
  if (ideal != null) {
    const tolerancia = (max - min) * 0.15
    if (Math.abs(valor - ideal) > tolerancia) return 'atencao'
  }
  return 'ok'
}
