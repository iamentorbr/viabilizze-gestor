// industry-store.ts
// Centralised per-industry data store using localStorage.
// Key pattern: viabilizze_industry_<systemId>
// Each industry has its own isolated snapshot of all module data.

import {
  buildDemoSnapshot,
  buildEmptySnapshot,
  EXAMPLE_MARKER,
  type IndustrySnapshot,
} from "@/lib/demo-data"

const PREFIX = "viabilizze_industry_"

function key(systemId: string) {
  return `${PREFIX}${systemId}`
}

// ─── Read ────────────────────────────────────────────────────────────────────

export function getIndustryData(systemId: string): IndustrySnapshot {
  if (typeof window === "undefined") return buildEmptySnapshot()
  try {
    const raw = localStorage.getItem(key(systemId))
    if (!raw) return buildEmptySnapshot()
    return JSON.parse(raw) as IndustrySnapshot
  } catch {
    return buildEmptySnapshot()
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

export function setIndustryData(systemId: string, data: IndustrySnapshot) {
  if (typeof window === "undefined") return
  localStorage.setItem(key(systemId), JSON.stringify(data))
}

// ─── Init (called when a new industry is created) ────────────────────────────

export function initIndustryWithDemoData(systemId: string) {
  const snapshot = buildDemoSnapshot()
  setIndustryData(systemId, snapshot)
}

export function initIndustryEmpty(systemId: string) {
  setIndustryData(systemId, buildEmptySnapshot())
}

// ─── Delete all data for an industry ─────────────────────────────────────────

export function deleteIndustryData(systemId: string) {
  if (typeof window === "undefined") return
  localStorage.removeItem(key(systemId))
}

// ─── Remove only example records ─────────────────────────────────────────────

export function clearExampleData(systemId: string) {
  const data = getIndustryData(systemId)

  const isExample = (id: string | number) =>
    String(id).startsWith(EXAMPLE_MARKER)

  const cleaned: IndustrySnapshot = {
    produtos:  data.produtos.filter((r) => !isExample(r.id)),
    formulas:  data.formulas.filter((r) => !isExample(r.id)),
    ordens:    data.ordens.filter((r) => !isExample(r.id)),
    analises:  data.analises.filter((r) => !isExample(r.id)),
    rotulos:   data.rotulos.filter((r) => !isExample(r.id)),
    materiais: data.materiais.filter((r) => !isExample(r.id)),
    hasExampleData: false,
  }

  setIndustryData(systemId, cleaned)
}

// ─── Partial updaters (used by individual pages) ─────────────────────────────

type ModuleKey = keyof Omit<IndustrySnapshot, "hasExampleData">

export function updateModule<K extends ModuleKey>(
  systemId: string,
  module: K,
  records: IndustrySnapshot[K]
) {
  const data = getIndustryData(systemId)
  setIndustryData(systemId, { ...data, [module]: records })
}
