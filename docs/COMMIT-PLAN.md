# Loterias — Commit Plan

Multi-repo commit history for a realistic senior developer workflow. 
**Period:** Dec 23, 2025 → Feb 23, 2026 (2 months) 
**Timezone:** BRT (UTC-3), mainly 08:00–12:00 
**Repos:** 4 independent repositories with git submodules

---

## Timeline Overview

| Week | Dates | Focus |
|------|-------|-------|
| 1 | Dec 23–29 | Backend: project init, domain, entities, DB |
| 2 | Dec 30–Jan 5 | Backend: core services, sync, scheduler |
| 3 | Jan 6–12 | Backend: controllers, statistics + Frontend init |
| 4 | Jan 13–19 | Frontend: layout, components + Plugin init |
| 5 | Jan 20–26 | Backend: game gen, bets + Frontend: dashboard, generator |
| 6 | Jan 27–Feb 2 | Backend: advanced analysis + Frontend: analysis components |
| 7 | Feb 3–9 | Infrastructure: Docker, Nginx, Monitoring |
| 8 | Feb 10–16 | Quality: tests, security, error handling, SEO |
| 9 | Feb 17–23 | Documentation, polish, parent repo setup |

---

## Commit Format

```
[HH:MM BRT] repo → "commit message"
 Files: file1, file2, ...
```

---

## Week 1 — Backend Foundation (Dec 23–29)

### Dec 23 (Tue)

```
[08:15] backend → "feat: initialize Spring Boot project with WebFlux and JPA"
 Files: pom.xml, mvnw, .mvn/wrapper/*, src/main/java/.../LoteriasApplication.java,
 src/main/resources/application.yml, .gitignore

[09:30] backend → "feat: define TipoLoteria enum with lottery metadata"
 Files: domain/entity/TipoLoteria.java

[10:45] backend → "feat: create Concurso entity with JPA mappings"
 Files: domain/entity/Concurso.java

[11:20] backend → "feat: add FaixaPremiacao and GanhadorUF entities"
 Files: domain/entity/FaixaPremiacao.java, domain/entity/GanhadorUF.java
```

### Dec 24 (Wed) — Christmas Eve, light work

```
[08:30] backend → "feat: add TimeTimemania entity for team data"
 Files: domain/entity/TimeTimemania.java

[09:15] backend → "feat: create ConcursoRepository with custom queries"
 Files: domain/repository/ConcursoRepository.java

[09:45] backend → "feat: add TimeTimemaniaRepository"
 Files: domain/repository/TimeTimemaniaRepository.java
```

### Dec 25 (Thu) — Christmas 
*No commits*

### Dec 26 (Fri)

```
[08:20] backend → "feat: add Flyway migration for Timemania teams data"
 Files: src/main/resources/db/migration/V1__insert_times_timemania.sql

[09:10] backend → "feat: add Flyway migration for codigo_caixa column"
 Files: src/main/resources/db/migration/V2__add_codigo_caixa_column.sql

[09:50] backend → "feat: add version column migration"
 Files: src/main/resources/db/migration/V3__add_version_column.sql

[10:30] backend → "feat: add FK and query indexes migration"
 Files: src/main/resources/db/migration/V4__add_fk_and_query_indexes.sql

[11:15] backend → "feat: add database initializer for auto schema creation"
 Files: config/DatabaseInitializer.java, application-db.properties
```

### Dec 27 (Sat) — weekend, light work

```
[09:00] backend → "feat: add CaixaApiResponse DTO for external API mapping"
 Files: domain/dto/CaixaApiResponse.java

[09:40] backend → "feat: implement ConcursoMapper for entity-DTO conversion"
 Files: service/ConcursoMapper.java
```

### Dec 28 (Sun)
*No commits*

### Dec 29 (Mon)

```
[08:10] backend → "feat: add RestClientConfig for HTTP client setup"
 Files: config/RestClientConfig.java

[08:50] backend → "feat: implement CaixaApiClient for Caixa Loterias API"
 Files: service/CaixaApiClient.java

[09:45] backend → "feat: implement ApiSyncService for lottery data synchronization"
 Files: service/ApiSyncService.java

[10:30] backend → "feat: implement ConcursoSyncService orchestrating sync operations"
 Files: service/ConcursoSyncService.java

[11:20] backend → "feat: add ConcursoBatchService for bulk insert operations"
 Files: service/ConcursoBatchService.java
```

---

## Week 2 — Backend Core Services (Dec 30–Jan 5)

### Dec 30 (Tue)

```
[08:15] backend → "feat: add LoteriaProperties for externalized configuration"
 Files: config/LoteriaProperties.java

[08:55] backend → "feat: implement SyncScheduler with configurable cron"
 Files: scheduler/SyncScheduler.java

[09:40] backend → "feat: add SyncRateLimitService for API call throttling"
 Files: service/SyncRateLimitService.java

[10:20] backend → "feat: add EstatisticaDTO for statistics data transfer"
 Files: domain/dto/EstatisticaDTO.java

[11:05] backend → "feat: implement EstatisticaService with frequency analysis"
 Files: service/EstatisticaService.java
```

### Dec 31 (Wed) — New Year's Eve, light work

```
[08:30] backend → "feat: add DashboardResponse DTO with statistics summary"
 Files: domain/dto/DashboardResponse.java

[09:15] backend → "feat: implement DashboardService aggregating lottery data"
 Files: service/DashboardService.java
```

### Jan 1 (Thu) — New Year 
*No commits*

### Jan 2 (Fri)

```
[08:20] backend → "feat: add TipoLoteriaParser utility for URL path parsing"
 Files: controller/TipoLoteriaParser.java

[09:00] backend → "feat: implement HomeController with API info endpoint"
 Files: controller/HomeController.java

[09:45] backend → "feat: implement ConcursoController with sync and query endpoints"
 Files: controller/ConcursoController.java

[10:30] backend → "feat: implement DashboardController with statistics endpoints"
 Files: controller/DashboardController.java

[11:15] backend → "feat: implement EstatisticaController with frequency endpoints"
 Files: controller/EstatisticaController.java
```

### Jan 3 (Sat) — weekend, light work

```
[09:00] backend → "feat: add CorsConfig for cross-origin requests"
 Files: config/CorsConfig.java

[09:45] backend → "feat: add CacheConfig with Caffeine L1 caching"
 Files: config/CacheConfig.java
```

### Jan 4 (Sun)
*No commits*

### Jan 5 (Mon)

```
[08:15] backend → "feat: add GerarJogoRequest and GerarJogoResponse DTOs"
 Files: domain/dto/GerarJogoRequest.java, domain/dto/GerarJogoResponse.java,
 domain/dto/EstrategiaGeracao.java

[09:00] backend → "feat: implement GeradorValidation for game parameter validation"
 Files: service/GeradorValidation.java

[09:45] backend → "feat: implement GeradorJogosService with random generation"
 Files: service/GeradorJogosService.java

[10:30] backend → "feat: implement GeradorEstrategicoService with smart strategies"
 Files: service/GeradorEstrategicoService.java

[11:15] backend → "feat: add game generation endpoints to EstatisticaController"
 Files: controller/EstatisticaController.java (update)
```

---

## Week 3 — Backend Controllers + Frontend Init (Jan 6–12)

### Jan 6 (Tue)

```
[08:10] backend → "feat: add VerificarApostaRequest and response DTOs"
 Files: domain/dto/VerificarApostaRequest.java, domain/dto/VerificarApostaResponse.java,
 domain/dto/ResultadoVerificacao.java, domain/dto/ResumoVerificacao.java

[08:55] backend → "feat: implement VerificadorApostasService for bet checking"
 Files: service/VerificadorApostasService.java

[09:40] backend → "feat: add ConferirApostaResponse DTO"
 Files: domain/dto/ConferirApostaResponse.java

[10:20] backend → "feat: implement ConferirApostaService for latest draw check"
 Files: service/ConferirApostaService.java

[11:05] backend → "feat: implement ApostasController with verify and check endpoints"
 Files: controller/ApostasController.java
```

### Jan 7 (Wed)

```
[08:15] backend → "feat: add SimularApostasRequest/Response and PremiacaoSimulada DTOs"
 Files: domain/dto/SimularApostasRequest.java, domain/dto/SimularApostasResponse.java,
 domain/dto/PremiacaoSimulada.java

[09:00] backend → "feat: implement SimuladorApostasService with ROI calculation"
 Files: service/SimuladorApostasService.java

[09:45] backend → "feat: implement SimuladorController"
 Files: controller/SimuladorController.java

[10:30] backend → "feat: implement ExportService for CSV data export"
 Files: service/ExportService.java

[11:10] backend → "feat: implement ExportController with CSV download endpoints"
 Files: controller/ExportController.java
```

### Jan 8 (Thu)

```
[08:20] backend → "feat: implement ExcelImportService for Caixa data import"
 Files: service/ExcelImportService.java

[09:05] backend → "feat: implement ImportController with Excel upload endpoints"
 Files: controller/ImportController.java

[09:50] backend → "feat: add reference Excel files for lottery data"
 Files: src/main/resources/excels/*.xlsx, excels/example.txt

[10:35] backend → "feat: implement GlobalExceptionHandler with HTTP status mapping"
 Files: controller/GlobalExceptionHandler.java

[11:20] backend → "feat: add AccessLogConfig for request logging"
 Files: config/AccessLogConfig.java
```

### Jan 9 (Fri)

```
[08:15] frontend → "feat: initialize Next.js project with TypeScript and Tailwind"
 Files: package.json, tsconfig.json, next.config.ts, eslint.config.mjs,
 postcss.config.mjs, next-env.d.ts, .gitignore

[09:30] frontend → "feat: add global styles with light/dark theme CSS variables"
 Files: src/app/globals.css

[10:15] frontend → "feat: add lottery type definitions and configurations"
 Files: src/lib/loterias.ts

[11:00] frontend → "feat: implement API client with TypeScript interfaces"
 Files: src/lib/api.ts

[11:45] frontend → "feat: add number and currency formatters"
 Files: src/lib/formatters.ts
```

### Jan 10 (Sat) — weekend, light work

```
[09:00] frontend → "feat: implement ThemeContext with localStorage persistence"
 Files: src/contexts/ThemeContext.tsx

[09:45] frontend → "feat: create root layout with theme provider and metadata"
 Files: src/app/layout.tsx
```

### Jan 11 (Sun)
*No commits*

### Jan 12 (Mon)

```
[08:15] frontend → "feat: implement API proxy route for backend communication"
 Files: src/app/api/[...path]/route.ts

[08:55] frontend → "feat: add health check API endpoint"
 Files: src/app/api/health/route.ts

[09:40] frontend → "feat: create AppHeader with navigation and theme toggle"
 Files: src/components/AppHeader.tsx

[10:20] frontend → "feat: implement ThemeToggle component"
 Files: src/components/ThemeToggle.tsx

[11:00] frontend → "feat: create AppFooter component"
 Files: src/components/AppFooter.tsx

[11:40] frontend → "feat: implement LotterySelector dropdown component"
 Files: src/components/LotterySelector.tsx
```

---

## Week 4 — Frontend Components + Plugin Init (Jan 13–19)

### Jan 13 (Tue)

```
[08:10] frontend → "feat: create NumberBall component for lottery number display"
 Files: src/components/NumberBall.tsx

[08:50] frontend → "feat: implement Dashboard component with statistics panels"
 Files: src/components/Dashboard.tsx

[09:45] frontend → "feat: create main page with lottery selector and tabs"
 Files: src/app/page.tsx

[10:30] frontend → "feat: add loading state component"
 Files: src/app/loading.tsx

[11:15] frontend → "feat: add error page component"
 Files: src/app/error.tsx
```

### Jan 14 (Wed)

```
[08:15] frontend → "feat: implement ErrorBoundary component for React error handling"
 Files: src/components/ErrorBoundary.tsx

[09:00] frontend → "feat: implement GameGenerator with strategy selection"
 Files: src/components/GameGenerator.tsx

[09:50] frontend → "feat: add game export utilities"
 Files: src/lib/game-export.ts

[10:35] frontend → "feat: implement ExportTab for game copying and sharing"
 Files: src/components/ExportTab.tsx

[11:20] frontend → "feat: implement JogosHistorico for generated games history"
 Files: src/components/JogosHistorico.tsx
```

### Jan 15 (Thu)

```
[08:20] frontend → "feat: implement MultiGameGenerator for batch game creation"
 Files: src/components/MultiGameGenerator.tsx

[09:10] frontend → "feat: implement BetChecker component with visual number selection"
 Files: src/components/BetChecker.tsx

[10:00] frontend → "feat: add chart theme configuration for Nivo charts"
 Files: src/lib/chartTheme.ts

[11:00] frontend → "feat: implement NumberRanking with frequency analysis table"
 Files: src/components/NumberRanking.tsx
```

### Jan 16 (Fri)

```
[08:15] plugin → "feat: initialize Chrome extension with Manifest V3"
 Files: manifest.json, .gitignore

[08:55] plugin → "feat: add extension icons"
 Files: icons/icon16.png, icons/icon16.svg, icons/icon48.png, icons/icon128.png

[09:40] plugin → "feat: create popup HTML structure with lottery selector"
 Files: src/popup.html

[10:25] plugin → "feat: add popup styles with dark gradient theme"
 Files: src/popup.css

[11:10] plugin → "feat: implement content script for page interaction"
 Files: src/content.js, src/content.css
```

### Jan 17 (Sat) — weekend, light work

```
[09:00] plugin → "feat: implement background service worker for tab management"
 Files: src/background.js

[10:00] plugin → "feat: implement popup logic with lottery type selection and input parsing"
 Files: src/popup.js
```

### Jan 18 (Sun)
*No commits*

### Jan 19 (Mon)

```
[08:10] plugin → "feat: add API integration for game generation from backend"
 Files: src/popup.js (update — add generateFromAPI, strategy selection)

[09:00] plugin → "feat: add special lottery handling (Timemania team, Dia de Sorte month)"
 Files: src/background.js (update — add fillTimemania, fillDiaDeSorte)

[10:00] plugin → "feat: add Mais Milionaria trevo selection support"
 Files: src/background.js (update — add fillMaisMilionaria)

[10:50] plugin → "feat: add Super Sete column-based filling"
 Files: src/background.js (update — add fillSuperSete)

[11:30] backend → "feat: add RateLimitConfig for API request throttling"
 Files: config/RateLimitConfig.java
```

---

## Week 5 — Backend Advanced + Frontend Features (Jan 20–26)

### Jan 20 (Tue)

```
[08:15] backend → "feat: add LocalNetworkRestrictionConfig for admin endpoint security"
 Files: config/LocalNetworkRestrictionConfig.java

[09:00] backend → "feat: add OpenApiConfig for Swagger documentation"
 Files: config/OpenApiConfig.java

[09:45] backend → "feat: add GanhadorDTO and GanhadoresUFResponse DTOs"
 Files: domain/dto/GanhadorDTO.java, domain/dto/GanhadoresUFResponse.java

[10:30] backend → "feat: implement AtualizarGanhadoresService for winner data updates"
 Files: service/AtualizarGanhadoresService.java

[11:15] backend → "feat: implement AdminController with data management endpoints"
 Files: controller/AdminController.java
```

### Jan 21 (Wed)

```
[08:10] backend → "feat: add AcumuladoResponse DTO for jackpot tracking"
 Files: domain/dto/AcumuladoResponse.java

[08:50] backend → "feat: implement ConcursosEspeciaisService for special draw tracking"
 Files: service/ConcursosEspeciaisService.java, domain/dto/ConcursosEspeciaisResponse.java

[09:40] backend → "feat: add RateioPremioDTO for prize distribution data"
 Files: domain/dto/RateioPremioDTO.java

[10:25] backend → "feat: add TimeTimemaniaDTO for team statistics"
 Files: domain/dto/TimeTimemaniaDTO.java

[11:10] backend → "feat: add TimeCoracaoMesSorteResponse DTO"
 Files: domain/dto/TimeCoracaoMesSorteResponse.java
```

### Jan 22 (Thu)

```
[08:15] backend → "feat: implement TimeCoracaoMesSorteService for team/month analysis"
 Files: service/TimeCoracaoMesSorteService.java

[09:00] backend → "feat: implement TimeCoracaoController with ranking endpoints"
 Files: controller/TimeCoracaoController.java

[09:45] backend → "feat: add TextCleaningUtils for data normalization"
 Files: service/util/TextCleaningUtils.java

[10:30] backend → "feat: add AcertosPatternCache for hit pattern performance"
 Files: service/util/AcertosPatternCache.java

[11:15] backend → "feat: add logback-spring.xml with structured JSON logging"
 Files: src/main/resources/logback-spring.xml
```

### Jan 23 (Fri)

```
[08:20] frontend → "feat: implement TendenciasAnalise with trend visualization"
 Files: src/components/TendenciasAnalise.tsx

[09:10] frontend → "feat: implement OrdemSorteioAnalise for draw order analysis"
 Files: src/components/OrdemSorteioAnalise.tsx

[10:00] frontend → "feat: implement FinanceiroAnalise with financial charts"
 Files: src/components/FinanceiroAnalise.tsx

[10:50] frontend → "feat: implement DuplaSenaAnalise with dual-draw analysis"
 Files: src/components/DuplaSenaAnalise.tsx

[11:30] frontend → "feat: implement EspeciaisDashboard for special contest tracking"
 Files: src/components/EspeciaisDashboard.tsx
```

### Jan 24 (Sat) — weekend, light work

```
[09:00] frontend → "feat: implement TimeCoracaoRanking for Timemania team stats"
 Files: src/components/TimeCoracaoRanking.tsx

[09:45] frontend → "feat: add public assets"
 Files: public/file.svg, public/globe.svg, public/next.svg, public/vercel.svg, public/window.svg
```

### Jan 25 (Sun)
*No commits*

### Jan 26 (Mon)

```
[08:15] backend → "feat: add AnaliseNumeroResponse DTO for number analysis"
 Files: domain/dto/AnaliseNumeroResponse.java

[09:00] backend → "feat: implement AnaliseNumeroService for per-number statistics"
 Files: service/AnaliseNumeroService.java

[09:45] backend → "feat: add FinanceiroAnalise DTO for financial data"
 Files: domain/dto/FinanceiroAnalise.java

[10:30] backend → "feat: implement FinanceiroService with prize calculations"
 Files: service/FinanceiroService.java

[11:15] backend → "feat: add OrdemSorteioAnalise DTO for draw order data"
 Files: domain/dto/OrdemSorteioAnalise.java
```

---

## Week 6 — Advanced Analysis (Jan 27–Feb 2)

### Jan 27 (Tue)

```
[08:10] backend → "feat: implement OrdemSorteioService for drawing position analysis"
 Files: service/OrdemSorteioService.java

[08:50] backend → "feat: add DuplaSenaAnalise DTO for dual-draw statistics"
 Files: domain/dto/DuplaSenaAnalise.java

[09:35] backend → "feat: implement DuplaSenaService for Dupla Sena specific analysis"
 Files: service/DuplaSenaService.java

[10:20] backend → "feat: implement TendenciaAnaliseService for trend detection"
 Files: service/TendenciaAnaliseService.java

[11:05] backend → "feat: implement AnaliseAvancadaController with all analysis endpoints"
 Files: controller/AnaliseAvancadaController.java
```

### Jan 28 (Wed)

```
[08:15] backend → "feat: add application-dev.yml with development overrides"
 Files: src/main/resources/application-dev.yml

[09:00] backend → "feat: add vault-env.sh for HashiCorp Vault secret management"
 Files: vault-env.sh

[09:50] backend → "feat: add Dockerfile with multi-stage build and Datadog APM"
 Files: Dockerfile, .dockerignore

[10:40] backend → "feat: add docker-compose.yml for backend + PostgreSQL"
 Files: docker-compose.yml

[11:25] backend → "docs: add API.md with comprehensive endpoint documentation"
 Files: API.md
```

### Jan 29 (Thu)

```
[08:20] backend → "docs: add README.md with setup instructions and API reference"
 Files: README.md

[09:05] backend → "docs: add AGENTS.md with build commands and code conventions"
 Files: AGENTS.md

[09:50] plugin → "feat: add Jogos do Dia multi-lottery batch feature"
 Files: src/popup.js (update — add jogosDoDia functionality)

[10:35] plugin → "feat: add progress bar and confirmation dialog"
 Files: src/popup.js (update — add progress tracking), src/popup.css (update)

[11:20] plugin → "feat: add template save/load/delete functionality"
 Files: src/popup.js (update — add template management)
```

### Jan 30 (Fri)

```
[08:15] plugin → "feat: add options/settings page"
 Files: src/options.html, src/options.js, src/options.css

[09:00] plugin → "feat: add per-lottery strategy selection in Jogos do Dia"
 Files: src/popup.js (update — add strategy toggle per lottery)

[09:45] plugin → "docs: add README.md with installation and usage guide"
 Files: README.md

[10:30] frontend → "feat: implement RegionalAnalysis with geographic winner distribution"
 Files: src/components/RegionalAnalysis.tsx

[11:15] frontend → "feat: implement ProbabilityCalculator with combinatorics"
 Files: src/components/ProbabilityCalculator.tsx
```

### Jan 31 (Sat) — weekend, light work

```
[09:00] frontend → "feat: implement ShareButtons for social sharing"
 Files: src/components/ShareButtons.tsx

[09:50] parent → "feat: initialize parent repository"
 Files: .gitignore, .dockerignore, README.md (initial version)
```

### Feb 1 (Sun)
*No commits*

---

## Week 7 — Infrastructure & Monitoring (Feb 3–9)

### Feb 2 (Mon)

```
[08:15] parent → "feat: add docker-compose.yml for full-stack deployment"
 Files: docker-compose.yml

[09:00] parent → "feat: add environment configuration template"
 Files: .env.docker.example, loterias-env.conf

[09:45] parent → "feat: add Nginx reverse proxy configuration"
 Files: nginx/loterias-backend.conf

[10:30] parent → "feat: add Nginx Docker configuration with rate limiting"
 Files: nginx/nginx.docker.conf

[11:15] parent → "docs: add Nginx README with configuration guide"
 Files: nginx/README.md
```

### Feb 3 (Tue)

```
[08:10] parent → "feat: add Prometheus configuration for backend metrics"
 Files: grafana/prometheus.yml

[08:50] parent → "feat: add Grafana data sources for Prometheus and Loki"
 Files: grafana/datasources.yml

[09:35] parent → "feat: add Loki configuration for log aggregation"
 Files: grafana/loki-config.yml

[10:20] parent → "feat: add Grafana overview dashboard"
 Files: grafana/loterias-overview-dashboard.json

[11:05] parent → "feat: add Grafana backend metrics dashboard"
 Files: grafana/loterias-backend-dashboard.json

[11:45] parent → "feat: add Grafana logs dashboard"
 Files: grafana/loterias-logs-dashboard.json
```

### Feb 4 (Wed)

```
[08:15] parent → "docs: add Grafana/monitoring README"
 Files: grafana/README.md

[09:00] parent → "feat: add production systemd service for backend"
 Files: loterias-backend.service

[09:45] parent → "feat: add production systemd service for frontend"
 Files: loterias-frontend.service

[10:30] parent → "feat: add production install script"
 Files: install-services.sh

[11:15] parent → "feat: add logrotate configuration"
 Files: loterias-logrotate.conf
```

### Feb 5 (Thu)

```
[08:20] parent → "feat: add development systemd services with hot reload"
 Files: loterias-backend-dev.service, loterias-frontend-dev.service

[09:05] parent → "feat: add development install script"
 Files: install-dev-services.sh

[09:50] parent → "feat: add Nexus repository setup script"
 Files: setup-nexus-repos.sh

[10:35] frontend → "feat: add Dockerfile with multi-stage build"
 Files: Dockerfile, .dockerignore

[11:20] frontend → "feat: add environment variable examples"
 Files: .env.example
```

### Feb 6 (Fri)

```
[08:15] frontend → "feat: implement DatadogRum component for browser monitoring"
 Files: src/components/DatadogRum.tsx

[08:55] frontend → "feat: add metrics utility for analytics tracking"
 Files: src/lib/metrics.ts

[09:40] frontend → "feat: implement WebVitalsReporter for Core Web Vitals"
 Files: src/components/WebVitalsReporter.tsx

[10:25] frontend → "feat: add Pino logger with Loki integration"
 Files: src/lib/logger.ts

[11:10] frontend → "feat: add SEO robots.ts configuration"
 Files: src/app/robots.ts
```

### Feb 7 (Sat) — weekend, light work

```
[09:00] frontend → "feat: add XML sitemap generator"
 Files: src/app/sitemap.ts

[09:45] frontend → "feat: add favicon"
 Files: src/app/favicon.ico
```

### Feb 8 (Sun)
*No commits*

### Feb 9 (Mon)

```
[08:15] frontend → "docs: add README.md with project overview and setup"
 Files: README.md

[09:00] frontend → "docs: add AGENTS.md with build commands and conventions"
 Files: AGENTS.md

[10:00] parent → "feat: add backend submodule"
 Files: .gitmodules (auto), backend/ (submodule ref)

[10:30] parent → "feat: add frontend submodule"
 Files: .gitmodules (update), frontend/ (submodule ref)

[11:00] parent → "feat: add aposta-rapido submodule"
 Files: .gitmodules (update), aposta-rapido/ (submodule ref)
```

---

## Week 8 — Quality & Testing (Feb 10–16)

### Feb 10 (Tue)

```
[08:10] backend → "test: add TestCacheConfig for test environment"
 Files: src/test/java/.../config/TestCacheConfig.java

[08:55] backend → "test: add CaixaApiClientTest for external API integration"
 Files: src/test/java/.../service/CaixaApiClientTest.java

[09:40] backend → "test: add EstatisticaServiceTest for frequency calculations"
 Files: src/test/java/.../service/EstatisticaServiceTest.java

[10:25] backend → "test: add VerificadorApostasServiceTest for bet verification"
 Files: src/test/java/.../service/VerificadorApostasServiceTest.java

[11:10] backend → "test: add ConcursosEspeciaisServiceTest"
 Files: src/test/java/.../service/ConcursosEspeciaisServiceTest.java
```

### Feb 11 (Wed)

```
[08:15] backend → "test: add TimeCoracaoMesSorteServiceTest"
 Files: src/test/java/.../service/TimeCoracaoMesSorteServiceTest.java

[09:00] backend → "test: add ConcursoControllerTest for REST endpoints"
 Files: src/test/java/.../controller/ConcursoControllerTest.java

[09:45] backend → "test: add DashboardControllerTest"
 Files: src/test/java/.../controller/DashboardControllerTest.java

[10:30] backend → "test: add EstatisticaControllerTest"
 Files: src/test/java/.../controller/EstatisticaControllerTest.java

[11:15] backend → "test: add ApostasControllerTest"
 Files: src/test/java/.../controller/ApostasControllerTest.java
```

### Feb 12 (Thu)

```
[08:20] backend → "test: add ListExcelColumnsTest for import validation"
 Files: src/test/java/.../ListExcelColumnsTest.java

[09:05] plugin → "fix: improve error handling in background script retry logic"
 Files: src/background.js (update — improved error handling)

[09:50] plugin → "fix: correct AngularJS scope manipulation for form filling"
 Files: src/background.js (update — scope detection improvements)

[10:35] frontend → "fix: improve error handling in API proxy route"
 Files: src/app/api/[...path]/route.ts (update)

[11:20] frontend → "refactor: extract chart theme to separate configuration module"
 Files: src/lib/chartTheme.ts (update)
```

### Feb 13 (Fri)

```
[08:15] backend → "refactor: improve application.yml with observability configuration"
 Files: src/main/resources/application.yml (update — add Datadog, Loki, tracing config)

[09:00] backend → "fix: add proper validation to game generation parameters"
 Files: service/GeradorValidation.java (update — add edge case handling)

[10:00] frontend → "fix: handle API timeout and connection errors gracefully"
 Files: src/components/Dashboard.tsx (update — add error states)

[10:45] frontend → "style: refine dark theme contrast and chart colors"
 Files: src/app/globals.css (update — adjust CSS variables)

[11:30] plugin → "style: improve popup responsiveness and status messages"
 Files: src/popup.css (update — layout refinements)
```

### Feb 14 (Sat) — weekend

```
[09:30] backend → "fix: handle null values in ConcursoMapper for edge cases"
 Files: service/ConcursoMapper.java (update — null safety)
```

### Feb 15 (Sun)
*No commits*

### Feb 16 (Mon)

```
[08:15] frontend → "perf: add security headers to next.config.ts"
 Files: next.config.ts (update — add CSP, X-Frame-Options, etc.)

[09:00] frontend → "feat: add package scripts for build, deploy and publish"
 Files: package.json (update — add package and publish:nexus scripts)

[10:00] parent → "chore: update backend submodule to latest"
 Files: backend (submodule pointer update)

[10:30] parent → "chore: update frontend submodule to latest"
 Files: frontend (submodule pointer update)

[11:00] parent → "chore: update aposta-rapido submodule to latest"
 Files: aposta-rapido (submodule pointer update)
```

---

## Week 9 — Documentation & Polish (Feb 17–23)

### Feb 17 (Tue)

```
[08:10] parent → "docs: add main documentation README with project index"
 Files: docs/README.md

[08:55] parent → "docs: add ARCHITECTURE.md with system design and data flow"
 Files: docs/ARCHITECTURE.md

[09:40] parent → "docs: add BACKEND.md with API development guide"
 Files: docs/BACKEND.md

[10:25] parent → "docs: add FRONTEND.md with component documentation"
 Files: docs/FRONTEND.md

[11:10] parent → "docs: add PLUGIN.md with Chrome extension guide"
 Files: docs/PLUGIN.md
```

### Feb 18 (Wed)

```
[08:15] parent → "docs: add API.md with comprehensive endpoint reference"
 Files: docs/API.md

[09:00] parent → "docs: add DEPLOY.md with production deployment guide"
 Files: docs/DEPLOY.md

[09:45] parent → "docs: add DEVELOPMENT.md with setup and contribution guide"
 Files: docs/DEVELOPMENT.md

[10:30] parent → "docs: add FEATURES.md with detailed feature documentation"
 Files: docs/FEATURES.md

[11:15] parent → "docs: add MULTI-REPO.md with submodule setup guide"
 Files: docs/MULTI-REPO.md
```

### Feb 19 (Thu)

```
[08:20] parent → "docs: update README.md with complete project overview"
 Files: README.md (update — full architecture diagram, endpoints, monitoring)

[09:05] parent → "docs: add FUTURE-FEATURES.md with development roadmap"
 Files: FUTURE-FEATURES.md

[09:50] parent → "docs: add SQL fix script for municipality data cleanup"
 Files: docs/fix-nome-municipio-sorteio.sql

[10:35] backend → "fix: update sync cron schedule and batch size tuning"
 Files: src/main/resources/application.yml (update — tune performance)

[11:20] frontend → "fix: improve loading states and skeleton UI"
 Files: src/app/loading.tsx (update), src/components/Dashboard.tsx (update)
```

### Feb 20 (Fri)

```
[08:15] backend → "perf: optimize batch insert configuration for large sync"
 Files: src/main/resources/application.yml (update — hibernate.batch_size)

[09:00] frontend → "feat: add package-lock.json for reproducible builds"
 Files: package-lock.json

[10:00] plugin → "fix: handle page load delays for slow connections"
 Files: src/background.js (update — increase wait timeout)

[10:45] parent → "chore: update all submodules to latest"
 Files: backend, frontend, aposta-rapido (submodule pointer updates)

[11:30] parent → "chore: final infrastructure review and cleanup"
 Files: docker-compose.yml (update — verify configuration)
```

### Feb 21 (Sat) — weekend, light work

```
[09:00] backend → "chore: clean up unused imports and minor code style fixes"
 Files: various Java files (minor cleanups)

[09:45] frontend → "chore: fix ESLint warnings and TypeScript strict mode issues"
 Files: various TSX files (minor cleanups)
```

### Feb 22 (Sun)
*No commits*

### Feb 23 (Mon)

```
[08:15] parent → "chore: update all submodules to final state"
 Files: backend, frontend, aposta-rapido (submodule pointer updates)

[08:45] parent → "docs: final documentation review and version bump"
 Files: README.md (update — finalize)
```

---

## Summary Statistics

| Repository | Total Commits | Date Range |
|-----------|--------------|------------|
| `loterias-backend` | ~72 | Dec 23 – Feb 21 |
| `loterias-frontend` | ~52 | Jan 9 – Feb 21 |
| `loterias-aposta-rapido` | ~22 | Jan 16 – Feb 20 |
| `loterias` (parent) | ~35 | Jan 31 – Feb 23 |
| **Total** | **~181** | Dec 23 – Feb 23 |

## Execution Notes

### Git Date Override

Each commit uses custom author/committer dates:

```bash
GIT_AUTHOR_DATE="2025-12-23T08:15:00-03:00" \
GIT_COMMITTER_DATE="2025-12-23T08:15:00-03:00" \
git commit -m "feat: initialize Spring Boot project"
```

### Submodule Setup

```bash
# In parent repo (after child repos exist)
git submodule add <backend-url> backend
git submodule add <frontend-url> frontend
git submodule add <plugin-url> aposta-rapido
```

### Commit Message Convention

- `feat:` — New feature or file
- `fix:` — Bug fix
- `test:` — Test files
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `perf:` — Performance improvement
- `style:` — UI/CSS changes
- `chore:` — Maintenance, updates

### File Modification Strategy

- **New files:** Committed as complete files in logical groups
- **Modified files:** Committed as targeted changes (method additions, config changes)
- **Config evolution:** Base config committed early, monitoring/security added later
- **Tests:** Added after production code is stable (Week 8)

See `setup-git-repos.sh` for the executable implementation of this plan.
