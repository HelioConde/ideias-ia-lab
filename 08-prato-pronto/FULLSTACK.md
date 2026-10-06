# PratoPronto — arquitetura fullstack

Repositório individual planejado: `HelioConde/pratopronto`.

## Produto
Planejador semanal de refeições por orçamento, número de pessoas e preferências.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `pratopronto_plans`
- `pratopronto_meals`
- `pratopronto_shopping_items`
- `product_subscriptions`

Tudo é privado por usuário via RLS.

## Estado atual
O usuário autenticado já persiste planos com orçamento, pessoas e preferência. Sem login, usa armazenamento local.

## Próximas entregas
- gerar refeições dentro do teto semanal;
- consolidar ingredientes;
- lista de compras editável;
- substituições mais econômicas;
- preferências e alergias como filtros explícitos;
- estimativas sempre identificadas como estimativas.

## Monetização
Plano premium, publicidade e patrocínios transparentes.

## QA obrigatório
Orçamento mínimo, pessoas inválidas, preferências, lista duplicada, total estimado, mobile, acessibilidade e isolamento RLS.
