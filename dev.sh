#!/bin/bash
set -e

# Loterias Dev Mode — toggles between Docker (prod) and systemd (dev hot-reload)
# Usage: ./dev.sh start|stop|status|logs

REPO_DIR="/home/vunter/projects/loterias-repos/loterias"
PROD_DIR="/home/vunter/projects/loterias"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; }
info() { echo -e "${CYAN}→ $1${NC}"; }

docker_running() {
  cd "$PROD_DIR"
  docker compose ps --status running --format '{{.Name}}' 2>/dev/null | grep -q loterias
}

dev_running() {
  systemctl is-active --quiet loterias-backend-dev 2>/dev/null || \
  systemctl is-active --quiet loterias-frontend-dev 2>/dev/null
}

install_services() {
  info "Instalando serviços de desenvolvimento..."
  sudo cp "$REPO_DIR/loterias-backend-dev.service" /etc/systemd/system/
  sudo cp "$REPO_DIR/loterias-frontend-dev.service" /etc/systemd/system/
  sudo systemctl daemon-reload
  ok "Serviços instalados"
}

cmd_start() {
  echo ""
  echo "╔══════════════════════════════════════════╗"
  echo "║     Loterias — Iniciando modo DEV        ║"
  echo "╚══════════════════════════════════════════╝"
  echo ""

  # Stop Docker containers if running
  if docker_running; then
    info "Parando containers Docker (produção)..."
    cd "$PROD_DIR"
    docker compose stop frontend backend nginx 2>/dev/null
    ok "Docker parado"
  fi

  # Install/update service files
  install_services

  # Start dev services
  info "Iniciando backend (Spring Boot + DevTools)..."
  sudo systemctl start loterias-backend-dev
  ok "Backend dev iniciado"

  info "Iniciando frontend (Next.js dev)..."
  sudo systemctl start loterias-frontend-dev
  ok "Frontend dev iniciado"

  # Wait for backend
  echo -n "Aguardando backend"
  for i in $(seq 1 60); do
    if curl -sf http://127.0.0.1:8081/actuator/health > /dev/null 2>&1; then
      echo ""
      ok "Backend online (porta 8081)"
      break
    fi
    echo -n "."
    sleep 2
  done

  # Wait for frontend
  echo -n "Aguardando frontend"
  for i in $(seq 1 20); do
    if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
      echo ""
      ok "Frontend online (porta 3000)"
      break
    fi
    echo -n "."
    sleep 2
  done

  echo ""
  echo "╔══════════════════════════════════════════════════════╗"
  echo "║  Modo DEV ativo — hot-reload habilitado              ║"
  echo "╠══════════════════════════════════════════════════════╣"
  echo "║  Frontend:  http://192.168.1.110:3000                ║"
  echo "║  Backend:   http://127.0.0.1:8081                    ║"
  echo "║  Código:    $REPO_DIR  ║"
  echo "╠══════════════════════════════════════════════════════╣"
  echo "║  Logs:      ./dev.sh logs                            ║"
  echo "║  Parar:     ./dev.sh stop                            ║"
  echo "╚══════════════════════════════════════════════════════╝"
}

cmd_stop() {
  echo ""
  echo "╔══════════════════════════════════════════╗"
  echo "║     Loterias — Parando modo DEV          ║"
  echo "╚══════════════════════════════════════════╝"
  echo ""

  if dev_running; then
    info "Parando serviços de desenvolvimento..."
    sudo systemctl stop loterias-backend-dev loterias-frontend-dev 2>/dev/null
    ok "Serviços dev parados"
  else
    warn "Serviços dev não estavam rodando"
  fi

  # Ask whether to restore Docker
  echo ""
  read -p "Restaurar containers Docker (produção)? [Y/n] " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    info "Sincronizando código para produção..."
    rsync -a --delete "$REPO_DIR/frontend/" "$PROD_DIR/frontend/" \
      --exclude node_modules --exclude .next --exclude .git
    rsync -a --delete "$REPO_DIR/backend/" "$PROD_DIR/backend/" \
      --exclude target --exclude .git
    ok "Código sincronizado"

    info "Reconstruindo e iniciando containers..."
    cd "$PROD_DIR"
    docker compose build --no-cache frontend backend
    docker compose up -d
    ok "Docker produção restaurado"

    echo -n "Aguardando containers"
    for i in $(seq 1 30); do
      if curl -sf http://127.0.0.1:80 > /dev/null 2>&1; then
        echo ""
        ok "Produção online (porta 80)"
        break
      fi
      echo -n "."
      sleep 2
    done
  fi

  echo ""
  ok "Modo dev encerrado"
}

cmd_status() {
  echo ""
  echo "═══ Status Loterias ═══"
  echo ""

  if dev_running; then
    echo -e "Modo:     ${GREEN}DEV (hot-reload)${NC}"
    echo -e "Código:   $REPO_DIR"
    echo ""
    echo "Backend dev:"
    systemctl is-active loterias-backend-dev && ok "Rodando" || err "Parado"
    echo "Frontend dev:"
    systemctl is-active loterias-frontend-dev && ok "Rodando" || err "Parado"
  elif docker_running; then
    echo -e "Modo:     ${CYAN}PRODUÇÃO (Docker)${NC}"
    echo ""
    cd "$PROD_DIR"
    docker compose ps --format 'table {{.Name}}\t{{.Status}}\t{{.Ports}}'
  else
    warn "Nenhum serviço rodando"
  fi

  echo ""

  # Quick health checks
  echo "═══ Health ═══"
  if curl -sf http://127.0.0.1:8081/actuator/health > /dev/null 2>&1; then
    ok "Backend:   http://127.0.0.1:8081  ✓"
  else
    err "Backend:   http://127.0.0.1:8081  ✗"
  fi

  if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    ok "Frontend:  http://127.0.0.1:3000  ✓"
  else
    err "Frontend:  http://127.0.0.1:3000  ✗"
  fi

  if curl -sf http://127.0.0.1:80 > /dev/null 2>&1; then
    ok "Nginx:     http://127.0.0.1:80    ✓"
  else
    warn "Nginx:     http://127.0.0.1:80    ✗ (normal em modo dev)"
  fi
  echo ""
}

cmd_logs() {
  if dev_running; then
    journalctl -u loterias-backend-dev -u loterias-frontend-dev -f --no-pager
  elif docker_running; then
    cd "$PROD_DIR"
    docker compose logs -f frontend backend --tail 50
  else
    err "Nenhum serviço rodando"
    exit 1
  fi
}

case "${1:-}" in
  start)  cmd_start ;;
  stop)   cmd_stop ;;
  status) cmd_status ;;
  logs)   cmd_logs ;;
  *)
    echo "Uso: $0 {start|stop|status|logs}"
    echo ""
    echo "  start   — Para Docker, inicia backend+frontend em modo dev (hot-reload)"
    echo "  stop    — Para dev, opcionalmente restaura Docker (produção)"
    echo "  status  — Mostra qual modo está ativo e health checks"
    echo "  logs    — Segue logs do modo ativo"
    exit 1
    ;;
esac
