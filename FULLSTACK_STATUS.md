# Status fullstack dos 10 produtos

## Backend
Aplicado no Supabase `pizzaria-db`:
- billing compartilhado: `product_subscriptions`
- PostPilot: projects, outputs
- VagaCerta: applications, documents
- FalaPro: sessions, answers
- MontaPC: components, builds, build_items
- GameRadar: games, offers, wishlist
- AgendaLeve: businesses, business_hours, services, bookings e rate_limits (já existente)
- Perto: professionals, requests
- PratoPronto: plans, meals, shopping_items
- Revisa: goals, questions, attempts
- DocPronto: clients, documents, items

Todas as tabelas novas estão com RLS. Catálogos públicos usam SELECT anônimo somente quando necessário.

## Repositórios individuais já existentes
- HelioConde/postpilot
- HelioConde/agendaleve
- HelioConde/docpronto

## Repositórios que ainda precisam existir no GitHub
- vagacerta
- falapro
- montapc
- gameradar
- perto
- pratopronto
- revisa

A conexão GitHub disponível nesta sessão não expõe criação de repositórios. Os protótipos desses sete continuam preservados neste repositório, nas pastas 02, 03, 04, 05, 07, 08 e 09, para migração imediata quando os repositórios forem criados.
