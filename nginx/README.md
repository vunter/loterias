# Nginx Reverse Proxy - Loterias Backend

## Visao Geral

O Nginx atua como reverse proxy para o backend Spring Boot, oferecendo:

- **Seguranca**: Bloqueio de scanners e paths maliciosos
- **Rate Limiting**: Protecao contra abuso
- **Protecao de Endpoints**: Actuator e Swagger apenas rede local
- **Headers**: X-Real-IP, X-Forwarded-For para logging correto

## Arquitetura

```
Internet/LAN                    Servidor
     |                              |
     | :80                          |

+---------+        +-------------+
| Cliente |--------| Nginx       |
+---------+        | (:80)       |
                   +------+------+
                          |
              +-----------+----------+
              |           |          |

         +---------+  +---------+  +-------------+
         | /api/*  |  |/actuator|  | /SDK, etc   |
         | PROXY   |  | LOCAL   |  | BLOCK       |
         +----+----+  +----+----+  +-------------+
              |             |

         +-------------------------+
         | Backend (127.0.0.1)     |
         | :8081                   |
         +-------------------------+
```

## Docker

A configuracao `nginx.docker.conf` e utilizada pelo `docker-compose.yml`:

```yaml
volumes:
  - ./nginx/nginx.docker.conf:/etc/nginx/conf.d/default.conf:ro
```

## Funcionalidades

### Bloqueio de Scanners

Paths maliciosos retornam 444 (conexao fechada sem resposta):

```nginx
location ~* ^/(SDK|cgi-bin|admin|wp-admin|phpmyadmin|.env|.git) {
    return 444;
}
```

### Rate Limiting

| Zona | Limite | Aplicacao |
|------|--------|-----------|
| `api_limit` | 10 req/s | Endpoints `/api/*` |
| `sync_limit` | 1 req/min | Endpoints `/api/*/sync*` |

### Protecao de Endpoints Internos

Apenas IPs da rede local (192.168.1.0/24) podem acessar:

- `/actuator/*` - Metricas e health
- `/swagger-ui/*` - Documentacao API
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
```

## Troubleshooting

### 502 Bad Gateway

```bash
# Verificar se backend esta rodando
curl http://127.0.0.1:8081/actuator/health

# Verificar logs
sudo tail -f /var/log/nginx/loterias-error.log
```
