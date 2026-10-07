# Status do portfólio

Atualizado em 2026-10-07.

## Estrutura

O `ideias-ia-lab` é somente o hub de organização. Frontend, backend, migrations e configuração de produto ficam nos repositórios independentes.

## Repositórios confirmados nesta rodada

| Projeto | Repositório | Estado |
|---|---|---|
| AgendaLeve | `HelioConde/agendaleve` | MVP publicado · validação pós-MVP |
| DocPronto | `HelioConde/docpronto` | MVP publicado · homologação pós-MVP |
| PostPilot | `HelioConde/postpilot` | gate final de provedores/homologação |
| Riot Legacy | `HelioConde/riot-legacy` | MVP técnico concluído · validação/compliance |
| VagaCerta | `HelioConde/vagacerta` | 4 diferenciais implementados · migration/RLS/QA em validação |
| LoL Match Story | `HelioConde/lol-match-story` | MVP 1.0 concluído · validação |
| TFT Wrapped | `HelioConde/tft-personal-wrapped` | backend real/PNG/E2E implementados · gate final |
| MontaPC | `HelioConde/montapc` | núcleo técnico implementado · validação/RLS/CI |
| LoL Champion Journey | `HelioConde/lol-champion-journey` | gate final de snapshots |
| TFT Board Museum | `HelioConde/tft-board-museum` | MVP técnico concluído · validação |
| Revisa | `HelioConde/revisa` | MVP funcional · validação/Pages |
| LoL Session Insights | `HelioConde/lol-session-insights` | MVP funcional · Browser E2E adicionado · validação/Pages |
| TFT Augment Memory | `HelioConde/tft-augment-memory` | MVP funcional · Browser E2E adicionado · validação/Pages |
| OW VOD Timeline | `HelioConde/ow-vod-timeline` | MVP funcional · Browser E2E adicionado · validação/Pages |
| GameRadar | `HelioConde/gameradar` | MVP funcional · Browser E2E adicionado · validação/Pages |
| LoL Champion Pool | `HelioConde/lol-champion-pool` | MVP funcional · Browser E2E adicionado · validação/Pages |
| TFT Item Lab | `HelioConde/tft-item-lab` | MVP funcional · QA/E2E/Pages · validação real |
| OW Map Master | `HelioConde/ow-map-master` | MVP funcional · QA/E2E/Pages · validação publicada |

## Produtos tecnicamente fechados

- **AgendaLeve** — issue #1 contém somente validação humana/configuração externa.
- **DocPronto** — issue #1 contém somente homologação humana.
- **LoL Match Story** — MVP 1.0 fechado; issue #1 é pós-MVP.
- **TFT Board Museum** — MVP fechado; issue #1 é pós-MVP.
- **Riot Legacy** — MVP técnico fechado; issue #1 concentra validação multi-conta e Riot Developer Portal.

Esses projetos não devem voltar para implementação pesada por refinamento visual.

## Gates finais ainda abertos

### PostPilot

Issue #8:
- provedores reais de IA/transcrição;
- fluxo completo com serviços reais;
- quotas;
- autenticação humana;
- E2E/axe/Lighthouse/Visual Snapshot final.

### LoL Champion Journey

Issue #4:
- migration de snapshots já versionada no ZeroTwo;
- endpoint remoto habilitado no frontend;
- preflight configurado com `verify_jwt = false`;
- falta aplicar/republicar no Supabase gamer e validar histórico entre sessões/dispositivos.

### TFT Wrapped

Issue #1:
- integração TFT real implementada;
- períodos e agregações implementados;
- PNG implementado;
- Browser E2E e workflow QA implementados;
- Live Riot Smoke separado do E2E comum foi adicionado para testar a versão publicada com Riot ID real;
- o resultado do workflow novo ainda precisa ser confirmado no GitHub Actions;
- GitHub Pages precisa estar habilitado/configurado para concluir o deploy;
- falta rodada com Riot IDs reais.


## MVPs leves próximos do fechamento

Em 07/10/2026 foi adicionado Browser E2E automatizado a:

- `lol-session-insights`;
- `tft-augment-memory`;
- `ow-vod-timeline`;
- `gameradar`;
- `lol-champion-pool`.

O restante desses projetos é majoritariamente validação publicada/real: GitHub Pages, APIs externas quando aplicável, múltiplos Riot IDs, arquivos de vídeo reais ou fluxos de compra/links reais. **Não abrir V2 antes de fechar esses gates.**

## VagaCerta — gate atual

Os quatro diferenciais estão implementados, junto com Browser E2E, workflows QA/Pages e migration versionada. Falta aplicar a migration no `pizzaria-db`, validar RLS A ≠ B, sincronização entre dispositivos e confirmar CI/Pages verdes.

## MontaPC — gate atual

Núcleo técnico implementado: 65 componentes, fallback offline, compatibilidade avançada, explicabilidade por peça, alternativas equivalentes, comparação, PWA e Browser E2E. Falta aplicar o patch RLS/grants, validar duas contas e confirmar CI/Pages.

## TFT Item Lab

`HelioConde/tft-item-lab` agora possui MVP funcional, QA/E2E, Pages e issue de validação. Fica congelado até validar dados reais.

## OW Map Master

`HelioConde/ow-map-master` agora possui MVP funcional, QA/E2E, Pages e issue de validação. Fica congelado até validação publicada.

## Próximo foco pesado

**FalaPro** — repositório `HelioConde/falapro` é o próximo projeto com desenvolvimento pesado.

## Branches `split/*`

As branches `split/*` são histórico de empacotamento e **não são fonte atual de status** quando o repositório físico já existe.

Antes de executar qualquer script de criação, verificar se `HelioConde/<repo>` já existe e preservar a `main` existente.

## Backend

- produtos gerais/SaaS: infraestrutura compartilhada, incluindo `pizzaria-db` quando aplicável;
- produtos Riot/TFT: Supabase gamer do ZeroTwo.gg (`bieihhaobdztjyoweewa`);
- Riot API keys e service-role ficam exclusivamente no backend;
- nenhum projeto gamer deve usar `pizzaria-db` como fallback.

## Fonte operacional

- `PRIORIDADES_DESENVOLVIMENTO.md` — ranking estratégico;
- `PAINEL_EXECUCAO.md` — ordem operacional/fechamento;
- `PLANO_MESTRE_FULLSTACK.md` — gates e processo.

A regra continua: **terminou o gate técnico, congela features e passa ao próximo**.
