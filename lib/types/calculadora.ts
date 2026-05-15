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

// Tipos para Ordens de Produção
export interface OrdemProducao {
  id: string
  empresa_id: string
  codigo: string
  formulacao_id?: string
  produto: string
  volume_litros: number
  percentual_producao: number
  status: 'Aguardando' | 'Em Produção' | 'Concluído' | 'Cancelado'
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
  operador?: string
  observacao?: string
  data_programada?: string
  data_inicio?: string
  data_conclusao?: string
  custo_estimado?: number
  created_at: string
}

export interface OrdemInsumo {
  id: string
  ordem_id: string
  nome: string
  tipo?: string
  quantidade: number
  unidade: string
  custo_unitario?: number
  custo_total?: number
  created_at: string
}

export type OrdemProducaoInsert = Omit<OrdemProducao, 'id' | 'created_at'>
export type OrdemInsumoInsert = Omit<OrdemInsumo, 'id' | 'created_at'>

// Ordem com seus insumos calculados
export interface OrdemCompleta extends OrdemProducao {
  insumos: OrdemInsumo[]
  formulacao?: Formulacao
}

// Tipos para Análises de Qualidade
export interface AnaliseQualidade {
  id: string
  empresa_id: string
  codigo: string
  ordem_id?: string
  ordem_codigo?: string
  produto: string
  brix_medido?: number
  brix_min?: number
  brix_max?: number
  ph_medido?: number
  ph_min?: number
  ph_max?: number
  acidez_medida?: number
  acidez_min?: number
  acidez_max?: number
  resultado: 'Aguardando' | 'Aprovado' | 'Ajuste' | 'Reprovado'
  analista?: string
  observacao?: string
  data_analise: string
  created_at: string
}

export type AnaliseQualidadeInsert = Omit<AnaliseQualidade, 'id' | 'created_at'>

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
