# Arquitetura do Sistema

## Visão Geral

O Loterias Analyzer é um sistema de análise estatística de loterias brasileiras composto por:

- **Backend**: Spring Boot 4.0.1 / Java 25
- **Frontend**: Next.js 16 / React 19 / TypeScript
- **Banco de Dados**: H2 (dev) / PostgreSQL (prod)
- **Monitoramento**: Prometheus + Loki + Grafana

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Rede Local                                      │
│                                                                              │
│   ┌─────────────┐       ┌─────────────────────────────────────────────────┐ │
│   │   Browser   │       │            Servidor Aplicação                   │ │
│   │             │       │                                                 │ │
│   └──────┬──────┘       │  ┌─────────────┐      ┌──────────────────────┐  │ │
│          │              │  │   Nginx     │      │   Next.js (3000)     │  │ │
│          │ :80/:3000    │  │   (:80)     │◄─────│   - Frontend UI      │  │ │
│          └──────────────┼─►│   Reverse   │      │   - API Proxy        │  │ │
│                         │  │   Proxy     │      │     /api/* ──────┐   │  │ │
│                         │  └─────────────┘      └──────────────────┼───┘  │ │
│                         │                                          │      │ │
│                         │  ┌───────────────────────────────────────▼───┐  │ │
│                         │  │         Spring Boot (8080)                │  │ │
│                         │  │         - REST API                        │  │ │
│                         │  │         - Scheduler (sync 22h)            │  │ │
│                         │  │         - H2/PostgreSQL                   │  │ │
│                         │  │         - Actuator metrics                │  │ │
│                         │  └───────────────────────────────────────────┘  │ │
│                         └─────────────────────────────────────────────────┘ │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Servidor Monitoramento                            │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│   │  │  Prometheus  │  │     Loki     │  │   Grafana    │               │   │
│   │  │   (:9090)    │◄─┼──────────────┼──┤   (:3000)    │               │   │
│   │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### 1. Sincronização com API da Caixa

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Scheduler  │────►│  SyncService │────►│ CaixaClient  │────►│  API Caixa   │
│  (cron 22h)  │     │              │     │  WebClient   │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Repository  │
                    │   (JPA)      │
                    └──────────────┘
```

### 2. Requisição do Usuário

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Browser │───►│  Next.js │───►│  Spring  │───►│  Service │───►│   DB     │
│          │    │  Proxy   │    │ Controller│   │  Layer   │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Camadas do Backend

```
┌─────────────────────────────────────────────────────────────┐
│                     Controller Layer                         │
│  ConcursoController, DashboardController, EstatisticaController │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                           │
│  ConcursoSyncService, GeradorJogosService, AnaliseService   │
├─────────────────────────────────────────────────────────────┤
│                     Repository Layer                         │
│  ConcursoRepository (Spring Data JPA)                        │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│  Concurso, TipoLoteria, FaixaPremiacao, GanhadorUF          │
└─────────────────────────────────────────────────────────────┘
```

## Componentes do Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                         Page                                 │
│                      (app/page.tsx)                          │
├─────────────────────────────────────────────────────────────┤
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │  Dashboard  │  │ GameGenerator│  │ BetChecker │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │NumberRanking│  │Tendencias   │  │ Financeiro │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Shared Components                         │
│   NumberBall, LotterySelector, ThemeToggle                  │
├─────────────────────────────────────────────────────────────┤
│                      Contexts                                │
│   ThemeContext (dark/light mode)                             │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                               │
│   lib/api.ts (fetch wrapper, types)                          │
└─────────────────────────────────────────────────────────────┘
```

## Modelo de Dados

### Entidade Principal: Concurso

```
Concurso
├── id (Long)
├── tipoLoteria (TipoLoteria)
├── numero (Integer)
├── data (LocalDate)
├── dezenas (List<Integer>)
├── dezenasOrdemSorteio (List<Integer>)
├── acumulou (Boolean)
├── valorAcumulado (BigDecimal)
├── faixas (List<FaixaPremiacao>)
├── ganhadores (List<GanhadorUF>)
├── timeCoracao / mesSorte (String)
└── campos financeiros (arrecadado, estimado, etc.)
```

### Enum: TipoLoteria

```
MEGA_SENA, LOTOFACIL, QUINA, LOTOMANIA, TIMEMANIA, 
DUPLA_SENA, DIA_DE_SORTE, SUPER_SETE, MAIS_MILIONARIA
```

## Segurança

1. **Backend não exposto**: Escuta apenas em 127.0.0.1:8080
2. **API Proxy**: Next.js faz proxy de /api/* para o backend
3. **Rate Limiting**: 
   - Nginx: 10 req/s para API geral
   - Backend: 1 req/2min para sincronização com Caixa
4. **Actuator**: Endpoints de métricas restritos à rede local
5. **Scanner Blocking**: Nginx bloqueia paths maliciosos

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Backend | Java | 25 |
| Backend | Spring Boot | 4.0.1 |
| Backend | Spring WebFlux | - |
| Backend | Spring Data JPA | - |
| Backend | H2 / PostgreSQL | - |
| Frontend | Next.js | 16.1.6 |
| Frontend | React | 19.2.3 |
| Frontend | TypeScript | 5.x |
| Frontend | Tailwind CSS | 4.x |
| Frontend | Recharts | 3.7.0 |
| Infra | Nginx | - |
| Infra | Prometheus | - |
| Infra | Loki | - |
| Infra | Grafana | - |
