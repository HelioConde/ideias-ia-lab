# Perto — Gate de beta técnico

**Revisado em:** 12/10/2026.

## Estado honesto

O **núcleo técnico** foi atualizado na branch `split/perto`, com melhorias de segurança aplicadas no Supabase `pizzaria-db` e testes Browser E2E desktop/mobile no GitHub Actions. **O produto ainda não foi lançado:** não existe o repositório físico `HelioConde/perto`, GitHub Pages do destino ainda não foi habilitado e não houve homologação humana com contas reais.

## Alterações da rodada

- Banco: `20261012225500_active_professional_quote_guard.sql` — só permite novas solicitações para profissional ativo.
- Banco: `20261012232000_perto_least_privilege.sql` — restringe grants de navegador e cancelamento.
- Banco: `20261012234000_perto_request_antispam.sql` — um perfil por dono, valida conteúdo e estabelece quota de 5 pedidos/hora.
- Banco: `20261012235000_perto_moderator_db_roles.sql` — moderação apenas por papéis administrativos confiáveis.
- Frontend: envio com status padrão de servidor, formulário corrigido, versão de cache isolada, seletor PT-BR/EN, fontes mais legíveis.
- QA: `tests/perto.spec.js` + `.github/workflows/perto-qa.yml` testam cenários em desktop e mobile, inclusive segurança de contratos frontend e versão inglês.
- Publicação: `.github/workflows/pages.yml`, páginas de privacidade/termos, sitemap/robots.

A verificação técnica de SQL confirma as políticas, grants e triggers instalados. Não alegar que os testes simulados substituem dois usuários autenticados reais.

Leia `DEPLOY.md` antes de migrar ou abrir o beta.
