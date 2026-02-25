# Loterias Analyzer - Documentação

Sistema completo para análise de loterias brasileiras da Caixa Econômica Federal.

## Componentes

| Componente | Descrição | Documentação |
|------------|-----------|--------------|
| **Backend** | API REST com estatísticas e geração de jogos | [BACKEND.md](./BACKEND.md) |
| **Frontend** | Dashboard web com visualizações | [FRONTEND.md](./FRONTEND.md) |
| **Plugin** | Extensão Chrome para preenchimento automático | [PLUGIN.md](./PLUGIN.md) |

## Arquitetura

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ Frontend │────│ Backend │────│ PostgreSQL │
│ (Next.js) │ │ (Spring Boot) │ │ │
│ :3000 │ │ :8081 │ │ :5432 │
│ │ │ │ │ │
└─────────────────┘ └────────┬────────┘ └─────────────────┘
 │
 │
┌─────────────────┐ │ ┌─────────────────┐
│ │ │ │ │
│ Plugin Chrome │──────────────┘ │ API Caixa │
│ (Aposta Rápido)│ │ (Fonte dados) │
│ │ │ │
└─────────────────┘ └─────────────────┘
```

## Quick Start

### 1. Backend

```bash
cd backend
mvn spring-boot:run
# Acesse: http://localhost:8081/docs
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:3000
```

### 3. Plugin Chrome

1. Abra `chrome://extensions/`
2. Ative "Modo do desenvolvedor"
3. "Carregar sem compactação" → selecione `aposta-rapido/`

## Loterias Suportadas

- Mega-Sena
- Lotofácil
- Quina
- Lotomania
- Timemania
- Dupla Sena
- Dia de Sorte
- Super Sete
- +Milionária

## Funcionalidades

### Backend (API)
- Consulta de resultados
- Estatísticas de frequência
- Análise de correlação
- Geração de jogos inteligentes
- Verificação de apostas
- Simulação histórica
- Importação de Excel
- Exportação CSV
- Documentação Swagger

### Frontend (Dashboard)
- Visualização de resultados
- Gráficos de frequência
- Ranking de números
- Gerador de jogos
- Verificador de apostas
- Tema claro/escuro

### Plugin (Aposta Rápido)
- Preenchimento automático
- Integração com API
- Jogos do Dia (múltiplas loterias)
- Suporte a extras (trevos, times, meses)
- Persistência de configurações

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Backend | Java | 25 |
| Backend | Spring Boot | 4.0.1 |
| Backend | PostgreSQL | 15+ |
| Frontend | Next.js | 16.1.6 |
| Frontend | React | 19.2.3 |
| Frontend | Tailwind CSS | 4.x |
| Plugin | Chrome Extension MV3 | - |

## Observabilidade

- **Métricas:** Prometheus (`/actuator/prometheus`)
- **Logs:** Grafana Loki
- **Dashboards:** Grafana

## Deploy

### Systemd (Produção)

```bash
# Backend
sudo systemctl start loterias-backend

# Frontend
sudo systemctl start loterias-frontend
```

### Docker

```bash
cd backend
docker-compose up -d
```

## Estrutura do Repositório

```
loterias/
├── backend/ # API Spring Boot
├── frontend/ # Dashboard Next.js
├── aposta-rapido/ # Extensão Chrome
├── docs/ # Documentação
│ ├── README.md # Este arquivo
│ ├── BACKEND.md # Doc do backend
│ ├── FRONTEND.md # Doc do frontend
│ └── PLUGIN.md # Doc do plugin
├── grafana/ # Dashboards Grafana
├── nginx/ # Configuração Nginx
└── README.md # Readme principal
```
