# Ideias IA Lab

Este repositório é **somente o hub de organização** do portfólio.

O código de cada produto deve viver em um repositório GitHub próprio. A `main` não contém frontend, backend, migrations ou configuração Supabase dos produtos.

## Regra global de monetização

**Todos os produtos do Ideias IA Lab serão monetizados por anúncios.**

Esta é uma regra transversal do portfólio e deve ser considerada desde o MVP de cada produto:

- a experiência deve prever espaços de anúncio sem prejudicar o fluxo principal;
- anúncios não podem bloquear ações essenciais, formulários, leitura, gameplay analysis ou navegação;
- mobile e desktop devem reservar áreas adequadas para anúncios sem causar layout shift relevante;
- páginas públicas, conteúdo indexável e fluxos de retorno devem ser pensados também para retenção e inventário publicitário;
- consentimento, privacidade, políticas da plataforma de anúncios e requisitos legais devem ser respeitados;
- o produto nunca deve inventar cliques, visualizações ou usar padrões enganosos para aumentar receita;
- assinatura, afiliados, créditos, recursos premium ou outras receitas podem existir futuramente, mas serão **complementares** à monetização por anúncios;
- nenhum produto deve remover a preparação para anúncios apenas porque outro modelo de receita também faça sentido.

A implementação de anúncios reais só deve ser ativada quando o produto e a rede escolhida estiverem prontos para isso. Antes disso, o layout pode usar slots/reservas estruturais sem anúncios falsos.

## Regra global de idiomas

**Todos os produtos do Ideias IA Lab terão suporte a Português do Brasil (PT-BR) e Inglês (EN).**

O **PT-BR é o idioma principal e padrão** de todo o portfólio. O inglês é o idioma secundário obrigatório.

Regras:

- primeira experiência e fallback padrão em **PT-BR**;
- todo produto deve oferecer seletor claro entre **PT-BR** e **English**;
- a escolha de idioma deve ser persistida quando tecnicamente possível;
- fluxos principais, navegação, formulários, mensagens de erro/sucesso, estados vazios/loading e páginas essenciais devem existir nos dois idiomas;
- datas, números, moedas e formatos devem respeitar o locale ativo;
- novos recursos não devem ser considerados concluídos se a interface pública ficar disponível apenas em um dos dois idiomas;
- em páginas indexáveis, title, description, Open Graph e conteúdo SEO devem ter versões localizadas quando aplicável;
- quando houver URLs específicas por idioma, usar uma estrutura consistente e metadados `hreflang`;
- **PT-BR continua sendo a fonte principal de conteúdo e a experiência padrão**, mesmo quando o navegador do usuário estiver em outro idioma.

## Ordem oficial de desenvolvimento

A fila agora é organizada por **prioridade real**, considerando proximidade de lançamento, monetização, diferencial e risco técnico.

| # | Projeto | Área | Prioridade | Status |
|---:|---|---|---|---|
| 1 | **AgendaLeve** | SaaS | P0 | [MVP técnico concluído · validação pós-MVP](https://github.com/HelioConde/agendaleve/issues/1) |
| 2 | **DocPronto** | SaaS | P0 | [MVP técnico concluído · validação pós-MVP](https://github.com/HelioConde/docpronto/issues/1) |
| 3 | **Riot Legacy** | LoL + TFT | P0 | [MVP técnico concluído · validação/compliance](https://github.com/HelioConde/riot-legacy/issues/1) |
| 4 | **VagaCerta** | Carreira | P0 | [4 diferenciais implementados · validação de infraestrutura/QA](https://github.com/HelioConde/vagacerta/issues/1) |
| 5 | **LoL Match Story** | LoL | P0 | [MVP 1.0 concluído · validação](https://github.com/HelioConde/lol-match-story/issues/1) |
| 6 | **TFT Wrapped** | TFT | P0 | [Núcleo real implementado · gate final de QA/Pages](https://github.com/HelioConde/tft-personal-wrapped/issues/1) |
| 7 | **PostPilot** | Criadores | P1 | [Gate final de provedores/homologação](https://github.com/HelioConde/postpilot/issues/8) |
| 8 | **MontaPC** | Hardware | P1 | [Núcleo técnico implementado · validação/RLS/CI](https://github.com/HelioConde/montapc/issues/1) |
| 9 | **LoL Champion Journey** | LoL | P1 | [Gate final de snapshots server-side](https://github.com/HelioConde/lol-champion-journey/issues/4) |
| 10 | **TFT Board Museum** | TFT | P1 | [MVP concluído · validação pós-MVP](https://github.com/HelioConde/tft-board-museum/issues/1) |

➡️ **[Ver a fila completa com 41 projetos e justificativas](./PRIORIDADES_DESENVOLVIMENTO.md)**

### Documentos de execução

- **[Painel de execução](./PAINEL_EXECUCAO.md)** — foco atual, próximos blocos e critérios para avançar.
- **[Plano mestre fullstack](./PLANO_MESTRE_FULLSTACK.md)** — pipeline, lotes, Definition of Done e regra de WIP para os 41 produtos.
- **[Roadmap gamer](./ROADMAP_GAMES.md)** — ordem específica de LoL, TFT e Overwatch.
- **[Revisão executiva](./PORTFOLIO_REVIEW.md)** — visão de produto, UX/UI, QA, SEO e negócio.
- **[Status fullstack](./FULLSTACK_STATUS.md)** — estado físico dos repositórios e separações.

## Foco atual do portfólio

A partir de 07/10/2026, a execução usa a **fila de fechamento** registrada em [PAINEL_EXECUCAO.md](./PAINEL_EXECUCAO.md).

Já saíram da implementação pesada:

- AgendaLeve;
- DocPronto;
- LoL Match Story;
- TFT Board Museum;
- Riot Legacy;
- VagaCerta — quatro diferenciais implementados; saiu da expansão de escopo e entrou em validação.

Gates curtos ainda abertos:

- PostPilot — provedores reais + homologação;
- LoL Champion Journey — deploy/ativação dos snapshots no Supabase gamer;
- TFT Wrapped — confirmar Pages/Actions e validação real; smoke test de produção com Riot ID já foi adicionado.
- VagaCerta — aplicar migration no `pizzaria-db`, validar RLS entre duas contas e confirmar QA/Pages.

**TFT Item Lab, OW Map Master e FalaPro:** MVPs funcionais implementados e em validação. **Próximo desenvolvimento pesado:** TFT Placement DNA. VagaCerta e MontaPC seguem congelados nos gates externos.

A regra agora é simples: projeto que cumpre o gate técnico entra em validação/manutenção. Não continuar adicionando melhorias visuais sem evidência real.

## Destaque estratégico — Riot Legacy

O **Riot Legacy** será a experiência visual e nostálgica do portfólio gamer.

O usuário informa o Riot ID e recebe uma página bonita sobre sua trajetória em **League of Legends e TFT**, com maestria, personagens/unidades favoritas, melhores momentos, evolução, identidade de jogo, retrospectivas e cards compartilháveis.

A meta não é criar apenas outro tracker: é criar uma página em que o jogador queira permanecer para **rever sua história e o esforço acumulado ao longo dos anos**.

Repositório oficial: [HelioConde/riot-legacy](https://github.com/HelioConde/riot-legacy). O MVP técnico já está fechado; validação/compliance estão centralizados na issue #1.

## Repositórios do portfólio geral

| Produto | Repositório/status |
|---|---|
| AgendaLeve | [MVP técnico concluído](https://github.com/HelioConde/agendaleve) · [validação pós-MVP](https://github.com/HelioConde/agendaleve/issues/1) |
| DocPronto | [MVP técnico concluído](https://github.com/HelioConde/docpronto) · [validação pós-MVP](https://github.com/HelioConde/docpronto/issues/1) |
| PostPilot | [gate final de provedores/homologação](https://github.com/HelioConde/postpilot/issues/8) |
| TFT Wrapped | [núcleo real implementado · gate final](https://github.com/HelioConde/tft-personal-wrapped/issues/1) |
| VagaCerta | [4 diferenciais implementados · validação de infraestrutura/QA](https://github.com/HelioConde/vagacerta/issues/1) |
| MontaPC | [núcleo técnico implementado · validação](https://github.com/HelioConde/montapc/issues/1) |
| Revisa | [MVP funcional · Browser E2E/live-update · validação/Pages](https://github.com/HelioConde/revisa) |
| GameRadar | [repositório ativo · MVP funcional em validação](https://github.com/HelioConde/gameradar) |
| FalaPro | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/falapro) · `HelioConde/falapro` ainda será criado |
| PratoPronto | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/pratopronto) · `HelioConde/pratopronto` ainda será criado |
| Perto | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/perto) · `HelioConde/perto` ainda será criado |

As novas ideias de LoL, TFT e Overwatch estão organizadas na fila oficial e devem receber repositórios independentes quando entrarem em desenvolvimento.

## Produto gamer standalone fechado tecnicamente

- **Riot Legacy** — [repositório oficial](https://github.com/HelioConde/riot-legacy)
  - LoL + TFT reais;
  - snapshots server-side;
  - comparações históricas/mensais;
  - compartilhamento e PNG;
  - QA e snapshots visuais;
  - validação multi-conta + Riot Developer Portal ainda externos;
  - novas features históricas ficam para V2.

## Branches standalone preparadas

As branches `split/*` abaixo foram usadas como etapa histórica de separação. **Elas não são mais fonte de status** quando já existe repositório físico; o repositório próprio sempre prevalece:

- `split/vagacerta`
- `split/falapro`
- `split/montapc`
- `split/gameradar`
- `split/perto`
- `split/pratopronto`
- `split/revisa`

VagaCerta, MontaPC e Revisa já possuem repositórios físicos. Para os demais, confirmar a existência atual antes de executar automações de criação.

## Automação para todas as 41 ideias

O hub agora possui `scripts/create-all-idea-repos.ps1`, que representa **toda a fila oficial de 41 projetos**.

A automação trata cada projeto de acordo com o estado atual:

- **3 repositórios já ativos**: preserva `agendaleve`, `docpronto` e `postpilot`;
- **7 MVPs com código pronto**: cria o repositório e envia a branch `split/*` como `main`;
- **31 ideias novas**: cria um repositório próprio com README inicial contendo área, prioridade, posição na fila, objetivo de MVP e regra de organização.

Execução no Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\\scripts\\create-all-idea-repos.ps1
```

Por padrão os repositórios novos são públicos. Use `-Private` para criá-los privados.

O script nunca sobrescreve uma `main` existente sem `-Force`.

## Criação automatizada dos sete repositórios

No Windows, o hub inclui `scripts/create-split-repos.ps1`.

Pré-requisitos:
- Git;
- GitHub CLI (`gh`);
- `gh auth login` concluído.

A partir de um clone deste hub:

```powershell
powershell -ExecutionPolicy Bypass -File .\\scripts\\create-split-repos.ps1
```

O script:
1. cria os sete repositórios públicos que ainda não existirem;
2. envia cada `split/<produto>` como `main`;
3. define `main` como branch padrão;
4. configura descrição/homepage;
5. tenta habilitar GitHub Pages na raiz.

Por segurança, se um destino já possuir uma `main`, ele é ignorado. Use `-Force` somente quando quiser substituir conscientemente essa branch.

## Backup de segurança

Antes de limpar a `main`, o estado completo dos protótipos e migrations foi preservado em:

`archive/pre-split-2026-10-06`

Essa branch deve permanecer intacta até os sete repositórios antigos pendentes estarem criados e validados.

## Função deste hub

- manter a ordem oficial de desenvolvimento;
- registrar ideias novas sem misturar código de produto;
- acompanhar status de separação;
- centralizar decisões de portfólio;
- apontar para cada repositório independente;
- manter documentação transversal de produto, UX/UI, QA e negócio.

## Regra

**Não desenvolver funcionalidades de produto diretamente neste repositório.**

Toda nova ideia deve receber um nome de repositório assim que entrar na fila oficial. O Lab mantém apenas ranking, links, decisões e automações de criação.

Quando uma ideia for promovida para desenvolvimento, ela deve ganhar um repositório próprio e permanecer aqui apenas como item de roadmap.


## Regra obrigatória de atualização automática

Toda página web do portfólio deve implementar o padrão descrito em `GLOBAL_PROJECT_RULES.md`:

- `version.json` com SHA do deploy;
- `live-update.js` em todo HTML;
- verificação a cada 12 segundos;
- nova verificação ao focar/reabrir a aba;
- aviso de nova versão;
- recarga automática com cache-busting;
- desativado em localhost;
- falha de verificação nunca derruba a página.

Para aplicar/reaplicar a regra em todos os repositórios existentes:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-live-update-all.ps1
```

O script percorre os 41 repositórios, ignora os que ainda não existem ou não têm HTML e injeta o mecanismo em todas as páginas encontradas.
