# Loterias Load Tests

Load testing suite for the Loterias Analyzer application using [k6](https://k6.io/).

## Prerequisites

```bash
# Install k6
sudo apt-get install k6
# or: snap install k6
```

## Test Suites

| Suite | File | Endpoints Covered |
|-------|------|-------------------|
| **dashboard** | `dashboard.test.js` | Dashboard, ranking, conferir, acumulado, especiais, ganhadores por UF |
| **estatisticas** | `estatisticas.test.js` | Frequência, mais/menos frequentes, atrasados, pares/impares, soma, sequenciais, faixas, correlação, gerar jogos |
| **analise** | `analise.test.js` | Tendências, ordem sorteio, financeiro, dupla sena, histórico mensal, time do coração |
| **concursos** | `concursos.test.js` | List (paginated), último, by number, sync status, backfill status |
| **misc-endpoints** | `misc-endpoints.test.js` | Home, estratégias, CSV export, verificar aposta, simular |
| **frontend** | `frontend.test.js` | Next.js page load, API proxy routes (all major endpoints through frontend) |
| **user-journey** | `user-journey.test.js` | Full user session simulation: landing → browse → check bet → generate → analyze → export |

## Load Profiles

| Profile | Description | VUs | Duration |
|---------|-------------|-----|----------|
| **smoke** | Verify endpoints work | 1 | 10s |
| **light** | Baseline measurement | 5 | ~50s |
| **standard** | Typical usage | 10→20 | ~2.5min |
| **stress** | Find breaking points | 10→100 | ~2.5min |
| **spike** | Sudden traffic burst | 5→80→5 | ~1min |

## Usage

```bash
cd load-tests

# Run all suites with light profile (default)
./run.sh

# Run a specific suite
./run.sh dashboard smoke
./run.sh frontend standard
./run.sh user-journey stress

# Run all suites with stress profile
./run.sh all stress

# Point to different servers
BACKEND_URL=http://192.168.1.100:8082 FRONTEND_URL=http://192.168.1.100:3000 ./run.sh all standard
```

## Run Individual Tests with k6

```bash
# Quick single test
k6 run --env PROFILE=smoke dashboard.test.js

# Override URLs
k6 run --env PROFILE=standard --env BACKEND_URL=http://prod:8082 dashboard.test.js

# Export results
k6 run --env PROFILE=standard --summary-export=results.json dashboard.test.js
```

## Results

Results are saved to `results/` with timestamped filenames:
- `{timestamp}_{suite}_{profile}.json` — Summary metrics (JSON)
- `{timestamp}_{suite}_{profile}_raw.json` — Raw data points
- `{timestamp}_{suite}_{profile}.log` — Console output

## Key Metrics

| Metric | Description | Threshold |
|--------|-------------|-----------|
| `http_req_duration` | Request duration | p95 < 2s, p99 < 5s |
| `http_req_failed` | Failure rate | < 5% |
| `dashboard_duration` | Dashboard endpoint | p95 < 3s |
| `tendencias_duration` | Tendências endpoint | p95 < 8s |
| `gerar_jogos_duration` | Game generation | p95 < 5s |
| `export_csv_duration` | CSV export | p95 < 10s |
| `page_load_duration` | Frontend page load | p95 < 5s |
| `full_journey_duration` | Complete user journey | p95 < 60s |

## Architecture

```
load-tests/
├── config.js              # Shared config, profiles, thresholds, helpers
├── dashboard.test.js      # Dashboard API endpoints
├── estatisticas.test.js   # Statistics/frequency endpoints
├── analise.test.js        # Analysis endpoints (tendências, financeiro, etc.)
├── concursos.test.js      # Contest listing and sync endpoints
├── misc-endpoints.test.js # Export, apostas, home, estratégias
├── frontend.test.js       # Frontend page + API proxy layer
├── user-journey.test.js   # Full user session simulation
├── run.sh                 # Test runner script
├── results/               # Output directory (gitignored)
└── README.md              # This file
```

All tests randomly select lottery types across the 9 supported lotteries to ensure even coverage:
`mega_sena`, `lotofacil`, `quina`, `lotomania`, `timemania`, `dupla_sena`, `dia_de_sorte`, `super_sete`, `mais_milionaria`
