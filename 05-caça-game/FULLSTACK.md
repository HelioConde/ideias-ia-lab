# GameRadar — arquitetura fullstack

Repositório individual planejado: `HelioConde/gameradar`.

## Produto

Wishlist de jogos com preço-alvo, último preço observado e suporte futuro a ofertas integradas.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `gameradar_games`
- `gameradar_offers`
- `gameradar_wishlist`
- `gameradar_custom_alerts`
- `product_subscriptions`

Catálogo/ofertas podem ser públicos; wishlist e alertas personalizados são privados por RLS.

## Implementado

- modo local sem conta;
- Supabase Auth;
- CRUD completo de alertas personalizados;
- título, plataforma e preço-alvo;
- registro manual do último preço visto;
- loja e URL opcional;
- cálculo automático “atingiu o alvo / acima do alvo / sem preço”;
- cálculo de quanto ainda precisa cair;
- busca e filtros;
- métricas de alertas, atingidos e sem preço;
- sincronização com `gameradar_custom_alerts`;
- importação local → conta;
- migração dos rascunhos do protótipo antigo;
- área separada para `gameradar_offers`;
- ofertas integradas ficam ocultas quando a tabela está vazia;
- transparência explícita: preço manual nunca é chamado de promoção automática;
- UI própria responsiva;
- CI dedicado.

## Regra de integridade

O produto não cria ofertas falsas. Enquanto nenhuma integração real alimentar `gameradar_offers`, o usuário trabalha com preços observados manualmente.

Quando uma integração existir, cada oferta deve ter:
- loja;
- preço;
- URL;
- `checked_at`;
- indicação clara de afiliado quando aplicável.

## Próximas entregas

- integração permitida com fontes de preços;
- normalização do mesmo jogo entre lojas;
- histórico de preço;
- alerta condicional quando oferta integrada <= meta;
- notificações;
- catálogo com capas;
- região/moeda;
- deduplicação;
- links afiliados identificados claramente.

## QA obrigatório

- preço-alvo zero;
- preço atual acima/abaixo/igual à meta;
- URL inválida;
- jogo duplicado;
- plataforma;
- filtro;
- edição/exclusão;
- importação local;
- isolamento RLS;
- oferta stale;
- distinção entre preço manual e integrado;
- mobile.
