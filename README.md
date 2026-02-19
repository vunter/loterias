# Loterias Analyzer

Sistema de análise estatística de loterias brasileiras com backend Spring Boot e frontend Next.js.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Rede Local                                      │
│                                                                              │
│   ┌─────────────┐       ┌─────────────────────────────────────────────────┐ │
│   │   Browser   │       │            Servidor 192.168.1.110               │ │
│   │  (Notebook) │       │                                                 │ │
│   └──────┬──────┘       │  ┌─────────────┐      ┌──────────────────────┐  │ │
│          │              │  │   Nginx     │      │   Next.js (3000)     │  │ │
│          │ :3000        │  │   (:80)     │      │   - Frontend UI      │  │ │
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
│   │                    Servidor 192.168.1.193                            │   │
│   │                                                                      │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│   │  │  Prometheus  │  │     Loki     │  │   Grafana    │               │   │
│   │  │   (:9090)    │  │   (:3100)    │  │   (:3000)    │               │   │
│   │  │              │  │              │  │              │               │   │
│   │  │ Scrape ◄─────┼──┼──────────────┼──┼──────────────┼── :8080       │   │
│   │  │ metrics      │  │ Receive logs │  │ Dashboards   │               │   │
│   │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Componentes

| Componente | Tecnologia | Porta | Descrição |
|------------|------------|-------|-----------|
| Frontend | Next.js 15 | 3000 | Interface web + API proxy |
| Backend | Spring Boot 4 | 8080 | API REST + Scheduler |
| Reverse Proxy | Nginx | 80 | Rate limiting, segurança |
| Métricas | Prometheus | 9090 | Coleta de métricas |
| Logs | Loki | 3100 | Agregação de logs |
| Dashboards | Grafana | 3000 | Visualização |

## Instalação Rápida

```bash
# Clonar e buildar
git clone <repo>
cd loterias

# Backend
cd backend
mvn clean package -DskipTests

# Frontend
cd ../frontend
pnpm install
pnpm build

# Instalar services
cd ..
sudo ./install-services.sh
```

## Documentação Detalhada

- [Documentação Geral](docs/README.md) - Visão geral e arquitetura
- [Backend](docs/BACKEND.md) - API Spring Boot, endpoints, configuração
- [Frontend](docs/FRONTEND.md) - Dashboard Next.js, componentes
- [Plugin Chrome](docs/PLUGIN.md) - Extensão Aposta Rápido
- [API Reference](backend/API.md) - Referência completa da API

## Estrutura do Projeto

```
loterias/
├── backend/                    # Spring Boot API
│   ├── src/main/java/         # Código fonte
│   ├── src/main/resources/    # Configurações
│   ├── API.md                 # Documentação da API
│   └── pom.xml                # Dependências Maven
├── frontend/                   # Next.js Frontend
│   ├── src/app/               # App Router pages
│   ├── src/components/        # React components
│   └── src/lib/               # Utilities, API client
├── aposta-rapido/              # Extensão Chrome
│   ├── src/                   # Código fonte
│   ├── icons/                 # Ícones
│   └── manifest.json          # Configuração
├── docs/                       # Documentação
│   ├── README.md              # Índice
│   ├── BACKEND.md             # Doc backend
│   ├── FRONTEND.md            # Doc frontend
│   └── PLUGIN.md              # Doc plugin
├── grafana/                    # Configurações Grafana
├── nginx/                      # Configuração Nginx
├── loterias-backend.service       # Systemd (produção)
├── loterias-frontend.service      # Systemd (produção)
├── loterias-backend-dev.service   # Systemd (dev)
├── loterias-frontend-dev.service  # Systemd (dev)
├── install-services.sh            # Instalação produção
└── install-dev-services.sh        # Instalação desenvolvimento
```

## Endpoints Principais

### API REST (Backend)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dashboard/{tipo}` | Dashboard com estatísticas |
| GET | `/api/dashboard/{tipo}/numeros/ranking` | Ranking de números |
| GET | `/api/estatisticas/{tipo}/gerar-jogos` | Gerar jogos |
| GET | `/api/dashboard/{tipo}/conferir` | Conferir aposta |
| POST | `/api/concursos/{tipo}/sync-ultimo` | Sincronizar último |
| POST | `/api/concursos/sync-ultimos` | Sincronizar todos |

### Tipos de Loteria

`mega_sena`, `lotofacil`, `quina`, `lotomania`, `timemania`, `dupla_sena`, `dia_de_sorte`, `super_sete`, `mais_milionaria`

## Monitoramento

### Prometheus Metrics

- `http_server_requests_seconds` - Tempo de resposta HTTP
- `jvm_memory_used_bytes` - Uso de memória JVM
- `hikaricp_connections_active` - Conexões ativas do pool
- `process_uptime_seconds` - Uptime do processo

### Loki Labels

- `application=loterias-analyzer`
- `level=INFO|WARN|ERROR`
- `host=<hostname>`

### Grafana Dashboards

1. **Loterias - Overview** - Visão geral do sistema
2. **Loterias - Backend** - Métricas detalhadas Spring Boot
3. **Loterias - Logs** - Visualização de logs

## Sincronização Automática

O backend sincroniza automaticamente às 22:00 todos os dias:

```yaml
# application.yml
loterias:
  sync:
    enabled: true
    cron: "0 0 22 * * *"
```

## Segurança

- Backend escuta apenas em `127.0.0.1:8080` (não exposto)
- Frontend faz proxy de `/api/*` para o backend
- Nginx bloqueia scanners e paths maliciosos
- Rate limiting: 10 req/s API, 1 req/min sync
- Endpoints `/actuator/*` apenas rede local

## Licença

MIT
