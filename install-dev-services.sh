#!/bin/bash

set -e

echo "Instalando serviços de desenvolvimento..."

# Copia os arquivos de serviço
sudo cp /home/vunter/projects/loterias/loterias-backend-dev.service /etc/systemd/system/
sudo cp /home/vunter/projects/loterias/loterias-frontend-dev.service /etc/systemd/system/

# Recarrega o systemd
sudo systemctl daemon-reload

echo ""
echo "Serviços de desenvolvimento instalados!"
echo ""
echo "Comandos úteis:"
echo "  Iniciar:    sudo systemctl start loterias-backend-dev loterias-frontend-dev"
echo "  Parar:      sudo systemctl stop loterias-backend-dev loterias-frontend-dev"
echo "  Status:     sudo systemctl status loterias-backend-dev loterias-frontend-dev"
echo "  Logs:       journalctl -u loterias-backend-dev -f"
echo "              journalctl -u loterias-frontend-dev -f"
echo ""
echo "NOTA: Não rode os serviços de dev e prod ao mesmo tempo!"
echo "      Pare os serviços de produção antes de iniciar os de desenvolvimento."
