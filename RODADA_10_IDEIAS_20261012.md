# Rodada de fechamento — 10 ideias originais

**Atualizada:** 12/10/2026 (horário de Brasília).  
**Ordem:** esta é a sequência das 10 ideias iniciais de monetização; não substitui o ranking das 41 ideias em `PRIORIDADES_DESENVOLVIMENTO.md` nem o WIP de `PAINEL_EXECUCAO.md`.

## Ordem e status verificado

| # | Produto | Repositório ou branch | Resultado desta rodada | Próximo gate obrigatório |
|---:|---|---|---|---|
| 1 | PostPilot | [postpilot](https://github.com/HelioConde/postpilot) | Policy `postpilot_outputs` reforçada no banco, vinculando saída e projeto ao mesmo proprietário. Migration versionada e aplicada. QA estático/Pages verdes. | Teste Auth A≠B com duas contas reais e provedores IA/transcrição + upload/cortes real; NÃO abrir beta público antes disso |
| 2 | VagaCerta | [vagacerta](https://github.com/HelioConde/vagacerta) | Migration de produto aplicada; guard RESTRICTIVE de documento/candidatura aplicado; tradução corrigida; Browser E2E aprovado; caches de outros sites preservados. | Habilitar GitHub Pages no repositório; validar sincronização/Auth e RLS com duas contas reais |
| 3 | FalaPro | [falapro](https://github.com/HelioConde/falapro) | Guard RESTRICTIVE resposta/sessão aplicado e verificado; cache global corrigido; QA verde; Pages depende da configuração inicial | Habilitar GitHub Pages; testes humanos de autenticação e voz Android/desktop |
| 4 | MontaPC | [montapc](https://github.com/HelioConde/montapc) | MVP anterior concluído; Browser E2E 14/14 e Pages verde em 09/10; segurança do banco já aplicada | Validar duas contas e builds reais; sem V2 |
| 5 | GameRadar | [gameradar](https://github.com/HelioConde/gameradar) | Browser E2E/Static QA verdes; cache corrigido; Pages não habilitado. Live API Smoke não encontra elemento da página publicada | Habilitar Pages antes de concluir testes reais da CheapShark, CORS, links e preços-alvo |
| 6 | AgendaLeve | [agendaleve](https://github.com/HelioConde/agendaleve) | MVP publicado; Static QA/Browser E2E/Pages verdes em 09/10 | Homologação humana e integrações externas; features congeladas |
| 7 | Perto | [split/perto](https://github.com/HelioConde/ideias-ia-lab/tree/split/perto) | Segurança reforçada, reaprovação ao editar perfis, painel administrativo com RPC protegida/auditoria, PT/EN e QA desktop/mobile aprovado; Supabase migrado | Criar `HelioConde/perto`, ativar Pages, atribuir moderador autorizado e homologar com duas contas reais |
| 8 | PratoPronto | [split/pratopronto](https://github.com/HelioConde/ideias-ia-lab/tree/split/pratopronto) | Guards RESTRICTIVE aplicados: refeições e lista de compras pertencem ao plano do usuário | Criar repositório físico `HelioConde/pratopronto`, importar branch, ativar Pages, QA e duas contas |
| 9 | Revisa | [revisa](https://github.com/HelioConde/revisa) | Browser E2E/Static QA anteriores verdes; cache corrigido; workflow de Pages com diagnóstico explícito | Ativar Pages em Settings > Pages e validar site publicado/usabilidade |
| 10 | DocPronto | [docpronto](https://github.com/HelioConde/docpronto) | MVP publicado; Quality Checks, Static QA e Pages verdes em 09/10; backend já passou homologações documentadas | Beta com pessoas/negócios reais; sem expansão de escopo |

## Alterações confirmadas no banco `pizzaria-db`

- **PostPilot:** `postpilot_outputs_project_owner_rls`
- **VagaCerta:** `vagacerta_product_gate` e `vagacerta_documents_application_owner_guard`
- **FalaPro:** `falapro_answers_session_owner_guard`
- **Perto:** `perto_requests_active_professional_guard` (migration na branch `split/perto`)
- **PratoPronto:** `pratopronto_meal_shopping_plan_owner_guard` (migration na branch `split/pratopronto`)

As consultas a `pg_policies` confirmaram a instalação dos novos guards. **Isso não substitui um teste ponta a ponta de Auth/RLS com duas identidades reais**.

## Bloqueios de publicação e regra para continuar

Nos projetos **VagaCerta, FalaPro, GameRadar e Revisa**, habilitar manualmente GitHub Pages em **Settings → Pages → Build and deployment → Source: GitHub Actions**. Os workflows não têm permissão para criar um Pages site automaticamente. Rerodar os deploys após configurar.

**Perto e PratoPronto** estão somente em branches standalone do hub; ainda não têm repositórios físicos. Não desenvolver seus produtos na `main` do `ideias-ia-lab`; manter cada código isolado na branch atual até haver destino independente.

A próxima rodada deve validar **o gate real de cada produto, nessa mesma ordem**, corrigir P0/P1 e congelar quando estiver aprovado. Não anunciar como pronto um beta que dependa de credenciais ou configurações externas não homologadas.

## Atualização aprofundada do Perto (#7) — outubro de 2026

- Corrigido o `UPDATE` de perfil no frontend: não envia mais `user_id`, campo imutável.
- Trigger no banco devolve perfis `active`, `paused` ou `rejected` para `pending` quando dados públicos importantes mudam.
- Novas tabelas `perto_moderators` e `perto_moderation_events`, ambas com RLS e sem leitura direta via browser.
- RPCs protegidas `perto_pending_moderation` e `perto_moderate_profile`, com autorização, bloqueio de autoaprovação e auditoria.
- Painel `admin.html` implementado: login, fila, aprovação/rejeição e justificativa obrigatória para rejeição.
- Não existe moderador pré-configurado; papel atribuído por administrador legítimo no Supabase SQL Editor.
- Testes Playwright desktop/mobile para cadastro, edição, moderação e acesso negado; CI em verde nos commits verificados.
- Guia técnico: [DEPLOY.md](https://github.com/HelioConde/ideias-ia-lab/blob/split/perto/DEPLOY.md).
- Ainda faltam repositório próprio, publicação, permissão de moderação autorizada e teste com duas contas reais.
- **13/10:** acompanhamento de pedidos por RPC restrita ao prestador, com fluxo `new → viewed → contacted → closed`, auditoria interna e traduções PT-BR/EN; cliente apenas cancela.
- **Autenticação:** cadastro e recuperação retornam ao próprio site; incluída tela de nova senha após `PASSWORD_RECOVERY`. A URL precisa estar autorizada na configuração do Supabase após o deploy.
- **QA:** 42 testes Playwright desktop/mobile aprovados em [38342657126](https://github.com/HelioConde/ideias-ia-lab/actions/runs/38342657126); testes simulados não substituem homologação real.
- **Rodada adicional:** banco impede auto-orçamentos e saltos no fluxo de status; frontend oferece filtros Todos/Enviados/Recebidos, atualização segura e erros específicos. Validação SQL confirmou a alteração aplicada. Pendências de publicação e de contas reais permanecem.

- **Fechamento da rodada Perto:** 42 testes Playwright (desktop e mobile) aprovados em [38342657126](https://github.com/HelioConde/ideias-ia-lab/actions/runs/38342657126). Contratos reais de autenticação e RLS com dois usuários continuam pendentes.
