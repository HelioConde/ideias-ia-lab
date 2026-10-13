# Perto — migração para o repositório independente

O código de produção está na branch **`split/perto`** do hub. **Não desenvolver na `main` de `ideias-ia-lab`**.

## 1. Criar o repositório físico

A integração GitHub atual não disponibiliza o comando de criação de repositórios. Crie manualmente o repositório público **`HelioConde/perto`** em [github.com/new](https://github.com/new), **sem inicializar com README, .gitignore ou licença**.

No seu computador, com Git instalado:

```powershell
git clone --branch split/perto --single-branch https://github.com/HelioConde/ideias-ia-lab.git perto
cd perto
git branch -m main
git remote set-url origin https://github.com/HelioConde/perto.git
git push -u origin main
```

Isso migra a árvore standalone atual, mantendo todas as melhorias e as migrations da branch.

## 2. Habilitar publicação

Em `HelioConde/perto`: Settings → Pages → Build and deployment → Source → **GitHub Actions**. Depois acione o workflow `Perto — Publish GitHub Pages`, se necessário.

URL prevista **depois de publicar**: https://helioconde.github.io/perto/ (não considerar como site ativo antes de o Pages ficar verde).

## 3. Configurar autenticação no Supabase existente

Projeto: `pizzaria-db` (`bnlvvsjgpywpbfhwdcan`). Em Auth → URL Configuration → Redirect URLs, adicione `https://helioconde.github.io/perto/**` conforme suporte da versão atual. **Não mude o Site URL global**: outros produtos compartilham esse backend.

Somente a publishable key aparece em `supabase-config.js`. Nunca publicar `service_role`/secret key.

## 4. Moderação segura antes da busca pública

O cliente pode cadastrar perfil, que entra em `pending`. No ambiente administrativo confiável do Supabase, revise o conteúdo do perfil, e só depois permita `status = 'active'`. O trigger `perto_lock_moderation_status` impede a alteração de aprovação por usuários comuns e aceita os papéis administrativos `postgres`, `supabase_admin` ou `service_role`.

Não divulgar como verificados: aprovação de conteúdo ainda não é validação de identidade/licença.

## 5. Gates para o beta

- [x] fluxos de descoberta, pedido privado e perfil construídos;
- [x] sem prestadores fictícios;
- [x] RLS de pedidos/participantes e filtro de profissional ativo;
- [x] grants mínimos (anon sem UPDATE/INSERT; auth sem editar status/rating profissional);
- [x] cancelamento só pelo solicitante e sem alterar o pedido;
- [x] máximo de 5 novos pedidos por conta/hora (a proteção por IP/CAPTCHA fica para um beta público maior);
- [x] um perfil profissional por conta, estado inicial pendente e moderação administrativa;
- [x] PT-BR/EN com categorias persistindo o mesmo valor de banco;
- [x] testes Browser E2E desktop/mobile versionados;
- [x] workflow de publicação, sitemap, robots e páginas legais preparados;
- [ ] repositório `HelioConde/perto` criado e main importada;
- [ ] CI da main e GitHub Pages verdes no novo repositório;
- [ ] validação real: duas contas, navegador desktop/mobile, pedido, privacidade, cancelamento e aprovação;
- [ ] canal de suporte/privacidade dedicado e revisão jurídica dos textos antes de abrir cadastro ao público;
- [ ] coleta de feedback real e testes de abuso/volume;
- [ ] revisão de indexação/SEO no endereço publicado.

**Não liberar cadastro público real enquanto os gates de suporte, privacidade e segurança operacional não estiverem fechados.**

## Próxima fase (V2)

Avaliações verificadas, denúncias, moderação em painel restrito, prevenção de abuso por IP/CAPTCHA, categorias normalizadas, notificações e páginas SEO de locais com oferta real. Publicidade é o modelo principal previsto para o portfólio e permanece desativada até revisão de consentimento e política publicitária.
