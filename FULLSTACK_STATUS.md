# Status do portfólio

Atualizado em 2026-10-06.

## Estrutura atual

O `ideias-ia-lab` é somente hub de organização na branch `main`.

Nenhum frontend, backend, configuração Supabase ou migration de produto deve ser desenvolvido diretamente na `main`.

## Repositórios independentes ativos

- PostPilot — `HelioConde/postpilot`
- AgendaLeve — `HelioConde/agendaleve`
- DocPronto — `HelioConde/docpronto`

## Sete MVPs antigos — preparação concluída

Os projetos abaixo já foram convertidos para uma estrutura standalone, cada um em sua própria branch:

- VagaCerta — `split/vagacerta`
- FalaPro — `split/falapro`
- MontaPC — `split/montapc`
- GameRadar — `split/gameradar`
- Perto — `split/perto`
- PratoPronto — `split/pratopronto`
- Revisa — `split/revisa`

Cada branch possui:
- arquivos do produto na raiz;
- canonical para o futuro GitHub Pages;
- configuração pública própria do Supabase;
- README e documentação fullstack;
- Static QA próprio;
- migrations específicas que já existiam no Lab.

## Repositórios físicos ainda pendentes

- `HelioConde/vagacerta`
- `HelioConde/falapro`
- `HelioConde/montapc`
- `HelioConde/gameradar`
- `HelioConde/perto`
- `HelioConde/pratopronto`
- `HelioConde/revisa`

A integração GitHub disponível nesta sessão não expõe criação de repositórios. Portanto, a etapa de empacotamento foi concluída, mas a criação física dos sete destinos ainda depende dessa operação ficar disponível ou ser feita externamente.

## Backup

Snapshot integral anterior à separação:

`archive/pre-split-2026-10-06`

Commit:

`689ed2d0961c13f15ceaf60ccb06403f965a9714`

Não remover esse backup até os sete repositórios físicos estarem criados, publicados e testados.

## Backend

O banco compartilhado continua sendo `pizzaria-db`.

A separação de repositórios não exige dividir o banco. Cada produto acessa apenas suas tabelas e policies próprias.

## Próxima etapa operacional

Para cada branch `split/<produto>`:

1. criar `HelioConde/<produto>`;
2. importar a branch como `main`;
3. habilitar GitHub Pages;
4. confirmar CI;
5. validar login/Supabase;
6. validar o fluxo principal;
7. atualizar o hub para “repositório ativo”.
