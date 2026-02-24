# Loterias Analyzer

Sistema de analise estatistica de loterias brasileiras com backend Spring Boot, frontend Next.js e extensao Chrome para preenchimento automatico de apostas.

Este repositorio e o agregador principal que contem infraestrutura, configuracoes de deploy e referencia os sub-projetos via git submodules.

## Repositorios

| Repositorio | Descricao |
|-------------|-----------|
| [loterias-backend](https://github.com/vunter/loterias-backend) | API REST Spring Boot |
| [loterias-frontend](https://github.com/vunter/loterias-frontend) | Dashboard Next.js |
| [loterias-aposta-rapido](https://github.com/vunter/loterias-aposta-rapido) | Extensao Chrome |

### Clonando com submodules

```bash
git clone --recurse-submodules https://github.com/vunter/loterias.git

# Ou, se ja clonou sem submodules:
git submodule update --init --recursive
```

## Arquitetura

```
                           Rede Local

  Browser (:3000)          Servidor 192.168.1.110
       |
       v
    Nginx (:80)  --->  Next.js (:3000)  --->  Spring Boot (:8081)
    Reverse Proxy       Frontend + Proxy        API REST + Scheduler
                                                     |
                                                     v
                                                PostgreSQL (:5432)

  Servidor 192.168.1.193
    Prometheus (:9090)   Loki (:3100)   Grafana (:3000)
    Scrape metrics       Logs           Dashboards
```

## Componentes

| Componente | Tecnologia | Porta | Descricao |
|------------|------------|-------|-----------|
| Frontend | Next.js 16 | 3000 | Interface web + API proxy |
| Backend | Spring Boot 4.0.2 | 8081 | API REST + Scheduler |
| Reverse Proxy | Nginx | 80 | Rate limiting, seguranca |
| Metricas | Prometheus | 9090 | Coleta de metricas |
| Logs | Loki | 3100 | Agregacao de logs |
| Dashboards | Grafana | 3000 | Visualizacao |

## Instalacao

```bash
git clone --recurse-submodules https://github.com/vunter/loterias.git
cd loterias

# Backend
cd backend
./mvnw clean package -DskipTests

# Frontend
cd ../frontend
npm install
npm run build

# Instalar services
cd ..
sudo ./install-services.sh
```

## Estrutura do Projeto

```
loterias/
├── backend/                       # [submodule] Spring Boot API
├── frontend/                      # [submodule] Next.js Frontend
├── aposta-rapido/                 # [submodule] Extensao Chrome
├── docs/                          # Documentacao
│   ├── README.md                  # Indice
│   ├── ARCHITECTURE.md            # Arquitetura
│   ├── BACKEND.md                 # Backend
│   ├── FRONTEND.md                # Frontend
│   ├── PLUGIN.md                  # Extensao Chrome
│   ├── API.md                     # Referencia da API
│   ├── DEPLOY.md                  # Deploy e operacoes
│   ├── DEVELOPMENT.md             # Ambiente de desenvolvimento
│   └── FEATURES.md                # Funcionalidades
├── grafana/                       # Configuracoes Grafana
│   └── provisioning/              # Dashboards e datasources
├── nginx/                         # Configuracao Nginx
├── docker-compose.yml             # Stack Docker
├── loterias-backend.service       # Systemd (producao)
├── loterias-frontend.service      # Systemd (producao)
├── loterias-backend-dev.service   # Systemd (dev)
├── loterias-frontend-dev.service  # Systemd (dev)
├── loterias-env.conf              # Variaveis de ambiente
├── loterias-logrotate.conf        # Logrotate
├── install-services.sh            # Instalacao producao
└── install-dev-services.sh        # Instalacao desenvolvimento
```

## Endpoints Principais

### API REST (Backend)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/dashboard/{tipo}` | Dashboard com estatisticas |
| GET | `/api/dashboard/{tipo}/numeros/ranking` | Ranking de numeros |
| GET | `/api/estatisticas/{tipo}/gerar-jogos-estrategico` | Gerar jogos |
| POST | `/api/apostas/{tipo}/verificar` | Verificar aposta |
| POST | `/api/concursos/{tipo}/sync` | Sincronizar concursos |
| POST | `/api/concursos/sync-all` | Sincronizar todas |

### Tipos de Loteria

`mega-sena`, `lotofacil`, `quina`, `lotomania`, `timemania`, `dupla-sena`, `dia-de-sorte`, `super-sete`, `mais-milionaria`

## Monitoramento

### Prometheus

- `http_server_requests_seconds` - Tempo de resposta HTTP
- `jvm_memory_used_bytes` - Uso de memoria JVM
- `hikaricp_connections_active` - Conexoes ativas do pool
- `process_uptime_seconds` - Uptime do processo

### Loki Labels

- `application=loterias-analyzer`
- `level=INFO|WARN|ERROR`
- `host=<hostname>`

### Grafana Dashboards

1. **Loterias - Overview** - Visao geral do sistema
2. **Loterias - Backend** - Metricas detalhadas Spring Boot
3. **Loterias - Logs** - Visualizacao de logs

## Sincronizacao Automatica

O backend sincroniza automaticamente as 22:00 todos os dias:

```yaml
# application.yml
loterias:
  sync:
    enabled: true
    cron: "0 0 22 * * *"
```

## Seguranca

- Backend escuta em porta interna (8081), nao exposto diretamente
- Frontend faz proxy de `/api/*` para o backend
- Nginx bloqueia scanners e paths maliciosos
- Rate limiting: 10 req/s API, 1 req/min sync
- Endpoints `/actuator/*` restritos a rede local

## Documentacao

- [Indice](docs/README.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Backend](docs/BACKEND.md)
- [Frontend](docs/FRONTEND.md)
- [Plugin Chrome](docs/PLUGIN.md)
- [API Reference](docs/API.md)
- [Deploy](docs/DEPLOY.md)
- [Desenvolvimento](docs/DEVELOPMENT.md)

## Licenca

MIT
