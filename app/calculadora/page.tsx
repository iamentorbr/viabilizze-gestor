'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useIndustria } from '@/contexts/IndustriaContext'
import { useFormulacoes, type Formulacao, type Insumo } from '@/hooks/useFormulacoes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, FileDown, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react'

function parseBR(v: string) {
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}
function fmtBR(v: number, d = 3) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtMoeda(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface InsumoCalc extends Insumo { qtd_total: number; qtd_ajustada: number }
interface Resultado {
  insumos: InsumoCalc[]
  agua_qsp_L: number; agua_qsp_ajustada_L: number
  brix_final: number; perc_suco: number; acidez_estimada: number
  custo_total: number; custo_por_litro: number
  qsp_negativo: boolean
}

function calcular(insumos: Insumo[], volumeL: number, percProd: number): Resultado {
  const naoAgua = insumos.filter(i => !i.is_agua_qsp)
  const calculados: InsumoCalc[] = naoAgua.map(ins => ({
    ...ins,
    qtd_total: (ins.qtd_base_por_1000L / 1000) * volumeL,
    qtd_ajustada: ((ins.qtd_base_por_1000L / 1000) * volumeL) * (percProd / 100),
  }))
  const volOutros = calculados.reduce((acc, ins) => acc + ins.qtd_total / (ins.densidade_kg_L || 1), 0)
  const agua_qsp_L = volumeL - volOutros
  const agua_qsp_ajustada_L = agua_qsp_L * (percProd / 100)
  const aguaIns = insumos.find(i => i.is_agua_qsp)
  if (aguaIns) calculados.push({ ...aguaIns, qtd_total: agua_qsp_L, qtd_ajustada: agua_qsp_ajustada_L })
  const brix_final = calculados.reduce((acc, i) => acc + i.qtd_total * i.brix_insumo, 0) / volumeL / 10
  const sucoL = calculados.filter(i => i.tipo === 'concentrado')
    .reduce((acc, i) => acc + (i.qtd_total / (i.densidade_kg_L || 1)) * i.fator_reconstituicao, 0)
  const perc_suco = (sucoL / volumeL) * 100
  const acidezG = calculados.reduce((acc, i) => acc + i.qtd_total * 1000 * (i.acidez_natural / 100), 0)
  const acidez_estimada = acidezG / (volumeL * 1000) * 100
  const custo_total = calculados.filter(i => !i.is_agua_qsp && i.preco_unitario_kg > 0)
    .reduce((acc, i) => acc + i.qtd_total * i.preco_unitario_kg, 0)
  return {
    insumos: calculados, agua_qsp_L, agua_qsp_ajustada_L,
    brix_final, perc_suco, acidez_estimada,
    custo_total, custo_por_litro: volumeL > 0 ? custo_total / volumeL : 0,
    qsp_negativo: agua_qsp_L < 0,
  }
}

export default function CalculadoraPage() {
  const { industriaAtiva } = useIndustria()
  const { formulacoes, loading } = useFormulacoes(industriaAtiva?.id)
  const [formulacaoSel, setFormulacaoSel] = useState<Formulacao | null>(null)
  const [volumeStr, setVolumeStr] = useState('1000')
  const [percStr, setPercStr] = useState('100')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [gerandoPDF, setGerandoPDF] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (formulacoes.length > 0 && !formulacaoSel) setFormulacaoSel(formulacoes[0])
  }, [formulacoes, formulacaoSel])

  const recalcular = useCallback(() => {
    if (!formulacaoSel?.insumos?.length) return
    const vol = parseBR(volumeStr)
    const perc = parseBR(percStr)
    if (vol <= 0) return
    setResultado(calcular(formulacaoSel.insumos, vol, perc))
  }, [formulacaoSel, volumeStr, percStr])

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(recalcular, 300)
    return () => { if (debounce.current) clearTimeout(debounce.current) }
  }, [recalcular])

  function onSelect(id: string) {
    const f = formulacoes.find(x => x.id === id) ?? null
    setFormulacaoSel(f)
    setResultado(null)
  }

  async function gerarPDF() {
    if (!resultado || !formulacaoSel) return
    setGerandoPDF(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      const vol = parseBR(volumeStr); const perc = parseBR(percStr)
      doc.setFillColor(26,35,126); doc.rect(0,0,210,28,'F')
      doc.setTextColor(255,255,255); doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('VIABILIZZE ASSESSORIA INDUSTRIAL',14,11)
      doc.setFontSize(10); doc.setFont('helvetica','normal')
      doc.text(`Formulação: ${formulacaoSel.produto}`,14,19)
      doc.text(`Emitido: ${new Date().toLocaleString('pt-BR')}`,120,19)
      doc.setTextColor(0,0,0)
      doc.text(`Indústria: ${industriaAtiva?.nome ?? ''} | Volume: ${fmtBR(vol,0)} L | Eficiência: ${perc}%`,14,36)
      autoTable(doc, {
        startY: 44,
        head: [['Fornecedor','Ingrediente','por 1.000 L','Total','Ajustado']],
        body: resultado.insumos.map(i => [
          i.fornecedor ?? '—', i.nome,
          i.is_agua_qsp ? 'QSP' : fmtBR(i.qtd_base_por_1000L),
          fmtBR(i.qtd_total), fmtBR(i.qtd_ajustada),
        ]),
        headStyles: { fillColor:[13,71,161], textColor:255 },
        styles: { fontSize:8 }, margin: { left:14, right:14 },
      })
      const y = (doc as any).lastAutoTable.finalY + 8
      doc.setFont('helvetica','bold'); doc.text('ESPECIFICAÇÕES',14,y)
      doc.setFont('helvetica','normal')
      doc.text(`Brix Final: ${fmtBR(resultado.brix_final,2)}°Bx  |  % Suco: ${fmtBR(resultado.perc_suco,1)}%  |  Acidez Est.: ${fmtBR(resultado.acidez_estimada,3)} g/100mL`,14,y+7)
      if (resultado.custo_total > 0) doc.text(`Custo MP: ${fmtMoeda(resultado.custo_total)}  |  Custo/L: ${fmtMoeda(resultado.custo_por_litro)}`,14,y+15)
      doc.save(`${formulacaoSel.produto.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e){ console.error(e) } finally { setGerandoPDF(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-400"/>
      <span className="ml-3 text-slate-400">Carregando formulações de {industriaAtiva?.nome ?? '...'}...</span>
    </div>
  )

  if (!loading && formulacoes.length === 0) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Calculadora de Produção</h1>
      <Alert className="bg-amber-950/50 border-amber-700">
        <AlertTriangle className="h-4 w-4 text-amber-400"/>
        <AlertDescription className="text-amber-300">
          Nenhuma formulação cadastrada para <strong>{industriaAtiva?.nome}</strong>. Acesse <strong>Fórmulas</strong> para cadastrar.
        </AlertDescription>
      </Alert>
    </div>
  )

  const vol = parseBR(volumeStr)

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Calculadora de Produção</h1>
          <p className="text-slate-400 text-sm mt-1">{industriaAtiva?.nome} — Cálculo de insumos por lote</p>
        </div>
        <Button onClick={gerarPDF} disabled={!resultado || gerandoPDF} className="bg-blue-700 hover:bg-blue-600 text-white">
          {gerandoPDF ? <><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Gerando...</> : <><FileDown className="h-4 w-4 mr-2"/>Salvar PDF</>}
        </Button>
      </div>

      {resultado?.qsp_negativo && (
        <Alert className="bg-red-950/50 border-red-700">
          <XCircle className="h-4 w-4 text-red-400"/>
          <AlertDescription className="text-red-300"><strong>Erro:</strong> Volume dos insumos excede o volume total.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <div className="space-y-1">
          <label className="text-sm text-slate-400 font-medium">Produto / Receita</label>
          <Select onValueChange={onSelect} value={formulacaoSel?.id ?? ''}>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
              <SelectValue placeholder="Selecione um produto"/>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-600">
              {formulacoes.map(f => (
                <SelectItem key={f.id} value={f.id} className="text-white hover:bg-slate-700">{f.produto}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-400 font-medium">Volume a Produzir (L)</label>
          <Input value={volumeStr} onChange={e => setVolumeStr(e.target.value)} className="bg-slate-900 border-slate-600 text-white text-right"/>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-400 font-medium">Eficiência (%)</label>
          <div className="relative">
            <Input value={percStr} onChange={e => setPercStr(e.target.value)} className="bg-slate-900 border-slate-600 text-white text-right pr-8"/>
            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
          </div>
        </div>
      </div>

      {formulacaoSel?.norma_referencia && (
        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-950/30 px-4 py-2 rounded-md border border-blue-900">
          <Info className="h-4 w-4 flex-shrink-0"/><span>{formulacaoSel.norma_referencia}</span>
        </div>
      )}

      {resultado && resultado.insumos.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h2 className="text-white font-semibold">Formulação do Lote — {formulacaoSel?.produto}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400">Fornecedor</TableHead>
                <TableHead className="text-slate-400">Ingrediente</TableHead>
                <TableHead className="text-slate-400 text-right">por 1.000 L (kg)</TableHead>
                <TableHead className="text-slate-400 text-right">Total ({fmtBR(vol,0)} L)</TableHead>
                <TableHead className="text-slate-400 text-right">Ajustado ({parseBR(percStr)}%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultado.insumos.map((ins, idx) => (
                <TableRow key={ins.id ?? idx} className="border-slate-700 hover:bg-slate-700/30">
                  <TableCell className="text-slate-400 text-sm">{ins.fornecedor ?? '—'}</TableCell>
                  <TableCell className="text-white text-sm">
                    {ins.is_agua_qsp && <span className="text-blue-400 mr-1">💧</span>}{ins.nome}
                  </TableCell>
                  <TableCell className="text-slate-300 text-right font-mono text-sm">
                    {ins.is_agua_qsp ? 'QSP' : fmtBR(ins.qtd_base_por_1000L)}
                  </TableCell>
                  <TableCell className="text-slate-300 text-right font-mono text-sm">
                    {fmtBR(ins.is_agua_qsp ? resultado.agua_qsp_L : ins.qtd_total)}
                  </TableCell>
                  <TableCell className="text-white text-right font-mono font-medium text-sm">
                    {fmtBR(ins.is_agua_qsp ? resultado.agua_qsp_ajustada_L : ins.qtd_ajustada)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-4 py-2 border-t border-slate-700">
            <p className="text-xs text-slate-500">QSP = Quantidade Suficiente Para completar o volume</p>
          </div>
        </div>
      )}

      {resultado && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Brix Final', value: `${fmtBR(resultado.brix_final,2)} °Bx` },
            { label: '% Suco / Polpa', value: `${fmtBR(resultado.perc_suco,1)}%` },
            { label: 'Acidez Est.', value: `${fmtBR(resultado.acidez_estimada,3)} g/100mL` },
            { label: '💧 Água QSP', value: `${fmtBR(resultado.agua_qsp_L,1)} L` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/50 rounded-lg border border-slate-700 p-3 text-center">
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className="text-blue-300 font-mono font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {resultado && resultado.custo_total > 0 && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm">Custo total de MP</p>
            <p className="text-white font-mono font-bold text-lg">{fmtMoeda(resultado.custo_total)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Custo por litro</p>
            <p className="text-white font-mono font-bold text-lg">{fmtMoeda(resultado.custo_por_litro)}/L</p>
          </div>
        </div>
      )}

      {formulacaoSel?.observacao && (
        <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0"/>
          <p className="text-slate-300 text-sm">{formulacaoSel.observacao}</p>
        </div>
      )}
    </div>
  )
}
