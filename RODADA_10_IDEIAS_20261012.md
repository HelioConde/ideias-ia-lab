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
| 7 | Perto | [split/perto](https://github.com/HelioConde/ideias-ia-lab/tree/split/perto) | Guard RESTRICTIVE aplicado: novos pedidos de orçamento exigem profissional aprovado/ativo | Criar repositório físico `HelioConde/perto`, importar branch, ativar Pages, testar moderação e usuários |
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
