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


## Recursos críticos e severidade

Além de screenshot, inventário de componentes e acessibilidade, o monitor considera **erro** quando JavaScript ou CSS do diretório daquele projeto retornam HTTP 4xx/5xx ou falham na rede. Isso detecta publicações com caminhos de assets inválidos (por exemplo, compilação Vite usando `/src/main.jsx` em vez de `/nome-repo/assets/...`).

Imagens, fontes e favicons quebrados continuam registrados como **avisos** para triagem visual. Uma requisição abortada por troca de página não é automaticamente interpretada como erro. Somente recursos dentro do caminho do repositório hospedado são considerados — falhas de APIs externas não devem ser confundidas com bugs do servidor GitHub Pages.

**Execução em lote:** o arquivo `scripts/pages-targets.json` controla os sites conhecidos, e o GitHub Actions produz screenshots, `report.md`, `ui-inventory.md` e `diagnostics.json`. Adicione apenas URLs cuja publicação já esteja verificada. Conserte recursos quebrados no repositório de origem e rode o workflow novamente.


## Ampliação de cobertura — 23 sites e 69 cenários

A lista de auditoria inclui agora Office-Ordem, checkLoss, League Friends, Chat Arena e Super Mario. Cada endereço passa por 390×844, 768×1024 e 1440×900. O monitor registra HTTP real, JavaScript, carregamento de CSS/JS, screenshots, tokens de design, controles acessíveis e overflow.

**Exceção importante:** o Super Mario clássico usa um mundo horizontal de aproximadamente 12.680 px e `window.scrollTo({left: camera})` durante a partida. O cadastro `horizontalScrollExpected:true` converte **somente nesse site** o overflow horizontal em aviso, preservando a câmera e o gameplay. Outros sites permanecem sujeitos à falha normal por overflow. Não use esse marcador apenas para esconder layout quebrado.

A publicação no GitHub Pages continua independente dos dados: o workflow central **lê páginas públicas**, não modifica repositórios nem depende de banco de dados.
