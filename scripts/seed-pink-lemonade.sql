-- =====================================================
-- SEED: Pink Lemonade - Geração S
-- Isotônico e Funcional
-- =====================================================

-- 1. Criar indústria Geração S (se não existir)
INSERT INTO industrias (slug, nome, tipo_industria)
VALUES ('geracao-s', 'Geração S', 'bebidas')
ON CONFLICT (slug) DO NOTHING;

-- 2. Criar formulação Pink Lemonade
INSERT INTO formulacoes (industria_id, codigo, nome, categoria, observacoes, ativo)
SELECT 
  id,
  'PINK-001',
  'Pink Lemonade',
  'isotonico',
  'Isotônico e funcional com colágeno hidrolisado e prebiótico. Total: 163,502 g/L',
  true
FROM industrias 
WHERE slug = 'geracao-s'
ON CONFLICT DO NOTHING;

-- 3. Inserir ingredientes da formulação
-- Primeiro, obter o ID da formulação
DO $$
DECLARE
  v_formulacao_id uuid;
BEGIN
  SELECT id INTO v_formulacao_id 
  FROM formulacoes 
  WHERE codigo = 'PINK-001' 
  AND industria_id = (SELECT id FROM industrias WHERE slug = 'geracao-s');

  IF v_formulacao_id IS NOT NULL THEN
    -- Limpar itens existentes (caso re-execute)
    DELETE FROM formulacao_itens WHERE formulacao_id = v_formulacao_id;

    -- Inserir todos os ingredientes
    INSERT INTO formulacao_itens (formulacao_id, nome_item, tipo, quantidade_por_1000l, unidade, ordem_adicao, observacoes) VALUES
    (v_formulacao_id, 'Colágeno Hidrolisado', 'aditivo', 67.209, 'kg', 1, 'Fornecedor: Rousselot'),
    (v_formulacao_id, 'Prebiótico', 'aditivo', 12.000, 'kg', 2, 'Fornecedor: Univar'),
    (v_formulacao_id, 'Suco Concentrado Maçã (70°B)', 'polpa', 37.000, 'kg', 3, 'Fornecedor: Dohler'),
    (v_formulacao_id, 'Água de Coco Concentrada (60°B)', 'polpa', 18.000, 'kg', 4, 'Fornecedor: Dikoko'),
    (v_formulacao_id, 'Suco Concentrado Limão (70°B)', 'polpa', 15.633, 'kg', 5, 'Fornecedor: Dohler'),
    (v_formulacao_id, 'Suco Concentrado de Framboesa (65°B)', 'polpa', 7.000, 'kg', 6, 'Fornecedor: Sunset'),
    (v_formulacao_id, 'Suco Concentrado de Uva 68°B', 'polpa', 5.000, 'kg', 7, 'Fornecedor: Dohler'),
    (v_formulacao_id, 'SL077 - Aroma N Framboesa', 'aditivo', 1.000, 'kg', 8, 'Fornecedor: San Leon'),
    (v_formulacao_id, 'Ácido Ascórbico', 'aditivo', 0.520, 'kg', 9, 'Fornecedor: Vogler'),
    (v_formulacao_id, 'Steviose 100', 'aditivo', 0.140, 'kg', 10, 'Fornecedor: Almendra');

    RAISE NOTICE 'Pink Lemonade inserido com sucesso! ID: %', v_formulacao_id;
  ELSE
    RAISE NOTICE 'Formulação não encontrada';
  END IF;
END $$;

-- Verificar resultado
SELECT 
  f.nome as formulacao,
  fi.nome_item as ingrediente,
  fi.quantidade_por_1000l as "g/L",
  fi.observacoes as fornecedor
FROM formulacoes f
JOIN formulacao_itens fi ON fi.formulacao_id = f.id
WHERE f.codigo = 'PINK-001'
ORDER BY fi.ordem_adicao;
