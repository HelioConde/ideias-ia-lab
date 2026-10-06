# GameRadar — arquitetura fullstack

Repositório individual planejado: `HelioConde/gameradar`.

## Produto
Wishlist de jogos, comparação de ofertas e alerta por preço-alvo.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `gameradar_games`
- `gameradar_offers`
- `gameradar_wishlist`
- `gameradar_custom_alerts`
- `product_subscriptions`

Catálogo/ofertas podem ser públicos; wishlist e alertas personalizados são privados por RLS.

## Estado atual
O protótipo autenticado já salva alertas personalizados de qualquer jogo, plataforma e preço-alvo.

## Próximas entregas
- integrar fontes de preço permitidas;
- histórico de menor preço;
- normalização do mesmo jogo entre lojas;
- alerta quando preço <= alvo;
- identificação de links afiliados.

## Monetização
Links de afiliado e anúncios; premium para mais alertas/recursos.

## QA obrigatório
Preço stale, moeda, região, jogo duplicado, edição/remoção de alerta, URLs de loja, falhas de fonte e isolamento RLS.
