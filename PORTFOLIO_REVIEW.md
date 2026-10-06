# Portfólio SaaS — avaliação de produto, UX/UI, QA, SEO e negócio

Atualizado em 2026-10-05.

## Arquitetura compartilhada

Os 10 produtos usam o projeto Supabase `pizzaria-db` como backend compartilhado, com tabelas prefixadas por produto, autenticação via `auth.users`, RLS por proprietário e leitura anônima apenas para catálogos públicos. A publishable key pode ser usada no frontend; chaves secretas/service role nunca devem ser expostas.

## Priorização executiva

| # | Produto | Potencial | Complexidade | Monetização | Prioridade |
|---|---|---:|---:|---|---:|
| 1 | PostPilot | 9/10 | 8/10 | assinatura/créditos | A |
| 2 | VagaCerta | 9/10 | 7/10 | freemium + premium | A |
| 3 | FalaPro | 8/10 | 7/10 | assinatura/pacotes | B |
| 4 | MontaPC | 9/10 | 8/10 | afiliados/patrocínios | A |
| 5 | GameRadar | 8/10 | 6/10 | afiliados/anúncios | B |
| 6 | AgendaLeve | 10/10 | 7/10 | mensalidade B2B | A+ |
| 7 | Perto | 8/10 | 9/10 | lead/plano profissional | B |
| 8 | PratoPronto | 7/10 | 6/10 | premium/anúncios | B |
| 9 | Revisa | 9/10 | 8/10 | assinatura/pacotes | A |
| 10 | DocPronto | 10/10 | 6/10 | assinatura/freemium | A+ |

## UX/UI

Diretrizes comuns: ação principal visível acima da dobra; onboarding em no máximo 3 passos; estados vazios explicativos; mobile-first; contraste WCAG AA; feedback imediato após salvar; evitar dashboards carregados; não exigir cadastro antes de o usuário entender o valor.

### Pontos específicos
- **PostPilot:** fluxo deve começar em “Cole o vídeo/transcrição”, depois gerar entregáveis agrupados por plataforma.
- **VagaCerta:** Kanban simples com Saved → Applied → Interview → Offer/Rejected; score de compatibilidade sempre explicado.
- **FalaPro:** foco em uma pergunta por tela, gravação/transcrição opcional, feedback curto e acionável.
- **MontaPC:** compatibilidade deve ser visual e explicável; orçamento e consumo elétrico sempre visíveis.
- **GameRadar:** wishlist primeiro; preço atual, menor preço e meta do usuário na mesma linha.
- **AgendaLeve:** calendário e horários disponíveis devem dominar a interface; cadastro de serviço precisa ser rápido.
- **Perto:** busca por categoria+cidade em uma única ação; confiança, avaliações e contato claramente visíveis.
- **PratoPronto:** orçamento semanal e número de pessoas antes do cardápio; lista de compras consolidada.
- **Revisa:** “continuar estudando” como CTA principal; métricas focadas em evolução, não em excesso de gráficos.
- **DocPronto:** formulário de orçamento em uma tela; visualização final sempre ao lado/no passo seguinte.

## QA mínimo obrigatório

1. Autenticação, sessão expirada e logout.
2. RLS: usuário A nunca lê/edita dados do usuário B.
3. Validação de campos, valores negativos e limites.
4. Mobile 320px–1440px.
5. Navegação por teclado e labels em formulários.
6. Estados loading/erro/vazio/sucesso.
7. Teste de URLs externas e links de afiliado.
8. Dados duplicados e concorrência.
9. Persistência após reload/login em outro dispositivo.
10. Lighthouse: performance, acessibilidade, SEO e boas práticas.

## SEO

Cada produto deve ter título/description exclusivos, canonical, Open Graph, sitemap, robots, schema.org apropriado e páginas indexáveis de conteúdo. Dashboards privados devem usar `noindex`. Para produtos locais (Perto) usar LocalBusiness/Service; para GameRadar usar Product/Offer; para conteúdos educacionais usar Course/Quiz quando aplicável.

## Critério CEO

Lançar primeiro produtos com: dor frequente, valor entendido em menos de 30 segundos, baixo custo operacional e receita recorrente. A ordem recomendada é **AgendaLeve → DocPronto → VagaCerta → MontaPC → PostPilot → Revisa → GameRadar → FalaPro → PratoPronto → Perto**.

O Perto fica por último apesar do potencial porque marketplace bilateral exige aquisição simultânea de clientes e profissionais, moderação, reputação e prevenção de fraude.
