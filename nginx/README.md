# Nginx Reverse Proxy - Loterias Backend

## Visão Geral

O Nginx atua como reverse proxy para o backend Spring Boot, oferecendo:

- **Segurança**: Bloqueio de scanners e paths maliciosos
- **Rate Limiting**: Proteção contra abuso
- **Proteção de Endpoints**: Actuator e Swagger apenas rede local
- **Headers**: X-Real-IP, X-Forwarded-For para logging correto

## Arquitetura

```
Internet/LAN                    Servidor
     │                             │
     │ :80                         │
     ▼                             ▼
┌─────────┐                 ┌─────────────┐
│ Cliente │────────────────►│   Nginx     │
└─────────┘                 │   (:80)     │
                            └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              ┌─────────┐   ┌─────────┐   ┌─────────────┐
              │ /api/*  │   │/actuator│   │ /SDK, etc   │
              │  PROXY  │   │  LOCAL  │   │   BLOCK     │
              └────┬────┘   └────┬────┘   └─────────────┘
                   │             │
                   ▼             ▼
            ┌─────────────────────────┐
            │   Backend (127.0.0.1)   │
            │        :8080            │
            └─────────────────────────┘
```

## Instalação

```bash
# Instalar Nginx
sudo apt install nginx -y

# Copiar configuração
sudo cp loterias-backend.conf /etc/nginx/sites-available/

# Criar symlink
sudo ln -sf /etc/nginx/sites-available/loterias-backend.conf /etc/nginx/sites-enabled/

# Remover default (opcional)
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Configuração do Backend

O backend deve escutar apenas em localhost:

```bash
# No arquivo loterias-backend.service
ExecStart=/usr/bin/java -jar target/loterias-analyzer-0.0.1-SNAPSHOT.jar --server.address=127.0.0.1
```

## Funcionalidades

### Bloqueio de Scanners

Paths maliciosos retornam 444 (conexão fechada sem resposta):

```nginx
location ~* ^/(SDK|cgi-bin|admin|wp-admin|phpmyadmin|.env|.git) {
    return 444;
}
```

### Rate Limiting

| Zona | Limite | Aplicação |
|------|--------|-----------|
| `api_limit` | 10 req/s | Endpoints `/api/*` |
| `sync_limit` | 1 req/min | Endpoints `/api/*/sync*` |

### Proteção de Endpoints Internos

Apenas IPs da rede local (192.168.1.0/24) podem acessar:

- `/actuator/*` - Métricas e health
- `/swagger-ui/*` - Documentação API
- `/api-docs/*` - OpenAPI spec

### Headers de Proxy

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Logs

```bash
# Ver logs de acesso
sudo tail -f /var/log/nginx/loterias-access.log

# Ver logs de erro
sudo tail -f /var/log/nginx/loterias-error.log

# Filtrar erros 4xx/5xx
sudo tail -f /var/log/nginx/loterias-access.log | grep -E '" [45][0-9]{2} '
```

## Testes

```bash
# Testar API (deve funcionar)
curl http://localhost/api/dashboard/megasena

# Testar bloqueio de scanner (deve fechar conexão)
curl -I http://localhost/SDK/webLanguage
# curl: (52) Empty reply from server

# Testar rate limit
for i in {1..20}; do 
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost/api/dashboard/megasena
done
# Após 10 requests, deve retornar 503

# Testar acesso externo ao actuator (deve ser bloqueado)
curl http://192.168.1.110/actuator/prometheus
# 403 Forbidden
```

## Troubleshooting

### Nginx não inicia

```bash
# Verificar sintaxe
sudo nginx -t

# Ver erro detalhado
sudo nginx -T
```

### 502 Bad Gateway

```bash
# Verificar se backend está rodando
curl http://127.0.0.1:8080/actuator/health

# Verificar logs
sudo tail -f /var/log/nginx/loterias-error.log
```

### Rate limit muito restritivo

Edite `loterias-backend.conf` e ajuste os valores:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;  # Aumentar
```
