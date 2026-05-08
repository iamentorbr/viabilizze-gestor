export interface Ingredient {
  name: string
  per1000L: number
  unit: string
  isQSP?: boolean
  obs?: string
}

export interface Specification {
  brixMin: number
  brixMax: number
  acidezMin: number
  acidezMax: number
  phMin: number
  phMax: number
  polpaMin?: number   // % mínima de polpa/suco exigida pela legislação
  polpaMax?: number
  legislacao?: string // norma de referência
}

export interface Formula {
  fruta: string
  tipoProduto: string // "Néctar" | "Suco" | "Refresco"
  concentradoBrix?: number  // brix da polpa/concentrado de entrada
  ingredients: Ingredient[]
  specifications: Specification
  observacoes?: string
}

// ──────────────────────────────────────────────────────────────
// Mínimos de polpa/suco conforme IN MAPA (Decreto 6.871/2009 e
// Instruções Normativas de Padrão de Identidade e Qualidade)
// ──────────────────────────────────────────────────────────────
export const formulas: Formula[] = [
  {
    fruta: "Uva",
    tipoProduto: "Néctar",
    concentradoBrix: 68,
    ingredients: [
      { name: "Suco Concentrado de Uva 68° Brix", per1000L: 43.8, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",            per1000L: 80.0, unit: "kg" },
      { name: "Aroma Natural de Uva",                per1000L: 0.3,  unit: "kg" },
      { name: "Ácido Cítrico",                        per1000L: 0.10, unit: "kg" },
      { name: "Ácido Ascórbico",                      per1000L: 0.20, unit: "kg" },
      { name: "Água",                                  per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 14.0, brixMax: 16.0,
      acidezMin: 0.40, acidezMax: 0.70,
      phMin: 3.0, phMax: 3.8,
      polpaMin: 30,
      legislacao: "IN MAPA nº 14/2018 — Padrão de Identidade e Qualidade para Néctares (Uva: mín. 30% suco)",
    },
    observacoes: "O néctar de uva deve conter no mínimo 30% de suco de uva integral.",
  },
  {
    fruta: "Laranja",
    tipoProduto: "Néctar",
    concentradoBrix: 65,
    ingredients: [
      { name: "Suco Concentrado de Laranja 65° Brix", per1000L: 46.2, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",               per1000L: 65.0, unit: "kg" },
      { name: "Aroma Natural de Laranja",               per1000L: 0.3,  unit: "kg" },
      { name: "Ácido Cítrico",                           per1000L: 0.12, unit: "kg" },
      { name: "Ácido Ascórbico",                         per1000L: 0.20, unit: "kg" },
      { name: "Água",                                     per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.5, brixMax: 11.5,
      acidezMin: 0.35, acidezMax: 0.55,
      phMin: 3.2, phMax: 3.8,
      polpaMin: 50,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Laranja: mín. 50% suco",
    },
    observacoes: "Néctar de laranja: mínimo 50% de suco de laranja integral (v/v).",
  },
  {
    fruta: "Maçã",
    tipoProduto: "Néctar",
    concentradoBrix: 70,
    ingredients: [
      { name: "Suco Concentrado de Maçã 70° Brix", per1000L: 42.9, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",             per1000L: 70.0, unit: "kg" },
      { name: "Aroma Natural de Maçã",               per1000L: 0.3,  unit: "kg" },
      { name: "Ácido Málico",                         per1000L: 0.10, unit: "kg" },
      { name: "Ácido Ascórbico",                       per1000L: 0.20, unit: "kg" },
      { name: "Água",                                   per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 11.0, brixMax: 12.0,
      acidezMin: 0.20, acidezMax: 0.40,
      phMin: 3.3, phMax: 3.9,
      polpaMin: 50,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Maçã: mín. 50% suco",
    },
    observacoes: "O ácido de referência para maçã é o ácido málico (em g/100 mL).",
  },
  {
    fruta: "Morango",
    tipoProduto: "Néctar",
    concentradoBrix: 10,
    ingredients: [
      { name: "Polpa de Morango 10° Brix",  per1000L: 300.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",    per1000L: 105.0, unit: "kg" },
      { name: "Aroma Natural de Morango",   per1000L: 0.4,   unit: "kg" },
      { name: "Ácido Cítrico",               per1000L: 0.15,  unit: "kg" },
      { name: "Ácido Ascórbico",             per1000L: 0.20,  unit: "kg" },
      { name: "Goma Xantana",               per1000L: 0.5,   unit: "kg" },
      { name: "Água",                         per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.0, brixMax: 11.0,
      acidezMin: 0.25, acidezMax: 0.45,
      phMin: 3.0, phMax: 3.5,
      polpaMin: 30,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Morango: mín. 30% polpa",
    },
    observacoes: "Néctar de morango deve conter no mínimo 30% de polpa (m/m).",
  },
  {
    fruta: "Melancia",
    tipoProduto: "Néctar",
    concentradoBrix: 8,
    ingredients: [
      { name: "Polpa de Melancia 8° Brix",  per1000L: 350.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",    per1000L: 90.0,  unit: "kg" },
      { name: "Aroma Natural de Melancia",  per1000L: 0.4,   unit: "kg" },
      { name: "Ácido Cítrico",               per1000L: 0.12,  unit: "kg" },
      { name: "Ácido Ascórbico",             per1000L: 0.20,  unit: "kg" },
      { name: "Água",                         per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 9.0, brixMax: 10.5,
      acidezMin: 0.10, acidezMax: 0.25,
      phMin: 3.5, phMax: 4.2,
      polpaMin: 35,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Melancia: mín. 35% polpa",
    },
    observacoes: "Melancia tem acidez naturalmente baixa; monitorar pH para garantir estabilidade microbiológica.",
  },
  {
    fruta: "Abacaxi",
    tipoProduto: "Néctar",
    concentradoBrix: 60,
    ingredients: [
      { name: "Suco Concentrado de Abacaxi 60° Brix", per1000L: 50.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",               per1000L: 100.0,unit: "kg" },
      { name: "Aroma Natural de Abacaxi",              per1000L: 0.4,  unit: "kg" },
      { name: "Ácido Cítrico",                          per1000L: 0.15, unit: "kg" },
      { name: "Ácido Ascórbico",                        per1000L: 0.20, unit: "kg" },
      { name: "Água",                                    per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 11.0, brixMax: 12.5,
      acidezMin: 0.30, acidezMax: 0.50,
      phMin: 3.2, phMax: 3.7,
      polpaMin: 30,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Abacaxi: mín. 30% suco",
    },
  },
  {
    fruta: "Maracujá",
    tipoProduto: "Néctar",
    concentradoBrix: 50,
    ingredients: [
      { name: "Suco Concentrado de Maracujá 50° Brix", per1000L: 50.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",                per1000L: 140.0,unit: "kg" },
      { name: "Aroma Natural de Maracujá",              per1000L: 0.6,  unit: "kg" },
      { name: "Goma Xantana",                            per1000L: 0.8,  unit: "kg" },
      { name: "Ácido Ascórbico",                         per1000L: 0.20, unit: "kg" },
      { name: "Ácido Cítrico",                            per1000L: 0.25, unit: "kg" },
      { name: "Água",                                     per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 11.0, brixMax: 11.5,
      acidezMin: 0.35, acidezMax: 0.40,
      phMin: 2.8, phMax: 3.2,
      polpaMin: 25,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Maracujá: mín. 25% polpa",
    },
    observacoes: "Maracujá tem acidez elevada; o balanço açúcar/ácido é crítico para a percepção sensorial.",
  },
  {
    fruta: "Goiaba",
    tipoProduto: "Néctar",
    concentradoBrix: 8,
    ingredients: [
      { name: "Polpa de Goiaba 8° Brix",   per1000L: 140.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",   per1000L: 130.0, unit: "kg" },
      { name: "Aroma Natural de Goiaba",   per1000L: 0.35,  unit: "kg" },
      { name: "Goma Xantana",              per1000L: 0.9,   unit: "kg" },
      { name: "Ácido Ascórbico",            per1000L: 0.20,  unit: "kg" },
      { name: "Ácido Cítrico",              per1000L: 0.12,  unit: "kg" },
      { name: "Água",                        per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.5, brixMax: 11.0,
      acidezMin: 0.20, acidezMax: 0.25,
      phMin: 3.3, phMax: 3.6,
      polpaMin: 30,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Goiaba: mín. 30% polpa",
    },
  },
  {
    fruta: "Manga",
    tipoProduto: "Néctar",
    concentradoBrix: 14,
    ingredients: [
      { name: "Polpa de Manga 14° Brix",   per1000L: 100.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",   per1000L: 115.0, unit: "kg" },
      { name: "Aroma Natural de Manga",    per1000L: 0.4,   unit: "kg" },
      { name: "Goma Xantana",              per1000L: 1.0,   unit: "kg" },
      { name: "Ácido Ascórbico",            per1000L: 0.20,  unit: "kg" },
      { name: "Ácido Cítrico",              per1000L: 0.18,  unit: "kg" },
      { name: "Água",                        per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 11.0, brixMax: 11.5,
      acidezMin: 0.22, acidezMax: 0.26,
      phMin: 3.2, phMax: 3.5,
      polpaMin: 35,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Manga: mín. 35% polpa",
    },
  },
  {
    fruta: "Pêssego",
    tipoProduto: "Néctar",
    concentradoBrix: 12,
    ingredients: [
      { name: "Polpa de Pêssego 12° Brix", per1000L: 120.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",   per1000L: 110.0, unit: "kg" },
      { name: "Aroma Natural de Pêssego",  per1000L: 0.35,  unit: "kg" },
      { name: "Goma Xantana",              per1000L: 0.8,   unit: "kg" },
      { name: "Ácido Ascórbico",            per1000L: 0.20,  unit: "kg" },
      { name: "Ácido Cítrico",              per1000L: 0.14,  unit: "kg" },
      { name: "Água",                        per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.5, brixMax: 11.5,
      acidezMin: 0.18, acidezMax: 0.28,
      phMin: 3.3, phMax: 3.8,
      polpaMin: 30,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Pêssego: mín. 30% polpa",
    },
  },
  {
    fruta: "Tangerina",
    tipoProduto: "Néctar",
    concentradoBrix: 62,
    ingredients: [
      { name: "Suco Concentrado de Tangerina 62° Brix", per1000L: 48.4, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",                per1000L: 75.0, unit: "kg" },
      { name: "Aroma Natural de Tangerina",             per1000L: 0.3,  unit: "kg" },
      { name: "Ácido Cítrico",                           per1000L: 0.12, unit: "kg" },
      { name: "Ácido Ascórbico",                         per1000L: 0.20, unit: "kg" },
      { name: "Água",                                     per1000L: 0,    unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.0, brixMax: 11.5,
      acidezMin: 0.30, acidezMax: 0.50,
      phMin: 3.2, phMax: 3.8,
      polpaMin: 50,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Tangerina: mín. 50% suco",
    },
  },
  {
    fruta: "Caju",
    tipoProduto: "Néctar",
    concentradoBrix: 28,
    ingredients: [
      { name: "Suco Concentrado de Caju 28° Brix", per1000L: 78.6,  unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",            per1000L: 122.0, unit: "kg" },
      { name: "Aroma Natural de Caju",              per1000L: 0.5,   unit: "kg" },
      { name: "Goma Xantana",                        per1000L: 1.16,  unit: "kg" },
      { name: "Ácido Ascórbico",                     per1000L: 0.20,  unit: "kg" },
      { name: "Ácido Cítrico",                        per1000L: 0.15,  unit: "kg" },
      { name: "Água",                                 per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 11.45, brixMax: 11.65,
      acidezMin: 0.24, acidezMax: 0.28,
      phMin: 3.1, phMax: 3.45,
      polpaMin: 10,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Caju: mín. 10% suco",
    },
    observacoes: "Caju tem alto teor de vitamina C natural. Monitorar oxidação durante o processo.",
  },
  {
    fruta: "Acerola",
    tipoProduto: "Néctar",
    concentradoBrix: 14,
    ingredients: [
      { name: "Polpa de Acerola 14° Brix",  per1000L: 100.0, unit: "kg" },
      { name: "Açúcar Líquido 76° Brix",    per1000L: 130.0, unit: "kg" },
      { name: "Aroma Natural de Acerola",   per1000L: 0.3,   unit: "kg" },
      { name: "Goma Xantana",               per1000L: 0.7,   unit: "kg" },
      { name: "Ácido Ascórbico",             per1000L: 0.10,  unit: "kg", obs: "Acerola já possui vitamina C natural" },
      { name: "Ácido Cítrico",               per1000L: 0.20,  unit: "kg" },
      { name: "Água",                         per1000L: 0,     unit: "kg", isQSP: true },
    ],
    specifications: {
      brixMin: 10.5, brixMax: 11.5,
      acidezMin: 0.40, acidezMax: 0.60,
      phMin: 2.9, phMax: 3.4,
      polpaMin: 10,
      legislacao: "IN MAPA nº 14/2018 — Néctar de Acerola: mín. 10% polpa",
    },
    observacoes: "Acerola é naturalmente rica em vitamina C (1.000–4.000 mg/100g). Reduzir adição de ácido ascórbico externo conforme análise da polpa.",
  },
]

// ────────────────────────────────────────────────────────────
// Dados para CÁLCULO DE PROPORÇÃO (diluição de concentrado)
// ────────────────────────────────────────────────────────────
export interface ProporcaoItem {
  fruta: string
  brixConcentrado: number   // brix do concentrado/polpa de entrada
  brixFinalNectar: number   // brix alvo do néctar finalizado
  fatorDiluicao: number     // quantas partes de água por parte de concentrado
  percPolpaLegal: number    // % mínima exigida por lei
}

export const proporcoes: ProporcaoItem[] = [
  { fruta: "Uva",       brixConcentrado: 68, brixFinalNectar: 15.0, fatorDiluicao: 3.53, percPolpaLegal: 30 },
  { fruta: "Laranja",   brixConcentrado: 65, brixFinalNectar: 11.0, fatorDiluicao: 4.91, percPolpaLegal: 50 },
  { fruta: "Maçã",      brixConcentrado: 70, brixFinalNectar: 11.5, fatorDiluicao: 5.09, percPolpaLegal: 50 },
  { fruta: "Morango",   brixConcentrado: 10, brixFinalNectar: 10.5, fatorDiluicao: 0.05, percPolpaLegal: 30 },
  { fruta: "Melancia",  brixConcentrado: 8,  brixFinalNectar: 9.5,  fatorDiluicao: 0.19, percPolpaLegal: 35 },
  { fruta: "Abacaxi",   brixConcentrado: 60, brixFinalNectar: 11.5, fatorDiluicao: 4.22, percPolpaLegal: 30 },
  { fruta: "Maracujá",  brixConcentrado: 50, brixFinalNectar: 11.2, fatorDiluicao: 3.47, percPolpaLegal: 25 },
  { fruta: "Goiaba",    brixConcentrado: 8,  brixFinalNectar: 10.8, fatorDiluicao: 0.35, percPolpaLegal: 30 },
  { fruta: "Manga",     brixConcentrado: 14, brixFinalNectar: 11.2, fatorDiluicao: 0.25, percPolpaLegal: 35 },
  { fruta: "Pêssego",   brixConcentrado: 12, brixFinalNectar: 11.0, fatorDiluicao: 0.09, percPolpaLegal: 30 },
  { fruta: "Tangerina", brixConcentrado: 62, brixFinalNectar: 10.8, fatorDiluicao: 4.74, percPolpaLegal: 50 },
  { fruta: "Caju",      brixConcentrado: 28, brixFinalNectar: 11.5, fatorDiluicao: 1.43, percPolpaLegal: 10 },
  { fruta: "Acerola",   brixConcentrado: 14, brixFinalNectar: 11.0, fatorDiluicao: 0.27, percPolpaLegal: 10 },
]

// ────────────────────────────────────────────────────────────
// Dados para FORMULAÇÃO PARA REGISTRO (declaração de ingredientes)
// ────────────────────────────────────────────────────────────
export interface IngredienteRegistro {
  nome: string
  funcao: string // "Ingrediente Principal" | "Acidulante" | "Conservador" | etc.
  numeroCas?: string
  ins?: string   // número INS do aditivo
  limiteMaximo?: string
  legislacaoPermissao?: string
}

export const ingredientesRegistro: IngredienteRegistro[] = [
  { nome: "Polpa / Suco Concentrado de Fruta", funcao: "Ingrediente Principal",   legislacaoPermissao: "Decreto 6.871/2009" },
  { nome: "Açúcar (Sacarose)",                 funcao: "Edulcorante / Ingrediente", legislacaoPermissao: "RDC 272/2005 / Decreto 6.871/2009" },
  { nome: "Água",                               funcao: "Veículo",                  legislacaoPermissao: "Portaria MS 518/2004" },
  { nome: "Ácido Cítrico",                      funcao: "Acidulante",               ins: "INS 330", limiteMaximo: "BPF", legislacaoPermissao: "IN MAPA 14/2018 / RDC 2/2007" },
  { nome: "Ácido Málico",                       funcao: "Acidulante",               ins: "INS 296", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Ácido Ascórbico (Vitamina C)",       funcao: "Antioxidante / Vitamina",  ins: "INS 300", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007 / RDC 269/2005" },
  { nome: "Ácido L-Ascórbico",                  funcao: "Antioxidante",             ins: "INS 300", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Goma Xantana",                       funcao: "Espessante / Estabilizante",ins: "INS 415", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Goma Guar",                          funcao: "Espessante",               ins: "INS 412", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Carboximetilcelulose (CMC)",         funcao: "Espessante / Estabilizante",ins: "INS 466", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Aroma Natural de Fruta",             funcao: "Aromatizante",             legislacaoPermissao: "RDC 2/2007 — uso permitido conforme definição" },
  { nome: "Benzoato de Sódio",                  funcao: "Conservador",              ins: "INS 211", limiteMaximo: "1 g/kg", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Sorbato de Potássio",                funcao: "Conservador",              ins: "INS 202", limiteMaximo: "1 g/kg (como ácido sórbico)", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Eritorbato de Sódio",                funcao: "Antioxidante",             ins: "INS 316", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Citrato de Sódio",                   funcao: "Regulador de Acidez",      ins: "INS 331", limiteMaximo: "BPF", legislacaoPermissao: "RDC 2/2007" },
  { nome: "Sucralose",                          funcao: "Edulcorante Artificial",   ins: "INS 955", limiteMaximo: "300 mg/kg", legislacaoPermissao: "RDC 18/2008" },
  { nome: "Estévia (Steviol glicosídeos)",      funcao: "Edulcorante Natural",      ins: "INS 960a",limiteMaximo: "150 mg/kg", legislacaoPermissao: "RDC 18/2008" },
]
