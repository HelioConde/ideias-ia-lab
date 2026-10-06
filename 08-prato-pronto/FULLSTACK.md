# PratoPronto — arquitetura fullstack

Repositório individual planejado: `HelioConde/pratopronto`.

## Produto

Planejador semanal de refeições por orçamento, número de pessoas e preferência, com lista de compras consolidada.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `pratopronto_plans`
- `pratopronto_meals`
- `pratopronto_shopping_items`
- `product_subscriptions`

Planos, refeições e compras são privados por usuário via RLS.

## Implementado

- modo local sem conta;
- Supabase Auth;
- criação de plano por orçamento e número de pessoas;
- preferências gerais: sem restrições, vegetariano e sem carne vermelha;
- estratégia equilibrada ou economia;
- geração de sete refeições principais;
- quantidades escaladas pelo número de pessoas;
- custo estimado por refeição;
- lista de compras consolidada;
- quantidades em g, kg, ml, L e unidades;
- marcação de itens comprados;
- orçamento, estimativa, margem e progresso de compras;
- histórico e reabertura de planos;
- exclusão de plano;
- sincronização de `plans`, `meals` e `shopping_items`;
- importação local → conta;
- migração do protótipo antigo;
- UI própria responsiva;
- CI dedicado.

## Regra de preço e saúde

Os preços usados pelo gerador são referências internas do protótipo e não preços de mercado em tempo real.

As preferências são culinárias e não devem ser tratadas como filtro médico de alergia, intolerância ou dieta terapêutica. O produto é um organizador de refeições e orçamento, não aconselhamento nutricional.

## Próximas entregas

- catálogo regional de preços quando houver fonte permitida;
- substituições econômicas;
- edição manual de refeições;
- edição da quantidade de compras;
- refeições por café/almoço/jantar;
- aproveitamento planejado de sobras;
- favoritos;
- exportação/compartilhamento;
- integração com promoções somente com fonte e data explícitas.

## Monetização

Plano premium, publicidade e patrocínios transparentes.

## QA obrigatório

- orçamento abaixo do custo mínimo;
- uma ou muitas pessoas;
- vegetariano e sem carne vermelha;
- cálculo de quantidades;
- consolidação de ingrediente repetido;
- marcação de compras;
- exclusão;
- importação;
- isolamento RLS;
- mobile;
- distinção entre estimativa e preço real.
