<div align="center">
  <h1>💡 Ideias IA Lab</h1>
  <p><strong>O hub que organiza ideias, produtos web, games e experimentos do meu portfólio.</strong></p>
  <p>Prioridades, regras de projeto, histórico e links para cada repositório independente.</p>
  <p><img alt="Status" src="https://img.shields.io/badge/status-hub%20de%20documenta%C3%A7%C3%A3o-64748b"></p>
  <p><a href="PAINEL_EXECUCAO.md"><strong>Painel de execução</strong></a> · <a href="PRIORIDADES_DESENVOLVIMENTO.md"><strong>Prioridades</strong></a> · <a href="REPOSITORIES.md"><strong>Repositórios</strong></a> · <a href="GLOBAL_PROJECT_RULES.md"><strong>Regras globais</strong></a></p>
</div>

## Por que existe este repositório?

O **Ideias IA Lab** concentra as decisões transversais dos produtos: **o que desenvolver primeiro, como organizar as entregas, o que ainda falta validar e quais padrões não podem ser perdidos**.

Este repositório contém documentação, um catálogo web e scripts auxiliares de organização. **Não é o código-fonte centralizado de todos os aplicativos.** Cada produto ativo tem seu repositório próprio.

## Navegue pelos projetos

| Projeto | O que explora | Repositório |
| --- | --- | --- |
| **AgendaLeve** | Reservas e horários de pequenos negócios | [Abrir](https://github.com/HelioConde/agendaleve) |
| **DocPronto** | Propostas, orçamentos e PDFs | [Abrir](https://github.com/HelioConde/docpronto) |
| **VagaCerta** | Organização da busca por emprego | [Abrir](https://github.com/HelioConde/vagacerta) |
| **FalaPro** | Simulações e revisão de entrevistas | [Abrir](https://github.com/HelioConde/falapro) |
| **Revisa** | Flashcards e revisão ativa | [Abrir](https://github.com/HelioConde/revisa) |
| **PostPilot** | Planejamento e produção de conteúdo | [Abrir](https://github.com/HelioConde/postpilot) |
| **MontaPC** | Configurações de PC e compatibilidade | [Abrir](https://github.com/HelioConde/montapc) |
| **Perto** | Busca e cadastro moderado de profissionais | [Abrir](https://github.com/HelioConde/perto) |
| **GameRadar** | Ofertas, favoritos e preços-alvo | [Abrir](https://github.com/HelioConde/gameradar) |
| **Riot Legacy** | Retrospectivas de LoL e TFT | [Abrir](https://github.com/HelioConde/riot-legacy) |

Os projetos têm **estágios diferentes**: beta, MVP experimental, lançamento condicionado a integrações externas ou apenas planejamento. Consulte cada README para ver o que está realmente implementado.

### Ferramentas de jogos independentes

**LoL:** [Champion Journey](https://github.com/HelioConde/lol-champion-journey) · [Champion Pool](https://github.com/HelioConde/lol-champion-pool) · [Match Story](https://github.com/HelioConde/lol-match-story) · [Session Insights](https://github.com/HelioConde/lol-session-insights).

**TFT:** [Personal Wrapped](https://github.com/HelioConde/tft-personal-wrapped) · [Board Museum](https://github.com/HelioConde/tft-board-museum) · [Item Lab](https://github.com/HelioConde/tft-item-lab) · [Placement DNA](https://github.com/HelioConde/tft-placement-dna).

**Overwatch:** [Map Master](https://github.com/HelioConde/ow-map-master) · [VOD Timeline](https://github.com/HelioConde/ow-vod-timeline) · [Hero Pool Builder](https://github.com/HelioConde/ow-hero-pool-builder).

Essas iniciativas são independentes de Riot Games e Blizzard Entertainment.

## Documentação de gestão

| Documento | Finalidade |
| --- | --- |
| [**Prioridades**](PRIORIDADES_DESENVOLVIMENTO.md) | Sequência e critérios para decidir o que desenvolver |
| [**Painel de execução**](PAINEL_EXECUCAO.md) | Visão dos marcos e tarefas |
| [**Repositórios**](REPOSITORIES.md) | Inventário e organização |
| [**Plano mestre full-stack**](PLANO_MESTRE_FULLSTACK.md) | Arquitetura e estratégia por etapas |
| [**Status full-stack**](FULLSTACK_STATUS.md) | Integrações e dependências técnicas |
| [**Revisão do portfólio**](PORTFOLIO_REVIEW.md) | Análise de projetos |
| [**Regras globais**](GLOBAL_PROJECT_RULES.md) | Idiomas, UI, atualização e requisitos comuns |
| [**Rodada das dez ideias**](RODADA_10_IDEIAS_20261012.md) | Registro histórico de entregas e dependências |
| [**Histórico do README**](docs/README_HISTORY_2026-10-25.md) | Detalhes anteriores da fila, branches e scripts |

## Diretrizes para novos produtos

1. **Repositório separado por produto:** o hub não recebe código de produção de outros aplicativos.
2. **Primeiro o fluxo principal:** priorizar um MVP útil antes de acrescentar módulos.
3. **PT-BR como padrão**, inglês como idioma adicional nos produtos em que a regra se aplica.
4. **Acessibilidade e mobile:** layout adaptável, feedback de interação e estados vazios reais.
5. **Segurança e privacidade:** segredos fora do frontend e políticas de acesso no backend.
6. **Anúncios como possibilidade de monetização:** prever espaços sem bloquear o usuário; só ativar após cumprir políticas, consentimento e requisitos legais.
7. **Status verificável:** não confundir script criado, teste planejado ou documentação com funcionalidades concluídas.

As políticas completas continuam em [GLOBAL_PROJECT_RULES.md](GLOBAL_PROJECT_RULES.md).

## Automação e scripts

O diretório `scripts/` contém ferramentas históricas para organizar repositórios, aplicar atualizações e padronizar páginas. **Antes de executar qualquer script**, leia os argumentos, verifique a lista de destinos e gere backups. Algumas rotinas podem criar repositórios ou modificar arquivos existentes.

As instruções históricas permanecem em [README_HISTORY](docs/README_HISTORY_2026-10-25.md); **não execute scripts antigos apenas porque ainda estão documentados**. Confirme os repositórios que já existem.

## Estado do hub

**Documentação e organização do portfólio.** O progresso de um produto deve ser verificado **em seu próprio repositório** e em testes/publicações atuais — não apenas em registros antigos de roadmap.

Mantido por [Hélio Conde](https://github.com/HelioConde).
