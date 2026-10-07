# Prioridade de desenvolvimento — Ideias IA Lab

Atualizado em 2026-10-07.

Este arquivo define a **ordem oficial de desenvolvimento do portfólio**. O `ideias-ia-lab` continua sendo apenas o hub de organização: cada produto deve ter seu próprio repositório.

## Política de monetização do portfólio

**Todos os projetos desta fila serão monetizados por anúncios.**

A publicidade é a camada comum de monetização dos 41 produtos. Modelos citados nesta lista — como assinatura, afiliados, créditos, premium ou B2B — devem ser interpretados como **receitas complementares**, não como substitutos dos anúncios.

Na prática:

- todo MVP deve nascer preparado para receber anúncios;
- UX/UI deve prever slots adequados para desktop e mobile;
- retenção, conteúdo útil, SEO e retorno do usuário ganham peso porque sustentam inventário publicitário saudável;
- anúncios não podem atrapalhar o fluxo principal nem incentivar cliques acidentais;
- a ativação da rede de anúncios depende de o produto estar publicado, com conteúdo e políticas adequadas.

## Política de idiomas do portfólio

**Todos os 41 produtos devem oferecer PT-BR e inglês.**

- **PT-BR é o idioma principal, padrão e fallback**;
- inglês é o segundo idioma obrigatório;
- todo MVP deve possuir seletor de idioma e persistência da preferência quando possível;
- fluxos críticos, mensagens e estados da interface precisam de paridade nos dois idiomas;
- responsividade deve ser validada também com textos em inglês;
- produtos indexáveis devem considerar SEO localizado;
- nenhuma prioridade ou modelo de negócio elimina essa regra.

## Critérios usados

A ordem combina quatro fatores:

1. **Proximidade de lançamento** — quanto do produto já existe e pode ser colocado no ar rapidamente.
2. **Potencial de receita/uso** — potencial de tráfego, retenção e inventário de anúncios, além de receitas complementares, recorrência e tamanho do problema.
3. **Diferencial** — quanto a ideia se destaca de alternativas existentes.
4. **Risco técnico/comercial** — dependência de APIs, dados, marketplace bilateral ou infraestrutura pesada.

## Fila oficial

| # | Projeto | Área | Prioridade | Motivo principal | Repositório/status |
|---:|---|---|---|---|---|
| 1 | **AgendaLeve** | SaaS | P0 | MVP técnico concluído; agora validar uso real | [MVP concluído · issue pós-MVP](https://github.com/HelioConde/agendaleve/issues/1) |
| 2 | **DocPronto** | SaaS | P0 | MVP técnico concluído; agora homologação humana | [MVP concluído · issue pós-MVP](https://github.com/HelioConde/docpronto/issues/1) |
| 3 | **Riot Legacy** | LoL + TFT | P0 | MVP técnico fechado; diferencial visual/nostálgico validado tecnicamente | [MVP concluído · validação/compliance](https://github.com/HelioConde/riot-legacy/issues/1) |
| 4 | **VagaCerta** | Carreira | P0 | Quatro diferenciais implementados; falta migration/RLS/QA publicado | [gate de validação](https://github.com/HelioConde/vagacerta/issues/1) |
| 5 | **LoL Match Story** | LoL | P0 | MVP 1.0 concluído; agora validar uso real | [MVP concluído · validação](https://github.com/HelioConde/lol-match-story/issues/1) |
| 6 | **TFT Wrapped** | TFT | P0 | Backend real/PNG/E2E implementados; falta fechar QA/Pages real | [gate final](https://github.com/HelioConde/tft-personal-wrapped/issues/1) |
| 7 | **PostPilot** | Criadores | P1 | MVP avançado; falta provedor real e homologação | [gate final](https://github.com/HelioConde/postpilot/issues/8) |
| 8 | **MontaPC** | Hardware | P1 | Núcleo técnico implementado; falta RLS/CI/QA real | [gate de validação](https://github.com/HelioConde/montapc/issues/1) |
| 9 | **LoL Champion Journey** | LoL | P1 | Quase fechado; falta ativar/validar snapshots server-side | [gate final](https://github.com/HelioConde/lol-champion-journey/issues/4) |
| 10 | **TFT Board Museum** | TFT | P1 | MVP técnico concluído; agora validação | [MVP concluído · validação](https://github.com/HelioConde/tft-board-museum/issues/1) |
| 11 | **Revisa** | Educação | P1 | MVP local funcional criado; validar uso real antes de V2 | [MVP funcional · issue de validação](https://github.com/HelioConde/revisa/issues/1) |
| 12 | **LoL Session Insights** | LoL | P1 | MVP funcional com dados Riot reais; falta validação/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/lol-session-insights/issues/1) |
| 13 | **TFT Augment Memory** | TFT | P1 | MVP funcional com histórico Riot real; falta validação/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/tft-augment-memory/issues/1) |
| 14 | **OW VOD Timeline** | Overwatch | P1 | MVP local funcional para revisão por timestamps; falta validação/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/ow-vod-timeline/issues/1) |
| 15 | **GameRadar** | Games | P1 | MVP funcional com ofertas e preço-alvo local; falta validação/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/gameradar/issues/1) |
| 16 | **LoL Champion Pool** | LoL | P1 | MVP funcional com histórico Riot real e pool salvo; falta validação/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/lol-champion-pool/issues/1) |
| 17 | **TFT Item Lab** | TFT | P1 | MVP funcional; validar dados reais/Pages | [MVP funcional · issue de validação](https://github.com/HelioConde/tft-item-lab/issues/1) |
| 18 | **OW Map Master** | Overwatch | P1 | MVP funcional; validar Pages/uso real | [MVP funcional · issue de validação](https://github.com/HelioConde/ow-map-master/issues/1) |
| 19 | **FalaPro** | Carreira | P2 | MVP funcional; validar sync/voz/uso real | [MVP funcional · issue de validação](https://github.com/HelioConde/falapro/issues/1) |
| 20 | **TFT Placement DNA** | TFT | P2 | Próximo foco pesado; perfil pessoal por colocação | [HelioConde/tft-placement-dna](https://github.com/HelioConde/tft-placement-dna) |
| 21 | **LoL Loss Explorer** | LoL | P2 | Agrupa derrotas e padrões recorrentes | `HelioConde/lol-loss-explorer` — pendente |
| 22 | **TFT Comp Evolution** | TFT | P2 | Mostra evolução pessoal de comps entre partidas e patches | `HelioConde/tft-comp-evolution` — pendente |
| 23 | **OW Scrim Manager** | Overwatch | P2 | Bom B2B/team utility, porém público menor | `HelioConde/ow-scrim-manager` — pendente |
| 24 | **LoL Role Mastery** | LoL | P2 | Árvore visual de evolução por função | `HelioConde/lol-role-mastery` — pendente |
| 25 | **TFT Meta Journal** | TFT | P2 | Diário pessoal de comps, notas e resultados | `HelioConde/tft-meta-journal` — pendente |
| 26 | **OW Improvement Roadmap** | Overwatch | P2 | Plano estruturado de melhoria por objetivo | `HelioConde/ow-improvement-roadmap` — pendente |
| 27 | **LoL Challenge Hub** | LoL | P2 | Reorganiza Challenges em metas e coleções | `HelioConde/lol-challenge-hub` — pendente |
| 28 | **OW Hero Pool Builder** | Overwatch | P2 | Monta pool complementar por função/mapa/preferência | `HelioConde/ow-hero-pool-builder` — pendente |
| 29 | **TFT Unit Journey** | TFT | P2 | Jornada pessoal de cada unidade | `HelioConde/tft-unit-journey` — pendente |
| 30 | **LoL Comeback Index** | LoL | P2 | Identifica padrões das partidas que o jogador consegue virar | `HelioConde/lol-comeback-index` — pendente |
| 31 | **OW Hero Journal** | Overwatch | P2 | Diário de evolução por herói | `HelioConde/ow-hero-journal` — pendente |
| 32 | **TFT Economy Review** | TFT | P3 | Interessante, mas depende de boa reconstrução de contexto | `HelioConde/tft-economy-review` — pendente |
| 33 | **OW Replay Notes** | Overwatch | P3 | Útil, porém mais manual e menos viral | `HelioConde/ow-replay-notes` — pendente |
| 34 | **LoL Lane Lab** | LoL | P3 | Bom para nicho competitivo, menor apelo casual | `HelioConde/lol-lane-lab` — pendente |
| 35 | **OW Ultimate Lab** | Overwatch | P3 | Conteúdo educacional útil, mas facilmente replicável | `HelioConde/ow-ultimate-lab` — pendente |
| 36 | **LoL Death Map** | LoL | P3 | Visual interessante, mas menor proposta de produto isolado | `HelioConde/lol-death-map` — pendente |
| 37 | **TFT Match Timeline** | TFT | P3 | Forte visualmente, porém exige dados/checkpoints extras | `HelioConde/tft-match-timeline` — pendente |
| 38 | **OW Teamfight Review** | Overwatch | P3 | Valor alto, mas reconstrução de lutas é tecnicamente mais cara | `HelioConde/ow-teamfight-review` — pendente |
| 39 | **OW Crosshair Lab** | Overwatch | P3 | Fácil de lançar, mas pouco defensável como produto sozinho | `HelioConde/ow-crosshair-lab` — pendente |
| 40 | **PratoPronto** | Consumo | P3 | Mercado amplo, porém diferenciação e monetização mais fracas | `HelioConde/pratopronto` — pendente |
| 41 | **Perto** | Marketplace | P3 | Potencial alto, mas exige oferta + demanda, reputação e moderação | `HelioConde/perto` — pendente |

## Atualização operacional — 07/10/2026

O **VagaCerta saiu da implementação pesada de features**: compatibilidade explicada, currículos versionados, follow-up e preparação de entrevista já estão no GitHub. O restante do gate é aplicar migration/RLS e confirmar QA/Pages. Enquanto isso, o MontaPC também fechou seu núcleo técnico e entrou em validação. O próximo foco pesado avança para **TFT Item Lab**.

## P0 — estado atual

### 1. AgendaLeve
**MVP técnico concluído.** Desenvolvimento principal pausado; validação humana/externa segue na issue #1 do repositório.

### 2. DocPronto
**MVP técnico concluído.** Desenvolvimento principal pausado; homologação humana segue na issue #1 do repositório.

### 3. Riot Legacy
**MVP técnico concluído em 07/10/2026; saiu da implementação pesada e entrou em validação/compliance.** O protótipo standalone já possui landing, LoL + TFT reais via backend gamer, fallback demonstrativo explícito, PT-BR/EN, timeline recente, refresh, compartilhamento/PNG, anúncios preparados, Static QA e Browser E2E.

A proposta é uma experiência visual, emocional e compartilhável:

- usuário informa Riot ID;
- entrada com apresentação cinematográfica do perfil;
- LoL: maestria, campeão assinatura, melhores campeões, funções, marcos e evolução;
- TFT: comps, unidades, traits, augments, colocações e retrospectiva;
- páginas bonitas focadas em identidade, nostalgia e esforço acumulado;
- cards e retrospectivas compartilháveis;
- temas visuais e perfil público como caminho de monetização.

O objetivo não é ser apenas mais um tracker. O usuário deve entrar para **rever sua história** e querer permanecer na página.

### 4. VagaCerta
**Quatro diferenciais implementados.** O projeto está em validação de migration/RLS/QA e não recebe novas features até fechar esse gate.

### 5. LoL Match Story
**MVP 1.0 tecnicamente concluído em 07/10/2026.** Features congeladas; seguir apenas com validação real, AdSense externo e correções P0/P1.

### 6. TFT Wrapped
Backend TFT real, períodos, agregações, PNG, E2E e workflows foram implementados em 07/10/2026. Falta confirmar CI/Pages e Riot IDs reais antes de marcar o MVP 1.0 como concluído.

## Regra para iniciar um novo projeto

Antes de mover para o próximo item da fila, o projeto atual deve cumprir pelo menos:

- MVP navegável;
- fluxo principal funcional;
- mobile utilizável;
- autenticação/dados quando necessários;
- QA dos fluxos críticos;
- README próprio;
- deploy funcional;
- layout preparado para anúncios sem prejudicar o fluxo principal;
- PT-BR e inglês disponíveis, com PT-BR como idioma principal;
- backlog explícito para V2.

**AgendaLeve e DocPronto já cumpriram este gate em 06/10/2026 e liberaram o WIP para o próximo projeto.**

Não é necessário transformar cada projeto em produto completo antes de testar o próximo. A meta é **validar o menor produto realmente utilizável**.

## Organização de infraestrutura

- Produtos gerais do laboratório: backend compartilhado conforme a arquitetura definida para o portfólio.
- Projetos de jogos/Riot: manter infraestrutura separada da linha de SaaS geral e reutilizar componentes/dados comuns apenas quando fizer sentido.
- `ideias-ia-lab`: documentação, ranking, decisões e links. **Sem frontend/backend de produto na main.**

## Quando revisar esta ordem

Reordenar a fila quando ocorrer qualquer um destes eventos:

- um MVP conseguir usuários reais;
- surgir receita;
- uma API/plataforma bloquear ou liberar uma funcionalidade importante;
- um projeto ficar muito próximo de lançamento;
- dados mostrarem demanda significativamente maior que a estimada;
- uma ideia passar a reaproveitar infraestrutura já pronta de outro produto.
