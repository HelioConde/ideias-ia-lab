# Auditoria visual centralizada — GitHub Pages

Este repositório reúne as verificações dos projetos web estáticos, sem PHP, banco de dados ou autenticação de usuários. O auditor não modifica outros repositórios.

## Fluxo

1. Edite `scripts/pages-targets.json` para adicionar apenas sites cuja publicação exista.
2. O workflow `Auditoria visual multiprojeto GitHub Pages` executa automaticamente quando a configuração ou o script mudam na main, nas PRs relevantes e nas segundas-feiras. Também permite execução manual.
3. Em cada site, captura 390×844, 768×1024 e 1440×900, em página inteira.
4. Registra status HTTP, erros JavaScript, avisos do console, overflow horizontal, existência de heading/main e controles sem nome acessível.
5. Gera `artifacts/pages-visual-audit/diagnostics.json`, `report.md` e capturas PNG, publicados como artefato do workflow por 14 dias.

## Limitações

O Pages não executa PHP, MySQL ou autenticação de produção. Site estático pode usar dados de demonstração/localStorage, mas não deve simular conta real ou prometer sincronização entre dispositivos.

Um deploy verde não garante fidelidade visual. Para avaliar o redesenho Image to Code, compare as capturas geradas com referências aprovadas por projeto. Este teste não mede Lighthouse, acessibilidade WCAG completa nem compatibilidade de integração com APIs externas.

**Bloqueio de configuração:** para repositórios ainda sem Pages habilitado, é necessário abrir **Settings > Pages > Source: GitHub Actions** com acesso de administrador. Não adicione URLs inexistentes à lista de publicação ativa.
