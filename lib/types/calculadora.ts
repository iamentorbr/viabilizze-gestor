// Tipos para as tabelas do Supabase - Schema Viabilizze

// =============================================================================
// INDÚSTRIAS
// =============================================================================
export interface Industria {
  id: string
  slug: string
  nome: string
  cnpj?: string
  ie?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  telefone?: string
  email?: string
  responsavel_tecnico?: string
  registro_mapa?: string
  tipo_industria: string
  ativo: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// MATÉRIAS-PRIMAS
// =============================================================================
export interface MateriaPrima {
  id: string
  industria_id: string
  codigo?: string
  nome: string
  categoria: string
  unidade: string
  estoque_atual: number
  estoque_minimo: number
  estoque_maximo?: number
  preco_unitario?: number
  fornecedor?: string
  lote_atual?: string
  data_validade?: string
  brix?: number
  acidez?: number
  ph?: number
  densidade?: number
  fator_reconstituicao?: number
  observacoes?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// FORMULAÇÕES
// =============================================================================
export interface Formulacao {
  id: string
  industria_id: string
  codigo?: string
  nome: string
  categoria: string
  versao: number
  brix_min?: number
  brix_ideal?: number
  brix_max?: number
  ph_min?: number
  ph_ideal?: number
  ph_max?: number
  acidez_min?: number
  acidez_ideal?: number
  acidez_max?: number
  densidade?: number
  teor_polpa_minimo?: number
  norma_referencia?: string
  rendimento_esperado: number
  observacoes?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface FormulacaoItem {
  id: string
  formulacao_id: string
  materia_prima_id?: string
  nome_item: string
  tipo: string
  quantidade_por_1000l: number  // lowercase 'l' - Postgres normalizes column names
  unidade: string
  ordem_adicao: number
  observacoes?: string
  created_at: string
}

// Formulação com seus itens
export interface FormulacaoCompleta extends Formulacao {
  itens: FormulacaoItem[]
}

// =============================================================================
// ORDENS DE PRODUÇÃO
// =============================================================================
export interface OrdemProducao {
  id: string
  industria_id: string
  formulacao_id?: string
  numero_ordem: string
  produto_nome: string
  volume_programado: number
  volume_produzido?: number
  percentual_producao: number
  status: 'pendente' | 'em_producao' | 'pausada' | 'concluida' | 'cancelada'
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  operador?: string
  turno?: string
  lote?: string
  data_programada?: string
  data_inicio?: string
  data_conclusao?: string
  custo_estimado?: number
  custo_real?: number
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface OrdemItem {
  id: string
  ordem_id: string
  materia_prima_id?: string
  nome_item: string
  tipo?: string
  quantidade_calculada: number
  quantidade_utilizada?: number
  unidade: string
  custo_unitario?: number
  custo_total?: number
  lote_utilizado?: string
  created_at: string
}

// Ordem com seus itens
export interface OrdemCompleta extends OrdemProducao {
  itens: OrdemItem[]
  formulacao?: Formulacao
}

// =============================================================================
// CONTROLE DE QUALIDADE
// =============================================================================
export interface ControleQualidade {
  id: string
  industria_id: string
  ordem_id?: string
  numero_analise: string
  produto_nome: string
  lote?: string
  brix_medido?: number
  brix_min?: number
  brix_max?: number
  ph_medido?: number
  ph_min?: number
  ph_max?: number
  acidez_medida?: number
  acidez_min?: number
  acidez_max?: number
  densidade_medida?: number
  temperatura?: number
  cor?: string
  sabor?: string
  aroma?: string
  aparencia?: string
  resultado: 'pendente' | 'aprovado' | 'aprovado_restricao' | 'reprovado' | 'reprocessar'
  analista?: string
  observacoes?: string
  data_analise: string
  created_at: string
}

// =============================================================================
// TABELA NUTRICIONAL
// =============================================================================
export interface TabelaNutricional {
  id: string
  formulacao_id: string
  porcao_ml: number
  valor_energetico_kcal?: number
  carboidratos_g?: number
  acucares_totais_g?: number
  acucares_adicionados_g?: number
  proteinas_g?: number
  gorduras_totais_g?: number
  gorduras_saturadas_g?: number
  gorduras_trans_g?: number
  fibra_g?: number
  sodio_mg?: number
  vitamina_c_mg?: number
  created_at: string
  updated_at: string
}

// =============================================================================
// MOVIMENTAÇÕES DE ESTOQUE
// =============================================================================
export interface MovimentacaoEstoque {
  id: string
  industria_id: string
  materia_prima_id: string
  ordem_id?: string
  tipo: 'entrada' | 'saida' | 'ajuste' | 'devolucao'
  quantidade: number
  unidade: string
  estoque_anterior?: number
  estoque_posterior?: number
  custo_unitario?: number
  lote?: string
  documento?: string
  motivo?: string
  responsavel?: string
  data_movimentacao: string
  created_at: string
}

// =============================================================================
// TIPOS PARA INSERÇÃO (sem campos auto-gerados)
// =============================================================================
export type IndustriaInsert = Omit<Industria, 'id' | 'created_at' | 'updated_at'>
export type MateriaPrimaInsert = Omit<MateriaPrima, 'id' | 'created_at' | 'updated_at'>
export type FormulacaoInsert = Omit<Formulacao, 'id' | 'created_at' | 'updated_at'>
export type FormulacaoItemInsert = Omit<FormulacaoItem, 'id' | 'created_at'>
export type OrdemProducaoInsert = Omit<OrdemProducao, 'id' | 'created_at' | 'updated_at'>
export type OrdemItemInsert = Omit<OrdemItem, 'id' | 'created_at'>
export type ControleQualidadeInsert = Omit<ControleQualidade, 'id' | 'created_at'>
export type MovimentacaoEstoqueInsert = Omit<MovimentacaoEstoque, 'id' | 'created_at'>

// =============================================================================
// TIPOS AUXILIARES PARA CÁLCULOS
// =============================================================================
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
  quantidade_por_1000L: number
  unidade?: string
  brix?: number
  fator_reconstituicao?: number
  densidade?: number
  acidez?: number
  preco_unitario?: number
  is_agua?: boolean
  // Campos opcionais de parâmetros do produto
  brix_min?: number
  brix_ideal?: number
  brix_max?: number
  ph_min?: number
  ph_ideal?: number
  ph_max?: number
  teor_polpa_minimo?: number
}
