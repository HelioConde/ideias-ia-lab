# Portfólio SaaS — avaliação de produto, UX/UI, QA, SEO e negócio

Atualizado em 2026-10-06.

## Arquitetura compartilhada

Os produtos gerais do laboratório usam o projeto Supabase `pizzaria-db` como backend compartilhado, com tabelas prefixadas por produto, autenticação via `auth.users`, RLS por proprietário e leitura anônima apenas para catálogos públicos. A publishable key pode ser usada no frontend; chaves secretas/service role nunca devem ser expostas.

Os projetos de jogos devem permanecer separados da linha SaaS geral e reutilizar a infraestrutura gamer definida para esse ecossistema quando aplicável.

## Priorização executiva

A **fonte oficial da ordem de desenvolvimento** agora é:

➡️ [PRIORIDADES_DESENVOLVIMENTO.md](./PRIORIDADES_DESENVOLVIMENTO.md)

O ranking unifica os produtos SaaS e as novas ideias de LoL, TFT e Overwatch.

### Top 10 atual

| # | Produto | Área | Prioridade | Por quê |
|---:|---|---|---|---|
| 1 | AgendaLeve | SaaS | P0 | Produto já separado + receita recorrente B2B |
| 2 | DocPronto | SaaS | P0 | MVP rápido + monetização clara |
| 3 | Riot Legacy | LoL + TFT | P0 | Diferencial emocional, visual e compartilhável |
| 4 | VagaCerta | Carreira | P0 | Dor frequente + freemium viável |
| 5 | LoL Match Story | LoL | P0 | Conteúdo visual e compartilhável |
| 6 | TFT Wrapped | TFT | P0 | Retrospectiva recorrente e viralizável |
| 7 | PostPilot | Criadores | P1 | Produto já separado + assinatura/créditos |
| 8 | MontaPC | Hardware | P1 | Intenção de compra + afiliados |
| 9 | LoL Champion Journey | LoL | P1 | Nostalgia, maestria e identidade |
| 10 | TFT Board Museum | TFT | P1 | Visual, simples e compartilhável |

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
- **Riot Legacy:** a página precisa parecer uma homenagem à trajetória do jogador, não um dashboard frio; arte, maestria, favoritos, marcos e retrospectivas devem dominar a experiência.

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

Projetos de jogos com perfis públicos devem priorizar páginas compartilháveis, metadados Open Graph e URLs estáveis sem expor dados privados.

## Critério CEO

Desenvolver primeiro produtos que combinem:

- caminho curto até um MVP publicável;
- valor percebido em poucos segundos;
- potencial de retorno recorrente ou compartilhamento orgânico;
- diferenciação suficiente para justificar um produto independente;
- baixo risco de bloqueio técnico.

A sequência completa não deve ser duplicada neste arquivo para evitar divergência futura. A referência única é [PRIORIDADES_DESENVOLVIMENTO.md](./PRIORIDADES_DESENVOLVIMENTO.md).
