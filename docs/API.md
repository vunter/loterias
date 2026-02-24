# API Reference

## Base URL

- **Desenvolvimento**: `http://localhost:8081/api`
- **Produção**: `http://localhost:3000/api` (via Next.js proxy)

## Tipos de Loteria

Todos os endpoints que aceitam `{tipo}` usam um dos seguintes valores:

| Valor | Nome |
|-------|------|
| `mega_sena` | Mega-Sena |
| `lotofacil` | Lotofácil |
| `quina` | Quina |
| `lotomania` | Lotomania |
| `timemania` | Timemania |
| `dupla_sena` | Dupla Sena |
| `dia_de_sorte` | Dia de Sorte |
| `super_sete` | Super Sete |
| `mais_milionaria` | +Milionária |

---

## Dashboard

### GET /dashboard/{tipo}

Retorna estatísticas completas de uma loteria.

**Response:**
```json
{
 "tipo": "MEGA_SENA",
 "nomeLoteria": "Mega-Sena",
 "resumo": {
 "totalConcursos": 2800,
 "primeiroSorteio": "1996-03-11",
 "ultimoSorteio": "2024-01-20",
 "diasSemSorteio": 2,
 "maiorPremio": 500000000.00,
 "concursoMaiorPremio": 2150
 },
 "ultimoConcurso": {
 "numero": 2800,
 "data": "2024-01-20",
 "dezenas": [5, 12, 23, 34, 45, 56],
 "acumulou": false,
 "valorAcumulado": 0,
 "ganhadoresFaixaPrincipal": 2,
 "premioFaixaPrincipal": 50000000.00,
 "ganhadores": [
 {"uf": "SP", "cidade": "São Paulo", "quantidade": 1, "canal": "Lotérica"}
 ]
 },
 "numerosQuentes": [5, 10, 23, 33, 42, 53],
 "numerosFrios": [1, 7, 15, 28, 44, 60],
 "numerosAtrasados": [3, 9, 17, 31, 48, 59],
 "padroes": {
 "mediaPares": 3.2,
 "mediaImpares": 2.8,
 "mediaBaixos": 3.1,
 "mediaAltos": 2.9
 },
 "proximoConcurso": {
 "numero": 2801,
 "dataEstimada": "2024-01-23",
 "premioEstimado": 3500000.00,
 "acumulado": false
 },
 "timeCoracaoInfo": null,
 "ultimoConcursoComGanhador": {...}
}
```

### GET /dashboard/{tipo}/numeros/ranking

Retorna ranking completo de todos os números com análises.

**Response:**
```json
[
 {
 "numero": 10,
 "loteria": "MEGA_SENA",
 "estatisticas": {
 "frequencia": 312,
 "percentualAparicoes": 11.14,
 "atrasoAtual": 5,
 "maiorAtraso": 25,
 "mediaAtraso": 8.5
 },
 "ultimasCincoAparicoes": [2795, 2790, 2785, 2780, 2775],
 "numerosCompanheiros": [23, 33, 42, 53, 5],
 "tendencia": {
 "status": "QUENTE",
 "recomendacao": "Número em alta, considerar incluir",
 "scoreTendencia": 85
 }
 }
]
```

### GET /dashboard/{tipo}/conferir?numeros={n1,n2,...}

Confere uma aposta no histórico de concursos.

**Parâmetros:**
- `numeros`: Lista de números separados por vírgula

**Response:**
```json
{
 "tipoLoteria": "MEGA_SENA",
 "numerosApostados": [5, 12, 23, 34, 45, 56],
 "resumo": {
 "totalConcursosAnalisados": 2800,
 "vezesPremiado": 15,
 "percentualPremiado": 0.54,
 "maiorAcertos": 5,
 "concursoMaiorAcertos": 2100
 },
 "concursosPremiados": [
 {
 "numeroConcurso": 2100,
 "data": "2018-05-10",
 "dezenasSorteadas": [5, 12, 23, 34, 45, 60],
 "acertos": [5, 12, 23, 34, 45],
 "quantidadeAcertos": 5,
 "faixa": "Quina",
 "valorPremio": 50000.00
 }
 ]
}
```

### GET /dashboard/especiais

Retorna informações sobre concursos especiais (Mega da Virada, etc).

---

## Estatísticas e Geração

### GET /estatisticas/estrategias

Lista estratégias disponíveis para geração de jogos.

**Response:**
```json
[
 {"codigo": "ALEATORIO", "nome": "Aleatório", "descricao": "Números gerados aleatoriamente"},
 {"codigo": "QUENTES", "nome": "Números Quentes", "descricao": "Prioriza números mais sorteados"},
 {"codigo": "FRIOS", "nome": "Números Frios", "descricao": "Prioriza números menos sorteados"},
 {"codigo": "ATRASADOS", "nome": "Números Atrasados", "descricao": "Prioriza números há mais tempo sem sair"},
 {"codigo": "BALANCEADO", "nome": "Balanceado", "descricao": "Mix equilibrado de quentes e frios"},
 {"codigo": "ESTATISTICO", "nome": "Estatístico", "descricao": "Baseado em padrões históricos"}
]
```

### GET /estatisticas/{tipo}/gerar-jogos-estrategico

Gera jogos usando estratégia predefinida.

**Parâmetros:**
- `estrategia`: Código da estratégia (ex: QUENTES)
- `quantidade`: Número de jogos (1-10)
- `debug`: true/false - incluir informações de debug

**Response:**
```json
{
 "tipoLoteria": "MEGA_SENA",
 "jogos": [[5, 12, 23, 34, 45, 56]],
 "estrategia": "QUENTES",
 "geradoEm": "2024-01-20T15:30:00",
 "timeSugerido": null,
 "mesSugerido": null,
 "debug": {
 "etapas": ["Carregando estatísticas", "Aplicando pesos"],
 "numerosQuentes": [5, 10, 23],
 "numerosFrios": [1, 7, 15],
 "pesosFinais": {"5": 1.5, "10": 1.4}
 }
}
```

### GET /estatisticas/{tipo}/gerar-jogos

Gera jogos com parâmetros personalizados.

**Parâmetros:**
- `quantidadeNumeros`: Quantidade de números por jogo
- `quantidadeJogos`: Quantidade de jogos
- `usarNumerosQuentes`: true/false
- `usarNumerosFrios`: true/false
- `usarNumerosAtrasados`: true/false
- `balancearParesImpares`: true/false
- `evitarSequenciais`: true/false
- `numerosObrigatorios`: Lista de números que devem estar no jogo
- `numerosExcluidos`: Lista de números a evitar
- `sugerirTime`: Time específico (Timemania)
- `sugerirMes`: Mês específico (Dia de Sorte)
- `debug`: true/false

---

## Análises Avançadas

### GET /analise/{tipo}/ordem-sorteio

Análise da ordem em que os números são sorteados.

**Response:**
```json
{
 "tipoLoteria": "MEGA_SENA",
 "nomeLoteria": "Mega-Sena",
 "totalConcursosAnalisados": 500,
 "primeiraBola": [
 {"numero": 10, "frequencia": 45, "percentual": 9.0}
 ],
 "ultimaBola": [
 {"numero": 53, "frequencia": 42, "percentual": 8.4}
 ],
 "mediaOrdem": [
 {"numero": 5, "percentual": 2.3}
 ]
}
```

### GET /analise/{tipo}/financeiro

Análise financeira (arrecadação, prêmios, ROI).

**Response:**
```json
{
 "tipoLoteria": "MEGA_SENA",
 "resumo": {
 "totalArrecadado": 50000000000.00,
 "totalPremiosPagos": 25000000000.00,
 "percentualRetornoPremios": 50.0,
 "saldoReservaAtual": 500000000.00
 },
 "evolucaoMensal": [
 {"ano": 2024, "mes": 1, "mesAno": "01/2024", "totalArrecadado": 500000000.00}
 ]
}
```

### GET /analise/{tipo}/tendencias

Análise de tendências (números quentes, frios, emergentes).

**Response:**
```json
{
 "tipo": "MEGA_SENA",
 "totalConcursosAnalisados": 100,
 "tendenciasQuentes": [
 {"numero": 10, "frequenciaTotal": 15, "frequenciaRecente": 5, "taxaCrescimento": 25.0}
 ],
 "tendenciasFrias": [...],
 "tendenciasEmergentes": [...],
 "mediasHistoricas": {
 "somaMedia": 180.5,
 "paresMedia": 3.2
 },
 "padroesVencedores": [
 {"padrao": "3P3I", "descricao": "3 pares e 3 ímpares", "percentual": 35.2}
 ]
}
```

### GET /analise/dupla-sena

Análise comparativa entre 1º e 2º sorteio da Dupla Sena.

### GET /analise/{tipo}/time-coracao

Ranking de times (Timemania) ou meses (Dia de Sorte).

---

## Sincronização

### GET /concursos/sync-status

Status do rate limit de sincronização.

**Response:**
```json
{
 "allowed": true,
 "remainingSeconds": 0,
 "cooldownSeconds": 120,
 "lastSync": "2024-01-20T15:00:00Z"
}
```

### POST /concursos/{tipo}/sync-ultimo

Sincroniza último concurso de uma loteria.

**Rate Limit:** 1 requisição a cada 2 minutos

**Response (sucesso):**
```json
{
 "tipo": "Mega-Sena",
 "sincronizados": 1,
 "sucesso": true,
 "mensagem": "1 concursos sincronizados",
 "rateLimited": false,
 "cooldownSeconds": 120
}
```

**Response (rate limited):**
```json
{
 "tipo": "mega_sena",
 "sincronizados": 0,
 "sucesso": false,
 "mensagem": "Rate limit atingido. Aguarde 85 segundos.",
 "rateLimited": true,
 "remainingSeconds": 85,
 "cooldownSeconds": 120
}
```

### POST /concursos/sync-ultimos

Sincroniza último concurso de todas as loterias.

### POST /concursos/{tipo}/sync

Sincroniza todos os novos concursos de uma loteria.

### POST /concursos/{tipo}/sync-full

Sincronização completa (todos os concursos históricos).

---

## Concursos

### GET /concursos/{tipo}?page=0&size=20

Lista concursos paginados.

### GET /concursos/{tipo}/{numero}

Busca concurso específico por número.

### GET /concursos/{tipo}/ultimo

Busca último concurso.

---

## Erros

Todos os endpoints retornam erros no formato:

```json
{
 "timestamp": "2024-01-20T15:30:00",
 "status": 400,
 "error": "Bad Request",
 "message": "Tipo de loteria 'invalid' inválido",
 "path": "/api/dashboard/invalid"
}
```

### Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Parâmetros inválidos |
| 404 | Recurso não encontrado |
| 429 | Rate limit excedido |
| 500 | Erro interno |
