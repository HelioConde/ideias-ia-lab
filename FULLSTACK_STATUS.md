# Status fullstack dos 10 produtos

Atualizado em 2026-10-06.

## Backend compartilhado

Projeto Supabase: `pizzaria-db`.

- billing: `product_subscriptions`
- PostPilot: `postpilot_projects`, `postpilot_outputs`
- VagaCerta: `vagacerta_applications`, `vagacerta_documents`
- FalaPro: `falapro_sessions`, `falapro_answers`
- MontaPC: `montapc_components`, `montapc_builds`, `montapc_build_items`
- GameRadar: `gameradar_games`, `gameradar_offers`, `gameradar_wishlist`, `gameradar_custom_alerts`
- AgendaLeve: `agendaleve_businesses`, `agendaleve_business_hours`, `agendaleve_services`, `agendaleve_bookings`, `agendaleve_booking_rate_limits`
- Perto: `perto_professionals`, `perto_requests`
- PratoPronto: `pratopronto_plans`, `pratopronto_meals`, `pratopronto_shopping_items`
- Revisa: `revisa_goals`, `revisa_questions`, `revisa_attempts`
- DocPronto: `docpronto_clients`, `docpronto_documents`, `docpronto_items`, `docpronto_proposals`

As tabelas novas usam RLS. Catálogos públicos têm leitura anônima somente onde necessário.

## Repositórios dedicados

### PostPilot
- autenticação Supabase;
- modo local sem conta;
- sincronização de projetos;
- importação local → nuvem;
- histórico e exclusão protegidos por RLS;
- SEO e CI;
- GitHub Pages validado.

### AgendaLeve
- três modos: local, painel autenticado e reserva pública;
- serviços/expediente/agenda sincronizados;
- link `?negocio=slug`;
- Edge Function `create-booking`;
- Edge Function `booking-availability`;
- prevenção de conflito no banco;
- rate limit para reservas;
- leitura pública limitada a negócio/horários/serviços;
- SEO e CI.

### DocPronto
- autenticação e sincronização;
- tabela `docpronto_proposals` compatível com o frontend;
- histórico cloud corrigido;
- impressão/PDF;
- SEO e CI.

## Sete produtos ainda no laboratório

VagaCerta, FalaPro, MontaPC, GameRadar, Perto, PratoPronto e Revisa agora carregam Supabase Auth, continuam utilizáveis localmente sem conta e persistem dados reais no backend quando autenticados.

O Perto já consulta `perto_professionals` para resultados públicos ativos.

Cada pasta contém `FULLSTACK.md` com arquitetura, monetização, QA e próximos passos.

## QA atual

- PostPilot: Static QA aprovado.
- AgendaLeve: Static QA aprovado.
- DocPronto: Static QA e Quality Checks aprovados nas execuções mais recentes.
- Ideias+ Lab: Lab QA aprovado e GitHub Pages publicado.

## Segurança

A auditoria pós-implementação não apontou erro novo de segurança nos módulos criados. A tabela interna `agendaleve_booking_rate_limits` fica sem política de cliente por design e é usada pela Edge Function privilegiada.

Permanecem avisos antigos ligados à aplicação da pizzaria, incluindo `product_sales_summary` e funções `SECURITY DEFINER`; eles não foram alterados para evitar regressão no sistema existente.

## Limitação operacional

A conexão GitHub disponível nesta sessão permite commits, arquivos, branches, PRs e inspeção de Actions, mas não expõe criação de repositórios. Por isso ainda faltam os repositórios físicos:

- `HelioConde/vagacerta`
- `HelioConde/falapro`
- `HelioConde/montapc`
- `HelioConde/gameradar`
- `HelioConde/perto`
- `HelioConde/pratopronto`
- `HelioConde/revisa`

O código e a arquitetura desses sete já estão preparados para separação.
