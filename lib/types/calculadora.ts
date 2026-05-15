// Tipos para as tabelas do Supabase - Calculadora de Formulação

export interface Formulacao {
  id: string
  empresa_id: string
  produto: string
  categoria: string
  norma_referencia?: string
  brix_min?: number
  brix_ideal?: number
  brix_max?: number
  ph_min?: number
  ph_ideal?: number
  ph_max?: number
  acidez_min?: number
  acidez_ideal?: number
  acidez_max?: number
  perc_suco_minimo_legal: number
  observacao?: string
  created_at: string
}

export interface Insumo {
  id: string
  formulacao_id: string
  nome: string
  tipo: string
  qtd_base_por_1000L: number
  unidade: string
  brix_insumo: number
  fator_reconstituicao: number
  densidade_kg_L: number
  acidez_natural: number
  preco_unitario_kg?: number
  is_agua_qsp: boolean
  created_at: string
}

// Tipos para inserção (sem campos auto-gerados)
export type FormulacaoInsert = Omit<Formulacao, 'id' | 'created_at'>
export type InsumoInsert = Omit<Insumo, 'id' | 'created_at'>

// Tipo para formulação com seus insumos
export interface FormulacaoCompleta extends Formulacao {
  insumos: Insumo[]
}

// Tipo para o resultado do cálculo
export interface ResultadoCalculo {
  insumo: string
  tipo: string
  qtdCalculada: number
  unidade: string
  custoEstimado?: number
}

// Tipo para upload de planilha
export interface PlanilhaRow {
  produto: string
  insumo: string
  tipo?: string
  qtd_base_por_1000L: number
  unidade?: string
  brix_insumo?: number
  fator_reconstituicao?: number
  densidade_kg_L?: number
  acidez_natural?: number
  preco_unitario_kg?: number
  is_agua_qsp?: boolean
  // Campos opcionais de parâmetros do produto
  brix_min?: number
  brix_ideal?: number
  brix_max?: number
  ph_min?: number
  ph_ideal?: number
  ph_max?: number
  perc_suco_minimo_legal?: number
}
