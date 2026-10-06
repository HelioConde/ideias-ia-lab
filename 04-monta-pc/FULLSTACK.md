# MontaPC — arquitetura fullstack

Repositório individual planejado: `HelioConde/montapc`.

## Produto
Montador de PC por orçamento com validação de compatibilidade e alternativas.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `montapc_components`: catálogo público de peças.
- `montapc_builds`: builds privadas do usuário.
- `montapc_build_items`: peças selecionadas.
- `product_subscriptions`.

## Estado atual
O usuário autenticado já consegue persistir uma build-base com orçamento, finalidade e status. O catálogo real de peças ainda precisa ser alimentado.

## Próximas entregas
- regras socket CPU/placa-mãe;
- RAM DDR4/DDR5;
- potência recomendada da fonte;
- espaço de GPU/gabinete;
- preços atuais por loja;
- alternativas por orçamento;
- links de afiliado identificados claramente.

## Monetização
Afiliados, posições patrocinadas claramente rotuladas e, futuramente, recursos premium.

## QA obrigatório
Compatibilidade falsa positiva/negativa, moeda, preço ausente, peças indisponíveis, orçamento pequeno/grande, mobile e transparência de afiliados.
