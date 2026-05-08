"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Habilitacao = {
  ncm: string
  nivel: string
  habilitacao: string
  legislacao: string
  docs?: string
  vistoria?: string
}

type Produto = {
  nome: string
  habilitacoes: Habilitacao[]
}

const NIVEL_COLORS: Record<string, string> = {
  "Básico": "bg-emerald-100 text-emerald-800",
  "Intermediário": "bg-amber-100 text-amber-800",
  "Completo": "bg-rose-100 text-rose-800",
}

function getNivelColor(nivel: string) {
  for (const key of Object.keys(NIVEL_COLORS)) {
    if (nivel.toLowerCase().includes(key.toLowerCase())) return NIVEL_COLORS[key]
  }
  return "bg-gray-100 text-gray-700"
}

const PRODUTOS: Produto[] = [
  { nome: "ABACATE", habilitacoes: [{ ncm: "0804.40.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ABACATE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ABACAXI", habilitacoes: [{ ncm: "0804.30.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ABACAXI", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ABÓBORA", habilitacoes: [{ ncm: "0709.93.00", nivel: "Básico (geral)", habilitacao: "CONSOLIDADOR, BENEFICIADOR OU EMBALADOR DE ABÓBORA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ABOBRINHA", habilitacoes: [{ ncm: "0709.93.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ABOBRINHA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ACEROLA", habilitacoes: [{ ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ACEROLA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "AÇÚCAR", habilitacoes: [
    { ncm: "1701.13.00 / 1701.14.00", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR OU INDUSTRIALIZADOR DE AÇÚCAR", legislacao: "IN MAPA nº 47/2018 (alt. IN MAPA nº 60/2019) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1701.13.00 / 1701.14.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE AÇÚCAR", legislacao: "IN MAPA nº 47/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1701.13.00 / 1701.14.00", nivel: "Intermediário (Colômbia)", habilitacao: "EXPORTADOR DE AÇÚCAR PARA A COLÔMBIA - PROCESSADOR", legislacao: "IN MAPA nº 47/2018 | Decreto Colômbia nº 539/2014 | IN SDA/MAPA nº 97/2020" },
    { ncm: "1701.13.00 / 1701.14.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE AÇÚCAR PARA A CHINA - PROCESSADOR", legislacao: "IN MAPA nº 47/2018 | Decreto China nº 248/2021" },
  ]},
  { nome: "AGRIÃO", habilitacoes: [{ ncm: "0709.99.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE AGRIÃO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ALFACE", habilitacoes: [{ ncm: "0705.19.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ALFACE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ALGODÃO EM PLUMA", habilitacoes: [{ ncm: "5201.00.20", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE ALGODÃO EM PLUMA", legislacao: "IN MAPA nº 24/2016 | IN MAPA nº 31/2013" }] },
  { nome: "ALHO", habilitacoes: [{ ncm: "0703.20.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ALHO", legislacao: "Portaria MAPA nº 435/2022 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ALMEIRÃO", habilitacoes: [{ ncm: "0709.99.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ALMEIRÃO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ALPISTE", habilitacoes: [
    { ncm: "1008.30.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE ALPISTE", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013" },
    { ncm: "1008.30.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ALPISTE", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "AMEIXA", habilitacoes: [{ ncm: "0809.40.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE AMEIXA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "AMÊNDOA DA CASTANHA DE CAJU", habilitacoes: [
    { ncm: "0801.32.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE AMÊNDOA DA CASTANHA DE CAJU", legislacao: "IN MAPA nº 02/2017 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0801.32.00", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR DE AMÊNDOA DA CASTANHA DE CAJU", legislacao: "IN MAPA nº 02/2017 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "AMÊNDOA DE CACAU", habilitacoes: [{ ncm: "1801.00.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE AMÊNDOA DE CACAU", legislacao: "IN MAPA nº 38/2008 (alt. IN MAPA nº 57/2008) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "AMENDOIM", habilitacoes: [
    { ncm: "1202.41.00 / 1202.42.00", nivel: "Completo (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR DE AMENDOIM (em casca)", legislacao: "IN MAPA nº 32/2016 | IN MAPA nº 03/2009 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1202.41.00 / 1202.42.00", nivel: "Completo (geral)", habilitacao: "EMBALADOR DE AMENDOIM (em casca / beneficiado)", legislacao: "IN MAPA nº 32/2016 | IN MAPA nº 03/2009 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1202.42.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE AMENDOIM PARA A CHINA - BENEFICIADOR", legislacao: "IN SDA/MAPA nº 97/2020 | Decreto AQSIQ/China nº 177/2016 | Decreto China nº 248/2021" },
    { ncm: "1202.41.00 / 1202.42.00", nivel: "Completo (União Europeia)", habilitacao: "EXPORTADOR DE AMENDOIM PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 32/2016 | IN MAPA nº 03/2009 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1202.41.00 / 1202.42.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE AMENDOIM PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 32/2016 | IN MAPA nº 03/2009" },
  ]},
  { nome: "AMORA", habilitacoes: [{ ncm: "0810.20.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE AMORA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ANONÁCEAS", habilitacoes: [{ ncm: "0810.90.12", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE ANONÁCEAS", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "ARAÇÁ-ROSA", habilitacoes: [
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE ARAÇÁ-ROSA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ARAÇÁ-ROSA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ARROZ (BENEFICIADO)", habilitacoes: [
    { ncm: "1006.20.10 / 1006.20.20 / 1006.30.x", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR DE ARROZ", legislacao: "IN MAPA nº 06/2009 (alt. IN MAPA nº 02/2012) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1006.20.10 / 1006.20.20 / 1006.30.x", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ARROZ", legislacao: "IN MAPA nº 06/2009 (alt. IN MAPA nº 02/2012) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1006.20.10 / 1006.20.20 / 1006.30.x", nivel: "Completo (Emirados Árabes)", habilitacao: "EXPORTADOR DE ARROZ PARA OS EMIRADOS ÁRABES UNIDOS", legislacao: "IN MAPA nº 06/2009 | IN SDA/MAPA nº 97/2020" },
  ]},
  { nome: "ARROZ (EM CASCA)", habilitacoes: [
    { ncm: "1006.10.91 / 1006.10.92", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR DE ARROZ EM CASCA", legislacao: "IN MAPA nº 06/2009 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1006.10.91 / 1006.10.92", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ARROZ EM CASCA", legislacao: "IN MAPA nº 06/2009 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "AVEIA", habilitacoes: [
    { ncm: "1104.12.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE AVEIA", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1104.12.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE AVEIA", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "AZEITE DE OLIVA", habilitacoes: [
    { ncm: "1509.90.10 / 1509.90.90", nivel: "Completo (geral)", habilitacao: "PROCESSADOR DE AZEITE DE OLIVA", legislacao: "IN MAPA nº 01/2012 | IN MAPA nº 31/2013" },
    { ncm: "1509.90.10 / 1509.90.90", nivel: "Completo (geral)", habilitacao: "EMBALADOR DE AZEITE DE OLIVA", legislacao: "IN MAPA nº 01/2012 | IN MAPA nº 31/2013" },
    { ncm: "1509.90.10 / 1509.90.90", nivel: "Intermediário (geral)", habilitacao: "DISTRIBUIDOR DE AZEITE DE OLIVA", legislacao: "IN MAPA nº 01/2012 (alt. IN nº 19/2012) | IN MAPA nº 31/2013" },
    { ncm: "1509.90.10 / 1509.90.90", nivel: "Intermediário (Importador)", habilitacao: "IMPORTADOR DE AZEITE DE OLIVA", legislacao: "IN MAPA nº 01/2012 | IN MAPA nº 19/2012 | IN MAPA nº 31/2013" },
  ]},
  { nome: "BANANA", habilitacoes: [{ ncm: "0803.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE BANANA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "BATATA", habilitacoes: [{ ncm: "0701.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE BATATA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "BATATA DOCE", habilitacoes: [{ ncm: "0714.20.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE BATATA DOCE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "BEBIDAS EM GERAL", habilitacoes: [
    { ncm: "2202.x / 2206.x / 2208.x", nivel: "Completo (geral)", habilitacao: "ELABORADOR DE BEBIDAS", legislacao: "Lei nº 8.918/1994 | Decreto nº 6.871/2009 | IN MAPA nº 140/2024 (Cartilhão)" },
    { ncm: "2202.x / 2206.x / 2208.x", nivel: "Básico (geral)", habilitacao: "ENGARRAFADOR DE BEBIDAS", legislacao: "Lei nº 8.918/1994 | Decreto nº 6.871/2009 | IN MAPA nº 140/2024" },
    { ncm: "2202.x / 2206.x / 2208.x", nivel: "Completo (geral)", habilitacao: "IMPORTADOR DE BEBIDAS", legislacao: "IN MAPA nº 72/2018 | IN MAPA nº 140/2024 (Cartilhão)" },
  ]},
  { nome: "BETERRABA", habilitacoes: [
    { ncm: "0706.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE BETERRABA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0712.90.90", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE BETERRABA EM PÓ PARA A CHINA - PROCESSADOR", legislacao: "Decreto China nº 248/2021 | Decreto nº 6.268/2007 | IN nº 9/2019" },
  ]},
  { nome: "BRÓCOLIS", habilitacoes: [{ ncm: "0704.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE BRÓCOLIS", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "BUTIÁ", habilitacoes: [
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE BUTIÁ", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE BUTIÁ", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CACAU", habilitacoes: [{ ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CACAU", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CAFÉ (BENEFICIADO GRÃO CRU)", habilitacoes: [
    { ncm: "0901.11.10 / 0901.12.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CAFÉ GRÃO CRU", legislacao: "IN MAPA nº 08/2003 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0901.11.10 / 0901.12.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CAFÉ", legislacao: "IN MAPA nº 08/2003 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0901.11.10 / 0901.12.00", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE CAFÉ BENEFICIADO GRÃO CRU PARA A CHINA - BENEFICIADOR OU EMBALADOR A01", legislacao: "IN SDA/MAPA nº 97/2020 | Decreto China nº 248/2021" },
    { ncm: "0901.11.10 / 0901.12.00", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE CAFÉ BENEFICIADO GRÃO CRU PARA A CHINA - COMERCIAL EXCLUSIVAMENTE ARMAZENADOR A02", legislacao: "IN SDA/MAPA nº 97/2020 | Decreto China nº 248/2021" },
  ]},
  { nome: "CAFÉ (TORRADO)", habilitacoes: [
    { ncm: "0901.21.00 / 0901.22.00", nivel: "Básico (geral)", habilitacao: "INDUSTRIALIZADOR OU PROCESSADOR DE CAFÉ TORRADO", legislacao: "Portaria SDA/MAPA nº 570/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0901.21.00 / 0901.22.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CAFÉ TORRADO", legislacao: "Portaria SDA/MAPA nº 570/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CAJU", habilitacoes: [{ ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CAJU", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CAMU-CAMU", habilitacoes: [
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CAMU-CAMU", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CAMU-CAMU", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CANJICA DE MILHO", habilitacoes: [
    { ncm: "1005.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CANJICA DE MILHO", legislacao: "Portaria MA nº 109/1989 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1005.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CANJICA DE MILHO", legislacao: "Portaria MA nº 109/1989 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CAQUI", habilitacoes: [{ ncm: "0810.70.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CAQUI", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CARAMBOLA", habilitacoes: [{ ncm: "0810.90.11", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CARAMBOLA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CAROÇO DE ALGODÃO", habilitacoes: [{ ncm: "5201.00.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE CAROÇO DE ALGODÃO", legislacao: "Portaria MA nº 55/1990 | IN MAPA nº 31/2013" }] },
  { nome: "CASTANHA DE BARU", habilitacoes: [
    { ncm: "0802.99.00", nivel: "Intermediário (geral)", habilitacao: "BENEFICIADOR OU PROCESSADOR DE CASTANHA DE BARU", legislacao: "Portaria SDA nº 635/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0802.99.00", nivel: "Intermediário (geral)", habilitacao: "EMBALADOR DE CASTANHA DE BARU", legislacao: "Portaria SDA nº 635/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CASTANHA DE CAJU", habilitacoes: [{ ncm: "0801.31.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CASTANHA DE CAJU", legislacao: "Portaria MA nº 644/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CASTANHA DO BRASIL", habilitacoes: [
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (geral)", habilitacao: "BENEFICIADOR DE CASTANHA DO BRASIL", legislacao: "Portaria MA nº 846/1976 | IN MAPA nº 11/2010 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (geral)", habilitacao: "EMBALADOR DE CASTANHA DO BRASIL", legislacao: "Portaria MA nº 846/1976 | IN MAPA nº 11/2010 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE CASTANHA-DO-BRASIL PARA A CHINA", legislacao: "IN SDA/MAPA nº 97/2020 | IN MAPA nº 11/2010 | Decreto China nº 248/2021" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (União Europeia)", habilitacao: "EXPORTADOR DE CASTANHA DO BRASIL PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN SDA/MAPA nº 97/2020 | IN MAPA nº 11/2010" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE CASTANHA DO BRASIL PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN SDA/MAPA nº 97/2020 | IN MAPA nº 11/2010" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (Arábia Saudita)", habilitacao: "EXPORTADOR DE CASTANHA-DO-BRASIL PARA A ARÁBIA SAUDITA - BENEFICIADOR", legislacao: "IN SDA/MAPA nº 97/2020 | IN MAPA nº 11/2010" },
    { ncm: "0801.21.00 / 0801.22.00", nivel: "Completo (Emirados Árabes)", habilitacao: "EXPORTADOR DE CASTANHA-DO-BRASIL PARA OS EMIRADOS ÁRABES UNIDOS - BENEFICIADOR", legislacao: "IN SDA/MAPA nº 97/2020 | IN MAPA nº 11/2010" },
  ]},
  { nome: "CEBOLA", habilitacoes: [{ ncm: "0703.10.19", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CEBOLA", legislacao: "Portaria MAPA nº 427/2022 (alt. Portaria MAPA nº 486/2022) | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" }] },
  { nome: "CENOURA", habilitacoes: [{ ncm: "0706.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CENOURA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CENTEIO", habilitacoes: [
    { ncm: "1002.90.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CENTEIO", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1002.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CENTEIO", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CERA DE CARNAÚBA", habilitacoes: [{ ncm: "1521.10.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR, PROCESSADOR OU INDUSTRIALIZADOR DE CERA DE CARNAÚBA", legislacao: "IN MAPA nº 35/2004 | IN MAPA nº 31/2013" }] },
  { nome: "CEVADA", habilitacoes: [
    { ncm: "1003.90.80", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CEVADA", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1003.90.80", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CEVADA", legislacao: "Portaria MA nº 191/1975 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1003.90.10", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE CEVADA PARA FINS CERVEJEIROS", legislacao: "Portaria MA nº 691/1996 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1003.90.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE CEVADA PARA FINS CERVEJEIROS", legislacao: "Portaria MA nº 691/1996 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "CHIA", habilitacoes: [{ ncm: "1207.10.90", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE CHIA PARA A CHINA - BENEFICIADOR", legislacao: "Decreto China nº 248/2021" }] },
  { nome: "CHICÓRIA", habilitacoes: [{ ncm: "0705.29.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CHICÓRIA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CITRUS (OUTROS)", habilitacoes: [{ ncm: "0805.50.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE OUTROS CITRUS", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "COCO VERDE", habilitacoes: [{ ncm: "0801.19.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE COCO VERDE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "COUVE", habilitacoes: [{ ncm: "0704.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE COUVE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "COUVE-FLOR", habilitacoes: [{ ncm: "0704.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE COUVE-FLOR", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CRAVO DA ÍNDIA", habilitacoes: [{ ncm: "0907.10.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR OU EMBALADOR DE CRAVO DA ÍNDIA", legislacao: "Portaria MA nº 159/1981 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CUPUAÇU", habilitacoes: [{ ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE CUPUAÇU", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "CÚRCUMA EM PÓ", habilitacoes: [{ ncm: "0712.90.90", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE CÚRCUMA EM PÓ PARA A CHINA - PROCESSADOR", legislacao: "Decreto China nº 248/2021 | Decreto nº 6.268/2007 | IN nº 9/2019" }] },
  { nome: "ERVILHA", habilitacoes: [
    { ncm: "0713.10.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE ERVILHA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0713.10.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ERVILHA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ESPECIARIAS (PIMENTA ROSA E OUTRAS)", habilitacoes: [{ ncm: "0904.11.00", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE PIMENTA ROSA E OUTRAS ESPECIARIAS PARA CHINA", legislacao: "Decreto China nº 248/2021" }] },
  { nome: "FARELO DE ALGODÃO", habilitacoes: [{ ncm: "2306.10.01", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE FARELO DE ALGODÃO PARA A CHINA - PROCESSADOR", legislacao: "Decreto nº 6.268/2007 | IN SDA/MAPA nº 9/2019 | Protocolo MAPA/GACC" }] },
  { nome: "FARELO DE ARROZ", habilitacoes: [{ ncm: "2302.20.10", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE FARELO DE ARROZ PARA A CHINA - PROCESSADOR", legislacao: "IN MAPA nº 31/2013 | Decreto China nº 248/2021" }] },
  { nome: "FARELO DE SOJA", habilitacoes: [
    { ncm: "2304.00.10 / 2304.00.90", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE FARELO DE SOJA", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 31/2013" },
    { ncm: "2304.00.10 / 2304.00.90", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE FARELO DE SOJA PARA A CHINA - PROCESSADOR OU INDUSTRIALIZADOR", legislacao: "Decreto nº 6.268/2007 | IN SDA/MAPA nº 9/2019 | Protocolo MAPA/GACC" },
  ]},
  { nome: "FARINHA DE MANDIOCA", habilitacoes: [
    { ncm: "1106.20.00", nivel: "Intermediário (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE FARINHA DE MANDIOCA", legislacao: "IN MAPA nº 52/2011 (alt. IN MAPA nº 58/2020) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1106.20.00", nivel: "Intermediário (geral)", habilitacao: "EMBALADOR DE FARINHA DE MANDIOCA", legislacao: "IN MAPA nº 52/2011 (alt. IN MAPA nº 58/2020) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "FARINHA DE TRIGO", habilitacoes: [
    { ncm: "1101.00.10", nivel: "Intermediário (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE FARINHA DE TRIGO", legislacao: "IN MAPA nº 08/2005 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1101.00.10", nivel: "Intermediário (geral)", habilitacao: "EMBALADOR DE FARINHA DE TRIGO", legislacao: "IN MAPA nº 08/2005 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "FEIJÃO", habilitacoes: [
    { ncm: "0713.33.x", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE FEIJÃO", legislacao: "IN MAPA nº 12/2008 | IN MAPA nº 56/2009 | IN MAPA nº 48/2011 | IN MAPA nº 31/2013" },
    { ncm: "0713.33.x", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE FEIJÃO", legislacao: "IN MAPA nº 12/2008 | IN MAPA nº 56/2009 | IN MAPA nº 48/2011 | IN MAPA nº 31/2013" },
  ]},
  { nome: "FIBRA DE JUTA", habilitacoes: [{ ncm: "5303.10.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR OU BENEFICIADOR DE FIBRA DE JUTA", legislacao: "Portaria MA nº 149/1982 | IN MAPA nº 31/2013" }] },
  { nome: "FIBRA DE MALVA / GUAXIMA", habilitacoes: [{ ncm: "5305.00.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR OU BENEFICIADOR DE FIBRA DE MALVA OU GUAXIMA", legislacao: "Portaria MA nº 150/1982 | IN MAPA nº 31/2013" }] },
  { nome: "FIBRA DE SISAL", habilitacoes: [{ ncm: "5305.00.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR OU BENEFICIADOR DE FIBRA DE SISAL", legislacao: "Portaria MA nº 71/1983 | Portaria MA nº 249/1983 | Portaria MA nº 122/1984 | IN MAPA nº 31/2013" }] },
  { nome: "FIGO", habilitacoes: [{ ncm: "0804.20.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE FIGO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "FRAMBOESA", habilitacoes: [{ ncm: "0810.20.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE FRAMBOESA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "FUMO EM CORDA", habilitacoes: [{ ncm: "2401.20.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE FUMO EM CORDA", legislacao: "Portaria MA nº 662/1989 | IN MAPA nº 31/2013" }] },
  { nome: "GENGIBRE EM PÓ", habilitacoes: [{ ncm: "0712.90.90", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE GENGIBRE EM PÓ PARA A CHINA - PROCESSADOR", legislacao: "Decreto China nº 248/2021 | Decreto nº 6.268/2007 | IN nº 9/2019" }] },
  { nome: "GERGELIM", habilitacoes: [
    { ncm: "1207.40.90", nivel: "Completo (Líbano)", habilitacao: "EXPORTADOR DE GERGELIM PARA O LÍBANO", legislacao: "Ofício MRE/2021" },
    { ncm: "1207.40.90", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE GERGELIM PARA A CHINA - BENEFICIADOR V1", legislacao: "Protocolo MAPA/GACC | IN MAPA nº 31/2013" },
    { ncm: "1207.40.90", nivel: "Intermediário (México)", habilitacao: "EXPORTADOR DE GERGELIM PARA O MÉXICO - BENEFICIADOR", legislacao: "Requisitos do México (SENASICA) | IN nº 9/2019" },
  ]},
  { nome: "GIRASSOL", habilitacoes: [
    { ncm: "1206.00.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE GIRASSOL", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013" },
    { ncm: "1206.00.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE GIRASSOL", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013" },
  ]},
  { nome: "GOIABA", habilitacoes: [{ ncm: "0804.50.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE GOIABA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "GRUMIXAMA", habilitacoes: [
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE GRUMIXAMA", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE GRUMIXAMA", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "GUARANÁ", habilitacoes: [{ ncm: "1212.99.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR OU PROCESSADOR DE GUARANÁ", legislacao: "Portaria MA nº 70/1982 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "JABUTICABA", habilitacoes: [
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE JABUTICABA", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE JABUTICABA", legislacao: "IN MAPA nº 69/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "KIWI", habilitacoes: [{ ncm: "0810.50.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE KIWI", legislacao: "Portaria MA nº 34/1998 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" }] },
  { nome: "LARANJA", habilitacoes: [{ ncm: "0805.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE LARANJA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "LENTILHA", habilitacoes: [
    { ncm: "0713.40.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE LENTILHA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0713.40.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE LENTILHA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "LIMA", habilitacoes: [{ ncm: "0805.50.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE LIMA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "LIMÃO", habilitacoes: [{ ncm: "0805.50.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE LIMÃO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "LINHAÇA", habilitacoes: [
    { ncm: "1204.00.10 / 1204.00.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE LINHAÇA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1204.00.10 / 1204.00.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE LINHAÇA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "MAÇÃ", habilitacoes: [
    { ncm: "0808.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MAÇÃ", legislacao: "IN MAPA nº 05/2006 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" },
    { ncm: "0808.10.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MAÇÃ PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 05/2006 | IN MAPA nº 69/2018" },
    { ncm: "0808.10.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MAÇÃ PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 05/2006 | IN MAPA nº 69/2018" },
  ]},
  { nome: "MALTE DE CEVADA", habilitacoes: [
    { ncm: "1107.10.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE MALTE DE CEVADA", legislacao: "IN MAPA nº 11/2013 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1107.10.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE MALTE DE CEVADA", legislacao: "IN MAPA nº 11/2013 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "MAMÃO", habilitacoes: [
    { ncm: "0807.20.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MAMÃO", legislacao: "IN MAPA nº 04/2010 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" },
    { ncm: "0807.20.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MAMÃO PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 04/2010 | IN MAPA nº 69/2018" },
    { ncm: "0807.20.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MAMÃO PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 04/2010 | IN MAPA nº 69/2018" },
  ]},
  { nome: "MAMONA", habilitacoes: [{ ncm: "1207.99.92", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE MAMONA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013" }] },
  { nome: "MANDARINA", habilitacoes: [{ ncm: "0805.21.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MANDARINA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MANGA", habilitacoes: [
    { ncm: "0804.50.20", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MANGA", legislacao: "IN MAPA nº 38/2012 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" },
    { ncm: "0804.50.20", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MANGA PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 38/2012 | IN MAPA nº 69/2018" },
    { ncm: "0804.50.20", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MANGA PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 38/2012 | IN MAPA nº 69/2018" },
  ]},
  { nome: "MARACUJÁ", habilitacoes: [{ ncm: "0810.90.15", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MARACUJÁ", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MARGARINA", habilitacoes: [
    { ncm: "1517.10.00", nivel: "Completo (geral)", habilitacao: "INDUSTRIALIZADOR OU PROCESSADOR DE MARGARINA", legislacao: "IN MAPA nº 66/2019 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1517.10.00", nivel: "Completo (geral)", habilitacao: "EMBALADOR DE MARGARINA", legislacao: "IN MAPA nº 66/2019 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1517.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE MARGARINA LÍQUIDA", legislacao: "IN MAPA nº 66/2019 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "MARMELO", habilitacoes: [{ ncm: "0808.40.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MARMELO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MELANCIA", habilitacoes: [{ ncm: "0807.11.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MELANCIA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MELÃO", habilitacoes: [
    { ncm: "0807.19.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MELÃO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0807.19.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MELÃO PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 69/2018" },
    { ncm: "0807.19.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE MELÃO PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 69/2018" },
  ]},
  { nome: "MILHO", habilitacoes: [
    { ncm: "1005.90.10", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE MILHO", legislacao: "IN MAPA nº 60/2011 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1005.90.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE MILHO", legislacao: "IN MAPA nº 60/2011 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1005.90.10", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE MILHO PARA A CHINA A01 - BENEFICIADOR", legislacao: "IN SDA/MAPA nº 97/2020 | Decreto AQSIQ/China nº 177/2016 | Protocolo MAPA/GACC" },
    { ncm: "1005.90.10", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE MILHO PARA A CHINA - ARMAZÉM PORTUÁRIO V.01", legislacao: "IN SDA/MAPA nº 97/2020 | Decreto AQSIQ/China nº 177/2016" },
    { ncm: "1005.90.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE MILHO PIPOCA", legislacao: "IN MAPA nº 61/2011 | IN MAPA nº 04/2014 | IN MAPA nº 31/2013" },
    { ncm: "1005.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE MILHO PIPOCA", legislacao: "IN MAPA nº 61/2011 | IN MAPA nº 04/2014 | IN MAPA nº 31/2013" },
  ]},
  { nome: "MIRTILO", habilitacoes: [{ ncm: "0810.40.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MIRTILO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MORANGO", habilitacoes: [{ ncm: "0810.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE MORANGO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "MORINGA EM PÓ", habilitacoes: [{ ncm: "0712.90.90", nivel: "Intermediário (China)", habilitacao: "EXPORTADOR DE MORINGA EM PÓ PARA A CHINA - PROCESSADOR", legislacao: "Decreto China nº 248/2021 | Decreto nº 6.268/2007 | IN nº 9/2019" }] },
  { nome: "NECTARINA", habilitacoes: [{ ncm: "0809.30.20", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE NECTARINA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "NÊSPERA", habilitacoes: [{ ncm: "0810.90.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE NÊSPERA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "NOZ DE MACADÂMIA", habilitacoes: [
    { ncm: "0802.61.00 / 0802.62.00", nivel: "Intermediário (geral)", habilitacao: "PROCESSADOR OU BENEFICIADOR DE NOZ DE MACADÂMIA", legislacao: "Portaria SDA/MAPA nº 635/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0802.61.00 / 0802.62.00", nivel: "Intermediário (geral)", habilitacao: "EMBALADOR DE NOZ DE MACADÂMIA", legislacao: "Portaria SDA/MAPA nº 635/2022 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0802.61.00 / 0802.62.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE NOZ DE MACADAMIA PARA A CHINA - BENEFICIADOR", legislacao: "Portaria SDA/MAPA nº 635/2022 | IN MAPA nº 31/2013" },
  ]},
  { nome: "ÓLEO DE ALGODÃO", habilitacoes: [
    { ncm: "1512.29.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE ÓLEO DE ALGODÃO", legislacao: "IN MAPA nº 49/2006 (alt. Portaria MAPA nº 418/2022) | IN MAPA nº 31/2013" },
    { ncm: "1512.29.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE ALGODÃO", legislacao: "IN MAPA nº 49/2006 (alt. Portaria MAPA nº 418/2022) | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ÓLEO DE AMENDOIM", habilitacoes: [
    { ncm: "1508.10.00 / 1508.90.00", nivel: "Básico (geral)", habilitacao: "PRODUTOR DE ÓLEO BRUTO DE AMENDOIM", legislacao: "IN MAPA nº 31/2013" },
    { ncm: "1508.10.00 / 1508.90.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE ÓLEO BRUTO DE AMENDOIM PARA A CHINA - PROCESSADOR", legislacao: "Decreto China nº 248/2021" },
  ]},
  { nome: "ÓLEO DE BABAÇU", habilitacoes: [
    { ncm: "1513.21.10 / 1513.29.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE ÓLEO DE BABAÇU", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 31/2013" },
    { ncm: "1513.21.10 / 1513.29.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE BABAÇU", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ÓLEO DE CANOLA", habilitacoes: [
    { ncm: "1514.11.10 / 1514.91.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE ÓLEO DE CANOLA", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013" },
    { ncm: "1514.11.10 / 1514.91.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE CANOLA", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ÓLEO DE GIRASSOL", habilitacoes: [
    { ncm: "1512.11.10 / 1512.19.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE ÓLEO DE GIRASSOL", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013" },
    { ncm: "1512.11.10 / 1512.19.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE GIRASSOL", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ÓLEO DE MILHO", habilitacoes: [
    { ncm: "1515.21.00 / 1515.29.10", nivel: "Básico (geral)", habilitacao: "PROCESSADOR DE ÓLEO DE MILHO", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013" },
    { ncm: "1515.21.00 / 1515.29.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE MILHO", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "ÓLEO DE SOJA", habilitacoes: [
    { ncm: "1507.10.00 / 1507.90.11", nivel: "Básico (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE ÓLEO DE SOJA", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 49/2006 | IN MAPA nº 31/2013" },
    { ncm: "1507.10.00 / 1507.90.11", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE ÓLEO DE SOJA", legislacao: "IN MAPA nº 49/2006 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1507.10.00 / 1507.90.11", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE ÓLEO DE SOJA PARA A CHINA - PROCESSADOR", legislacao: "Decreto nº 6.268/2007 | IN SDA/MAPA nº 9/2019 | Protocolo MAPA/GACC" },
  ]},
  { nome: "PALMITO", habilitacoes: [
    { ncm: "0709.99.90", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE PALMITO IN NATURA", legislacao: "IN MAPA nº 67/2011 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "2001.90.00 / 2005.99.00", nivel: "Intermediário (geral)", habilitacao: "INDUSTRIALIZADOR DE PALMITO PROCESSADO / EM CONSERVA", legislacao: "IN MAPA nº 67/2011 | Resolução ANVISA RDC nº 272/2005 | IN MAPA nº 31/2013" },
  ]},
  { nome: "PERA", habilitacoes: [{ ncm: "0808.30.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE PERA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "PÊSSEGO", habilitacoes: [{ ncm: "0809.30.10", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE PÊSSEGO", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "PIMENTA DO REINO", habilitacoes: [
    { ncm: "0904.11.00 / 0904.12.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR OU EMBALADOR DE PIMENTA DO REINO", legislacao: "Portaria MA nº 159/1981 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "0904.11.00 / 0904.12.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE PIMENTA DO REINO PARA A CHINA - BENEFICIADOR", legislacao: "Decreto China nº 248/2021 | IN MAPA nº 31/2013" },
  ]},
  { nome: "POLPA DE FRUTAS", habilitacoes: [
    { ncm: "2009.x / 2008.x", nivel: "Intermediário (geral)", habilitacao: "PROCESSADOR OU INDUSTRIALIZADOR DE POLPA DE FRUTA", legislacao: "IN MAPA nº 01/2000 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "2009.x / 2008.x", nivel: "Intermediário (geral)", habilitacao: "EMBALADOR DE POLPA DE FRUTA", legislacao: "IN MAPA nº 01/2000 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "QUINOA", habilitacoes: [{ ncm: "1008.50.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR OU EMBALADOR DE QUINOA", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "RABANETE", habilitacoes: [{ ncm: "0706.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE RABANETE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "RÚCULA", habilitacoes: [{ ncm: "0709.99.90", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE RÚCULA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "SOJA", habilitacoes: [
    { ncm: "1201.90.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE SOJA", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1201.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE SOJA", legislacao: "Portaria MA nº 795/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1201.90.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE SOJA PARA A CHINA - BENEFICIADOR", legislacao: "Decreto nº 6.268/2007 | IN SDA/MAPA nº 9/2019 | Protocolo MAPA/GACC" },
  ]},
  { nome: "SORGO", habilitacoes: [
    { ncm: "1007.90.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE SORGO", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1007.90.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE SORGO", legislacao: "Portaria MA nº 65/1993 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1007.90.00", nivel: "Completo (China)", habilitacao: "EXPORTADOR DE SORGO PARA A CHINA - BENEFICIADOR", legislacao: "Decreto nº 6.268/2007 | IN SDA/MAPA nº 9/2019 | Protocolo MAPA/GACC" },
  ]},
  { nome: "TABACO (FUMO EM FOLHA)", habilitacoes: [
    { ncm: "2401.10.10 / 2401.10.90 / 2401.20.x", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE FUMO EM FOLHA", legislacao: "Portaria MA nº 118/1973 | IN MAPA nº 31/2013" },
    { ncm: "2401.10.10 / 2401.10.90 / 2401.20.x", nivel: "Completo (geral)", habilitacao: "PROCESSADOR / INDUSTRIALIZADOR DE FUMO EM FOLHA", legislacao: "Portaria MA nº 118/1973 | Portaria MAPA nº 228/1997 | IN MAPA nº 31/2013" },
  ]},
  { nome: "TANGERINA", habilitacoes: [{ ncm: "0805.21.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE TANGERINA", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "TOMATE", habilitacoes: [{ ncm: "0702.00.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE TOMATE", legislacao: "IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" }] },
  { nome: "TRIGO", habilitacoes: [
    { ncm: "1001.99.00", nivel: "Básico (geral)", habilitacao: "BENEFICIADOR DE TRIGO", legislacao: "Portaria MAPA nº 191/1975 | IN MAPA nº 08/2005 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
    { ncm: "1001.99.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR DE TRIGO", legislacao: "Portaria MAPA nº 191/1975 | IN MAPA nº 08/2005 | IN MAPA nº 31/2013 | IN MAPA nº 23/2020" },
  ]},
  { nome: "UVA", habilitacoes: [
    { ncm: "0806.10.00", nivel: "Básico (geral)", habilitacao: "EMBALADOR, BENEFICIADOR OU CONSOLIDADOR DE UVA DE MESA", legislacao: "IN MAPA nº 55/2010 | IN MAPA nº 69/2018 | IN Conjunta MAPA/ANVISA nº 02/2018 | IN MAPA nº 31/2013" },
    { ncm: "0806.10.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE UVA PARA A UNIÃO EUROPEIA - BENEFICIADOR", legislacao: "IN MAPA nº 55/2010 | IN MAPA nº 69/2018" },
    { ncm: "0806.10.00", nivel: "Intermediário (União Europeia)", habilitacao: "EXPORTADOR DE UVA PARA A UNIÃO EUROPEIA - COMERCIAL EXPORTADORA OU TRADING", legislacao: "IN MAPA nº 55/2010 | IN MAPA nº 69/2018" },
  ]},
  { nome: "VINHO / DERIVADOS DA UVA", habilitacoes: [
    { ncm: "2204.x", nivel: "Completo (geral)", habilitacao: "ELABORADOR DE VINHO", legislacao: "Lei nº 7.678/1988 | Decreto nº 8.198/2014 | IN MAPA nº 140/2024 (Cartilhão)" },
    { ncm: "2204.x", nivel: "Completo (geral)", habilitacao: "ENGARRAFADOR DE VINHO", legislacao: "Lei nº 7.678/1988 | Decreto nº 8.198/2014 | IN MAPA nº 140/2024 (Cartilhão)" },
    { ncm: "2204.x", nivel: "Completo (geral)", habilitacao: "IMPORTADOR DE VINHO", legislacao: "IN MAPA nº 72/2018 | IN MAPA nº 140/2024 (Cartilhão)" },
  ]},
]

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function ProdutoCard({ produto }: { produto: Produto }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="border border-border overflow-hidden">
      <button
        className="w-full text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between gap-2 hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
              {produto.nome}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
              {produto.habilitacoes.length} habilitação{produto.habilitacoes.length !== 1 ? "ões" : ""}
            </Badge>
            {open
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </CardHeader>
      </button>
      {open && (
        <CardContent className="px-4 pb-4 pt-0 space-y-3">
          {produto.habilitacoes.map((h, i) => (
            <div key={i} className="border border-border rounded-md p-3 bg-muted/20 space-y-2">
              <div className="flex flex-wrap items-start gap-2">
                <Badge className={`text-xs font-medium ${getNivelColor(h.nivel)}`}>
                  {h.nivel}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  NCM: {h.ncm}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{h.habilitacao}</p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p className="font-medium text-muted-foreground/80 mb-0.5">Legislação:</p>
                {h.legislacao.split(" | ").map((leg, j) => (
                  <div key={j} className="flex items-start gap-1">
                    <span className="mt-0.5 shrink-0 text-muted-foreground/50">•</span>
                    <span>{leg}</span>
                  </div>
                ))}
              </div>
              {h.docs && (
                <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-1">
                  <span className="font-medium">Documentos: </span>{h.docs}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function CgcMapaPage() {
  const [busca, setBusca] = useState("")
  const [letraAtiva, setLetraAtiva] = useState<string | null>(null)

  const resultados = useMemo(() => {
    const q = normalize(busca.trim())
    return PRODUTOS.filter((p) => {
      if (letraAtiva && !p.nome.startsWith(letraAtiva)) return false
      if (!q) return true
      return (
        normalize(p.nome).includes(q) ||
        p.habilitacoes.some(
          (h) =>
            normalize(h.habilitacao).includes(q) ||
            normalize(h.ncm).includes(q) ||
            normalize(h.nivel).includes(q) ||
            normalize(h.legislacao).includes(q)
        )
      )
    })
  }, [busca, letraAtiva])

  const letrasComProdutos = useMemo(
    () => new Set(PRODUTOS.map((p) => p.nome[0])),
    []
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link
            href="/legislacao"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Legislação
          </Link>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground text-balance">
                Registro no CGC/MAPA — Produtos Passíveis de Registro
              </h1>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Listagem oficial de produtos de origem vegetal com habilitações ativas no{" "}
                <strong>Sistema SIPEAGRO</strong> do Cadastro Geral de Classificação do MAPA.
                Base: IN SDA/MAPA nº 9/2019 (alt. Portaria SDA nº 487/2021).
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xl font-bold text-foreground">{PRODUTOS.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Produtos cadastrados</p>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xl font-bold text-foreground">
                {PRODUTOS.reduce((acc, p) => acc + p.habilitacoes.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Habilitações disponíveis</p>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xl font-bold text-foreground">{letrasComProdutos.size}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Letras com produtos</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 space-y-1">
            <p className="font-semibold">Orientações para registro:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Identifique a <strong>Habilitação Ativa</strong> conforme o perfil do estabelecimento (Embalador, Beneficiador, Exportador etc.).</li>
              <li>Produtos não listados: solicite inclusão pelo e-mail <strong>central-cgc@agro.gov.br</strong></li>
              <li>
                <a
                  href="https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/registro-importacao-e-exportacao-1/registro/registro-de-estabelecimentos/registro-estabelecimento-produtos-vegetais-no-cgc-mapa-1/listagem-de-produtos-passiveis-de-registro-no-cgc-mapa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline font-medium"
                >
                  Acessar lista oficial no site do MAPA
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto, NCM, habilitação, legislação..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 pr-9"
          />
          {busca && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={letraAtiva === null ? "default" : "outline"}
            className="h-7 px-2 text-xs"
            onClick={() => setLetraAtiva(null)}
          >
            Todos
          </Button>
          {LETRAS.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={letraAtiva === l ? "default" : "outline"}
              className={`h-7 w-7 p-0 text-xs ${!letrasComProdutos.has(l) ? "opacity-25 cursor-default" : ""}`}
              onClick={() => letrasComProdutos.has(l) ? setLetraAtiva(letraAtiva === l ? null : l) : undefined}
              disabled={!letrasComProdutos.has(l)}
            >
              {l}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {resultados.length === PRODUTOS.length
            ? `${PRODUTOS.length} produtos — ${PRODUTOS.reduce((a, p) => a + p.habilitacoes.length, 0)} habilitações`
            : `${resultados.length} produto${resultados.length !== 1 ? "s" : ""} encontrado${resultados.length !== 1 ? "s" : ""} de ${PRODUTOS.length}`}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12 space-y-2">
        {resultados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum produto encontrado para &quot;{busca}&quot;</p>
            <button
              className="mt-2 text-xs underline"
              onClick={() => { setBusca(""); setLetraAtiva(null); }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          resultados.map((p) => <ProdutoCard key={p.nome} produto={p} />)
        )}
      </div>
    </main>
  )
}
