// Tipos gerados do schema Supabase — Viabilizze Gestão Industrial
// Versão 1.0 | Maio 2026

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      industrias: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          responsavel: string | null
          email: string | null
          telefone: string | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          responsavel?: string | null
          email?: string | null
          telefone?: string | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          responsavel?: string | null
          email?: string | null
          telefone?: string | null
          ativo?: boolean
          atualizado_em?: string
        }
      }
      formulacoes: {
        Row: {
          id: string
          industria_id: string
          produto: string
          categoria: 'nectar' | 'suco' | 'refresco' | 'bebida_mista' | 'isotonica' | 'funcional' | 'outro'
          norma_referencia: string | null
          observacao: string | null
          brix_min: number | null
          brix_ideal: number | null
          brix_max: number | null
          ph_min: number | null
          ph_ideal: number | null
          ph_max: number | null
          acidez_min: number | null
          acidez_ideal: number | null
          acidez_max: number | null
          perc_suco_minimo_legal: number | null
          permite_acucar: boolean
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          industria_id: string
          produto: string
          categoria: 'nectar' | 'suco' | 'refresco' | 'bebida_mista' | 'isotonica' | 'funcional' | 'outro'
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
          permite_acucar?: boolean
          ativo?: boolean
        }
        Update: Partial<Database['public']['Tables']['formulacoes']['Insert']>
      }
      insumos: {
        Row: {
          id: string
          formulacao_id: string
          nome: string
          tipo: 'concentrado' | 'acucar' | 'aditivo' | 'acido' | 'espessante' | 'conservante' | 'agua' | 'outro'
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
        Insert: {
          id?: string
          formulacao_id: string
          nome: string
          tipo: 'concentrado' | 'acucar' | 'aditivo' | 'acido' | 'espessante' | 'conservante' | 'agua' | 'outro'
          qtd_base_por_1000L?: number
          unidade?: string
          brix_insumo?: number
          fator_reconstituicao?: number
          densidade_kg_L?: number
          acidez_natural?: number
          is_agua_qsp?: boolean
          preco_unitario_kg?: number
          ordem?: number
        }
        Update: Partial<Database['public']['Tables']['insumos']['Insert']>
      }
      materias_primas: {
        Row: {
          id: string
          industria_id: string
          nome: string
          codigo_interno: string | null
          fornecedor: string | null
          unidade: string
          estoque_atual: number
          estoque_minimo: number
          estoque_maximo: number | null
          brix_insumo: number
          densidade_kg_L: number
          preco_unitario: number
          moeda: string
          lote_atual: string | null
          validade_lote: string | null
          localizacao: string | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          industria_id: string
          nome: string
          codigo_interno?: string | null
          fornecedor?: string | null
          unidade?: string
          estoque_atual?: number
          estoque_minimo?: number
          estoque_maximo?: number | null
          brix_insumo?: number
          densidade_kg_L?: number
          preco_unitario?: number
          moeda?: string
          lote_atual?: string | null
          validade_lote?: string | null
          localizacao?: string | null
          ativo?: boolean
        }
        Update: Partial<Database['public']['Tables']['materias_primas']['Insert']>
      }
      ordens_producao: {
        Row: {
          id: string
          industria_id: string
          formulacao_id: string | null
          numero_ordem: string
          numero_lote: string | null
          volume_L: number
          perc_producao: number
          status: 'aguardando' | 'em_producao' | 'concluida' | 'aprovada' | 'reprovada' | 'cancelada'
          prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
          data_prevista: string | null
          data_inicio: string | null
          data_conclusao: string | null
          operador: string | null
          responsavel_qa: string | null
          custo_total_mp: number | null
          custo_por_litro: number | null
          observacoes: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          industria_id: string
          formulacao_id?: string | null
          numero_ordem?: string
          numero_lote?: string | null
          volume_L: number
          perc_producao?: number
          status?: 'aguardando' | 'em_producao' | 'concluida' | 'aprovada' | 'reprovada' | 'cancelada'
          prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente'
          data_prevista?: string | null
          operador?: string | null
          observacoes?: string | null
        }
        Update: Partial<Database['public']['Tables']['ordens_producao']['Insert']>
      }
      controle_qualidade: {
        Row: {
          id: string
          ordem_id: string
          industria_id: string
          brix_real: number | null
          ph_real: number | null
          acidez_real: number | null
          perc_suco_real: number | null
          turbidez: number | null
          cor: string | null
          aspecto_visual: string | null
          status: 'pendente' | 'aprovado' | 'aprovado_com_ajuste' | 'reprovado'
          conforme_brix: boolean | null
          conforme_ph: boolean | null
          conforme_acidez: boolean | null
          conforme_legal: boolean | null
          observacoes: string | null
          aprovado_por: string | null
          data_analise: string
          criado_em: string
        }
        Insert: {
          id?: string
          ordem_id: string
          industria_id: string
          brix_real?: number | null
          ph_real?: number | null
          acidez_real?: number | null
          perc_suco_real?: number | null
          status?: 'pendente' | 'aprovado' | 'aprovado_com_ajuste' | 'reprovado'
          observacoes?: string | null
          aprovado_por?: string | null
          data_analise?: string
        }
        Update: Partial<Database['public']['Tables']['controle_qualidade']['Insert']>
      }
      tabela_nutricional: {
        Row: {
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
          vitamina_c_mg: number | null
          vitamina_a_mcg: number | null
          calcio_mg: number | null
          ferro_mg: number | null
          potassio_mg: number | null
          lupa_acucar: boolean
          lupa_sodio: boolean
          lupa_gordura_sat: boolean
          lupa_gordura_trans: boolean
          aprovado: boolean
          aprovado_por: string | null
          data_aprovacao: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          formulacao_id: string
          industria_id: string
          porcao_ml?: number
          valor_energetico_kcal?: number
          valor_energetico_kj?: number
          carboidratos_g?: number
          acucares_totais_g?: number
          acucares_adicionados_g?: number
          proteinas_g?: number
          gorduras_totais_g?: number
          gorduras_saturadas_g?: number
          gorduras_trans_g?: number
          fibra_alimentar_g?: number
          sodio_mg?: number
          vitamina_c_mg?: number | null
        }
        Update: Partial<Database['public']['Tables']['tabela_nutricional']['Insert']>
      }
      movimentacoes_estoque: {
        Row: {
          id: string
          industria_id: string
          materia_prima_id: string
          ordem_id: string | null
          tipo: 'entrada' | 'saida' | 'ajuste' | 'perda'
          quantidade: number
          unidade: string
          estoque_antes: number | null
          estoque_depois: number | null
          lote_fornecedor: string | null
          nota_fiscal: string | null
          fornecedor: string | null
          motivo: string | null
          responsavel: string | null
          data_movimentacao: string
          criado_em: string
        }
        Insert: {
          id?: string
          industria_id: string
          materia_prima_id: string
          ordem_id?: string | null
          tipo: 'entrada' | 'saida' | 'ajuste' | 'perda'
          quantidade: number
          unidade?: string
          lote_fornecedor?: string | null
          nota_fiscal?: string | null
          fornecedor?: string | null
          motivo?: string | null
          responsavel?: string | null
          data_movimentacao?: string
        }
        Update: Partial<Database['public']['Tables']['movimentacoes_estoque']['Insert']>
      }
    }
    Views: {}
    Functions: {
      gerar_numero_ordem: {
        Args: { p_industria_id: string }
        Returns: string
      }
    }
    Enums: {}
  }
}
