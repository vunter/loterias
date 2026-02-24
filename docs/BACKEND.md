# Loterias Analyzer - Backend

API REST para análise de loterias brasileiras da Caixa Econômica Federal.

## Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Java | 25 | Linguagem |
| Spring Boot | 4.0.1 | Framework |
| Spring WebFlux | - | API reativa (Netty) |
| Spring Data JPA | - | Persistência |
| PostgreSQL | - | Banco produção |
| H2 | - | Banco desenvolvimento |
| Apache POI | 5.3.0 | Leitura de Excel |
| SpringDoc OpenAPI | 3.0.1 | Documentação Swagger |
| Micrometer | - | Métricas Prometheus |
| Loki4j | - | Logging centralizado |

## Estrutura do Projeto

```
backend/
├── src/main/java/br/com/loterias/
│ ├── config/ # Configurações
│ │ ├── CorsConfig.java # CORS
│ │ ├── WebClientConfig.java # WebClient
│ │ └── OpenApiConfig.java # Swagger
│ ├── controller/ # REST Controllers
│ │ ├── ConcursoController.java
│ │ ├── EstatisticasController.java
│ │ ├── ApostaController.java
│ │ ├── ImportController.java
│ │ └── ExportController.java
│ ├── domain/ # Entidades e DTOs
│ │ ├── Concurso.java # Entidade principal
│ │ ├── TipoLoteria.java # Enum de loterias
│ │ └── dto/ # Data Transfer Objects
│ ├── service/ # Lógica de negócio
│ │ ├── ConcursoService.java
│ │ ├── EstatisticasService.java
│ │ ├── GeradorJogosService.java
│ │ ├── ImportService.java
│ │ └── CaixaApiService.java
│ ├── scheduler/ # Jobs agendados
│ │ └── ImportScheduler.java
│ └── LoteriasApplication.java # Main
├── src/main/resources/
│ ├── application.yml # Configuração principal
│ ├── application-dev.yml # Perfil desenvolvimento
│ └── application-prod.yml # Perfil produção
├── pom.xml # Maven
├── Dockerfile # Container
└── docker-compose.yml # Compose com PostgreSQL
```

## Comandos

### Desenvolvimento

```bash
# Compilar
mvn clean compile

# Rodar (perfil dev com H2)
mvn spring-boot:run

# Rodar com perfil produção
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Acessar
open http://localhost:8081
open http://localhost:8081/docs # Swagger
```

### Testes

```bash
mvn test
```

### Build

```bash
# Gerar JAR
mvn clean package

# JAR gerado em:
# target/loterias-analyzer-0.0.1-SNAPSHOT.jar
```

## Serviços Systemd

### Produção
```bash
sudo systemctl start loterias-backend
sudo systemctl stop loterias-backend
sudo systemctl status loterias-backend
journalctl -u loterias-backend -f
```

### Desenvolvimento (Hot Reload)
```bash
sudo systemctl start loterias-backend-dev
sudo systemctl stop loterias-backend-dev
journalctl -u loterias-backend-dev -f
```

 **Não rode ambos simultaneamente!**

## Docker

```bash
# Build da imagem
docker build -t loterias-backend .

# Subir com PostgreSQL
docker-compose up -d
```

## API Endpoints

### Documentação Interativa

- **Swagger UI:** http://localhost:8081/docs
- **OpenAPI JSON:** http://localhost:8081/api-docs

### Principais Endpoints

#### Concursos
```http
GET /api/concursos/{tipo}/ultimo # Último concurso
GET /api/concursos/{tipo}/{numero} # Concurso específico
```

#### Estatísticas
```http
GET /api/estatisticas/{tipo}/frequencia # Frequência
GET /api/estatisticas/{tipo}/mais-frequentes # Top números
GET /api/estatisticas/{tipo}/menos-frequentes # Menos frequentes
GET /api/estatisticas/{tipo}/atrasados # Atrasados
GET /api/estatisticas/{tipo}/correlacao # Pares frequentes
GET /api/estatisticas/{tipo}/pares-impares # Distribuição
GET /api/estatisticas/{tipo}/soma-media # Soma média
GET /api/estatisticas/{tipo}/acompanham/{numero} # Acompanham número
```

#### Gerador de Jogos
```http
GET /api/estatisticas/{tipo}/gerar-jogos-estrategico?estrategia=X&quantidade=N
POST /api/estatisticas/{tipo}/gerar-jogos
```

Parâmetros do gerador:
- `estrategia`: FREQUENCIA_POSICIONAL, NUMEROS_QUENTES, NUMEROS_ATRASADOS, BALANCEADO, CICLOS, PARES_IMPARES, FIBONACCI, ALEATORIO
- `quantidade`: 1-20
- `quantidadeNumeros`: Números por jogo (ex: 6-20 para Mega-Sena)
- `quantidadeTrevos`: 2-6 (apenas +Milionária)
- `trevosFixos`: Trevos fixos (ex: 1,4)

#### Apostas
```http
POST /api/apostas/{tipo}/verificar # Verificar aposta
POST /api/apostas/{tipo}/simular # Simular apostas
```

#### Importação
```http
POST /api/import/download-excel # Baixar todos os Excels
POST /api/import/{tipo}/local-excel # Importar Excel local
POST /api/import/{tipo}/excel # Upload Excel
GET /api/import/status # Status dos arquivos
```

#### Exportação
```http
GET /api/export/{tipo}/concursos.csv # Exportar CSV
GET /api/export/{tipo}/frequencia.csv # Frequência CSV
GET /api/export/{tipo}/estatisticas.csv # Estatísticas CSV
```

### Tipos de Loteria

| Loteria | Endpoint | Range | Qtd |
|---------|----------|-------|-----|
| Mega-Sena | `MEGA_SENA` | 1-60 | 6 |
| Lotofácil | `LOTOFACIL` | 1-25 | 15 |
| Quina | `QUINA` | 1-80 | 5 |
| Lotomania | `LOTOMANIA` | 0-99 | 50 |
| Timemania | `TIMEMANIA` | 1-80 | 10 |
| Dupla Sena | `DUPLA_SENA` | 1-50 | 6 |
| Dia de Sorte | `DIA_DE_SORTE` | 1-31 | 7 |
| Super Sete | `SUPER_SETE` | 0-9 | 7 colunas |
| +Milionária | `MAIS_MILIONARIA` | 1-50 + 1-6 | 6 + 2 |

## Fonte de Dados

API da Caixa: `https://servicebus2.caixa.gov.br/portaldeloterias/api/`

- `GET {loteria}/ultimo` - Último concurso
- `GET {loteria}/{numero}` - Concurso específico

Excel histórico baixado automaticamente de:
`https://loterias.caixa.gov.br/Paginas/{Loteria}.aspx`

## Observabilidade

### Métricas (Prometheus)
```http
GET /actuator/prometheus
```

### Health Check
```http
GET /actuator/health
```

### Logging (Loki)
Logs são enviados para Grafana Loki automaticamente em produção.

## Configuração

### application.yml (Desenvolvimento)

```yaml
spring:
 datasource:
 url: jdbc:h2:mem:loterias
 driver-class-name: org.h2.Driver
 jpa:
 hibernate:
 ddl-auto: create-drop
```

### application-prod.yml (Produção)

```yaml
spring:
 datasource:
 url: jdbc:postgresql://localhost:5432/loterias
 username: ${DB_USER}
 password: ${DB_PASS}
 jpa:
 hibernate:
 ddl-auto: validate
```

## Agendamentos

O `ImportScheduler` executa automaticamente:
- Atualização de resultados a cada hora
- Download de Excels diariamente às 6h
