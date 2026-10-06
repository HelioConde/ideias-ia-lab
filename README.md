# Riot Legacy

**Seu histórico de League of Legends e Teamfight Tactics como uma experiência visual, emocional e compartilhável.**

> Status: protótipo MVP navegável iniciado em 06/10/2026.

O Riot Legacy não quer ser outro tracker cheio de tabelas. A proposta é transformar um **Riot ID** em um "museu pessoal" da conta: campeão assinatura, trajetória, maestria, funções, retrospectiva de TFT, marcos e cards feitos para compartilhar.

## Estado atual

- landing page visual;
- entrada por Riot ID (`GameName#TagLine`);
- PT-BR como idioma principal e English como segundo idioma;
- preferência de idioma persistida;
- experiência demonstrativa de perfil LoL + TFT;
- abas Legado, League, TFT e Compartilhar;
- campeão assinatura;
- timeline de trajetória;
- resumo de funções e maestria;
- board/traits/colocações demonstrativas de TFT;
- card compartilhável e Web Share/clipboard;
- URL compartilhável por query string;
- slots de anúncios reservados, sem anúncios reais;
- SEO/Open Graph/manifest/robots/sitemap;
- Static QA e Browser E2E preparados;
- aviso de dados demonstrativos explícito.

## Importante: dados demonstrativos

O protótipo atual **não consulta a API da Riot**. O Riot ID digitado personaliza a apresentação, mas os números, campeão assinatura e dados de TFT são demonstrativos.

Isso é intencional: primeiro validamos a experiência visual e a proposta de valor. Dados reais entram no próximo estágio via backend seguro.

## Próximo estágio — dados Riot reais

A arquitetura planejada usa:

1. Riot ID (`gameName + tagLine`);
2. ACCOUNT-V1 para obter PUUID;
3. endpoints suportados de League/TFT por PUUID;
4. Edge Function/backend como proxy;
5. chave Riot **somente no servidor**, nunca no JavaScript público;
6. cache controlado para reduzir chamadas e respeitar rate limits.

A Riot recomenda Riot ID como referência player-facing e PUUID quando o endpoint oferece essa opção.

## Monetização

A regra do portfólio continua válida: **monetização principal por anúncios**.

Neste protótipo os espaços são apenas reservados estruturalmente. Anúncios reais só serão ativados depois de:

- produto registrado no Riot Developer Portal;
- status adequado para monetização;
- Publisher ID/slots aprovados;
- revisão de UX para impedir anúncios perto de controles críticos.

Consulte [ADS_SETUP.md](./ADS_SETUP.md).

## Idiomas

- **PT-BR**: principal, padrão e fallback.
- **EN**: segundo idioma obrigatório.
- Preferência persistida em `localStorage`.
- Conteúdo de interface é traduzido; Riot ID e dados do jogador nunca são traduzidos.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:4173`.

Testes:

```bash
npm run test:e2e
npm run check
```

## Estrutura

- `index.html` — interface principal;
- `style.css` — direção visual cinematográfica;
- `i18n.js` — PT-BR/EN;
- `app.js` — fluxo Riot ID, perfil demo, tabs e compartilhamento;
- `tests/` — Browser E2E;
- `FULLSTACK.md` — arquitetura e plano de backend;
- `MELHORIAS.md` — backlog priorizado;
- `ADS_SETUP.md` — preparação de monetização;
- `RIOT_API.md` — estratégia de integração Riot.

## Conformidade Riot

Antes de disponibilizar dados reais ao público, o produto deve ser registrado/auditado no Riot Developer Portal e acompanhar as políticas atuais.

Aviso resumido visível no produto: Riot Legacy é um projeto independente e não é endossado pela Riot Games. Marcas e propriedades relacionadas pertencem à Riot Games, Inc.

## Destino

Repositório planejado: `HelioConde/riot-legacy`.

Enquanto o conector não permite criar o repositório físico, esta branch standalone pode ser enviada como `main` para o destino sem carregar os arquivos do hub.
