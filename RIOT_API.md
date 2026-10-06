# Estratégia de integração Riot

Revisado em 06/10/2026 com base no Riot Developer Portal.

## Identidade

A interface deve pedir **Riot ID**:
- Game Name;
- Tag Line.

Não construir busca principal baseada em Summoner Name legado.

O primeiro passo do backend será ACCOUNT-V1 para resolver Riot ID em PUUID.

## PUUID

Quando os endpoints suportarem PUUID, preferir PUUID como identificador técnico.

## Endpoints candidatos

### Conta
- ACCOUNT-V1

### League of Legends
- SUMMONER-V4
- CHAMPION-MASTERY-V4
- LEAGUE-V4
- MATCH-V5
- LOL-CHALLENGES-V1

### TFT
- TFT-MATCH-V1
- TFT-LEAGUE-V1
- demais endpoints suportados e necessários quando a integração for implementada.

## Segurança

- API key nunca no navegador.
- Backend/Edge Function faz chamadas à Riot.
- HTTPS obrigatório.
- Production key própria para Riot Legacy.
- Rate limiting + cache.
- Não registrar a API key em logs.

## Produto

Riot Legacy não criará:
- MMR/ELO alternativo;
- vantagem em tempo real;
- recomendações que removam decisões do jogo;
- de-anonimização de jogadores.

O foco é histórico, identidade, retrospectiva e compartilhamento pós-jogo.

## Registro

Antes do uso público de dados reais, registrar o produto no Riot Developer Portal e manter descrição/features atualizadas conforme as políticas vigentes.
