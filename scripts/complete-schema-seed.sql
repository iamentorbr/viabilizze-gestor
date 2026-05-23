-- ============================================================
-- VIABILIZZE GESTÃO INDUSTRIAL — SCHEMA + SEED GERAÇÃO S
-- Execute este script COMPLETO no Supabase SQL Editor
-- ============================================================

-- ============================================================
-- EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA 1: INDUSTRIAS
-- ============================================================
CREATE TABLE IF NOT EXISTS industrias (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  nome          TEXT NOT NULL,
  tipo_industria TEXT DEFAULT 'bebidas',
  cnpj          TEXT,
  responsavel   TEXT,
  email         TEXT,
  telefone      TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA 2: FORMULACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS formulacoes (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industria_id           UUID NOT NULL REFERENCES industrias(id) ON DELETE CASCADE,
  codigo                 TEXT,
  nome                   TEXT NOT NULL,
  categoria              TEXT NOT NULL DEFAULT 'outro',
  norma_referencia       TEXT,
  observacoes            TEXT,
  brix_min               NUMERIC(6,3),
  brix_ideal             NUMERIC(6,3),
  brix_max               NUMERIC(6,3),
  ph_min                 NUMERIC(5,3),
  ph_ideal               NUMERIC(5,3),
  ph_max                 NUMERIC(5,3),
  acidez_min             NUMERIC(6,4),
  acidez_ideal           NUMERIC(6,4),
  acidez_max             NUMERIC(6,4),
  teor_polpa_minimo      NUMERIC(5,2),
  ativo                  BOOLEAN NOT NULL DEFAULT true,
  criado_em              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_formulacoes_industria ON formulacoes(industria_id);

-- ============================================================
-- TABELA 3: FORMULACAO_ITENS (ingredientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS formulacao_itens (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  formulacao_id         UUID NOT NULL REFERENCES formulacoes(id) ON DELETE CASCADE,
  materia_prima_id      UUID,
  nome_item             TEXT NOT NULL,
  tipo                  TEXT NOT NULL DEFAULT 'insumo',
  quantidade_por_1000l  NUMERIC(12,6) NOT NULL DEFAULT 0,
  unidade               TEXT NOT NULL DEFAULT 'kg',
  ordem_adicao          INTEGER DEFAULT 0,
  observacoes           TEXT,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_formulacao_itens_formulacao ON formulacao_itens(formulacao_id);

-- ============================================================
-- TABELA 4: MATERIAS_PRIMAS (estoque)
-- ============================================================
CREATE TABLE IF NOT EXISTS materias_primas (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industria_id      UUID NOT NULL REFERENCES industrias(id) ON DELETE CASCADE,
  nome              TEXT NOT NULL,
  codigo_interno    TEXT,
  fornecedor        TEXT,
  unidade           TEXT NOT NULL DEFAULT 'kg',
  estoque_atual     NUMERIC(14,4) NOT NULL DEFAULT 0,
  estoque_minimo    NUMERIC(14,4) NOT NULL DEFAULT 0,
  estoque_maximo    NUMERIC(14,4),
  preco_unitario    NUMERIC(10,4) DEFAULT 0,
  lote_atual        TEXT,
  validade_lote     DATE,
  localizacao       TEXT,
  ativo             BOOLEAN NOT NULL DEFAULT true,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materias_primas_industria ON materias_primas(industria_id);

-- ============================================================
-- TABELA 5: ORDENS_PRODUCAO
-- ============================================================
CREATE TABLE IF NOT EXISTS ordens_producao (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industria_id      UUID NOT NULL REFERENCES industrias(id) ON DELETE CASCADE,
  formulacao_id     UUID REFERENCES formulacoes(id) ON DELETE SET NULL,
  numero_ordem      TEXT NOT NULL,
  produto_nome      TEXT NOT NULL,
  volume_programado NUMERIC(12,2) NOT NULL,
  volume_produzido  NUMERIC(12,2),
  percentual_producao NUMERIC(5,2) DEFAULT 100,
  status            TEXT NOT NULL DEFAULT 'pendente',
  prioridade        TEXT DEFAULT 'normal',
  data_programada   DATE,
  data_inicio       TIMESTAMPTZ,
  data_fim          TIMESTAMPTZ,
  responsavel       TEXT,
  observacoes       TEXT,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ordens_industria ON ordens_producao(industria_id);

-- ============================================================
-- TABELA 6: ORDEM_ITENS (insumos calculados da ordem)
-- ============================================================
CREATE TABLE IF NOT EXISTS ordem_itens (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordem_id          UUID NOT NULL REFERENCES ordens_producao(id) ON DELETE CASCADE,
  nome_item         TEXT NOT NULL,
  quantidade_calculada NUMERIC(14,4) NOT NULL,
  quantidade_usada  NUMERIC(14,4),
  unidade           TEXT NOT NULL DEFAULT 'kg',
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ordem_itens_ordem ON ordem_itens(ordem_id);

-- ============================================================
-- TABELA 7: CONTROLE_QUALIDADE
-- ============================================================
CREATE TABLE IF NOT EXISTS controle_qualidade (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industria_id      UUID NOT NULL REFERENCES industrias(id) ON DELETE CASCADE,
  ordem_id          UUID REFERENCES ordens_producao(id) ON DELETE SET NULL,
  numero_lote       TEXT,
  data_analise      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  brix_medido       NUMERIC(6,3),
  ph_medido         NUMERIC(5,3),
  acidez_medida     NUMERIC(6,4),
  temperatura       NUMERIC(5,2),
  resultado         TEXT DEFAULT 'pendente',
  observacoes       TEXT,
  analista          TEXT,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_controle_qualidade_industria ON controle_qualidade(industria_id);

-- ============================================================
-- TABELA 8: MOVIMENTACOES_ESTOQUE
-- ============================================================
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  materia_prima_id  UUID NOT NULL REFERENCES materias_primas(id) ON DELETE CASCADE,
  tipo              TEXT NOT NULL,
  quantidade        NUMERIC(14,4) NOT NULL,
  ordem_id          UUID REFERENCES ordens_producao(id) ON DELETE SET NULL,
  documento         TEXT,
  observacoes       TEXT,
  usuario           TEXT,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movimentacoes_materia ON movimentacoes_estoque(materia_prima_id);

-- ============================================================
-- TABELA 9: TABELA_NUTRICIONAL
-- ============================================================
CREATE TABLE IF NOT EXISTS tabela_nutricional (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  formulacao_id     UUID NOT NULL REFERENCES formulacoes(id) ON DELETE CASCADE,
  porcao_ml         NUMERIC(8,2) DEFAULT 200,
  valor_energetico  NUMERIC(8,2),
  carboidratos      NUMERIC(8,2),
  acucares          NUMERIC(8,2),
  proteinas         NUMERIC(8,2),
  gorduras_totais   NUMERIC(8,2),
  gorduras_saturadas NUMERIC(8,2),
  gorduras_trans    NUMERIC(8,2),
  fibras            NUMERIC(8,2),
  sodio             NUMERIC(8,2),
  vitamina_c        NUMERIC(8,2),
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nutricional_formulacao ON tabela_nutricional(formulacao_id);

-- ============================================================
-- SEED: INDÚSTRIA GERAÇÃO S
-- ============================================================
INSERT INTO industrias (slug, nome, tipo_industria, responsavel)
VALUES ('geracao-s', 'Geração S', 'bebidas', 'Viabilizze')
ON CONFLICT (slug) DO UPDATE SET nome = 'Geração S';

-- ============================================================
-- SEED: FORMULAÇÃO PINK LEMONADE
-- ============================================================
WITH ind AS (
  SELECT id FROM industrias WHERE slug = 'geracao-s'
)
INSERT INTO formulacoes (industria_id, codigo, nome, categoria, observacoes)
SELECT id, 'PINK-001', 'Pink Lemonade', 'isotonico', 'Isotônico e funcional com colágeno, prebiótico e vitaminas. Total: 163,502 g/L'
FROM ind
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: INGREDIENTES PINK LEMONADE (10 itens)
-- Valores em g/L convertidos para kg/1000L
-- ============================================================
WITH form AS (
  SELECT f.id 
  FROM formulacoes f
  JOIN industrias i ON f.industria_id = i.id
  WHERE i.slug = 'geracao-s' AND f.codigo = 'PINK-001'
)
INSERT INTO formulacao_itens (formulacao_id, nome_item, tipo, quantidade_por_1000l, unidade, ordem_adicao, observacoes)
SELECT 
  form.id,
  item.nome_item,
  item.tipo,
  item.quantidade,
  item.unidade,
  item.ordem,
  item.obs
FROM form, (VALUES
  ('Colágeno Hidrolisado', 'aditivo', 67.209, 'kg', 1, 'Fornecedor: Rousselot'),
  ('Prebiótico', 'aditivo', 12.0, 'kg', 2, 'Fornecedor: Univar'),
  ('Suco Concentrado Maçã (70°B)', 'concentrado', 37.0, 'kg', 3, 'Fornecedor: Dohler'),
  ('Água de Coco Concentrada (60°B)', 'concentrado', 18.0, 'kg', 4, 'Fornecedor: Dikoko'),
  ('Suco Concentrado Limão (70°B)', 'concentrado', 15.633, 'kg', 5, 'Fornecedor: Dohler'),
  ('Suco Concentrado de Framboesa (65°B)', 'concentrado', 7.0, 'kg', 6, 'Fornecedor: Sunset'),
  ('Suco Concentrado de Uva 68°B', 'concentrado', 5.0, 'kg', 7, 'Fornecedor: Dohler'),
  ('SL077 - Aroma N Framboesa', 'aditivo', 1.0, 'kg', 8, 'Fornecedor: San Leon'),
  ('Ácido Ascórbico', 'acido', 0.52, 'kg', 9, 'Fornecedor: Vogler'),
  ('Steviose 100', 'aditivo', 0.14, 'kg', 10, 'Fornecedor: Almendra')
) AS item(nome_item, tipo, quantidade, unidade, ordem, obs);

-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================
SELECT 
  i.nome as industria,
  f.nome as formulacao,
  f.categoria,
  (SELECT COUNT(*) FROM formulacao_itens fi WHERE fi.formulacao_id = f.id) as total_ingredientes
FROM industrias i
JOIN formulacoes f ON f.industria_id = i.id
WHERE i.slug = 'geracao-s';
