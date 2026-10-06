# Ideias+ — portfólio de 10 produtos web

Laboratório e fonte de desenvolvimento dos dez produtos. Três já possuem repositórios dedicados e sete continuam neste repositório até a criação física dos repositórios individuais.

## Produtos

1. **PostPilot** — estúdio de conteúdo para criadores — `HelioConde/postpilot`
2. **VagaCerta** — funil de candidaturas, filtros, score e cloud sync — `02-vaga-certa/`
3. **FalaPro** — sessões de entrevista em inglês, feedback por regras e histórico — `03-entrevista-fluente/`
4. **MontaPC** — gerador por orçamento e motor de compatibilidade — `04-monta-pc/`
5. **GameRadar** — wishlist e alertas de preço honestos, preparados para ofertas reais — `05-caça-game/`
6. **AgendaLeve** — agenda + link público de reservas — `HelioConde/agendaleve`
7. **Perto** — marketplace moderado de profissionais e pedidos privados — `07-perto-de-mim/`
8. **PratoPronto** — cardápio semanal + lista de compras — `08-prato-pronto/`
9. **Revisa** — metas, sessões diárias e questões — `09-revisa-ai/`
10. **DocPronto** — propostas e orçamentos — `HelioConde/docpronto`

## Backend compartilhado

Projeto Supabase: `pizzaria-db`.

Todos os módulos novos usam:
- Supabase Auth quando a conta é necessária;
- RLS para dados privados;
- publishable key no navegador;
- nenhuma `service_role` no frontend;
- catálogos públicos somente leitura;
- grants explícitos para a Data API;
- modo local sem conta quando isso agrega valor ao onboarding.

## Estado do laboratório

Os sete produtos que ainda não possuem repositório próprio já têm:
- `index.html` próprio;
- `app.js` próprio;
- `style.css` próprio;
- fluxo fullstack específico do produto;
- autenticação/persistência quando aplicável;
- metadados SEO;
- documentação `FULLSTACK.md`;
- validação pelo workflow `.github/workflows/static-qa.yml`;
- publicação no GitHub Pages.

O antigo `assets/app.js` permanece para a Home do laboratório e compatibilidade histórica, mas não é mais a implementação principal desses sete produtos.

## QA

O CI valida sintaxe JavaScript, arquivos dedicados, title, description, canonical e boot do Supabase para os sete produtos.

## Documentação

- `PORTFOLIO_REVIEW.md` — avaliação de produto, UX/UI, QA, SEO e negócio.
- `FULLSTACK_STATUS.md` — estado técnico consolidado.
- `SPLIT_REPOS.md` — plano para separar os sete repositórios.
- cada produto possui `FULLSTACK.md`.

## Segurança

A auditoria de 06/10/2026 confirmou RLS nos módulos novos. Catálogos de MontaPC, GameRadar e Revisa tiveram privilégios de escrita de cliente revogados. No Perto, telefone/WhatsApp antigos não podem ser lidos por clientes; retorno ocorre por pedido privado.

Avisos ainda existentes no Supabase pertencem principalmente ao sistema legado da pizzaria e são tratados separadamente para evitar regressões.
