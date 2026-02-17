# Aposta Rápido - Extensão Chrome

Extensão para Chrome que preenche automaticamente apostas no portal Loterias Online da Caixa.

## Funcionalidades

- ✅ Preencher jogos manualmente digitados
- ✅ Gerar jogos via API do Loterias Analyzer
- ✅ Múltiplas estratégias de geração
- ✅ Seleção de quantidade de números por jogo
- ✅ Suporte a trevos fixos (+Milionária)
- ✅ Suporte a time fixo (Timemania)
- ✅ Suporte a mês fixo (Dia de Sorte)
- ✅ **Jogos do Dia** - Apostar em múltiplas loterias automaticamente
- ✅ Persistência de configurações

## Estrutura do Projeto

```
aposta-rapido/
├── src/
│   ├── popup.html          # Interface do popup
│   ├── popup.css           # Estilos do popup
│   ├── popup.js            # Lógica do popup
│   ├── background.js       # Service Worker
│   ├── content.js          # Script injetado na página
│   └── content.css         # Estilos injetados
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json           # Configuração da extensão
└── README.md
```

## Instalação

### Modo Desenvolvedor

1. Abra `chrome://extensions/`
2. Ative "Modo do desenvolvedor"
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `aposta-rapido/`

### Atualizar

Após alterações no código:
1. Vá em `chrome://extensions/`
2. Clique no ícone de atualizar na extensão

## Uso

### Preenchimento Manual

1. Abra o popup da extensão
2. Selecione o tipo de loteria
3. Digite ou cole os números (um jogo por linha)
4. Clique em "Processar Números"
5. Abra o portal Loterias Online da Caixa
6. Clique em "Preencher no Site"

### Gerar via API

1. Configure a URL da API (padrão: `http://localhost:8080`)
2. Selecione quantidade de jogos e estratégia
3. Ajuste quantidade de números (se aplicável)
4. Clique em "Gerar Jogos"
5. Os números serão preenchidos automaticamente
6. Clique em "Preencher no Site"

### Jogos do Dia

Aposta em múltiplas loterias de uma vez:

1. Na seção "Jogos do Dia", clique em **📅 Hoje** para selecionar automaticamente as loterias com sorteio no dia atual
2. Ou marque manualmente as loterias desejadas
3. Defina a quantidade de jogos por loteria
4. Clique em **🚀 Gerar e Apostar**
5. O plugin irá:
   - Gerar jogos para cada loteria via API
   - Abrir cada página sequencialmente
   - Preencher os números automaticamente
   - Adicionar ao carrinho

## Loterias Suportadas

| Loteria | Números | Dias de Sorteio |
|---------|---------|-----------------|
| Mega-Sena | 6-20 de 60 | Ter, Qui, Sáb |
| Lotofácil | 15-20 de 25 | Seg-Sáb |
| Quina | 5-15 de 80 | Seg-Sáb |
| Lotomania | 50 de 100 | Seg, Qua, Sex |
| Timemania | 10 de 80 + Time | Ter, Qui, Sáb |
| Dupla Sena | 6-15 de 50 | Seg, Qua, Sex |
| Dia de Sorte | 7-15 de 31 + Mês | Ter, Qui, Sáb |
| Super Sete | 7-21 colunas | Seg, Qua, Sex |
| +Milionária | 6-12 de 50 + 2-6 trevos | Qua, Sáb |

## Estratégias de Geração

| Estratégia | Descrição |
|------------|-----------|
| FREQUENCIA_POSICIONAL | Baseada na frequência por posição de sorteio |
| NUMEROS_QUENTES | Números mais sorteados recentemente |
| NUMEROS_ATRASADOS | Números há mais tempo sem sair |
| BALANCEADO | Mix de quentes, frios e médios |
| CICLOS | Baseado em ciclos de repetição |
| PARES_IMPARES | Equilibra pares e ímpares |
| FIBONACCI | Usa sequência de Fibonacci |
| ALEATORIO | Totalmente aleatório |

## Configurações Especiais

### +Milionária - Trevos

- Ajuste quantidade de trevos (2-6)
- Marque trevos fixos que sempre serão usados
- Trevos restantes são gerados/fornecidos

### Timemania - Time do Coração

- Digite o nome do time (ex: "FLAMENGO")
- Marque "Usar time fixo" para ignorar sugestão da API
- Suporta formato "NOME/UF" (ex: "VITÓRIA/BA")

### Dia de Sorte - Mês

- Selecione o mês no dropdown
- Marque "Usar mês fixo" para ignorar sugestão da API

## Arquitetura

### popup.js

Gerencia a interface do usuário:
- Seleção de loteria
- Entrada de números
- Chamadas à API
- Persistência via `chrome.storage.local`

Principais funções:
- `handleParse()` - Processa números digitados
- `handleFill()` - Preenche no site
- `handleFetchGames()` - Gera jogos via API
- `handleJogosDoDia()` - Processa múltiplas loterias
- `selecionarLoteriasHoje()` - Seleciona loterias do dia
- `saveState()` / `loadSavedState()` - Persistência

### background.js

Service Worker que:
- Processa fila de loterias (Jogos do Dia)
- Abre abas sequencialmente
- Injeta script de preenchimento
- Gerencia ciclo de vida

Principais funções:
- `processarProximaLoteria()` - Processa fila
- `executeFillForTab()` - Injeta e executa preenchimento
- `waitForTabLoad()` - Aguarda página carregar

### content.js

Script injetado nas páginas do portal da Caixa:
- Comunica com popup via mensagens
- Detecta estado da página

## Permissões

```json
{
  "permissions": [
    "activeTab",    // Interagir com aba ativa
    "tabs",         // Criar/gerenciar abas
    "storage",      // Persistir dados
    "scripting",    // Injetar scripts
    "contextMenus"  // Menu de contexto
  ],
  "host_permissions": [
    "https://www.loteriasonline.caixa.gov.br/*",
    "https://loteriasonline.caixa.gov.br/*",
    "https://*.caixa.gov.br/*"
  ]
}
```

## Depuração

### Console do Popup
1. Clique com botão direito no ícone da extensão
2. "Inspecionar popup"

### Console do Service Worker
1. Vá em `chrome://extensions/`
2. Clique em "Service Worker" na extensão

### Console da Página
1. Abra DevTools na página do portal
2. Logs começam com `[Aposta Rápido]`

## Fluxo de Preenchimento

```
1. Popup gera jogos via API
2. Popup envia mensagem para Background
3. Background abre aba do portal
4. Background aguarda página carregar
5. Background injeta script via chrome.scripting.executeScript
6. Script injetado:
   a. Limpa seleção anterior
   b. Seleciona cada número via Angular scope
   c. Seleciona time/mês se aplicável
   d. Clica em "Colocar no Carrinho"
7. Background processa próxima loteria
```

## Integração com Angular

O portal da Caixa usa AngularJS. O script injetado:

```javascript
// Obter scope do Angular
const scope = angular.element(element).scope();

// Selecionar número
scope.vm.selecionar(scope.numero);

// Adicionar ao carrinho
scope.vm.incluirAposta();

// Aplicar mudanças
angular.element(document.body).injector().get('$rootScope').$apply();
```

## Troubleshooting

### Números não são preenchidos
- Verifique se está na página correta do portal
- Aguarde a página carregar completamente
- Verifique o console para erros

### API não responde
- Verifique se o backend está rodando
- Confirme a URL da API nas configurações
- Verifique CORS no backend

### Dados perdidos ao fechar popup
- Dados são salvos automaticamente no `chrome.storage`
- Verifique permissão "storage" no manifest
