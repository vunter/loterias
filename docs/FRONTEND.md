# Loterias Analyzer - Frontend

Dashboard web para análise de loterias brasileiras da Caixa Econômica Federal.

## Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Next.js | 16.1.6 | Framework React com SSR |
| React | 19.2.3 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Framework CSS utilitário |
| Nivo | 0.99.0 | Graficos (bar, line, pie) |
| Lucide React | 0.563.0 | Ícones |
| Pino + Loki | - | Logging centralizado |

## Estrutura do Projeto

```
frontend/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── api/ # API Routes (BFF)
│ │ ├── layout.tsx # Layout principal
│ │ ├── page.tsx # Página inicial
│ │ └── globals.css # Estilos globais
│ ├── components/ # Componentes React
│ │ ├── Dashboard.tsx # Dashboard principal
│ │ ├── LotterySelector.tsx # Seletor de loteria
│ │ ├── GameGenerator.tsx # Gerador de jogos
│ │ ├── BetChecker.tsx # Verificador de apostas
│ │ ├── NumberRanking.tsx # Ranking de números
│ │ ├── NumberBall.tsx # Componente de bola numerada
│ │ ├── MultiGameGenerator.tsx # Gerador múltiplo
│ │ ├── TendenciasAnalise.tsx # Análise de tendências
│ │ ├── FinanceiroAnalise.tsx # Análise financeira
│ │ ├── DuplaSenaAnalise.tsx # Análise Dupla Sena
│ │ ├── OrdemSorteioAnalise.tsx # Ordem de sorteio
│ │ ├── TimeCoracaoRanking.tsx # Ranking times (Timemania)
│ │ ├── JogosHistorico.tsx # Histórico de jogos
│ │ ├── EspeciaisDashboard.tsx # Loterias especiais
│ │ └── ThemeToggle.tsx # Alternador tema claro/escuro
│ ├── contexts/ # React Contexts
│ └── lib/
│ └── api.ts # Cliente API e tipos
├── public/ # Arquivos estáticos
├── next.config.ts # Configuração Next.js
├── tailwind.config.ts # Configuração Tailwind
├── package.json # Dependências
└── tsconfig.json # Configuração TypeScript
```

## Comandos

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (hot reload)
npm run dev

# Acessar
open http://localhost:3000
```

### Produção

```bash
# Build
npm run build

# Rodar produção
npm run start

# Empacotar para deploy
npm run package
```

### Qualidade

```bash
# Lint
npm run lint

# Type check
npm run build
```

## Serviços Systemd

### Produção
```bash
sudo systemctl start loterias-frontend
sudo systemctl stop loterias-frontend
sudo systemctl status loterias-frontend
journalctl -u loterias-frontend -f
```

### Desenvolvimento (Hot Reload)
```bash
sudo systemctl start loterias-frontend-dev
sudo systemctl stop loterias-frontend-dev
journalctl -u loterias-frontend-dev -f
```

 **Não rode ambos simultaneamente!**

## Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
# URL do backend
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## Componentes Principais

### Dashboard
Componente principal que exibe:
- Último resultado da loteria selecionada
- Estatísticas de frequência
- Números quentes e frios
- Análise de tendências

### GameGenerator
Gerador de jogos baseado em estratégias:
- Frequência Posicional
- Números Quentes
- Números Atrasados
- Balanceado
- Ciclos
- Pares/Ímpares
- Fibonacci
- Aleatório

### BetChecker
Verificador de apostas que permite:
- Conferir números contra concursos passados
- Simular apostas em histórico
- Visualizar acertos e premiações

### NumberRanking
Exibe ranking de números:
- Mais frequentes
- Menos frequentes
- Mais atrasados
- Correlações entre números

## Temas

O frontend suporta tema claro e escuro através do componente `ThemeToggle`.

Classes semânticas de cores:
- `bg-surface-primary` - Fundo principal
- `bg-surface-secondary` - Fundo secundário
- `text-text-primary` - Texto principal
- `text-text-secondary` - Texto secundário
- `border-border-primary` - Bordas

## API Client

Todas as chamadas à API passam pelo cliente em `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Buscar último concurso
const ultimo = await api.getUltimoConcurso('mega_sena');

// Buscar estatísticas
const frequencia = await api.getFrequencia('lotofacil');

// Gerar jogos
const jogos = await api.gerarJogos('quina', { 
 quantidade: 5, 
 estrategia: 'FREQUENCIA_POSICIONAL' 
});
```

## Loterias Suportadas

| Loteria | Código | Números |
|---------|--------|---------|
| Mega-Sena | `mega_sena` | 6 de 60 |
| Lotofácil | `lotofacil` | 15 de 25 |
| Quina | `quina` | 5 de 80 |
| Lotomania | `lotomania` | 50 de 100 |
| Timemania | `timemania` | 10 de 80 + Time |
| Dupla Sena | `dupla_sena` | 6 de 50 (2x) |
| Dia de Sorte | `dia_de_sorte` | 7 de 31 + Mês |
| Super Sete | `super_sete` | 7 colunas (0-9) |
| +Milionária | `mais_milionaria` | 6 de 50 + 2 trevos |

## Deploy

O projeto gera um pacote standalone para deploy:

```bash
npm run package
# Gera: loterias-frontend-{version}.tar.gz
```

O pacote contém:
- `.next/standalone/` - Servidor Node.js otimizado
- `.next/static/` - Assets estáticos
- `public/` - Arquivos públicos
