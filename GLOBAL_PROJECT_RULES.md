# Regra global — atualização automática em tempo real

Esta regra é obrigatória para **toda página web** criada ou mantida no portfólio Ideias IA Lab.

## Objetivo

Quando uma nova versão for publicada, usuários que já estão com a página aberta não devem continuar presos em uma versão antiga por cache.

O comportamento segue o padrão usado no chibi.gg.

## Requisitos obrigatórios

1. Cada deploy deve atualizar `version.json` com o SHA do commit publicado.
2. Toda página HTML deve carregar `live-update.js`.
3. O navegador deve verificar `version.json`:
   - a cada **12 segundos**;
   - quando a aba recebe foco;
   - quando a página volta a ficar visível.
4. Se o SHA mudar:
   - mostrar uma mensagem curta informando que existe nova versão;
   - atualizar caches de aplicação quando existirem;
   - recarregar automaticamente a página com cache-busting.
5. O parâmetro temporário `__v` deve ser removido da URL depois da recarga.
6. Em `localhost`, `127.0.0.1` e `::1`, a verificação automática deve ficar desativada.
7. Falha de rede/verificação de versão **nunca pode derrubar a página**.
8. Só recarregar quando a versão realmente mudar.
9. `version.json` deve ser buscado com `cache: "no-store"`.
10. Não usar Service Worker como única fonte da versão.

## UX

Mensagem padrão:

> Nova versão publicada. Atualizando automaticamente…

A atualização deve ser automática; não exigir Ctrl+F5 do usuário.

## GitHub Pages

Para projetos estáticos publicados a partir da branch `main`, usar o workflow `.github/workflows/live-version.yml` para manter `version.json` sincronizado com cada commit relevante.

O workflow deve ignorar pushes que alterem apenas `version.json` para evitar loop.

## Critério de QA

Nenhum projeto com página web pode ser considerado pronto se:
- algum HTML não carregar `live-update.js`;
- `version.json` estiver ausente;
- não existir automação para atualizar a versão em produção.
