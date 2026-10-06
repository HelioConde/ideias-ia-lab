# Perto — arquitetura fullstack

Repositório individual planejado: `HelioConde/perto`.

## Produto

Marketplace local mínimo para buscar profissionais aprovados por cidade/categoria e enviar pedidos privados de orçamento.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `perto_professionals`
- `perto_requests`
- `product_subscriptions`

## Implementado

- busca pública sem exigir conta;
- filtro por cidade, estado, categoria e termo;
- somente perfis com `status = active` aparecem publicamente;
- estado vazio honesto: nenhum prestador fictício é criado;
- cards com nome, categoria, descrição, cidade/UF, preço inicial e rating quando existir;
- Supabase Auth para clientes/profissionais;
- pedido privado de orçamento;
- contato de retorno armazenado no pedido e visível somente aos participantes;
- histórico de pedidos enviados e recebidos;
- cancelamento pelo solicitante;
- cadastro/edição de perfil profissional;
- novos perfis sempre entram como `pending`;
- trigger no banco impede autoaprovação por usuário autenticado;
- índice de busca por status/UF/cidade/categoria;
- índices de pedidos;
- colunas antigas `phone` e `whatsapp` não possuem permissão SELECT para `anon` nem `authenticated`;
- frontend seleciona apenas colunas públicas seguras;
- UI própria responsiva;
- CI dedicado.

## Moderação

O proprietário do perfil pode editar as informações, mas não pode promover o próprio `status` para `active`.

A ativação deve ocorrer por fluxo administrativo/backend com privilégio apropriado. Isso evita que a busca pública seja preenchida sem revisão.

## Privacidade

A busca pública não expõe telefone, WhatsApp nem contato do cliente.

O cliente informa uma forma de retorno dentro de `perto_requests.contact`; a policy permite leitura do pedido ao solicitante e ao dono do perfil associado.

## Próximas entregas

- painel administrativo de moderação;
- aprovação/rejeição com motivo;
- avaliações verificadas;
- denúncia e bloqueio;
- prevenção de spam/rate limit;
- categorias padronizadas;
- páginas SEO por categoria + cidade quando houver oferta real;
- notificações de novo pedido;
- profissional poder marcar pedido como visualizado/contatado por RPC restrita;
- verificação de identidade/empresa quando fizer sentido.

## Monetização

Plano para profissionais, destaque patrocinado claramente identificado ou cobrança por lead qualificado.

## QA obrigatório

- nenhum resultado;
- cidade com acento;
- filtros combinados;
- perfil pending não aparece;
- tentativa de autoaprovação;
- pedido sem login;
- pedido privado;
- cancelamento;
- profissional vê pedidos dirigidos ao próprio perfil;
- contato não aparece publicamente;
- isolamento RLS;
- mobile;
- moderação.
