# Image to Code — processo de revisão visual dos 18 projetos

## Estado atual

O monitor publica `report.md`, `ui-inventory.md`, `diagnostics.json` e capturas de página inteira dos 18 projetos em três larguras. **Nenhuma imagem de referência é inventada**: uma aprovação do design precisa de capturas e referências visuais reais do próprio projeto.

## Etapas consecutivas (um ciclo por repositório)

1. **Inventariar**: conferir HTML/CSS, componentes, ações, tokens existentes e páginas publicadas, sem apagar funcionalidades.
2. **Selecionar referência**: usar um screenshot, design aprovado ou arquivo de projeto com direitos de uso e registrar origem/versão.
3. **Comparar**: conferir hierarquia, tipografia, contraste, espaçamento, tamanhos de toque, responsividade, estados de carregamento/vazio/erro e identidade.
4. **Implementar**: redesenhar os componentes reais, mantendo URLs relativas, dados de demonstração identificados e comportamento offline/local quando aplicável.
5. **Validar**: Playwright em 390×844, 768×1024 e 1440×900, com verificação de JavaScript, HTTP, largura, imagens, formulários e navegação por teclado.
6. **Revisar capturas**: comparar manualmente a renderização final com a referência — os testes automáticos não comprovam fidelidade estética.
7. **Publicar**: usar GitHub Pages para a parte estática; separar qualquer PHP, banco ou credencial no backend. Nunca representar login/IA/rede social multiusuário como funcional quando for apenas demonstração.
8. **Documentar**: atualizar `docs/DESIGN_SYSTEM.md` do projeto com tokens, componentes, breakpoints e decisões.

## Severidade dos diagnósticos

- **Bloqueante**: HTTP inválido, erro JavaScript fatal, overflow horizontal ou página incapaz de ser capturada.
- **Advertência revisável**: botões/links sem nome, alvos menores que 44px, formulários sem rótulo, imagens quebradas e links-placeholder.
- **Inspeção visual humana**: grids, espaçamentos, hierarquia, carrossel, contraste complexo e comparação com imagem de referência.

Os contadores de componentes são heurísticos (seletores DOM) e podem ter falsos positivos. Os avisos não ficam escondidos: aparecem no sumário, nos JSONs e no inventário.
