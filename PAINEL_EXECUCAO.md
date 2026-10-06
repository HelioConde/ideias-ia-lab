# Painel de execução — Ideias IA Lab

Atualizado em 2026-10-06.

Este arquivo transforma a fila de prioridades em uma sequência prática de execução.

## Validação pós-MVP

| Projeto | Estado | Acompanhamento |
|---|---|---|
| **AgendaLeve** | MVP técnico concluído / publicado | [Issue #1 — validação humana e configuração externa](https://github.com/HelioConde/agendaleve/issues/1) |
| **DocPronto** | MVP técnico concluído / publicado | [Issue #1 — homologação humana e validação real](https://github.com/HelioConde/docpronto/issues/1) |

Esses dois produtos **não ocupam mais vaga de implementação pesada**. Só voltam ao foco por bug crítico, segurança, feedback real ou decisão explícita.

## Em desenvolvimento / foco imediato

| Ordem | Projeto | Estado | Próxima ação |
|---:|---|---|---|
| 1 | **Riot Legacy** | **Em desenvolvimento** | dados LoL/TFT reais já conectados e QA verde; validar Riot IDs reais, criar snapshots históricos e materializar repo físico |
| 2 | **VagaCerta** | branch standalone pronta | criar repositório físico e publicar |
| 3 | **LoL Match Story** | Ideia priorizada | criar MVP visual usando dados reais quando disponíveis |
| 4 | **TFT Wrapped** | Ideia priorizada | criar retrospectiva mínima compartilhável |
| 5 | **PostPilot** | MVP técnico avançado / evolução leve | P1 concluído, RLS homologado, PWA/offline, feedback, calendário, edição, templates e checklist verdes; falta rodada humana de autenticação e validação com usuários |

## Definição de estados

- **Ideia** — conceito registrado, ainda sem estrutura própria.
- **Priorizada** — entrou na fila oficial.
- **Preparada** — estrutura standalone/escopo já definidos.
- **Em desenvolvimento** — implementação ativa.
- **MVP** — fluxo principal funcional.
- **Em QA** — testes de usabilidade, responsividade, erros e dados.
- **Publicado** — versão utilizável acessível ao público-alvo.
- **Validando** — coletando uso real antes de ampliar o escopo.
- **Pausado** — não é prioridade atual, mas continua no portfólio.

## Gate para passar ao próximo projeto

**AgendaLeve ✅ e DocPronto ✅ já cumpriram este gate e liberaram o WIP em 06/10/2026.**

Um projeto pode deixar de ser foco principal quando cumprir:

- [ ] proposta de valor entendida rapidamente;
- [ ] fluxo principal funcional;
- [ ] interface utilizável no desktop e mobile;
- [ ] estados de loading, vazio, erro e sucesso;
- [ ] dados persistentes quando necessários;
- [ ] QA dos fluxos críticos;
- [ ] README do produto atualizado;
- [ ] deploy funcional;
- [ ] backlog V2 documentado;
- [ ] nenhum bloqueador crítico conhecido.

## Regra de WIP

Para evitar dezenas de produtos incompletos:

- máximo recomendado de **2 produtos principais em implementação pesada**;
- até **1 protótipo exploratório** em paralelo;
- ideias restantes permanecem documentadas, sem expansão desnecessária;
- uma nova ideia pode ser registrada a qualquer momento, mas só entra em execução se subir na fila oficial.

## Próximos blocos

### Bloco A — lançados / validação pós-MVP
1. AgendaLeve — MVP técnico concluído; issue pós-MVP aberta
2. DocPronto — MVP técnico concluído; issue pós-MVP aberta

### Bloco B — provar diferencial gamer — **bloco atual**
> Riot Legacy já possui protótipo standalone em `split/riot-legacy`, mas ainda não possui o repositório físico final. Os demais continuam aguardando materialização.

1. Riot Legacy — **desenvolvimento pesado atual; protótipo standalone validado**
2. LoL Match Story
3. TFT Wrapped

### Bloco C — monetização/uso recorrente
6. VagaCerta
7. PostPilot — P1 técnico concluído; RLS, PWA/offline, calendário, edição, templates, checklist, feedback e Browser E2E verdes; seguir apenas com autenticação humana/validação antes de P2
8. MontaPC

### Bloco D — expansão gamer
9. **TFT Comp Evolution — MVP funcional; comparação, tabuleiro 4x7, import JSON e Static QA concluídos**
10. **OW Hero Pool Builder — MVP funcional; recomendação complementar, pools locais e Static QA concluídos**
11. LoL Champion Journey
12. TFT Board Museum
13. LoL Session Insights
14. TFT Augment Memory
15. OW VOD Timeline

## Regra de revisão

A ordem deve ser revisada quando algum projeto:

- conseguir usuários reais;
- gerar receita;
- tiver uma limitação técnica importante;
- puder ser lançado muito antes do esperado;
- ganhar vantagem clara por reaproveitar infraestrutura existente.
