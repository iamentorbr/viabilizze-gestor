"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { createClient } from "@/lib/supabase/client"
import { useClient } from "@/contexts/client-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, Check, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import type { PlanilhaRow, FormulacaoInsert, FormulacaoItemInsert } from "@/lib/types/calculadora"

interface UploadResult {
  success: boolean
  message: string
  formulacoesCount?: number
  insumosCount?: number
}

export function PlanilhaUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const { activeSupabaseId, activeClient } = useClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<PlanilhaRow[]>([])
  const [allRows, setAllRows] = useState<PlanilhaRow[]>([])
  const [result, setResult] = useState<UploadResult | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const parseExcel = useCallback((file: File): Promise<PlanilhaRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          if (!data) {
            reject(new Error("Falha ao ler arquivo"))
            return
          }
          
          // Usar ArrayBuffer para maior compatibilidade
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          if (!sheetName) {
            reject(new Error("Planilha vazia"))
            return
          }
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
          
          console.log("[v0] Raw JSON data:", jsonData.slice(0, 2))
          
          // Mapear colunas para o formato esperado
          const rows: PlanilhaRow[] = jsonData.map((row) => ({
            produto: String(row["produto"] || row["Produto"] || row["PRODUTO"] || ""),
            insumo: String(row["insumo"] || row["Insumo"] || row["INSUMO"] || row["ingrediente"] || row["Ingrediente"] || ""),
            tipo: String(row["tipo"] || row["Tipo"] || row["TIPO"] || "aditivo"),
            quantidade_por_1000L: Number(row["quantidade_por_1000L"] || row["quantidade_por_1000L"] || row["quantidade"] || row["Quantidade"] || row["qtd"] || 0),
            unidade: String(row["unidade"] || row["Unidade"] || row["UNIDADE"] || "kg"),
            brix_insumo: Number(row["brix_insumo"] || row["brix"] || row["Brix"] || 0),
            fator_reconstituicao: Number(row["fator_reconstituicao"] || row["fator"] || 0),
            densidade_kg_L: Number(row["densidade_kg_L"] || row["densidade"] || 1.0),
            acidez_natural: Number(row["acidez_natural"] || row["acidez"] || 0),
            preco_unitario_kg: row["preco_unitario_kg"] || row["preco"] ? Number(row["preco_unitario_kg"] || row["preco"]) : undefined,
            is_agua_qsp: Boolean(row["is_agua_qsp"] || row["agua_qsp"] || String(row["insumo"] || row["Insumo"] || "").toLowerCase().includes("água")),
            brix_min: row["brix_min"] ? Number(row["brix_min"]) : undefined,
            brix_ideal: row["brix_ideal"] ? Number(row["brix_ideal"]) : undefined,
            brix_max: row["brix_max"] ? Number(row["brix_max"]) : undefined,
            ph_min: row["ph_min"] ? Number(row["ph_min"]) : undefined,
            ph_ideal: row["ph_ideal"] ? Number(row["ph_ideal"]) : undefined,
            ph_max: row["ph_max"] ? Number(row["ph_max"]) : undefined,
            perc_suco_minimo_legal: row["perc_suco_minimo_legal"] ? Number(row["perc_suco_minimo_legal"]) : undefined,
          }))

          // Filtrar linhas vazias
          const validRows = rows.filter((row) => row.produto && row.insumo && row.quantidade_por_1000L > 0)
          resolve(validRows)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => {
        console.error("[v0] FileReader error:", error)
        reject(error)
      }
      // Usar ArrayBuffer para maior compatibilidade com XLSX
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("[v0] onDrop called with files:", acceptedFiles)
    const file = acceptedFiles[0]
    if (!file) {
      console.log("[v0] No file received")
      return
    }

    console.log("[v0] File received:", file.name, file.type, file.size)
    setFileName(file.name)
    setResult(null)
    setIsProcessing(true)

    try {
      const rows = await parseExcel(file)
      console.log("[v0] Parsed rows:", rows.length)
      
      if (rows.length === 0) {
        setResult({ 
          success: false, 
          message: "Nenhum dado válido encontrado. Verifique se a planilha contém as colunas: produto, insumo, quantidade_por_1000L" 
        })
        setIsProcessing(false)
        return
      }
      
      setAllRows(rows) // Guardar todas as linhas para o upload
      setPreview(rows.slice(0, 10)) // Mostrar apenas primeiras 10 linhas
      setIsProcessing(false)
    } catch (error) {
      console.error("[v0] Parse error:", error)
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido"
      setResult({ success: false, message: `Erro ao ler o arquivo: ${errorMsg}` })
      setIsProcessing(false)
    }
  }, [parseExcel])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  })

  const handleConfirmUpload = async () => {
    if (!allRows.length || !activeSupabaseId) {
      setResult({ success: false, message: "Nenhum dado para importar ou empresa não selecionada." })
      return
    }

    setIsProcessing(true)
    setResult(null)

    try {
      const supabase = createClient()
      await processRows(supabase, allRows)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setResult({ success: false, message: "Erro ao salvar no banco de dados." })
    } finally {
      setIsProcessing(false)
    }
  }

  const processRows = async (supabase: ReturnType<typeof createClient>, rows: PlanilhaRow[]) => {
    // Primeiro, buscar ou criar a indústria
    let industria_id: string

    const { data: existingIndustria } = await supabase
      .from("industrias")
      .select("id")
      .eq("slug", activeSupabaseId)
      .single()

    if (existingIndustria) {
      industria_id = existingIndustria.id
    } else {
      // Criar indústria
      const { data: newIndustria, error: indError } = await supabase
        .from("industrias")
        .insert({ slug: activeSupabaseId, nome: activeClient })
        .select("id")
        .single()

      if (indError || !newIndustria) {
        throw new Error("Erro ao criar indústria")
      }
      industria_id = newIndustria.id
    }

    // Agrupar por produto
    const produtosMap = new Map<string, PlanilhaRow[]>()
    rows.forEach((row) => {
      const existing = produtosMap.get(row.produto) || []
      existing.push(row)
      produtosMap.set(row.produto, existing)
    })

    let formulacoesCount = 0
    let itensCount = 0

    for (const [produto, itens] of produtosMap) {
      // Pegar parâmetros do primeiro item (que pode ter os dados do produto)
      const firstRow = itens[0]
      
      // Inserir ou atualizar formulação
      const formulacaoData = {
        industria_id,
        codigo: produto.substring(0, 20).toUpperCase().replace(/\s+/g, "-"),
        nome: produto,
        categoria: "nectar",
        brix_min: firstRow.brix_min,
        brix_ideal: firstRow.brix_ideal,
        brix_max: firstRow.brix_max,
        ph_min: firstRow.ph_min,
        ph_ideal: firstRow.ph_ideal,
        ph_max: firstRow.ph_max,
        teor_polpa_minimo: firstRow.teor_polpa_minimo || 10,
        ativo: true,
        versao: 1,
        rendimento_esperado: 100,
      }

      const { data: formulacao, error: formError } = await supabase
        .from("formulacoes")
        .upsert(formulacaoData, { onConflict: "industria_id,codigo" })
        .select("id")
        .single()

      if (formError) {
        console.error("[v0] Formulacao error:", formError)
        continue
      }

      formulacoesCount++

      // Deletar itens antigos desta formulação
      await supabase
        .from("formulacao_itens")
        .delete()
        .eq("formulacao_id", formulacao.id)

      // Inserir novos itens
      const itensData: FormulacaoItemInsert[] = itens.map((row, idx) => ({
        formulacao_id: formulacao.id,
        nome_item: row.insumo,
        tipo: row.tipo || "insumo",
        quantidade_por_1000L: row.quantidade_por_1000L,
        unidade: row.unidade || "kg",
        ordem_adicao: idx + 1,
      }))

      const { error: itensError } = await supabase
        .from("formulacao_itens")
        .insert(itensData)

      if (!itensError) {
        itensCount += itensData.length
      }
    }

    setResult({
      success: true,
      message: `Upload para "${activeClient}" concluído com sucesso!`,
      formulacoesCount,
      insumosCount: itensCount,
    })
    setPreview([])
    setAllRows([])
    setFileName("")
    onUploadComplete?.()
  }

  const handleClearPreview = () => {
    setPreview([])
    setAllRows([])
    setFileName("")
    setResult(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload de Formulações
            </CardTitle>
            <CardDescription>
              Importe suas formulações a partir de uma planilha Excel ou CSV. O sistema identifica automaticamente as colunas: produto, insumo, quantidade, tipo, unidade.
            </CardDescription>
            <Badge variant="outline" className="mt-2 text-primary border-primary">
              Destino: {activeClient}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary font-medium">Solte o arquivo aqui...</p>
          ) : (
            <div>
              <p className="font-medium">Arraste um arquivo ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground mt-1">
                Formatos aceitos: .xlsx, .xls, .csv
              </p>
            </div>
          )}
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processando arquivo...</span>
          </div>
        )}

        {/* Result message */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
              {result.success && result.formulacoesCount !== undefined && (
                <span className="block mt-1 text-sm">
                  {result.formulacoesCount} formulações e {result.insumosCount} insumos importados.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{fileName}</Badge>
                <span className="text-sm text-muted-foreground">
                  Prévia das primeiras {preview.length} linhas
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearPreview}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg overflow-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Qtd/1000L</TableHead>
                    <TableHead>Unidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.produto}</TableCell>
                      <TableCell>{row.insumo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{row.quantidade_por_1000L}</TableCell>
                      <TableCell>{row.unidade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClearPreview}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmUpload} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
