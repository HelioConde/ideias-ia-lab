# Plano mestre de execução fullstack

Atualizado em 2026-10-06.

Este documento organiza o trabalho para levar **todos os 41 produtos do Ideias IA Lab** até um MVP fullstack utilizável sem transformar o portfólio em dezenas de projetos pela metade.

## Objetivo

Cada produto deve chegar, no mínimo, ao estado **MVP publicado**, com:

- proposta de valor clara;
- frontend responsivo;
- backend/API quando necessário;
- persistência de dados quando necessária;
- autenticação e autorização quando necessárias;
- estados de loading, vazio, erro e sucesso;
- UX/UI revisada;
- QA dos fluxos críticos;
- SEO e metadados quando o produto for indexável;
- segurança básica e tratamento de segredos;
- deploy funcional;
- preparação de layout/arquitetura para monetização por anúncios;
- README técnico e backlog de V2.

O `ideias-ia-lab` continua sendo somente o hub. Código de produto fica no repositório próprio.

## Regra global de monetização

Todos os **41 produtos** devem ser projetados para monetização por anúncios.

Regras obrigatórias:

- anúncios fazem parte da arquitetura de monetização de todo produto;
- prever inventário publicitário desde UX/UI e responsividade, sem sacrificar a ação principal;
- evitar CLS/layout shift reservando espaço quando houver slot de anúncio;
- nunca inserir anúncios no meio de ações críticas, confirmação de pagamento, autenticação ou controles que possam gerar clique acidental;
- produtos com páginas públicas devem considerar SEO, recorrência, tempo de sessão e páginas úteis como parte da estratégia de aquisição e monetização;
- implementar consentimento/privacidade e políticas da rede de anúncios quando aplicável;
- receitas adicionais como assinatura, afiliados, créditos ou premium são opcionais e complementares;
- ativar anúncios reais somente quando o produto estiver pronto e em conformidade; durante desenvolvimento, usar apenas placeholders técnicos claramente identificados quando necessário.

### Gate de monetização por anúncios

Antes de considerar um MVP pronto para crescimento, verificar:

- [ ] locais de anúncio definidos para desktop e mobile;
- [ ] nenhum slot interrompe o fluxo principal;
- [ ] layout continua estável com e sem anúncio;
- [ ] páginas elegíveis possuem conteúdo real e suficiente;
- [ ] política de privacidade/consentimento prevista quando necessária;
- [ ] métricas de retenção podem ser acompanhadas sem incentivar comportamento enganoso;
- [ ] monetização complementar, quando existir, não elimina a base de anúncios.

## Regra principal de execução

Não desenvolver os 41 ao mesmo tempo.

WIP máximo:

- **2 projetos em implementação pesada**;
- **1 protótipo exploratório**;
- demais projetos ficam na fila;
- um projeto só libera uma vaga pesada quando atingir o gate de saída.

## Trilhas de trabalho

### Trilha A — SaaS / utilidades

Projetos gerais usam a infraestrutura compartilhada definida para o portfólio, com `pizzaria-db` quando precisarem de banco.

Prioridade inicial:
1. AgendaLeve
2. DocPronto
3. VagaCerta
4. PostPilot
5. MontaPC
6. Revisa
7. GameRadar
8. FalaPro
9. PratoPronto
10. Perto

### Trilha B — Games / Riot / Overwatch

Projetos de jogos ficam separados da infraestrutura SaaS. Quando houver reaproveitamento de dados Riot/TFT, usar a infraestrutura gamer compartilhada definida para ZeroTwo, sem misturar tabelas com produtos gerais.

Prioridade inicial:
1. Riot Legacy
2. LoL Match Story
3. TFT Wrapped
4. LoL Champion Journey
5. TFT Board Museum
6. LoL Session Insights
7. TFT Augment Memory
8. OW VOD Timeline
9. LoL Champion Pool
10. TFT Item Lab
11. OW Map Master
12. demais projetos conforme `PRIORIDADES_DESENVOLVIMENTO.md`

## Lotes de execução

### Lote 0 — saneamento do portfólio

Antes de expandir código:

- sincronizar `README.md`, `FULLSTACK_STATUS.md`, `PAINEL_EXECUCAO.md` e `PRIORIDADES_DESENVOLVIMENTO.md` com os repositórios que realmente existem;
- concluir a criação dos repositórios interrompida pelo secondary rate limit do GitHub;
- validar que cada repo tem `main`, README, licença/visibilidade correta e descrição;
- marcar claramente `IDEIA`, `PREPARADO`, `EM DESENVOLVIMENTO`, `MVP`, `QA`, `PUBLICADO` ou `PAUSADO`;
- nunca sobrescrever uma `main` existente automaticamente.

### Lote 1 — colocar os mais próximos de lançamento no ar

Implementação pesada:
- AgendaLeve
- DocPronto

Exploratório:
- Riot Legacy

Saída esperada:
- ambos SaaS com fluxo principal funcional, backend integrado, QA e deploy;
- Riot Legacy com protótipo visual navegável e arquitetura de dados decidida.

### Lote 2 — provar diferenciais

- Riot Legacy passa para implementação pesada;
- VagaCerta entra como segundo projeto;
- LoL Match Story fica como protótipo exploratório.

### Lote 3 — produtos compartilháveis / aquisição orgânica

- LoL Match Story
- TFT Wrapped
- PostPilot

### Lote 4 — monetização e intenção de compra

- MontaPC
- Revisa
- GameRadar

### Lote 5 — expansão gamer P1

- LoL Champion Journey
- TFT Board Museum
- LoL Session Insights
- TFT Augment Memory
- OW VOD Timeline
- LoL Champion Pool
- TFT Item Lab
- OW Map Master

### Lote 6 — P2

Executar conforme ranking oficial e reaproveitamento técnico:
- FalaPro
- TFT Placement DNA
- LoL Loss Explorer
- TFT Comp Evolution
- OW Scrim Manager
- LoL Role Mastery
- TFT Meta Journal
- OW Improvement Roadmap
- LoL Challenge Hub
- OW Hero Pool Builder
- TFT Unit Journey
- LoL Comeback Index
- OW Hero Journal

### Lote 7 — P3

Somente depois de os lotes anteriores terem MVPs ou quando algum puder ser entregue muito rapidamente:
- TFT Economy Review
- OW Replay Notes
- LoL Lane Lab
- OW Ultimate Lab
- LoL Death Map
- TFT Match Timeline
- OW Teamfight Review
- OW Crosshair Lab
- PratoPronto
- Perto

## Pipeline obrigatório de cada repositório

### Fase 1 — auditoria

1. Ler README e árvore do projeto.
2. Identificar stack, dependências e branch principal.
3. Rodar build/lint/testes existentes.
4. Mapear telas, rotas, banco, API, autenticação e deploy.
5. Registrar bugs críticos e lacunas.

### Fase 2 — produto e UX/UI

1. Definir persona e problema principal.
2. Garantir que o usuário entenda a proposta em poucos segundos.
3. Definir o fluxo principal e remover distrações.
4. Revisar desktop e mobile.
5. Criar estados vazios, loading, erro e sucesso.
6. Revisar acessibilidade básica.
7. Definir posições de anúncios para desktop/mobile sem atrapalhar o fluxo principal.

### Fase 3 — frontend

1. Estruturar componentes e rotas.
2. Implementar o fluxo principal.
3. Responsividade.
4. Formulários e validações.
5. Tratamento de erros.
6. Performance básica.

### Fase 4 — backend e dados

1. Definir modelo de dados.
2. Criar migrations quando necessárias.
3. Implementar API/serviços.
4. Autenticação/autorização.
5. Policies/RLS quando aplicável.
6. Logs e tratamento de erros.
7. Nunca expor secrets no frontend.

### Fase 5 — integração fullstack

1. Fluxos reais ponta a ponta.
2. Persistência.
3. Recuperação de sessão.
4. Erros de rede.
5. Dados vazios e inconsistentes.
6. Loading e retry.

### Fase 6 — QA

Obrigatório validar:
- caminho feliz;
- entradas inválidas;
- usuário não autenticado;
- permissões;
- mobile;
- desktop;
- refresh e navegação direta por URL;
- erro de backend;
- banco vazio;
- duplicidade de ações;
- regressão do fluxo principal.

Bug P0/P1 bloqueia publicação.

### Fase 7 — SEO / compartilhamento

Quando aplicável:
- title e description;
- canonical;
- Open Graph;
- favicon/manifest;
- sitemap/robots;
- headings semânticos;
- URLs legíveis;
- conteúdo indexável real, sem páginas vazias.

### Fase 8 — deploy e documentação

1. Build de produção limpo.
2. CI verde.
3. Deploy acessível.
4. README com setup, envs e arquitetura.
5. `.env.example` sem segredos.
6. Backlog V2.
7. Atualizar o hub com status e URL.

## Gate de saída do foco principal

Um projeto só sai da implementação pesada quando:

- [ ] fluxo principal funciona ponta a ponta;
- [ ] frontend e backend conversam com dados reais ou fallback claramente identificado;
- [ ] mobile utilizável;
- [ ] loading/vazio/erro/sucesso implementados;
- [ ] autenticação e permissões testadas, se aplicável;
- [ ] QA crítico concluído;
- [ ] nenhum bug P0/P1 conhecido;
- [ ] build/CI sem erro;
- [ ] deploy funcional;
- [ ] slots de anúncio previstos e validados sem prejudicar UX, quando aplicável ao estágio do produto;
- [ ] README atualizado;
- [ ] backlog V2 registrado.

## Definition of Done por severidade

- **P0 — bloqueador:** quebra o fluxo principal, perde dados ou cria risco de segurança. Corrigir imediatamente.
- **P1 — crítico:** funcionalidade central incorreta ou mobile inutilizável. Corrigir antes de publicar.
- **P2 — importante:** prejudica UX, performance, SEO ou clareza. Corrigir no ciclo atual quando possível.
- **P3 — melhoria:** refinamento visual, conveniência ou expansão. Pode ir para V2.

## Rotina de trabalho

Para cada sessão:

1. retomar exatamente do último commit/estado;
2. revisar o que já existe antes de escrever código;
3. corrigir bloqueadores encontrados;
4. implementar a próxima fatia vertical completa;
5. testar;
6. commitar com mensagem clara;
7. atualizar status no hub somente quando houver mudança real de estado.

Evitar grandes refactors sem necessidade. Priorizar fatias completas que o usuário já possa testar.

## Estado observado em 2026-10-06

A conta GitHub possui atualmente **52 repositórios visíveis**. O lote de criação das 41 ideias foi parcialmente executado e parou durante a criação do `ow-teamfight-review` por secondary rate limit do GitHub.

Já aparecem, entre outros, repositórios novos como:

- `ow-hero-pool-builder`
- `lol-challenge-hub`
- `tft-unit-journey`
- `ow-hero-journal`
- `lol-comeback-index`
- `ow-scrim-manager`
- `tft-comp-evolution`
- `lol-role-mastery`
- `ow-improvement-roadmap`
- `tft-meta-journal`

Portanto, documentos antigos que ainda marcam esses projetos como “pendentes” devem ser considerados desatualizados até o saneamento do Lote 0.

## Próxima ação

1. terminar o saneamento do inventário;
2. não tentar criar vários repositórios em sequência enquanto o GitHub estiver aplicando secondary rate limit;
3. iniciar desenvolvimento pesado por **AgendaLeve + DocPronto**;
4. manter **Riot Legacy** como protótipo exploratório;
5. concluir cada gate antes de puxar o próximo item da fila.
