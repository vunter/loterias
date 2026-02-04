# Grafana Dashboards - Loterias Analyzer

## ⚠️ Configuração Necessária

Antes de importar os dashboards, configure o Prometheus para coletar métricas do backend.

### 1. Configurar Prometheus (no servidor 192.168.1.193)

Adicione ao arquivo `/etc/prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'loterias-backend'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 10s
    static_configs:
      - targets: ['192.168.1.110:8080']
        labels:
          application: 'loterias-analyzer'
```

Reinicie o Prometheus:
```bash
sudo systemctl restart prometheus
```

### 2. Verificar se Prometheus está coletando

Acesse `http://192.168.1.193:9090/targets` e verifique se o job `loterias-backend` está UP.

### 3. Configurar Data Sources no Grafana

Acesse `http://192.168.1.193:3000` → Configuration → Data Sources:

**Prometheus:**
- URL: `http://localhost:9090`
- Access: Server (default)

**Loki:**
- URL: `http://localhost:3100`
- Access: Server (default)

---

## Dashboards Disponíveis

### 1. Loterias - Overview (`loterias-overview-dashboard.json`)
Visão geral do sistema com métricas combinadas de Prometheus e Loki.

**Painéis:**
- Status do Backend (UP/DOWN)
- Uptime do Backend
- Tempo de resposta p95 das APIs de Dashboard
- Erros nas últimas 24h
- Taxa de requisições por endpoint
- Operações de sincronização
- Uso de memória JVM
- Conexões do banco de dados

### 2. Loterias - Backend (`loterias-backend-dashboard.json`)
Métricas detalhadas do backend Spring Boot via Prometheus.

**Painéis:**
- Status, Uptime, Heap Memory
- Threads ativos, Requests/sec
- Taxa de requisições por endpoint
- Percentis de tempo de resposta (p50, p95)
- Códigos de status HTTP
- Erros 5xx por endpoint
- Memória JVM (Heap used/committed/max)
- Pool de conexões do banco (HikariCP)
- Taxa de Garbage Collection

### 3. Loterias - Logs (`loterias-logs-dashboard.json`)
Logs da aplicação via Loki.

**Painéis:**
- Volume de logs por nível (INFO, WARN, ERROR)
- Contadores de erros e warnings
- Logs de erro filtrados
- Todos os logs com busca
- Logs de sincronização e API da Caixa

## Pré-requisitos

### Data Sources necessários no Grafana:
1. **Prometheus** - URL: `http://localhost:9090` (ou seu endereço)
2. **Loki** - URL: `http://localhost:3100` (ou seu endereço)

## Instalação

### Via Interface do Grafana:
1. Acesse o Grafana em `http://192.168.1.193:3000`
2. Vá em **Dashboards** → **Import**
3. Clique em **Upload JSON file**
4. Selecione cada arquivo `.json` desta pasta
5. Selecione os data sources apropriados (Prometheus e Loki)
6. Clique em **Import**

### Via API do Grafana:
```bash
# Importar dashboards via API
for file in *.json; do
  curl -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -d @"$file" \
    http://192.168.1.193:3000/api/dashboards/db
done
```

## Endpoints do Backend necessários

O backend expõe métricas em:
- `http://localhost:8080/actuator/prometheus`

Certifique-se que o Prometheus está configurado para scrape:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'loterias-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

## Alertas Sugeridos

### Prometheus Alerts:
```yaml
groups:
  - name: loterias
    rules:
      - alert: LoteriaBackendDown
        expr: up{application="loterias-analyzer"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Backend está offline"
          
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{application="loterias-analyzer", status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Taxa de erros 5xx elevada"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{application="loterias-analyzer"}[5m])) by (le)) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Tempo de resposta p95 > 2s"
```

## Estrutura dos Arquivos

```
grafana/
├── README.md
├── loterias-overview-dashboard.json   # Visão geral
├── loterias-backend-dashboard.json    # Métricas do backend
└── loterias-logs-dashboard.json       # Logs da aplicação
```
