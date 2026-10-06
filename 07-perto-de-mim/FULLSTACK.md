# Perto — arquitetura fullstack

Repositório individual planejado: `HelioConde/perto`.

## Produto
Busca de profissionais por cidade e categoria, com pedidos de contato.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `perto_professionals`
- `perto_requests`
- `product_subscriptions`

Perfis ativos podem ser lidos publicamente. Escrita e pedidos são protegidos por RLS.

## Estado atual
O protótipo consulta a base real de profissionais ativos por cidade, categoria e termo. O bug antigo que trocava categoria/busca foi corrigido.

## Próximas entregas
- cadastro/verificação do profissional;
- avaliações e reputação;
- pedido de orçamento;
- proteção contra spam/fraude;
- página SEO por categoria+cidade;
- moderação.

## Monetização
Plano para profissionais ou cobrança por lead qualificado.

## QA obrigatório
Cidade acentuada, categorias, nenhum resultado, duplicidade, abuso, exposição indevida de contato, RLS, mobile e moderação.
