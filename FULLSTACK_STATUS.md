# Status fullstack dos 10 produtos

Atualizado em 2026-10-06.

## Marco atual

A primeira camada fullstack dos **10 produtos** está implementada.

Três produtos possuem repositórios dedicados:
- `HelioConde/postpilot`
- `HelioConde/agendaleve`
- `HelioConde/docpronto`

Os outros sete possuem frontend dedicado dentro de `HelioConde/ideias-ia-lab`, com separação preparada em `SPLIT_REPOS.md`.

## Backend compartilhado

Projeto Supabase: `pizzaria-db`.

- PostPilot: `postpilot_projects`, `postpilot_outputs`
- VagaCerta: `vagacerta_applications`, `vagacerta_documents`
- FalaPro: `falapro_sessions`, `falapro_answers`
- MontaPC: `montapc_components`, `montapc_builds`, `montapc_build_items`
- GameRadar: `gameradar_games`, `gameradar_offers`, `gameradar_wishlist`, `gameradar_custom_alerts`
- AgendaLeve: `agendaleve_businesses`, `agendaleve_business_hours`, `agendaleve_services`, `agendaleve_bookings`, `agendaleve_booking_rate_limits`
- Perto: `perto_professionals`, `perto_requests`
- PratoPronto: `pratopronto_plans`, `pratopronto_meals`, `pratopronto_shopping_items`
- Revisa: `revisa_goals`, `revisa_study_sessions`, `revisa_questions`, `revisa_attempts`
- DocPronto: `docpronto_clients`, `docpronto_documents`, `docpronto_items`, `docpronto_proposals`

## Produto por produto

### PostPilot
Conta opcional, modo local, sincronização, importação local e persistência de projetos/outputs. Gerador atual é local por regras; IA e vídeo ainda não estão conectados.

### VagaCerta
CRUD completo, funil de candidatura, busca/filtro, score, salário, links, métricas, local/cloud e importação.

### FalaPro
Sessões de cinco perguntas por profissão, uma pergunta por vez, feedback heurístico transparente, pontuação, histórico e local/cloud.

### MontaPC
Catálogo inicial de 23 peças de referência, geração por orçamento, ajuste manual, checks explicados de socket/RAM/gabinete/cooler/fonte e builds local/cloud. Preços são estimativas, não ofertas ao vivo.

### GameRadar
Alertas personalizados, último preço observado manualmente, meta atingida/gap, filtros e cloud. Área de ofertas reais permanece vazia enquanto nenhuma fonte real alimentar `gameradar_offers`.

### AgendaLeve
Painel do dono, serviços, expediente, reservas, link público, disponibilidade em tempo real, `create-booking`, `booking-availability`, rate limit e prevenção de conflito.

### Perto
Busca pública apenas de perfis `active`, cadastro profissional `pending`, bloqueio de autoaprovação, pedidos privados com contato de retorno e restrição de colunas públicas.

### PratoPronto
Geração de sete refeições, quantidades por pessoa, lista consolidada, estimativas, itens comprados, histórico e local/cloud. Não é ferramenta médica/nutricional.

### Revisa
Metas, matérias, plano de até 90 dias, sessões diárias, progresso, banco inicial de 14 questões autorais e registro de tentativas.

### DocPronto
Orçamentos com itens, edição, duplicação, impressão/PDF, local/cloud, importação e RLS.

## QA e deploy

- PostPilot: Static QA + Pages verdes.
- AgendaLeve: Static QA + Pages verdes.
- DocPronto: Static QA + Quality Checks + Pages verdes.
- Ideias+ Lab: CI valida os sete `app.js`, sete `style.css`, SEO e boot do Supabase. Últimos commits funcionais de cada produto passaram.

## Hardening realizado

- RLS ativo nas tabelas dos módulos.
- Grants explícitos para a Data API.
- Catálogos `montapc_components`, `gameradar_games`, `gameradar_offers` e `revisa_questions` são somente leitura para clientes.
- AgendaLeve separa público, autenticado e proprietário.
- Perto impede autoaprovação de profissional.
- Perto não concede SELECT de `phone`/`whatsapp` a `anon` ou `authenticated`.
- Segredos nunca ficam no frontend.

## Pendências transversais

- criar fisicamente os sete repositórios quando a integração GitHub oferecer criação;
- testes E2E em navegador real;
- pagamentos somente onde o modelo exigir;
- observabilidade/telemetria;
- conteúdo legal/políticas conforme cada produto;
- integrações externas reais (preços, IA, notificações) somente com fonte/segredo adequados.

## Avisos antigos do projeto Supabase

A auditoria ainda aponta itens do sistema legado da pizzaria, como `product_sales_summary` com SECURITY DEFINER e funções antigas executáveis. Eles não foram modificados nesta rodada para evitar regressão em um sistema existente.

A proteção de senha vazada do Supabase Auth também aparece desativada e deve ser tratada como configuração de segurança do projeto.

## Limitação operacional

A conexão GitHub desta sessão continua sem uma operação para criar novos repositórios. O código dos sete produtos, contudo, já está individualizado e pronto para migração sem alteração do banco.
