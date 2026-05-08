// Demo data — populated into every new industry on creation.
// Contains exactly 1 record per module so users can see the structure
// and delete all example data with a single click.

export const EXAMPLE_MARKER = "__example__"

export const demoProdutos = [
  {
    id: `${EXAMPLE_MARKER}-prod-1`,
    name: "Néctar de Caju 1L",
    code: "PA-001",
    batch: "LC-EXEMPLO-001",
    stock: 12500,
    unit: "un",
    production: "20/01/2024",
    validity: "20/07/2024",
    status: "Disponível",
  },
]

export const demoFormulas = [
  {
    id: `${EXAMPLE_MARKER}-form-1`,
    name: "Néctar de Caju",
    version: "1.0",
    ingredients: 7,
    brix: "11.45 - 11.65",
    status: "Ativo",
    lastUpdate: "20/01/2024",
  },
]

export const demoOrdens = [
  {
    id: `${EXAMPLE_MARKER}-op-1`,
    code: "OP-EXEMPLO-001",
    recipe: "Néctar de Caju",
    quantity: 25000,
    status: "Concluído",
    priority: "Normal",
    startDate: "20/01/2024 08:00",
    endDate: "20/01/2024 12:30",
    operator: "Operador Exemplo",
  },
]

export const demoAnalises = [
  {
    id: `${EXAMPLE_MARKER}-an-1`,
    order: "OP-EXEMPLO-001",
    recipe: "Néctar de Caju",
    brix: 11.52,
    brixSpec: { min: 11.45, max: 11.65 },
    acidez: 0.26,
    acidezSpec: { min: 0.24, max: 0.28 },
    ph: 3.28,
    phSpec: { min: 3.1, max: 3.45 },
    result: "Aprovado",
    date: "20/01/2024 12:00",
    analyst: "Analista Exemplo",
  },
]

export const demoRotulos = [
  {
    id: `${EXAMPLE_MARKER}-rot-1`,
    produto: "Néctar de Caju",
    sabor: "Caju",
    volume: "1L",
    lote: "LC-EXEMPLO-001",
    dataFabricacao: "2024-01-20",
    dataValidade: "2024-07-20",
    status: "ativo",
    versao: "1.0",
  },
]

export const demoMateriais = [
  {
    id: `${EXAMPLE_MARKER}-mp-1`,
    name: "Suco Concentrado de Caju 28° Brix",
    code: "MP-001",
    category: "Concentrado",
    stock: 150,
    minStock: 200,
    unit: "kg",
    price: 18.5,
    supplier: "Fornecedor Exemplo",
  },
]

export function buildDemoSnapshot() {
  return {
    produtos: demoProdutos,
    formulas: demoFormulas,
    ordens: demoOrdens,
    analises: demoAnalises,
    rotulos: demoRotulos,
    materiais: demoMateriais,
    hasExampleData: true,
  }
}

export function buildEmptySnapshot() {
  return {
    produtos: [],
    formulas: [],
    ordens: [],
    analises: [],
    rotulos: [],
    materiais: [],
    hasExampleData: false,
  }
}

export type IndustrySnapshot = ReturnType<typeof buildDemoSnapshot>
