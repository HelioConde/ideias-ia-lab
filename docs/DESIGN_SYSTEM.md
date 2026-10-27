# Design System — Ideias IA Lab

## Objetivo
Hub claro e legível, que separa **status de repositório** de **status de produto**. Nenhum selo "no GitHub" significa que a aplicação esteja homologada ou pronta para produção.

## Tokens base
| Grupo | Tokens |
| --- | --- |
| Cores | \`--ink #1c2921\`, \`--muted #4f6055\`, \`--bg #f5f8f5\`, \`--accent #245d42\`, \`--soft #e6f2e9\`, \`--line #dbe5dd\` |
| Espaçamento | 4, 8, 12, 16, 20, 24, 32 e 48 px |
| Raio | 12 e 18 px |
| Tipos | Manrope para títulos, DM Sans/sistema para leitura |

## Componentes
- \`.topbar\`: identidade do hub e selo contextual, sem menu oculto.
- \`.hero\`: mensagem principal e explicação do papel do repositório.
- \`.grid\`: três colunas em desktop (a partir de 981 px), duas em tablet e uma em mobile.
- \`.card\`: título, descrição de conteúdo variável e link em fluxo normal (sem sobreposição de textos).
- \`.note\`: documentação e alertas contextuais.

## Acessibilidade e QA
- Links devem ter nomes descritivos e foco visível; alvos de ação com altura mínima de 44 px.
- Contraste em superfícies claras, texto regular de pelo menos 14 px e hierarquia de títulos sem saltos.
- Não depender de animação para transmitir informação; respeitar \`prefers-reduced-motion\`.
- Inspecionar 390×844, 768×1024 e 1440×900 e capturar console, overflow e screenshots via Playwright.
- Preservar \`main\` e seções semânticas; não usar cores como único indicador de status.

## Publicação
O hub é uma página estática e não precisa de banco de dados. Publicar HTML, CSS, SVG e scripts em GitHub Pages; funcionalidades com login/segredos exigem infraestrutura externa e não devem ser simuladas como reais.
