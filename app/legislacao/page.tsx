"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, ExternalLink, BookOpen, FileText, Scale, ChevronDown, ChevronUp, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Norma = {
  titulo: string
  ementa: string
  palavrasChave: string[]
  url: string
  alteracoes?: { titulo: string; url: string }[]
}

type Categoria = {
  titulo: string
  tipo: "lei" | "decreto" | "instrucao" | "portaria" | "despacho"
  secao: string
  normas: Norma[]
}

const categorias: Categoria[] = [
  // ── CONSOLIDAÇÃO ────────────────────────────────────────────────────────────
  {
    titulo: "Consolidação das Normas (Cartilhão de Bebidas)",
    tipo: "instrucao",
    secao: "Consolidação",
    normas: [
      {
        titulo: "IN SDA/MAPA nº 140, de 28 de fevereiro de 2024",
        ementa:
          "Aprova a Consolidação das Normas de Bebidas, Fermentados Acéticos, Vinhos e Derivados da Uva e do Vinho, nacionais e importados — 'Cartilhão de Bebidas' (6ª Edição).",
        palavrasChave: [
          "cartilhão de bebidas",
          "compêndio",
          "vinhos e bebidas",
          "denominação",
          "composição",
          "importação",
          "exportação",
          "registro",
        ],
        url: "https://www.in.gov.br/en/web/dou/-/instrucao-normativa-sda/mapa-n-140-de-28-de-fevereiro-de-2024-546270304",
      },
      {
        titulo: "IN nº 75, de 31 de dezembro de 2019",
        ementa:
          "Estabelece os critérios e define os parâmetros analíticos que devem ser utilizados para fiscalização e controle de bebidas, vinhos e derivados da uva e do vinho, nacionais e importados.",
        palavrasChave: ["parâmetros analíticos", "laudo laboratorial", "fiscalização", "controle"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=02/01/2020&jornal=515&pagina=1",
      },
    ],
  },

  // ── REGISTRO DE ESTABELECIMENTOS E PRODUTOS ─────────────────────────────────
  {
    titulo: "Registro de Estabelecimentos e Produtos",
    tipo: "instrucao",
    secao: "Registro",
    normas: [
      {
        titulo: "IN nº 72, de 16 de novembro de 2018",
        ementa:
          "Aprova os requisitos e os procedimentos administrativos para o registro de estabelecimentos e de produtos classificados como bebidas e fermentados acéticos.",
        palavrasChave: [
          "registro de estabelecimentos",
          "registro de produtos",
          "bebidas",
          "fermentados acéticos",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=29/11/2018&jornal=515&pagina=4",
        alteracoes: [
          {
            titulo: "IN nº 4, de 22 de fevereiro de 2021 — Registro de estabelecimento de produção de bebidas móvel",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=03/03/2021&jornal=515&pagina=2",
          },
        ],
      },
    ],
  },

  // ── LEGISLAÇÃO GERAL ─────────────────────────────────────────────────────────
  {
    titulo: "Leis — Bebidas",
    tipo: "lei",
    secao: "Legislação Geral",
    normas: [
      {
        titulo: "Lei nº 8.918, de 14 de julho de 1994",
        ementa:
          "Dispõe sobre a padronização, a classificação, o registro, a inspeção, a produção e a fiscalização de bebidas, autoriza a criação da Comissão Intersetorial de Bebidas e dá outras providências.",
        palavrasChave: ["bebidas em geral", "definições", "rótulo", "fiscalização", "registro"],
        url: "http://www.planalto.gov.br/ccivil_03/LEIS/L8918.htm",
        alteracoes: [
          {
            titulo: "Lei nº 8.936, de 24 de novembro de 1994 — Valor máximo de multa",
            url: "http://www.planalto.gov.br/ccivil_03/LEIS/1989_1994/L8936.htm",
          },
          {
            titulo: "Lei nº 13.648, de 11 de abril de 2018 — Polpa e suco de frutas artesanais",
            url: "http://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2018/Lei/L13648.htm",
          },
          {
            titulo: "Lei nº 14.515, de 29 de dezembro de 2022 — Autocontrole e fiscalização",
            url: "http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/L14515.htm",
          },
        ],
      },
      {
        titulo: "Lei nº 13.648, de 11 de abril de 2018",
        ementa:
          "Dispõe sobre a produção de polpa e suco de frutas artesanais em estabelecimento familiar rural e altera a Lei nº 8.918, de 1994.",
        palavrasChave: ["polpa de frutas", "suco artesanal", "estabelecimento familiar rural"],
        url: "http://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2018/Lei/L13648.htm",
      },
      {
        titulo: "Lei nº 14.515, de 29 de dezembro de 2022",
        ementa:
          "Dispõe sobre os programas de autocontrole dos agentes privados regulados pela defesa agropecuária.",
        palavrasChave: ["autocontrole", "fiscalização", "defesa agropecuária"],
        url: "http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/L14515.htm",
      },
    ],
  },
  {
    titulo: "Decretos — Bebidas",
    tipo: "decreto",
    secao: "Legislação Geral",
    normas: [
      {
        titulo: "Decreto nº 6.871, de 4 de junho de 2009",
        ementa:
          "Regulamenta a Lei nº 8.918/1994, que dispõe sobre a padronização, a classificação, o registro, a inspeção, a produção e a fiscalização de bebidas.",
        palavrasChave: ["bebidas em geral", "PIQs", "rótulo", "definições", "infrações", "sanções"],
        url: "http://www.planalto.gov.br/ccivil_03/_Ato2007-2010/2009/Decreto/D6871.htm",
        alteracoes: [
          {
            titulo: "Decreto nº 7.968, de 26 de março de 2013 — Alteração denominação uísque",
            url: "http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2013/Decreto/D7968.htm",
          },
          {
            titulo: "Decreto nº 8.592, de 16 de dezembro de 2015 — Bebidas hipocalóricas, 'baixo em açúcares'",
            url: "http://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2015/Decreto/D8592.htm",
          },
          {
            titulo: "Decreto nº 9.799, de 23 de maio de 2019 — Reconhecimento mútuo Tequila e Cachaça",
            url: "http://www.planalto.gov.br/ccivil_03/_Ato2019-2022/2019/Decreto/D9799.htm",
          },
          {
            titulo: "Decreto nº 9.902, de 8 de julho de 2019 — PIQ Cerveja; Registro de produto sem padrão",
            url: "http://www.planalto.gov.br/ccivil_03/_Ato2019-2022/2019/Decreto/D9902.htm",
          },
        ],
      },
    ],
  },
  {
    titulo: "Instruções Normativas — Bebidas",
    tipo: "instrucao",
    secao: "Legislação Geral",
    normas: [
      {
        titulo: "IN nº 5, de 31 de março de 2000",
        ementa:
          "Aprova o Regulamento Técnico para a fabricação de bebidas e vinagres, inclusive vinhos e derivados da uva e do vinho, dirigido aos estabelecimentos que especifica.",
        palavrasChave: ["definições", "requisitos gerais", "estabelecimentos", "fabricação"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=05/04/2000&jornal=1&pagina=58&totalArquivos=73",
      },
      {
        titulo: "IN nº 55, de 18 de outubro de 2002",
        ementa:
          "Aprova o regulamento técnico para fixação de critérios para indicação da denominação do produto na rotulagem de bebidas, vinhos, derivados da uva e do vinho e vinagres.",
        palavrasChave: ["denominação", "rótulo", "rotulagem", "vinagres"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=21/10/2002&jornal=1&pagina=11&totalArquivos=100",
      },
      {
        titulo: "IN nº 24, de 8 de setembro de 2005",
        ementa:
          "Aprova o Manual Operacional de Bebidas e Vinagres (métodos físico-químicos de análise para bebidas fermentadas, destiladas, não alcoólicas e vinagre).",
        palavrasChave: [
          "manual operacional",
          "métodos analíticos",
          "físico-químico",
          "fermentados",
          "destilados",
          "vinagre",
          "não alcoólicos",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=20/09/2005&jornal=1&pagina=11&totalArquivos=96",
      },
      {
        titulo: "IN nº 32, de 4 de novembro de 2010",
        ementa:
          "Define os modelos de documentos, bem como suas respectivas finalidades, a serem adotados no exercício da fiscalização de bebidas, fermentados acéticos, vinhos e derivados da uva e do vinho e de suas matérias-primas.",
        palavrasChave: ["termos de fiscalização", "modelos de documentos", "bebidas", "vinhos"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=05/11/2010&jornal=1&pagina=5&totalArquivos=144",
        alteracoes: [
          {
            titulo: "IN nº 4, de 6 de fevereiro de 2017 — Termos de fiscalização, finalidade e prazos",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=1&pagina=190&data=17/02/2017",
          },
        ],
      },
    ],
  },
  {
    titulo: "Portarias — Bebidas",
    tipo: "portaria",
    secao: "Legislação Geral",
    normas: [
      {
        titulo: "Portaria nº 40, de 20 de janeiro de 1998",
        ementa:
          "Aprova o Manual de Procedimentos no Controle da Produção de Bebidas e Vinagres baseado nos princípios do APPCC (Análise de Perigo e Pontos Críticos de Controle).",
        palavrasChave: ["APPCC", "HACCP", "pontos críticos de controle", "manual", "bebidas", "vinagres"],
        url: "https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-programas-nacionais-e-seguranca-dos-alimentos-1/legislacao/legislacao-vinhos-e-bebidas/portaria-no-40-de-20-de-janeiro-de-1998.pdf",
      },
    ],
  },

  // ── ALCOÓLICOS ───────────────────────────────────────────────────────────────
  {
    titulo: "Leis — Bebidas Alcoólicas",
    tipo: "lei",
    secao: "Alcoólicos",
    normas: [
      {
        titulo: "Lei nº 7.678, de 08 de novembro de 1988",
        ementa: "Regula os vinhos e derivados da uva e do vinho.",
        palavrasChave: ["vinho", "derivados da uva", "registro", "vinhos"],
        url: "http://www.planalto.gov.br/ccivil_03/LEIS/1980-1988/L7678.htm",
      },
      {
        titulo: "Lei nº 9.294, de 15 de julho de 1996",
        ementa:
          "Dispõe sobre as restrições ao uso e a propaganda de produtos fumígeros, bebidas alcoólicas, medicamentos, terapias e defensivos agrícolas.",
        palavrasChave: [
          "propaganda",
          "rótulo",
          "bebidas alcoólicas",
          "evite o consumo excessivo de álcool",
          "13º GL",
        ],
        url: "http://www.planalto.gov.br/ccivil_03/leis/l9294.htm",
        alteracoes: [
          {
            titulo: "Lei nº 10.167, de 27 de dezembro de 2000 — Altera restrições de propaganda",
            url: "http://www.planalto.gov.br/ccivil_03/leis/L10167.htm",
          },
          {
            titulo: "Lei nº 10.702, de 14 de julho de 2003 — Altera restrições de propaganda",
            url: "http://www.planalto.gov.br/ccivil_03/leis/2003/L10.702.htm",
          },
        ],
      },
    ],
  },
  {
    titulo: "Decretos — Bebidas Alcoólicas",
    tipo: "decreto",
    secao: "Alcoólicos",
    normas: [
      {
        titulo: "Decreto nº 8.198, de 20 de fevereiro de 2014",
        ementa: "Regulamenta a Lei nº 7.678/1988 que regula os vinhos e derivados da uva e do vinho.",
        palavrasChave: ["vinho", "derivados da uva", "regulamentação", "vinhos"],
        url: "http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/decreto/d8198.htm",
      },
      {
        titulo: "Decreto nº 2.018, de 1º de outubro de 1996",
        ementa:
          "Regulamenta a Lei nº 9.294/1996, que dispõe sobre as restrições ao uso e à propaganda de produtos fumígeros, bebidas alcoólicas, medicamentos, terapias e defensivos agrícolas.",
        palavrasChave: [
          "propaganda",
          "rótulo",
          "bebidas alcoólicas",
          "evite o consumo excessivo de álcool",
        ],
        url: "http://www.planalto.gov.br/ccivil_03/decreto/d2018.htm",
      },
    ],
  },
  {
    titulo: "Instruções Normativas — Bebidas Alcoólicas",
    tipo: "instrucao",
    secao: "Alcoólicos",
    normas: [
      {
        titulo: "IN nº 35, de 16 de novembro de 2010",
        ementa:
          "Estabelece a complementação dos padrões de identidade e qualidade para as bebidas alcoólicas por mistura.",
        palavrasChave: [
          "PIQ licor",
          "PIQ bebida alcoólica mista",
          "PIQ batida",
          "PIQ caipirinha industrializada",
          "PIQ aperitivo",
          "PIQ aguardente composta",
          "PIQ coquetel",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=17/11/2010&jornal=1&pagina=2&totalArquivos=180",
        alteracoes: [
          {
            titulo: "IN nº 17, de 9 de abril de 2018 — Atualização PIQs",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=12/04/2018&jornal=515&pagina=6&totalArquivos=98",
          },
        ],
      },
      {
        titulo: "IN nº 15, de 31 de março de 2011",
        ementa:
          "Estabelece a complementação dos padrões de identidade e qualidade para algumas bebidas alcoólicas destiladas.",
        palavrasChave: [
          "PIQ aguardente de melaço",
          "PIQ aguardente de cereal",
          "PIQ aguardente de fruta",
          "PIQ rum",
          "PIQ uísque",
          "PIQ tiquira",
          "PIQ sochu",
          "PIQ arac",
          "destilados",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=01/04/2011&jornal=1&pagina=4&totalArquivos=156",
        alteracoes: [
          {
            titulo: "Portaria nº 586, de 16 de maio de 2023 — Atualização",
            url: "https://www.in.gov.br/web/dou/-/portaria-mapa-n-586-de-16-de-maio-de-2023-486234511",
          },
        ],
      },
      {
        titulo: "IN nº 29, de 19 de setembro de 2012",
        ementa:
          "Estabelece a complementação dos padrões de identidade e qualidade para aguardente de cana e para cachaça.",
        palavrasChave: ["PIQ cachaça", "PIQ aguardente de cana", "cachaça", "aguardente"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=20/09/2012&jornal=1&pagina=4&totalArquivos=232",
      },
    ],
  },

  // ── EXPORTAÇÃO E IMPORTAÇÃO ──────────────────────────────────────────────────
  {
    titulo: "Exportação e Importação — Instruções Normativas",
    tipo: "instrucao",
    secao: "Exportação e Importação",
    normas: [
      {
        titulo: "IN nº 54, de 18 de novembro de 2009",
        ementa:
          "Estabelece procedimentos para colheita e destinação de amostras para amostragem de importados e para exportação e importação de vinho e derivados da uva e do vinho.",
        palavrasChave: ["exportação", "importação", "amostragem", "vinho", "derivados da uva"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=20/11/2009&jornal=1&pagina=52&totalArquivos=296",
        alteracoes: [
          {
            titulo: "IN nº 18, de 30 de junho de 2010",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=01/07/2010&jornal=1&pagina=21&totalArquivos=224",
          },
          {
            titulo: "IN nº 67, de 5 de novembro de 2018 — Revogação parcial",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=16/11/2018&jornal=515&pagina=17&totalArquivos=186",
          },
        ],
      },
      {
        titulo: "IN nº 55, de 18 de novembro de 2009",
        ementa:
          "Estabelece os procedimentos para coleta e destinação de amostra; análise pericial; amostragem de produto importado; exportação e importação de bebidas e fermentados acéticos.",
        palavrasChave: [
          "exportação",
          "importação",
          "amostragem",
          "análise pericial",
          "bebidas",
          "fermentados acéticos",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?jornal=1&pagina=1&data=19/11/2009&totalArquivos=112",
        alteracoes: [
          {
            titulo: "IN nº 19, de 30 de junho de 2010 — Modelos de Etiqueta e Invólucro",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=01/07/2010&jornal=1&pagina=21&totalArquivos=224",
          },
          {
            titulo: "IN nº 67, de 5 de novembro de 2018 — Revogação parcial",
            url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=16/11/2018&jornal=515&pagina=17&totalArquivos=186",
          },
        ],
      },
      {
        titulo: "IN nº 67, de 5 de novembro de 2018",
        ementa:
          "Institui os procedimentos de informatização dos trâmites administrativos de certificação para exportação e importação de bebidas, fermentados acéticos, vinhos e derivados da uva e do vinho.",
        palavrasChave: [
          "certificação",
          "importação",
          "exportação",
          "vinhos",
          "bebidas",
          "informatização",
          "CIE",
          "CIEa",
        ],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=16/11/2018&jornal=515&pagina=17&totalArquivos=186",
      },
      {
        titulo: "IN nº 75, de 31 de dezembro de 2019",
        ementa:
          "Estabelece os critérios e define os parâmetros analíticos para fiscalização e controle de bebidas, vinhos e derivados da uva e do vinho, nacionais e importados.",
        palavrasChave: ["parâmetros analíticos", "fiscalização", "controle", "importados"],
        url: "https://pesquisa.in.gov.br/imprensa/jsp/visualiza/index.jsp?data=02/01/2020&jornal=515&pagina=1",
      },
    ],
  },
  {
    titulo: "Exportação e Importação — Despachos Decisórios",
    tipo: "despacho",
    secao: "Exportação e Importação",
    normas: [
      {
        titulo: "Despacho Decisório, de 14 de novembro de 2019",
        ementa:
          "Estabelece extensão até 31 de dezembro de 2019 do prazo para adequação dos laudos de importação de vinhos na forma contida na IN MAPA nº 67/2018.",
        palavrasChave: ["importação de vinhos", "laudos", "prazo", "IN 67/2018", "parâmetros analíticos"],
        url: "https://boletim.sigepe.gov.br/publicacao/detalhar/28409",
      },
    ],
  },
]

const secoes = Array.from(new Set(categorias.map((c) => c.secao)))

const tipoBadge: Record<string, string> = {
  lei: "bg-emerald-100 text-emerald-800 border-emerald-200",
  decreto: "bg-blue-100 text-blue-800 border-blue-200",
  instrucao: "bg-amber-100 text-amber-800 border-amber-200",
  portaria: "bg-rose-100 text-rose-800 border-rose-200",
  despacho: "bg-slate-100 text-slate-700 border-slate-200",
}

const tipoLabel: Record<string, string> = {
  lei: "Lei",
  decreto: "Decreto",
  instrucao: "IN",
  portaria: "Portaria",
  despacho: "Despacho",
}

export default function LegislacaoPage() {
  const [busca, setBusca] = useState("")
  const [expandidos, setExpandidos] = useState<Record<number, boolean>>({})
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null)

  const toggleCategoria = (index: number) => {
    setExpandidos((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()

  const termoBusca = normalizarTexto(busca)

  const categoriasFiltradas = categorias
    .filter((cat) => !secaoAtiva || cat.secao === secaoAtiva)
    .map((cat) => ({
      ...cat,
      normas: cat.normas.filter((norma) => {
        if (!termoBusca) return true
        return (
          normalizarTexto(norma.titulo).includes(termoBusca) ||
          normalizarTexto(norma.ementa).includes(termoBusca) ||
          norma.palavrasChave.some((p) => normalizarTexto(p).includes(termoBusca)) ||
          (norma.alteracoes ?? []).some((a) => normalizarTexto(a.titulo).includes(termoBusca))
        )
      }),
    }))
    .filter((cat) => cat.normas.length > 0)

  const totalNormas = categorias.reduce((acc, cat) => acc + cat.normas.length, 0)
  const totalFiltradas = categoriasFiltradas.reduce((acc, cat) => acc + cat.normas.length, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
              <Scale className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h1 className="font-bold text-foreground leading-none">Legislação</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Leis e Normas Vigentes — Bebidas e Vinhos</p>
            </div>
          </div>
          <a
            href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-programas-nacionais-e-seguranca-dos-alimentos-1/legislacao/bebidas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              MAPA/DIPOV
            </Button>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">

        {/* Buscador */}
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground">Buscar na Biblioteca de Normas</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por título, ementa, palavras-chave ou alteração..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {busca
                    ? `${totalFiltradas} norma(s) encontrada(s) de ${totalNormas}`
                    : `${totalNormas} normas em ${categorias.length} categorias`}
                </span>
                {busca && (
                  <button onClick={() => setBusca("")} className="text-rose-500 hover:underline">
                    Limpar busca
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtro por seção (abas do site original) */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSecaoAtiva(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              secaoAtiva === null
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-card text-muted-foreground border-border hover:border-rose-400 hover:text-foreground"
            }`}
          >
            Todas
          </button>
          {secoes.map((secao) => (
            <button
              key={secao}
              onClick={() => setSecaoAtiva(secaoAtiva === secao ? null : secao)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                secaoAtiva === secao
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-card text-muted-foreground border-border hover:border-rose-400 hover:text-foreground"
              }`}
            >
              {secao}
            </button>
          ))}
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-programas-nacionais-e-seguranca-dos-alimentos-1/legislacao/bebidas"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="border-border/60 hover:border-rose-500/40 hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                  <BookOpen className="h-5 w-5 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-rose-600 transition-colors">
                    Biblioteca Completa MAPA
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Legislação de Vinhos e Bebidas — gov.br
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </a>
          <a
            href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-1/biblioteca-de-normas-vinhos-e-bebidas/AnexoNormaInternaDIPOV2Edicao.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="border-border/60 hover:border-amber-500/40 hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-amber-600 transition-colors">
                    Cartilhão de Bebidas — IN 140/2024
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Consolidação das Normas — 6ª Edição (PDF)
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </a>
          <a
            href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/cursos-dipov/cursos-de-conhecimentos-gerais-de-vinhos-e-bebidas"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="border-border/60 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    Cursos Gratuitos DIPOV/MAPA
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Cursos de vinhos e bebidas para produtores e técnicos
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </a>
          <a
            href="http://sistemasweb.agricultura.gov.br/pages/SISMAN.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="border-border/60 hover:border-emerald-500/40 hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Scale className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                    SISMAN — Consulta Pública
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Normas em elaboração e consultas públicas
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </a>
          <Link href="/legislacao/cgc-mapa" className="group">
            <Card className="border-emerald-500/30 bg-emerald-50/40 hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-emerald-700 transition-colors">
                    Registro CGC/MAPA — SIPEAGRO
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Produtos passíveis de registro + habilitações ativas (busca)
                  </p>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0 rotate-180" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Categorias */}
        {categoriasFiltradas.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Nenhuma norma encontrada</p>
              <p className="text-sm mt-1">Tente outros termos na busca ou remova o filtro de seção.</p>
            </CardContent>
          </Card>
        ) : (
          categoriasFiltradas.map((categoria, catIdx) => {
            const isExpanded = expandidos[catIdx] !== false
            return (
              <Card key={catIdx} className="border-border/60 overflow-hidden">
                <CardHeader
                  className="py-3 px-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleCategoria(catIdx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2 py-0.5 ${tipoBadge[categoria.tipo]}`}
                      >
                        {tipoLabel[categoria.tipo]}
                      </Badge>
                      <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                        {categoria.secao}
                      </span>
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {categoria.titulo}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">
                        {categoria.normas.length} norma{categoria.normas.length !== 1 ? "s" : ""}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <div className="divide-y divide-border/50">
                    {categoria.normas.map((norma, normaIdx) => (
                      <div key={normaIdx} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                        <a
                          href={norma.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-1.5"
                        >
                          <span className="text-sm font-semibold text-foreground group-hover:text-rose-600 transition-colors leading-snug">
                            {norma.titulo}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
                        </a>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {norma.ementa}
                        </p>

                        {/* Alterações */}
                        {norma.alteracoes && norma.alteracoes.length > 0 && (
                          <div className="mt-2 pl-3 border-l-2 border-border space-y-1">
                            {norma.alteracoes.map((alt, altIdx) => (
                              <a
                                key={altIdx}
                                href={alt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 group-hover:text-rose-500 transition-colors" />
                                <span className="leading-snug">{alt.titulo}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Palavras-chave */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {norma.palavrasChave.map((pc, pcIdx) => (
                            <button
                              key={pcIdx}
                              onClick={() => setBusca(pc)}
                              className="text-xs bg-muted hover:bg-muted/70 text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 transition-colors cursor-pointer"
                            >
                              {pc}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })
        )}

        {/* Rodapé */}
        <p className="text-xs text-center text-muted-foreground pb-4">
          Fonte: Ministério da Agricultura e Pecuária (MAPA) — Divisão de Inspeção de Produtos de Origem Vegetal (DIPOV).{" "}
          <a
            href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-programas-nacionais-e-seguranca-dos-alimentos-1/legislacao/bebidas"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Acesse a fonte oficial
          </a>{" "}
          para informações atualizadas.
        </p>
      </main>
    </div>
  )
}
