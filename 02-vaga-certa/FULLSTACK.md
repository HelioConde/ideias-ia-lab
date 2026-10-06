# VagaCerta — arquitetura fullstack

Repositório individual planejado: `HelioConde/vagacerta`.

## Produto
Organizador de candidaturas com histórico, próxima ação, personalização de currículo e preparação para entrevista.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `vagacerta_applications`: empresa, cargo, URL, status, score, salário, notas e datas.
- `vagacerta_documents`: currículos/cartas ligados opcionalmente a uma candidatura.
- `product_subscriptions`: plano por produto.

Os dados são privados por usuário e protegidos por RLS.

## Estado atual
O protótipo salva localmente sem conta e, com Supabase Auth, persiste candidaturas em `vagacerta_applications`.

## Próximas entregas
- Kanban Saved → Applied → Interview → Offer/Rejected.
- score de compatibilidade explicado por requisito;
- versões de currículo por vaga;
- lembrete de follow-up;
- painel de métricas simples;
- integração de IA somente por backend/Edge Function.

## Monetização
Freemium; premium para currículos personalizados, histórico avançado, preparação de entrevistas e automações.

## QA obrigatório
Isolamento RLS, duplicidade de vagas, URLs inválidas, estados de candidatura, mobile, teclado, loading/erro/vazio e importação/exportação.
