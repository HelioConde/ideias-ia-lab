# Painel de execução — Ideias IA Lab

Atualizado em 2026-10-07.

Este arquivo define a **ordem operacional atual**. A classificação estratégica dos 41 produtos continua em `PRIORIDADES_DESENVOLVIMENTO.md`, mas a execução deve primeiro fechar os produtos que já estão próximos do gate de saída.

## Fila de fechamento atual — ordem obrigatória

| Ordem | Projeto | Estado em 07/10/2026 | Próxima ação |
|---:|---|---|---|
| 1 | **LoL Match Story** | ✅ MVP 1.0 tecnicamente concluído | validação real na issue #1; features congeladas |
| 2 | **TFT Board Museum** | ✅ MVP tecnicamente concluído | validação pós-MVP na issue #1; features congeladas |
| 3 | **AgendaLeve** | ✅ MVP publicado | somente teste humano/configuração externa na issue #1 |
| 4 | **DocPronto** | ✅ MVP publicado | somente homologação humana na issue #1 |
| 5 | **PostPilot** | 🟡 gate final | ativar provedores reais + homologação na issue #8; não criar novas telas |
| 6 | **LoL Champion Journey** | 🟡 gate final de infraestrutura | aplicar migration/redeploy de snapshots no Supabase gamer e validar a issue #4 |
| 7 | **Riot Legacy** | ✅ MVP técnico concluído | validação multi-conta + Riot Developer Portal na issue #1; histórico maior fica para V2 |
| 8 | **Ofertamática** | ✅ núcleo do MVP concluído | QA real de impressão/ERP/AdSense na issue #1; IA oficialmente na V2 |
| 9 | **TFT Wrapped** | 🟡 núcleo real implementado | confirmar QA/Pages e Riot IDs reais na issue #1; depois congelar |
| 10 | **VagaCerta** | 🟡 diferenciais implementados | aplicar migration no `pizzaria-db`, validar RLS/QA/Pages e congelar features |

> **Ofertamática não faz parte das 41 ideias do Lab**, mas aparece nesta fila porque está na rodada atual de fechamento do portfólio.

## Produtos que não ocupam mais implementação pesada

- **LoL Match Story** — manutenção/validação.
- **TFT Board Museum** — manutenção/validação.
- **AgendaLeve** — validação pós-MVP.
- **DocPronto** — homologação pós-MVP.
- **Riot Legacy** — validação/compliance antes de qualquer V2.
- **Ofertamática** — núcleo fechado; IA e expansões ficam para V2.
- **VagaCerta** — quatro diferenciais implementados; aguardando migration/RLS/QA/Pages antes do encerramento.

Esses projetos só voltam para implementação por:

- bug P0/P1;
- segurança/compliance;
- mudança de API/plataforma;
- feedback real com evidência;
- decisão explícita de V2.

## Gates curtos ainda abertos

### PostPilot

Não falta outra rodada de UX. Falta:

1. provedor real de IA;
2. provedor real de transcrição;
3. upload → transcrição → cortes → pacote com serviço real;
4. quotas/rate limits;
5. autenticação humana;
6. E2E/axe/Lighthouse/snapshots depois das credenciais.

Acompanhamento: `HelioConde/postpilot#8`.

### LoL Champion Journey

As correções de GitHub para histórico durável já foram aplicadas:

- frontend usa `/champion-journey-history` por padrão;
- ZeroTwo define `verify_jwt = false` para o preflight da função;
- migration `20261007_champion_journey_snapshots.sql` está versionada no ZeroTwo.

Falta aplicar/republicar no Supabase gamer e validar histórico entre sessões/dispositivos.

Acompanhamento: `HelioConde/lol-champion-journey#4`.

### TFT Wrapped

Em 07/10/2026 foram adicionados:

- backend TFT real;
- 7 dias / 30 dias / Set;
- comps/unidades/augments derivados da amostra;
- estados loading/vazio/404/429;
- deep links;
- card PNG;
- Browser E2E;
- workflow QA;
- workflow GitHub Pages;
- smoke test de produção com Riot ID real separado do E2E comum (`Live Riot Smoke`), com screenshot/trace em falha.

Só sai da fila depois de CI/Pages verdes e validação real com múltiplos Riot IDs.

Acompanhamento: `HelioConde/tft-personal-wrapped#1`.


## MVPs leves em validação rápida

Estes produtos recentes já têm o núcleo do MVP e **não devem receber expansão de escopo agora**. Em 07/10/2026 foi adicionado Browser E2E automatizado nos cinco repositórios abaixo; o que resta é publicar/validar casos reais:

- **LoL Session Insights** — Browser E2E implementado; falta Pages confirmado, 3+ Riot IDs/regiões e validar sessões longas/1 partida + ARAM/Arena/Ranked.
- **TFT Augment Memory** — Browser E2E implementado; falta Pages confirmado, 3+ Riot IDs, poucos jogos, nomes reais de augments e 404/429/timeout.
- **OW VOD Timeline** — Browser E2E implementado; falta Pages confirmado, MP4/WebM real, VOD longo, import/export e revisão publicada.
- **GameRadar** — Browser E2E implementado; falta Pages confirmado, CORS/retorno CheapShark em produção, buscas/links reais e preços-alvo.
- **LoL Champion Pool** — Browser E2E implementado; falta Pages confirmado, 3+ Riot IDs/regiões, pouco histórico, funções separadas e 404/429/timeout.
- **Revisa** — núcleo local e QA estático concluídos; falta Pages confirmado, validação visual publicada e teste com usuários reais.

Esses itens podem andar em paralelo como **validação**, sem consumir uma vaga de implementação pesada da regra de WIP.

## VagaCerta — gate de validação

Os quatro diferenciais foram implementados em 07/10/2026, junto com migration versionada, Browser E2E, QA e workflow de Pages. O projeto não recebe novas features agora.

Falta:

1. aplicar a migration no `pizzaria-db`;
2. validar sincronização em duas contas/dispositivos;
3. validar RLS A ≠ B;
4. confirmar Browser E2E/mobile/teclado e Pages verdes.

Acompanhamento: `HelioConde/vagacerta#1`.

## MontaPC — gate de validação

Em 07/10/2026 foram fechados no GitHub:

- catálogo real de 65 componentes + snapshot offline;
- Browser E2E desktop/mobile;
- QA GitHub Actions;
- compatibilidade avançada;
- explicação por peça;
- alternativas equivalentes;
- ação de economia preservando desempenho;
- comparação, desempenho, PWA/SEO/analytics;
- patch de hardening RLS/grants versionado.

Falta apenas aplicar/validar o hardening no `pizzaria-db`, Auth/RLS com duas contas e confirmar Actions/Pages verdes.

## TFT Item Lab — gate de validação

MVP funcional implementado em 07/10/2026: histórico pessoal de itens, unidades, média/Top 4, 7D/30D/Set, PT-BR/EN, Browser E2E desktop/mobile, Pages e Live Riot Smoke.

Falta confirmar Actions/Pages e payload real com múltiplos Riot IDs. Features V2 ficam congeladas.

## Próximo desenvolvimento pesado — OW Map Master

Próximo P1 da fila oficial. O MVP deve ser conteúdo visual/evergreen por mapa e modo, com filtros, objetivos, pontos de atenção e guia bilíngue; sem depender de API externa para funcionar.

## Regra de WIP

- máximo de **2 produtos em implementação pesada**;
- até **1 protótipo exploratório**;
- validação humana/credenciais externas não contam como nova frente pesada;
- projeto tecnicamente fechado não recebe refinamento visual infinito;
- uma nova feature só entra quando houver evidência de necessidade.

## Gate para passar ao próximo produto

- [ ] proposta de valor clara;
- [ ] fluxo principal ponta a ponta;
- [ ] desktop e mobile utilizáveis;
- [ ] loading/vazio/erro/sucesso;
- [ ] persistência quando necessária;
- [ ] autenticação/permissões quando necessárias;
- [ ] QA crítico;
- [ ] CI verde;
- [ ] deploy funcional;
- [ ] PT-BR/EN;
- [ ] monetização preparada sem bloquear UX;
- [ ] README/backlog atualizados;
- [ ] nenhum P0/P1 conhecido.

Quando o gate estiver completo: **parar de adicionar features e passar ao próximo**.
