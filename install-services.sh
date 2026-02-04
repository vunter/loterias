#!/bin/bash
set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Loterias Analyzer - Instalação                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"

PROJECT_DIR="/home/vunter/projects/loterias"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Create loterias system user if it doesn't exist
print_step "Verificando usuário do sistema"
if ! id -u loterias &>/dev/null; then
    sudo useradd --system --no-create-home --shell /usr/sbin/nologin loterias
    print_success "Usuário 'loterias' criado"
else
    print_success "Usuário 'loterias' já existe"
fi

# Create log directory
print_step "Criando diretórios"
sudo mkdir -p /var/log/loterias
sudo chown loterias:loterias /var/log/loterias
print_success "Diretório de logs criado"

# Backend
print_step "Construindo Backend (Spring Boot)"
cd "$PROJECT_DIR/backend"
if [ -f "./mvnw" ]; then
    ./mvnw clean package -DskipTests
else
    mvn clean package -DskipTests
fi
print_success "Backend construído"

# Frontend
print_step "Construindo Frontend (Next.js)"
cd "$PROJECT_DIR/frontend"
if command -v pnpm &> /dev/null; then
    pnpm install
    pnpm build
elif command -v npm &> /dev/null; then
    npm install
    npm run build
else
    print_error "npm ou pnpm não encontrado"
    exit 1
fi

# Copy static assets for standalone mode
if [ -d ".next/standalone" ]; then
    cp -r .next/static .next/standalone/.next/static
    [ -d "public" ] && cp -r public .next/standalone/public
    print_success "Frontend construído (standalone + static assets)"
else
    print_success "Frontend construído"
fi

# Nginx
print_step "Configurando Nginx"
if [ -f "/etc/nginx/nginx.conf" ]; then
    sudo cp "$PROJECT_DIR/nginx/loterias-backend.conf" /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-available/loterias-backend.conf /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    if sudo nginx -t 2>/dev/null; then
        sudo systemctl restart nginx
        print_success "Nginx configurado"
    else
        print_error "Erro na configuração do Nginx"
        sudo nginx -t
        exit 1
    fi
else
    print_warning "Nginx não instalado. Pulando configuração."
fi

# Systemd Services
print_step "Instalando serviços systemd"
sudo cp "$PROJECT_DIR/loterias-backend.service" /etc/systemd/system/
sudo cp "$PROJECT_DIR/loterias-frontend.service" /etc/systemd/system/
sudo systemctl daemon-reload
print_success "Services instalados"

# Habilitar e iniciar
print_step "Iniciando serviços"
sudo systemctl enable loterias-backend.service loterias-frontend.service
sudo systemctl restart loterias-backend.service loterias-frontend.service
print_success "Serviços iniciados"

# Aguardar inicialização
echo -n "Aguardando backend iniciar"
for i in {1..30}; do
    if curl -s http://127.0.0.1:8081/actuator/health > /dev/null 2>&1; then
        echo ""
        print_success "Backend online"
        break
    fi
    echo -n "."
    sleep 1
done

echo -n "Aguardando frontend iniciar"
for i in {1..15}; do
    if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
        echo ""
        print_success "Frontend online"
        break
    fi
    echo -n "."
    sleep 1
done

# Status final
print_step "Status dos Serviços"
echo ""
echo "Backend:"
sudo systemctl is-active loterias-backend.service && print_success "Rodando" || print_error "Parado"
echo ""
echo "Frontend:"
sudo systemctl is-active loterias-frontend.service && print_success "Rodando" || print_error "Parado"
echo ""
echo "Nginx:"
sudo systemctl is-active nginx && print_success "Rodando" || print_warning "Parado"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Instalação Concluída                      ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Frontend:  http://192.168.1.110:3000                        ║"
echo "║  Backend:   http://127.0.0.1:8080 (apenas local)             ║"
echo "║  Nginx:     http://192.168.1.110:80                          ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Comandos úteis:                                             ║"
echo "║    sudo systemctl status loterias-backend                    ║"
echo "║    sudo systemctl status loterias-frontend                   ║"
echo "║    journalctl -u loterias-backend -f                         ║"
echo "║    journalctl -u loterias-frontend -f                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
