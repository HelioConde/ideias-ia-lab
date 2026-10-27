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


## Cobertura adicional (Web Design Guidelines + Taste Skill)

A análise centralizada também coleta indicadores de usabilidade e acessibilidade dos sites publicados:

- Campos de formulário sem rótulo semântico (labels, `aria-label` ou `aria-labelledby`).
- Imagens sem atributo `alt`, inclusive quando a alternativa correta poderia ser `alt=""` decorativo.
- Botões e links menores que 40 px em pelo menos um eixo nas resoluções móveis (indicador para revisão, não julgamento automático de WCAG).
- Presença de `lang` na raiz e da `meta name="viewport"`.
- Downloads quebrados de JavaScript/CSS **do próprio caminho do projeto** passam a ser erros bloqueantes; imagens ou favicons quebrados geram avisos.

O teste não deve esconder erros de recursos de aplicações publicadas somente para obter uma execução verde. Cada falha precisa ser corrigida no respectivo repositório. Itens meramente informativos aparecem como avisos para evitar falsas reprovações em componentes já acessíveis por métodos alternativos.

### Processo de correção em lote

1. Executar a auditoria programada ou disparar manualmente quando uma modernização for publicada.
2. Ordenar o relatório por erros HTTP/JS, overflow e campos não nomeados.
3. Abrir branches individuais por projeto para que mudanças de UX não se confundam com dados, licença ou lógica de negócio.
4. Reproduzir o mesmo cenário no Playwright do projeto, usando viewport e captura do relatório.
5. Corrigir CSS/tokens/foco/elementos realmente quebrados e comparar capturas antes e depois.
6. Executar QA novamente, integrar PR com testes aprovados e confirmar a URL pública.
7. Manter o modo estático sem banco de dados: `localStorage`, dados de demonstração, exportação/importação de arquivos quando apropriado. Login, pagamentos, multiplayer ou sincronização exigem serviços independentes.

### Image to Code

A auditoria detecta problemas estruturais, mas não substitui referência aprovada. Quando a imagem de referência existir, registrar no PR o antes/depois, componentes afetados e diferenças de espaçamento, tipografia, cores e proporções. Não reinventar telas nem afirmar equivalência pixel a pixel sem comparação.
