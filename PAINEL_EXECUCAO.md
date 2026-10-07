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
| 10 | **VagaCerta** | 🔵 próximo foco pesado | implementar os quatro diferenciais definidos na issue #1 |

> **Ofertamática não faz parte das 41 ideias do Lab**, mas aparece nesta fila porque está na rodada atual de fechamento do portfólio.

## Produtos que não ocupam mais implementação pesada

- **LoL Match Story** — manutenção/validação.
- **TFT Board Museum** — manutenção/validação.
- **AgendaLeve** — validação pós-MVP.
- **DocPronto** — homologação pós-MVP.
- **Riot Legacy** — validação/compliance antes de qualquer V2.
- **Ofertamática** — núcleo fechado; IA e expansões ficam para V2.

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
- workflow GitHub Pages.

Só sai da fila depois de CI/Pages verdes e teste real com Riot IDs.

Acompanhamento: `HelioConde/tft-personal-wrapped#1`.

## Próximo desenvolvimento pesado — VagaCerta

A fundação fullstack já existe. O próximo ciclo fica **travado nestes quatro diferenciais**, nesta ordem:

1. compatibilidade explicada por requisito;
2. currículo personalizado por candidatura;
3. follow-up com fila de pendências;
4. preparação de entrevista vinculada à candidatura.

Importação automática de URL, novas automações e IA generativa vêm **depois** desse gate.

Acompanhamento: `HelioConde/vagacerta#1`.

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
