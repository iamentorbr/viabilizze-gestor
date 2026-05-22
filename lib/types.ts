// Tipos de domínio — Viabilizze Gestão Industrial

// ─── Indústria ─────────────────────────────────────────────────────────────
export interface Industria {
  id: string
  nome: string
  cnpj?: string | null
  responsavel?: string | null
  email?: string | null
  telefone?: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

// ─── Formulação ────────────────────────────────────────────────────────────
export type CategoriaFormulacao =
  | 'nectar'
  | 'suco'
  | 'refresco'
  | 'bebida_mista'
  | 'isotonica'
  | 'funcional'
  | 'outro'

export interface Formulacao {
  id: string
  industria_id: string
  produto: string
  categoria: CategoriaFormulacao
  norma_referencia?: string | null
  observacao?: string | null
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
  permite_acucar: boolean
  ativo: boolean
  criado_em: string
  atualizado_em: string
  // join virtual
  insumos?: Insumo[]
}

// ─── Insumo ────────────────────────────────────────────────────────────────
export type TipoInsumo =
  | 'concentrado'
  | 'acucar'
  | 'aditivo'
  | 'acido'
  | 'espessante'
  | 'conservante'
  | 'agua'
  | 'outro'

export interface Insumo {
  id: string
  formulacao_id: string
  nome: string
  tipo: TipoInsumo
  qtd_base_por_1000L: number
  unidade: string
  brix_insumo: number
  fator_reconstituicao: number
  densidade_kg_L: number
  acidez_natural: number
  is_agua_qsp: boolean
  preco_unitario_kg: number
  ordem: number
  criado_em: string
  atualizado_em: string
}

// ─── Matéria-Prima ─────────────────────────────────────────────────────────
export interface MateriaPrima {
  id: string
  industria_id: string
  nome: string
  codigo_interno?: string | null
  fornecedor?: string | null
  unidade: string
  estoque_atual: number
  estoque_minimo: number
  estoque_maximo?: number | null
  brix_insumo: number
  densidade_kg_L: number
  preco_unitario: number
  moeda: string
  lote_atual?: string | null
  validade_lote?: string | null
  localizacao?: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
  // virtual — calculado
  status_estoque?: 'normal' | 'baixo' | 'critico'
}

// ─── Ordem de Produção ─────────────────────────────────────────────────────
export type StatusOrdem =
  | 'aguardando'
  | 'em_producao'
  | 'concluida'
  | 'aprovada'
  | 'reprovada'
  | 'cancelada'

export type PrioridadeOrdem = 'baixa' | 'normal' | 'alta' | 'urgente'

export interface OrdemProducao {
  id: string
  industria_id: string
  formulacao_id?: string | null
  numero_ordem: string
  numero_lote?: string | null
  volume_L: number
  perc_producao: number
  status: StatusOrdem
  prioridade: PrioridadeOrdem
  data_prevista?: string | null
  data_inicio?: string | null
  data_conclusao?: string | null
  operador?: string | null
  responsavel_qa?: string | null
  custo_total_mp?: number | null
  custo_por_litro?: number | null
  observacoes?: string | null
  criado_em: string
  atualizado_em: string
  // joins virtuais
  formulacao?: Formulacao
}

// ─── Controle de Qualidade ─────────────────────────────────────────────────
export type StatusQualidade =
  | 'pendente'
  | 'aprovado'
  | 'aprovado_com_ajuste'
  | 'reprovado'

export interface ControleQualidade {
  id: string
  ordem_id: string
  industria_id: string
  brix_real?: number | null
  ph_real?: number | null
  acidez_real?: number | null
  perc_suco_real?: number | null
  turbidez?: number | null
  cor?: string | null
  aspecto_visual?: string | null
  status: StatusQualidade
  conforme_brix?: boolean | null
  conforme_ph?: boolean | null
  conforme_acidez?: boolean | null
  conforme_legal?: boolean | null
  observacoes?: string | null
  aprovado_por?: string | null
  data_analise: string
  criado_em: string
}

// ─── Tabela Nutricional ────────────────────────────────────────────────────
export interface TabelaNutricional {
  id: string
  formulacao_id: string
  industria_id: string
  porcao_ml: number
  valor_energetico_kcal: number
  valor_energetico_kj: number
  carboidratos_g: number
  acucares_totais_g: number
  acucares_adicionados_g: number
  proteinas_g: number
  gorduras_totais_g: number
  gorduras_saturadas_g: number
  gorduras_trans_g: number
  fibra_alimentar_g: number
  sodio_mg: number
  vitamina_c_mg?: number | null
  vitamina_a_mcg?: number | null
  calcio_mg?: number | null
  ferro_mg?: number | null
  potassio_mg?: number | null
  lupa_acucar: boolean
  lupa_sodio: boolean
  lupa_gordura_sat: boolean
  lupa_gordura_trans: boolean
  aprovado: boolean
  aprovado_por?: string | null
  data_aprovacao?: string | null
  criado_em: string
  atualizado_em: string
}

// ─── Movimentação de Estoque ───────────────────────────────────────────────
export type TipoMovimentacao = 'entrada' | 'saida' | 'ajuste' | 'perda'

export interface MovimentacaoEstoque {
  id: string
  industria_id: string
  materia_prima_id: string
  ordem_id?: string | null
  tipo: TipoMovimentacao
  quantidade: number
  unidade: string
  estoque_antes?: number | null
  estoque_depois?: number | null
  lote_fornecedor?: string | null
  nota_fiscal?: string | null
  fornecedor?: string | null
  motivo?: string | null
  responsavel?: string | null
  data_movimentacao: string
  criado_em: string
  // join virtual
  materia_prima?: MateriaPrima
}

// ─── Calculadora (apenas frontend — nunca persiste diretamente) ────────────
export interface InsumoCalculado extends Insumo {
  qtd_total: number       // qtd escalonada para o volume
  qtd_ajustada: number    // qtd × (% produção / 100)
}

export interface ResultadoCalculo {
  insumos: InsumoCalculado[]
  agua_qsp_L: number
  agua_qsp_ajustada_L: number
  brix_final: number
  perc_suco: number
  acidez_estimada_g100mL: number
  custo_total_mp: number
  custo_por_litro: number
  // conformidade
  conforme_brix: boolean
  conforme_perc_suco: boolean
  conforme_geral: boolean
  alerta_nivel: 'ok' | 'atencao' | 'reprovado'
  // erros
  qsp_negativo: boolean
  acucar_em_suco_integral: boolean
}

// ─── Legislação (banco interno — não persiste no Supabase) ────────────────
export interface LimiteLegal {
  minSuco: number
  minBrix: number | null
  norma: string
}

export const LIMITES_LEGAIS: Record<string, LimiteLegal> = {
  'nectar de caju':      { minSuco: 10,  minBrix: 11.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de goiaba':    { minSuco: 35,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de manga':     { minSuco: 35,  minBrix: 11.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de maracuja':  { minSuco: 25,  minBrix: 11.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de acerola':   { minSuco: 15,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de graviola':  { minSuco: 25,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de cupuacu':   { minSuco: 20,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de abacaxi':   { minSuco: 30,  minBrix: 11.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de pessego':   { minSuco: 40,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de umbu':      { minSuco: 30,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de siriguela': { minSuco: 25,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'nectar de pitanga':   { minSuco: 25,  minBrix: 10.0, norma: 'IN MAPA nº 14/2018' },
  'suco integral':       { minSuco: 100, minBrix: null,  norma: 'Decreto 6871/2009'  },
  'refresco':            { minSuco: 10,  minBrix: 4.0,  norma: 'IN MAPA nº 14/2018' },
  'bebida mista':        { minSuco: 5,   minBrix: null,  norma: 'IN MAPA nº 14/2018' },
}

// ─── Utilitário de lookup com normalização ─────────────────────────────────
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function buscarLimiteLegal(nomeProduto: string): LimiteLegal | null {
  const normalizado = normalizarTexto(nomeProduto)
  // match exato
  if (LIMITES_LEGAIS[normalizado]) return LIMITES_LEGAIS[normalizado]
  // match parcial
  for (const chave of Object.keys(LIMITES_LEGAIS)) {
    if (normalizado.includes(chave) || chave.includes(normalizado)) {
      return LIMITES_LEGAIS[chave]
    }
  }
  return null
}

// ─── Formatação numérica BR ────────────────────────────────────────────────
export function formatarBR(valor: number, casas = 3): string {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
