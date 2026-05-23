import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  // Suporta ambas variantes de nome de variável
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('[Supabase] Variáveis de ambiente não configuradas')
    // Retorna um client mockado que não faz nada para evitar crash
    return null as unknown as ReturnType<typeof createBrowserClient>
  }

  client = createBrowserClient(url, key)
  return client
}
