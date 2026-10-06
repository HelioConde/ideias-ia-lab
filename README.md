# Ideias+ — 10 produtos web

Laboratório dos dez produtos. Três já possuem repositórios dedicados e sete continuam aqui como bases fullstack até a criação dos repositórios individuais.

## Produtos

1. **PostPilot** — estúdio de conteúdo para criadores — repositório dedicado: `HelioConde/postpilot`
2. **VagaCerta** — organizador de candidaturas — base fullstack em `02-vaga-certa/`
3. **FalaPro** — inglês para entrevistas — base fullstack em `03-entrevista-fluente/`
4. **MontaPC** — montador de PC compatível — base fullstack em `04-monta-pc/`
5. **GameRadar** — radar e alertas de jogos — base fullstack em `05-caça-game/`
6. **AgendaLeve** — agendamento para pequenos negócios — repositório dedicado: `HelioConde/agendaleve`
7. **Perto** — busca de profissionais por cidade — base fullstack em `07-perto-de-mim/`
8. **PratoPronto** — refeições econômicas — base fullstack em `08-prato-pronto/`
9. **Revisa** — treinador para provas — base fullstack em `09-revisa-ai/`
10. **DocPronto** — propostas e orçamentos — repositório dedicado: `HelioConde/docpronto`

## Backend

Os produtos usam o projeto Supabase compartilhado `pizzaria-db`, com:

- Supabase Auth;
- tabelas prefixadas por produto;
- Row Level Security para dados privados;
- publishable key no navegador;
- nenhuma `service_role` exposta no frontend;
- catálogos públicos com leitura anônima apenas onde o produto exige.

Os sete protótipos restantes funcionam localmente sem conta e passam a persistir os dados no Supabase após login.

## QA

O workflow `.github/workflows/static-qa.yml` valida sintaxe JavaScript, arquivos essenciais e metadados SEO das sete páginas fullstack. GitHub Pages também é publicado a partir do repositório.

## Documentação

- `PORTFOLIO_REVIEW.md` — UX/UI, QA, SEO, design e visão executiva.
- `FULLSTACK_STATUS.md` — estado técnico dos dez produtos.
- `SPLIT_REPOS.md` — plano exato para separar os sete projetos restantes.
- cada pasta fullstack possui seu próprio `FULLSTACK.md`.

## Segurança

As tabelas novas usam RLS por proprietário. Avisos de segurança ainda existentes no projeto Supabase relacionados à aplicação antiga da pizzaria são tratados separadamente para não quebrar um sistema em produção.
