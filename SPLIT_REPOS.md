# Separação dos repositórios

## Regra

`HelioConde/ideias-ia-lab` é somente organizador. Nenhum produto novo deve ser desenvolvido diretamente na `main`.

## Já separados

- `HelioConde/postpilot`
- `HelioConde/agendaleve`
- `HelioConde/docpronto`

## Repositórios a criar

1. `HelioConde/vagacerta`
2. `HelioConde/falapro`
3. `HelioConde/montapc`
4. `HelioConde/gameradar`
5. `HelioConde/perto`
6. `HelioConde/pratopronto`
7. `HelioConde/revisa`

## Fonte preservada

O snapshot completo anterior à limpeza está em:

`archive/pre-split-2026-10-06`

Commit de origem:

`689ed2d0961c13f15ceaf60ccb06403f965a9714`

## Procedimento de migração

Quando cada repositório for criado:

1. copiar apenas a pasta correspondente do snapshot;
2. mover as migrations específicas daquele produto para o novo repositório;
3. copiar uma configuração Supabase própria do produto;
4. ajustar canonical/OG URL para o novo GitHub Pages;
5. adicionar CI próprio;
6. habilitar GitHub Pages;
7. validar frontend + Supabase;
8. atualizar este hub de “pendente” para “separado”.

A branch de backup só deve ser removida depois que os sete destinos estiverem validados.
