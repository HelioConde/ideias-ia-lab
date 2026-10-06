# Separação dos repositórios

## Regra

`HelioConde/ideias-ia-lab` é somente organizador. Nenhum produto deve voltar a ser desenvolvido diretamente na `main`.

## Já separados

- `HelioConde/postpilot`
- `HelioConde/agendaleve`
- `HelioConde/docpronto`

## Sete repositórios físicos ainda a criar

1. `HelioConde/vagacerta`
2. `HelioConde/falapro`
3. `HelioConde/montapc`
4. `HelioConde/gameradar`
5. `HelioConde/perto`
6. `HelioConde/pratopronto`
7. `HelioConde/revisa`

## Branches standalone prontas

Cada branch abaixo já possui o produto na raiz, sem depender das antigas pastas numeradas:

- [`split/vagacerta`](https://github.com/HelioConde/ideias-ia-lab/tree/split/vagacerta)
- [`split/falapro`](https://github.com/HelioConde/ideias-ia-lab/tree/split/falapro)
- [`split/montapc`](https://github.com/HelioConde/ideias-ia-lab/tree/split/montapc)
- [`split/gameradar`](https://github.com/HelioConde/ideias-ia-lab/tree/split/gameradar)
- [`split/perto`](https://github.com/HelioConde/ideias-ia-lab/tree/split/perto)
- [`split/pratopronto`](https://github.com/HelioConde/ideias-ia-lab/tree/split/pratopronto)
- [`split/revisa`](https://github.com/HelioConde/ideias-ia-lab/tree/split/revisa)

As branches já incluem:
- `index.html`, `style.css` e `app.js` na raiz;
- `supabase-config.js` próprio;
- canonical/OG URL apontando para o futuro repositório;
- `README.md` e `FULLSTACK.md`;
- CI próprio em `.github/workflows/static-qa.yml`;
- migrations específicas quando já estavam versionadas no Lab.

## Fonte preservada

Snapshot completo anterior à limpeza:

`archive/pre-split-2026-10-06`

Commit de origem:

`689ed2d0961c13f15ceaf60ccb06403f965a9714`

## Migração final

Para cada produto falta somente:

1. criar o repositório `HelioConde/<nome>`;
2. importar a árvore da branch `split/<nome>` como `main`;
3. habilitar GitHub Pages;
4. confirmar Static QA;
5. testar login/Supabase e fluxo principal;
6. trocar o status no hub para “repositório ativo”.

A branch de backup deve permanecer até os sete destinos físicos estarem validados.
