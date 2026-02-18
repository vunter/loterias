# Funcionalidades do Sistema

## Visão Geral

O Loterias Analyzer oferece análise estatística completa de 9 loterias brasileiras:

| Loteria | Números | Dezenas | Características |
|---------|---------|---------|-----------------|
| Mega-Sena | 1-60 | 6 | Prêmio principal |
| Lotofácil | 1-25 | 15 | Maior chance de acerto |
| Quina | 1-80 | 5 | 5 números |
| Lotomania | 0-99 | 50 | 50 números de 100 |
| Timemania | 1-80 | 10 | + Time do Coração |
| Dupla Sena | 1-50 | 6 | 2 sorteios por concurso |
| Dia de Sorte | 1-31 | 7 | + Mês da Sorte |
| Super Sete | 0-9 | 7 colunas | 7 colunas de 0-9 |
| +Milionária | 1-50 + Trevos | 6+2 | Dezenas + Trevos |

---

## 1. Dashboard Principal

### Último Concurso
- Números sorteados (em ordem numérica)
- Data do sorteio
- Prêmio da faixa principal
- Quantidade de ganhadores
- Status (acumulou ou teve ganhador)
- Valor acumulado

### Último Concurso com Ganhador
- Para loterias acumuladas, mostra o último que teve ganhador
- Total de ganhadores
- Prêmio por ganhador
- Localização dos ganhadores (cidade/UF)

### Números Quentes
- Top 10 números mais sorteados no histórico
- Ordenados numericamente para fácil visualização

### Números Frios
- Top 10 números menos sorteados
- Podem indicar "regularização" futura

### Números Atrasados
- Top 10 números há mais tempo sem sair
- Baseado no atraso atual (concursos desde última aparição)

### Análise de Padrões
- Média de números pares por sorteio
- Média de números ímpares
- Média de números baixos (primeira metade)
- Média de números altos (segunda metade)

### Próximo Concurso
- Número do próximo concurso
- Data estimada
- Prêmio estimado
- Indicador de acumulado

---

## 2. Análise de Tendências

### Números em Alta (Quentes)
- Números com frequência acima da média recente
- Taxa de crescimento (comparação recente vs histórico)
- Atraso atual

### Números Emergentes
- Números com crescimento recente acelerado
- Podem estar "esquentando"
- Boa aposta para estratégias de tendência

### Números em Baixa (Frios)
- Frequência abaixo da média
- Podem indicar números a evitar
- Ou números "prontos para sair"

### Padrões Vencedores
- Distribuição par/ímpar dos concursos com ganhadores
- Ex: "3 pares e 3 ímpares" apareceu em 35% dos concursos premiados
- Gráfico pizza com percentuais

### Gráficos
- Barras de frequência vs crescimento (quentes)
- Barras de frequência vs atraso (frios)
- Pizza de padrões vencedores

---

## 3. Análise de Ordem de Sorteio

Disponível para loterias que divulgam ordem de sorteio.

### Primeira Bola
- Números mais frequentes como primeira bola sorteada
- Top 5 com percentuais
- Gráfico de barras horizontal

### Última Bola
- Números mais frequentes como última bola
- Padrão diferente da primeira bola
- Gráfico comparativo

### Posição Média
- Números que saem mais cedo (menor posição média)
- Útil para estratégias de ordem

---

## 4. Análise Financeira

### Resumo
- Total arrecadado histórico
- Total de prêmios pagos
- ROI (retorno ao apostador em %)
- Saldo da reserva garantidora

### Estatísticas
- Maior arrecadação (concurso)
- Média de arrecadação por concurso
- Média de prêmio da faixa principal

### Evolução Mensal
- Gráfico de área: arrecadação ao longo do tempo
- Linha: prêmios pagos
- Últimos 24 meses

### ROI Mensal
- Gráfico de barras com % de retorno por mês
- Variação mostra meses com grandes prêmios

---

## 5. Gerador de Jogos

### Modo Estratégico

Estratégias predefinidas:

| Estratégia | Descrição |
|------------|-----------|
| ALEATORIO | Números completamente aleatórios |
| QUENTES | Prioriza números mais sorteados |
| FRIOS | Prioriza números menos sorteados |
| ATRASADOS | Prioriza números há mais tempo sem sair |
| BALANCEADO | Mix equilibrado de quentes, frios e atrasados |
| ESTATISTICO | Baseado em padrões históricos de jogos vencedores |

### Modo Personalizado

Opções configuráveis:
- **Quantidade de números**: Slider de mínimo a máximo permitido
- **Usar números quentes**: Inclui números mais frequentes
- **Usar números frios**: Inclui números menos frequentes
- **Usar números atrasados**: Inclui números há mais tempo sem sair
- **Balancear pares/ímpares**: Distribui equilibradamente
- **Evitar sequenciais**: Evita números consecutivos (ex: 10, 11, 12)
- **Números obrigatórios**: Seleciona números que devem estar no jogo
- **Números excluídos**: Seleciona números a evitar

### Time do Coração / Mês da Sorte
- Para Timemania: Sugestão de time baseada em estatísticas
- Para Dia de Sorte: Sugestão de mês

### Debug Mode
- Mostra etapas da geração
- Exibe números quentes/frios/atrasados usados
- Mostra pesos atribuídos a cada número
- Ranking de times/meses com estatísticas

### Exportação de Jogos
- **Copiar Todos**: Copia todos os jogos para área de transferência
- **Baixar CSV**: Exporta jogos em formato CSV
- **Baixar TXT**: Exporta jogos em formato texto formatado

### Histórico de Jogos
- Jogos gerados são salvos automaticamente no localStorage
- Limite de 50 jogos por loteria
- Ações: copiar, expandir, remover
- Persistente entre sessões

---

## 6. Conferir Apostas

### Seleção de Números
- Grid visual com todos os números da loteria
- Click para selecionar/deselecionar
- Contador de selecionados
- Indicador de mínimo/máximo

### Resultado da Conferência

Resumo:
- Total de concursos analisados
- Vezes que teria sido premiado
- Percentual de acerto
- Maior quantidade de acertos
- Concurso com maior acerto

Detalhes:
- Lista de concursos onde teria ganhado
- Dezenas sorteadas com destaque nos acertos
- Faixa de premiação
- Valor do prêmio

---

## 7. Ranking de Números

### Ordenação
- Por Score de Tendência (padrão)
- Por Frequência absoluta
- Por Atraso atual

### Top 10 Visual
- Bolas grandes coloridas
- Cores indicam status (quente/frio/atrasado)

### Tabela Completa

Colunas:
- Posição no ranking
- Número (bola)
- Frequência absoluta
- % de aparições
- Atraso atual
- Média de atraso histórica
- Status (QUENTE, FRIO, ATRASADO, NORMAL)
- Score de tendência (0-100)
- Números companheiros (mais frequentes junto)

---

## 8. Concursos Especiais

### Dashboard Especiais
- Total acumulado para especiais
- Cards por loteria com especial ativo

### Próximos Especiais
- Mega da Virada
- Quina de São João
- Outros especiais
- Data estimada
- Valor acumulado
- Concursos restantes

### Resumo de Loterias
- Grid com todas as loterias
- Último concurso
- Próximo estimado
- Local do sorteio

---

## 9. Análise Dupla Sena

Análise específica para comparação entre sorteios.

### Estatísticas de Correlação
- Correlação entre 1º e 2º sorteio
- Média de coincidências por concurso
- Máximo de coincidências registrado
- Mínimo de coincidências

### Números por Sorteio
- Quentes do 1º sorteio
- Quentes do 2º sorteio
- Quentes em ambos
- Exclusivos de cada sorteio

### Distribuição de Coincidências
- Gráfico de barras: quantidade de concursos por número de coincidências
- Gráfico pizza: percentual

### Últimos Concursos
- Tabela com últimos 10 concursos
- Dezenas de cada sorteio (coloridas)
- Quantidade de coincidências
- Prêmio

---

## 10. Time do Coração / Mês da Sorte

Disponível para Timemania e Dia de Sorte.

### Ranking Completo
- Todos os times/meses
- Frequência absoluta
- Percentual de aparições
- Atraso atual
- Última aparição

### Destaques
- Mais frequente
- Menos frequente
- Mais atrasado

### Último Sorteio
- Time/mês do último concurso
- Número do concurso
- Data

---

## 11. Sistema de Temas

### Dark Mode (padrão)
- Fundo escuro (gray-950)
- Cards em gray-800
- Texto claro
- Menor cansaço visual

### Light Mode
- Fundo claro (slate-100)
- Cards brancos
- Texto escuro
- Contraste aumentado

### Persistência
- Preferência salva em localStorage
- Carrega automaticamente na próxima visita
- Respeita preferência do sistema se não houver escolha

---

## 12. Sincronização

### Manual
- Botão "Atualizar da Caixa"
- Rate limit: 1 requisição a cada 2 minutos
- Timer visual de cooldown
- Evita bloqueio pela API da Caixa

### Automática
- Scheduler às 22h diariamente
- Sincroniza todas as loterias
- Delay de 2s entre requisições

### Status
- Endpoint para verificar cooldown restante
- Frontend exibe timer regressivo
- Feedback visual de sucesso/erro

---

## 13. Exportação de Dados

### Aba Exportar
Nova aba no sistema que permite baixar dados em CSV:

- **Concursos**: Todos os resultados históricos com dezenas, datas e valores
- **Frequência**: Frequência de cada número com percentuais
- **Estatísticas**: Análises completas (pares, ímpares, sequências, correlações)

### Formatos
- CSV com separador ponto-e-vírgula (compatível com Excel PT-BR)
- Download direto via navegador
- Dados de qualquer loteria selecionada
