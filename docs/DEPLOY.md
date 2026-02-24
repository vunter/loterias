# Guia de Deploy - Loterias Analyzer

## Visão Geral

Este guia cobre o deploy completo do sistema em dois servidores:

- **192.168.1.110** - Aplicação (Backend + Frontend + Nginx)
- **192.168.1.193** - Monitoramento (Prometheus + Loki + Grafana)

## Pré-requisitos

### Servidor de Aplicação (192.168.1.110)

```bash
# Java 25
sudo apt install openjdk-25-jdk -y

# Node.js (via fnm)
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 24

# Nginx
sudo apt install nginx -y

# Maven
sudo apt install maven -y
```

### Servidor de Monitoramento (192.168.1.193)

```bash
# Prometheus
sudo apt install prometheus -y

# Grafana
sudo apt install grafana -y

# Loki (download manual)
curl -O -L "https://github.com/grafana/loki/releases/download/v2.9.0/loki-linux-amd64.zip"
unzip loki-linux-amd64.zip
sudo mv loki-linux-amd64 /usr/local/bin/loki
```

---

## 1. Deploy do Backend

### 1.1. Build

```bash
cd /home/vunter/projects/loterias/backend
mvn clean package -DskipTests
```

### 1.2. Configuração do Service

O arquivo `loterias-backend.service` configura o systemd:

```ini
[Unit]
Description=Loterias Analyzer Backend (Spring Boot)
After=network.target

[Service]
Type=simple
User=vunter
WorkingDirectory=/home/vunter/projects/loterias/backend
ExecStart=/usr/bin/java -jar target/loterias-analyzer-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=SPRING_PROFILES_ACTIVE=dev

[Install]
WantedBy=multi-user.target
```

**Pontos importantes:**
- `--server.address=127.0.0.1` - Backend escuta apenas localhost (segurança)
- `SPRING_PROFILES_ACTIVE=dev` - Usa H2 em memória
- Para PostgreSQL, use `prod` e configure `DATABASE_*`

### 1.3. Instalação

```bash
sudo cp loterias-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable loterias-backend
sudo systemctl start loterias-backend
```

### 1.4. Verificação

```bash
# Status
sudo systemctl status loterias-backend

# Logs
journalctl -u loterias-backend -f

# Teste local
curl http://127.0.0.1:8081/api/dashboard/megasena
```

---

## 2. Deploy do Frontend

### 2.1. Build

```bash
cd /home/vunter/projects/loterias/frontend
pnpm install
pnpm build
```

### 2.2. Configuração do Service

O arquivo `loterias-frontend.service`:

```ini
[Unit]
Description=Loterias Analyzer Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=vunter
WorkingDirectory=/home/vunter/projects/loterias/frontend
ExecStart=/home/vunter/.local/share/fnm/node-versions/v24.13.0/installation/bin/node /home/vunter/projects/loterias/frontend/.next/standalone/server.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
Environment=BACKEND_URL=http://127.0.0.1:8081
Environment=LOKI_URL=http://192.168.1.193:3100
Environment=PROMETHEUS_PUSHGATEWAY_URL=http://192.168.1.193:9091
Environment=LOG_LEVEL=info

[Install]
WantedBy=multi-user.target
```

**Pontos importantes:**
- `BACKEND_URL=http://127.0.0.1:8081` - Frontend se conecta ao backend local
- O frontend faz proxy de `/api/*` via API Routes do Next.js

### 2.3. Instalação

```bash
sudo cp loterias-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable loterias-frontend
sudo systemctl start loterias-frontend
```

### 2.4. Verificação

```bash
# Status
sudo systemctl status loterias-frontend

# Logs
journalctl -u loterias-frontend -f

# Teste
curl http://localhost:3000/api/dashboard/megasena
```

---

## 3. Configuração do Nginx

### 3.1. Instalação da Configuração

```bash
sudo cp nginx/loterias-backend.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/loterias-backend.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 3.2. Funcionalidades do Nginx

O reverse proxy oferece:

| Funcionalidade | Descrição |
|---------------|-----------|
| Rate Limiting | 10 req/s para API, 1 req/min para sync |
| Bloqueio de Scanners | `/SDK`, `/cgi-bin`, `/wp-admin` → 444 |
| Proteção Actuator | `/actuator/*` apenas rede local |
| Headers de Proxy | X-Real-IP, X-Forwarded-For |

### 3.3. Logs

```bash
# Acesso
sudo tail -f /var/log/nginx/loterias-access.log

# Erros
sudo tail -f /var/log/nginx/loterias-error.log
```

---

## 4. Configuração do Prometheus

### 4.1. Configuração

No servidor 192.168.1.193, edite `/etc/prometheus/prometheus.yml`:

```yaml
global:
 scrape_interval: 15s
 evaluation_interval: 15s

scrape_configs:
 - job_name: 'prometheus'
 static_configs:
 - targets: ['localhost:9090']

 - job_name: 'loterias-backend'
 metrics_path: '/actuator/prometheus'
 scrape_interval: 10s
 static_configs:
 - targets: ['192.168.1.110:8081']
 labels:
 application: 'loterias-analyzer'
 environment: 'production'
```

### 4.2. Reiniciar

```bash
sudo systemctl restart prometheus
```

### 4.3. Verificar

Acesse http://192.168.1.193:9090/targets e verifique se `loterias-backend` está **UP**.

---

## 5. Configuração do Loki

### 5.1. Configuração

Copie `grafana/loki-config.yml` para `/etc/loki/loki-config.yml`.

### 5.2. Service (se necessário)

```ini
[Unit]
Description=Loki Log Aggregation
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/loki -config.file=/etc/loki/loki-config.yml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 5.3. Verificar

```bash
curl http://localhost:3100/loki/api/v1/labels
# Deve retornar: {"status":"success","data":["application","level",...]}
```

---

## 6. Configuração do Grafana

### 6.1. Data Sources

Acesse http://192.168.1.193:3000 → Configuration → Data Sources:

**Prometheus:**
- URL: `http://localhost:9090`
- Access: Server

**Loki:**
- URL: `http://localhost:3100`
- Access: Server

### 6.2. Importar Dashboards

1. Vá em Dashboards → Import
2. Upload dos arquivos JSON de `grafana/`:
 - `loterias-overview-dashboard.json`
 - `loterias-backend-dashboard.json`
 - `loterias-logs-dashboard.json`

---

## 7. Script de Instalação Rápida

### Produção

Use o script `install-services.sh`:

```bash
#!/bin/bash
set -e

echo "=== Instalando Loterias Analyzer ==="

# Backend
echo "Building backend..."
cd backend
mvn clean package -DskipTests
cd ..

# Frontend
echo "Building frontend..."
cd frontend
pnpm install
pnpm build
cd ..

# Services
echo "Installing services..."
sudo cp loterias-backend.service /etc/systemd/system/
sudo cp loterias-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload

# Nginx
echo "Configuring nginx..."
sudo cp nginx/loterias-backend.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/loterias-backend.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start services
echo "Starting services..."
sudo systemctl enable loterias-backend loterias-frontend
sudo systemctl start loterias-backend loterias-frontend

echo "=== Instalação concluída ==="
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8081 (interno)"
```

### Desenvolvimento (Hot Reload)

Para instalar os serviços de desenvolvimento com hot reload:

```bash
./install-dev-services.sh
```

Isso instala dois serviços adicionais:

| Serviço | Descrição |
|---------|-----------|
| `loterias-backend-dev` | Backend com Spring DevTools (hot reload) |
| `loterias-frontend-dev` | Frontend em modo dev (hot reload) |

**Comandos:**

```bash
# Iniciar desenvolvimento (pare produção primeiro!)
sudo systemctl stop loterias-backend loterias-frontend
sudo systemctl start loterias-backend-dev loterias-frontend-dev

# Voltar para produção
sudo systemctl stop loterias-backend-dev loterias-frontend-dev
sudo systemctl start loterias-backend loterias-frontend

# Logs de desenvolvimento
journalctl -u loterias-backend-dev -u loterias-frontend-dev -f
```

 **Não rode serviços de dev e produção simultaneamente!**

---

## 8. Troubleshooting

### Backend não inicia

```bash
# Ver logs detalhados
journalctl -u loterias-backend -n 100

# Verificar porta
ss -tlnp | grep 8080

# Testar manualmente
cd /home/vunter/projects/loterias/backend
java -jar target/loterias-analyzer-0.0.1-SNAPSHOT.jar
```

### Frontend não conecta ao backend

```bash
# Verificar se backend está rodando
curl http://127.0.0.1:8081/actuator/health

# Verificar variável BACKEND_URL
systemctl show loterias-frontend | grep Environment

# Logs do frontend
journalctl -u loterias-frontend -f
```

### Prometheus não coleta métricas

```bash
# Verificar acesso ao actuator
curl http://192.168.1.110:8081/actuator/prometheus

# Verificar configuração
cat /etc/prometheus/prometheus.yml | grep -A5 loterias

# Status do target
curl http://localhost:9090/api/v1/targets
```

### Loki não recebe logs

```bash
# Verificar labels
curl http://localhost:3100/loki/api/v1/label/application/values

# Query de teste
curl -G http://localhost:3100/loki/api/v1/query \
 --data-urlencode 'query={application="loterias-analyzer"}'

# Verificar logback do backend
cat backend/src/main/resources/logback-spring.xml
```

---

## 9. Atualizações

### Atualizar Backend

```bash
cd /home/vunter/projects/loterias/backend
git pull
mvn clean package -DskipTests
sudo systemctl restart loterias-backend
```

### Atualizar Frontend

```bash
cd /home/vunter/projects/loterias/frontend
git pull
pnpm install
pnpm build
sudo systemctl restart loterias-frontend
```

---

## 10. Backup

### Banco de Dados (H2)

```bash
# H2 em memória - não persiste, sem backup necessário
# Para PostgreSQL:
pg_dump -U postgres loterias > backup.sql
```

### Configurações

```bash
# Backup de configs
tar czf loterias-config-backup.tar.gz \
 loterias-backend.service \
 loterias-frontend.service \
 nginx/loterias-backend.conf \
 grafana/*.json
```
