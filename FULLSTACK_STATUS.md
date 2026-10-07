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
| VagaCerta | `HelioConde/vagacerta` | ativo · próximo foco pesado |
| LoL Match Story | `HelioConde/lol-match-story` | MVP 1.0 concluído · validação |
| TFT Wrapped | `HelioConde/tft-personal-wrapped` | backend real/PNG/E2E implementados · gate final |
| MontaPC | `HelioConde/montapc` | ativo · roadmap amplo |
| LoL Champion Journey | `HelioConde/lol-champion-journey` | gate final de snapshots |
| TFT Board Museum | `HelioConde/tft-board-museum` | MVP técnico concluído · validação |
| Revisa | `HelioConde/revisa` | ativo · estágio inicial |

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
- QA automatizado já passou após a mudança;
- GitHub Pages precisa estar habilitado/configurado para concluir o deploy;
- falta rodada com Riot IDs reais.

## Próximo foco pesado

**VagaCerta**.

Issue #1 define quatro entregas obrigatórias:

1. compatibilidade explicada;
2. currículo personalizado;
3. follow-up;
4. preparação de entrevista.

Importação por URL, IA generativa e automações extras ficam depois desse gate.

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
