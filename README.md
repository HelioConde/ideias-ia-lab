# Ideias IA Lab

Este repositório é **somente o hub de organização** do portfólio.

O código de cada produto deve viver em um repositório GitHub próprio. A `main` não contém frontend, backend, migrations ou configuração Supabase dos produtos.

## Ordem oficial de desenvolvimento

A fila agora é organizada por **prioridade real**, considerando proximidade de lançamento, monetização, diferencial e risco técnico.

| # | Projeto | Área | Prioridade | Status |
|---:|---|---|---|---|
| 1 | **AgendaLeve** | SaaS | P0 | [Repositório ativo](https://github.com/HelioConde/agendaleve) |
| 2 | **DocPronto** | SaaS | P0 | [Repositório ativo](https://github.com/HelioConde/docpronto) |
| 3 | **Riot Legacy** | LoL + TFT | P0 | Repositório pendente |
| 4 | **VagaCerta** | Carreira | P0 | Repositório pendente |
| 5 | **LoL Match Story** | LoL | P0 | Repositório pendente |
| 6 | **TFT Wrapped** | TFT | P0 | Repositório pendente |
| 7 | **PostPilot** | Criadores | P1 | [Repositório ativo](https://github.com/HelioConde/postpilot) |
| 8 | **MontaPC** | Hardware | P1 | Repositório pendente |
| 9 | **LoL Champion Journey** | LoL | P1 | Repositório pendente |
| 10 | **TFT Board Museum** | TFT | P1 | Repositório pendente |

➡️ **[Ver a fila completa com 41 projetos e justificativas](./PRIORIDADES_DESENVOLVIMENTO.md)**

## Destaque estratégico — Riot Legacy

O **Riot Legacy** será a experiência visual e nostálgica do portfólio gamer.

O usuário informa o Riot ID e recebe uma página bonita sobre sua trajetória em **League of Legends e TFT**, com maestria, personagens/unidades favoritas, melhores momentos, evolução, identidade de jogo, retrospectivas e cards compartilháveis.

A meta não é criar apenas outro tracker: é criar uma página em que o jogador queira permanecer para **rever sua história e o esforço acumulado ao longo dos anos**.

Destino planejado: `HelioConde/riot-legacy`.

## Repositórios do portfólio geral

| Produto | Repositório/status |
|---|---|
| AgendaLeve | https://github.com/HelioConde/agendaleve |
| DocPronto | https://github.com/HelioConde/docpronto |
| PostPilot | https://github.com/HelioConde/postpilot |
| VagaCerta | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/vagacerta) · `HelioConde/vagacerta` ainda será criado |
| MontaPC | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/montapc) · `HelioConde/montapc` ainda será criado |
| Revisa | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/revisa) · `HelioConde/revisa` ainda será criado |
| GameRadar | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/gameradar) · `HelioConde/gameradar` ainda será criado |
| FalaPro | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/falapro) · `HelioConde/falapro` ainda será criado |
| PratoPronto | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/pratopronto) · `HelioConde/pratopronto` ainda será criado |
| Perto | [branch standalone pronta](https://github.com/HelioConde/ideias-ia-lab/tree/split/perto) · `HelioConde/perto` ainda será criado |

As novas ideias de LoL, TFT e Overwatch estão organizadas na fila oficial e devem receber repositórios independentes quando entrarem em desenvolvimento.

## Branches standalone preparadas

Os sete MVPs antigos já possuem uma branch com o projeto na raiz, canonical do futuro GitHub Pages, configuração Supabase própria e CI próprio:

- `split/vagacerta`
- `split/falapro`
- `split/montapc`
- `split/gameradar`
- `split/perto`
- `split/pratopronto`
- `split/revisa`

A etapa pendente é somente criar cada repositório físico e importar a branch correspondente.

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

Quando uma ideia for promovida para desenvolvimento, ela deve ganhar um repositório próprio e permanecer aqui apenas como item de roadmap.
