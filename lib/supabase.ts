import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// ─── Cliente para componentes 'use client' ────────────────────────────────
// Lazy initialization para evitar erros quando variáveis não estão disponíveis
let _supabase: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      console.warn('[Supabase] URL ou ANON_KEY não configuradas')
      return null
    }
    
    _supabase = createBrowserClient<Database>(url, key)
  }
  return _supabase
}

// Export para compatibilidade com código existente (pode ser null se não configurado)
export const supabase = typeof window !== 'undefined' ? getSupabase() : null
