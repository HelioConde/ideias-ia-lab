# Arquitetura fullstack — Riot Legacy

## Objetivo do MVP

Validar se jogadores querem **rever e compartilhar a própria história** de LoL + TFT em uma experiência visual, em vez de usar somente um tracker analítico.

## Fase atual — experiência primeiro

O frontend usa um perfil demonstrativo após a entrada de Riot ID. O modo demo é sempre identificado na interface.

Nenhuma API key está no frontend e nenhum dado demonstrativo é apresentado como real.

## Fluxo futuro com dados reais

```text
Riot ID
  ↓
Edge Function / API própria
  ↓
ACCOUNT-V1: Riot ID → PUUID
  ↓
League / TFT APIs suportadas
  ↓
normalização + cache
  ↓
payload Riot Legacy
  ↓
experiência visual no navegador
```

### Identificação

Entrada:
- `gameName`
- `tagLine`
- cluster de roteamento quando necessário.

Primeira resolução:
- ACCOUNT-V1 `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`;
- armazenar/usar PUUID como identificador técnico.

### League of Legends

Fontes candidatas:
- `summoner-v4` por PUUID;
- `champion-mastery-v4`;
- `league-v4`;
- `match-v5`;
- `lol-challenges-v1`.

O produto não criará MMR/ELO alternativo.

### Teamfight Tactics

Fontes candidatas:
- `tft-match-v1`;
- `tft-league-v1`;
- endpoints suportados no Developer Portal no momento da implementação.

## Backend

Não usar `pizzaria-db`.

Riot Legacy pertence à infraestrutura gamer. O backend deve ficar separado da linha SaaS geral e pode reaproveitar infraestrutura gamer já existente quando isso for explicitamente decidido.

Regras:
- Riot API key apenas em secret server-side;
- uma Production API key por produto;
- nenhuma chave em `app.js`, HTML, GitHub Pages ou localStorage;
- rate limiting no backend;
- cache por endpoint/PUUID;
- timeouts e fallback de erro;
- payload mínimo para o frontend;
- logs sem API key ou PII desnecessária.

## Modelo de dados sugerido

Para o primeiro backend persistente:

- `riot_legacy_profiles`
  - `puuid_hash`
  - Riot ID normalizado
  - região/cluster
  - timestamps de cache

- `riot_legacy_snapshots`
  - resumo LoL
  - resumo TFT
  - versão do schema
  - timestamp de coleta

Evitar armazenar histórico bruto quando um resumo derivado atender o produto.

## Frontend

Stack inicial deliberadamente simples:
- HTML;
- CSS;
- JavaScript;
- GitHub Pages.

Razão: validar conceito, narrativa e retenção antes de introduzir framework.

Migrar para framework apenas se rotas, geração de cards ou componentes passarem a justificar.

## i18n

- PT-BR padrão/fallback;
- EN obrigatório;
- preferência persistida;
- metadados localizados;
- textos dinâmicos localizados;
- conteúdo do jogador não é traduzido.

## Anúncios

Slots são reservados fora das ações principais.

Não ativar rede real até:
- produto Riot registrado;
- monetização permitida pelo status do produto;
- Publisher/slots aprovados;
- consentimento/privacidade implementados quando necessário.

## QA

Gate mínimo:
- Riot ID válido/inválido;
- PT → EN → reload → EN;
- deep link por query string;
- tabs;
- compartilhamento/cópia;
- mobile sem overflow;
- modo demo claramente visível;
- nenhum secret no bundle;
- aviso independente/Riot visível.

## Deploy

Destino planejado:
`https://helioconde.github.io/riot-legacy/`

A branch atual é standalone e será promovida para a `main` do repositório físico.
